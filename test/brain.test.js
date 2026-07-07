'use strict'
// Tiêu-chí chấp-nhận spec 02 §8 (Brain 2 lớp: validator + G0).
const { test } = require('./harness')
const brain = require('../lib/brain')

function canon(extra) {
  const base = {}
  for (const k of ['strategy', 'products', 'budget', 'state', 'headcount']) base[k] = { exists: true, content: 'có nội-dung 123' }
  return Object.assign(base, extra || {})
}
const TELOS_OK = { telos: 'Cho người Sài-Gòn một bát phở Bắc chuẩn-vị, nhanh, sạch, giá bình-dân', values: ['chuẩn-vị'], boundaries: ['không chạy món lai-tạp'], approved_by: 'CEO', proposed_by: 'AI' }
const POS_OK = { beachhead: 'dân văn-phòng quận trung-tâm', wedge: 'phở trưa nhanh', moat: 'công-thức nước-dùng + cẩm-nang bếp' }
const CURVES_OK = { curves: [{ name: 'quán phở', positioning: 'phở Bắc', engine: 'cẩm-nang', stage: 'GD4', health: 'vàng' }] }
const STRUCT_OK = { tree: [{ block: 'K3', dept: 'dept-06', unit: 'Quầy đặt-món', capability: 'order-capture', activation: ['GD3'], reused_from: '' }] }

test('T1 validator đủ file → xanh', ['LG-2-file-telos','LG-2-file-positioning','LG-2-file-curves','LG-2-altitude'], t => {
  const B = { canon: canon(), coverage5: 5, telos: TELOS_OK, positioning: POS_OK, curves: CURVES_OK, structure: STRUCT_OK, state: { stage: 'GD4' }, index: [] }
  const r = brain.validateBrain(B)
  t.eq(r.errors, [], 'không lỗi'); t.eq(r.pauses, [], 'không PAUSE')
  t.ok(!r.warnings.some(w => w.includes('FILE_INCOMPLETE')), 'không FILE_INCOMPLETE')
})
test('T2 thiếu state.md (then-chốt) → PAUSE 1', 'LG-2-file-state', t => {
  const c = canon(); c.state = { exists: false, content: '' }
  const r = brain.validateBrain({ canon: c, coverage5: 4, state: null })
  t.ok(r.pauses.length > 0, 'có PAUSE 1')
})
test('T3 chỉ 5 file cũ, chưa có lớp mới → xanh + cảnh-báo sinh-thành', 'LG-2-altitude', t => {
  const r = brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GD4' } })
  t.eq(r.errors, []); t.ok(r.warnings.some(w => w.includes('lớp sinh-thành chưa thiết-lập')))
})
test('T4 telos thiếu boundaries → FILE_INCOMPLETE', 'LG-2-file-telos', t => {
  const B = { canon: canon(), coverage5: 5, telos: { telos: 'x', values: ['a'], boundaries: [] }, state: { stage: 'GD4' } }
  t.ok(brain.validateBrain(B).warnings.some(w => w.includes('FILE_INCOMPLETE: telos thiếu boundaries')))
})
test('T5 stage: thiếu→MISSING; GĐ9→INVALID; GĐ4→hợp-lệ', 'LG-2-file-state', t => {
  t.ok(brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: '' } }).warnings.some(w => w.includes('STAGE_MISSING')))
  t.ok(brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GD9' } }).errors.some(e => e.includes('STAGE_INVALID')))
  t.eq(brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GD4' } }).errors, [])
})
test('T6 reused_from trỏ id không có trong _index → REUSE_DANGLING', 'LG-2-file-structure', t => {
  const B = { canon: canon(), coverage5: 5, state: { stage: 'GD4' },
    structure: { tree: [{ unit: 'x', reused_from: 'pho.K9.dept-99.khong-co@v2' }] }, index: [] }
  t.ok(brain.validateBrain(B).warnings.some(w => w.includes('REUSE_DANGLING')))
})

test('T6b curves stage sai → CURVE_STAGE_INVALID; thiếu health → CURVE_INCOMPLETE', 'LG-2-file-curves', t => {
  const bad = brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GD4' },
    curves: { curves: [{ name: 'x', positioning: 'p', engine: 'e', stage: 'GD9' }] } })
  t.ok(bad.errors.some(e => e.includes('CURVE_STAGE_INVALID')), 'stage GĐ9 → lỗi')
  t.ok(bad.warnings.some(w => w.includes('CURVE_INCOMPLETE') && w.includes('health')), 'thiếu health → cảnh-báo')
  const good = brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GD4' }, curves: CURVES_OK })
  t.ok(!good.errors.some(e => e.includes('CURVE_')), 'đường-cong đủ trường → không lỗi')
})

