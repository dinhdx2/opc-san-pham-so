'use strict'
// lib/flow.js — luật luồng generic: router đệ-quy (03/03c), cổng cứng (03c §4.3),
// khép-vòng định-tuyến (03d §4.5) gọi rule-engine, 3-phép-thử mở-rộng (03e §4.1).
// Mọi hàm PURE; bảng/luật cố-định = GENERIC.

const re = require('./rule-engines')
const kho = require('./kho')
const brain = require('./brain')
const text = require('./text')

// ── Router phân-loại SIMPLE/COMPLEX/STRATEGIC (spec 03 §4.2, 03c §3.1/§4.1) ───
function routerClass(depts) {
  const n = (depts || []).length
  const scale = n <= 2 ? 'SIMPLE' : n <= 6 ? 'COMPLEX' : 'STRATEGIC'
  return {
    scale,
    model_tier: scale === 'SIMPLE' ? 'sonnet' : 'opus_cho_phong_loi',
    full_4_pha: scale === 'STRATEGIC',
    max_xexam_rounds: scale === 'STRATEGIC' ? 2 : 1,
  }
}

// ── Cổng CỨNG (spec 03c §6 INV-GATE / LG-3-PHA2-gate-cung) ────────────────────
// 5 nhóm LUÔN NEED-APPROVAL: chi tiền · ký/nộp pháp-lý · công-bố · gửi email-tin · không hoàn-tác.
const HARD_BOUNDARY = [
  ['chi-tiền', ['đổ ', 'đổ$', 'chi tiền', 'chi $', 'ngân-sách', 'ngân sách', 'thanh-toán', '$', 'đổ tiền', 'bật ads', 'đổ ngân']],
  ['ký-nộp-pháp-lý', ['ký ', 'ký-', 'nộp ', 'submit', 'đăng-ký kinh-doanh', 'đăng ký kinh', 'ký hợp-đồng', 'ký hđ', 'hồ-sơ pháp']],
  ['công-bố', ['publish', 'công-bố', 'công bố', 'đăng store', 'go live', 'live ', 'landing page ra', 'ra công-chúng']],
  ['gửi-email-tin', ['gửi email', 'gửi tin', 'gửi mail', 'chào-hàng tới', 'email tới', 'broadcast']],
  ['không-hoàn-tác', ['xoá', 'xóa', 'ghi-đè', 'ghi đè', 'drop ', 'delete', 'huỷ', 'hủy']],
]
function chamRanhGioiCung(step) {
  const s = typeof step === 'string' ? step : (step.hanh_dong || step.ten || '')
  for (const [loai, kws] of HARD_BOUNDARY) {
    if (text.matchesAny(s, kws)) return { hard: true, loai }
  }
  return { hard: false }
}

const HUMAN_ONLY_KW = ['kyc', 'sinh-trắc', 'sinh trắc', 'đến ngân-hàng', 'đến ngân hàng', 'định-danh', 'gặp công-chứng']
// phan_loai_buoc — cổng cứng ƯU-TIÊN CAO NHẤT (chạy TRƯỚC AI-AUTO).
function phanLoaiBuoc(step) {
  const g = chamRanhGioiCung(step)
  if (g.hard) return { loai: 'NEED_APPROVAL', cong: 'NEED-APPROVAL', owner: 'AI+Human', ly_do: g.loai }
  const s = typeof step === 'string' ? step : (step.hanh_dong || step.ten || '')
  if (step.thieu_input) return { loai: 'NEED_INFO', cong: 'NEED-INFO', owner: 'AI' }
  // HUMAN_ONLY: người phải tự làm (KYC/sinh-trắc) → cổng riêng 'HUMAN' (KHÔNG 'none' — bất-biến §3.3: none chỉ khi AI_AUTO).
  if (text.matchesAny(s, HUMAN_ONLY_KW)) return { loai: 'HUMAN_ONLY', cong: 'HUMAN', owner: 'Human' }
  return { loai: 'AI_AUTO', cong: 'none', owner: 'AI' }
}

