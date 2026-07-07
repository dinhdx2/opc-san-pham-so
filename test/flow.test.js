'use strict'
// Tiêu-chí chấp-nhận spec 03c §8 (router + cổng cứng), 03d §8.2 (định-tuyến), 03e §8.1 (3-phép-thử).
const { test } = require('./harness')
const flow = require('../lib/flow')

// 03c §8.1 router
test('R1 1 phòng → SIMPLE/sonnet/rút-gọn', 'LG-3-PHA2-router', t => {
  const r = flow.routerClass(['dept-03']); t.eq(r.scale, 'SIMPLE'); t.eq(r.model_tier, 'sonnet'); t.ok(!r.full_4_pha)
})
test('R2 4 phòng → COMPLEX, cross-exam 1 vòng', 'LG-3-PHA2-router', t => {
  const r = flow.routerClass(['dept-03','dept-05','dept-01','dept-06']); t.eq(r.scale, 'COMPLEX'); t.eq(r.max_xexam_rounds, 1)
})
test('R3 8 phòng → STRATEGIC, full 4-pha, ≤2 vòng', 'LG-3-PHA2-router', t => {
  const r = flow.routerClass('a b c d e f g h'.split(' ')); t.eq(r.scale, 'STRATEGIC'); t.ok(r.full_4_pha); t.eq(r.max_xexam_rounds, 2)
})

// 03/03c §4.2 router 1 hành-động: scale TRỰC-GIAO cổng cứng (R3)
test('§4.2 R3 — hành-động SIMPLE chạm chi-tiền VẪN NEED-APPROVAL (scale ⟂ cổng)', ['LG-3-PHA2-router','LG-3-PHA2-gate-cung'], t => {
  const r = flow.routerHanhDong('Đổ $200 ngân-sách ads', ['dept-03'])
  t.eq(r.scale, 'SIMPLE'); t.eq(r.cong, 'NEED-APPROVAL')
})
test('§4.2 — hành-động liên 8 phòng + chỉ nháp → STRATEGIC, cổng none', 'LG-3-PHA2-router', t => {
  const r = flow.routerHanhDong('Soạn chiến-lược toàn công-ty', 'a b c d e f g h'.split(' '))
  t.eq(r.scale, 'STRATEGIC'); t.eq(r.cong, 'none')
})
test('D3 model_tier theo scale: SIMPLE→sonnet; COMPLEX/STRATEGIC→opus_cho_phong_loi (map phòng→model thật ở debate.js)', ['LG-3-PHA2-router'], t => {
  t.eq(flow.routerClass(['d1', 'd2']).model_tier, 'sonnet', 'SIMPLE → sonnet')
  t.eq(flow.routerClass('a b c d'.split(' ')).model_tier, 'opus_cho_phong_loi', 'COMPLEX → opus lõi')
  t.eq(flow.routerClass('a b c d e f g h'.split(' ')).model_tier, 'opus_cho_phong_loi', 'STRATEGIC → opus lõi')
})
test('D4 INV-5 "trả lãi": KHO giàu hơn ⇒ reuse_ratio đường-cong kế ≥ trước', ['LG-3-PHA4-rule'], t => {
  const curveN = [{ ket_luan: 'reuse' }, { ket_luan: 'new' }, { ket_luan: 'new' }, { ket_luan: 'new' }]       // KHO nghèo
  const curveN1 = [{ ket_luan: 'reuse' }, { ket_luan: 'adapt' }, { ket_luan: 'reuse' }, { ket_luan: 'new' }]   // KHO giàu hơn
  t.ok(flow.reuseRatio(curveN1) >= flow.reuseRatio(curveN), 'ratio(n+1) ≥ ratio(n)')
  t.ok(flow.reuseRatio(curveN1) > flow.reuseRatio(curveN), `tăng thực: ${flow.reuseRatio(curveN)} → ${flow.reuseRatio(curveN1)}`)
  t.eq(flow.reuseRatio([]), 0, 'KHO rỗng → 0')
})

