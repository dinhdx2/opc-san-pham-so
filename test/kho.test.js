'use strict'
// Tiêu-chí chấp-nhận spec 05 §8 (KHO chỉ-mục them/tra/don).
const { test } = require('./harness')
const kho = require('../lib/kho')

function promoteInput(over) {
  return Object.assign({
    qua_cong_promote: true,
    tai_san_chuan: ['SOP.md', 'template/bang-gia.xlsx'],
    meta: {
      id: 'fnb.k5.dept-05.thu-mua-cung-ung', ten_nl: 'Thu-mua & Cung-ứng', ten_nganh: 'Thu-mua NL bếp',
      maps_to: 'K5 / dept-05', khia_canh: 'Hậu-cần', gd: 'GĐ3-5',
      io: { vao: 'nhu-cầu NL', ra: 'hợp-đồng NCC + giá' }, reuse_grade: 'A',
      nguon: '2026-06-29-dam-phan-thit-bo', phien_ban: 'v1',
    },
  }, over || {})
}

test('R1 them(qua_cong_promote=false) → REJECT', ['LG-5.3-them'], t => {
  const r = kho.them(promoteInput({ qua_cong_promote: false }), [])
  t.ok(r.reject, 'REJECT'); t.includes(r.ly_do, 'cổng PROMOTE')
})
test('R2 them hợp-lệ → item live, id chuẩn, vào index', ['LG-5.3-them','LG-5.2-col-id','LG-5.2-col-trangthai','LG-3-PHA3-promote'], t => {
  const idx = []
  const r = kho.them(promoteInput(), idx)
  t.ok(!r.reject, r.ly_do); t.eq(r.item.trang_thai, 'live'); t.eq(idx.length, 1)
  t.ok(kho.isKebabDottedId(r.item.id), 'id kebab dotted')
})
test('R3 tra(ctx khớp) → ứng-viên #1 = mục R2, reuse', ['LG-5.3-tra','LG-5.2-col-ten-nl'], t => {
  const idx = []; kho.them(promoteInput(), idx)
  const uv = kho.tra({ ten_nang_luc: 'Thu-mua & Cung-ứng', khia_canh: 'Hậu-cần', gd: 'GĐ4', io: { vao: 'nhu-cầu NL', ra: 'hợp-đồng NCC + giá' } }, idx)
  t.ok(uv.length >= 1 && uv[0].item.id === 'fnb.k5.dept-05.thu-mua-cung-ung', 'ứng-viên #1 đúng')
  t.eq(uv[0].ket_luan, 'reuse', 'grade A → reuse')
})
test('R4 don → deprecated + superseded_by, giữ-vết', ['LG-5.3-don','LG-5.2-col-trangthai'], t => {
  const idx = []; kho.them(promoteInput(), idx)
  const r = kho.don('fnb.k5.dept-05.thu-mua-cung-ung', 'fnb.k5.dept-05.thu-mua-cung-ung@v3', idx)
  t.eq(r.item.trang_thai, 'deprecated'); t.ok(r.item.superseded_by, 'có superseded_by'); t.eq(idx.length, 1, 'giữ dòng')
})
test('R5 tra sau don → KHÔNG còn gợi-ý (deprecated loại)', 'LG-5.3-tra', t => {
  const idx = []; kho.them(promoteInput(), idx); kho.don('fnb.k5.dept-05.thu-mua-cung-ung', null, idx)
  const uv = kho.tra({ ten_nang_luc: 'Thu-mua & Cung-ứng', khia_canh: 'Hậu-cần', gd: 'GĐ4', io: { vao: 'nhu-cầu NL', ra: 'hợp-đồng NCC + giá' } }, idx)
  t.eq(uv.length, 0, 'deprecated không gợi-ý')
})
test('R6 them cùng id (phiên-bản mới) → cũ deprecated, mới live + version tăng', ['LG-5.2-col-nguon'], t => {
  const idx = []; kho.them(promoteInput(), idx)
  const r = kho.them(promoteInput(), idx)
  const live = idx.filter(x => x.trang_thai === 'live'); const dep = idx.filter(x => x.trang_thai === 'deprecated')
  t.eq(live.length, 1); t.eq(dep.length, 1); t.eq(r.item.phien_ban, 'v2')
})

test('R6b superseded_by của bản cũ RESOLVABLE = handle(bản live)', 'LG-5.3-don', t => {
  const idx = []; kho.them(promoteInput(), idx); kho.them(promoteInput(), idx)
  const live = idx.find(x => x.trang_thai === 'live'); const dep = idx.find(x => x.trang_thai === 'deprecated')
  t.eq(dep.superseded_by, kho.handle(live), 'link cũ→mới khớp id@phiên-bản')
})

