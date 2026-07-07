'use strict'
// lib/brain.js — Brain 2 lớp: validator mở-rộng + cổng G0 (spec 02 §4).
// MỞ-RỘNG validator 5-file cũ của knowledge/brain-schema.md; GIỮ tương-thích ngược.

// 5 lớp-nhịp (altitude tempo) — §3.0, generic, bảng cố-định.
const ALTITUDE_TIERS = ['bat-bien', 'dinh-vi', 'hien-trang', 'cau-truc', 'bo-nho']
const STAGES = ['GD1', 'GD2', 'GD3', 'GD4', 'GD5', 'GD6']
// Chuẩn-hoá nhãn GĐ: doc/vault ghi "GĐ1" (có dấu), code dùng "GD1" — quy về 1 dạng (spec 02 §3.0).
function normStage(s) { return String(s == null ? '' : s).trim().replace(/Đ/g, 'D').replace(/đ/g, 'd') }

// Nhãn altitude per-file (§3.1).
const FILE_ALTITUDE = {
  'telos.md': 'telos', 'positioning.md': 'dinh-vi', 'curves.md': 'dinh-vi',
  'strategy.md': 'hien-trang', 'products.md': 'hien-trang', 'budget.md': 'hien-trang',
  'state.md': 'hien-trang', 'headcount.md': 'hien-trang', 'structure.md': 'cau-truc',
}

// Trường bắt-buộc mỗi file (§3.1).
const REQUIRED_FIELDS = {
  telos: ['telos', 'values', 'boundaries'],
  positioning: ['beachhead', 'wedge', 'moat'],
  curves: ['curves'],
  structure: ['tree'],
  state: ['stage'],
}

const VAGUE_TELOS = ['làm điều tốt', 'điều tốt', 'tốt', 'thành công', 'lớn mạnh', 'số 1', 'tốt nhất', 'vĩ-đại']

// §2/§3.1 — dấu-hiệu NỘI-DUNG mỗi file canonical phải giữ (SoT §2); thiếu → cảnh-báo CANON_THIN.
const CANON_SIGNAL = {
  strategy: ['icp', 'định-vị', 'positioning', 'thị-trường', 'khách', 'vision', 'tầm-nhìn', 'đối-thủ'],
  products: ['giá', 'biên', 'aov', 'unit', 'catalog', 'sản-phẩm', 'dịch-vụ', 'roas'],
  headcount: ['nhân-sự', 'vai', 'tuyển', 'cơ-cấu', 'người', 'đội', 'founder'],
}
// Nhãn altitude hợp-lệ cho mỗi mục decisions-log (LG-2-file-decisions).
const ALTITUDE_LABELS = ['telos', 'dinh-vi', 'moat', 'cau-truc']

function norm(s) { return String(s == null ? '' : s).toLowerCase().trim() }
function nonEmpty(v) {
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'string') return v.trim() !== ''
  return true
}

// ── §4.2 validateBrain(B) — phân-cấp mức lỗi/cảnh-báo/PAUSE ───────────────────
function validateBrain(B) {
  const errors = [], warnings = [], pauses = []

  // (1) GIỮ NGUYÊN luật 5 canonical cũ
  const cov = B.coverage5 != null ? B.coverage5 : countCoverage5(B)
  const thieuThenChot = !(B.canon && B.canon.strategy && B.canon.strategy.exists)
                     || !(B.canon && B.canon.state && B.canon.state.exists)
  if (cov < 3 || thieuThenChot) {
    pauses.push('PAUSE 1 — Brain thiếu file then-chốt (strategy/state) hoặc <3/5 file; gợi-ý /vn-onboard')
  } else if (5 - cov >= 1 && 5 - cov <= 2) {
    warnings.push(`Brain coverage ${cov}/5 — thiếu ${5 - cov} file phụ; tiếp-tục`)
  }

  // (lớp sinh-thành chưa thiết-lập = cảnh-báo, KHÔNG chặn — tương-thích ngược T3)
  if (!B.telos && !B.positioning && !B.curves && !B.structure) {
    warnings.push('lớp sinh-thành chưa thiết-lập (telos/positioning/curves/structure)')
  }

  // (2) trường bắt-buộc từng file nếu file tồn-tại
  for (const [key, fields] of Object.entries(REQUIRED_FIELDS)) {
    const f = B[key]
    if (f) {
      for (const fld of fields) {
        if (!nonEmpty(f[fld])) warnings.push(`FILE_INCOMPLETE: ${key} thiếu ${fld}`)
      }
    }
  }

  // (2b) curves[] — mỗi đường-cong: stage∈{GD1..GD6} + đủ trường định-vị/sức-khoẻ (LG-2-file-curves, §3.1)
  if (B.curves && Array.isArray(B.curves.curves)) {
    B.curves.curves.forEach((c, i) => {
      const nhan = `curves[${i}]` + (c && nonEmpty(c.name) ? ` (${c.name})` : '')
      if (!nonEmpty(c.stage)) warnings.push(`CURVE_INCOMPLETE: ${nhan} thiếu stage`)
      else if (!STAGES.includes(normStage(c.stage))) errors.push(`CURVE_STAGE_INVALID: ${nhan} stage=${c.stage} ∉ {GD1..GD6}`)
      for (const fld of ['name', 'positioning', 'engine', 'health']) {
        if (!nonEmpty(c[fld])) warnings.push(`CURVE_INCOMPLETE: ${nhan} thiếu ${fld}`)
      }
    })
  }

  // (2c) schema NỘI-DUNG per-file canonical + bộ-nhớ (LG-2-file-strategy/products/budget/headcount/decisions)
  for (const w of validateCanonContent(B)) warnings.push(w)

  // (3) state.stage
  if (B.state) {
    if (!nonEmpty(B.state.stage)) {
      warnings.push('STAGE_MISSING — PHA 0 phải phát-hiện stage, KHÔNG mặc-định GĐ1')
    } else if (!STAGES.includes(normStage(B.state.stage))) {
      errors.push(`STAGE_INVALID: ${B.state.stage} ∉ {GD1..GD6}`)
    }
  }

  // (4) structure.reused_from trỏ id hợp-lệ
  if (B.structure && Array.isArray(B.structure.tree)) {
    const index = new Set(B.index || [])
    for (const node of B.structure.tree) {
      if (nonEmpty(node.reused_from) && !index.has(node.reused_from)) {
        warnings.push(`REUSE_DANGLING: ${node.reused_from} không có trong _index.md`)
      }
    }
  }

  return { errors, warnings, pauses, ok: errors.length === 0 }
}

