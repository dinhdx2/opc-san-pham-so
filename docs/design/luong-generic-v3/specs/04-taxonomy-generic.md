---
id: 04-taxonomy-generic
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §4"
covers:
  - LG-4.1-asp1
  - LG-4.1-asp2
  - LG-4.1-asp3
  - LG-4.1-asp4
  - LG-4.1-asp5
  - LG-4.1-asp6
  - LG-4.1-asp7
  - LG-4.1-asp8
  - LG-4.1-asp9
  - LG-4.1-asp10
  - LG-4.1-asp11
  - LG-4.1-review
  - LG-4.2-K1
  - LG-4.2-K2
  - LG-4.2-K3
  - LG-4.2-K4
  - LG-4.2-K5
  - LG-4.2-K6
  - LG-4.2-K7
  - LG-4.3-ten-nganh
  - LG-4.3-ten-nang-luc
  - LG-4.3-maps-to
  - LG-4.3-rule
  - LG-4.3-chuyen-sau
depends_on:
  - 00-tong-quan-va-thuat-ngu
  - 01-nguyen-ly-va-mo-hinh-tang
  - 02-brain-schema
milestone: M2
---

# 04 · Taxonomy generic (11 khía-cạnh · 7 khối · 12 phòng · tên-kép)

## 1. Mục-đích & phạm-vi

Spec này hiện-thực §4 của SoT: **bộ phân-loại (taxonomy) generic** làm xương-sống cho cả luồng — gồm (a) **11 khía-cạnh** chia 4 nhóm, mỗi khía-cạnh có (các) phòng canonical phụ-trách; (b) **7 khối canonical** gom trọn **12 phòng** canonical (MECE); (c) **cơ-chế tên-kép** 3 nhãn cho mọi đơn-vị cấu-trúc. Đây là **CONFIG TĨNH viết-một-lần-dùng-mọi-ngành** — không suy theo DN.

