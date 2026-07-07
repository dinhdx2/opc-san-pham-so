'use strict'
// Invariant-test — code-hoá NGUYÊN-LÝ §0/§1.1 + why-aspect thành assertion chạy-được trên data model
// (KHÔNG thêm behavior; biến "nguyên-lý nằm trong doc" thành "nguyên-lý có test kiểm").
const { test } = require('./harness')
const brain = require('../lib/brain')
const taxonomy = require('../lib/taxonomy')
const re = require('../lib/rule-engines')
const tier = require('../lib/tier')
const kho = require('../lib/kho')

// §1.1-2/3 — bộ khung GENERIC cố-định đầy-đủ: 6 GĐ · 11 khía-cạnh · 4 nhóm · 7 khối · 12 phòng · lưới 5 hàng (3 chiều)
test('INV §1.1-2/3 — schema generic đầy-đủ (6/11/4/7/12 + lưới 5 hàng + 3 chiều)', ['LG-1.1-2', 'LG-1.1-3'], t => {
  t.eq(brain.STAGES.length, 6, '6 GĐ')
  t.eq(taxonomy.ASPECTS.length, 11, '11 khía-cạnh')
  t.eq(taxonomy.NHOM_4.length, 4, '4 nhóm MECE')
  t.eq(taxonomy.KHOI.length, 7, '7 khối')
  t.eq(taxonomy.ALL_DEPTS.length, 12, '12 phòng canonical')
  t.eq(re.taskGenGrid().length, 5, 'lưới sinh nhiệm-vụ-chính 5 hàng')
  t.ok(re.taskGenGrid().some(r => /3 chiều|tấn|thủ|hậu/.test(`${r.lop} ${r.cau_hoi}`)), 'có lớp Soi 3 chiều')
})

// §1.1-1/11 — RANH generic↔phân-rã: luật đúng-tầng GENERIC cố-định (mục-tiêu=TRẠNG-THÁI · nhiệm-vụ=ĐỘNG-TỪ)
test('INV §1.1-1/11 — luật đúng-tầng cố-định phân-định generic↔phân-rã', ['LG-1.1-1', 'LG-1.1-11'], t => {
  t.ok(!tier.validateDungTang({ tang: 'muc_tieu', ten: 'Thiết-lập luồng thanh-toán' }).ok, 'động-từ ở mục-tiêu = nén tầng')
  t.ok(tier.validateDungTang({ tang: 'muc_tieu', ten: 'Hạ-tầng thu tiền sẵn-sàng' }).ok, 'trạng-thái = đúng tầng')
  t.ok(tier.validateDungTang({ tang: 'nv_chinh', ten: 'Thiết-lập luồng thanh-toán' }).ok, 'nhiệm-vụ-chính = động-từ')
})

// §1.1-4 — cổng LỌC khía-cạnh: câu-hỏi cố-định mọi khía-cạnh; active (đáp-án) tùy GĐ → cắt-tỉa
test('INV §1.1-4 — cổng lọc khía-cạnh: câu-hỏi cố-định, active tùy GĐ', ['LG-1.1-4'], t => {
  for (const a of re.ASPECT_GOAL) t.ok(re.goalByAspect(a.aspect, 'GD4').hoi_cong_loc, `khía-cạnh ${a.aspect} có câu-hỏi cổng`)
  t.ok(!re.goalByAspect(11, 'GD1').active, 'Bền-vững NGỦ ở GĐ1'); t.ok(re.goalByAspect(11, 'GD5').active, 'thức ở GĐ5')
})

// §1.1-5 — cổng TRA-KHO: luật reuse/adapt/new cố-định, kết-quả tùy độ-khớp
test('INV §1.1-5 — cổng tra-kho: luật reuse/adapt/new cố-định', ['LG-1.1-5'], t => {
  t.eq(re.reuseDecision({ grade: 'A' }, {}).quyet_dinh, 'REUSE')
  t.eq(re.reuseDecision({ grade: 'B' }, {}).quyet_dinh, 'ADAPT')
  t.eq(re.reuseDecision(null, {}).quyet_dinh, 'NEW')
})

// §3 PHA1 why-aspect — sinh mục-tiêu từ 11 KHÍA-CẠNH (trục BẤT-BIẾN), phòng map NHIỀU-NHIỀU (suy SAU)
test('INV why-aspect — trục sinh là 11 khía-cạnh, phòng map nhiều-nhiều', ['LG-3-PHA1-why-aspect'], t => {
  t.eq(taxonomy.ASPECTS.length, 11, 'trục sinh = 11 khía-cạnh, KHÔNG phải 12 phòng')
  const scan = re.goalScan('GD4')
  t.ok(scan.length >= 1 && scan.every(g => typeof g.aspect !== 'undefined'), 'goalScan duyệt theo khía-cạnh')
  t.ok(taxonomy.deptsOfAspect('asp-thi-truong').length >= 2, 'Thị-trường → ≥2 phòng (nhiều-nhiều)')
  t.ok(taxonomy.deptsOfAspect('asp-rui-ro').length >= 1, 'Rủi-ro → ≥1 phòng')
})

// §2 file-index — lược-đồ _index.md là hợp-đồng 13 cột (KHO chỉ-mục), round-trip giữ khóa
test('INV §2 file-index — _index.md 13 cột round-trip giữ id/maps_to', ['LG-2-file-index'], t => {
  t.eq(kho.COLS.length, 13, '13 cột chuẩn')
  const item = {
    id: 'fnb.k5.dept-05.x', tang: 'bộ-phận', ten_nang_luc: 'Thu-mua & Cung-ứng', ten_nganh: 'x',
    maps_to: 'K5 / dept-05', khia_canh: 'Hậu-cần', gd: 'GĐ4', io: { vao: 'a', ra: 'b' },
    tai_san: ['SOP.md'], reuse_grade: 'A', trang_thai: 'live', nguon: 't', phien_ban: 'v1', superseded_by: null,
  }
  const back = kho.parseIndexMd(kho.serializeIndexMd([item]))[0]
  t.eq(back.id, item.id); t.eq(back.maps_to, item.maps_to); t.eq(back.reuse_grade, 'A')
})
