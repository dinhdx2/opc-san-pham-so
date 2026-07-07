'use strict'
// lib/tier.js — Mô-hình tầng + luật validate (spec 01).
//   validate_dung_tang  : phép-thử đúng-tầng (chống nén tầng) — §4.1
//   sinh_nhiem_vu_chinh : cơ-chế 3 lớp (điều-kiện-đủ → 3 chiều → quét chéo → cổng → neo) — §4.2

const text = require('./text')

const TANG = ['telos', 'muc_dich', 'muc_tieu', 'nv_chinh', 'nv_con', 'bo_phan', 'phong', 'khoi']

// §3.2 — dạng-ngôn-ngữ hợp-lệ BẮT-BUỘC theo tầng (khóa của validate_dung_tang).
const TANG_FORM = {
  telos: 'cau_song_con', muc_dich: 'cau_song_con', muc_tieu: 'trang_thai',
  nv_chinh: 'dong_tu', nv_con: 'nguyen_tu',
  bo_phan: 'danh_tu_cau_truc', phong: 'danh_tu_cau_truc', khoi: 'danh_tu_cau_truc',
}

// ── §4.1 validate_dung_tang(item) ────────────────────────────────────────────
// item: { tang, ten, dang_ngon_ngu?, nguon? }
function validateDungTang(item) {
  const ok = () => ({ ok: true })
  const fail = ly_do => ({ ok: false, ly_do })
  const batDauDongTu = text.startsWithVerb(item.ten)

  // Nếu item KHAI `dang_ngon_ngu` thì phải khớp dạng hợp-lệ của tầng (§3.2) — bắt khai-báo mâu-thuẫn.
  if (item.dang_ngon_ngu != null && item.dang_ngon_ngu !== '' && TANG_FORM[item.tang]
    && item.dang_ngon_ngu !== TANG_FORM[item.tang]) {
    return fail(`dang_ngon_ngu='${item.dang_ngon_ngu}' ≠ dạng bắt-buộc '${TANG_FORM[item.tang]}' của tầng ${item.tang} (§3.2)`)
  }

  switch (item.tang) {
    case 'muc_dich': // LG-1.3-muc-dich — câu-sống-còn 1 câu; KHÔNG ép động-từ
      if (!text.isSingleSentence(item.ten)) return fail('mục-đích phải là 1 câu-sống-còn')
      return ok()

    case 'muc_tieu': // LG-1.3-muc-tieu (LUẬT then-chốt)
      if (batDauDongTu) return fail('mục-tiêu mở-đầu bằng ĐỘNG-TỪ ⇒ đây là nhiệm-vụ-chính, NÉN TẦNG')
      if (!text.expressesState(item.ten)) return fail("mục-tiêu phải là TRẠNG-THÁI đo đạt/chưa (vd '… sẵn-sàng')")
      return ok()

    case 'nv_chinh': // LG-1.3-nv-chinh
      if (!batDauDongTu) return fail('nhiệm-vụ-chính phải mở-đầu bằng ĐỘNG-TỪ + đối-tượng')
      return ok()

    case 'nv_con': // LG-1.3-nv-con
      if (!item.ten || !String(item.ten).trim()) return fail('nhiệm-vụ-con phải nguyên-tử, kiểm-chứng được')
      return ok()

    case 'telos': // LG-1.1-6 / INV-2
      if (item.nguon !== 'ceo') return fail('telos do CEO quyết, AI không tự đặt')
      return ok()

    case 'bo_phan':
    case 'phong':
    case 'khoi':
      if (batDauDongTu) return fail('tầng cấu-trúc phải là DANH-TỪ tổ-chức')
      return ok()

    default:
      return fail(`tầng không hợp-lệ: ${item.tang}`)
  }
}

