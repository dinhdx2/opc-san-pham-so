---
id: 07-fixture-pho-ha
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §7 Ví-dụ Phở Hà (dòng 598-645)"
covers: [LG-7-PHA0, LG-7-PHA1, LG-7-PHA1C, LG-7-PHA2, LG-7-PHA3, LG-7-PHA4]
depends_on: [00-tong-quan-va-thuat-ngu, 02-brain-schema, 03a-pha0-khoi-tao, 03b-pha1-phan-ra, 03c-pha2-thuc-thi, 03d-pha3-khep-vong, 03e-pha4-mo-rong, 05-kho-chi-muc, 06-bang-tra-rule-engines]
milestone: M2
---

# 07 · Golden-fixture Phở Hà (test đầu-cuối)

> **Fixture kiểm tích-hợp toàn pipeline.** Đây KHÔNG phải spec thêm hành-vi mới —
> nó cố-định **một đầu-vào DN mẫu** (Brain Phở Hà) + **một tập kịch-bản kỳ-vọng**
> (given/when/then) chạy xuyên PHA 0→4, dùng để **back-test** rằng các spec hành-vi
> `03a–03e` ráp lại cho ra đúng quyết-định ở từng pha. Tất cả số/quyết-định dưới đây
> bám nguyên §7 SoT (dòng 598-645), KHÔNG bịa thêm.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **lát ví-dụ Phở Hà** của SoT (§7) thành một **golden-fixture đầu-cuối**:
một bộ dữ-liệu-vào cố-định (Brain) + sáu kịch-bản kỳ-vọng (mỗi pha một kịch-bản) có-thể-assert.

- **TRONG phạm-vi:** định-nghĩa input fixture; với mỗi pha ghi kịch-bản given/when/then
  kiểm được; dùng làm integration test ráp `03a–03e`; truy-vết 6 claim `LG-7-*`.
- **NGOÀI phạm-vi:** không định-nghĩa thuật-toán phát-hiện stage (→ `03a`), cơ-chế sinh
  nhiệm-vụ-chính 3 lớp (→ `01`, `03b`), luật tra-kho (→ `05`, `06`), router/cổng cứng
  (→ `03c`). Spec này chỉ **gọi** các hành-vi đó và **assert kết-quả** trên dữ-liệu Phở Hà.
- **Loại fixture:** end-to-end / integration (chứ không unit). Một kịch-bản pha FAIL ⇒
  spec hành-vi tương-ứng (`03a–03e`) có hồi-quy.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: **stage / 6 GĐ** (GĐ4 lãi/đơn-vị, GĐ5 nhân không
vỡ, GĐ6 duy-trì+tái-tạo), **optimize-before-scale** (`LG-G-optimize-before-scale`),
**11 khía-cạnh** (`LG-G-11-khia-canh`), **gom-ngược-lên** (`LG-G-gom-nguoc-len`),
**reuse/adapt/new** + **reuse-grade** (`LG-G-reuse-adapt-new`, `LG-G-reuse-grade`),
**single/double-loop** (`LG-G-single-double-loop`), **PROMOTE** (`LG-G-promote`),
**3 phép-thử mở-rộng** (moat / telos / brand-equity), **NEED-APPROVAL / cổng cứng**.

## 3. Mô-hình dữ-liệu — INPUT FIXTURE (Brain Phở Hà)

DN: **chuỗi 4 quán phở Bắc ở TP.HCM**, mở 2 năm, DT ~**1.2 tỷ/tháng**, F&B.
CEO **khai** "sẵn-sàng GĐ5, muốn mở 10 quán/12 tháng, có nhà-đầu-tư muốn rót vốn".

### 3.1 `00-Brain/telos.md`

| Trường | Giá-trị fixture |
|---|---|
| lý-do-tồn-tại | "Cho người Sài-Gòn bận-rộn một bát phở Bắc **chuẩn-vị, nhanh, sạch**, giá bình-dân — ở đâu cũng đúng vị đó." |
| ranh-giới (KHÔNG làm) | không chạy theo món lai-tạp để câu khách. |

### 3.2 `00-Brain/positioning.md`

