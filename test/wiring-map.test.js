'use strict'
// Tiêu-chí chấp-nhận spec 09 §8 (bản-đồ đấu-dây). Bắt đúng lỗ I1 (fs.existsSync) bỏ sót:
// KHÔNG chỉ kiểm file tồn-tại, mà kiểm WIRING-TEXT thật-sự có trong file đích.
const { test } = require('./harness')
const fs = require('fs')
const path = require('path')
const taxonomy = require('../lib/taxonomy')

const ROOT = path.resolve(__dirname, '..')
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8')
const has = (p, ...subs) => { const s = read(p); return subs.every(x => s.includes(x)) }

const BRAIN = 'knowledge/brain-schema.md'
const ORCH = 'skills/vn-orchestrator/SKILL.md'
const ARCH = 'skills/vn-architect/SKILL.md'
const EXEC = 'skills/vn-executor/SKILL.md'
const DEBATE = 'workflows/debate.js'

test('LG-9-brain — brain-schema có 5 file sinh-thành + stage + altitude', 'LG-9-brain', t => {
  t.ok(has(BRAIN, 'telos.md', 'positioning.md', 'curves.md', 'structure.md', 'lessons.md'), '5 file Brain mới')
  t.ok(has(BRAIN, 'stage', 'altitude'), 'stage + altitude')
})
test('LG-9-taxonomy — 11 khía-cạnh/7 khối trong brain-schema + engine MECE', 'LG-9-taxonomy', t => {
  t.ok(has(BRAIN, '11 khía-cạnh', '7 khối'), 'bảng generic trong brain-schema')
  t.ok(taxonomy.assertAspects().ok && taxonomy.assertPartition().ok, 'engine 11/7 MECE')
})
test('LG-9-taskgen — sinh nhiệm-vụ-chính 3 lớp trong vn-architect', 'LG-9-taskgen', t => {
  t.ok(has(ARCH, 'sinh_nhiem_vu_chinh', '3 lớp'), 'cơ-chế 3 lớp wired')
})
test('LG-9-stage — phát-hiện stage 3 lớp + rubric ở vn-orchestrator Bước 2b', 'LG-9-stage', t => {
  t.ok(has(ORCH, 'Bước 2b', 'stage-rubric', 'reality-check'), 'stage-detect wired')
})
test('LG-9-architect — skill aspect-walk → gom-ngược + tra-KHO', 'LG-9-architect', t => {
  t.ok(has(ARCH, '11 khía-cạnh', 'Gom NGƯỢC-LÊN', 'tra-KHO'), 'kiến-trúc-sư wired')
})
test('LG-9-kho-index — playbook + luật REUSE/ADAPT/NEW', 'LG-9-kho-index', t => {
  t.ok(fs.existsSync(path.join(ROOT, 'knowledge/playbook/_TEMPLATE/_index.md')), 'có template _index')
  t.ok(has(ARCH, 'REUSE', 'ADAPT', 'NEW'), 'luật reuse wired')
})
test('LG-9-gate-optimize — debate.js Red-team có optimize-before-scale + 3 phép-thử', 'LG-9-gate-optimize', t => {
  t.ok(has(DEBATE, 'optimize-before-scale', 'moat/telos/brand'), 'red-team wired')
})
test('LG-9-lens-3chieu — tấn/thủ/hậu ở orchestrator Bước 7 + executor', 'LG-9-lens-3chieu', t => {
  t.ok(has(ORCH, 'tấn/thủ/hậu'), 'orchestrator lens'); t.ok(has(EXEC, 'tấn', 'thủ', 'hậu'), 'executor lens')
})
test('LG-9-tenkep — department.yaml có capability_name + maps_to', 'LG-9-tenkep', t => {
  t.ok(has('knowledge/departments/03-finance/department.yaml', 'capability_name', 'maps_to'), 'tên-kép wired')
})
test('LG-9-khepvong — vn-orchestrator Bước 11b gọi khepVong', 'LG-9-khepvong', t => {
  t.ok(has(ORCH, 'Bước 11b', 'khepVong'), 'khép-vòng wired')
})
test('LG-9-dequy — debate.js GIỮ NGUYÊN 4 pha', 'LG-9-dequy', t => {
  t.ok(has(DEBATE, 'Perspectives', 'Cross-examination', 'Red-team', 'Synthesize'), '4 pha giữ nguyên')
})
test('LG-9-uutien — impl-manifest có milestone M1/M2/M4', 'LG-9-uutien', t => {
  t.ok(has('tools/impl-manifest.js', "'M1'", "'M2'", "'M4'"), 'lộ-trình milestone')
})
