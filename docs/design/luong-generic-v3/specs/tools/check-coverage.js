#!/usr/bin/env node
/*
 * check-coverage.js — trình kiểm truy-vết cho bộ spec luong-generic-v3.
 *
 * Đọc sổ-claim `_claims.md` (cột ID) + front-matter `covers:` của mọi spec *.md,
 * rồi kiểm 3 cổng:
 *   C1 · Toàn-phủ (no orphan):  mọi claim trong _claims.md phải được ≥1 spec phủ.
 *   C2 · Không-bịa (no dangling): mọi ID trong covers: phải tồn-tại trong _claims.md.
 *   C3 · Test-phủ (cảnh-báo):    claim loại rule/schema/gate/table-row nên có ≥1 dòng
 *                                trong "Bảng truy-vết" của spec (cột Acceptance test).
 *
 * Dùng:  node tools/check-coverage.js          (chạy trong thư-mục specs/)
 * Exit:  0 nếu C1 & C2 xanh; ≠0 nếu vi-phạm.  C3 chỉ cảnh-báo, không fail.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SPECS_DIR = path.resolve(__dirname, '..');
const CLAIMS_FILE = path.join(SPECS_DIR, '_claims.md');
const ID_RE = /LG-[A-Za-z0-9.\-]+/g;

function read(f) { return fs.readFileSync(f, 'utf8'); }
// Meta-doc KHÔNG mang claim (không tính là "spec"): README, IMPL-STATUS, AUDIT-*.
const NON_SPEC = new Set(['README.md', 'IMPL-STATUS.md']);
function listSpecMd(dir) {
  return fs.readdirSync(dir)
    .filter(n => n.endsWith('.md') && !n.startsWith('_') && n !== '_TEMPLATE.md'
      && !NON_SPEC.has(n) && !n.startsWith('AUDIT-'))
    .map(n => path.join(dir, n));
}

// --- sổ-claim: lấy ID ở cột đầu mỗi hàng bảng "| LG-... | loại | ... |"
function parseClaims(txt) {
  const claims = new Map(); // id -> { loai }
  for (const line of txt.split('\n')) {
    const m = line.match(/^\|\s*(LG-[A-Za-z0-9.\-]+)\s*\|\s*([^|]*)\|/);
    if (m) claims.set(m[1], { loai: m[2].trim().toLowerCase() });
  }
  return claims;
}

// --- front-matter covers: hỗ-trợ cả [a, b] lẫn dạng list nhiều dòng
function parseFrontMatter(txt) {
  const fm = txt.startsWith('---') ? txt.split('---')[1] || '' : '';
  const covers = new Set();
  const inline = fm.match(/covers:\s*\[([^\]]*)\]/);
  if (inline) (inline[1].match(ID_RE) || []).forEach(id => covers.add(id));
  // dạng list:  covers:\n  - LG-x
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/^covers:\s*$/.test(lines[i])) {
      for (let j = i + 1; j < lines.length && /^\s*-\s*/.test(lines[j]); j++)
        (lines[j].match(ID_RE) || []).forEach(id => covers.add(id));
    }
  }
  return covers;
}

// --- claim ID xuất-hiện trong "Bảng truy-vết" (cột test không rỗng)
function parseTraceTestedIds(txt) {
  const tested = new Set();
  for (const line of txt.split('\n')) {
    const m = line.match(/^\|\s*(LG-[A-Za-z0-9.\-]+)\s*\|[^|]*\|\s*([^|]+?)\s*\|/);
    if (m && m[2].trim() && m[2].trim() !== '—') tested.add(m[1]);
  }
  return tested;
}

function main() {
  if (!fs.existsSync(CLAIMS_FILE)) { console.error('Thiếu _claims.md'); process.exit(2); }
  const claims = parseClaims(read(CLAIMS_FILE));
  const covered = new Set();
  const allTested = new Set();
  const perSpec = [];
  let spec00Covers = new Set(); // covers: của spec 00 (glossary + §0) — cho AC-glossary
  for (const f of listSpecMd(SPECS_DIR)) {
    const txt = read(f);
    const c = parseFrontMatter(txt);
    c.forEach(id => covered.add(id));
    parseTraceTestedIds(txt).forEach(id => allTested.add(id));
    if (path.basename(f) === '00-tong-quan-va-thuat-ngu.md') spec00Covers = c;
    perSpec.push({ name: path.basename(f), n: c.size });
  }

  const claimIds = [...claims.keys()];
  const orphans = claimIds.filter(id => !covered.has(id));                 // C1
  const dangling = [...covered].filter(id => !claims.has(id));             // C2
  const testable = new Set(['rule', 'schema', 'gate', 'table-row']);
  const untested = claimIds.filter(id => testable.has(claims.get(id).loai) && !allTested.has(id)); // C3

  console.log(`\n=== check-coverage ===`);
  console.log(`claims: ${claims.size} · specs: ${perSpec.length} · covered: ${covered.size}`);
  perSpec.forEach(s => console.log(`  ${s.name}: ${s.n} claim`));
  console.log(`\nC1 toàn-phủ (orphan claim): ${orphans.length === 0 ? 'PASS' : 'FAIL'}`);
  if (orphans.length) console.log('   ' + orphans.join(', '));
  console.log(`C2 không-bịa (dangling ref): ${dangling.length === 0 ? 'PASS' : 'FAIL'}`);
  if (dangling.length) console.log('   ' + dangling.join(', '));
  console.log(`C3 test-phủ (siết — claim rule/schema/gate/table-row phải có dòng Acceptance): ${untested.length === 0 ? 'PASS' : 'FAIL ' + untested.length}`);
  if (untested.length) console.log('   ' + untested.join(', '));

  // AC-glossary (spec 00 §8): mọi thuật-ngữ Glossary (LG-G-*) + §0 (LG-0-*) phải được spec 00 phủ TRỌN.
  const glossClaims = claimIds.filter(id => /^LG-(G|0)-/.test(id));
  const orphanGloss = glossClaims.filter(id => !spec00Covers.has(id));
  console.log(`AC-glossary (spec 00 phủ trọn LG-0-*/LG-G-*, ${glossClaims.length} thuật-ngữ): ${orphanGloss.length === 0 ? 'PASS' : 'FAIL ' + orphanGloss.length}`);
  if (orphanGloss.length) console.log('   ' + orphanGloss.join(', '));

  process.exit(orphans.length === 0 && dangling.length === 0 && untested.length === 0 && orphanGloss.length === 0 ? 0 : 1);
}
main();