**Trong phạm-vi:** định-nghĩa 3 bảng cố-định as data + lược-đồ tên-kép + điểm-cắm 3 tầng (brain-schema, `department.yaml`, pack). **Ngoài phạm-vi:** thuật-toán *dùng* taxonomy này (duyệt 11 khía-cạnh sinh mục-tiêu — §3/§6, gom-ngược-lên cấu-trúc — §3, tra-kho theo tên-năng-lực — §5). Spec này chỉ cung-cấp **dữ-liệu nền** cho các spec đó.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md`:
- **11-khía-cạnh** (`LG-G-11-khia-canh`): bảng MECE generic "cần đạt CÁI GÌ", 4 nhóm GIÁ-TRỊ / NGUỒN-LỰC / VẬN-HÀNH&TRI-THỨC / BẢO-VỆ&QUAN-HỆ.
- **Dữ-liệu** (`LG-G-du-lieu`), **Hậu-cần** (`LG-G-hau-can`), **Đối-tác** (`LG-G-doi-tac`), **Bền-vững** (`LG-G-ben-vung`).
- **Khối ▷ phòng ▷ bộ-phận** (`LG-G-khoi-phong-bo-phan`): 3 tầng cấu-trúc canonical.
- **Tên-kép** (`LG-G-ten-kep`): 3 nhãn / đơn-vị.
- **MECE** (`LG-G-mece`): không-trùng-không-sót.

## 3. Mô-hình dữ-liệu (định-nghĩa as data)

> Đây là phần code/skill đọc trực-tiếp. Đề-xuất đặt thành bảng tĩnh trong `knowledge/brain-schema.md` (xem §7); ID/khóa dưới đây là chuẩn-hoá ổn-định.

### 3(a) · `ASPECTS[11]` — 11 khía-cạnh (sau CEO-review)

Mỗi phần-tử: `{ id, ten, nhom, phong_phu_trach[] }`. `nhom` ∈ { `GIÁ-TRỊ`, `NGUỒN-LỰC`, `VẬN-HÀNH&TRI-THỨC`, `BẢO-VỆ&QUAN-HỆ` }. `phong_phu_trach` là quan-hệ **nhiều-nhiều** tới 12 phòng (1 khía-cạnh có thể nhiều phòng; 1 phòng phục-vụ nhiều khía-cạnh).

| id | # | nhom | ten (khía-cạnh) | phong_phu_trach (canonical) | claim |
|---|---|---|---|---|---|
| `asp-san-pham`   | 1  | GIÁ-TRỊ            | Sản-phẩm                              | 09 Sản-phẩm & Công-nghệ                                   | LG-4.1-asp1 |
| `asp-thi-truong` | 2  | GIÁ-TRỊ            | Thị-trường                            | 02 Chiến-lược · 07 Marketing                              | LG-4.1-asp2 |
| `asp-khach-hang` | 3  | GIÁ-TRỊ            | Khách-hàng                            | 06 Bán-hàng · 08 Khách-hàng                               | LG-4.1-asp3 |
| `asp-tien`       | 4  | NGUỒN-LỰC          | Tiền                                  | 03 Tài-chính · 12 Tăng-trưởng (vốn)                       | LG-4.1-asp4 |
| `asp-con-nguoi`  | 5  | NGUỒN-LỰC          | Con-người                             | 04 Nhân-sự · 10 Đào-tạo                                   | LG-4.1-asp5 |
| `asp-hau-can`    | 6  | NGUỒN-LỰC          | Hậu-cần (chuỗi-cung/hạ-tầng)          | 05 Vận-hành (mua/chuỗi-cung) · 03 (chi-phí mua)           | LG-4.1-asp6 |
| `asp-van-hanh`   | 7  | VẬN-HÀNH&TRI-THỨC  | Vận-hành                              | 05 Vận-hành                                               | LG-4.1-asp7 |
| `asp-du-lieu`    | 8  | VẬN-HÀNH&TRI-THỨC  | Dữ-liệu (đo-lường/thông-tin)          | 11 Báo-cáo · 09 (hạ-tầng dữ-liệu)                         | LG-4.1-asp8 |
| `asp-rui-ro`     | 9  | BẢO-VỆ&QUAN-HỆ     | Rủi-ro                                | 01 Quản-trị & Pháp-lý (+ xuyên-suốt)                      | LG-4.1-asp9 |
| `asp-doi-tac`    | 10 | BẢO-VỆ&QUAN-HỆ     | Đối-tác & Hệ-sinh-thái **(MỚI)**      | 02 Chiến-lược · 06 Bán-hàng (kênh) · 12 (NĐT/JV) · 05 (NCC) | LG-4.1-asp10 |
| `asp-ben-vung`   | 11 | BẢO-VỆ&QUAN-HỆ     | Bền-vững & Stakeholder **(MỚI)**      | 01 Quản-trị · 02 Chiến-lược · 11 (báo-cáo ESG)            | LG-4.1-asp11 |

**Ghi-chú phân-biệt (từ CEO-review, `LG-4.1-review`):**
- **Dữ-liệu (8) ≠ Hậu-cần (6)** — tách-riêng: Dữ-liệu = *tài-sản & đo-lường* (instrument, analytics, privacy, IP-dữ-liệu); Hậu-cần = *chuỗi-cung & hạ-tầng đầu-vào* (mua, kho, vận-chuyển, cloud). Hai trục khác hẳn.
- **Đối-tác (10, MỚI)** — kênh, liên-minh, nền-tảng 2-phía, nhượng-quyền, dev/API, JV, NĐT-là-đối-tác; khác Khách-hàng (cầu) & Hậu-cần (cung đầu-vào).
- **Bền-vững (11, MỚI)** — giấy-phép-xã-hội, niềm-tin cơ-quan-quản-lý ngoài tuân-thủ, môi-trường/cộng-đồng/ESG; khác Rủi-ro (phòng-thủ pháp-lý).
- Lộ-trình: v3.2 tách Hậu-cần ↔ Dữ-liệu → 9; CEO-review thêm Đối-tác & Bền-vững → **11**, gom 4 nhóm cho MECE.

### 3(b) · `KHOI[7]` — 7 khối canonical (tầng trên của cấu-trúc)

Mỗi phần-tử: `{ ma, ten, depts[], khia_canh_chinh[] }`. Khối = tầng gom phòng, cho cây cấu-trúc có đỉnh để **gom NGƯỢC-LÊN** (PHA 1C) & cho KHO chỉ-mục một cấp trên ổn-định. **7 khối phủ trọn 12 phòng — mỗi phòng thuộc đúng 1 khối (MECE).**

| ma | ten (khối canonical) | depts (phòng thuộc khối) | khia_canh_chinh (phục-vụ) | claim |
|---|---|---|---|---|
| `K1` | Quản-trị & Chiến-lược | 01 Quản-trị · 02 Chiến-lược · 12 Tăng-trưởng | Rủi-ro · Thị-trường · Bền-vững · Đối-tác · Tiền(vốn) | LG-4.2-K1 |
| `K2` | Tài-chính             | 03 Tài-chính                                  | Tiền · Hậu-cần(chi-phí)                              | LG-4.2-K2 |
| `K3` | Thị-trường & Khách-hàng | 06 Bán-hàng · 07 Marketing · 08 Khách-hàng  | Khách-hàng · Thị-trường · Đối-tác(kênh)             | LG-4.2-K3 |
| `K4` | Sản-phẩm & Công-nghệ  | 09 Sản-phẩm & Công-nghệ                       | Sản-phẩm · Dữ-liệu(hạ-tầng)                          | LG-4.2-K4 |
| `K5` | Vận-hành & Chuỗi-cung | 05 Vận-hành                                   | Vận-hành · Hậu-cần                                   | LG-4.2-K5 |
| `K6` | Con-người             | 04 Nhân-sự · 10 Đào-tạo                       | Con-người                                            | LG-4.2-K6 |
| `K7` | Dữ-liệu & Đo-lường    | 11 Báo-cáo                                    | Dữ-liệu                                              | LG-4.2-K7 |

**Bất-biến phân-hoạch (partition):** hợp các `depts` của K1..K7 = đúng tập 12 phòng {01..12}, không trùng, không sót → mỗi phòng có **đúng 1** khối-cha. Kiểm bằng `assert_partition` (§8).

> 12 phòng giữ ổn-định vì đã wired vào 183 template + 33 persona + packs; 2 chỗ "dư" (10 Đào-tạo, 12 Tăng-trưởng) xử bằng **kích-hoạt-theo-GĐ**, KHÔNG đẻ thêm phòng.

### 3(c) · Tên-kép — schema 3 nhãn / đơn-vị (mọi tầng)

Mỗi đơn-vị cấu-trúc (khối **hoặc** phòng **hoặc** bộ-phận) mang **3 nhãn**:

| Khóa-trường | Nhãn | Ví-dụ (F&B · bộ-phận) | Dùng để | claim |
|---|---|---|---|---|
| `ten_nganh`     | Tên-ngành (hiển-thị)   | "Bếp trung-tâm (commissary)"  | người trong ngành đọc hiểu ngay                 | LG-4.3-ten-nganh |
| `ten_nang_luc`  | Tên-năng-lực chuẩn     | "Sản-xuất & Chuẩn-hoá món"    | so-sánh xuyên-ngành + **KHÓA tra KHO**          | LG-4.3-ten-nang-luc |
| `maps_to`       | Ánh-xạ canonical       | `K4/dept-09 (+K5/dept-05)`    | neo về 7 khối/12 phòng + tái-dùng template/persona | LG-4.3-maps-to |

- `ten_nang_luc` là **khóa chính tra-kho** (PHA 1C so-khớp tên-năng-lực với `_index.md`), chuẩn-hoá theo từ-điển canonical (xem §6.6 / spec `06`).
- `maps_to` neo về **1 hoặc nhiều** mục canonical `K*/dept-*`; cho-phép "trực-thuộc gần nhất" (một đơn-vị ngành là *chuyên-sâu* của 1 phòng canonical, không 1-đối-1 cứng) — ghi mục chính trước, phụ trong ngoặc `(+...)`.

## 4. Hành-vi / thuật-toán

Spec này là **bảng tra**, không có state-machine. Hai phép tra cơ-bản mà các spec khác gọi:

```
# Tra phòng phụ-trách 1 khía-cạnh (dùng khi PHA 1B duyệt 11 khía-cạnh)
depts_of_aspect(asp_id) -> ASPECTS[asp_id].phong_phu_trach   # nhiều-nhiều