// ── §4.2 sinh_nhiem_vu_chinh(muc_tieu, brain) ────────────────────────────────
// Dữ-liệu hoá để xác-định (cơ-chế NLP "bẻ state" là DN-specific — driver cấp điều-kiện-đủ).
//   muc_tieu.dieu_kien_du: [{ id, mo_ta, chieu(tan|thu|hau), khia_canh, required }]
//   brain.met            : [id] điều-kiện ĐÃ đạt (da_dat) — không sinh việc cho chúng
// back_test_du(set): mọi điều-kiện REQUIRED được đạt-bởi-brain HOẶC đóng-bởi-1-nvc-trong-set.
function sinhNhiemVuChinh(mucTieu, brain) {
  brain = brain || {}
  const met = new Set(brain.met || [])
  const conds = (mucTieu.dieu_kien_du || []).map(d => ({ ...d, da_dat: met.has(d.id) }))

  const taoNvc = d => ({
    id: 'nvc-' + d.id,
    ten: d.ten || ('Đóng điều-kiện: ' + d.mo_ta),
    chieu: d.chieu,
    khia_canh: d.khia_canh,
    dong_dieu_kien: d.id,
    thuoc_do: null,
  })

  // Lớp 1 · SINH — mỗi điều-kiện CHƯA đạt → 1 nhiệm-vụ-chính
  let tap = conds.filter(d => !d.da_dat).map(taoNvc)

  // Lớp 2 · SOI 3 chiều — chiều trống mà có điều-kiện ⇒ bổ-sung (vòng lại Lớp 1)
  for (const chieu of ['tan', 'thu', 'hau']) {
    const hasDir = tap.some(v => v.chieu === chieu)
    if (!hasDir) {
      const extra = conds.filter(d => d.chieu === chieu && !d.da_dat && !tap.some(v => v.dong_dieu_kien === d.id))
      tap = tap.concat(extra.map(taoNvc))
    }
  }

  // Lớp 3 · QUÉT-NGANG — đối-chiếu chéo 11 khía-cạnh, bắt việc sót xuyên-khía-cạnh (LG-1.4-L3, lưới LG-6.4-L3)
  // "Đạt state này đụng khía-cạnh nào khác chưa có việc?" — khía-cạnh state CHẠM (khia_canh_lien_quan, mặc-định = mọi
  // khía-cạnh có điều-kiện) trừ khía-cạnh đã ĐƯỢC-PHỦ (có việc) hoặc đã-ĐẠT (brain) hoặc đang NGỦ theo GĐ.
  //  · nếu khía-cạnh sót CÓ điều-kiện chưa-đạt chưa-thành-việc → SINH việc (vòng lại Lớp 1, an-toàn-lưới).
  //  · nếu khía-cạnh sót KHÔNG có điều-kiện nào → cờ `khia_canh_sot` cho architect bổ-sung điều-kiện-đủ.
  const ngu = new Set(mucTieu.khia_canh_ngu || [])
  const daDatKc = conds.filter(d => d.da_dat).map(d => d.khia_canh)
  const touched = (mucTieu.khia_canh_lien_quan && mucTieu.khia_canh_lien_quan.length)
    ? mucTieu.khia_canh_lien_quan.slice()
    : [...new Set(conds.map(d => d.khia_canh).filter(Boolean))]
  const khia_canh_sot = []
  for (const kc of touched) {
    if (ngu.has(kc)) continue
    const covered = new Set([...tap.map(v => v.khia_canh), ...daDatKc].filter(Boolean))
    if (covered.has(kc)) continue
    const extra = conds.filter(d => d.khia_canh === kc && !d.da_dat && !tap.some(v => v.dong_dieu_kien === d.id))
    if (extra.length) tap = tap.concat(extra.map(taoNvc)) // sinh việc sót xuyên-khía-cạnh
    else khia_canh_sot.push(kc)                            // đụng khía-cạnh nhưng thiếu điều-kiện-đủ → cờ bổ-sung
  }

  // Cổng nghiệm — ĐỦ · TỐI-THIỂU · KHÔNG-TRÙNG (LG-1.4-gate)
  const required = conds.filter(d => d.required).map(d => d.id)
  const backTest = set => {
    const closed = new Set([...met, ...set.map(v => v.dong_dieu_kien)])
    return required.every(id => closed.has(id))
  }
  // ĐỦ
  const du = backTest(tap)
  // TỐI-THIỂU: bỏ 1 việc mà vẫn back-test ⇒ thừa → cắt.
  // NHƯNG bảo-vệ chống-sót Lớp 2/3: KHÔNG cắt việc là cover DUY-NHẤT của một chiều THỦ/HẬU
  // (pre-mortem) hoặc của một khía-cạnh state CHẠM (active) — dù điều-kiện đó required:false.
  const touchedActive = new Set(touched.filter(kc => kc && !ngu.has(kc)))
  const thua = []
  for (const v of [...tap]) {
    const without = tap.filter(x => x !== v)
    if (!backTest(without)) continue
    const soleChieu = (v.chieu === 'thu' || v.chieu === 'hau') && !without.some(x => x.chieu === v.chieu)
    const soleKc = v.khia_canh && touchedActive.has(v.khia_canh) && !without.some(x => x.khia_canh === v.khia_canh)
    if (soleChieu || soleKc) continue // giữ — Lớp 2 (thủ) / Lớp 3 (xuyên-khía-cạnh) chống-sót
    thua.push(v); tap = without
  }
  // KHÔNG-TRÙNG: gộp việc cùng dong_dieu_kien
  const seen = new Map()
  tap = tap.filter(v => (seen.has(v.dong_dieu_kien) ? false : (seen.set(v.dong_dieu_kien, 1), true)))

  // Neo đo (chống việc-ma) — LG-1.4-neo
  for (const v of tap) {
    if (v.dong_dieu_kien == null) continue
    v.thuoc_do = v.chieu === 'tan' ? { loai: 'okr', gia_tri: 'OKR(' + v.id + ')' }
                                   : { loai: 'kpi_nguong', gia_tri: 'KPI-ngưỡng(' + v.id + ')' }
  }
  tap = tap.filter(v => v.dong_dieu_kien != null) // không neo được = cắt

  return { tap_nvc: tap, du, thua, khia_canh_sot, back_test: backTest }
}