// 8.3a cổng PROMOTE: grade C KHÔNG vào _index.md (spec 05/03d §4.3 INV-2/INV-3)
test('R7 them(reuse_grade=C) qua_cong_promote=true → REJECT, index KHÔNG thêm dòng', ['LG-5.3-them','LG-3-PHA3-promote'], t => {
  const idx = []
  const r = kho.them(promoteInput({ meta: Object.assign(promoteInput().meta, { reuse_grade: 'C' }) }), idx)
  t.ok(r.reject, 'grade C → REJECT'); t.includes(r.ly_do, '{A,B}'); t.eq(idx.length, 0, 'index không thêm dòng grade-C')
})
test('R7b xetPromote: grade A/B → vào index; grade C → bỏ-qua (không ghi)', ['LG-3-PHA3-promote','LG-5.3-them'], t => {
  const idx = []
  const ab = kho.xetPromote(promoteInput(), idx)
  t.ok(ab.promoted, 'grade A → promoted'); t.eq(idx.length, 1, 'A vào index')
  const c = kho.xetPromote(promoteInput({ meta: Object.assign(promoteInput().meta, { reuse_grade: 'C' }) }), idx)
  t.ok(!c.promoted, 'grade C → KHÔNG promote'); t.includes(c.ly_do, 'bỏ-qua'); t.eq(idx.length, 1, 'index không đổi')
})

// 8.3-S3 LG-5.1-activate: không nhánh KHO rỗng — chỉ kích-hoạt khi có tài-sản đạt grade A/B
test('t_no_empty_branch — tài-sản rỗng / grade C → KHÔNG kích-hoạt nhánh', 'LG-5.1-activate', t => {
  t.ok(!kho.nhanhDuocKichHoat({ tai_san: [], reuse_grade: 'A' }), 'rỗng tài-sản → không')
  t.ok(!kho.nhanhDuocKichHoat({ tai_san: ['SOP.md'], reuse_grade: 'C' }), 'grade C (tham-khảo) → không')
  t.ok(kho.nhanhDuocKichHoat({ tai_san: ['SOP.md'], reuse_grade: 'A' }), 'có tài-sản + grade A → kích-hoạt')
  t.ok(kho.nhanhDuocKichHoat(promoteInput()), 'promoteInput (grade A, có tài-sản) → kích-hoạt')
})

// 8.3-S3 LG-5.1-tree: dựng/validate đường-dẫn cây KHO từ id chuẩn
test('S3 cayThuMuc — id chuẩn → đường-dẫn playbook/<ngành>/<Kx>/<dept>/<bộ-phận>; id sai → reject', 'LG-5.1-tree', t => {
  const r = kho.cayThuMuc('fnb.k5.dept-05.thu-mua-cung-ung')
  t.ok(r.ok); t.eq(r.dir, 'knowledge/playbook/fnb/K5/dept-05/thu-mua-cung-ung')
  t.eq(r.index, 'knowledge/playbook/fnb/_index.md'); t.eq(r.parts.khoi, 'K5')
  t.ok(r.files.includes('SOP.md'), 'liệt file tài-sản chuẩn')
  t.ok(!kho.cayThuMuc('fnb.k9.dept-05.x').ok, 'khối ngoài K1-7 → reject')
  t.ok(!kho.cayThuMuc('fnb.k5.dept-99.x').ok, 'phòng ngoài dept-01..12 → reject')
  t.ok(!kho.cayThuMuc('thieu.cap').ok, 'thiếu cấp → reject')
})

// D5 enum `tầng` + round-trip nguồn-có-khoảng-trắng
test('them(tầng sai) → REJECT; serialize/parse giữ nguyên nguồn có khoảng-trắng + phiên-bản', ['LG-5.2-col-tang','LG-5.2-col-nguon'], t => {
  const idx = []
  const bad = kho.them(promoteInput({ meta: Object.assign(promoteInput().meta, { tang: 'linh-tinh' }) }), idx)
  t.ok(bad.reject && bad.ly_do.includes('tầng'), 'tầng ngoài enum → REJECT'); t.eq(idx.length, 0)
  // nguồn có khoảng-trắng → round-trip bảo-toàn
  const item = { id: 'fnb.k5.dept-05.x', tang: 'bộ-phận', ten_nang_luc: 'X', ten_nganh: 'x', maps_to: 'K5/dept-05',
    khia_canh: 'Hậu-cần', gd: 'GĐ4', io: { vao: 'a', ra: 'b' }, tai_san: ['s.md'], reuse_grade: 'A', trang_thai: 'live',
    nguon: 'task gốc đàm-phán v2', phien_ban: 'v3', superseded_by: null }
  const back = kho.parseIndexMd(kho.serializeIndexMd([item]))[0]
  t.eq(back.nguon, 'task gốc đàm-phán v2', 'nguồn có space + token v giữ nguyên')
  t.eq(back.phien_ban, 'v3', 'phiên-bản neo đúng token cuối')
})

