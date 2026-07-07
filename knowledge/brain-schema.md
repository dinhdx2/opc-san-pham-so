# Brain Contract — schema bắt buộc của `vault/00-Brain/`

> Hợp đồng dữ liệu giữa vault và các phòng ban.
> Thư mục `vault/00-Brain/` gồm **7 file nền** = **5 file canonical** (input debate) + **2 file bộ nhớ** (`decisions-log.md`, `calibration.md`); **+ 5 file sinh-thành** lớp Brain-2-lớp v3 (`telos · positioning · curves · structure · lessons` — xem mục "Brain 2 lớp" bên dưới) ⇒ tổng **12 file**.
> Mọi persona/agent CHỈ được trích quan điểm từ 5 file canonical dưới đây.
> Nếu persona cần dữ liệu không có file riêng (vd "thị trường", "tài chính"), tra trong file canonical tương ứng — KHÔNG bịa tên file mới.

## 5 file canonical (BẮT BUỘC)

| File | Giữ thông tin gì | Bí danh cũ (KHÔNG dùng nữa) |
|---|---|---|
| `strategy.md` | Vision, mission, ICP, USP, positioning, go-to-market, **thị trường/đối thủ/quy mô** | `market.md` · `marketing.md` · `customers.md` · `sales.md` |
| `products.md` | Danh mục sản phẩm/dịch vụ, unit economics (giá, biên gộp, AOV, ROAS hòa vốn) | `product.md` |
| `budget.md` | **Tài chính**: ngân sách, dòng tiền, doanh thu, chi phí, phân bổ vốn | `finance.md` |
| `state.md` | Ảnh chụp nhanh hiện trạng: giai đoạn, tài sản, KPI hiện tại, rủi ro nổi cộm | `operations.md` · `laws.md` |
| `headcount.md` | Nhân sự, cơ cấu, kế hoạch tuyển | `people.md` |

> **Bảng bí-danh CỨNG (`required_refs` CHỈ được trỏ 1 trong 5 canonical trên + lớp sinh-thành; KHÔNG bịa file mới):**
> `finance→budget` · `market/marketing/customers/sales→strategy` · `product→products` · `people→headcount` · `operations/laws→state`.
> Lý do gộp: `strategy.md` chứa ICP/GTM/thị-trường (nên hút customers/sales/marketing/market); `state.md` chứa "rủi ro nổi cộm" (nên hút operations/laws — luật VN cụ-thể lấy từ `knowledge/templates-vn/`, KHÔNG từ Brain). Persona khuôn-sinh `knowledge/departments/` + pack `knowledge/packs/*/departments/` đã tuân bảng này; onboard (vn-onboarder Bước 6c) tinh-chỉnh vẫn PHẢI giữ. KHÔNG tham chiếu `finance.md`/`market.md`/`laws.md`/`people.md`/`operations.md`/`customers.md`/`marketing.md`/`sales.md`/`product.md` nữa.

## File bộ nhớ (memory — không phải input perspective)

| File | Vai trò |
|---|---|
| `decisions-log.md` | **Append-only.** Quyết định CEO đã DUYỆT. Orchestrator đọc các mục `status: locked` TRƯỚC debate → nạp vào `brainContext` mục "QUYẾT ĐỊNH ĐÃ CHỐT — KHÔNG bàn lại"; ghi mục mới sau PAUSE 2/3. Giải bài tái tranh luận việc đã chốt (thay cách hardcode round cũ). |
| `calibration.md` | **Append-only.** Đối chiếu "phòng khuyến nghị → kết quả thực" sau khi task chạy. Nền vòng lặp học để biết phòng nào đáng tin ở loại brief nào. |

> `decisions-log.md` KHÔNG nằm trong 5 file canonical (không bắt buộc để chạy debate lần đầu) nhưng là cơ chế trí nhớ giữa các task. Khi đảo quyết định: thêm mục `superseded`, không xóa lịch sử.

## Quy tắc grounding (chống ảo giác)

Mọi con số trong output phải gắn 1 trong 2 nhãn:

- **[số thật DN]** — trích trực tiếp từ file Brain canonical (ghi rõ `budget.md mục X`). Đáng tin để ra quyết định scale.
- **[benchmark ngành — cần CEO xác minh]** — số tham khảo từ ngành/WebSearch, KHÔNG phải dữ liệu store này. KHÔNG được dùng làm căn cứ scale.

Nếu thiếu số trong Brain → ghi `[cần CEO xác minh]`, TUYỆT ĐỐI không bịa.

## Validator (orchestrator chạy trước fan-out)

1. Đọc đủ 5 file. Đếm số file tồn tại + có nội dung thực (không rỗng/chỉ placeholder).
2. Thiếu 1–2 file phụ → ghi chú thiếu, tiếp tục.
3. Thiếu ≥3 file, HOẶC thiếu file then chốt (`strategy.md` / `state.md`) → PAUSE 1, gợi ý CEO chạy `/vn-onboard`.
4. Ghi vào `brainContext` một dòng tóm tắt "Brain coverage: X/5 file" để các phòng biết độ đầy đủ dữ liệu.

---

# Brain 2 lớp — phân tầng theo nhịp (luồng generic v3)

