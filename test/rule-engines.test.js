'use strict'
// Tiêu-chí chấp-nhận spec 06 §8 (6 rule-engine).
const { test } = require('./harness')
const re = require('../lib/rule-engines')
const text = require('../lib/text')

// 8.1 detect_stage
test('S1 — "giao ổn, tối-ưu biên lãi từng đơn-vị" → GĐ4', 'LG-6.1-gd4', t => {
  const r = re.detectStage({ evidence: 'giao ổn, đang tối-ưu biên lãi từng đơn-vị' })
  t.eq(r.stage, 'GD4'); t.includes(r.cau_song_con, 'lãi/đơn-vị')
})
test('S2 — CEO khai GĐ5 nhưng budget còn lỗ/đơn-vị → GĐ4 + cảnh-báo lệch',
  ['LG-6.1-gd5','LG-6.1-gd4'], t => {
    const r = re.detectStage({ budget: 'còn lỗ trên từng đơn-vị, biên ròng 6%, quán-4 chưa hòa-vốn' }, 'GD5')
    t.eq(r.stage, 'GD4'); t.ok(r.canh_bao.length > 0, 'có cảnh-báo reality-check')
    t.includes(r.canh_bao[0], 'BLOCK_MO_RONG_SOM')
  })

// 8.1b detect_stage — phủ nốt GĐ1/2/3/6 (bằng-chứng → đúng GĐ)
test('S3 — "ý-tưởng, chưa có sản-phẩm" → GĐ1', 'LG-6.1-gd1', t => {
  t.eq(re.detectStage({ evidence: 'mới ý-tưởng, chưa có sản-phẩm, chưa rõ vấn-đề' }).stage, 'GD1')
})
test('S4 — "tìm khách quay-lại & trả tiền (PMF)" → GĐ2', 'LG-6.1-gd2', t => {
  t.eq(re.detectStage({ evidence: 'có sản-phẩm, đang tìm khách quay-lại & trả tiền, tìm pmf' }).stage, 'GD2')
})
test('S5 — "lo giao-hàng/vận-hành ổn-định" → GĐ3', 'LG-6.1-gd3', t => {
  t.eq(re.detectStage({ evidence: 'PMF rồi, lo giao-hàng và vận-hành ổn-định' }).stage, 'GD3')
})
test('S6 — "lõi chín, lời đều, gieo đường-cong kế" → GĐ6', 'LG-6.1-gd6', t => {
  t.eq(re.detectStage({ evidence: 'lõi chín, lời đều, cần gieo đường-cong kế (second-curve)' }).stage, 'GD6')
})

// 8.1c detect_stage_per_curve — DN nhiều đường-cong (spec 03a §4): mỗi curve 1 stage riêng
test('S7 — 2 đường-cong: lõi GĐ6 + bet GĐ1 ⇒ suy stage RIÊNG từng curve', ['LG-6.1-gd6','LG-6.1-gd1','LG-3-PHA0-stage2'], t => {
  const rows = re.detectStagePerCurve([
    { name: 'lõi', evidence: 'lõi chín, lời đều, gieo đường-cong kế (second-curve)' },
    { name: 'bet', evidence: 'mới ý-tưởng, chưa có sản-phẩm, chưa rõ vấn-đề' },
  ])
  t.eq(rows.length, 2, '2 đường-cong → 2 kết-quả')
  t.eq(rows.find(r => r.name === 'lõi').stage, 'GD6', 'lõi → GĐ6')
  t.eq(rows.find(r => r.name === 'bet').stage, 'GD1', 'bet → GĐ1')
})
test('S7b — per-curve reality-check: curve khai GĐ5 nhưng bằng-chứng GĐ4 → cảnh-báo', 'LG-3-PHA0-stage2', t => {
  const rows = re.detectStagePerCurve([{ name: 'q4', stage: 'GD5', budget: 'còn lỗ trên từng đơn-vị, biên ròng 6%' }])
  t.eq(rows[0].stage, 'GD4'); t.ok(rows[0].canh_bao.length > 0, 'có cảnh-báo lệch khai>bằng-chứng')
})

