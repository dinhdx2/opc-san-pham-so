#!/usr/bin/env node
'use strict'
// tools/compliance-check.js — lớp IO của cơ-chế giám-sát (SPEC docs/design/giam-sat-tuan-thu).
// Đọc 10-run-state.md của 1 task → resolve bằng-chứng THẬT (file tồn-tại) → chạy engine
// lib/compliance.js (E1/E4/E7) + placementCheck (E6) trên 03-Outputs → in vi-phạm + exit≠0.
// Dùng bởi hook (Đợt C) và bởi skill/main-loop ở cổng kiểm-toán.
//
//   node tools/compliance-check.js <đường-dẫn-10-run-state.md> [--json]
//
// PURE ở lib/; mọi IO (fs) nằm ĐÂY. Không network (URL/TXN → resolve=null, hợp-lệ theo kind).

const fs = require('fs')
const path = require('path')
const C = require('../lib/compliance')

function parseRunState(md) {
  const rows = []
  for (const line of md.split(/\r?\n/)) {
    if (!/^\|\s*(?:[0-9]|TEST)/.test(line)) continue
    if (/^\|\s*20[0-9][0-9]/.test(line)) continue // dòng nhật-ký-HITL (có ngày)
    const c = line.split('|').map(s => s.trim())
    if (c.length < 10) continue
    rows.push({
      id: c[1], hanh_dong: c[2], owner: c[3], tool: c[4], can: c[5],
      cong: c[6], phu_thuoc: c[7], trang_thai: c[8], bang_chung: c[9],
    })
  }
  return rows
}

// index mọi file dưới vault (để resolve cả khi bằng-chứng ghi TÊN FILE TRẦN, không đủ path)
function indexFiles(vaultDir) {
  const rel = new Set(), byBase = new Set()
  const walk = d => {
    if (!fs.existsSync(d)) return
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name)
      let st; try { st = fs.statSync(p) } catch (e) { continue }
      if (st.isDirectory()) { if (name !== '.git' && name !== 'node_modules') walk(p) }
      else { rel.add(path.relative(vaultDir, p)); byBase.add(name) }
    }
  }
  walk(path.join(vaultDir, '03-Outputs'))
  walk(path.join(vaultDir, '02-Tasks'))
  return { rel, byBase }
}

// resolve FILE evidence: tồn-tại trong vault? (URL/TXN/CITATION → null = không network, để agent kiểm)
function resolveEvidence(rows, vaultDir) {
  const idx = indexFiles(vaultDir)
  const res = {}
  for (const r of rows) {
    if (String(r.trang_thai) !== 'DONE') continue
    const ev = C.classifyEvidence(r.bang_chung)
    if (ev.kind === 'FILE' || ev.kind === 'IMAGE') {
      const target = String(ev.target).replace(/[`'"]/g, '').trim()
      res[r.id] = fs.existsSync(path.join(vaultDir, target)) || idx.rel.has(target) || idx.byBase.has(path.basename(target))
    } else {
      res[r.id] = null
    }
  }
  return res
}

function listOutputs(vaultDir) {
  const out = []
  const base = path.join(vaultDir, '03-Outputs')
  if (!fs.existsSync(base)) return out
  const walk = d => {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name)
      const st = fs.statSync(p)
      if (st.isDirectory()) walk(p)
      else out.push('03-Outputs/' + path.relative(base, p))
    }
  }
  walk(base)
  return out
}

function main() {
  const args = process.argv.slice(2)
  const asJson = args.includes('--json')
  const rsPath = args.find(a => !a.startsWith('--'))
  if (!rsPath || !fs.existsSync(rsPath)) {
    console.error('Dùng: node tools/compliance-check.js <đường-dẫn-10-run-state.md> [--json]')
    process.exit(2)
  }
  const vaultDir = path.resolve(path.dirname(rsPath), '..', '..') // <vault>/02-Tasks/<slug>/10-run-state.md → <vault>
  const rows = parseRunState(fs.readFileSync(rsPath, 'utf8'))
  const resolutions = resolveEvidence(rows, vaultDir)

  // đọc NỘI-DUNG file bằng-chứng (để engine dò "kết-quả trống/placeholder" — E4b)
  const contents = {}
  for (const r of rows) {
    if (String(r.trang_thai) !== 'DONE') continue
    const ev = C.classifyEvidence(r.bang_chung)
    if (ev.kind !== 'FILE') continue
    const target = String(ev.target).replace(/[`'"]/g, '').trim()
    for (const p of [path.join(vaultDir, target), path.resolve(vaultDir, target)]) {
      try { if (fs.existsSync(p) && fs.statSync(p).isFile()) { contents[r.id] = fs.readFileSync(p, 'utf8'); break } } catch (e) {}
    }
  }

  const runState = C.validateRunStateStrict(rows, resolutions, contents)
  const placement = C.placementCheck(listOutputs(vaultDir).map(p => ({ path: p })))

  const violations = []
  for (const e of runState.errors) {
    const ma = (e.match(/^([EF]\d)/) || [])[1] || 'E?'
    violations.push({ ma, chi_tiet: e, hook: C.hookPolicy(ma) })
  }
  for (const m of placement.misfiled) {
    violations.push({ ma: 'F3', chi_tiet: `F3 ${m.path}: process ở Outputs → nên ${m.nen_o}`, hook: C.hookPolicy('F3') })
  }

  const deny = violations.filter(v => v.hook === 'DENY')
  const result = {
    ok: violations.length === 0,
    task: path.basename(path.dirname(rsPath)),
    tong_buoc: rows.length,
    vi_pham: violations,
    deny_count: deny.length,
    warn_count: violations.length - deny.length,
  }

  if (asJson) { console.log(JSON.stringify(result)); process.exit(deny.length ? 1 : 0) }

  console.log(`\nGIÁM-SÁT TUÂN THỦ · task ${result.task} · ${rows.length} bước`)
  if (result.ok) { console.log('✅ PASS — 0 vi-phạm'); process.exit(0) }
  console.log(`❌ ${violations.length} vi-phạm (${deny.length} DENY · ${result.warn_count} WARN):`)
  for (const v of violations) console.log(`  [${v.hook}] ${v.chi_tiet}`)
  console.log(`\n${deny.length ? '⛔ FAIL-CLOSED (có DENY) — phải sửa trước khi khai DONE/khai pha kế' : '⚠️ chỉ WARN — ghi sổ, tiếp-tục được'}`)
  process.exit(deny.length ? 1 : 0)
}

main()