| Trường | Giá-trị fixture |
|---|---|
| đầu-cầu (beachhead) | dân văn-phòng quận trung-tâm. |
| moat / cỗ-máy | công-thức nước-dùng + cẩm-nang bếp chuẩn-hoá + chuỗi-cung ổn giá. |

### 3.3 `state.md` + `budget.md` — bằng-chứng số (trường `stage` phát-hiện động)

| Đơn-vị | Trạng-thái fixture (bằng-chứng) |
|---|---|
| quán-1 | biên ròng ~**18%** (đạt) |
| quán-2 | biên ròng ~**18%** (đạt) |
| quán-3 | **lẹt-đẹt, biên 6%** |
| quán-4 | **mở 3 tháng, chưa hòa-vốn** |
| stage khai-báo (CEO) | GĐ5 |
| stage suy-từ-bằng-chứng | **GĐ4** (chưa qua cổng tối-ưu) |

> Bất-biến input: **2 quán ~18% · quán-3 = 6% · quán-4 chưa hòa-vốn**. Chỉ 2/4 quán đạt
> ngưỡng — đây là "mồi" để fixture chứng-minh reality-check chặn được "tưởng GĐ5".

## 4. Hành-vi / kịch-bản kỳ-vọng theo PHA (given / when / then)

> Mỗi kịch-bản = đầu-cuối trên fixture §3, assert-được. `→ LG-7-*` neo claim phủ.

### 4.1 PHA 0 — reality-check (→ LG-7-PHA0)

- **GIVEN** Brain §3 (CEO khai GĐ5; budget: 2 quán ~18%, quán-3 6%, quán-4 chưa hòa-vốn).
- **WHEN** chạy phát-hiện stage 3 lớp của `03a` (khai-báo → đối-chiếu `budget.md` → reality-check).
- **THEN**
  - `stage` chốt = **GĐ4** (KHÔNG phải GĐ5) — vì chưa qua cổng tối-ưu;
  - quyết-định = **HOÃN vốn** + **hoãn mở 10 quán** (lý-do: clone quán-lỗi = nhân-lỗi cả-đàn);
  - reality-check đối-chiếu stage khai (GĐ5) vs bằng-chứng (GĐ4) và chọn **bằng-chứng**.

### 4.2 PHA 1 — duyệt 11 khía-cạnh ở GĐ4 (→ LG-7-PHA1)

- **GIVEN** stage = GĐ4; mục-đích GĐ = "mỗi quán lãi ổn-định & cẩm-nang lặp được".
- **WHEN** chạy duyệt 11 khía-cạnh (`03b`) qua cổng lọc "khía-cạnh X có lý-do ở GĐ này?".
- **THEN** tập ✓ / ngủ / cắt-tỉa đúng:

  | Khía-cạnh | Kết-quả kỳ-vọng | Mục-tiêu (trạng-thái) |
  |---|---|---|
  | Tiền | ✓ (lõi GĐ4) | "Cả 4 quán **biên ròng ≥ 15%**" |
  | Hậu-cần | ✓ | "Nguồn bò & NL ổn giá, đủ, đúng hạn" |
  | Vận-hành | ✓ | "SOP bếp chạy ổn không cần đầu-bếp-ngôi-sao" |
  | Dữ-liệu | ✓ | "Số COGS/hao-hụt từng quán đo realtime, 1 nguồn" |
  | Rủi-ro | ✓ | "VSATTP 4 quán đạt" |
  | Con-người | ✓ | "quản-lý-quán thay được founder" |
  | Đối-tác | ✓-nhẹ, **cắt-tỉa** | "GrabFood/ShopeeFood & NCC bò chốt điều-khoản"; vốn NĐT → **HOÃN** |
  | Bền-vững | **NGỦ** | (GĐ4, chưa đại-chúng) |
  | Đào-tạo bài-bản | **NGỦ** | — |

  - Mục-tiêu lõi kiểm được = **"biên ≥ 15%"** (chuỗi "Cả 4 quán biên ròng ≥ 15%").
  - (Tham-chiếu, không assert ở pha này:) khoan mục-tiêu "biên ≥15%" SINH 4 nhiệm-vụ-chính
    ①Kiểm-soát COGS 🗡 ②Khoá nguồn-cung & giá NCC bò 🗡 ③Chặn hao-hụt bếp 🛡 ④Dựng đo
    COGS/biên realtime 📦; back-test bỏ ④ ⇒ "không biết quán nào lỗ" ⇒ giữ ④.