// ── validate_run_state(rows) — bất-biến sổ 10-run-state.md (spec 03c §3.3, §8.3 E1/E2) ──
// E1: trang_thai=DONE ⇒ bang_chung≠null (chống bịa). E2: cong⟂loai (none⟺AI_AUTO; NEED_APPROVAL⇒NEED-APPROVAL; HUMAN_ONLY⇒HUMAN).
function validateRunState(rows) {
  const errors = []
  const list = Array.isArray(rows) ? rows : []
  const nonEmpty = v => v != null && String(v).trim() !== ''
  for (const r of list) {
    const id = (r && r.id) || '?'
    // E1
    if (String(r && r.trang_thai) === 'DONE' && !nonEmpty(r && r.bang_chung)) {
      errors.push(`E1 ${id}: trang_thai=DONE nhưng thiếu bang_chung (chống bịa)`)
    }
    // E2 — cổng phải khớp loại
    const loai = r && r.loai, cong = r && r.cong, owner = r && r.owner
    if (loai === 'AI_AUTO' && !(cong === 'none' && owner === 'AI')) errors.push(`E2 ${id}: AI_AUTO ⇒ cong=none∧owner=AI (gặp cong=${cong},owner=${owner})`)
    if (loai === 'NEED_APPROVAL' && cong !== 'NEED-APPROVAL') errors.push(`E2 ${id}: NEED_APPROVAL ⇒ cong=NEED-APPROVAL (gặp ${cong})`)
    if (loai === 'NEED_INFO' && cong !== 'NEED-INFO') errors.push(`E2 ${id}: NEED_INFO ⇒ cong=NEED-INFO (gặp ${cong})`)
    if (loai === 'HUMAN_ONLY' && cong !== 'HUMAN') errors.push(`E2 ${id}: HUMAN_ONLY ⇒ cong=HUMAN (gặp ${cong})`)
    if (cong === 'none' && loai !== 'AI_AUTO') errors.push(`E2 ${id}: cong=none chỉ khi AI_AUTO (gặp loai=${loai})`)
  }
  return { ok: errors.length === 0, errors }
}

// ── validate_resume(prev, next) — E3: resume KHÔNG chạy lại / ghi-đè bước DONE ──
function validateResume(prevRows, nextRows) {
  const errors = []
  const byId = {}
  for (const r of (Array.isArray(nextRows) ? nextRows : [])) if (r && r.id != null) byId[r.id] = r
  for (const p of (Array.isArray(prevRows) ? prevRows : [])) {
    if (!p || String(p.trang_thai) !== 'DONE') continue
    const n = byId[p.id]
    if (!n) { errors.push(`E3 ${p.id}: bước DONE biến-mất sau resume`); continue }
    if (String(n.trang_thai) !== 'DONE') errors.push(`E3 ${p.id}: bước DONE bị hạ về ${n.trang_thai} (resume ghi-đè)`)
    if (p.bang_chung != null && n.bang_chung !== p.bang_chung) errors.push(`E3 ${p.id}: bang_chung bị ghi-đè khi resume`)
  }
  return { ok: errors.length === 0, errors }
}

// ── Router 1 HÀNH-ĐỘNG (spec 03/03c §4.2) ────────────────────────────────────
// scale suy từ số PHÒNG mà hành-động chạm (proxy độ-phức-tạp). Cổng cứng (NEED-APPROVAL)
// TRỰC-GIAO với scale: 1 hành-động SIMPLE chạm chi-tiền VẪN NEED-APPROVAL (INV §4.2 R3).
function routerHanhDong(hanhDong, deptsLienQuan) {
  const r = routerClass(deptsLienQuan || [])
  const gate = phanLoaiBuoc(hanhDong)
  const ten = typeof hanhDong === 'string' ? hanhDong : (hanhDong && (hanhDong.hanh_dong || hanhDong.ten)) || ''
  return { ...r, hanh_dong: ten, cong: gate.cong, loai_buoc: gate.loai }
}

// ── Khép-vòng: định-tuyến tầng leo (spec 03d §4.5) — neo rule-engine §6.2 ──────
function dinhTuyenTang(tinHieu) {
  return re.routeSongVong(tinHieu) // {tang_leo, file_neo, nhip, nen}
}

