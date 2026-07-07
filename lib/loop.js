'use strict'
// lib/loop.js — Khép-vòng có tầng PHA 3 (spec 03d). Mọi hàm PURE: cùng input → cùng output.
//   congPass      : Cổng PASS việc (đạt OKR/KPI) — LG-3-PHA3-pass
//   congGiaiDoan  : Cổng GIAI-ĐOẠN (đủ mục-tiêu GĐ → re-debate số thật → GĐ kế) — LG-3-PHA3-gate-gd
//   guardTelos    : chặn đổi telos vì 1 chiến-dịch lỗi — LG-3-PHA3-warn
//   khepVong      : điều-phối ĐƠN-VÒNG(≤K) / SONG-VÒNG(leo tầng) / Cổng CEO — LG-3-PHA3-don-vong/song-vong/ceo
// PROMOTE (TÁCH PASS) ở lib/kho.js#them; định-tuyến tầng leo ở lib/rule-engines.js#routeSongVong.
// K + tham-số đọc từ knowledge/rule-engines/loop-config.yaml (config-as-data, bất-biến C4).

const path = require('path')
const yaml = require('./yaml')
const re = require('./rule-engines')

const CFG = yaml.load(path.resolve(__dirname, '..', 'knowledge/rule-engines/loop-config.yaml'))
const K = CFG.K_max_don_vong || 3
const STAGES = ['GD1', 'GD2', 'GD3', 'GD4', 'GD5', 'GD6']

// GĐ kế-tiếp (cấp-trần ở GĐ6) — phục-vụ Cổng GIAI-ĐOẠN.
// Chuẩn-hoá nhãn GĐ (doc/vault ghi 'GĐ4' có dấu) → 'GD4' (code) trước khi tra — đối-xứng brain/rule-engines.
function nextStage(stage) {
  const norm = String(stage == null ? '' : stage).trim().replace(/Đ/g, 'D').replace(/đ/g, 'd')
  const i = STAGES.indexOf(norm)
  if (i < 0) return null
  return STAGES[Math.min(i + 1, STAGES.length - 1)]
}

// ── Cổng PASS việc (LG-3-PHA3-pass) ──────────────────────────────────────────
// Đo so neo: tấn→OKR, thủ/hậu→KPI-ngưỡng. PASS khi số đo ĐẠT ngưỡng. PASS ≠ PROMOTE.
function congPass(doNeo) {
  const { do_duoc, nguong } = doNeo || {}
  if (do_duoc == null || nguong == null) return { pass: false, xet_promote: false, ly_do: 'thiếu số đo/ngưỡng' }
  const pass = Number(do_duoc) >= Number(nguong)
  return { pass, xet_promote: pass, ly_do: pass ? 'đạt neo OKR/KPI' : 'chưa đạt ngưỡng' }
}

// ── Cổng GIAI-ĐOẠN (LG-3-PHA3-gate-gd) ───────────────────────────────────────
// Đủ mục-tiêu GĐ → re-debate SỐ THẬT (chống mở-rộng-sớm) → nâng stage → quay PHA 1 mở chi-tiết.
function congGiaiDoan(input) {
  const { du_muc_tieu, stage, re_debate_pass } = input || {}
  if (!du_muc_tieu) return { mo_cong: false, can_re_debate: false, stage_ke: stage, ly_do: 'chưa đủ mục-tiêu GĐ' }
  // §4.6/§8.5: re-debate SỐ THẬT FAIL (PMF chưa thật) ⇒ Ở-LẠI GĐ — chống mở-rộng-sớm (INV-8).
  if (re_debate_pass === false) {
    return { mo_cong: false, can_re_debate: true, stage_ke: stage,
      ly_do: 're-debate số thật FAIL (PMF chưa thật) → ở-lại GĐ (chống mở-rộng-sớm)' }
  }
  // re_debate_pass === true (đã PASS) hoặc undefined (skill sẽ chạy re-debate trước khi nâng) → mở cổng.
  return { mo_cong: true, can_re_debate: re_debate_pass !== true, stage_ke: nextStage(stage), quay_pha: 'PHA1',
    ly_do: re_debate_pass === true ? 're-debate số thật PASS → mở GĐ kế' : 're-debate số thật trước khi mở GĐ kế (chống mở-rộng-sớm)' }
}

