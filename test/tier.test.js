'use strict'
// Tiêu-chí chấp-nhận spec 01 §8 (mô-hình tầng + sinh nhiệm-vụ-chính).
const { test } = require('./harness')
const tier = require('../lib/tier')

// 8.1 validate_dung_tang
test('T1 mục-tiêu trạng-thái → OK', ['LG-1.3-muc-tieu','LG-1.1-8'], t => {
  t.ok(tier.validateDungTang({ tang: 'muc_tieu', ten: 'Hạ-tầng NHẬN thanh-toán sẵn-sàng & hợp-lệ' }).ok)
})
test('T2 mục-tiêu mở-đầu động-từ → FAIL (nén tầng)', ['LG-1.3-rule','LG-1.3-muc-tieu'], t => {
  t.ok(!tier.validateDungTang({ tang: 'muc_tieu', ten: 'Thông luồng thanh-toán US' }).ok)
})
test('T3 nhiệm-vụ-chính động-từ → OK', 'LG-1.3-nv-chinh', t => {
  t.ok(tier.validateDungTang({ tang: 'nv_chinh', ten: 'Thiết-lập luồng thanh-toán xuyên-biên' }).ok)
})
test('T4 nhiệm-vụ-chính không động-từ → FAIL', ['LG-1.3-nv-chinh','LG-1.3-rule'], t => {
  t.ok(!tier.validateDungTang({ tang: 'nv_chinh', ten: 'Hạ-tầng thu tiền sẵn-sàng' }).ok)
})
test('T5 mục-đích câu-sống-còn → OK', 'LG-1.3-muc-dich', t => {
  t.ok(tier.validateDungTang({ tang: 'muc_dich', ten: 'Chứng-minh có khách trả tiền lặp-lại' }).ok)
})
test('T6 nhiệm-vụ-con nguyên-tử → OK', 'LG-1.3-nv-con', t => {
  t.ok(tier.validateDungTang({ tang: 'nv_con', ten: 'Mở PayPal + KYC' }).ok)
})
test('T7 telos nguồn≠ceo → FAIL', ['LG-1.1-6'], t => {
  t.ok(!tier.validateDungTang({ tang: 'telos', ten: 'Đưa phở Việt ra thế-giới', nguon: 'ai' }).ok)
})
test('T7b dang_ngon_ngu khai mâu-thuẫn tầng → FAIL (§3.2 khóa validate)', ['LG-1.3-rule'], t => {
  // muc_tieu khai dang_ngon_ngu='dong_tu' (đúng phải 'trang_thai') → FAIL dù tên hợp-lệ
  const r = tier.validateDungTang({ tang: 'muc_tieu', ten: 'Hạ-tầng thu tiền sẵn-sàng', dang_ngon_ngu: 'dong_tu' })
  t.ok(!r.ok && r.ly_do.includes('dang_ngon_ngu'), 'khai dạng sai tầng → FAIL')
  t.ok(tier.validateDungTang({ tang: 'muc_tieu', ten: 'Hạ-tầng thu tiền sẵn-sàng', dang_ngon_ngu: 'trang_thai' }).ok, 'khai đúng dạng → OK')
  t.ok(tier.validateDungTang({ tang: 'nv_chinh', ten: 'Thiết-lập luồng thanh-toán', dang_ngon_ngu: 'dong_tu' }).ok, 'nv_chinh+dong_tu → OK')
  t.ok(tier.validateDungTang({ tang: 'muc_tieu', ten: 'Hạ-tầng thu tiền sẵn-sàng' }).ok, 'KHÔNG khai field → tương-thích ngược, OK')
})

