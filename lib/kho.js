'use strict'
// lib/kho.js — KHO chỉ-mục (spec 05): them()/tra()/don() + lược-đồ _index.md 13 cột.
// Danh-bạ = generic (khung + khóa canonical); tài-sản = phân-rã theo ngành.
// Side-effect git (commit_push) trừu-tượng-hoá thành hook (skill thật chạy git).

const re = require('./rule-engines')
const text = require('./text')

const COLS = ['id', 'tầng', 'tên-năng-lực', 'tên-ngành', 'maps_to', 'khía-cạnh', 'GĐ',
  'đầu-vào / đầu-ra', 'tài-sản', 'reuse-grade', 'trạng-thái', 'nguồn · phiên-bản', 'superseded_by']
const REQUIRED_COLS = 12 // cột 1–12 bắt-buộc; 13 (superseded_by) dẫn-xuất
const TANG_ENUM = ['khối', 'phòng', 'bộ-phận', 'tài-sản'] // enum cột `tầng` (spec 05 §3.2)

// ── CHUẨN tên (INV-2, LG-5.3-chuan-ten) ──────────────────────────────────────
function isKebabDottedId(id) {
  // <ngành>.<khối>.<phòng>.<bộ-phận>, kebab, ngăn bằng '.', không khoảng-trắng
  if (/\s/.test(id)) return false
  const parts = String(id).split('.')
  if (parts.length < 4) return false
  return parts.every(p => /^[a-z0-9-]+$/.test(p))
}
function validateChuanTen(id, tenNangLuc) {
  if (!isKebabDottedId(id)) return { ok: false, ly_do: `id "${id}" không kebab/dotted hợp-lệ` }
  // tên-năng-lực phải có trong từ-điển canonical (so qua naming_dict)
  const e = re.namingResolve(tenNangLuc)
  if (!e) return { ok: false, ly_do: `tên-năng-lực "${tenNangLuc}" không trong từ-điển canonical` }
  return { ok: true, canonical: e.canonical }
}

// ── stage range overlap (cột GĐ) ─────────────────────────────────────────────
function parseGd(s) {
  const nums = String(s).match(/\d/g) || []
  if (!nums.length) return []
  const a = parseInt(nums[0], 10), b = parseInt(nums[nums.length - 1], 10)
  const out = []
  for (let i = Math.min(a, b); i <= Math.max(a, b); i++) out.push(i)
  return out
}
function gdOverlap(a, b) {
  const A = parseGd(a), B = parseGd(b)
  return A.some(x => B.includes(x))
}

// handle(item): khóa phiên-bản RESOLVABLE — superseded_by của bản cũ === handle(bản live kế) (LG-5.2-col-trangthai).
function handle(item) { return `${item.id}@${item.phien_ban}` }

// nhanh_duoc_kich_hoat (LG-5.1-activate): CHỈ kích-hoạt nhánh KHO khi có tài-sản đạt reuse-grade A/B.
// "Không nhánh rỗng" — cổng cho skill TRƯỚC khi tạo cây playbook/<ngành>/<Kx>/<dept>/<bộ-phận>/.
function nhanhDuocKichHoat(x) {
  const x2 = x || {}
  const tai_san = x2.tai_san || x2.tai_san_chuan || []
  const grade = String(x2.reuse_grade || (x2.meta && x2.meta.reuse_grade) || '').toUpperCase()
  return Array.isArray(tai_san) && tai_san.length > 0 && ['A', 'B'].includes(grade)
}

