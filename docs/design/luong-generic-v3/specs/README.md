# Bộ SPEC implement — Luồng Generic vn-opc (v3.3)

Bộ spec mô-tả chi-tiết sẵn-sàng-code cho `../luong-generic-v3.html` (SoT). Mỗi spec ứng 1 phần của tài-liệu nguồn; truy-vết "không bỏ sót" qua sổ-claim + check-coverage.

## Cách dùng (từ gốc repo)
```bash
npm run check-coverage   # = docs/design/luong-generic-v3/specs/tools/check-coverage.js
                         # kiểm C1 toàn-phủ · C2 không-bịa · C3 test-phủ · AC-glossary
```
Hiện-trạng: **220/220 claim phủ spec, C1/C2/C3 PASS** (xem `_coverage.md`). Ở lớp IMPLEMENT: **162/220 claim có test thực-thi** (`npm run check-impl` I3; phần còn lại là prompt-only/prose, liệt ở I4) — xem `IMPL-STATUS.md`.

## Bản-đồ file
| File | Phủ phần SoT | Bản-chất implement |
|---|---|---|
| `_PLAN.md` | (toàn-bộ) | kế-hoạch + cơ-chế truy-vết không-bỏ-sót |
| `_claims.md` | (toàn-bộ) | sổ-claim nguyên-tử (ID ổn-định, 220 claim) |
| `_coverage.md` | (toàn-bộ) | ma-trận phủ claim → spec |
| `_TEMPLATE.md` | — | khuôn spec 11 mục |
| `tools/check-coverage.js` | — | trình kiểm truy-vết (Node) |
| `00-tong-quan-va-thuat-ngu.md` | §0 + Glossary | khái-niệm 2 trục + từ-điển thuật-ngữ |
| `01-nguyen-ly-va-mo-hinh-tang.md` | §1 | domain model + luật validate đúng-tầng + sinh nhiệm-vụ-chính 3 lớp |
| `02-brain-schema.md` | §2 | data contract 00-Brain + G0 + altitude |
| `03-luong-orchestration.md` | §3 (tổng) | state-machine PHA 0→4 + router đệ-quy |
| `03a-pha0-khoi-tao.md` | §3 PHA 0 | khởi-tạo + phát-hiện stage |
| `03b-pha1-phan-ra.md` | §3 PHA 1 | phân-rã sinh-thành + gom ngược-lên + tra-kho |
| `03c-pha2-thuc-thi.md` | §3 PHA 2 | thực-thi đệ-quy + cổng cứng |
| `03d-pha3-khep-vong.md` | §3 PHA 3 | đơn/song-vòng + PASS/PROMOTE/cổng GĐ |
| `03e-pha4-mo-rong.md` | §3 PHA 4 | mở-rộng đường-cong + 3-phép-thử |
| `04-taxonomy-generic.md` | §4 | 11 khía-cạnh · 7 khối · 12 phòng · tên-kép |
| `05-kho-chi-muc.md` | §5 | schema _index.md + API thêm/tra/dọn |
| `06-bang-tra-rule-engines.md` | §6 | 6 bảng generic = 6 hàm xác-định |
| `07-fixture-pho-ha.md` | §7 | golden end-to-end test |
| `08-artifact-vault-layout.md` | §8 | bố-cục file & IO vault |
| `09-codebase-integration-map.md` | §9 | đấu-dây code + lộ-trình M1-M6 |

## Quy-trình khi SoT đổi
Sửa `luong-generic-v3.html` → cập-nhật `_claims.md` (giữ ID cũ) → `check-coverage` báo claim mới chưa phủ → sửa spec tới khi C1-C3 xanh → commit cùng lượt. Chi-tiết: `_PLAN.md §F`.
