'use strict'
// test/harness.js — runner test tối-giản, không phụ-thuộc. Gom case theo `claim` để
// truy-vết C3 (test-phủ): mỗi acceptance test neo claim LG-* của spec.

const STATE = { cases: [], pass: 0, fail: 0, claims: new Set() }

function test(name, claims, fn) {
  STATE.cases.push({ name, claims: [].concat(claims || []), fn })
}

function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${msg || 'eq'}: nhận ${a}, mong ${e}`)
}
function ok(cond, msg) { if (!cond) throw new Error(msg || 'mong true') }
function includes(hay, needle, msg) {
  if (!String(hay).includes(needle)) throw new Error(`${msg || 'includes'}: "${needle}" không trong "${hay}"`)
}
function throws(fn, code, msg) {
  try { fn() } catch (e) { if (code && e.code !== code) throw new Error(`${msg}: code ${e.code} != ${code}`); return }
  throw new Error(msg || 'mong throw')
}

function run() {
  for (const c of STATE.cases) {
    try {
      c.fn({ eq, ok, includes, throws })
      STATE.pass++
      c.claims.forEach(cl => STATE.claims.add(cl))
      console.log(`  ✅ ${c.name}${c.claims.length ? '  [' + c.claims.join(', ') + ']' : ''}`)
    } catch (e) {
      STATE.fail++
      console.log(`  ❌ ${c.name}: ${e.message}`)
    }
  }
  console.log(`\n${STATE.fail === 0 ? '✅ PASS' : '❌ FAIL'} — ${STATE.pass}/${STATE.cases.length} case · ${STATE.claims.size} claim phủ test`)
  return { pass: STATE.pass, fail: STATE.fail, total: STATE.cases.length, claims: [...STATE.claims] }
}

module.exports = { test, run, eq, ok, includes, throws, STATE }
