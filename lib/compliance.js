'use strict'
// lib/compliance.js — engine giám-sát tuân thủ PHA 0→4 (SPEC docs/design/giam-sat-tuan-thu).
// Mọi hàm PURE (cùng input → cùng output), bảng tĩnh đọc từ knowledge/rule-engines/compliance.yaml
// (config-as-data, C4). CHỈ THÊM (C6): KHÔNG sửa engine debate/router/executor/HITL/grounding.
//
// Tách PURE/IO: engine chỉ chứa LUẬT (phân-loại chuỗi bằng-chứng + phán từ kết-quả resolve).
// Việc resolve THẬT (file tồn-tại? URL sống?) do tools/compliance-check.js hoặc agent làm rồi
// truyền `resolutions` (map id→bool) vào. Giữ đúng khuôn "lib PURE, có test" của repo.

const path = require('path')
const yaml = require('./yaml')
const text = require('./text')

const CFG = yaml.load(path.resolve(__dirname, '..', 'knowledge/rule-engines/compliance.yaml'))

const EXEC_TYPES = ['HUMAN_HANDOFF', 'TOOL_EXEC', 'SOP_SUPPORT', 'DELIVERABLE'] // thứ-tự ưu-tiên
const stepText = s => (typeof s === 'string' ? s : (s && (s.hanh_dong || s.ten || s.action)) || '')

// ── defOfDone(pha) / checkDoD(pha, state) ────────────────────────────────────
function defOfDone(pha) {
  return CFG.pha_dod[pha] || { outputs: [], cong: [], invariants: [] }
}
// state: { outputs_co:[tên file có], cong_pass:{G0:true,...} }
function checkDoD(pha, state) {
  const dod = defOfDone(pha)
  const has = new Set((state && state.outputs_co) || [])
  const passed = (state && state.cong_pass) || {}
  const missing = []
  for (const o of dod.outputs || []) {
    // khớp "10-thuc-thi-*" theo tiền-tố; còn lại khớp hậu-tố tên file
    const ok = [...has].some(h => (o.endsWith('*') ? h.indexOf(o.slice(0, -1)) !== -1 : h.indexOf(o) !== -1))
    if (!ok) missing.push({ loai: 'output', chi_tiet: o })
  }
  for (const g of dod.cong || []) if (!passed[g]) missing.push({ loai: 'cong', chi_tiet: g })
  return { ok: missing.length === 0, missing }
}

// ── classifyExec(step) → loại thực-thi + chuẩn bằng-chứng ─────────────────────
function classifyExec(step) {
  if (step && typeof step === 'object' && step.loai_exec && EXEC_TYPES.includes(step.loai_exec)) {
    return { loai_exec: step.loai_exec, chuan_bang_chung: (CFG.exec_classify[step.loai_exec] || {}).evidence_ok || [] }
  }
  const s = stepText(step)
  const ec = CFG.exec_classify
  let loai = 'DELIVERABLE' // mặc-định
  if (text.matchesAny(s, ec.HUMAN_HANDOFF.keywords)) loai = 'HUMAN_HANDOFF'
  else if (text.matchesAny(s, ec.TOOL_EXEC.verbs)) loai = 'TOOL_EXEC'
  else if (text.matchesAny(s, ec.SOP_SUPPORT.markers)) loai = 'SOP_SUPPORT'
  else if (text.matchesAny(s, ec.DELIVERABLE.markers)) loai = 'DELIVERABLE'
  return { loai_exec: loai, chuan_bang_chung: (ec[loai] || {}).evidence_ok || [] }
}