### 4.3 PHA 1C — gom ngược-lên + tra-kho (→ LG-7-PHA1C)

- **GIVEN** tập nhiệm-vụ-con từ PHA 1; kho ngành `knowledge/playbook/fnb/_index.md`.
- **WHEN** chạy gom-ngược-lên + tra `_index.md` (`03b` + luật `05`/`06`).
- **THEN** đúng **4/5 bộ-phận REUSE/ADAPT từ kho, 1 NEW**:

  | nhiệm-vụ-con | bộ-phận | quyết-định tra-kho | tài-sản |
  |---|---|---|---|
  | định-mức · hao-hụt · sơ-chế | Bếp trung-tâm | **KHỚP A → REUSE** | `pack:13-kitchen` |
  | đàm-phán NCC · chuỗi-cung bò | Thu-mua & Cung-ứng | **KHỚP B → ADAPT** | `inventory-manager-fnb` |
  | theo-dõi giá-vốn · biên lãi | Kiểm-soát giá-vốn | **KHỚP A → REUSE** | `cogs-tracker-fnb` |
  | đo COGS/hao-hụt realtime | BI/Báo-cáo quán | **trống → NEW** (→ ứng-viên PROMOTE) | — |
  | VSATTP | An-toàn thực-phẩm | **KHỚP A → REUSE** | `pack:14-food-safety` |

  - Đếm: **REUSE ×3 + ADAPT ×1 = 4 tái-dùng; NEW ×1** = bộ-phận BI/Báo-cáo.
  - Cấu-trúc **suy-ra NGƯỢC-LÊN**: bộ-phận → phòng (dept-09/05, dept-01/05, dept-05,
    dept-03, dept-11) → khối (K4 · K5 · K2 · K7 · K1). Phòng **10/12 vẫn NGỦ**.

### 4.4 PHA 2 — router + cổng cứng (→ LG-7-PHA2)

- **GIVEN** hành-động "đàm-phán giá thịt bò theo sản-lượng-gộp 4 quán".
- **WHEN** chạy router phân-loại + executor (`03c`).
- **THEN**
  - router xếp = **COMPLEX** → debate → sinh `10-thuc-thi-dam-phan-thit-bo.md`;
  - executor làm bước máy (tra giá thật WebSearch, bảng so-sánh NCC, kịch-bản);
  - bước **"ký hợp-đồng NCC" = NEED-APPROVAL** (cổng cứng) → chỉ ký sau khi CEO duyệt.

### 4.5 PHA 3 — song-vòng + PASS GĐ4 + PROMOTE (→ LG-7-PHA3)

- **GIVEN** quán-3 vẫn ế sau 2 vòng vá lịch-ca/khuyến-mãi (đơn-vòng).
- **WHEN** leo **song-vòng** (`03d`): đọc `positioning.md` + `strategy.md`.
- **THEN**
  - chẩn đúng **tầng định-vị** — "mặt-bằng sai đầu-cầu", KHÔNG phải lỗi vận-hành;
  - quyết **đóng/dời quán-3** → sửa `positioning.md`, **KHÔNG đụng `telos.md`**;
  - sau khi 3 quán còn lại đều **≥ 15%** + cẩm-nang mở-quán hoàn-chỉnh → **PASS GĐ4**;
  - **PROMOTE 3 tài-sản** vào kho + ghi **3 dòng `_index.md`** (id chuẩn, reuse-grade A):
    "Cẩm-nang mở-quán chuẩn", "Bảng định-mức", bộ-phận "BI/Báo-cáo quán" (vừa NEW);
  - qua cổng tối-ưu → **vào GĐ5**.

### 4.6 PHA 4 — 3 phép-thử mở-rộng (→ LG-7-PHA4)

