'use strict'
// lib/rule-engines.js — 6 hàm xác-định (spec 06, SoT §6). Mọi hàm PURE: cùng input → cùng output.
// Bảng tĩnh đọc từ knowledge/rule-engines/*.yaml (config-as-data). KHÔNG side-effect (INV-6.1).

const path = require('path')
const yaml = require('./yaml')
const text = require('./text')

const RE = path.resolve(__dirname, '..', 'knowledge/rule-engines')
const STAGE_RUBRIC = yaml.load(path.join(RE, 'stage-rubric.yaml'))
const LOOP_ROUTING = yaml.load(path.join(RE, 'loop-routing.yaml'))
const ASPECT_GOAL = yaml.load(path.join(RE, 'aspect-goal.yaml'))
const TASKGEN_GRID = yaml.load(path.join(RE, 'taskgen-grid.yaml'))
const REUSE_RUBRIC = yaml.load(path.join(RE, 'reuse-rubric.yaml'))
const REUSE_CONFIG = yaml.load(path.join(RE, 'reuse-config.yaml'))
const NAMING = yaml.load(path.join(RE, 'naming-canonical.yaml'))

const stageNum = gd => parseInt(String(gd).replace(/[^0-9]/g, ''), 10) || 0

// ── 4.1 detect_stage(brain) (§6.1) ───────────────────────────────────────────
// brain: { evidence?:string, state?:string, budget?:string, products?:string } HOẶC string.
// stage_khai (tuỳ chọn) chỉ để PHÁT-HIỆN lệch (reality-check), KHÔNG ghi đè bằng-chứng.
function detectStage(brain, stageKhai) {
  const hay = typeof brain === 'string'
    ? brain
    : [brain.evidence, brain.state, brain.budget, brain.products, brain.signal].filter(Boolean).join(' · ')
  const scores = STAGE_RUBRIC.map(r => ({ gd: r.gd, n: text.countMatches(hay, r.keywords), row: r }))
  let best = scores[0]
  for (const s of scores) if (s.n > best.n) best = s
  const total = scores.reduce((a, s) => a + s.n, 0)
  const stageBangChung = best.n > 0 ? best.gd : 'GD1' // không dấu-hiệu → DN chưa-có-gì = GĐ1
  const out = {
    stage: stageBangChung,
    cau_song_con: best.row.cau_song_con,
    bang_chung: hay,
    do_tin: total ? best.n / total : 0,
    canh_bao: [],
  }
  // Lớp 3 reality-check (INV-6.3): khai > bằng-chứng ⇒ cảnh-báo, giữ bằng-chứng.
  if (stageKhai && stageNum(stageKhai) > stageNum(stageBangChung)) {
    out.canh_bao.push(
      `BLOCK_MO_RONG_SOM: khai ${stageKhai} > bằng-chứng ${stageBangChung} ` +
      `(số nói thật hơn nhãn — giữ ${stageBangChung})`)
  }
  return out
}

// ── 4.1b detect_stage_per_curve(curves) (spec 03a §4) ────────────────────────
// DN nhiều đường-cong (lõi GĐ6 + bet GĐ1) ⇒ suy stage THEO TỪNG curve, KHÔNG gộp 1 stage.
// Mỗi curve: { name, stage(khai), positioning, engine, health, evidence?, state?, budget? }.
function detectStagePerCurve(curves) {
  const list = Array.isArray(curves) ? curves : []
  return list.map(c => {
    const cv = c || {}
    const brain = {
      evidence: cv.evidence,
      state: cv.state,
      budget: cv.budget,
      products: cv.products,
      signal: [cv.positioning, cv.engine, cv.health].filter(Boolean).join(' · ') || undefined,
    }
    const r = detectStage(brain, cv.stage)
    return { name: cv.name || null, khai: cv.stage || null, stage: r.stage,
      cau_song_con: r.cau_song_con, do_tin: r.do_tin, canh_bao: r.canh_bao }
  })
}