function countCoverage5(B) {
  const canon = (B && B.canon) || {}
  return ['strategy', 'products', 'budget', 'state', 'headcount']
    .filter(k => canon[k] && canon[k].exists && nonEmpty(canon[k].content)).length
}

// ── §4.3 runGateG0(B) — cổng-tỉnh-táo ────────────────────────────────────────
function runGateG0(B) {
  // tiền-điều-kiện: telos do CEO quyết (LG-2-telos-ceo)
  if (!B.telos || !nonEmpty(B.telos.telos)) {
    return { pass: false, coherent: false, plausible: false, ly_do: 'thiếu telos' }
  }
  // CEO duyệt = approved_by mở-đầu bằng "CEO" (chấp "CEO (tên) — duyệt …"); placeholder "[chờ CEO duyệt]" KHÔNG khớp.
  if (!/^CEO\b/.test(String(B.telos.approved_by == null ? '' : B.telos.approved_by).trim())) {
    return { pass: false, coherent: false, plausible: false, ly_do: 'telos.approved_by chưa do CEO duyệt (AI không tự chốt telos)' }
  }
  const coherent = checkCoherent(B)
  const plausible = checkPlausible(B)
  if (!coherent) return { pass: false, coherent, plausible, ly_do: 'telos mơ-hồ/đa-nghĩa hoặc thiếu ranh-giới' }
  if (!plausible) return { pass: false, coherent, plausible, ly_do: 'cơ-hội chưa có-vẻ-thật — cần số thật DN (state/budget)' }
  return { pass: true, coherent, plausible, ly_do: 'PASS' }
}

function checkCoherent(B) {
  const t = norm(B.telos.telos)
  if (t.length < 15) return false
  if (VAGUE_TELOS.includes(t)) return false
  if (!nonEmpty(B.telos.boundaries)) return false // ranh-giới = cái DN KHÔNG làm
  return true
}

function checkPlausible(B) {
  if (!B.positioning || !nonEmpty(B.positioning.beachhead) || !nonEmpty(B.positioning.moat)) return false
  // cơ-hội có-vẻ-thật: có số thật ở budget (không chỉ benchmark)
  const budget = B.canon && B.canon.budget
  const hasReal = budget && budget.exists && /\d/.test(String(budget.content || ''))
  return !!hasReal
}

// ── §2/§3.1 validate NỘI-DUNG canonical + bộ-nhớ — cảnh-báo, KHÔNG chặn (tương-thích ngược) ──
function validateCanonContent(B) {
  const warnings = []
  const canon = (B && B.canon) || {}
  // 4 file canonical: tồn-tại + có nội-dung nhưng THIẾU dấu-hiệu SoT §2 → CANON_THIN
  for (const [key, signals] of Object.entries(CANON_SIGNAL)) {
    const f = canon[key]
    if (f && f.exists && nonEmpty(f.content)) {
      const c = norm(f.content)
      if (!signals.some(s => c.includes(norm(s)))) {
        warnings.push(`CANON_THIN: ${key}.md thiếu dấu-hiệu ${signals.slice(0, 3).join('/')}… (SoT §2)`)
      }
    }
  }
  // budget.md: phải có SỐ THẬT (\d) để làm căn-cứ scale
  const budget = canon.budget
  if (budget && budget.exists && nonEmpty(budget.content) && !/\d/.test(String(budget.content))) {
    warnings.push('CANON_THIN: budget.md thiếu số thật — không dùng làm căn-cứ scale')
  }
  // decisions-log: mỗi mục status=locked phải gắn nhãn altitude hợp-lệ
  if (B && B.decisions) {
    for (const d of [].concat(B.decisions)) {
      if (d && d.status === 'locked' && !ALTITUDE_LABELS.includes(norm(d.altitude))) {
        warnings.push(`DECISION_NO_ALTITUDE: quyết-định "${d.id || d.tom_tat || '?'}" thiếu nhãn altitude∈{${ALTITUDE_LABELS.join(',')}}`)
      }
    }
  }
  return warnings
}

module.exports = {
  ALTITUDE_TIERS, STAGES, FILE_ALTITUDE, REQUIRED_FIELDS, CANON_SIGNAL, ALTITUDE_LABELS, normStage,
  validateBrain, runGateG0, countCoverage5, validateCanonContent,
}