- **GIVEN** đã thật-sự GĐ5; 3 cơ-hội mở-rộng.
- **WHEN** chạy 3 phép-thử + bootstrap KHO (`03e`).
- **THEN**

  | Cơ-hội | Phép-thử (moat / telos / brand) | Kết-quả kỳ-vọng |
  |---|---|---|
  | Mở **quán 5–10** (HCM/HN) | moat chuyển ✓, telos chung ✓ | **GĐ5-nới** — PHA 1C tra `_index.md`, reuse cây bộ-phận + cẩm-nang vừa PROMOTE |
  | **Phở-gói** đông-lạnh siêu-thị | moat phải **bồi mới** (SX công-nghiệp) | **GĐ6-đẻ** đường mới, **brand cũ** |
  | Chuỗi **cà-phê** | **telos khác** | **brand mới** |

## 5. Ranh-giới generic ↔ phân-rã

- **Generic (khung fixture tái-dùng):** cấu-trúc 6 kịch-bản theo pha; các **câu-hỏi cổng**
  (reality-check stage? duyệt khía-cạnh? reuse/adapt/new? router-class? loop nào? phép-thử
  mở-rộng?). Đây là khuôn áp được cho mọi DN.
- **Phân-rã (nội-dung Phở Hà):** mọi số & quyết-định cụ-thể — telos/positioning, 2 quán 18%
  / quán-3 6% / quán-4 chưa hòa-vốn, mục-tiêu "biên ≥15%", bảng tra-kho 5 dòng, COMPLEX,
  đóng quán-3, 3 tài-sản PROMOTE, 3 phép-thử. Tất cả là **example/phân-rã** (sổ-claim §7).
- Fixture này **đóng băng** phần phân-rã làm "đáp-án vàng"; nếu engine cho ra giá-trị khác ⇒
  hồi-quy ở spec hành-vi tương-ứng.

## 6. Cổng & luật bất-biến (assert trong fixture)

| Cổng / luật | Assert kỳ-vọng | Pha |
|---|---|---|
| Reality-check stage | stage chốt = bằng-chứng (**GĐ4**), KHÔNG theo khai-báo (GĐ5) | PHA 0 |
| optimize-before-scale | chưa qua cổng tối-ưu ⇒ **HOÃN** mở-rộng/vốn | PHA 0 |
| Back-test sinh nhiệm-vụ | bỏ ④ đo-realtime ⇒ không back-test được ⇒ **giữ** | PHA 1 |
| Cổng cứng NEED-APPROVAL | ký HĐ NCC **chặn** tới khi CEO duyệt | PHA 2 |
| Đơn→song-vòng | hết K vòng đơn ⇒ leo song-vòng, sửa **đúng tầng** (định-vị, không telos) | PHA 3 |
| Cổng PASS GĐ | đủ mục-tiêu (3 quán ≥15% + cẩm-nang) ⇒ qua GĐ kế | PHA 3 |
| Cổng PROMOTE | đạt rubric ⇒ cất kho + **ghi 1 dòng `_index.md`** mỗi tài-sản | PHA 3 |
| Warn telos | chiến-dịch/quán lỗi **KHÔNG** chạm telos | PHA 3 |

## 7. Giao-diện & điểm-cắm code

Fixture được dùng làm **integration test ráp các spec hành-vi `03a–03e`** (loại: THÊM
test-fixture; không sửa engine).

| Pha fixture | Spec hành-vi được kiểm | Điểm-cắm |
|---|---|---|
| PHA 0 | `03a-pha0-khoi-tao.md` (phát-hiện stage + G0) | bộ phát-hiện stage / reality-check |
| PHA 1 + 1C | `03b-pha1-phan-ra.md` (duyệt 11 khía-cạnh, gom-ngược + tra-kho) | aspect-walk + vn-architect |
| PHA 2 | `03c-pha2-thuc-thi.md` (router + executor + cổng cứng) | router class + cổng NEED-APPROVAL |
| PHA 3 | `03d-pha3-khep-vong.md` (đơn/song-vòng, PASS, PROMOTE) | loop-controller + cổng GĐ/PROMOTE |
| PHA 4 | `03e-pha4-mo-rong.md` (3 phép-thử + bootstrap KHO) | phép-thử moat/telos/brand |