// ── 4.2 route_song_vong(tin_hieu) (§6.2) ─────────────────────────────────────
function routeSongVong(tinHieu) {
  const nenRow = LOOP_ROUTING.find(r => r.id === 'nen')
  const nen = nenRow ? nenRow.file_neo.slice() : ['state.md', 'budget.md']
  // ưu-tiên rank thấp nhất khớp (cau_truc < moat < dinh_vi < telos) — INV-6.4
  const candidates = LOOP_ROUTING
    .filter(r => r.id !== 'nen' && text.matchesAny(tinHieu, r.keywords))
    .sort((a, b) => a.rank - b.rank)
  if (!candidates.length) return { tang_leo: null, can_debate: true, nen }
  const hit = candidates[0]
  return { tang_leo: hit.tang_leo, file_neo: hit.file_neo.slice(), nhip: hit.nhip, nen, claim: hit.claim } // INV-6.5: luôn kèm nền
}

// ── 4.3 goal_by_aspect(aspect, stage) (§6.3) ─────────────────────────────────
function goalByAspect(aspect, stage) {
  const row = ASPECT_GOAL.find(r => r.aspect === aspect || r.id === aspect)
  if (!row) return null
  // chuẩn-hoá GĐ (có dấu, từ doc/vault) → GD (code) trước khi so ngu_neu_stage
  const st = String(stage == null ? '' : stage).trim().replace(/Đ/g, 'D').replace(/đ/g, 'd')
  const ngu = row.ngu_neu_stage || []
  const active = !ngu.includes(st)
  return { aspect: row.aspect, hoi_cong_loc: row.hoi, mau_muc_tieu: row.mau_muc_tieu, active, claim: row.claim }
}
function goalScan(stage) {
  return ASPECT_GOAL.map(r => goalByAspect(r.aspect, stage)).filter(g => g.active)
}

// ── 4.4 task_gen_grid() (§6.4) ───────────────────────────────────────────────
function taskGenGrid() {
  return TASKGEN_GRID.map(r => ({ ...r })) // bản sao, INV-6.1 (không lộ tham-chiếu nội-bộ)
}

// ── 4.5 reuse_decision(ung_vien, ngu_canh) (§6.5) ────────────────────────────
function reuseDecision(ungVien, nguCanh) {
  if (ungVien == null) {
    const r = REUSE_RUBRIC.find(x => x.grade === 'C')
    return { quyet_dinh: 'NEW', hanh_dong: r.hanh_dong, grade: null, claim: r.claim }
  }
  let grade = ungVien.grade
  if (!grade && typeof ungVien.diem_khop === 'number') {
    grade = ungVien.diem_khop >= REUSE_CONFIG.cutoff_A ? 'A' : ungVien.diem_khop >= REUSE_CONFIG.cutoff_B ? 'B' : 'C'
  }
  grade = grade || 'C'
  const row = REUSE_RUBRIC.find(x => x.grade === grade) || REUSE_RUBRIC.find(x => x.grade === 'C')
  return { quyet_dinh: row.quyet_dinh, hanh_dong: row.hanh_dong, grade, claim: row.claim }
}

// ── 4.6 naming_dict(ten_nganh) (§6.6) ────────────────────────────────────────
function namingResolve(tenNganh) {
  const q = text.norm(tenNganh)
  for (const e of NAMING) {
    if (text.norm(e.ten_nang_luc) === q || e.canonical === q) return e
    if ((e.aliases || []).some(a => text.norm(a) === q)) return e
  }
  return null
}
function namingDict(tenNganh) {
  const e = namingResolve(tenNganh)
  if (!e) {
    const err = new Error(`NEED_MAPPING: chưa ánh-xạ tên-ngành "${tenNganh}" → tên-năng-lực canonical`)
    err.code = 'NEED_MAPPING'
    err.ten_nganh = tenNganh
    throw err
  }
  return e.canonical
}

module.exports = {
  STAGE_RUBRIC, LOOP_ROUTING, ASPECT_GOAL, TASKGEN_GRID, REUSE_RUBRIC, REUSE_CONFIG, NAMING,
  stageNum, detectStage, detectStagePerCurve, routeSongVong, goalByAspect, goalScan,
  taskGenGrid, reuseDecision, namingDict, namingResolve,
}
