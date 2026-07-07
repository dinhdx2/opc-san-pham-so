'use strict'
// lib/text.js — tiện-ích văn-bản tiếng Việt cho rule-engine (so-khớp xác-định, không LLM).

function norm(s) {
  return String(s == null ? '' : s).toLowerCase().trim()
}

// So-khớp keyword: bất-kỳ keyword nào là chuỗi-con của `hay` (đã hạ-chữ).
function matchesAny(hay, keywords) {
  const h = norm(hay)
  for (const k of keywords || []) {
    if (norm(k) && h.includes(norm(k))) return true
  }
  return false
}

// Đếm số keyword khớp (để argmax theo độ mạnh dấu-hiệu).
function countMatches(hay, keywords) {
  const h = norm(hay)
  let n = 0
  for (const k of keywords || []) {
    if (norm(k) && h.includes(norm(k))) n++
  }
  return n
}

// Từ-điển ĐỘNG-TỪ hành-động (spec 01 §4.1 / OQ-1: từ-điển động-từ + heuristic vị-trí).
// Token đầu của một câu khớp danh-sách này ⇒ câu MỞ-ĐẦU bằng động-từ ⇒ là VIỆC.
const ACTION_VERBS = new Set([
  'thiết-lập', 'thiết', 'lập', 'mở', 'dựng', 'xây', 'xây-dựng', 'hoàn-tất', 'hoàn-thành',
  'chứng-minh', 'kiểm-soát', 'khoá', 'khóa', 'chặn', 'đàm-phán', 'tra', 'soạn', 'viết',
  'tạo', 'triển-khai', 'thông', 'đo', 'theo-dõi', 'gửi', 'đăng', 'ký', 'nộp', 'bật', 'đổ',
  'submit', 'publish', 'xoá', 'xóa', 'thu', 'kéo', 'gieo', 'bồi', 'nhân-bản', 'tối-ưu',
  'cải-tiến', 'phát-triển', 'tuyển', 'đào-tạo', 'chốt', 'gom', 'rà', 'đối-soát', 'rút',
  'phân-tích', 'phân-loại', 'tích-hợp', 'cài', 'cài-đặt', 'kết-nối', 'chạy', 'làm', 'gắn',
  'cập-nhật', 'xác-minh', 'kiểm', 'duyệt', 'phê-duyệt', 'thanh-toán', 'mua', 'bán',
])

function firstToken(s) {
  const t = norm(s).split(/[\s,;]+/).filter(Boolean)
  return t.length ? t[0] : ''
}

// test_dong_tu: token đầu là động-từ hành-động?
function startsWithVerb(s) {
  return ACTION_VERBS.has(firstToken(s))
}

// Dấu-hiệu TRẠNG-THÁI (đo "đạt/chưa") — để bieu_dat_trang_thai.
const STATE_MARKERS = [
  'sẵn-sàng', 'sẵn sàng', 'đã ', 'được', '≥', '≤', '>=', '<=', 'ổn-định', 'ổn ', 'ổn,',
  'hoàn-chỉnh', 'hoàn-tất', 'đạt', 'chuẩn', 'realtime', 'đủ', 'đúng hạn', 'tin-cậy',
  'thay được', 'xác-nhận', 'duy-trì', 'chặn', 'hợp-lệ', '%', 'không bị', 'có người thay',
]

function expressesState(s) {
  const h = norm(s)
  return STATE_MARKERS.some(m => h.includes(norm(m)))
}

// la_mot_cau: 1 câu (không rỗng, không nhiều câu kết bằng . ! ?).
function isSingleSentence(s) {
  const t = norm(s)
  if (t === '') return false
  const mids = t.slice(0, -1).match(/[.!?]/g)
  return !mids || mids.length === 0
}

module.exports = {
  norm, matchesAny, countMatches, startsWithVerb, firstToken,
  expressesState, isSingleSentence, ACTION_VERBS, STATE_MARKERS,
}