// ── 3-phép-thử mở-rộng (spec 03e §4.1) — 3 quyết-định TRỰC-GIAO ───────────────
function chay3PhepThu(input) {
  // input: { moat: 'chuyen_duoc'|'phai_boi', telos: 'chung'|'khac', brand: 'giup'|'khong_giup' }
  const loai_mo_rong = input.moat === 'chuyen_duoc' ? 'GD5_noi' : 'GD6_de'
  const nha = input.telos === 'chung' ? 'cung_nha' : 'brand_moi'
  const ten = input.brand === 'giup' ? 'ten_me' : 'ten_phu'
  return {
    test_moat: input.moat, test_telos: input.telos, test_brand: input.brand,
    loai_mo_rong, nha, ten,
    reentry_stage: loai_mo_rong === 'GD5_noi' ? 'PHA1' : 'PHA0',
    prefer: loai_mo_rong === 'GD5_noi' ? 'REUSE' : 'ADAPT',
  }
}

// ── PHA 4 tái-nhập + bootstrap từ KHO (spec 03e §4.2-4.3) — LG-3-PHA4-rule ─────
// MỒI đường-cong mới từ KHO: mỗi năng-lực cần → tra _index.md → REUSE/ADAPT/NEW (reuse cây khối/phòng/bộ-phận).
// GĐ5-nới ưu-tiên REUSE (re-nhập PHA1); GĐ6-đẻ ưu-tiên ADAPT (re-nhập PHA0). Luôn bootstrap-KHO (INV-5).
function taiNhapBootstrap(ket3, canDung, khoIndex) {
  const k = ket3 || {}
  const bootstrap = (canDung || []).map(ctx => {
    const uv = kho.tra(ctx, khoIndex || [])
    const top = uv[0] || null
    return { ten_nang_luc: ctx.ten_nang_luc, ket_luan: top ? top.ket_luan : 'new',
      diem_khop: top ? top.diem_khop : 0, ung_vien: top ? top.item.id : null }
  })
  return {
    reentry_stage: k.reentry_stage || (k.loai_mo_rong === 'GD5_noi' ? 'PHA1' : 'PHA0'),
    prefer: k.prefer || (k.loai_mo_rong === 'GD5_noi' ? 'REUSE' : 'ADAPT'),
    bootstrap, reuse_ratio: reuseRatio(bootstrap),
  }
}

// reuse_ratio "trả lãi": tỉ-lệ năng-lực REUSE/ADAPT trên tổng — đo mức tái-dùng KHO khi mở đường-cong mới.
function reuseRatio(items) {
  const arr = items || []
  if (!arr.length) return 0
  const dung = arr.filter(x => ['reuse', 'adapt'].includes(String(x.ket_luan || '').toLowerCase())).length
  return Math.round((dung / arr.length) * 100) / 100
}

// ── Scaffold orchestration PHA 0/1 (THUẦN — gói engine call thành 1 entry-point, KHÔNG sinh nội-dung per-DN) ──
// Mục-đích: skill bám theo khung tái-lập (giảm prompt-drift). LLM vẫn điền điều-kiện-đủ/tên/ngữ-cảnh.

// chuanBiPHA0(input) — gói intake PHA 0: phát-hiện stage (3 lớp) + G0 + coverage + cờ sẵn-sàng. (LG-3-PHA0-stage*)
function stageEvidence(B) {
  const c = (B && B.canon) || {}
  return [c.state && c.state.content, c.budget && c.budget.content, B && B.evidence].filter(Boolean).join(' · ')
}
function chuanBiPHA0(input) {
  const i = input || {}
  const B = i.brain || i
  const stage = re.detectStage(i.evidence || stageEvidence(B), i.stage_khai)
  const g0 = brain.runGateG0(B)
  const v = brain.validateBrain(B)
  // hợp-đồng-Ra spec 03a §4/§8.3: stage THEO TỪNG đường-cong (DN nhiều curve). Rỗng curves → [].
  const curves = (B && B.curves && Array.isArray(B.curves.curves)) ? B.curves.curves : []
  return {
    stage: stage.stage, cau_song_con: stage.cau_song_con, canh_bao: stage.canh_bao,
    stage_theo_duong_cong: re.detectStagePerCurve(curves),
    g0_pass: g0.pass, g0_ly_do: g0.ly_do, coverage5: brain.countCoverage5(B), pauses: v.pauses,
    san_sang_pha1: g0.pass && v.errors.length === 0 && v.pauses.length === 0,
  }
}