// ── §4.3 validate_cay_viec(cay_viec) — CỔNG bẻ-xuống nhiệm-vụ-con (chống "quên nv-con") ──
// Bất-biến: mỗi NHIỆM-VỤ-CHÍNH PHẢI được bẻ xuống ≥1 NHIỆM-VỤ-CON nguyên-tử, mỗi nv-con khai
// chiều ∈ {tan,thu,hau} (soi-3-chiều, lưới LG-6.4-L2). NVC là LÁ (0 nv-con) = lỗi phân-rã.
//   cay_viec: [{ id?, ten, nv_con: [{ ten, chieu }] }]
// Trả: { ok, loi:[...], canh_bao:[...] } — loi = HARD FAIL (chặn Cổng B); canh_bao = soi mềm (pre-mortem).
const CHIEU_HOP_LE = new Set(['tan', 'thu', 'hau'])
function validateCayViec(cayViec) {
  const loi = [], canh_bao = []
  const list = Array.isArray(cayViec) ? cayViec : []
  if (!list.length) loi.push('cây việc rỗng: chưa có nhiệm-vụ-chính nào')
  const chieuTree = new Set()
  for (const nvc of list) {
    const nhan = nvc.id || nvc.ten || '(NVC không tên)'
    const con = Array.isArray(nvc.nv_con) ? nvc.nv_con : []
    // HARD: NVC phải được bẻ xuống nv-con (đây là lỗi "quên bẻ" cần chặn)
    if (!con.length) { loi.push(`NVC "${nhan}": CHƯA bẻ xuống nhiệm-vụ-con nguyên-tử (Bước 1B-4)`); continue }
    for (const c of con) {
      if (!c || !String((c && c.ten) || '').trim()) loi.push(`NVC "${nhan}": có nv-con rỗng/không tên`)
      if (!CHIEU_HOP_LE.has(c && c.chieu)) loi.push(`NVC "${nhan}": nv-con "${(c && c.ten) || '?'}" thiếu/không hợp-lệ chiều (tan|thu|hau)`)
      else chieuTree.add(c.chieu)
    }
    // SOFT: mỗi NVC nên có ≥1 nv-con tấn (việc LÀM tạo state)
    if (!con.some(c => c && c.chieu === 'tan')) canh_bao.push(`NVC "${nhan}": chưa có nv-con chiều 🗡tấn (việc LÀM tạo trạng-thái)`)
  }
  // SOFT: cả cây nên phủ đủ 3 chiều (thiếu thủ/hậu = dễ sót gác/cấp-nguồn-lực)
  for (const ch of ['tan', 'thu', 'hau']) if (list.length && !chieuTree.has(ch)) canh_bao.push(`cả cây thiếu chiều "${ch}" — soi pre-mortem có thể sót`)
  return { ok: loi.length === 0, loi, canh_bao }
}

module.exports = { TANG, validateDungTang, sinhNhiemVuChinh, validateCayViec }
