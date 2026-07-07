'use strict'
// Tiêu-chí chấp-nhận SPEC docs/design/giam-sat-tuan-thu (giám-sát tuân thủ PHA 0→4).
// Neo claim LG-COMP-* (C3 test-phủ). Đợt A: engine PURE + YAML, chưa đổi hành-vi luồng.
const { test } = require('./harness')
const C = require('../lib/compliance')

// ── classifyExec: đúng loại thực-thi theo thứ-tự ưu-tiên ──────────────────────
test('LG-COMP classifyExec — HUMAN/TOOL/SOP/DELIVERABLE', ['LG-COMP-01'], t => {
  t.eq(C.classifyExec('Deploy landing lên Vercel').loai_exec, 'TOOL_EXEC')
  t.eq(C.classifyExec('CEO KYC PayOS lấy token').loai_exec, 'HUMAN_HANDOFF')
  t.eq(C.classifyExec('Viết checklist cổng bản-quyền').loai_exec, 'SOP_SUPPORT')
  t.eq(C.classifyExec('Soạn Privacy Policy + consent').loai_exec, 'DELIVERABLE')
  t.eq(C.classifyExec('Kiểm-thử 1 giao-dịch thử').loai_exec, 'TOOL_EXEC')
  // ưu-tiên khai tường-minh
  t.eq(C.classifyExec({ hanh_dong: 'bất-kỳ', loai_exec: 'HUMAN_HANDOFF' }).loai_exec, 'HUMAN_HANDOFF')
})

// ── classifyEvidence: nhận đúng kind ─────────────────────────────────────────
test('LG-COMP classifyEvidence — FILE/URL/IMAGE/TXN/PROSE/NONE', ['LG-COMP-02'], t => {
  t.eq(C.classifyEvidence('03-Outputs/gd1-validate/kit/04-x.md').kind, 'FILE')
  t.eq(C.classifyEvidence('https://donthat.vercel.app').kind, 'URL')
  t.eq(C.classifyEvidence('ảnh _co4.png').kind, 'IMAGE')
  t.eq(C.classifyEvidence('chuyển-khoản thành-công, tải OK').kind, 'TXN')
  t.eq(C.classifyEvidence('giao thử (mô-phỏng), chưa giao thật').kind, 'PROSE')
  t.eq(C.classifyEvidence('—').kind, 'NONE')
  t.eq(C.classifyEvidence('').kind, 'NONE')
})

// ── verdictEvidence: bắt F1 (mô-tả) và F2 (resolve fail) ──────────────────────
test('LG-COMP verdictEvidence — F1/F2/ok', ['LG-COMP-03'], t => {
  t.eq(C.verdictEvidence('TOOL_EXEC', 'PROSE', null).ma_loi, 'F1')
  t.eq(C.verdictEvidence('TOOL_EXEC', 'FILE', false).ma_loi, 'F2')
  t.ok(C.verdictEvidence('TOOL_EXEC', 'FILE', true).ok)
  t.ok(C.verdictEvidence('HUMAN_HANDOFF', 'NONE', null).ok)
  t.ok(C.verdictEvidence('DELIVERABLE', 'FILE', true, '9.2a-privacy-policy.md').ok)
  // FILE nhưng là doc mô-phỏng → F1 dù resolve ok
  t.eq(C.verdictEvidence('TOOL_EXEC', 'FILE', true, '1.3b-giao-thu-mo-phong.md').ma_loi, 'F1')
  t.eq(C.verdictEvidence('DELIVERABLE', 'FILE', true, '1.3b-giao-thu-mo-phong.md').ma_loi, 'F1')
})