// 8.2 POD "tiền" → đúng 4 nhiệm-vụ-chính
const POD = {
  ten: 'Hạ-tầng NHẬN thanh-toán từ khách Mỹ sẵn-sàng & hợp-lệ',
  dieu_kien_du: [
    { id: 'dk-cong-nhan-tien', ten: 'Thiết-lập PayPal Biz + Payoneer', chieu: 'tan', khia_canh: 'asp-tien', required: true },
    { id: 'dk-phap-nhan-kyc', ten: 'Hoàn-tất pháp-nhân & KYC xuyên-biên', chieu: 'tan', khia_canh: 'asp-rui-ro', required: true },
    { id: 'dk-khong-freeze', ten: 'Thiết-lập tuân-thủ policy chống giữ payout', chieu: 'thu', khia_canh: 'asp-rui-ro', required: true },
    { id: 'dk-rut-doi-soat', ten: 'Dựng luồng rút + đối-soát số', chieu: 'hau', khia_canh: 'asp-du-lieu', required: true },
  ],
}
test('8.2 POD tiền → 4 nhiệm-vụ-chính, đủ & neo đo', ['LG-1.3-vd-pod','LG-1.4-L1','LG-1.4-vd','LG-1.4-neo'], t => {
  const r = tier.sinhNhiemVuChinh(POD, { met: [] })
  t.eq(r.tap_nvc.length, 4, 'đúng 4 nhiệm-vụ-chính'); t.ok(r.du, 'back-test đủ')
  t.ok(r.tap_nvc.every(v => v.dong_dieu_kien && v.thuoc_do), 'mỗi nvc có điều-kiện + neo đo')
  t.eq(r.tap_nvc.find(v => v.chieu === 'tan').thuoc_do.loai, 'okr', 'tấn → OKR')
  t.eq(r.tap_nvc.find(v => v.chieu === 'hau').thuoc_do.loai, 'kpi_nguong', 'hậu → KPI-ngưỡng')
})
test('8.3 bỏ việc-④ ⇒ back-test FAIL', 'LG-1.4-gate', t => {
  const r = tier.sinhNhiemVuChinh(POD, { met: [] })
  const subset = r.tap_nvc.filter(v => v.dong_dieu_kien !== 'dk-rut-doi-soat')
  t.ok(!r.back_test(subset), 'bỏ ④ → không back-test được')
  t.ok(r.back_test(r.tap_nvc), 'đủ ④ → back-test được')
})
test('8.4 ba chiều tấn/thủ/hậu phủ đủ', 'LG-1.4-L2', t => {
  const r = tier.sinhNhiemVuChinh(POD, { met: [] })
  for (const c of ['tan', 'thu', 'hau']) t.ok(r.tap_nvc.some(v => v.chieu === c), `có việc chiều ${c}`)
})
test('8.4b TỐI-THIỂU KHÔNG cắt việc THỦ (pre-mortem) dù điều-kiện required:false (chống-sót Lớp 2)', ['LG-1.4-L2','LG-1.4-gate'], t => {
  // 1 việc TẤN required + 1 việc THỦ required:false (cover duy-nhất chiều thủ) — không được cắt
  const mt = { ten: 'Hạ-tầng NHẬN thanh-toán sẵn-sàng & hợp-lệ', dieu_kien_du: [
    { id: 'dk-tan', ten: 'Thiết-lập cổng thanh-toán', chieu: 'tan', khia_canh: 'asp-tien', required: true },
    { id: 'dk-thu', ten: 'Phòng-thủ chống freeze payout', chieu: 'thu', khia_canh: 'asp-rui-ro', required: false },
  ] }
  const r = tier.sinhNhiemVuChinh(mt, { met: [] })
  t.ok(r.tap_nvc.some(v => v.chieu === 'thu'), 'việc THỦ required:false vẫn được GIỮ (không cắt thừa)')
  t.ok(!r.thua.some(v => v.chieu === 'thu'), 'việc THỦ không bị xếp thừa')
})
test('Lớp 1 — điều-kiện ĐÃ đạt không sinh việc', 'LG-1.4-L1', t => {
  const r = tier.sinhNhiemVuChinh(POD, { met: ['dk-cong-nhan-tien'] })
  t.ok(!r.tap_nvc.some(v => v.dong_dieu_kien === 'dk-cong-nhan-tien'), 'đk đã đạt → bỏ')
})