// 03c §8.2 cổng cứng chặn AI-AUTO
const HARD = [
  ['G1 chi tiền', 'Đổ $200 ngân-sách ads'],
  ['G2 ký/nộp pháp-lý', 'Submit form đăng-ký kinh-doanh'],
  ['G3 công-bố', 'Publish landing page ra công-chúng'],
  ['G4 gửi email/tin', 'Gửi email chào-hàng tới list KH'],
  ['G5 không hoàn-tác', 'Xoá toàn-bộ bucket cũ'],
]
for (const [name, step] of HARD) {
  test(`${name} → NEED-APPROVAL (không thể AI-AUTO)`, 'LG-3-PHA2-gate-cung', t => {
    const r = flow.phanLoaiBuoc(step)
    t.eq(r.loai, 'NEED_APPROVAL'); t.eq(r.cong, 'NEED-APPROVAL')
  })
}
test('G6 chỉ nháp ("Soạn 4 trang policy FTC") → AI-AUTO', 'LG-3-PHA2-gate-cung', t => {
  const r = flow.phanLoaiBuoc('Soạn 4 trang policy theo FTC'); t.eq(r.loai, 'AI_AUTO'); t.eq(r.cong, 'none')
})
test('HUMAN-ONLY: "Mở PayPal Business (KYC)" → HUMAN_ONLY, cong=HUMAN (bất-biến §3.3: none chỉ khi AI_AUTO)', 'LG-3-PHA2-executor', t => {
  const r = flow.phanLoaiBuoc('Mở PayPal Business KYC')
  t.eq(r.loai, 'HUMAN_ONLY'); t.eq(r.cong, 'HUMAN'); t.eq(r.owner, 'Human')
})
test('E2 bất-biến cong⟂loai: cong=none ⟺ loai=AI_AUTO (toàn HARD set + HUMAN_ONLY + AI_AUTO)', 'LG-3-PHA2-gate-cung', t => {
  const cases = ['Đổ $200 ngân-sách ads', 'ký hợp-đồng thuê', 'publish landing page', 'gửi email tới khách', 'xoá bảng dữ-liệu', 'Mở PayPal Business KYC', 'Soạn 4 trang policy theo FTC']
  for (const s of cases) {
    const r = flow.phanLoaiBuoc(s)
    t.eq(r.cong === 'none', r.loai === 'AI_AUTO', `cong=none ⟺ AI_AUTO cho "${s}"`)
  }
})
test('§8.3 E1 validateRunState — DONE thiếu bang_chung → lỗi; có bang_chung → OK', 'LG-3-PHA2-executor', t => {
  const bad = flow.validateRunState([{ id: 'W1-01', loai: 'AI_AUTO', cong: 'none', owner: 'AI', trang_thai: 'DONE', bang_chung: '' }])
  t.ok(!bad.ok && bad.errors.some(e => e.includes('E1')), 'DONE rỗng bang_chung → E1 lỗi')
  const ok = flow.validateRunState([{ id: 'W1-01', loai: 'AI_AUTO', cong: 'none', owner: 'AI', trang_thai: 'DONE', bang_chung: 'out.csv' }])
  t.ok(ok.ok, 'DONE có bang_chung → OK')
})
test('§8.3 E2 validateRunState — cong⟂loai sai → lỗi', 'LG-3-PHA2-executor', t => {
  t.ok(!flow.validateRunState([{ id: 'x', loai: 'AI_AUTO', cong: 'NEED-APPROVAL', owner: 'AI', trang_thai: 'TODO' }]).ok, 'AI_AUTO mà cong≠none → lỗi')
  t.ok(!flow.validateRunState([{ id: 'x', loai: 'NEED_APPROVAL', cong: 'none', owner: 'AI+Human', trang_thai: 'TODO' }]).ok, 'cong=none mà không AI_AUTO → lỗi')
  t.ok(flow.validateRunState([{ id: 'x', loai: 'HUMAN_ONLY', cong: 'HUMAN', owner: 'Human', trang_thai: 'TODO' }]).ok, 'HUMAN_ONLY⇒HUMAN → OK')
})
test('§8.3 E3 validateResume — bước DONE bị hạ/ghi-đè khi resume → lỗi', 'LG-3-PHA2-executor', t => {
  const prev = [{ id: 'W1-01', trang_thai: 'DONE', bang_chung: 'out.csv' }]
  t.ok(flow.validateResume(prev, [{ id: 'W1-01', trang_thai: 'DONE', bang_chung: 'out.csv' }]).ok, 'giữ nguyên → OK')
  t.ok(!flow.validateResume(prev, [{ id: 'W1-01', trang_thai: 'TODO' }]).ok, 'hạ DONE→TODO → lỗi')
  t.ok(!flow.validateResume(prev, [{ id: 'W1-01', trang_thai: 'DONE', bang_chung: 'khac.csv' }]).ok, 'ghi-đè bang_chung → lỗi')
})

