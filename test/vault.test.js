'use strict'
// Test multi-vault (lib/vault.js): slugify xác-định + resolve/set active + fallback.
const fs = require('fs')
const os = require('os')
const path = require('path')
const { test } = require('./harness')
const vault = require('../lib/vault')

test('slugify — bỏ dấu tiếng Việt → kebab ascii ngắn', 'VAULT-slug', t => {
  t.eq(vault.slugify('Quán cà-phê thú-cưng ở Q7'), 'ca-phe-thu-cung') // ≤4 từ, bỏ stop-word "quán"
  t.eq(vault.slugify('Chuỗi phở Bắc TP.HCM'), 'chuoi-pho-bac-tp')
  t.eq(vault.slugify(''), 'vault')
})
test('slugify — không ký-tự lạ, không dấu-cách', 'VAULT-slug', t => {
  t.ok(/^[a-z0-9-]+$/.test(vault.slugify('Spa & Trị-liệu @Q1!!!')), 'chỉ a-z0-9-')
})
test('resolveActiveVault — đọc con-trỏ; fallback vault/ khi vắng', 'VAULT-active', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vn-vault-'))
  t.eq(vault.resolveActiveVault(root), 'vault', 'vắng con-trỏ → fallback')
  fs.mkdirSync(path.join(root, 'vaults', 'cafe-pet'), { recursive: true })
  vault.setActiveVault('vaults/cafe-pet', root)
  t.eq(vault.resolveActiveVault(root), 'vaults/cafe-pet', 'đọc đúng con-trỏ')
  // con-trỏ trỏ vault không tồn-tại → fallback
  vault.setActiveVault('vaults/khong-co', root)
  t.eq(vault.resolveActiveVault(root), 'vault', 'con-trỏ chết → fallback')
})
test('uniqueSlug — trùng tên → thêm hậu-tố', 'VAULT-active', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vn-vault-'))
  fs.mkdirSync(path.join(root, 'vaults', 'ca-phe-thu-cung'), { recursive: true })
  t.eq(vault.uniqueSlug('Quán cà-phê thú-cưng ở Q7', root), 'ca-phe-thu-cung-2')
})
test('listVaults — gồm vault/ legacy + vaults/* (bỏ _TEMPLATE)', 'VAULT-active', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vn-vault-'))
  fs.mkdirSync(path.join(root, 'vault', '00-Brain'), { recursive: true })
  fs.mkdirSync(path.join(root, 'vaults', 'a'), { recursive: true })
  fs.mkdirSync(path.join(root, 'vaults', '_TEMPLATE'), { recursive: true })
  const list = vault.listVaults(root)
  t.ok(list.includes('vault') && list.includes('vaults/a'), 'có legacy + vaults/a')
  t.ok(!list.includes('vaults/_TEMPLATE'), 'bỏ _TEMPLATE')
})