// ── Guard telos (LG-3-PHA3-warn) ─────────────────────────────────────────────
// "Đừng đổi telos vì 1 chiến-dịch lỗi": chỉ chạm telos khi CÓ biến-cố-thế-giới + bằng-chứng từ Brain.
function guardTelos(input) {
  const { bien_co_the_gioi, co_bang_chung } = input || {}
  const cho_phep = !!bien_co_the_gioi && !!co_bang_chung
  return { cho_phep,
    ly_do: cho_phep ? 'có biến-cố-thế-giới + bằng-chứng → cho re-founding telos'
                    : 'thiếu biến-cố-thế-giới/bằng-chứng → KHÔNG đổi telos, đưa Cổng CEO' }
}

// ── khepVong — điều-phối ĐƠN/SONG-vòng + Cổng CEO (LG-3-PHA3-don-vong/song-vong/ceo, INV-1/6) ──
// input: { dat_kpi, vong_da_chay, co_so_that, tin_hieu, bien_co_the_gioi, co_bang_chung }
function khepVong(input) {
  const s = input || {}
  const vong = s.vong_da_chay || 0
  // đạt KPI/OKR → PASS việc (xét PROMOTE TÁCH RIÊNG ở kho.them)
  if (s.dat_kpi) return { ket: 'PASS', xet_promote: true, vong_da_chay: vong, K, ly_do: 'đạt neo OKR/KPI' }
  // chưa hết K → ĐƠN-VÒNG vá tại-chỗ TRONG khuôn cũ (KHÔNG leo tầng), ghi lessons.md
  if (vong < K) {
    return { ket: 'DON_VONG', tang_leo: null, vong_da_chay: vong, vong_moi: vong + 1, K,
      ghi: 'lessons.md', ly_do: `vá tại-chỗ (vòng ${vong + 1}/${K})` }
  }
  // hết K mà CHƯA có SỐ THẬT → KHÔNG lặp mù → Cổng CEO
  if (!s.co_so_that) {
    return { ket: 'CONG_CEO', vong_da_chay: vong, K,
      ly_do: `hết K=${K} vòng nhưng chưa có số thật → CEO quyết (giết/đổi-hướng)` }
  }
  // hết K + có SỐ THẬT → SONG-VÒNG leo tầng (định-tuyến rule-engine §6.2)
  const route = re.routeSongVong(s.tin_hieu)
  if (!route.tang_leo) {
    return { ket: 'CONG_CEO', vong_da_chay: vong, K, nen: route.nen,
      ly_do: 'không nhận-diện tầng leo từ tín-hiệu → CEO quyết' }
  }
  // chạm telos: chỉ cho re-founding khi có biến-cố-thế-giới + bằng-chứng (INV-7)
  if (route.tang_leo === 'telos') {
    const g = guardTelos(s)
    if (!g.cho_phep) {
      return { ket: 'CONG_CEO', tang_leo: 'telos', vong_da_chay: vong, K, nen: route.nen, ly_do: g.ly_do }
    }
  }
  return {
    ket: 'SONG_VONG', tang_leo: route.tang_leo, file_neo: route.file_neo, nhip: route.nhip, nen: route.nen,
    cascade: true, ghi_decisions: { altitude: route.tang_leo }, vong_da_chay: vong, K,
    ly_do: `hết K + có số thật → leo tầng ${route.tang_leo}: neo Brain + ghi decisions-log + cascade sinh-lại nhánh dưới`,
  }
}

module.exports = { K, STAGES, nextStage, congPass, congGiaiDoan, guardTelos, khepVong }
