'use strict'
// Tiêu-chí chấp-nhận spec 04 §8 (taxonomy generic).
const { test } = require('./harness')
const tx = require('../lib/taxonomy')
const re = require('../lib/rule-engines')

test('t_aspect_count — 11 khía-cạnh, 4 nhóm, mỗi cạnh ≥1 phòng',
  ['LG-4.1-asp1','LG-4.1-asp2','LG-4.1-asp3','LG-4.1-asp4','LG-4.1-asp5','LG-4.1-asp7','LG-4.1-asp9'], t => {
    const r = tx.assertAspects(); t.ok(r.ok, r.ly_do)
    t.eq(tx.ASPECTS.length, 11, 'số khía-cạnh')
  })

test('t_aspect_new — Dữ-liệu≠Hậu-cần; Đối-tác(10)/Bền-vững(11) MỚI',
  ['LG-4.1-asp6','LG-4.1-asp8','LG-4.1-asp10','LG-4.1-asp11','LG-4.1-review'], t => {
    t.ok(tx.ASPECTS.find(a => a.id === 'asp-du-lieu'), 'có asp-du-lieu')
    t.ok(tx.ASPECTS.find(a => a.id === 'asp-hau-can'), 'có asp-hau-can')
    t.ok(tx.ASPECTS.find(a => a.id === 'asp-doi-tac').moi === true, 'đối-tác MỚI')
    t.ok(tx.ASPECTS.find(a => a.id === 'asp-ben-vung').moi === true, 'bền-vững MỚI')
  })

test('t_block_partition — 7 khối phủ đúng 12 phòng, mỗi phòng 1 khối (MECE)',
  ['LG-4.2-K1','LG-4.2-K2','LG-4.2-K3','LG-4.2-K4','LG-4.2-K5','LG-4.2-K6','LG-4.2-K7'], t => {
    const r = tx.assertPartition(); t.ok(r.ok, r.ly_do)
    t.eq(tx.blockOfDept('dept-09'), 'K4', 'dept-09 → K4')
    t.eq(tx.blockOfDept('dept-05'), 'K5', 'dept-05 → K5')
  })

test('t_block_count — 7 khối, mã K1..K7', 'LG-4.2-K1', t => {
  t.eq(tx.KHOI.length, 7, 'số khối')
  t.eq(tx.KHOI.map(k => k.ma), ['K1','K2','K3','K4','K5','K6','K7'])
})

test('t_no_new_dept_for_10_11 — phòng phụ-trách 10/11 ⊂ {dept-01..12}',
  ['LG-4.1-asp10','LG-4.1-asp11','LG-4.1-review'], t => {
    const r = tx.assertNoNewDept(); t.ok(r.ok, r.ly_do)
    t.ok(tx.deptsOfAspect('asp-doi-tac').every(d => tx.ALL_DEPTS.includes(d)), 'đối-tác')
  })

test('t_tenkep_schema — đủ 3 nhãn, ten_nang_luc non-empty', ['LG-4.3-ten-nganh','LG-4.3-ten-nang-luc','LG-4.3-rule'], t => {
  const good = { ten_nganh: 'Bếp trung-tâm', ten_nang_luc: 'Sản-xuất & Chuẩn-hoá món', maps_to: ['K4/dept-09'] }
  t.ok(tx.validateTenKep(good).ok, 'đủ 3 nhãn')
  t.ok(!tx.validateTenKep({ ten_nganh: 'x', maps_to: ['K4'] }).ok, 'thiếu ten_nang_luc → fail')
})

test('t_maps_to_canonical — maps_to parse K1-7 và/hoặc dept-01..12', 'LG-4.3-maps-to', t => {
  t.ok(tx.validateTenKep({ ten_nganh: 'a', ten_nang_luc: 'b', maps_to: ['K4/dept-09'] }).ok)
  t.ok(!tx.validateTenKep({ ten_nganh: 'a', ten_nang_luc: 'b', maps_to: ['K9/dept-99'] }).ok, 'ngoài canonical → fail')
})

test('t_tenkep_fnb_fixture — Bếp trung-tâm → năng-lực + maps_to đúng',
  ['LG-4.3-chuyen-sau','LG-4.3-maps-to'], t => {
    const e = re.namingResolve('bếp trung-tâm')
    t.ok(e, 'tra được')
    t.eq(e.ten_nang_luc, 'Sản-xuất & Chuẩn-hoá món')
    t.eq(e.maps_to, ['K4/dept-09', 'K5/dept-05'])
  })
