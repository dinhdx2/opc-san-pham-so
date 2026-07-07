'use strict'
// lib/vault.js — Multi-vault: mỗi ý-tưởng/DN một vault độc-lập dưới `vaults/<slug>/`.
// Con-trỏ vault đang dùng = file `.vn-active-vault` ở gốc repo (fallback `vault/` cũ).
// Logic đặt-tên + giải-quyết-vault là XÁC-ĐỊNH (kiểm được bằng test/vault.test.js).

const fs = require('fs')
const path = require('path')

const POINTER = '.vn-active-vault'
const LEGACY = 'vault'
const VAULTS_DIR = 'vaults'

// ── slugify: ý-tưởng (tiếng Việt) → slug kebab ascii ngắn ─────────────────────
const VN_MAP = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'], [/[èéẹẻẽêềếệểễ]/g, 'e'], [/[ìíịỉĩ]/g, 'i'],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o'], [/[ùúụủũưừứựửữ]/g, 'u'], [/[ỳýỵỷỹ]/g, 'y'], [/đ/g, 'd'],
]
function slugify(idea, opts) {
  opts = opts || {}
  let s = String(idea || '').toLowerCase()
  for (const [re, ch] of VN_MAP) s = s.replace(re, ch)
  s = s.replace(/[^a-z0-9\s-]/g, ' ').replace(/[\s-]+/g, '-').replace(/(^-|-$)/g, '')
  const maxWords = opts.maxWords || 4
  let words = s.split('-').filter(Boolean)
  // bỏ stop-word đầu cho gọn (giữ nếu rỗng)
  const STOP = new Set(['quan', 'cong-ty', 'cty', 'mot', 'cai', 'du-an', 'y-tuong', 'he-thong'])
  const trimmed = words.filter(w => !STOP.has(w))
  if (trimmed.length) words = trimmed
  s = words.slice(0, maxWords).join('-')
  if (opts.maxLen && s.length > opts.maxLen) s = s.slice(0, opts.maxLen).replace(/-[^-]*$/, '').replace(/-$/, '')
  return s || 'vault'
}

// Bảo-đảm slug DUY-NHẤT trong vaults/ (thêm -2, -3… nếu trùng).
function uniqueSlug(idea, repoRoot, opts) {
  const base = slugify(idea, opts)
  const dir = path.join(repoRoot || process.cwd(), VAULTS_DIR)
  const exists = name => fs.existsSync(path.join(dir, name))
  if (!exists(base)) return base
  let i = 2
  while (exists(`${base}-${i}`)) i++
  return `${base}-${i}`
}

// ── con-trỏ active-vault ──────────────────────────────────────────────────────
function resolveActiveVault(repoRoot) {
  const root = repoRoot || process.cwd()
  const p = path.join(root, POINTER)
  if (fs.existsSync(p)) {
    const v = fs.readFileSync(p, 'utf8').trim().split('\n')[0].trim()
    if (v && fs.existsSync(path.join(root, v))) return v
  }
  return LEGACY // tương-thích ngược: vault/ cũ
}
function setActiveVault(relPath, repoRoot) {
  const root = repoRoot || process.cwd()
  fs.writeFileSync(path.join(root, POINTER), relPath.replace(/\/+$/, '') + '\n')
  return relPath
}
function listVaults(repoRoot) {
  const root = repoRoot || process.cwd()
  const out = []
  if (fs.existsSync(path.join(root, LEGACY, '00-Brain'))) out.push(LEGACY)
  const dir = path.join(root, VAULTS_DIR)
  if (fs.existsSync(dir)) {
    for (const n of fs.readdirSync(dir)) {
      if (n.startsWith('_')) continue
      if (fs.statSync(path.join(dir, n)).isDirectory()) out.push(`${VAULTS_DIR}/${n}`)
    }
  }
  return out
}

module.exports = { POINTER, LEGACY, VAULTS_DIR, slugify, uniqueSlug, resolveActiveVault, setActiveVault, listVaults }
