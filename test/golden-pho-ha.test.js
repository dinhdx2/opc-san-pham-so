'use strict'
// Golden-fixture Phở Hà — test tích-hợp đầu-cuối PHA 0→4 (spec 07 §8, B7 của _PLAN.md).
// Ráp các hàm lib lại, assert đúng "đáp-án vàng" §7 SoT. FAIL ⇒ chỉ-điểm spec 03a-03e hồi-quy.
const path = require('path')
const fs = require('fs')
const { test } = require('./harness')
const re = require('../lib/rule-engines')
const flow = require('../lib/flow')
const kho = require('../lib/kho')
const loop = require('../lib/loop')

// ── INPUT FIXTURE (Brain Phở Hà) — spec 07 §3 ────────────────────────────────
const BUDGET_EVIDENCE = 'quán-1 biên ròng 18%, quán-2 18%, quán-3 lẹt-đẹt biên 6%, quán-4 mở 3 tháng chưa hòa-vốn — đang tối-ưu biên lãi từng đơn-vị'
const STAGE_KHAI = 'GD5'

// ── t-PHA0: reality-check stage = GĐ4 (không GĐ5) ───────────────────────────
test('t-PHA0 — khai GĐ5 nhưng bằng-chứng GĐ4 → giữ GĐ4 + HOÃN mở-rộng/vốn', 'LG-7-PHA0', t => {
  const r = re.detectStage({ budget: BUDGET_EVIDENCE }, STAGE_KHAI)
  t.eq(r.stage, 'GD4', 'bằng-chứng thắng nhãn')
  t.ok(r.canh_bao.some(c => c.includes('BLOCK_MO_RONG_SOM')), 'cảnh-báo hoãn mở 10 quán / vốn')
})

// ── t-PHA1: duyệt 11 khía-cạnh ở GĐ4 ────────────────────────────────────────
test('t-PHA1 — GĐ4: Tiền/Hậu-cần/Vận-hành/Dữ-liệu/Rủi-ro/Con-người ✓; Bền-vững NGỦ; mục-tiêu Tiền chứa "biên"', 'LG-7-PHA1', t => {
  const active = re.goalScan('GD4').map(g => g.aspect)
  for (const a of [4, 6, 7, 8, 9, 5]) t.ok(active.includes(a), `khía-cạnh ${a} CÓ ở GĐ4`)
  t.ok(!re.goalByAspect(11, 'GD4').active, 'Bền-vững NGỦ ở GĐ4')
  t.ok(re.goalByAspect(10, 'GD4').active, 'Đối-tác THỨC ở GĐ4 (nhưng vốn HOÃN theo PHA0)')
  t.includes(re.goalByAspect(4, 'GD4').mau_muc_tieu, 'Biên lãi/đv')
})

// ── t-PHA1C: gom ngược-lên + tra-kho = 4 reuse/adapt + 1 NEW ─────────────────
test('t-PHA1C — 4/5 bộ-phận REUSE/ADAPT, 1 NEW (BI/Báo-cáo)', 'LG-7-PHA1C', t => {
  const index = kho.parseIndexMd(fs.readFileSync(path.join(__dirname, 'fixtures/fnb_index.md'), 'utf8'))
  const queries = [
    { ten_nang_luc: 'Sản-xuất & Chuẩn-hoá món', khia_canh: 'Vận-hành', gd: 'GĐ4', io: { vao: 'NL thô', ra: 'món chuẩn-hoá' } },
    { ten_nang_luc: 'Thu-mua & Cung-ứng', khia_canh: 'Hậu-cần', gd: 'GĐ4', io: { vao: 'nhu-cầu thịt bò gộp', ra: 'giá theo sản-lượng' } },
    { ten_nang_luc: 'Kiểm-soát giá-vốn', khia_canh: 'Tiền', gd: 'GĐ4', io: { vao: 'giao-dịch', ra: 'biên lãi' } },
    { ten_nang_luc: 'An-toàn thực-phẩm', khia_canh: 'Rủi-ro', gd: 'GĐ4', io: { vao: 'quy-trình bếp', ra: 'chứng-nhận VSATTP' } },
    { ten_nang_luc: 'BI & Báo-cáo', khia_canh: 'Dữ-liệu', gd: 'GĐ4', io: { vao: 'sự-kiện POS', ra: 'dashboard' } },
  ]
  const ket = queries.map(q => {
    const uv = kho.tra(q, index)
    return uv.length === 0 ? 'new' : uv[0].ket_luan
  })
  const taiDung = ket.filter(k => k === 'reuse' || k === 'adapt').length
  const them = ket.filter(k => k === 'new').length
  t.eq(taiDung, 4, '4 tái-dùng (REUSE/ADAPT)')
  t.eq(them, 1, '1 NEW (BI/Báo-cáo)')
  t.eq(ket[1], 'adapt', 'Thu-mua ADAPT'); t.eq(ket[0], 'reuse', 'Bếp REUSE'); t.eq(ket[4], 'new', 'BI NEW')
})