// 8.2 route_song_vong
test('R3 — "quy-trình tắc · vai quá-tải" → cấu-trúc + {structure,headcount}', 'LG-6.2-cau-truc', t => {
  const r = re.routeSongVong('quy-trình tắc · vai quá-tải')
  t.eq(r.tang_leo, 'cau_truc'); t.eq(r.file_neo, ['structure.md', 'headcount.md']); t.eq(r.nhip, 'nhanh')
})
test('R4 — "đầu-cầu cạn · sai ngách" → định-vị + {positioning,strategy}', 'LG-6.2-dinh-vi', t => {
  const r = re.routeSongVong('đầu-cầu cạn · sai ngách')
  t.eq(r.tang_leo, 'dinh_vi'); t.eq(r.file_neo, ['positioning.md', 'strategy.md'])
})
test('R1 — "moat xói · kinh-tế-đơn-vị xấu" → moat + {positioning,products,budget}', 'LG-6.2-moat', t => {
  const r = re.routeSongVong('moat xói · kinh-tế-đơn-vị xấu')
  t.eq(r.tang_leo, 'moat'); t.eq(r.file_neo, ['positioning.md','products.md','budget.md']); t.eq(r.nhip, 'vừa')
})
test('R2 — "chạy đúng mọi thứ vẫn èo-uột" → telos; kèm nền state+budget',
  ['LG-6.2-telos','LG-6.2-nen'], t => {
    const r = re.routeSongVong('chạy đúng mọi thứ vẫn èo-uột')
    t.eq(r.tang_leo, 'telos'); t.eq(r.file_neo, ['telos.md','curves.md'])
    t.eq(r.nen, ['state.md','budget.md'])
  })

// 8.3 goal_by_aspect
test('G1 — aspect 4 (Tiền), GĐ4 → mẫu trạng-thái, active', ['LG-6.3-asp4'], t => {
  const g = re.goalByAspect(4, 'GD4')
  t.ok(g.active, 'active'); t.includes(g.mau_muc_tieu, 'Biên lãi/đv ≥ Z%')
  t.ok(!text.startsWithVerb(g.mau_muc_tieu), 'mẫu là trạng-thái (không động-từ) — INV-6.2')
})
test('G2 — aspect 11 (Bền-vững), GĐ1 → ngủ (active=false)', 'LG-6.3-asp11', t => {
  t.ok(!re.goalByAspect(11, 'GD1').active, 'ngủ ở GĐ1')
})
test('G3 — aspect 10 (Đối-tác): ngủ ở GĐ1-2, thức ở GĐ4', 'LG-6.3-asp10', t => {
  t.ok(!re.goalByAspect(10, 'GD1').active, 'ngủ ở GĐ1'); t.ok(!re.goalByAspect(10, 'GD2').active, 'ngủ ở GĐ2')
  t.ok(re.goalByAspect(10, 'GD4').active, 'thức ở GĐ4')
})
test('goalScan — mẫu mục-tiêu mọi khía-cạnh đều TRẠNG-THÁI (INV-6.2)',
  ['LG-6.3-asp1','LG-6.3-asp2','LG-6.3-asp3','LG-6.3-asp5','LG-6.3-asp6','LG-6.3-asp7','LG-6.3-asp8','LG-6.3-asp9','LG-6.3-asp10'], t => {
    for (const r of re.ASPECT_GOAL) t.ok(!text.startsWithVerb(r.mau_muc_tieu), `aspect ${r.aspect} không động-từ`)
  })

// 8.4 task_gen_grid
test('T1 — 5 hàng đúng thứ-tự Sinh→Soi→Quét→Cổng→Neo',
  ['LG-6.4-L1','LG-6.4-L2','LG-6.4-L3','LG-6.4-gate'], t => {
    const g = re.taskGenGrid(); t.eq(g.length, 5)
    t.eq(g.map(r => r.claim), ['LG-6.4-L1','LG-6.4-L2','LG-6.4-L3','LG-6.4-gate','LG-6.4-neo'])
  })
test('T2 — hàng "Neo đo": test="không neo được = cắt"', 'LG-6.4-neo', t => {
  const neo = re.taskGenGrid().find(r => r.claim === 'LG-6.4-neo')
  t.includes(neo.test, 'không neo được = cắt'); t.includes(neo.cho_ra, 'OKR')
})

// 8.5 reuse_decision
test('U1 — grade A, ngữ-cảnh trùng → REUSE (ghi reused_from)', 'LG-6.5-reuse', t => {
  const d = re.reuseDecision({ grade: 'A' }, {}); t.eq(d.quyet_dinh, 'REUSE'); t.includes(d.hanh_dong, 'reused_from')
})
test('U2 — grade B → ADAPT; null → NEW', ['LG-6.5-adapt','LG-6.5-new'], t => {
  t.eq(re.reuseDecision({ grade: 'B' }, {}).quyet_dinh, 'ADAPT')
  t.eq(re.reuseDecision(null, {}).quyet_dinh, 'NEW')
})

// 8.6 naming_dict
test('N1 — tên-ngành có ánh-xạ → slug canonical', 'LG-6.6-rule', t => {
  t.eq(re.namingDict('Thu-mua NL bếp'), 'thu-mua-cung-ung')
})
test('N2 — tên-ngành chưa ánh-xạ → NEED_MAPPING (chặn ghi index)', 'LG-6.6-rule', t => {
  t.throws(() => re.namingDict('Năng-lực-lạ-chưa-map-xyz'), 'NEED_MAPPING')
})