// ── GOLDEN RETRO: bắt đúng lỗi đã xảy ra ở vault san-pham-so ─────────────────
test('LG-COMP golden — validateRunStateStrict bắt F1 của bước 1.3b (giao-thử mô-phỏng)', ['LG-COMP-04'], t => {
  const rows = [
    { id: '1.3b', hanh_dong: 'Giao thử 1 đơn mẫu (mô-phỏng)', trang_thai: 'DONE',
      bang_chung: '`03-Outputs/gd1-validate/1.3b-giao-thu-mo-phong.md`' },
    { id: '4.1a', hanh_dong: 'Dựng landing bán hero', trang_thai: 'DONE',
      bang_chung: '`03-Outputs/gd1-validate/4.1a-landing-hero.html`' },
    { id: '9.2a', hanh_dong: 'Soạn Privacy Policy', trang_thai: 'DONE',
      bang_chung: '`03-Outputs/gd1-validate/9.2a-privacy-policy.md`' },
  ]
  const r = C.validateRunStateStrict(rows, {})
  t.ok(!r.ok, 'phải có lỗi')
  t.ok(r.errors.some(e => e.startsWith('F1 1.3b')), 'bắt F1 ở 1.3b: ' + JSON.stringify(r.errors))
  t.ok(!r.errors.some(e => / 4.1a| 9.2a/.test(e)), 'KHÔNG oan landing/policy thật')
})

// ── tinh-chỉnh SOP_SUPPORT: bước soạn-thảo hỗ-trợ KHÔNG bị F1; động-từ-tool/mô-phỏng vẫn F1 ──
test('LG-COMP SOP_SUPPORT — bước không-tool + doc quy-trình → PASS; tool/sim → F1', ['LG-COMP-11'], t => {
  const rows = [
    // bước soạn-thảo hỗ-trợ (không động-từ-tool, output là quy-tắc) → KHÔNG F1
    { id: '6.2b', hanh_dong: 'Cờ asset chưa rõ license → DỪNG dùng', trang_thai: 'DONE',
      bang_chung: '`02-Tasks/x/process/6.2b-quy-tac-co-asset.md`' },
    { id: '5.1b', hanh_dong: 'Lập danh-sách freelancer dự-phòng', trang_thai: 'DONE',
      bang_chung: '`02-Tasks/x/process/5.1b-shortlist-freelancer.md`' },
    // có động-từ-tool "build" + evidence là spec → VẪN F1 (không nới lỏng)
    { id: '3.1a', hanh_dong: 'Tạo form opt-in (spec build-ready)', trang_thai: 'DONE',
      bang_chung: '`02-Tasks/x/process/3.1a-form-optin-spec.md`' },
  ]
  const r = C.validateRunStateStrict(rows, {})
  t.ok(!r.errors.some(e => / 6.2b| 5.1b/.test(e)), 'support-doc KHÔNG bị F1: ' + JSON.stringify(r.errors))
  t.ok(r.errors.some(e => e.startsWith('F1 3.1a')), '3.1a (build) VẪN F1')
})

// ── evidenceContentVerdict: bắt "kết-quả trống"; KHÔNG nhầm nhãn grounding ────
test('LG-COMP evidenceContentVerdict — khung rỗng → F1; grounding [cần CEO xác minh] → OK', ['LG-COMP-12'], t => {
  const rong = 'Bảng kết-quả tra SHTT:\n| Tên | Nhóm 41 | Nhóm 9 |\n[CEO điền sau tra cứu]\n☐ Trống / ☐ Đã đăng ký\n☐ Trống'
  t.eq(C.evidenceContentVerdict(rong, 'TOOL_EXEC').ma_loi, 'F1')
  const grounded = 'Giá bán 179k [số thật DN]. CAC [benchmark — cần CEO xác minh]. Phí cổng 0% [cần CEO xác minh].'
  t.ok(C.evidenceContentVerdict(grounded, 'DELIVERABLE').ok, 'grounding KHÔNG bị coi là trống')
  // qua validateRunStateStrict với contents: research step + file rỗng → F1
  const rows = [{ id: '9.5a', hanh_dong: 'Tra sơ-bộ SHTT + check domain', trang_thai: 'DONE', bang_chung: '`03-Outputs/x/9.5a.md`' }]
  const r = C.validateRunStateStrict(rows, { '9.5a': true }, { '9.5a': rong })
  t.ok(r.errors.some(e => e.startsWith('F1 9.5a')), 'strict bắt 9.5a rỗng: ' + JSON.stringify(r.errors))
})