// chuanBiPHA1(stage) — scaffold walk PHA 1: khía-cạnh active + lưới taskgen + thứ-tự gom-ngược. (LG-3-PHA1-1B/1C)
const THU_TU_GOM = ['nhiệm-vụ-con', 'bộ-phận', 'phòng', 'khối']
function chuanBiPHA1(stage) {
  const active = re.goalScan(stage)
  return {
    stage,
    khia_canh_active: active.map(g => ({ aspect: g.aspect, hoi: g.hoi_cong_loc, mau_muc_tieu: g.mau_muc_tieu })),
    luoi_taskgen: re.taskGenGrid(),  // 5 hàng Sinh→Soi→Quét→Cổng→Neo
    thu_tu_gom: THU_TU_GOM.slice(),   // gom NGƯỢC-LÊN (PHA 1C)
  }
}

// chuanBiPHA2(actions) — scaffold thực-thi đệ-quy: MỖI hành-động 08-plan → router scale + cần-debate? + cổng cứng + file SOP.
// actions: [string | {hanh_dong|ten, depts[]}]. SIMPLE → SOP gọn không debate; COMPLEX/STRATEGIC → 10-thuc-thi-<action>.md. (LG-3-PHA2-*)
function slugHanhDong(s) {
  const noDia = text.norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return noDia.slice(0, 40) || 'hanh-dong'
}
function chuanBiPHA2(actions) {
  return (actions || []).map(a => {
    const ten = typeof a === 'string' ? a : (a && (a.hanh_dong || a.ten)) || ''
    const depts = (a && typeof a === 'object' && a.depts) || []
    const r = routerHanhDong(a, depts)
    return {
      hanh_dong: ten,
      scale: r.scale,
      can_debate: r.scale !== 'SIMPLE',                 // COMPLEX/STRATEGIC → hội-đồng quyết-nghị (debate.js)
      cong: r.cong,                                      // NEED-APPROVAL nếu chạm ranh-giới cứng (trực-giao scale)
      file_sop: r.scale === 'SIMPLE' ? null : `10-thuc-thi-${slugHanhDong(ten)}.md`,
    }
  })
}

// ── Luồng tổng PHA 0→4 (spec 03 §3/§4.1) — state-machine xác-định (LG-3-flow) ─
// Chiều-sinh đi xuống (0→2), khép-vòng đi lên (3), mở-rộng tái-nhập (4). Mỗi pha có Vào·Ra·Cổng.
const PHA = ['PHA0', 'PHA1', 'PHA2', 'PHA3', 'PHA4']
const PHA_VAO_RA = {
  PHA0: { vao: 'khai-báo CEO', ra: 'Brain 2 lớp', cong: 'G0' },
  PHA1: { vao: 'Brain + stage + _index', ra: '06-structure + 08-plan', cong: 'A,B' },
  PHA2: { vao: '08-plan', ra: '10-thuc-thi-* + 10-run-state', cong: 'cứng NEED-APPROVAL' },
  PHA3: { vao: 'số đo thật', ra: 'lessons/decisions + PROMOTE', cong: 'PASS,PROMOTE,GIAI-ĐOẠN' },
  PHA4: { vao: 'lõi khỏe GĐ5/6', ra: 'đường-cong mới', cong: '3-phép-thử' },
}