// ── t-PHA2: router COMPLEX + cổng cứng ký HĐ NCC = NEED-APPROVAL ─────────────
test('t-PHA2 — đàm-phán thịt bò: router COMPLEX; ký HĐ NCC = NEED-APPROVAL', 'LG-7-PHA2', t => {
  t.eq(flow.routerClass(['dept-03', 'dept-05', 'dept-01', 'dept-06']).scale, 'COMPLEX')
  t.eq(flow.phanLoaiBuoc('Ký hợp-đồng NCC thịt bò').loai, 'NEED_APPROVAL')
})

// ── t-PHA3: song-vòng → định-vị (không telos); PROMOTE 3 → 3 dòng _index ─────
test('t-PHA3 — song-vòng tầng ĐỊNH-VỊ (không đụng telos) + PROMOTE 3 tài-sản', 'LG-7-PHA3', t => {
  const r = flow.dinhTuyenTang('quán-3 ế: mặt-bằng sai đầu-cầu')
  t.eq(r.tang_leo, 'dinh_vi', 'leo định-vị'); t.ok(!r.file_neo.includes('telos.md'), 'KHÔNG đụng telos')

  // quán-3 hết K vòng đơn-vòng vẫn ế + CÓ số thật → khép-vòng quyết SONG-VÒNG (đóng/dời, leo định-vị)
  const kv = loop.khepVong({ dat_kpi: false, vong_da_chay: loop.K, co_so_that: true, tin_hieu: 'quán-3 ế: mặt-bằng sai đầu-cầu' })
  t.eq(kv.ket, 'SONG_VONG', 'hết K + số thật → song-vòng (đóng/dời quán-3)'); t.eq(kv.tang_leo, 'dinh_vi')

  const index = []
  const assets = [
    { ten_nl: 'Cẩm-nang mở-điểm chuẩn', ten_nganh: 'Cẩm-nang mở-quán', nganh: 'fnb', maps_to: 'K5 / dept-05', khia_canh: 'Vận-hành', gd: 'GĐ3-5', io: { vao: 'quyết mở điểm', ra: 'điểm chạy chuẩn' } },
    { ten_nl: 'Bảng định-mức', ten_nganh: 'Bảng định-mức', nganh: 'fnb', maps_to: 'K5 / dept-05', khia_canh: 'Vận-hành', gd: 'GĐ3-5', io: { vao: 'công-thức', ra: 'định-mức NL' } },
    { ten_nl: 'BI & Báo-cáo', ten_nganh: 'BI/Báo-cáo quán', nganh: 'fnb', maps_to: 'K7 / dept-11', khia_canh: 'Dữ-liệu', gd: 'GĐ3-5', io: { vao: 'sự-kiện POS', ra: 'dashboard realtime' } },
  ]
  for (const a of assets) {
    const res = kho.them({ qua_cong_promote: true, tai_san_chuan: ['SOP.md'], meta: Object.assign({ reuse_grade: 'A', nguon: '2026-06-29-pho-ha', phien_ban: 'v1' }, a) }, index)
    t.ok(!res.reject, res.ly_do)
  }
  t.eq(index.filter(x => x.trang_thai === 'live').length, 3, '3 dòng _index.md (reuse-grade A)')

  // 3 quán ≥15% biên → đủ mục-tiêu GĐ4 → Cổng GIAI-ĐOẠN: re-debate số thật → GĐ5
  const cg = loop.congGiaiDoan({ du_muc_tieu: true, stage: 'GD4' })
  t.ok(cg.mo_cong && cg.can_re_debate, 'PASS GĐ4 → re-debate số thật'); t.eq(cg.stage_ke, 'GD5')
})

// ── t-PHA4: 3 đường-cong khác hình-thái (independent tests) ──────────────────
test('t-PHA4 — quán5-10=GĐ5-nới / phở-gói=GĐ6-đẻ brand-cũ / cà-phê=brand-mới', 'LG-7-PHA4', t => {
  const quan = flow.chay3PhepThu({ moat: 'chuyen_duoc', telos: 'chung', brand: 'giup' })
  t.eq(quan.loai_mo_rong, 'GD5_noi'); t.eq(quan.reentry_stage, 'PHA1'); t.eq(quan.prefer, 'REUSE')
  // quán5-10 (GĐ5-nới) MỒI cây từ KHO → reuse_ratio > 0 ("trả lãi" — tái-dùng tài-sản đã PROMOTE)
  const index = kho.parseIndexMd(fs.readFileSync(path.join(__dirname, 'fixtures/fnb_index.md'), 'utf8'))
  const boot = flow.taiNhapBootstrap(quan, [{ ten_nang_luc: 'Sản-xuất & Chuẩn-hoá món', khia_canh: 'Vận-hành', gd: 'GĐ5', io: { vao: 'NL thô', ra: 'món chuẩn-hoá' } }], index)
  t.eq(boot.reentry_stage, 'PHA1'); t.ok(boot.reuse_ratio > 0, 'GĐ5-nới reuse cây từ KHO')
  const phoGoi = flow.chay3PhepThu({ moat: 'phai_boi', telos: 'chung', brand: 'giup' })
  t.eq(phoGoi.loai_mo_rong, 'GD6_de'); t.eq(phoGoi.nha, 'cung_nha'); t.eq(phoGoi.ten, 'ten_me')
  const caPhe = flow.chay3PhepThu({ moat: 'phai_boi', telos: 'khac', brand: 'khong_giup' })
  t.eq(caPhe.nha, 'brand_moi')
})