// ── validateRunStateStrict: DONE thiếu bằng-chứng → E1 ────────────────────────
test('LG-COMP validateRunStateStrict — E1 DONE thiếu bằng-chứng', ['LG-COMP-05'], t => {
  const r = C.validateRunStateStrict([{ id: 'x', hanh_dong: 'chạy X', trang_thai: 'DONE', bang_chung: '' }], {})
  t.ok(r.errors.some(e => e.startsWith('E1 x')))
})

// ── coverageBijection: bắt bước bỏ sót ───────────────────────────────────────
test('LG-COMP coverageBijection — thiếu bước & %', ['LG-COMP-06'], t => {
  const r = C.coverageBijection(['a', 'b', 'c'], [{ id: 'a' }, { id: 'b' }])
  t.eq(r.missing_steps, ['c'])
  t.eq(r.covered_pct, 67)
})

// ── placementCheck: process ở Outputs → misfiled (F3) ────────────────────────
test('LG-COMP placementCheck — process ở 03-Outputs bị cờ, deliverable thì không', ['LG-COMP-07'], t => {
  const files = [
    '03-Outputs/gd1-validate/2.2a-khung-nghien-cuu-dau-cau.md',   // process
    '03-Outputs/gd1-validate/9.1a-checklist-cong-ban-quyen.md',    // process
    '03-Outputs/gd1-validate/deploy-donthat/index.html',           // deliverable
    '03-Outputs/gd1-validate/kit/00-huong-dan-su-dung-kit.md',     // deliverable (kit/)
    '02-Tasks/x/10-thuc-thi-1-sepay-onboarding.md',                // ở Tasks, không xét
  ]
  const r = C.placementCheck(files)
  const paths = r.misfiled.map(m => m.path)
  t.ok(paths.some(p => p.includes('2.2a-khung')), 'bắt 2.2a khung')
  t.ok(paths.some(p => p.includes('9.1a-checklist')), 'bắt 9.1a checklist')
  t.ok(!paths.some(p => p.includes('deploy-donthat')), 'không oan landing')
  t.ok(!paths.some(p => p.includes('kit/')), 'không oan kit')
})

// ── checkDoD: thiếu output/cổng ──────────────────────────────────────────────
test('LG-COMP checkDoD — PHA2 thiếu 10-run-state / PHA0 đủ', ['LG-COMP-08'], t => {
  const miss = C.checkDoD('PHA2', { outputs_co: [], cong_pass: {} })
  t.ok(!miss.ok && miss.missing.some(m => m.chi_tiet === '10-run-state.md'))
  const ok = C.checkDoD('PHA0', { outputs_co: ['telos.md', '.vncoderc'], cong_pass: { G0: true } })
  t.ok(ok.ok, JSON.stringify(ok.missing))
})

// ── phaseAdvanceGate: E9 chỉ khai pha kế khi đủ 3 ────────────────────────────
test('LG-COMP phaseAdvanceGate — E9', ['LG-COMP-09'], t => {
  t.ok(C.phaseAdvanceGate('PHA1', { dod_ok: true, cong_ok: true, audit_ok: true }).cho_phep)
  const g = C.phaseAdvanceGate('PHA1', { dod_ok: false, cong_ok: true, audit_ok: true })
  t.ok(!g.cho_phep && g.thieu.indexOf('DoD') !== -1)
})

// ── enforceTier + hookPolicy + validateComplianceLedger ──────────────────────
test('LG-COMP tier/hook/ledger', ['LG-COMP-10'], t => {
  t.ok(C.enforceTier('STRATEGIC').audit_agent === true)
  t.ok(C.enforceTier('SIMPLE').audit_agent === false)
  t.ok(C.enforceTier('STRATEGIC').always_on.indexOf('fail-closed') !== -1)
  t.eq(C.hookPolicy('F1'), 'DENY')
  t.eq(C.hookPolicy('F3'), 'WARN')
  t.ok(C.validateComplianceLedger([{ pha: 'PHA2', cong: 'x', verdict: 'PASS' }]).ok)
  t.ok(!C.validateComplianceLedger([{ pha: 'PHA2', verdict: 'FAIL' }]).ok) // FAIL thiếu ma_loi
})
