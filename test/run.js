'use strict'
// test/run.js — chạy toàn-bộ *.test.js trong test/ rồi in tổng-kết. exit≠0 nếu có fail.
const fs = require('fs')
const path = require('path')
const harness = require('./harness')

const dir = __dirname
const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js')).sort()
console.log(`vn-opc · chạy ${files.length} file test\n`)
for (const f of files) {
  console.log(`── ${f} ──`)
  require(path.join(dir, f))
}
console.log('')
const r = harness.run()
process.exit(r.fail === 0 ? 0 : 1)
