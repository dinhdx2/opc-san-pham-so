'use strict'
// Tiêu-chí chấp-nhận spec 03d §8 (khép-vòng có tầng PHA 3) — đơn/song-vòng + PASS + cổng GĐ + warn + CEO.
const { test } = require('./harness')
const loop = require('../lib/loop')

// §8.3a Cổng PASS việc (đo so neo OKR/KPI) — TÁCH PROMOTE
test('PASS — số đo ≥ ngưỡng → pass + xét promote', 'LG-3-PHA3-pass', t => {
  const r = loop.congPass({ do_duoc: 0.18, nguong: 0.15 })
  t.ok(r.pass); t.ok(r.xet_promote)
})
test('PASS — số đo < ngưỡng → KHÔNG pass', 'LG-3-PHA3-pass', t => {
  t.ok(!loop.congPass({ do_duoc: 0.06, nguong: 0.15 }).pass)
})

// §8.5 Cổng GIAI-ĐOẠN: đủ mục-tiêu GĐ → re-debate số thật → GĐ kế
test('Cổng GĐ — đủ mục-tiêu GĐ4 → mở cổng, re-debate, stage_ke=GD5', 'LG-3-PHA3-gate-gd', t => {
  const r = loop.congGiaiDoan({ du_muc_tieu: true, stage: 'GD4' })
  t.ok(r.mo_cong); t.ok(r.can_re_debate); t.eq(r.stage_ke, 'GD5'); t.eq(r.quay_pha, 'PHA1')
})
test('Cổng GĐ — chưa đủ mục-tiêu → cổng đóng, giữ stage', 'LG-3-PHA3-gate-gd', t => {
  const r = loop.congGiaiDoan({ du_muc_tieu: false, stage: 'GD4' })
  t.ok(!r.mo_cong); t.eq(r.stage_ke, 'GD4')
})
test('Cổng GĐ §8.5 — đủ mục-tiêu NHƯNG re-debate số-thật FAIL → Ở-LẠI GĐ (chống mở-rộng-sớm)', 'LG-3-PHA3-gate-gd', t => {
  const fail = loop.congGiaiDoan({ du_muc_tieu: true, stage: 'GD4', re_debate_pass: false })
  t.ok(!fail.mo_cong, 'FAIL → cổng đóng'); t.eq(fail.stage_ke, 'GD4', 'ở-lại GĐ4'); t.includes(fail.ly_do, 'mở-rộng-sớm')
  const pass = loop.congGiaiDoan({ du_muc_tieu: true, stage: 'GD4', re_debate_pass: true })
  t.ok(pass.mo_cong, 'PASS → mở cổng'); t.eq(pass.stage_ke, 'GD5', 'nâng GĐ5')
})
test('nextStage — cấp-trần ở GĐ6', 'LG-3-PHA3-gate-gd', t => {
  t.eq(loop.nextStage('GD6'), 'GD6')
})
test('nextStage — chấp nhãn có dấu "GĐ4" (doc/vault) → GD5 (chuẩn-hoá GĐ→GD)', 'LG-3-PHA3-gate-gd', t => {
  t.eq(loop.nextStage('GĐ4'), 'GD5', 'GĐ4 (có dấu) → GD5')
  t.eq(loop.congGiaiDoan({ du_muc_tieu: true, stage: 'GĐ4', re_debate_pass: true }).stage_ke, 'GD5', 'cổng GĐ chấp nhãn có dấu')
})

// §8.4 Guard telos — đừng đổi telos vì 1 chiến-dịch lỗi
test('warn — chạm telos thiếu biến-cố/bằng-chứng → KHÔNG cho phép', 'LG-3-PHA3-warn', t => {
  t.ok(!loop.guardTelos({ bien_co_the_gioi: false, co_bang_chung: true }).cho_phep)
})
test('warn — biến-cố-thế-giới + bằng-chứng → cho re-founding', 'LG-3-PHA3-warn', t => {
  t.ok(loop.guardTelos({ bien_co_the_gioi: true, co_bang_chung: true }).cho_phep)
})

// §8.1 ĐƠN-VÒNG (≤K) — vá tại-chỗ, KHÔNG leo tầng
test('khepVong — đạt KPI → PASS (xét promote)', 'LG-3-PHA3-pass', t => {
  const r = loop.khepVong({ dat_kpi: true, vong_da_chay: 0 })
  t.eq(r.ket, 'PASS'); t.ok(r.xet_promote)
})
test('khepVong — chưa hết K, fail → ĐƠN-VÒNG (tang_leo=null), ghi lessons.md', 'LG-3-PHA3-don-vong', t => {
  const r = loop.khepVong({ dat_kpi: false, vong_da_chay: 1, tin_hieu: 'moat xói' })
  t.eq(r.ket, 'DON_VONG'); t.eq(r.tang_leo, null); t.eq(r.vong_moi, 2); t.eq(r.ghi, 'lessons.md')
})

// §8.4 hết K + chưa có số thật → Cổng CEO (không lặp mù)
test('khepVong — hết K + CHƯA số thật → Cổng CEO', 'LG-3-PHA3-ceo', t => {
  const r = loop.khepVong({ dat_kpi: false, vong_da_chay: loop.K, co_so_that: false, tin_hieu: 'moat xói' })
  t.eq(r.ket, 'CONG_CEO')
})

// §8.2 hết K + có số thật → SONG-VÒNG leo tầng + cascade
test('khepVong — hết K + số thật + "moat xói" → SONG-VÒNG tầng moat, cascade', 'LG-3-PHA3-song-vong', t => {
  const r = loop.khepVong({ dat_kpi: false, vong_da_chay: loop.K, co_so_that: true, tin_hieu: 'moat xói · kinh-tế-đơn-vị xấu' })
  t.eq(r.ket, 'SONG_VONG'); t.eq(r.tang_leo, 'moat'); t.ok(r.cascade)
  t.eq(r.ghi_decisions.altitude, 'moat'); t.ok(!r.file_neo.includes('telos.md'))
})

// §8.4 INV-7 — tín-hiệu chạm telos nhưng thiếu biến-cố → Cổng CEO (KHÔNG sửa telos.md)
test('khepVong — "èo-uột" (telos) thiếu biến-cố → Cổng CEO, KHÔNG leo telos', ['LG-3-PHA3-warn','LG-3-PHA3-ceo'], t => {
  const r = loop.khepVong({ dat_kpi: false, vong_da_chay: loop.K, co_so_that: true,
    tin_hieu: 'chạy đúng mọi thứ vẫn èo-uột', bien_co_the_gioi: false })
  t.eq(r.ket, 'CONG_CEO'); t.eq(r.tang_leo, 'telos')
})
test('khepVong — telos + biến-cố-thế-giới + bằng-chứng → SONG-VÒNG telos', 'LG-3-PHA3-warn', t => {
  const r = loop.khepVong({ dat_kpi: false, vong_da_chay: loop.K, co_so_that: true,
    tin_hieu: 'chạy đúng mọi thứ vẫn èo-uột', bien_co_the_gioi: true, co_bang_chung: true })
  t.eq(r.ket, 'SONG_VONG'); t.eq(r.tang_leo, 'telos')
})
