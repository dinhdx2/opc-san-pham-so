'use strict'
// tools/check-impl.js — TRÌNH KIỂM IMPLEMENT (CI-able). Biến "implement bám sát spec" thành
// điều-kiện build, không phải niềm-tin. Ba cổng:
//   I1 · Điểm-cắm tồn-tại : mọi artifact trong impl-manifest có mặt trong repo.
//   I2 · Test xanh        : toàn-bộ test/*.test.js PASS.
//   I3 · Claim phủ test   : in danh-sách claim LG-* được test thực-thi phủ (truy-vết C3).
// exit≠0 nếu I1 hoặc I2 vi-phạm. Dùng: `node tools/check-impl.js` (hoặc `npm run check-impl`).

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')
const manifest = require('./impl-manifest')

// ── I1 · điểm-cắm tồn-tại ────────────────────────────────────────────────────
let missing = []
console.log('I1 · Điểm-cắm (artifact) tồn-tại theo milestone:')
for (const m of manifest) {
  const miss = m.artifacts.filter(a => !fs.existsSync(path.join(ROOT, a)))
  const mark = miss.length ? '❌' : '✅'
  console.log(`  ${mark} ${m.milestone} — ${m.ten} (${m.artifacts.length - miss.length}/${m.artifacts.length} có)`)
  miss.forEach(a => { missing.push(a); console.log(`       thiếu: ${a}`) })
}

// ── I2 · test xanh + I3 · claim phủ ──────────────────────────────────────────
console.log('\nI2 · Chạy test/*.test.js:')
const harness = require('../test/harness')
const tdir = path.join(ROOT, 'test')
for (const f of fs.readdirSync(tdir).filter(x => x.endsWith('.test.js')).sort()) require(path.join(tdir, f))
// chặn process.exit của bất-kỳ test runner nào (ở đây require trực-tiếp, không gọi run.js)
const r = harness.run()

console.log('\nI3 · Claim LG-* phủ bởi test thực-thi: ' + r.claims.length)

// ── I4 · Truy-vết claim↔test (CẢNH-BÁO) — claim "loại code-được" chưa có test tag ─────────────
// Bắt đúng lỗ mà I1 (fs.existsSync) + I3 (chỉ đếm) bỏ sót: claim rule/schema/gate/table-row khai
// trong _claims.md nhưng KHÔNG test nào neo. Không fail build (nhiều claim là prompt-only/prose).
const CLAIMS_MD = path.join(ROOT, 'docs/design/luong-generic-v3/specs/_claims.md')
let i4Untested = []
if (fs.existsSync(CLAIMS_MD)) {
  const CODE_TYPES = new Set(['rule', 'schema', 'gate', 'table-row'])
  const tested = new Set(r.claims)
  for (const line of fs.readFileSync(CLAIMS_MD, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*(LG-[A-Za-z0-9.\-]+)\s*\|\s*([^|]*)\|/)
    if (m && CODE_TYPES.has(m[2].trim().toLowerCase()) && !tested.has(m[1])) i4Untested.push(m[1])
  }
  console.log('\nI4 · Claim loại code-được CHƯA có test tag (cảnh-báo, prompt-only/prose có thể nằm đây): ' + i4Untested.length)
  if (i4Untested.length) console.log('     ' + i4Untested.join(', '))
}

const ok = missing.length === 0 && r.fail === 0
console.log(`\n${ok ? '✅ IMPL PASS' : '❌ IMPL FAIL'} — I1 ${missing.length === 0 ? 'OK' : missing.length + ' thiếu'} · I2 ${r.fail === 0 ? 'OK' : r.fail + ' fail'} · I3 ${r.claims.length} claim phủ test`)
process.exit(ok ? 0 : 1)
