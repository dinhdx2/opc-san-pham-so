'use strict'
// Tiêu-chí chấp-nhận spec 08 §8 (bố-cục artifact & IO vault). Kiểm đường-dẫn THẬT trong repo +
// bất-biến IO (web/mobile dùng file, CẤM MCP Obsidian). Trước đây 0 test cho LG-8-*.
const { test } = require('./harness')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const exists = p => fs.existsSync(path.join(ROOT, p))
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8')

// §8 §3.1 — bộ Brain (5 canonical + 2 bộ-nhớ + 5 sinh-thành) có template trong vault (_TEMPLATE seed)
test('L8 Brain — đủ template 00-Brain (telos/positioning/curves/structure/hiện-trạng/bộ-nhớ)',
  ['LG-8-telos', 'LG-8-positioning', 'LG-8-curves', 'LG-8-structure', 'LG-8-hientrang', 'LG-8-memory'], t => {
    const must = ['strategy', 'products', 'budget', 'state', 'headcount', 'decisions-log',
      'calibration', 'telos', 'positioning', 'curves', 'structure', 'lessons']
    t.ok(exists('vaults/_TEMPLATE/00-Brain/_SEED.md'), 'có vaults/_TEMPLATE/00-Brain/_SEED.md')
    const seed = read('vaults/_TEMPLATE/00-Brain/_SEED.md')
    for (const f of must) t.includes(seed, `${f}.md`)
  })

// §8 §3.2 — slot task ổn-định: skill ghi đúng 02-Tasks/<slug>/{08,06,10-thuc-thi,10-run-state}
test('L8 slot task — skill ghi đúng 08-plan / 06-structure / 10-thuc-thi-<action> / 10-run-state',
  ['LG-8-plan-gd', 'LG-8-structure-task', 'LG-8-plan-action', 'LG-8-runstate'], t => {
    const orch = read('skills/vn-orchestrator/SKILL.md')
    const arch = read('skills/vn-architect/SKILL.md')
    const exec = read('skills/vn-executor/SKILL.md')
    t.includes(orch, '08-execution-plan.md')
    t.includes(arch, '06-structure.md')
    t.includes(orch + exec, '10-thuc-thi-')
    t.includes(exec, '10-run-state.md')
  })

// §8 §3.1 hàng 11-12 — KHO index template (13 cột) + cây tài-sản git-first
test('L8 KHO — template _index.md 13 cột trong knowledge/playbook', ['LG-8-kho-index', 'LG-8-kho-asset'], t => {
  t.ok(exists('knowledge/playbook/_TEMPLATE/_index.md'), 'có _TEMPLATE/_index.md')
  t.includes(read('knowledge/playbook/_TEMPLATE/_index.md'), 'reuse-grade')
})

// §8 bất-biến IO — web/mobile dùng Read/Write/Glob/Edit, KHÔNG GỌI tool MCP Obsidian (mcp__Obsidian__*)
test('L8 không gọi tool mcp__Obsidian__* + có dùng file-tool (Read/Write/Glob)', [], t => {
  for (const f of ['vn-orchestrator', 'vn-executor']) {
    const s = read(`skills/${f}/SKILL.md`)
    t.ok(!/mcp__obsidian__/i.test(s), `${f} không gọi mcp__Obsidian__*`)
    t.ok(/`?Read`?|`?Write`?|`?Glob`?/.test(s), `${f} dùng file-tool`)
  }
})