// buocLuong(pha, ctx) → bước kế của luồng. Trả { pha_ke, ... } hoặc { block, quay, ... }.
// ctx tuỳ pha: PHA0 {g0_pass} · PHA1 {cong_a,cong_b} · PHA2 {co_so_that} ·
//   PHA3 {ket_khep_vong, du_muc_tieu_gd, mo_rong} · PHA4 {loai_mo_rong, reentry_stage}
function buocLuong(pha, ctx) {
  ctx = ctx || {}
  switch (pha) {
    case 'PHA0': // chiều-sinh: G0 phải PASS mới xuống PHA1 (LG-3-PHA0-gate)
      if (!ctx.g0_pass) return { block: true, quay: 'CEO', ly_do: 'G0 FAIL — quay CEO chỉnh telos/positioning' }
      return { pha_ke: 'PHA1', cong: 'A', ly_do: 'G0 PASS → phân-rã' }
    case 'PHA1': // Cổng A (KHUNG) rồi Cổng B (plan+cấu-trúc+tra-kho)
      if (!ctx.cong_a) return { block: true, cong: 'A', ly_do: 'chờ Cổng A duyệt KHUNG' }
      if (!ctx.cong_b) return { block: true, cong: 'B', ly_do: 'chờ Cổng B duyệt plan+cấu-trúc+tra-kho' }
      return { pha_ke: 'PHA2', ly_do: 'khung+plan duyệt → thực-thi đệ-quy' }
    case 'PHA2': // thực-thi tới khi có SỐ THẬT để khép-vòng
      return ctx.co_so_that ? { pha_ke: 'PHA3', ly_do: 'có số thật → khép-vòng' }
                            : { pha_ke: 'PHA2', ly_do: 'tiếp-tục thực-thi tới khi có số đo' }
    case 'PHA3': // theo verdict khép-vòng (lib/loop.js#khepVong)
      switch (ctx.ket_khep_vong) {
        case 'CONG_CEO': return { block: true, quay: 'CEO', ly_do: 'hết K / chạm telos thiếu căn-cứ → CEO quyết' }
        case 'DON_VONG': return { pha_ke: 'PHA2', ly_do: 'đơn-vòng vá tại-chỗ → quay thực-thi' }
        case 'SONG_VONG': return { pha_ke: 'PHA1', cascade: true, ly_do: 'leo tầng → cascade sinh-lại nhánh dưới' }
        case 'PASS':
          if (ctx.du_muc_tieu_gd && ctx.mo_rong) return { pha_ke: 'PHA4', ly_do: 'PASS + đủ GĐ + lõi khỏe → mở-rộng' }
          if (ctx.du_muc_tieu_gd) return { pha_ke: 'PHA1', stage_ke: true, ly_do: 'Cổng GIAI-ĐOẠN → PHA1 mở GĐ kế' }
          return { pha_ke: 'PHA2', ly_do: 'PASS việc, GĐ chưa đủ → tiếp việc khác' }
        default: return { block: true, ly_do: `thiếu ket_khep_vong hợp-lệ: ${ctx.ket_khep_vong}` }
      }
    case 'PHA4': { // 3-phép-thử: GĐ5-nới→PHA1/REUSE · GĐ6-đẻ→PHA0/ADAPT, luôn bootstrap KHO
      const re = ctx.reentry_stage || (ctx.loai_mo_rong === 'GD6_de' ? 'PHA0' : 'PHA1')
      return { pha_ke: re, bootstrap: true, ly_do: `tái-nhập ${re} bootstrap từ KHO` }
    }
    default: return { block: true, ly_do: `pha không hợp-lệ: ${pha}` }
  }
}

// kiemTraThuTu(seq) — INV-FLOW: bắt-đầu PHA0; KHÔNG nhảy TIẾN vượt pha (vd 0→2);
// lùi = tái-nhập hợp-lệ (PHA3→PHA2/PHA1 đơn/song-vòng · PHA4→PHA0/1 mở-rộng). Trả {ok, ly_do}.
function kiemTraThuTu(seq) {
  if (!Array.isArray(seq) || seq.length === 0) return { ok: false, ly_do: 'luồng rỗng' }
  if (seq[0] !== 'PHA0') return { ok: false, ly_do: 'luồng phải bắt-đầu ở PHA0' }
  const idx = p => PHA.indexOf(p)
  for (let i = 1; i < seq.length; i++) {
    const truoc = idx(seq[i - 1]), nay = idx(seq[i])
    if (truoc < 0 || nay < 0) return { ok: false, ly_do: `pha lạ: ${seq[i - 1]}→${seq[i]}` }
    if (nay > truoc + 1) return { ok: false, ly_do: `nhảy vượt pha (chiều-sinh phải đi từng bước): ${seq[i - 1]}→${seq[i]}` }
  }
  return { ok: true }
}

module.exports = {
  routerClass, routerHanhDong, chamRanhGioiCung, phanLoaiBuoc, validateRunState, validateResume, dinhTuyenTang, chay3PhepThu, taiNhapBootstrap, reuseRatio,
  PHA, PHA_VAO_RA, buocLuong, kiemTraThuTu, chuanBiPHA0, chuanBiPHA1, chuanBiPHA2,
}