> Mở rộng schema trên theo bộ spec `docs/design/luong-generic-v3/specs/` (spec 02/04/08).
> **GIỮ tương thích ngược:** 5 file canonical + 2 file bộ nhớ ở trên KHÔNG đổi. Phần này CHỈ THÊM lớp sinh-thành.
> **Nguồn-sự-thật máy đọc:** schema/validator/G0 hiện thực ở `lib/brain.js`; bảng taxonomy ở `knowledge/taxonomy/*.yaml` (`lib/taxonomy.js`); rule-engine ở `knowledge/rule-engines/*.yaml` (`lib/rule-engines.js`). Chạy `npm test` để kiểm.

## 5 lớp-nhịp (altitude tempo) — đổi chậm nhất → nhanh nhất

| Lớp-nhịp | Nhãn `altitude` | File thuộc lớp |
|---|---|---|
| bất-biến | `telos` | `00-Brain/telos.md` |
| định-vị | `dinh-vi` | `00-Brain/positioning.md`, `00-Brain/curves.md` |
| hiện-trạng | `hien-trang` | `strategy.md` · `products.md` · `budget.md` · `state.md` · `headcount.md` |
| cấu-trúc | `cau-truc` | `00-Brain/structure.md` |
| bộ-nhớ | (per-mục) | `decisions-log.md` · `calibration.md` · `lessons.md` · KHO `_index.md`/asset |

Khép-vòng (PHA 3) leo tầng theo thang `cấu-trúc → định-vị(moat) → telos`; `hiện-trạng` (state/budget) là **bằng-chứng nền**.

## File Brain MỚI (lớp sinh-thành) — trường bắt buộc

| File | Trường bắt buộc | Ghi chú |
|---|---|---|
| `00-Brain/telos.md` | `telos` (1 câu) · `values[]` · `boundaries[]` · `approved_by: CEO` · `proposed_by: AI` | **AI đề-xuất, CEO quyết** (bất-biến). Đảo telos → `decisions-log` nhãn `altitude: telos`, `superseded`. |
| `00-Brain/positioning.md` | `beachhead` (đầu-cầu) · `wedge` (điểm-xuất-phát) · `moat` (cỗ-máy) | |
| `00-Brain/curves.md` | `curves[]` mỗi dòng `{ name, positioning, engine, stage(GĐ1..6), health }` | stage theo TỪNG đường-cong |
| `00-Brain/structure.md` | cây `khối→phòng→bộ-phận` (tên-kép) · `activation` theo GĐ · `reused_from` | KẾT-QUẢ gom-ngược-lên (PHA 1C), không nhập tay |
| `00-Brain/lessons.md` | append-only 1 dòng/vòng đơn-vòng | file MỚI; song-vòng ghi file tầng + `decisions-log` |

**`state.md` CŨ+**: thêm trường `stage ∈ {GĐ1..GĐ6}` — **phát-hiện động, KHÔNG mặc-định GĐ1** (PHA 0 suy 3 lớp: khai-báo → đối-chiếu budget → reality-check). **`decisions-log.md` CŨ+**: thêm nhãn `altitude` per-mục ∈ {telos, dinh-vi, moat, cau-truc}.

## Cổng G0 (cổng-tỉnh-táo) — `lib/brain.js#runGateG0`

Trước khi đổ công sức xuống PHA 1: assert `telos.approved_by` mở-đầu `"CEO"` (chấp `"CEO (tên) — duyệt…"`) → `checkCoherent` (telos mạch-lạc, có ranh-giới, không mơ-hồ kiểu "làm điều tốt") → `checkPlausible` (đầu-cầu+moat khớp số thật state/budget). Hỏng → BLOCK, quay CEO chỉnh (HITL ở main loop).

## Taxonomy generic (đọc trực tiếp khi router/sinh cây) — `knowledge/taxonomy/`

**11 khía-cạnh** (4 nhóm MECE — `aspects.yaml`): GIÁ-TRỊ {Sản-phẩm·Thị-trường·Khách-hàng} · NGUỒN-LỰC {Tiền·Con-người·Hậu-cần} · VẬN-HÀNH&TRI-THỨC {Vận-hành·Dữ-liệu} · BẢO-VỆ&QUAN-HỆ {Rủi-ro·Đối-tác(MỚI)·Bền-vững(MỚI)}. Sinh mục-tiêu đi từ **khía-cạnh** (trục bất-biến, không-sót), KHÔNG từ phòng-ban.

**7 khối canonical** (`blocks.yaml`, phủ MECE 12 phòng): K1 Quản-trị&Chiến-lược {01,02,12} · K2 Tài-chính {03} · K3 Thị-trường&Khách-hàng {06,07,08} · K4 Sản-phẩm&Công-nghệ {09} · K5 Vận-hành&Chuỗi-cung {05} · K6 Con-người {04,10} · K7 Dữ-liệu&Đo-lường {11}.

**Tên-kép 3 nhãn** mỗi đơn-vị: `ten_nganh` (skin ngành) · `ten_nang_luc` (canonical — KHÓA tra KHO) · `maps_to` (`K*`/`dept-*`). Tái dùng trường `aliases_vn` (department.yaml) + `extends_departments.target` (pack.yaml) — KHÔNG đẻ trường mới.