// ── classifyEvidence(str) → kind bằng-chứng ──────────────────────────────────
const IMG_RE = /\.(png|jpe?g|gif|webp|svg)(\b|$)/i
const FILE_RE = /[\w\-./]+\.(md|csv|html?|json|js|zip|pdf|xlsx|docx|txt)(\b|$)/i
const URL_RE = /https?:\/\/\S+/i
const TXN_RE = /(giao-?dịch|txn|paid["\s:]*true|đã nhận thanh|chuyển-?khoản.*(thành-?công|ok))/i
const PROSE_RE = /(mô-?phỏng|giả-?lập|dự-?kiến|sẽ |khung |kịch-?bản|đề-?xuất cách|hướng-?dẫn)/i
function classifyEvidence(str) {
  const s = (str == null ? '' : String(str)).trim()
  if (s === '' || s === '—' || s === '-') return { kind: 'NONE', target: '' }
  if (TXN_RE.test(s)) return { kind: 'TXN', target: s }
  if (URL_RE.test(s)) {
    const m = s.match(URL_RE)
    return { kind: /nguồn|source|trích/i.test(s) ? 'CITATION' : 'URL', target: m ? m[0] : s }
  }
  if (IMG_RE.test(s)) return { kind: 'IMAGE', target: (s.match(FILE_RE) || [s])[0] }
  if (FILE_RE.test(s)) return { kind: 'FILE', target: (s.match(FILE_RE) || [s])[0] }
  return { kind: 'PROSE', target: s }
}

// Bằng-chứng "mô-phỏng/dự-kiến/chưa-thật" KHÔNG bao giờ chứng-minh một DONE thật.
const SIM_RE = /(mô-?phỏng|mo-?phong|giả-?lập|gia-?lap|dự-?kiến|du-?kien|chưa\s+(giao\s+)?thật|chua\s+(giao\s+)?that)/i
// FILE bằng-chứng có phải kết-quả THẬT (deliverable/output), không phải doc quy-trình/mô-phỏng?
function isRealArtifactEvidence(rawEvidence, evKind) {
  if (SIM_RE.test(String(rawEvidence == null ? '' : rawEvidence))) return false
  if (evKind === 'FILE' && rawEvidence != null && classifyArtifact(rawEvidence) === 'PROCESS') return false
  return true
}

// ── verdictEvidence(loai_exec, evKind, resolvedOK, rawEvidence?) → {ok, ma_loi} ─
// resolvedOK: true (resolve THẬT ok) | false (resolve fail) | null (chưa/không resolve)
// rawEvidence (tuỳ chọn): chuỗi bằng-chứng gốc — soi FILE có phải doc mô-phỏng/quy-trình
// (bắt 1.3b: bằng-chứng là đường-dẫn nhưng file lại là "giao-thu-mo-phong").
function verdictEvidence(loaiExec, evKind, resolvedOK, rawEvidence) {
  if (loaiExec === 'TOOL_EXEC' || loaiExec === 'DELIVERABLE') {
    if (evKind === 'NONE') return { ok: false, ma_loi: loaiExec === 'TOOL_EXEC' ? 'F1' : 'F2' }
    if (loaiExec === 'TOOL_EXEC' && evKind === 'PROSE') return { ok: false, ma_loi: 'F1' } // mô-tả thay thực-thi
    if (!isRealArtifactEvidence(rawEvidence, evKind)) return { ok: false, ma_loi: 'F1' } // proof là doc mô-phỏng/quy-trình
    if (resolvedOK === false) return { ok: false, ma_loi: 'F2' } // resolve fail → done giả
    return { ok: true }
  }
  if (loaiExec === 'HUMAN_HANDOFF') return { ok: true } // trạng-thái HUMAN, không đòi artifact
  if (loaiExec === 'SOP_SUPPORT') return { ok: evKind !== 'NONE', ma_loi: evKind === 'NONE' ? 'F2' : undefined }
  return { ok: evKind !== 'NONE' }
}

// ── evidenceContentVerdict(content, loai) — dò "KẾT-QUẢ TRỐNG/placeholder" ────
// Bắt lỗi kiểu 9.5a: file tồn-tại & có nội-dung nhưng chỉ là KHUNG chờ điền (chưa thực-thi).
// PHÂN-BIỆT với nhãn grounding hợp-lệ `[cần CEO xác minh]`/`[số thật DN]` (KHÔNG tính là trống).
// Chỉ khớp dấu-hiệu "điền-sau / ô-trống / chưa-tra": ☐ ▢ · [CEO điền…] · [điền sau…] · [… sau tra…] · [để trống] · TODO/TBD.
const UNEXEC_RE = /[☐▢]|\[(?:[^\]]*\b(?:điền|sau tra|chưa (?:tra|điền|có kết)|để trống|to\s?do|tbd)\b[^\]]*)\]/gi
function evidenceContentVerdict(content, loaiExec) {
  const s = String(content == null ? '' : content)
  if (!s.trim()) return { ok: false, ma_loi: 'F1', ly_do: 'file rỗng' }
  const n = (s.match(UNEXEC_RE) || []).length
  if ((loaiExec === 'TOOL_EXEC' || loaiExec === 'DELIVERABLE') && n >= 3) {
    return { ok: false, ma_loi: 'F1', ly_do: `${n} ô trống/"điền-sau" — kết-quả chưa điền (khung chưa thực-thi)` }
  }
  return { ok: true }
}