// 8.5 Lớp 3 QUÉT-NGANG — đối-chiếu chéo 11 khía-cạnh, bắt việc sót xuyên-khía-cạnh
test('L3 POD — mọi khía-cạnh state chạm đều có việc ⇒ KHÔNG sót', ['LG-1.4-L3','LG-6.4-L3'], t => {
  const r = tier.sinhNhiemVuChinh(POD, { met: [] })
  t.eq(r.khia_canh_sot, [], 'Tiền/Rủi-ro/Dữ-liệu đều được phủ → không sót khía-cạnh')
})
test('L3 — state CHẠM khía-cạnh KHÔNG có điều-kiện ⇒ cờ sót cho architect', ['LG-1.4-L3','LG-6.4-L3'], t => {
  // muc-tiêu khai state chạm thêm Dữ-liệu nhưng KHÔNG cấp điều-kiện-đủ cho Dữ-liệu
  const mt = { ten: POD.ten, khia_canh_lien_quan: ['asp-tien', 'asp-rui-ro', 'asp-du-lieu'],
    dieu_kien_du: POD.dieu_kien_du.filter(d => d.khia_canh !== 'asp-du-lieu') }
  const r = tier.sinhNhiemVuChinh(mt, { met: [] })
  t.ok(r.khia_canh_sot.includes('asp-du-lieu'), 'đụng Dữ-liệu nhưng thiếu điều-kiện-đủ → cờ sót')
})
test('L3 — điều-kiện chéo có sẵn ⇒ SINH việc + hết sót', ['LG-1.4-L3','LG-6.4-L3'], t => {
  const mt = { ten: POD.ten, khia_canh_lien_quan: ['asp-tien', 'asp-rui-ro', 'asp-du-lieu'], dieu_kien_du: POD.dieu_kien_du }
  const r = tier.sinhNhiemVuChinh(mt, { met: [] })
  t.eq(r.khia_canh_sot, [], 'có điều-kiện Dữ-liệu → quét-ngang phủ đủ')
  t.ok(r.tap_nvc.some(v => v.khia_canh === 'asp-du-lieu'), 'việc Dữ-liệu (rút+đối-soát) được sinh/giữ')
})
test('L3 — khía-cạnh đang NGỦ theo GĐ ⇒ KHÔNG tính sót', 'LG-1.4-L3', t => {
  const mt = { ten: POD.ten, khia_canh_lien_quan: ['asp-tien', 'asp-rui-ro', 'asp-ben-vung'],
    khia_canh_ngu: ['asp-ben-vung'], dieu_kien_du: POD.dieu_kien_du.filter(d => d.khia_canh !== 'asp-du-lieu') }
  const r = tier.sinhNhiemVuChinh(mt, { met: [] })
  t.ok(!r.khia_canh_sot.includes('asp-ben-vung'), 'Bền-vững ngủ ở GĐ này → không cờ sót')
})

// 8.6 validate_cay_viec — CỔNG bẻ-xuống nhiệm-vụ-con (chống "quên bẻ nv-con", LG-6.4-L2)
test('CV1 mọi NVC có nv-con đủ chiều → OK', ['LG-6.4-L2','LG-1.3-nv-con'], t => {
  const cay = [
    { id: 'nvc-1.1', ten: 'Chốt phạm-vi hero kit', nv_con: [
      { ten: 'Liệt-kê 3 nỗi-đau → chọn 1', chieu: 'tan' },
      { ten: 'Kiểm & cắt scope-creep', chieu: 'thu' } ] },
    { id: 'nvc-4.1', ten: 'Dựng landing + cổng tiền', nv_con: [
      { ten: 'Dựng landing', chieu: 'tan' },
      { ten: 'Tích-hợp cổng VN', chieu: 'hau' } ] },
  ]
  const r = tier.validateCayViec(cay)
  t.ok(r.ok && r.loi.length === 0, 'cây bẻ đủ → không lỗi')
})
test('CV2 NVC LÁ (chưa bẻ nv-con) → FAIL (đúng lỗi cần chặn)', ['LG-6.4-L2'], t => {
  const r = tier.validateCayViec([{ id: 'nvc-1.2', ten: 'Làm nội-dung kit', nv_con: [] }])
  t.ok(!r.ok && r.loi.some(m => m.includes('CHƯA bẻ xuống nhiệm-vụ-con')), 'NVC không nv-con → HARD FAIL')
})
test('CV3 nv-con thiếu/không hợp-lệ chiều → FAIL', ['LG-6.4-L2'], t => {
  const r = tier.validateCayViec([{ id: 'nvc-2.1', ten: 'Viết thông-điệp', nv_con: [{ ten: 'Viết wedge', chieu: 'xxx' }] }])
  t.ok(!r.ok && r.loi.some(m => m.includes('chiều')), 'chiều sai → HARD FAIL')
})
test('CV4 NVC thiếu nv-con tấn → cảnh-báo mềm (không chặn)', 'LG-6.4-L2', t => {
  const r = tier.validateCayViec([{ id: 'nvc-9.4', ten: 'Rà ads', nv_con: [{ ten: 'Rà copy ads', chieu: 'thu' }] }])
  t.ok(r.ok, 'chỉ có thủ vẫn hợp-lệ (ok)')
  t.ok(r.canh_bao.some(m => m.includes('tấn')), 'nhưng cảnh-báo thiếu tấn')
})
test('CV5 cây rỗng → FAIL', 'LG-6.4-L2', t => {
  t.ok(!tier.validateCayViec([]).ok, 'cây rỗng → lỗi')
})