// §2/§3.1 schema nội-dung per-file canonical + bộ-nhớ
test('T11 strategy/products/headcount thiếu dấu-hiệu → CANON_THIN; budget thiếu số → cảnh-báo',
  ['LG-2-file-strategy','LG-2-file-products','LG-2-file-budget','LG-2-file-headcount'], t => {
    const c = canon()
    c.strategy = { exists: true, content: 'ICP dân văn-phòng, định-vị phở trưa nhanh' } // đủ dấu-hiệu
    c.products = { exists: true, content: 'mô-tả chung chung' }   // thiếu unit-econ
    c.budget = { exists: true, content: 'kế-hoạch tài-chính không số' } // thiếu \d
    const r = brain.validateBrain({ canon: c, coverage5: 5, state: { stage: 'GD4' } })
    t.eq(r.errors, [], 'chỉ cảnh-báo, không lỗi')
    t.ok(!r.warnings.some(w => w.includes('CANON_THIN: strategy')), 'strategy đủ dấu-hiệu → không cảnh-báo')
    t.ok(r.warnings.some(w => w.includes('CANON_THIN: products')), 'products thiếu unit-econ → cảnh-báo')
    t.ok(r.warnings.some(w => w.includes('budget.md thiếu số thật')), 'budget thiếu số → cảnh-báo')
  })
test('T12 decisions-log mục locked thiếu nhãn altitude → DECISION_NO_ALTITUDE', 'LG-2-file-decisions', t => {
  const B = { canon: canon(), coverage5: 5, state: { stage: 'GD4' },
    decisions: [{ id: 'qd-1', status: 'locked', altitude: 'moat' }, { id: 'qd-2', status: 'locked' }] }
  const w = brain.validateBrain(B).warnings
  t.ok(w.some(x => x.includes('DECISION_NO_ALTITUDE') && x.includes('qd-2')), 'qd-2 thiếu altitude')
  t.ok(!w.some(x => x.includes('DECISION_NO_ALTITUDE') && x.includes('qd-1')), 'qd-1 có altitude → OK')
})

// G0
test('T7 G0 chặn telos mơ-hồ ("làm điều tốt")', 'LG-2-gate-G0', t => {
  const r = brain.runGateG0({ telos: { telos: 'làm điều tốt', boundaries: ['x'], approved_by: 'CEO' }, positioning: POS_OK, canon: canon() })
  t.ok(!r.pass && !r.coherent, 'BLOCK do mơ-hồ')
})
test('T8 G0 chặn cơ-hội không-thật (budget không số)', 'LG-2-gate-G0', t => {
  const c = canon(); c.budget = { exists: true, content: 'mô-tả không có số' }
  const r = brain.runGateG0({ telos: TELOS_OK, positioning: POS_OK, canon: c })
  t.ok(!r.pass && !r.plausible, 'BLOCK do thiếu số thật')
})
test('T9 G0 + telos-ceo: approved_by≠CEO → BLOCK', ['LG-2-telos-ceo','LG-2-gate-G0'], t => {
  const r = brain.runGateG0({ telos: Object.assign({}, TELOS_OK, { approved_by: 'AI' }), positioning: POS_OK, canon: canon() })
  t.ok(!r.pass, 'BLOCK'); t.includes(r.ly_do, 'CEO')
})
test('T10 G0 PASS: telos mạch-lạc + số thật + CEO-approved (= cổng thoát PHA 0)', ['LG-2-gate-G0','LG-3-PHA0-gate'], t => {
  t.ok(brain.runGateG0({ telos: TELOS_OK, positioning: POS_OK, canon: canon() }).pass, 'PASS')
})
test('T10b G0 approved_by "CEO (tên) — duyệt…" → PASS; "[chờ CEO duyệt]" → BLOCK', ['LG-2-telos-ceo','LG-2-gate-G0'], t => {
  const real = brain.runGateG0({ telos: Object.assign({}, TELOS_OK, { approved_by: 'CEO (dinhdx2) — duyệt 2026-06-29 (cổng G0 MỞ)' }), positioning: POS_OK, canon: canon() })
  t.ok(real.pass, 'approved_by mở-đầu CEO → PASS')
  const cho = brain.runGateG0({ telos: Object.assign({}, TELOS_OK, { approved_by: '[chờ CEO duyệt]' }), positioning: POS_OK, canon: canon() })
  t.ok(!cho.pass, 'placeholder chờ-duyệt → BLOCK'); t.includes(cho.ly_do, 'CEO')
})
test('T5b stage có dấu "GĐ4" (dạng doc/vault) → hợp-lệ; "GĐ9" → INVALID', 'LG-2-file-state', t => {
  t.eq(brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GĐ4' } }).errors, [], 'GĐ4 normalize → GD4 hợp-lệ')
  t.ok(brain.validateBrain({ canon: canon(), coverage5: 5, state: { stage: 'GĐ9' } }).errors.some(e => e.includes('STAGE_INVALID')), 'GĐ9 vẫn lỗi')
  t.eq(brain.normStage('GĐ4'), 'GD4', 'normStage bỏ dấu')
})