// 03d §8.2 định-tuyến song-vòng
test('song-vòng "moat xói" → tầng moat, neo positioning/products/budget', 'LG-3-PHA3-song-vong', t => {
  const r = flow.dinhTuyenTang('moat xói · kinh-tế-đơn-vị xấu')
  t.eq(r.tang_leo, 'moat'); t.ok(!r.file_neo.includes('telos.md'), 'không đụng telos')
})

// 03e §8.1 bảng quyết-định 3-phép-thử
test('T1 moat chuyển·telos chung·tên giúp → {GD5_noi, cung_nha, ten_me}', ['LG-3-PHA4-test1','LG-3-PHA4-test2','LG-3-PHA4-test3'], t => {
  t.eq(flow.chay3PhepThu({ moat: 'chuyen_duoc', telos: 'chung', brand: 'giup' }),
    { test_moat: 'chuyen_duoc', test_telos: 'chung', test_brand: 'giup', loai_mo_rong: 'GD5_noi', nha: 'cung_nha', ten: 'ten_me', reentry_stage: 'PHA1', prefer: 'REUSE' })
})
test('T3 moat phải-bồi·telos khác·tên không → {GD6_de, brand_moi, ten_phu}', ['LG-3-PHA4-test1','LG-3-PHA4-test2','LG-3-PHA4-test3'], t => {
  const r = flow.chay3PhepThu({ moat: 'phai_boi', telos: 'khac', brand: 'khong_giup' })
  t.eq(r.loai_mo_rong, 'GD6_de'); t.eq(r.nha, 'brand_moi'); t.eq(r.ten, 'ten_phu')
})
test('T4 trực-giao: moat chuyển + telos khác → GD5_noi ĐỘC-LẬP brand_moi', 'LG-3-PHA4-rule', t => {
  const r = flow.chay3PhepThu({ moat: 'chuyen_duoc', telos: 'khac', brand: 'giup' })
  t.eq(r.loai_mo_rong, 'GD5_noi'); t.eq(r.nha, 'brand_moi')
})

// 03e §8.2-8.3 tái-nhập bootstrap từ KHO + reuse_ratio "trả lãi"
test('reuseRatio — [reuse, adapt, new] → 0.67; rỗng → 0', 'LG-3-PHA4-rule', t => {
  t.eq(flow.reuseRatio([{ ket_luan: 'reuse' }, { ket_luan: 'adapt' }, { ket_luan: 'new' }]), 0.67)
  t.eq(flow.reuseRatio([]), 0)
})
test('taiNhapBootstrap — GĐ5-nới: tra KHO khớp → REUSE, re-nhập PHA1, reuse_ratio>0', 'LG-3-PHA4-rule', t => {
  const idx = [{ id: 'fnb.k5.dept-05.bep-trung-tam', trang_thai: 'live', ten_nang_luc: 'bếp trung-tâm',
    khia_canh: 'asp-van-hanh', gd: 'GĐ4-5', io: { vao: 'nguyên-liệu', ra: 'món chuẩn-hoá' }, reuse_grade: 'A' }]
  const canDung = [{ ten_nang_luc: 'bếp trung-tâm', khia_canh: 'asp-van-hanh', gd: 'GĐ5',
    io: { vao: 'nguyên-liệu', ra: 'món chuẩn-hoá' } }]
  const r = flow.taiNhapBootstrap({ loai_mo_rong: 'GD5_noi', reentry_stage: 'PHA1', prefer: 'REUSE' }, canDung, idx)
  t.eq(r.reentry_stage, 'PHA1'); t.eq(r.prefer, 'REUSE'); t.ok(r.reuse_ratio > 0, 'có tái-dùng KHO')
  t.eq(r.bootstrap[0].ket_luan, 'reuse')
})
test('taiNhapBootstrap — GĐ6-đẻ: KHO rỗng → NEW, re-nhập PHA0, ADAPT, reuse_ratio=0', 'LG-3-PHA4-rule', t => {
  const r = flow.taiNhapBootstrap({ loai_mo_rong: 'GD6_de', reentry_stage: 'PHA0', prefer: 'ADAPT' },
    [{ ten_nang_luc: 'năng-lực mới hoàn-toàn' }], [])
  t.eq(r.reentry_stage, 'PHA0'); t.eq(r.prefer, 'ADAPT'); t.eq(r.reuse_ratio, 0); t.eq(r.bootstrap[0].ket_luan, 'new')
})