// 8.2 so-khớp reuse 4-khóa
test('M2 tên-NL khác hẳn → [] (NEW)', 'LG-5.3-tra', t => {
  const idx = []; kho.them(promoteInput(), idx)
  t.eq(kho.tra({ ten_nang_luc: 'BI & Báo-cáo', khia_canh: 'Dữ-liệu', gd: 'GĐ4', io: { vao: 'x', ra: 'y' } }, idx).length, 0)
})
test('M3 đúng tên-NL nhưng GĐ & io lệch → diem thấp, thiên adapt/new', 'LG-5.3-tra', t => {
  const idx = []; kho.them(promoteInput(), idx)
  const uv = kho.tra({ ten_nang_luc: 'Thu-mua & Cung-ứng', khia_canh: 'Hậu-cần', gd: 'GĐ1', io: { vao: 'khác', ra: 'khác' } }, idx)
  t.ok(uv.length === 1 && uv[0].diem_khop < 0.8, 'diem thấp')
  t.ok(['adapt', 'new'].includes(uv[0].ket_luan), 'thiên adapt/new')
})

// 8.1 ra_dinh_ky — bảo-trì KHO định-kỳ (gộp trùng + hạ-cấp grade theo calibration)
test('R7 raDinhKy — id trùng 2 bản live → giữ phiên-bản cao, hạ bản cũ; calibration hỏng → hạ grade', 'LG-5.3-don', t => {
  const idx = [
    { id: 'fnb.k5.dept-05.x', trang_thai: 'live', phien_ban: 'v1', reuse_grade: 'A' },
    { id: 'fnb.k5.dept-05.x', trang_thai: 'live', phien_ban: 'v2', reuse_grade: 'A' },
    { id: 'fnb.k2.dept-03.y', trang_thai: 'live', phien_ban: 'v1', reuse_grade: 'A' },
    { id: 'fnb.k7.dept-11.z', trang_thai: 'live', phien_ban: 'v1', reuse_grade: 'C' },
  ]
  const r = kho.raDinhKy(idx, { hong: ['fnb.k2.dept-03.y', 'fnb.k7.dept-11.z'] })
  t.eq(r.gop, ['fnb.k5.dept-05.x'], 'gộp 1 mục trùng id')
  const xLive = idx.filter(i => i.id === 'fnb.k5.dept-05.x' && i.trang_thai === 'live')
  t.eq(xLive.length, 1, 'chỉ còn 1 bản live'); t.eq(xLive[0].phien_ban, 'v2', 'giữ bản mới')
  const xDep = idx.find(i => i.id === 'fnb.k5.dept-05.x' && i.trang_thai === 'deprecated')
  t.eq(xDep.superseded_by, 'fnb.k5.dept-05.x@v2', 'bản cũ trỏ bản mới')
  t.eq(idx.find(i => i.id === 'fnb.k2.dept-03.y').reuse_grade, 'B', 'A→B do hỏng')
  t.eq(idx.find(i => i.id === 'fnb.k7.dept-11.z').reuse_grade, 'C', 'C giữ C (không xuống dưới)')
  t.ok(r.ha_cap.some(h => h.id === 'fnb.k2.dept-03.y' && h.grade_moi === 'B'), 'báo-cáo hạ-cấp')
})

// 8.3 lược-đồ & chuẩn tên
test('S1 (de)serialize _index.md → 13 cột round-trip', ['LG-5.2-col-tang','LG-5.2-col-mapsto'], t => {
  const idx = []; kho.them(promoteInput(), idx)
  const md = kho.serializeIndexMd(idx)
  t.includes(md, 'superseded_by'); t.eq(kho.COLS.length, 13)
  const back = kho.parseIndexMd(md)
  t.eq(back[0].id, 'fnb.k5.dept-05.thu-mua-cung-ung'); t.eq(back[0].ten_nang_luc, 'Thu-mua & Cung-ứng')
})
test('S1b round-trip giữ NGUYÊN 6 cột (tên-ngành/khía-cạnh/GĐ/io/tài-sản/reuse-grade)',
  ['LG-5.2-col-ten-nganh','LG-5.2-col-khia-canh','LG-5.2-col-gd','LG-5.2-col-io','LG-5.2-col-taisan','LG-5.2-col-reuse-grade'], t => {
    const idx = []; kho.them(promoteInput(), idx)
    const back = kho.parseIndexMd(kho.serializeIndexMd(idx))[0]
    t.eq(back.ten_nganh, 'Thu-mua NL bếp'); t.eq(back.khia_canh, 'Hậu-cần'); t.eq(back.gd, 'GĐ3-5')
    t.eq(back.io.vao, 'nhu-cầu NL'); t.eq(back.io.ra, 'hợp-đồng NCC + giá')
    t.eq(back.tai_san, ['SOP.md', 'template/bang-gia.xlsx']); t.eq(back.reuse_grade, 'A')
  })
test('S2 id không kebab / tên-NL không canonical → validate_chuan_ten FAIL', 'LG-5.3-chuan-ten', t => {
  t.ok(!kho.validateChuanTen('FNB K5 dept05', 'Thu-mua & Cung-ứng').ok, 'id có khoảng-trắng')
  t.ok(!kho.validateChuanTen('fnb.k5.dept-05.x', 'Tên-lạ-không-canonical').ok, 'tên-NL ngoài từ-điển')
  t.ok(kho.validateChuanTen('fnb.k5.dept-05.thu-mua-cung-ung', 'Thu-mua & Cung-ứng').ok, 'hợp-lệ')
})