// ── coverageBijection(planTasks, ledgerRows, aspectsActive) ──────────────────
const idOf = x => (x == null ? '' : (typeof x === 'string' ? x : (x.id || x.ma || '')))
function coverageBijection(planTasks, ledgerRows, aspectsActive) {
  const plan = (planTasks || []).map(idOf).filter(Boolean)
  const rows = (ledgerRows || []).map(idOf).filter(Boolean)
  const rowSet = new Set(rows)
  const planSet = new Set(plan)
  const missing_steps = plan.filter(p => !rowSet.has(p))
  const orphan_rows = rows.filter(r => !planSet.has(r))
  const asp = (aspectsActive || []).map(idOf).filter(Boolean)
  const aspHay = (ledgerRows || []).map(r => JSON.stringify(r)).join(' ')
  const aspects_thieu = asp.filter(a => aspHay.indexOf(a) === -1)
  const covered_pct = plan.length === 0 ? 100 : Math.round(((plan.length - missing_steps.length) / plan.length) * 100)
  return { covered_pct, missing_steps, orphan_rows, aspects_thieu }
}

// ── classifyArtifact(path, headMeta) → DELIVERABLE | PROCESS ──────────────────
function classifyArtifact(p, headMeta) {
  const base = String(p || '')
  const hay = base + ' ' + (headMeta == null ? '' : String(headMeta))
  // SOP thực-thi luôn là PROCESS
  if (/(^|\/)10-thuc-thi-/.test(base)) return 'PROCESS'
  // thư-mục/đuôi sản-phẩm rõ ràng → DELIVERABLE
  if (/(^|\/)(deploy-|kit\/)/.test(base) || /\.(html?|csv|zip|xlsx|docx|svg|png)(\b|$)/i.test(base)) return 'DELIVERABLE'
  if (text.matchesAny(hay, CFG.placement.process_markers)) return 'PROCESS'
  return 'DELIVERABLE'
}
// files: [{path, meta?}] hoặc [string]
function placementCheck(files) {
  const misfiled = []
  for (const f of files || []) {
    const p = typeof f === 'string' ? f : f.path
    const meta = typeof f === 'string' ? '' : f.meta
    if (/(^|\/)03-Outputs\//.test(p) && classifyArtifact(p, meta) === 'PROCESS') {
      misfiled.push({ path: p, nen_o: '02-Tasks', ma_loi: 'F3' })
    }
  }
  return { misfiled }
}

// ── validateComplianceLedger(rows) — bất-biến sổ 11-compliance ────────────────
function validateComplianceLedger(rows) {
  const errors = []
  for (const r of (rows || [])) {
    const id = (r && (r.pha + '/' + (r.cong || '?'))) || '?'
    if (!r || (r.verdict !== 'PASS' && r.verdict !== 'FAIL')) { errors.push(`LEDGER ${id}: verdict phải PASS|FAIL`); continue }
    if (r.verdict === 'FAIL' && !(r.ma_loi && String(r.ma_loi).trim())) errors.push(`LEDGER ${id}: FAIL ⇒ phải có ma_loi`)
    if (r.verdict === 'PASS' && r.ma_loi && String(r.ma_loi).trim()) errors.push(`LEDGER ${id}: PASS nhưng còn ma_loi ${r.ma_loi}`)
  }
  return { ok: errors.length === 0, errors }
}