# Tra khối-cha của 1 phòng (dùng khi PHA 1C gom-ngược-lên cấu-trúc)
block_of_dept(dept_code) -> the unique K* where dept_code ∈ KHOI[K*].depts   # 1-1 (MECE)

# Phân-giải tên-kép → canonical (dùng khi tra-kho / áp template-persona)
resolve(unit) -> { ten_nganh, ten_nang_luc(=khóa-tra), maps_to[] }
```

**Edge-case:**
- Khía-cạnh "MỚI" (10, 11) **NGỦ** lâu nhất (thường thức ở GĐ4-6, ngành quản-chế, DN lớn/đại-chúng): cổng cắt-tỉa "khía-cạnh X có lý-do ở GĐ này?" cho bỏ-qua → phòng tương-ứng ngủ. Đây là *hành-vi của cổng §1.1/§6* dùng bảng này; bản-thân bảng vẫn liệt đủ 11.
- Đơn-vị ngành map "trực-thuộc gần nhất": `maps_to` có nhiều phần-tử, phần-tử đầu là neo chính (quyết khối-cha cho gom-ngược-lên).

## 5. Ranh-giới generic ↔ phân-rã

- **GENERIC (toàn-bộ spec này):** 3 bảng `ASPECTS[11]` / `KHOI[7]` / lược-đồ tên-kép 3 nhãn là **viết-một-lần, mọi ngành dùng chung** (`LG-1.1-2`, `LG-1.1-3`). Câu-hỏi/khung cố-định; chỉ nội-dung-ô khoác chữ theo DN.
- **PHÂN-RÃ (ở spec khác, KHÔNG ở đây):** *giá-trị* `ten_nganh` cụ-thể, cây bộ-phận thực của một DN, khía-cạnh nào thức/ngủ ở GĐ nào — suy mỗi DN.
- **Khía-cạnh ≠ phòng** (`LG-4.1-review`): ánh-xạ **nhiều-nhiều**; sinh mục-tiêu đi từ **khía-cạnh** (trục BẤT-BIẾN, KHÔNG-SÓT — `LG-3-PHA1-why-aspect`) chứ không từ phòng-ban.
- **KHÔNG đẻ phòng mới** cho khía-cạnh 10/11: giữ 12 phòng làm neo, hai khía-cạnh mới map vào phòng sẵn-có (10→02/06/12/05; 11→01/02/11).

## 6. Cổng & luật bất-biến

1. **INV-MECE-KHOI:** ⋃ depts(K1..K7) = {01..12}, đôi-một rời nhau. Vi-phạm ⇒ chặn (taxonomy hỏng).
2. **INV-ASPECT-COUNT:** đúng **11** khía-cạnh, phủ đủ **4** nhóm; mỗi khía-cạnh ≥1 phòng phụ-trách.
3. **INV-NO-NEW-DEPT:** taxonomy không thêm phòng thứ-13 cho khía-cạnh 10/11 (chúng map vào 12 phòng nền). *(Pack ngành vẫn được `adds_departments` cho nghiệp-vụ ngành — đó là việc của pack, không phải của khung 11 khía-cạnh.)*
4. **INV-TENKEP-3NHAN:** mọi đơn-vị cấu-trúc phải có đủ 3 trường `ten_nganh` · `ten_nang_luc` · `maps_to`; thiếu `ten_nang_luc` ⇒ không tra-kho được ⇒ chặn.
5. **INV-MAPS-TO-CANONICAL:** mọi `maps_to` chỉ trỏ tới `K1..K7` và/hoặc `dept-01..dept-12` hợp-lệ (không trỏ ngoài tập canonical).

## 7. Giao-diện & điểm-cắm code

Theo §9 SoT (`LG-9-taxonomy`, `LG-9-tenkep`) + cây repo thật:

| Điểm cắm | Loại | Nội-dung |
|---|---|---|
| `knowledge/brain-schema.md` | **SỬA/THÊM** | Thêm 2 bảng generic: `ASPECTS[11]` (4 nhóm, phòng phụ-trách) + `KHOI[7]` (depts, khía-cạnh chính). Đây là bảng "đọc trực-tiếp" cho orchestrator. |
| `.claude/skills/vn-orchestrator/SKILL.md` | **SỬA** | Bước duyệt khía-cạnh tham-chiếu bảng `ASPECTS[11]`; gom-ngược-lên tham-chiếu `KHOI[7]`. |
| `knowledge/departments/<dd>/department.yaml` · trường `aliases_vn` | **GIỮ + dùng lại** | Tầng tên-kép cho **phòng**: `aliases_vn` chứa `ten_nganh` (alias hiển-thị). Đã có sẵn (vd `05-operations`: "Phòng Vận hành / Vận hành / Operations / Ops"). |
| `knowledge/packs/<ngành>/pack.yaml` · `extends_departments` | **GIỮ + dùng lại** | Tầng tên-kép áp **theo ngành**: pack neo agent ngành vào phòng canonical qua `target: <dd-dept>` → đây chính là `maps_to`. Vd `fnb`: `extends_departments[].target: 05-operations` add `inventory-manager-fnb`, `vendor-fnb` = tên-kép tầng phòng (năng-lực Vận-hành ngành F&B → dept-05 canonical). `adds_departments` (13-kitchen, 14-food-safety) là phòng ngành chuyên-sâu, mỗi cái vẫn cần `maps_to` về `K*/dept-*` gần nhất. |
| KHO `knowledge/playbook/<ngành>/_index.md` | (đọc) | Cột `ten_nang_luc` của tên-kép = khóa so-khớp khi PHA 1C tra-kho (chi-tiết ở spec `05`). |

**Tên-kép áp 3 tầng (`LG-4.3-rule`):** khối (`K*` trong `structure.md`) · phòng (`aliases_vn` + `extends_departments.target`) · bộ-phận (3 nhãn trong cây `06/structure.md`). Cơ-chế **tái-dùng trường có sẵn** (`aliases_vn`, `extends_departments`) — không phát-minh trường mới.

**Đơn-vị chuyên-sâu (`LG-4.3-chuyen-sau`):** một số bộ-phận/phòng ngành là *chuyên-sâu* của 1 phòng canonical → `maps_to` ghi **"trực-thuộc gần nhất"**, KHÔNG ép 1-đối-1 cứng (cho phép 1 đơn-vị neo 1 phòng chính + phụ, vd `dept-09 (+05)`).

## 8. Tiêu-chí chấp-nhận

| Test | Kỳ-vọng |
|---|---|
| `t_aspect_count` | `len(ASPECTS) == 11`; tập `nhom` phân-biệt == {GIÁ-TRỊ, NGUỒN-LỰC, VẬN-HÀNH&TRI-THỨC, BẢO-VỆ&QUAN-HỆ} (phủ đủ **4 nhóm**); mỗi aspect `len(phong_phu_trach) >= 1`. |
| `t_aspect_new` | `asp-du-lieu` và `asp-hau-can` là 2 mục riêng biệt; tồn-tại `asp-doi-tac` (10) & `asp-ben-vung` (11) đánh MỚI. |
| `t_block_partition` | ⋃ `KHOI[*].depts` == {01,02,03,04,05,06,07,08,09,10,11,12}; ∀ phòng: `len(blocks containing it) == 1` (**7 khối phủ đúng 12 phòng, mỗi phòng đúng 1 khối — MECE**). |
| `t_block_count` | `len(KHOI) == 7`; mã đúng K1..K7. |
| `t_no_new_dept_for_10_11` | phòng phụ-trách của `asp-doi-tac` & `asp-ben-vung` ⊂ {01..12} (không có phòng ≥13). |
| `t_tenkep_schema` | mọi đơn-vị có đủ `{ten_nganh, ten_nang_luc, maps_to}`; `ten_nang_luc` non-empty (**khóa tra-kho hợp-lệ**). |
| `t_maps_to_canonical` | mọi `maps_to` parse được thành `K[1-7]` và/hoặc `dept-(0[1-9]|1[0-2])`. |
| `t_tenkep_fnb_fixture` | Bộ-phận "Bếp trung-tâm" → `ten_nang_luc="Sản-xuất & Chuẩn-hoá món"`, `maps_to=[K4/dept-09, K5/dept-05]`; khớp `pack.yaml fnb` (`extends_departments.target: 05-operations` + `adds_departments: 13-kitchen`). |

**Lát Phở Hà liên-quan:** khi PHA 1 duyệt 11 khía-cạnh GĐ4 (`LG-7-PHA1`), bảng `ASPECTS[11]` chính là danh-sách được duyệt; "Đối-tác nhẹ / Bền-vững & Đào-tạo ngủ" là kết-quả áp cổng cắt-tỉa lên đúng 11 mục của spec này.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (debate stage-aware + 11 khía-cạnh / 7 khối — ưu-tiên tối-thiểu theo `LG-9-uutien`).
- **Chặn trước:** `00-tong-quan-va-thuat-ngu` (thuật-ngữ), `02-brain-schema` (nơi cắm 2 bảng), `01-nguyen-ly-va-mo-hinh-tang` (khía-cạnh ≠ phòng, sinh mục-tiêu từ khía-cạnh).
- **Mở khóa sau:** `05-kho-chi-muc` (dùng `ten_nang_luc` làm khóa), `06-bang-tra-rule-engines` (6.3 mẫu mục-tiêu theo khía-cạnh, 6.6 từ-điển tên-năng-lực), `03-luong-orchestration` (PHA 1B/1C dùng bảng).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-4.1-asp1  | §3(a) hàng 1  | t_aspect_count |
| LG-4.1-asp2  | §3(a) hàng 2  | t_aspect_count |
| LG-4.1-asp3  | §3(a) hàng 3  | t_aspect_count |
| LG-4.1-asp4  | §3(a) hàng 4  | t_aspect_count |
| LG-4.1-asp5  | §3(a) hàng 5  | t_aspect_count |
| LG-4.1-asp6  | §3(a) hàng 6  | t_aspect_count · t_aspect_new |
| LG-4.1-asp7  | §3(a) hàng 7  | t_aspect_count |
| LG-4.1-asp8  | §3(a) hàng 8  | t_aspect_count · t_aspect_new |
| LG-4.1-asp9  | §3(a) hàng 9  | t_aspect_count |
| LG-4.1-asp10 | §3(a) hàng 10 | t_aspect_new · t_no_new_dept_for_10_11 |
| LG-4.1-asp11 | §3(a) hàng 11 | t_aspect_new · t_no_new_dept_for_10_11 |
| LG-4.1-review | §3(a) ghi-chú phân-biệt · §5 · §6 INV-NO-NEW-DEPT | t_aspect_new · t_no_new_dept_for_10_11 |
| LG-4.2-K1 | §3(b) hàng K1 | t_block_partition · t_block_count |
| LG-4.2-K2 | §3(b) hàng K2 | t_block_partition · t_block_count |
| LG-4.2-K3 | §3(b) hàng K3 | t_block_partition · t_block_count |
| LG-4.2-K4 | §3(b) hàng K4 | t_block_partition · t_block_count |
| LG-4.2-K5 | §3(b) hàng K5 | t_block_partition · t_block_count |
| LG-4.2-K6 | §3(b) hàng K6 | t_block_partition · t_block_count |
| LG-4.2-K7 | §3(b) hàng K7 | t_block_partition · t_block_count |
| LG-4.3-ten-nganh    | §3(c) trường `ten_nganh`    | t_tenkep_schema · t_tenkep_fnb_fixture |
| LG-4.3-ten-nang-luc | §3(c) trường `ten_nang_luc` | t_tenkep_schema · t_tenkep_fnb_fixture |
| LG-4.3-maps-to      | §3(c) trường `maps_to`      | t_maps_to_canonical · t_tenkep_fnb_fixture |
| LG-4.3-rule | §7 (áp 3 tầng + aliases_vn + extends_departments) | t_tenkep_schema · t_tenkep_fnb_fixture |
| LG-4.3-chuyen-sau | §7 (maps_to "trực-thuộc gần nhất", không 1-1 cứng) | t_tenkep_fnb_fixture (maps_to chính+phụ `[K4/dept-09, K5/dept-05]`) |

## 11. OPEN-Q

(rỗng) — §4 SoT đủ rõ; cấu-trúc `ASPECTS`/`KHOI`/tên-kép và điểm-cắm `aliases_vn` + `extends_departments` đã xác-định, không có chỗ mơ-hồ cần CEO chốt.