// ── §5.1 cây thư-mục KHO: dựng/validate đường-dẫn từ id chuẩn (LG-5.1-tree) ──
// id = <ngành>.<khối>.<phòng>.<bộ-phận> → knowledge/playbook/<ngành>/<Kx>/<dept-xx>/<bộ-phận>/.
// HÀM THUẦN — chỉ dựng/kiểm đường-dẫn, KHÔNG ghi filesystem (skill ghi file tài-sản — quyết-định kiến-trúc).
const PLAYBOOK_ROOT = 'knowledge/playbook'
const KHO_FILES = ['SOP.md', 'template/', 'persona.md', 'rubric.md', 'meta.yaml']
function cayThuMuc(item) {
  const id = typeof item === 'string' ? item : (item && item.id) || ''
  const parts = String(id).split('.')
  if (parts.length < 4) return { ok: false, ly_do: `id "${id}" không đủ 4 cấp <ngành>.<khối>.<phòng>.<bộ-phận>` }
  const [nganh, khoi, phong, ...rest] = parts
  const boPhan = rest.join('.')
  if (!/^[a-z0-9-]+$/.test(nganh)) return { ok: false, ly_do: `ngành "${nganh}" không kebab` }
  if (!/^k[1-7]$/i.test(khoi)) return { ok: false, ly_do: `khối "${khoi}" ngoài K1..K7` }
  if (!/^dept-(0[1-9]|1[0-2])$/.test(phong)) return { ok: false, ly_do: `phòng "${phong}" ngoài dept-01..12` }
  if (!/^[a-z0-9-]+$/.test(boPhan)) return { ok: false, ly_do: `bộ-phận "${boPhan}" không kebab` }
  const Kx = khoi.toUpperCase()
  return {
    ok: true,
    dir: `${PLAYBOOK_ROOT}/${nganh}/${Kx}/${phong}/${boPhan}`,
    index: `${PLAYBOOK_ROOT}/${nganh}/_index.md`,
    parts: { nganh, khoi: Kx, phong, bo_phan: boPhan },
    files: KHO_FILES.slice(),
  }
}

// ── 4.1 them(p) = PROMOTE (LG-5.3-them) ──────────────────────────────────────
function them(p, index) {
  index = index || []
  if (!p.qua_cong_promote) return { reject: true, ly_do: 'chưa qua cổng PROMOTE — không vào index' }
  const m = p.meta || {}
  const id = m.id || chuanHoaId(m)
  const ten = validateChuanTen(id, m.ten_nl)
  if (!ten.ok) return { reject: true, ly_do: ten.ly_do }
  if (!p.tai_san_chuan || !p.tai_san_chuan.length) return { reject: true, ly_do: 'tài-sản rỗng — không có gì để reuse' }
  // đủ cột bắt-buộc
  for (const f of ['ten_nl', 'ten_nganh', 'maps_to', 'khia_canh', 'gd', 'io', 'reuse_grade', 'nguon']) {
    if (m[f] == null || m[f] === '') return { reject: true, ly_do: `thiếu cột bắt-buộc: ${f}` }
  }
  // cổng PROMOTE (spec 05/03d §4.3 · INV-2/INV-3): CHỈ grade A/B vào index; grade C → bỏ-qua.
  if (!['A', 'B'].includes(String(m.reuse_grade).toUpperCase())) {
    return { reject: true, ly_do: `reuse_grade=${m.reuse_grade} ∉ {A,B} — grade C đẻ-mới, KHÔNG vào index` }
  }
  // enum cột `tầng` (spec 05 §3.2): nếu khai thì phải ∈ {khối,phòng,bộ-phận,tài-sản}.
  if (m.tang != null && m.tang !== '' && !TANG_ENUM.includes(String(m.tang))) {
    return { reject: true, ly_do: `tầng=${m.tang} ∉ {${TANG_ENUM.join(',')}}` }
  }
  const item = {
    id, tang: m.tang || 'bộ-phận', ten_nang_luc: m.ten_nl, ten_nganh: m.ten_nganh,
    maps_to: m.maps_to, khia_canh: m.khia_canh, gd: m.gd, io: m.io,
    tai_san: p.tai_san_chuan.slice(), reuse_grade: m.reuse_grade, trang_thai: 'live',
    nguon: m.nguon, phien_ban: m.phien_ban || 'v1', superseded_by: null,
  }
  const existing = index.find(x => x.id === id && x.trang_thai !== 'deprecated')
  if (existing) {
    existing.trang_thai = 'deprecated'
    existing.superseded_by = id + '@' + bumpVersion(existing.phien_ban)
    item.phien_ban = bumpVersion(existing.phien_ban)
  }
  index.push(item)
  return { item, index }
}