// ── validateRunStateStrict(rows, resolutions) — E1·E4·E7 (per-row) ────────────
// rows: dòng 10-run-state {id, hanh_dong, trang_thai, bang_chung, loai_exec?}
// resolutions: { <id>: true|false } — kết-quả resolve THẬT do IO cấp (thiếu = null).
// E5/E6 là cross-artifact → dùng coverageBijection/placementCheck riêng.
function validateRunStateStrict(rows, resolutions, contents) {
  const errors = []
  const res = resolutions || {}
  const cont = contents || {}
  for (const r of (rows || [])) {
    if (!r) continue
    const id = r.id || '?'
    if (String(r.trang_thai) !== 'DONE') continue
    // E1: DONE ⇒ có bằng-chứng
    if (!(r.bang_chung != null && String(r.bang_chung).trim())) { errors.push(`E1 ${id}: DONE thiếu bằng-chứng`); continue }
    const cls = classifyExec(r)
    // E7: loại hợp-lệ (luôn có do classify)
    if (!EXEC_TYPES.includes(cls.loai_exec)) errors.push(`E7 ${id}: loai_exec không hợp-lệ`)
    const ev = classifyEvidence(r.bang_chung)
    // Tinh-chỉnh phân-loại: bước KHÔNG có động-từ-tool + output là doc quy-trình (không mô-phỏng)
    // ⇒ đó là bước SOẠN-THẢO hỗ-trợ (SOP_SUPPORT), KHÔNG phải deliverable/thực-thi giả.
    // GIỮ bẫy F1 thật: có động-từ-tool (deploy/tra/build…) hoặc "mô-phỏng" → vẫn TOOL_EXEC/F1.
    let loai = cls.loai_exec
    const s = (r.hanh_dong || r.ten || '')
    if (loai === 'DELIVERABLE'
      && !text.matchesAny(s, CFG.exec_classify.TOOL_EXEC.verbs)
      && ev.kind === 'FILE' && classifyArtifact(r.bang_chung) === 'PROCESS'
      && !SIM_RE.test(String(r.bang_chung == null ? '' : r.bang_chung))) {
      loai = 'SOP_SUPPORT'
    }
    // E4: TOOL_EXEC ⇒ bằng-chứng THẬT (không PROSE/doc mô-phỏng) và resolve không fail
    const v = verdictEvidence(loai, ev.kind, id in res ? res[id] : null, r.bang_chung)
    if (!v.ok) errors.push(`${v.ma_loi} ${id}: ${cls.loai_exec} bằng-chứng "${ev.kind}" không đạt (${r.bang_chung})`)
    // E4b: nội-dung file bằng-chứng là KẾT-QUẢ TRỐNG (khung chờ điền) → F1 (bắt 9.5a)
    else if (ev.kind === 'FILE' && (id in cont)) {
      const cv = evidenceContentVerdict(cont[id], loai)
      if (!cv.ok) errors.push(`${cv.ma_loi} ${id}: ${cv.ly_do}`)
    }
  }
  return { ok: errors.length === 0, errors }
}

// ── phaseAdvanceGate(pha, ctx) — E9: chỉ khai pha kế khi đủ 3 điều ────────────
// ctx: { dod_ok, cong_ok, audit_ok }  (audit_ok=true nếu tier không cần agent)
function phaseAdvanceGate(pha, ctx) {
  const c = ctx || {}
  const thieu = []
  if (!c.dod_ok) thieu.push('DoD')
  if (!c.cong_ok) thieu.push('cổng-pha')
  if (c.audit_ok === false) thieu.push('audit')
  return { cho_phep: thieu.length === 0, thieu, pha }
}

// ── enforceTier(routerClass) — tier + cổng CỨNG luôn bật ──────────────────────
function enforceTier(routerClass) {
  const t = CFG.tiers[routerClass] || CFG.tiers.SIMPLE
  return { audit_agent: !!t.audit_agent, resolve: t.resolve, always_on: CFG.always_on.slice() }
}

// ── hookPolicy(ma_loi) → DENY | WARN ─────────────────────────────────────────
function hookPolicy(maLoi) { return CFG.hook_policy[maLoi] || 'WARN' }

module.exports = {
  CFG, EXEC_TYPES,
  defOfDone, checkDoD,
  classifyExec, classifyEvidence, verdictEvidence, evidenceContentVerdict,
  coverageBijection, classifyArtifact, placementCheck,
  validateComplianceLedger, validateRunStateStrict,
  phaseAdvanceGate, enforceTier, hookPolicy,
}