// 03 §3/§4.1 luồng tổng PHA 0→4 — state-machine + invariant thứ-tự
test('buocLuong PHA0 — G0 FAIL → block quay CEO; G0 PASS → PHA1 (cổng A)', 'LG-3-flow', t => {
  t.ok(flow.buocLuong('PHA0', { g0_pass: false }).block, 'G0 fail → block')
  const r = flow.buocLuong('PHA0', { g0_pass: true }); t.eq(r.pha_ke, 'PHA1'); t.eq(r.cong, 'A')
})
test('buocLuong PHA1 — thiếu Cổng A/B → chặn; đủ → PHA2', 'LG-3-flow', t => {
  t.eq(flow.buocLuong('PHA1', {}).cong, 'A')
  t.eq(flow.buocLuong('PHA1', { cong_a: true }).cong, 'B')
  t.eq(flow.buocLuong('PHA1', { cong_a: true, cong_b: true }).pha_ke, 'PHA2')
})
test('buocLuong PHA2 — chưa số thật ở lại; có số thật → PHA3', 'LG-3-flow', t => {
  t.eq(flow.buocLuong('PHA2', {}).pha_ke, 'PHA2')
  t.eq(flow.buocLuong('PHA2', { co_so_that: true }).pha_ke, 'PHA3')
})
test('buocLuong PHA3 — verdict khép-vòng định-tuyến đúng', 'LG-3-flow', t => {
  t.eq(flow.buocLuong('PHA3', { ket_khep_vong: 'DON_VONG' }).pha_ke, 'PHA2')
  t.ok(flow.buocLuong('PHA3', { ket_khep_vong: 'SONG_VONG' }).cascade)
  t.ok(flow.buocLuong('PHA3', { ket_khep_vong: 'CONG_CEO' }).block)
  t.ok(flow.buocLuong('PHA3', { ket_khep_vong: 'PASS', du_muc_tieu_gd: true }).stage_ke, 'PASS+đủ GĐ → PHA1 GĐ kế')
  t.eq(flow.buocLuong('PHA3', { ket_khep_vong: 'PASS', du_muc_tieu_gd: true, mo_rong: true }).pha_ke, 'PHA4')
})
test('buocLuong PHA4 — GĐ5-nới→PHA1, GĐ6-đẻ→PHA0 (bootstrap)', 'LG-3-flow', t => {
  t.eq(flow.buocLuong('PHA4', { loai_mo_rong: 'GD5_noi' }).pha_ke, 'PHA1')
  const r = flow.buocLuong('PHA4', { loai_mo_rong: 'GD6_de' }); t.eq(r.pha_ke, 'PHA0'); t.ok(r.bootstrap)
})
test('kiemTraThuTu — chuỗi hợp-lệ (gồm tái-nhập) PASS; nhảy vượt pha / không bắt-đầu PHA0 → FAIL', 'LG-3-flow', t => {
  t.ok(flow.kiemTraThuTu(['PHA0', 'PHA1', 'PHA2', 'PHA3', 'PHA1', 'PHA2', 'PHA3', 'PHA4', 'PHA0']).ok, 'sinh xuống + tái-nhập')
  t.ok(!flow.kiemTraThuTu(['PHA0', 'PHA2']).ok, 'nhảy 0→2')
  t.ok(!flow.kiemTraThuTu(['PHA1', 'PHA2']).ok, 'không bắt-đầu PHA0')
})

