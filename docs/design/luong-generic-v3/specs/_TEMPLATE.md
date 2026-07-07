---
id: <NN-ten-spec>
version: 0.1.0
status: draft           # draft | review | locked
source_anchor: "luong-generic-v3.html §<X>"
covers: []              # danh-sách claim ID, vd: [LG-2-file-telos, LG-2-gate-G0]
depends_on: []          # spec phụ-thuộc, vd: [01-nguyen-ly]
milestone: <M1..M6>
---

# <NN> · <Tên spec>

## 1. Mục-đích & phạm-vi
<1 đoạn: spec này hiện-thực phần nào của SoT, ranh-giới in/out.>

## 2. Thuật-ngữ liên-quan
<link tới 00-tong-quan-va-thuat-ngu.md cho các term dùng ở đây.>

## 3. Mô-hình dữ-liệu
<schema/field/kiểu/định-dạng file CHÍNH XÁC — dạng bảng. Đây là phần code đọc trực-tiếp.>

## 4. Hành-vi / thuật-toán
<pseudocode, thứ-tự bước, chuyển-trạng-thái, điều-kiện biên (edge-case).>

## 5. Ranh-giới generic ↔ phân-rã
<cái gì là config/bảng tĩnh (generic), cái gì suy-ra mỗi DN (phân-rã). Bám §1.1 SoT.>

## 6. Cổng & luật bất-biến
<gates, ràng-buộc CỨNG (vd NEED-APPROVAL), pre/post-condition, invariant.>

## 7. Giao-diện & điểm-cắm code
<file/hàm/prompt cụ-thể (lấy từ §9 SoT + cây repo thật). Loại: GIỮ / THÊM / SỬA.>

## 8. Tiêu-chí chấp-nhận
<test/fixture chạy được. Gồm lát Phở Hà liên-quan (claim LG-7-*) nếu có.>

## 9. Phụ-thuộc & thứ-tự
<milestone M1–M6, spec phải có trước.>

## 10. Bảng truy-vết
| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-... | §<n> | <tên test/fixture> |

## 11. OPEN-Q
<chỗ SoT mơ-hồ cần CEO chốt; rỗng nếu không có.>