- **Tài-sản fixture đề-xuất:** thư-mục dữ-liệu Brain Phở Hà (telos/positioning/state/budget
  theo §3) + bảng kỳ-vọng §4 để harness so-khớp. Đặt dưới `tools/` của task (cùng cây với
  `tools/check-coverage.js`).
- **Quy-ước assert:** mỗi `LG-7-*` ↔ 1 case; case so-sánh OUTPUT engine với "đáp-án vàng" §4.

## 8. Tiêu-chí chấp-nhận

Fixture **xanh** khi cả 6 case dưới pass trên input §3:

- **t-PHA0:** stage = GĐ4 ∧ quyết HOÃN vốn ∧ hoãn mở 10 quán. *(LG-7-PHA0)*
- **t-PHA1:** tập ✓/ngủ/cắt-tỉa khớp bảng §4.2 ∧ mục-tiêu Tiền chứa "biên ròng ≥ 15%". *(LG-7-PHA1)*
- **t-PHA1C:** đếm REUSE+ADAPT = 4 ∧ NEW = 1 (BI/Báo-cáo) ∧ phòng 10/12 = NGỦ. *(LG-7-PHA1C)*
- **t-PHA2:** router = COMPLEX ∧ sinh `10-thuc-thi-dam-phan-thit-bo.md` ∧ ký HĐ NCC = NEED-APPROVAL. *(LG-7-PHA2)*
- **t-PHA3:** song-vòng→tầng định-vị ∧ đóng/dời quán-3 (không đụng telos) ∧ PASS GĐ4 ∧ PROMOTE 3 tài-sản → 3 dòng `_index.md`. *(LG-7-PHA3)*
- **t-PHA4:** quán 5–10 = GĐ5-nới ∧ phở-gói = GĐ6-đẻ/brand-cũ ∧ cà-phê = brand-mới. *(LG-7-PHA4)*

Toàn-bộ là **một** integration suite: fail bất-kỳ case ⇒ fixture đỏ ⇒ chỉ-điểm spec `03a–03e` hồi-quy.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (cùng nhịp `03a–03e`); fixture viết **sau** khi 5 spec pha đã có
  để có thứ-cần-kiểm.
- **Phải có trước:** `03a`, `03b`, `03c`, `03d`, `03e` (hành-vi được kiểm); `02-brain-schema`
  (định-dạng telos/positioning/state/budget của input); `05-kho-chi-muc` + `06-bang-tra-rule-engines`
  (luật tra-kho / bảng GĐ mà fixture assert); `00-tong-quan-va-thuat-ngu` (thuật-ngữ).
- **Được tham-chiếu bởi:** mục "Tiêu-chí chấp-nhận" của `03a–03e` (lát Phở Hà của chúng).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-7-PHA0 | §3, §4.1, §6, §8 | t-PHA0 (stage=GĐ4 + HOÃN vốn + hoãn mở 10 quán) |
| LG-7-PHA1 | §4.2, §6, §8 | t-PHA1 (✓/ngủ/cắt-tỉa + mục-tiêu "biên ≥15%") |
| LG-7-PHA1C | §4.3, §8 | t-PHA1C (4 reuse/adapt + 1 NEW BI/Báo-cáo) |
| LG-7-PHA2 | §4.4, §6, §8 | t-PHA2 (router COMPLEX + ký HĐ NCC NEED-APPROVAL) |
| LG-7-PHA3 | §4.5, §6, §8 | t-PHA3 (song-vòng định-vị + PASS GĐ4 + PROMOTE 3 → _index) |
| LG-7-PHA4 | §4.6, §8 | t-PHA4 (10 quán GĐ5-nới / phở-gói GĐ6 / cà-phê brand-mới) |

## 11. OPEN-Q

- (rỗng — §7 SoT đủ chi-tiết cho 6 kịch-bản. Chi-tiết định-dạng harness assert thuộc về
  `tools/`, không phải mơ-hồ trong SoT.)