// scaffold orchestration PHA 0/1 — gói engine call thành 1 entry-point (không sinh nội-dung)
const BRAIN_OK = {
  canon: {
    strategy: { exists: true, content: 'ICP dân văn-phòng, định-vị phở trưa' },
    products: { exists: true, content: 'giá 45k, biên 18%' },
    budget: { exists: true, content: 'doanh thu 1.2 tỷ/tháng, biên 18%' },
    state: { exists: true, content: 'GĐ4, 4 quán' }, headcount: { exists: true, content: '5 người/quán' },
  },
  telos: { telos: 'Cho người Sài-Gòn bát phở Bắc chuẩn-vị nhanh sạch giá bình-dân', boundaries: ['không món lai-tạp'], approved_by: 'CEO' },
  positioning: { beachhead: 'dân văn-phòng', wedge: 'phở trưa', moat: 'công-thức nước-dùng' },
  state: { stage: 'GD4' },
}
test('chuanBiPHA0 — gói stage+G0+coverage; Brain đủ + khai lệch → sẵn-sàng PHA1 + cảnh-báo', ['LG-3-PHA0-stage1', 'LG-3-PHA0-stage2'], t => {
  const r = flow.chuanBiPHA0({ brain: BRAIN_OK, evidence: 'giao ổn, tối-ưu biên lãi từng đơn-vị', stage_khai: 'GD5' })
  t.eq(r.stage, 'GD4'); t.ok(r.canh_bao.length > 0, 'reality-check khai GĐ5>GĐ4'); t.ok(r.g0_pass); t.ok(r.san_sang_pha1)
})
test('chuanBiPHA0 — telos chưa CEO duyệt → G0 fail → KHÔNG sẵn-sàng PHA1', 'LG-3-PHA0-stage3', t => {
  const B = Object.assign({}, BRAIN_OK, { telos: Object.assign({}, BRAIN_OK.telos, { approved_by: 'AI' }) })
  const r = flow.chuanBiPHA0({ brain: B })
  t.ok(!r.g0_pass); t.ok(!r.san_sang_pha1)
})
test('chuanBiPHA0 — trả stage_theo_duong_cong (hợp-đồng-Ra 03a §8.3, DN nhiều curve)', 'LG-3-PHA0-stage2', t => {
  const B = Object.assign({}, BRAIN_OK, { curves: { curves: [
    { name: 'lõi', evidence: 'lõi chín, lời đều, gieo đường-cong kế second-curve' },
    { name: 'bet', evidence: 'mới ý-tưởng, chưa có sản-phẩm' },
  ] } })
  const r = flow.chuanBiPHA0({ brain: B })
  t.ok(Array.isArray(r.stage_theo_duong_cong) && r.stage_theo_duong_cong.length === 2, 'có mảng per-curve 2 dòng')
  t.eq(r.stage_theo_duong_cong.find(c => c.name === 'lõi').stage, 'GD6')
  t.eq(r.stage_theo_duong_cong.find(c => c.name === 'bet').stage, 'GD1')
  t.eq(flow.chuanBiPHA0({ brain: BRAIN_OK }).stage_theo_duong_cong, [], 'không curves → []')
})
test('chuanBiPHA1 — scaffold GĐ4: khía-cạnh active + lưới 5 hàng + thứ-tự gom-ngược', ['LG-3-PHA1-1B', 'LG-3-PHA1-1C'], t => {
  const s = flow.chuanBiPHA1('GD4')
  t.ok(s.khia_canh_active.length >= 1 && s.khia_canh_active.every(k => k.mau_muc_tieu), 'mỗi khía-cạnh active có mẫu mục-tiêu')
  t.ok(!s.khia_canh_active.some(k => k.aspect === 11), 'Bền-vững NGỦ ở GĐ4 → không trong active')
  t.eq(s.luoi_taskgen.length, 5); t.eq(s.thu_tu_gom[0], 'nhiệm-vụ-con'); t.eq(s.thu_tu_gom[3], 'khối')
})
test('chuanBiPHA2 — scaffold per-hành-động: SIMPLE-nháp không debate/SOP; COMPLEX+chi-tiền → debate + NEED-APPROVAL + SOP', ['LG-3-PHA2-router', 'LG-3-PHA2-debate', 'LG-3-PHA2-executor'], t => {
  const r = flow.chuanBiPHA2([
    { hanh_dong: 'Soạn 4 trang policy theo FTC', depts: ['dept-01'] },
    { hanh_dong: 'Đàm-phán giá thịt bò + đổ ngân-sách 4 quán', depts: ['dept-03', 'dept-05', 'dept-01', 'dept-06'] },
  ])
  t.eq(r[0].scale, 'SIMPLE'); t.ok(!r[0].can_debate); t.eq(r[0].file_sop, null)
  t.eq(r[1].scale, 'COMPLEX'); t.ok(r[1].can_debate, 'COMPLEX → hội-đồng quyết-nghị'); t.eq(r[1].cong, 'NEED-APPROVAL')
  t.ok(/^10-thuc-thi-[a-z0-9-]+\.md$/.test(r[1].file_sop), 'có file SOP slug ascii')
})