// ── xet_promote(asset, index) (spec 03d §4.3) — nối Cổng PASS → PROMOTE ───────
// grade A/B → them() vào _index.md; grade C → bo_qua() (KHÔNG ghi). Trả {promoted, item?, ly_do, index}.
function xetPromote(asset, index) {
  index = index || []
  const a = asset || {}
  const m = a.meta || {}
  const grade = String(m.reuse_grade == null ? a.reuse_grade : m.reuse_grade || '').toUpperCase()
  if (!['A', 'B'].includes(grade)) return { promoted: false, ly_do: `grade ${grade || '∅'} — đẻ-mới, bỏ-qua PROMOTE`, index }
  const r = them(Object.assign({}, a, { qua_cong_promote: true }), index)
  if (r.reject) return { promoted: false, ly_do: r.ly_do, index }
  return { promoted: true, item: r.item, ly_do: 'grade A/B → vào _index.md', index: r.index }
}

function chuanHoaId(m) {
  const slug = s => text.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const block = (String(m.maps_to).match(/K[1-7]/) || ['kx'])[0].toLowerCase()
  const dept = (String(m.maps_to).match(/dept-\d{2}/) || ['dept-00'])[0]
  const bp = re.namingResolve(m.ten_nl)
  return `${slug(m.nganh || 'nganh')}.${block}.${dept}.${bp ? bp.canonical : slug(m.ten_nl)}`
}
function bumpVersion(v) {
  const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 1
  return 'v' + (n + 1)
}

// ── 4.2 tra(ctx) = REUSE (LG-5.3-tra) ────────────────────────────────────────
function tra(ctx, index) {
  index = index || []
  const canon = re.namingResolve(ctx.ten_nang_luc)
  const canonSlug = canon ? canon.canonical : text.norm(ctx.ten_nang_luc)
  const ungVien = []
  for (const item of index) {
    if (item.trang_thai === 'deprecated') continue // INV-5
    const itemCanon = re.namingResolve(item.ten_nang_luc)
    const itemSlug = itemCanon ? itemCanon.canonical : text.norm(item.ten_nang_luc)
    if (itemSlug !== canonSlug) continue // khóa CỨNG: tên-năng-lực canonical
    const sKhia = ctx.khia_canh && item.khia_canh && text.norm(ctx.khia_canh) === text.norm(item.khia_canh) ? 1 : 0
    const sGd = ctx.gd && item.gd && gdOverlap(ctx.gd, item.gd) ? 1 : 0
    const sIo = matchIo(ctx.io, item.io) ? 1 : 0
    const W = re.REUSE_CONFIG
    const diem = W.w_khia_canh * sKhia + W.w_gd * sGd + W.w_io * sIo
    ungVien.push({ item, diem_khop: Math.round(diem * 100) / 100 })
  }
  ungVien.sort((a, b) => b.diem_khop - a.diem_khop)
  for (const uv of ungVien) {
    const d = re.reuseDecision(uv, ctx)
    uv.ket_luan = d.quyet_dinh.toLowerCase()
    uv.grade = d.grade
  }
  return ungVien
}
function matchIo(a, b) {
  if (!a || !b) return false
  const va = text.norm(a.vao || ''), vb = text.norm(b.vao || '')
  const ra = text.norm(a.ra || ''), rb = text.norm(b.ra || '')
  const sub = (x, y) => x && y && (x.includes(y) || y.includes(x))
  return (sub(va, vb)) && (sub(ra, rb))
}

// ── 4.3 don(id) = deprecate giữ-vết (LG-5.3-don) ─────────────────────────────
function don(id, supersededBy, index) {
  index = index || []
  const item = index.find(x => x.id === id && x.trang_thai !== 'deprecated')
  if (!item) return { reject: true, ly_do: `không tìm mục live id=${id}` }
  item.trang_thai = 'deprecated'
  item.superseded_by = supersededBy || null
  return { item, index }
}

