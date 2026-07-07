'use strict'
// lib/taxonomy.js — Taxonomy generic (spec 04): 11 khía-cạnh · 7 khối · tên-kép.
// Đọc bảng tĩnh `knowledge/taxonomy/{aspects,blocks}.yaml` (config-as-data, bất-biến C4).

const path = require('path')
const yaml = require('./yaml')

const ROOT = path.resolve(__dirname, '..')
const ASPECTS = yaml.load(path.join(ROOT, 'knowledge/taxonomy/aspects.yaml'))
const KHOI = yaml.load(path.join(ROOT, 'knowledge/taxonomy/blocks.yaml'))

const ALL_DEPTS = Array.from({ length: 12 }, (_, i) => `dept-${String(i + 1).padStart(2, '0')}`)
const NHOM_4 = ['GIÁ-TRỊ', 'NGUỒN-LỰC', 'VẬN-HÀNH&TRI-THỨC', 'BẢO-VỆ&QUAN-HỆ']

// ── Phép tra cơ-bản (spec 04 §4) ─────────────────────────────────────────────

// depts_of_aspect(asp): nhiều-nhiều khía-cạnh → phòng.
function deptsOfAspect(aspId) {
  const a = ASPECTS.find(x => x.id === aspId || x.num === aspId)
  return a ? a.phong_phu_trach.slice() : []
}

// block_of_dept(dept): 1-1 (MECE) phòng → khối-cha.
function blockOfDept(deptCode) {
  const found = KHOI.filter(k => k.depts.includes(deptCode))
  if (found.length !== 1) return null // MECE vỡ → null (assert_partition bắt)
  return found[0].ma
}

// resolve(unit): phân-giải tên-kép → 3 nhãn (spec 04 §3(c)).
function resolveTenKep(unit) {
  return {
    ten_nganh: unit.ten_nganh || '',
    ten_nang_luc: unit.ten_nang_luc || '',
    maps_to: Array.isArray(unit.maps_to) ? unit.maps_to.slice() : (unit.maps_to ? [unit.maps_to] : []),
  }
}

// ── Bất-biến (spec 04 §6, §8) ────────────────────────────────────────────────

// INV-MECE-KHOI: hợp depts(K1..K7) = {dept-01..12}, đôi-một rời nhau, mỗi phòng đúng 1 khối.
function assertPartition() {
  const seen = {}
  for (const k of KHOI) {
    for (const d of k.depts) {
      if (seen[d]) return { ok: false, ly_do: `phòng ${d} thuộc >1 khối (${seen[d]}, ${k.ma})` }
      seen[d] = k.ma
    }
  }
  const covered = Object.keys(seen).sort()
  const missing = ALL_DEPTS.filter(d => !seen[d])
  if (missing.length) return { ok: false, ly_do: `phòng chưa khối-cha: ${missing.join(',')}` }
  if (covered.length !== 12) return { ok: false, ly_do: `phủ ${covered.length}/12 phòng` }
  return { ok: true }
}

// INV-ASPECT-COUNT: 11 khía-cạnh, đủ 4 nhóm, mỗi khía-cạnh ≥1 phòng.
function assertAspects() {
  if (ASPECTS.length !== 11) return { ok: false, ly_do: `có ${ASPECTS.length}/11 khía-cạnh` }
  const nhoms = new Set(ASPECTS.map(a => a.nhom))
  if (nhoms.size !== 4 || !NHOM_4.every(n => nhoms.has(n))) {
    return { ok: false, ly_do: `nhóm = ${[...nhoms].join(',')} (cần đúng 4)` }
  }
  for (const a of ASPECTS) {
    if (!a.phong_phu_trach || a.phong_phu_trach.length < 1) {
      return { ok: false, ly_do: `khía-cạnh ${a.id} không có phòng phụ-trách` }
    }
  }
  return { ok: true }
}

// INV-NO-NEW-DEPT: phòng phụ-trách khía-cạnh 10/11 ⊂ {dept-01..12}.
function assertNoNewDept() {
  for (const a of ASPECTS) {
    for (const d of a.phong_phu_trach) {
      if (!ALL_DEPTS.includes(d)) return { ok: false, ly_do: `${a.id} trỏ phòng ngoài canonical: ${d}` }
    }
  }
  return { ok: true }
}

// INV-TENKEP-3NHAN: đủ 3 trường, ten_nang_luc non-empty.
function validateTenKep(unit) {
  const r = resolveTenKep(unit)
  if (!r.ten_nganh) return { ok: false, ly_do: 'thiếu ten_nganh' }
  if (!r.ten_nang_luc) return { ok: false, ly_do: 'thiếu ten_nang_luc (khóa tra-kho)' }
  if (!r.maps_to.length) return { ok: false, ly_do: 'thiếu maps_to' }
  // INV-MAPS-TO-CANONICAL: mọi maps_to parse được K1..K7 và/hoặc dept-01..12
  for (const m of r.maps_to) {
    const parts = String(m).split('/').map(s => s.trim())
    for (const p of parts) {
      if (!/^K[1-7]$/.test(p) && !/^dept-(0[1-9]|1[0-2])$/.test(p)) {
        return { ok: false, ly_do: `maps_to ngoài canonical: ${p}` }
      }
    }
  }
  return { ok: true }
}

module.exports = {
  ASPECTS, KHOI, ALL_DEPTS, NHOM_4,
  deptsOfAspect, blockOfDept, resolveTenKep,
  assertPartition, assertAspects, assertNoNewDept, validateTenKep,
}