// ── §5.3 DỌN định-kỳ: gộp mục trùng + hạ-cấp grade theo calibration (LG-5.3-don) ──
// raDinhKy(index, { hong: [id...] }): hong = id mà calibration báo "dùng-lại hay hỏng".
//  (1) gộp trùng: cùng id còn nhiều bản live → giữ phiên-bản CAO nhất, hạ bản cũ thành deprecated.
//  (2) hạ-cấp reuse-grade A→B→C cho mục bị calibration báo hỏng. Trả báo-cáo {gop, ha_cap}.
function raDinhKy(index, opts) {
  index = index || []
  opts = opts || {}
  const hong = new Set(opts.hong || [])
  const gop = [], ha_cap = []
  // (1) gộp trùng theo id
  const live = new Map()
  for (const it of index) {
    if (it.trang_thai === 'deprecated') continue
    const cur = live.get(it.id)
    if (!cur) { live.set(it.id, it); continue }
    const newer = verNum(it.phien_ban) >= verNum(cur.phien_ban) ? it : cur
    const older = newer === it ? cur : it
    older.trang_thai = 'deprecated'
    older.superseded_by = handle(newer)
    live.set(it.id, newer)
    gop.push(older.id)
  }
  // (2) hạ-cấp grade các mục calibration báo hỏng (A→B→C, không xuống dưới C)
  const ORDER = ['A', 'B', 'C']
  for (const it of index) {
    if (it.trang_thai === 'deprecated' || !hong.has(it.id)) continue
    const i = ORDER.indexOf(it.reuse_grade)
    if (i >= 0 && i < ORDER.length - 1) {
      it.reuse_grade = ORDER[i + 1]
      ha_cap.push({ id: it.id, grade_moi: it.reuse_grade })
    }
  }
  return { index, gop, ha_cap }
}
function verNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 1 }

// ── (de)serialize _index.md (13 cột) ─────────────────────────────────────────
function serializeIndexMd(items) {
  const head = '| ' + COLS.join(' | ') + ' |'
  const sep = '|' + COLS.map(() => '---').join('|') + '|'
  const rows = items.map(it => '| ' + [
    it.id, it.tang, it.ten_nang_luc, it.ten_nganh, it.maps_to, it.khia_canh, it.gd,
    `vào: ${it.io ? it.io.vao : ''} · ra: ${it.io ? it.io.ra : ''}`,
    (it.tai_san || []).join(', '), it.reuse_grade, it.trang_thai,
    `${it.nguon} ${it.phien_ban}`, it.superseded_by || '',
  ].join(' | ') + ' |')
  return [head, sep, ...rows].join('\n') + '\n'
}
function parseIndexMd(md) {
  const lines = md.split(/\r?\n/).filter(l => l.trim().startsWith('|'))
  if (lines.length < 2) return []
  const items = []
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').slice(1, -1).map(c => c.trim())
    if (cells.length < REQUIRED_COLS) continue
    const ioM = (cells[7] || '').match(/vào:\s*(.*?)\s*·\s*ra:\s*(.*)/)
    // cột `nguồn · phiên-bản`: neo phiên-bản = token `v…` CUỐI; phần còn lại = nguồn (cho-phép nguồn có khoảng-trắng).
    const nvRaw = cells[11] || ''
    const nvM = nvRaw.match(/^(.*?)\s+(v[0-9][\w.]*)\s*$/)
    items.push({
      id: cells[0], tang: cells[1], ten_nang_luc: cells[2], ten_nganh: cells[3], maps_to: cells[4],
      khia_canh: cells[5], gd: cells[6], io: { vao: ioM ? ioM[1] : '', ra: ioM ? ioM[2] : '' },
      tai_san: (cells[8] || '').split(',').map(s => s.trim()).filter(Boolean),
      reuse_grade: cells[9], trang_thai: cells[10],
      nguon: nvM ? nvM[1] : nvRaw, phien_ban: nvM ? nvM[2] : 'v1',
      superseded_by: cells[12] || null,
    })
  }
  return items
}

module.exports = {
  COLS, REQUIRED_COLS, TANG_ENUM, PLAYBOOK_ROOT, KHO_FILES, validateChuanTen, isKebabDottedId, chuanHoaId, handle, nhanhDuocKichHoat, cayThuMuc,
  them, xetPromote, tra, don, raDinhKy, serializeIndexMd, parseIndexMd, parseGd, gdOverlap,
}
