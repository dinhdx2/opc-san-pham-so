---
id: 06-bang-tra-rule-engines
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §6 (dòng 519-597: 6.1 rubric stage · 6.2 song-vòng · 6.3 mục-tiêu 11 khía-cạnh · 6.4 lưới sinh nhiệm-vụ-chính · 6.5 reuse-decision · 6.6 từ-điển)"
covers: [LG-6.1-gd1, LG-6.1-gd2, LG-6.1-gd3, LG-6.1-gd4, LG-6.1-gd5, LG-6.1-gd6, LG-6.2-cau-truc, LG-6.2-moat, LG-6.2-dinh-vi, LG-6.2-telos, LG-6.2-nen, LG-6.3-asp1, LG-6.3-asp2, LG-6.3-asp3, LG-6.3-asp4, LG-6.3-asp5, LG-6.3-asp6, LG-6.3-asp7, LG-6.3-asp8, LG-6.3-asp9, LG-6.3-asp10, LG-6.3-asp11, LG-6.4-L1, LG-6.4-L2, LG-6.4-L3, LG-6.4-gate, LG-6.4-neo, LG-6.5-reuse, LG-6.5-adapt, LG-6.5-new, LG-6.6-rule]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang, 04-taxonomy-generic]
milestone: M2
---

# 06 · Bảng tra = 6 rule-engine

> **Spec "tủ tra-cứu" của toàn hệ.** Sáu bảng generic của SoT §6 KHÔNG phải văn-bản tham-khảo —
> mỗi bảng = **một HÀM XÁC-ĐỊNH (deterministic)** input/output rõ, dữ-liệu là một **bảng tĩnh**
> viết-một-lần-dùng-mãi cho mọi DN. Spec này đóng-gói 6 hàm đó để các spec luồng gọi:
> `detect_stage` (←03a) · `route_song_vong` (←03d) · `goal_by_aspect` (←03b) ·
> `task_gen_grid` (←01) · `reuse_decision` (←05) · `naming_dict` (←kho/onboard).

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§6 "Bảng tra tham-chiếu"** của SoT: biến 6 bảng generic thành 6 hàm
thuần (pure function) — cùng input → luôn cùng output, không trạng-thái ẩn, không gọi LLM trừ
lớp NLP đã khoanh vùng. Mỗi hàm gồm: chữ-ký (signature), một **bảng dữ-liệu tĩnh** (config) và
luật tra/khớp.

**Trong phạm-vi (in):**
1. `detect_stage()` — rubric 6 GĐ + câu-sống-còn + dấu-hiệu (§6.1) — dùng bởi `03a`.
2. `route_song_vong(tín-hiệu)` — 5 hàng tín-hiệu → tầng leo + file Brain neo (§6.2) — dùng bởi `03d`.
3. `goal_by_aspect()` — 11 khía-cạnh → mẫu mục-tiêu dạng trạng-thái + cổng lọc (§6.3) — dùng bởi `03b`.
4. `task_gen_grid()` — 5 hàng = dạng-bảng của cơ-chế sinh nhiệm-vụ-chính §1.4 (§6.4) — dùng bởi `01`.
5. `reuse_decision()` — REUSE / ADAPT / NEW theo độ-khớp ngữ-cảnh (§6.5) — dùng bởi `05`.
6. `naming_dict` — từ-điển tên-năng-lực chuẩn = khóa tra-kho (§6.6) — dùng bởi kho/onboard.

**Ngoài phạm-vi (out):** thuật-toán đầy-đủ của cơ-chế §1.4 (→ `01-nguyen-ly-va-mo-hinh-tang.md` §4.2;
bảng 6.4 chỉ là *biểu-diễn bảng* của nó); nội-dung 11 khía-cạnh & ánh-xạ khía-cạnh→phòng
(→ `04-taxonomy-generic.md`); luồng đọc Brain & gọi `detect_stage` (→ `03a`); luồng PHA 1 chạy
`task_gen_grid` (→ `03b`); cơ-chế song-vòng/cascade (→ `03d`); vòng-đời mục KHO & cổng PROMOTE
(→ `05-kho-chi-muc.md`). Spec này chỉ định **6 hàm + 6 bảng tĩnh**, không định **giá-trị của một DN**.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `6 GĐ` (LG-G-6-gd), `11 khía-cạnh` (LG-G-11-khia-canh),
`3 chiều tấn/thủ/hậu` (LG-G-tancong-phongthu-haucan), `single/double-loop` (LG-G-single-double-loop),
`telos` (LG-G-telos), `điều-kiện-đủ` (LG-G-dieu-kien-du), `back-test` (LG-G-back-test),
`OKR/KPI` (LG-G-okr-kpi), `reuse-grade` (LG-G-reuse-grade), `tên-năng-lực chuẩn / canonical`
(LG-G-ten-nang-luc-chuan). Các tầng/dạng-câu (`trang_thai`, `dong_tu`…) xem `01` §3.2.

## 3. Mô-hình dữ-liệu

> **Quy-ước chung:** mỗi hàm là `pure`; bảng tĩnh dưới đây CHÍNH LÀ config code đọc trực-tiếp
> (đề-xuất lưu `knowledge/rule-engines/*.yaml`). Mọi bảng đều `gp = generic`.

### 3.1 · `detect_stage` — rubric phát-hiện stage (§6.1)

```
INPUT : brain  (state.md / products.md / budget.md…)
OUTPUT: { stage: enum{GD1..GD6}, cau_song_con:string, bang_chung:[ref], do_tin:float }
```

Bảng tĩnh `STAGE_RUBRIC` (6 hàng — ĐẦY-ĐỦ):

| GĐ | Câu-hỏi-sống-còn | Dấu-hiệu nhận-biết (đọc Brain) | Claim |
|---|---|---|---|
| GĐ1 | khả-thi? có bài-toán đáng giải? | chưa rõ vấn-đề / chưa có sản-phẩm | LG-6.1-gd1 |
| GĐ2 | kéo & trả? (PMF) | có sản-phẩm, đang tìm khách tự quay-lại & trả tiền | LG-6.1-gd2 |
| GĐ3 | giao thật ở điều-kiện thật? | PMF rồi, lo giao-hàng/vận-hành ổn-định | LG-6.1-gd3 |
| GĐ4 | lãi/đơn-vị, lặp được? | giao ổn, đang tối-ưu biên lãi từng đơn-vị | LG-6.1-gd4 |
| GĐ5 | nhân không vỡ? | đang nhân-bản sang điểm/thị-trường mới | LG-6.1-gd5 |
| GĐ6 | duy-trì + tái-tạo? | lõi chín, lời đều + cần gieo đường-cong kế | LG-6.1-gd6 |

### 3.2 · `route_song_vong` — định-tuyến song-vòng + NEO BRAIN (§6.2)

```
INPUT : tin_hieu  (mô-tả triệu-chứng từ chạy-thật)
OUTPUT: { tang_leo:enum{cau_truc,co_may_moat,dinh_vi,telos}, file_neo:[brain_file], nhip:enum }
```

Bảng tĩnh `LOOP_ROUTING` (5 hàng — ĐẦY-ĐỦ; hàng 5 là *bằng-chứng nền* luôn đọc, không phải tầng leo):

| Tín-hiệu từ chạy-thật | Leo tầng | Neo + cập-nhật Brain file | Nhịp | Claim |
|---|---|---|---|---|
| quy-trình tắc · vai quá-tải | **Cấu-trúc** | `structure.md` + `headcount.md` | nhanh | LG-6.2-cau-truc |
| moat xói · kinh-tế-đơn-vị xấu | **Cỗ-máy/moat** | `positioning.md`(moat) + `products.md`(unit-econ) + `budget.md` | vừa | LG-6.2-moat |
| đầu-cầu cạn · sai ngách | **Định-vị** | `positioning.md`(đầu-cầu) + `strategy.md`(ICP/thị-trường) | vừa–chậm | LG-6.2-dinh-vi |
| chạy đúng mọi thứ vẫn èo-uột | **Telos** | `telos.md` (+ `curves.md` xét danh-mục) | rất chậm | LG-6.2-telos |
| *luôn đọc để biết tầng nào vỡ* | bằng-chứng nền | `state.md` + `budget.md` (số thật) | — | LG-6.2-nen |

> Ba cái lợi khi neo file (SoT): (1) re-debate có grounding ("mọi số phải trích Brain"); (2) biết
> **chính-xác file nào cập-nhật** khi song-vòng nổ; (3) chống leo nhầm tầng (tín-hiệu ở
> `products/budget` → sửa moat, đừng vội đụng `telos`).

### 3.3 · `goal_by_aspect` — sinh mục-tiêu theo 11 khía-cạnh (§6.3)

```
INPUT : aspect:int[1..11]  (tuỳ chọn) , stage  (để cổng lọc)
OUTPUT: { hoi_cong_loc:string, mau_muc_tieu:string(trang_thai), active:bool }
```

Bảng tĩnh `ASPECT_GOAL_TEMPLATE` (11 hàng — ĐẦY-ĐỦ; mẫu mục-tiêu LUÔN ở dạng `trang_thai`,
khớp luật chống-nén-tầng `01` §4.1):

| # Khía-cạnh | Hỏi (cổng lọc) | Nếu CÓ → mục-tiêu (dạng trạng-thái) | Claim |
|---|---|---|---|
| 1 Sản-phẩm | GĐ này có lý-do lo sản-phẩm? | "Chất-lượng/định-nghĩa sản-phẩm **đạt chuẩn X**" | LG-6.3-asp1 |
| 2 Thị-trường | …lo ngách/định-vị? | "Đầu-cầu & thông-điệp **được xác-nhận**" | LG-6.3-asp2 |
| 3 Khách-hàng | …lo khách? | "Tỷ-lệ khách quay-lại **≥ Y%**" | LG-6.3-asp3 |
| 4 Tiền | …lo tiền/vốn? | "Hạ-tầng thu tiền **sẵn-sàng**" / "Biên lãi/đv **≥ Z%**" | LG-6.3-asp4 |
| 5 Con-người | …lo năng-lực/đội-ngũ? | "Vai then-chốt **có người thay được founder**" | LG-6.3-asp5 |
| 6 Hậu-cần | …lo chuỗi-cung/hạ-tầng đầu-vào? | "Nguồn-cung & hạ-tầng **ổn giá, đủ, đúng hạn**" | LG-6.3-asp6 |
| 7 Vận-hành | …lo quy-trình giao/chạy? | "Quy-trình lõi **chạy ổn-định, lặp được**" | LG-6.3-asp7 |
| 8 Dữ-liệu | …lo đo-lường/thông-tin? | "Số then-chốt **được đo & tin-cậy** (1 nguồn-sự-thật)" | LG-6.3-asp8 |
| 9 Rủi-ro | …có gì có-thể giết DN? | "Rủi-ro pháp-lý/IP **được chặn** (cổng kiểm)" | LG-6.3-asp9 |
| 10 Đối-tác (MỚI) | …cần kênh/liên-minh/nền-tảng? | "Kênh/đối-tác then-chốt **đã chốt & ràng-buộc rõ**" | LG-6.3-asp10 |
| 11 Bền-vững (MỚI) | …có nghĩa-vụ xã-hội/quản-chế đáng lo? | "Giấy-phép-xã-hội & tuân-thủ ESG **được duy-trì**" | LG-6.3-asp11 |

> Khía-cạnh "chưa có lý-do ở GĐ này" → **bỏ qua** (`active=false`, phòng tương-ứng ngủ).
> 10–11 thường ngủ ở GĐ0–2 (mặc-định `active=false` khi `stage ∈ {GD1,GD2}` trừ khi cổng lọc CÓ).

### 3.4 · `task_gen_grid` — lưới sinh nhiệm-vụ-chính (§6.4 = dạng-bảng của §1.4)

```
INPUT : —  (đây là LƯỚI/template, không nhận dữ-liệu DN; xem 01 §4.2 cho hàm chạy thật)
OUTPUT: [ {lop, cau_hoi, cho_ra, test} ]   # 5 hàng cố-định để driver §1.4 tham-chiếu
```

Bảng tĩnh `TASKGEN_GRID` (5 hàng — ĐẦY-ĐỦ; mỗi hàng ánh-xạ 1 bước của `sinh_nhiem_vu_chinh`):

| Lớp | Câu hỏi sinh / soi | Cho ra / bắt được | Test | Claim |
|---|---|---|---|---|
| **1 · Sinh** | "State đúng khi NHỮNG điều-kiện nào đồng-thời thành-lập?" | mỗi điều-kiện chưa-đạt → 1 nhiệm-vụ-chính (động-từ) | gap hiện-trạng→đích | LG-6.4-L1 |
| **2 · Soi 3 chiều** | 🗡 LÀM gì tạo state? · 🛡 state hỏng kiểu gì? · 📦 cần CẤP gì để chạy? | bổ-sung việc thủ/hậu hay bị quên | đủ cả 3 chiều | LG-6.4-L2 |
| **3 · Quét ngang** | "Đạt state này đụng khía-cạnh nào khác chưa có việc?" | việc sót xuyên 11 khía-cạnh | không sót khía-cạnh | LG-6.4-L3 |
| **Cổng nghiệm** | mọi việc done → state tự-động đúng? · bỏ 1 việc còn đạt? · 2 việc chồng? | chốt tập nhiệm-vụ-chính | đủ · tối-thiểu · không-trùng | LG-6.4-gate |
| **Neo đo** | việc này đóng điều-kiện nào? đo bằng gì? | OKR (tấn) / KPI-ngưỡng (thủ·hậu) | không neo được = cắt | LG-6.4-neo |

### 3.5 · `reuse_decision` — rubric tra-kho từng tầng (§6.5)

```
INPUT : ung_vien_kho, ngu_canh  (đầu-vào/ra · ràng-buộc · GĐ · khía-cạnh)
OUTPUT: { quyet_dinh:enum{REUSE,ADAPT,NEW}, hanh_dong:string }
```

Bảng tĩnh `REUSE_RUBRIC` (3 hàng — ĐẦY-ĐỦ):

| Khớp ngữ-cảnh (đầu-vào/ra · ràng-buộc · GĐ · khía-cạnh) | Quyết-định | Hành-động | Claim |
|---|---|---|---|
| Khớp cao (reuse-grade A, hợp-đồng ngữ-cảnh trùng) | **REUSE** | dùng-luôn tài-sản KHO; `structure.md` ghi `reused_from` | LG-6.5-reuse |
| Gần đúng (lệch tham-số/quy-mô, reuse-grade B) | **ADAPT** | tinh-chỉnh cho khớp ngữ-cảnh; ghi delta để PROMOTE bản-mới sau | LG-6.5-adapt |
| Không có / khác hẳn ngữ-cảnh | **NEW** | đẻ mới; nếu chạy tốt → ứng-viên PROMOTE (cổng §3 PHA 3) | LG-6.5-new |

### 3.6 · `naming_dict` — từ-điển tên-năng-lực chuẩn (§6.6)

```
INPUT : ten_nganh:string  (tên theo skin ngành)
OUTPUT: ten_nang_luc_chuan:slug  (canonical, kebab-case, không dấu-cách)
```

`naming_dict` là **bảng ánh-xạ canonical** đồng-bộ 7 khối / 12 phòng (định-nghĩa danh-mục
canonical ở `04-taxonomy-generic.md`). Đây là **khóa so-khớp xuyên-ngành**: tra-kho, đối-chiếu
calibration, gộp trùng khi dọn — tất cả dựa **tên-chuẩn**, KHÔNG dựa tên-ngành (vốn đổi theo skin).
Khi onboard ngành mới, `pack-architect`/`vn-architect` ánh-xạ `tên-ngành → tên-năng-lực-chuẩn`
TRƯỚC khi ghi `_index.md` (LG-6.6-rule).

## 4. Hành-vi / thuật-toán

### 4.1 · `detect_stage(brain)` (§6.1)
```
func detect_stage(brain):
    diem = {}                                   # điểm khớp dấu-hiệu mỗi GĐ
    for hang in STAGE_RUBRIC:
        diem[hang.gd] = khop_dau_hieu(brain, hang.dau_hieu)   # đối-chiếu state/budget/products
    gd = argmax(diem)                           # GĐ có dấu-hiệu khớp mạnh nhất
    return { stage:gd, cau_song_con:STAGE_RUBRIC[gd].cau, bang_chung:trich_brain(brain,gd),
             do_tin:chuan_hoa(diem) }
```
**Edge-case (reality-check):** nếu CEO khai GĐ cao hơn dấu-hiệu Brain (vd khai GĐ5 nhưng `budget.md`
cho thấy quán còn lỗ → thực-tế GĐ4), hàm trả **stage theo dấu-hiệu Brain**, không theo lời khai;
chênh-lệch ghi vào `bang_chung` để `03a` cảnh-báo CEO.

### 4.2 · `route_song_vong(tin_hieu)` (§6.2)
```
func route_song_vong(tin_hieu):
    hang = khop_trieu_chung(tin_hieu, LOOP_ROUTING[1..4])   # 4 tầng leo (bỏ hàng nền)
    if hang == null: return { tang_leo:null, can_debate:true }   # mơ-hồ → đẩy lên HITL/debate
    return { tang_leo:hang.tang, file_neo:hang.file, nhip:hang.nhip,
             nen: LOOP_ROUTING.nen.file }       # luôn kèm state.md+budget.md (hàng nền)
```
**Chống leo nhầm tầng:** ưu-tiên tầng THẤP nhất khớp (Cấu-trúc < moat < Định-vị < Telos);
chỉ leo Telos khi "chạy đúng mọi thứ vẫn èo-uột", không leo vì một triệu-chứng products/budget.

### 4.3 · `goal_by_aspect(aspect, stage)` (§6.3)
```
func goal_by_aspect(aspect, stage):
    row = ASPECT_GOAL_TEMPLATE[aspect]
    active = cong_loc(row.hoi, stage)           # "GĐ này có lý-do lo khía-cạnh?" → bool
    return { hoi_cong_loc:row.hoi, mau_muc_tieu:row.mau, active:active }
# Quét toàn-bộ: [ goal_by_aspect(a, stage) for a in 1..11 if .active ]  → tập mục-tiêu khung
```

### 4.4 · `task_gen_grid()` (§6.4)
Trả `TASKGEN_GRID` (5 hàng). Đây là **bảng tra tĩnh** mà `sinh_nhiem_vu_chinh` (`01` §4.2) dùng
làm danh-mục bước: Lớp1→Lớp2→Lớp3→Cổng nghiệm→Neo đo. KHÔNG tự chạy phân-rã (việc đó của `01`).

### 4.5 · `reuse_decision(ung_vien, ngu_canh)` (§6.5)
```
func reuse_decision(ung_vien, ngu_canh):
    if ung_vien == null:                    return NEW
    grade = cham_khop(ung_vien.hop_dong, ngu_canh)   # so đầu-vào/ra · ràng-buộc · GĐ · khía-cạnh
    if grade == A and hop_dong_trung:       return REUSE   (hanh_dong: ghi reused_from)
    if grade == B (lệch tham-số/quy-mô):    return ADAPT   (hanh_dong: tinh-chỉnh + ghi delta)
    return NEW                              (hanh_dong: đẻ mới, ứng-viên PROMOTE nếu tốt)
```

### 4.6 · `naming_dict(ten_nganh)` (§6.6)
```
func naming_dict(ten_nganh):
    slug = NAMING_CANONICAL.lookup(chuan_hoa(ten_nganh))   # ánh-xạ skin → canonical
    if slug == null: raise NEED_MAPPING(ten_nganh)         # buộc pack-architect ánh-xạ trước khi vào index
    return slug   # kebab-case, không dấu-cách
```

## 5. Ranh-giới generic ↔ phân-rã

**Toàn-bộ 6 bảng + 6 hàm ở spec này đều GENERIC** (config tĩnh viết-một-lần-dùng-mãi), bám
`01` §5 / LG-1.1-2,3,5. Cụ-thể:

| Thành-phần | GP | Phần generic | Phần phân-rã (suy mỗi DN — NẰM Ở SPEC KHÁC) |
|---|---|---|---|
| `detect_stage` + `STAGE_RUBRIC` | **GENERIC** | 6 hàng GĐ + câu-sống-còn + dấu-hiệu | stage thực của DN (output) → `03a` |
| `route_song_vong` + `LOOP_ROUTING` | **GENERIC** | 5 hàng tín-hiệu→tầng→file | tín-hiệu thật của DN (input) → `03d` |
| `goal_by_aspect` + `ASPECT_GOAL_TEMPLATE` | **GENERIC** (câu hỏi + mẫu) | 11 hàng cổng-lọc + mẫu trạng-thái | mục-tiêu cụ-thể (khoác chữ DN) → `03b` |
| `task_gen_grid` + `TASKGEN_GRID` | **GENERIC** | 5 hàng lưới (khung 3 lớp + cổng + neo) | tập nhiệm-vụ-chính thật → `01` §4.2 / `03b` |
| `reuse_decision` + `REUSE_RUBRIC` | **GENERIC** (luật reuse) | 3 hàng A/B/none → REUSE/ADAPT/NEW | tài-sản KHO của ngành → `05` |
| `naming_dict` + `NAMING_CANONICAL` | **GENERIC** (từ-điển) | bảng tên-năng-lực canonical | tên-ngành theo skin (input) → onboard |

**Chốt:** spec này KHÔNG chứa giá-trị của bất-kỳ DN nào; nó chỉ là **6 hàm thuần + 6 bảng tĩnh**.

## 6. Cổng & luật bất-biến

- **INV-6.1 (xác-định):** mọi hàm thuần — cùng input → cùng output; không ghi side-effect vào Brain/KHO.
- **INV-6.2 (mẫu mục-tiêu = trạng-thái):** mọi `mau_muc_tieu` của `goal_by_aspect` phải là `trang_thai`,
  KHÔNG mở-đầu động-từ (khớp `01` INV-1, chống nén tầng).
- **INV-6.3 (stage theo Brain, không theo lời khai):** `detect_stage` trả stage theo dấu-hiệu Brain;
  lệch lời-khai → cảnh-báo, không tự nâng GĐ.
- **INV-6.4 (leo tầng thấp nhất):** `route_song_vong` ưu-tiên tầng thấp nhất khớp; chỉ chạm `telos`
  khi tín-hiệu đúng hàng "chạy đúng vẫn èo-uột" — chống leo nhầm tầng.
- **INV-6.5 (luôn neo nền):** mọi output `route_song_vong` kèm `state.md`+`budget.md` (hàng nền 6.2).
- **INV-6.6 (khóa canonical bắt-buộc):** không có ánh-xạ `naming_dict` ⇒ KHÔNG được ghi `_index.md`
  (LG-6.6-rule). `reuse_decision` so-khớp trên tên-chuẩn, không trên tên-ngành.
- **INV-6.7 (6.4 chỉ là bảng):** `task_gen_grid` KHÔNG tự sinh việc — driver duy-nhất là `01` §4.2.

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `knowledge/rule-engines/stage-rubric.yaml` | THÊM | bảng `STAGE_RUBRIC` (§3.1) |
| `knowledge/rule-engines/loop-routing.yaml` | THÊM | bảng `LOOP_ROUTING` (§3.2) |
| `knowledge/rule-engines/aspect-goal.yaml` | THÊM | bảng `ASPECT_GOAL_TEMPLATE` (§3.3) |
| `knowledge/rule-engines/taskgen-grid.yaml` | THÊM | bảng `TASKGEN_GRID` (§3.4) |
| `knowledge/rule-engines/reuse-rubric.yaml` | THÊM | bảng `REUSE_RUBRIC` (§3.5) |
| `knowledge/rule-engines/naming-canonical.yaml` | THÊM | bảng `NAMING_CANONICAL` (§3.6, đồng-bộ `04`) |
| `03a-pha0-khoi-tao` (intake/stage) | THAM-CHIẾU | gọi `detect_stage` |
| `03d-pha3-khep-vong` | THAM-CHIẾU | gọi `route_song_vong` |
| `03b-pha1-phan-ra` | THAM-CHIẾU | gọi `goal_by_aspect` + dùng `TASKGEN_GRID` |
| `01-nguyen-ly-va-mo-hinh-tang` §4.2 | THAM-CHIẾU | `sinh_nhiem_vu_chinh` đọc `TASKGEN_GRID` |
| `05-kho-chi-muc` | THAM-CHIẾU | gọi `reuse_decision` + `naming_dict` |
| `vn-orchestrator/SKILL.md` (router + sinh cây) | SỬA | nạp 6 bảng làm luật khung |

## 8. Tiêu-chí chấp-nhận

Test mỗi hàm 1–2 ca (fixture: INLINE `test/rule-engines.test.js` (neo claim `LG-*`)):

### 8.1 · `detect_stage`
| # | Input (Brain tóm-tắt) | Kỳ-vọng |
|---|---|---|
| S1 | "giao ổn, đang tối-ưu biên lãi từng đơn-vị" | `stage=GĐ4`, câu="lãi/đơn-vị, lặp được?" (LG-6.1-gd4) |
| S2 | CEO khai GĐ5 nhưng budget cho thấy còn lỗ/đơn-vị | `stage=GĐ4` (theo Brain) + cảnh-báo lệch (INV-6.3, LG-6.1-gd5) |

### 8.2 · `route_song_vong`
| # | Input tín-hiệu | Kỳ-vọng |
|---|---|---|
| R1 | "moat xói · kinh-tế-đơn-vị xấu" | `tang=Cỗ-máy/moat`, file={positioning,products,budget}, nhịp=vừa (LG-6.2-moat) |
| R2 | "chạy đúng mọi thứ vẫn èo-uột" | `tang=Telos`, file={telos,curves}, nhịp=rất chậm; output kèm state+budget (LG-6.2-telos, LG-6.2-nen, INV-6.5) |

### 8.3 · `goal_by_aspect`
| # | Input | Kỳ-vọng |
|---|---|---|
| G1 | aspect=4 (Tiền), stage=GĐ4 | mẫu="Biên lãi/đv ≥ Z%" (trạng-thái, không động-từ), active=true (LG-6.3-asp4, INV-6.2) |
| G2 | aspect=11 (Bền-vững), stage=GĐ1 | active=false (ngủ ở GĐ0-2) (LG-6.3-asp11) |

### 8.4 · `task_gen_grid`
| # | Input | Kỳ-vọng |
|---|---|---|
| T1 | — | trả đúng 5 hàng theo thứ-tự Sinh→Soi3chiều→Quét-ngang→Cổng-nghiệm→Neo-đo (LG-6.4-L1..gate,neo) |
| T2 | hàng "Neo đo" | test="không neo được = cắt", cho-ra="OKR(tấn)/KPI-ngưỡng(thủ·hậu)" (LG-6.4-neo) |

### 8.5 · `reuse_decision`
| # | Input | Kỳ-vọng |
|---|---|---|
| U1 | grade A, hợp-đồng ngữ-cảnh trùng | `REUSE`, hành-động ghi `reused_from` (LG-6.5-reuse) |
| U2 | grade B (lệch quy-mô) / không có | `ADAPT` (ghi delta) / `NEW` (ứng-viên PROMOTE) (LG-6.5-adapt, LG-6.5-new) |

### 8.6 · `naming_dict`
| # | Input | Kỳ-vọng |
|---|---|---|
| N1 | tên-ngành có ánh-xạ | trả slug canonical kebab-case (LG-6.6-rule) |
| N2 | tên-ngành chưa ánh-xạ | raise `NEED_MAPPING`, chặn ghi `_index.md` (INV-6.6) |

→ test-runner: INLINE `test/rule-engines.test.js` (neo claim `LG-*`) (mỗi hàm đọc bảng tĩnh + so output).

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (debate stage-aware + 11 khía-cạnh/7 khối) — theo LG-9-uutien.
- **Trước:** `00-tong-quan-va-thuat-ngu.md`; `01-nguyen-ly-va-mo-hinh-tang.md` (luật tầng/§1.4);
  `04-taxonomy-generic.md` (11 khía-cạnh, 7 khối/12 phòng canonical).
- **Sau / dùng spec này:** `03a` (`detect_stage`), `03b` (`goal_by_aspect` + `TASKGEN_GRID`),
  `03d` (`route_song_vong`), `05-kho-chi-muc` (`reuse_decision` + `naming_dict`).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-6.1-gd1 | §3.1 STAGE_RUBRIC GĐ1 | S1-family (khớp dấu-hiệu GĐ) |
| LG-6.1-gd2 | §3.1 STAGE_RUBRIC GĐ2 | S1-family |
| LG-6.1-gd3 | §3.1 STAGE_RUBRIC GĐ3 | S1-family |
| LG-6.1-gd4 | §3.1 STAGE_RUBRIC GĐ4 | S1 |
| LG-6.1-gd5 | §3.1 STAGE_RUBRIC GĐ5 | S2 (lệch lời-khai) |
| LG-6.1-gd6 | §3.1 STAGE_RUBRIC GĐ6 | S1-family |
| LG-6.2-cau-truc | §3.2 LOOP_ROUTING hàng 1 | R-family (khớp tín-hiệu→tầng) |
| LG-6.2-moat | §3.2 LOOP_ROUTING hàng 2 | R1 |
| LG-6.2-dinh-vi | §3.2 LOOP_ROUTING hàng 3 | R-family |
| LG-6.2-telos | §3.2 LOOP_ROUTING hàng 4 | R2 |
| LG-6.2-nen | §3.2 LOOP_ROUTING hàng nền, §4.2, INV-6.5 | R2 (output kèm state+budget) |
| LG-6.3-asp1 | §3.3 ASPECT_GOAL_TEMPLATE #1 | G-family (mẫu = trạng-thái) |
| LG-6.3-asp2 | §3.3 #2 | G-family |
| LG-6.3-asp3 | §3.3 #3 | G-family |
| LG-6.3-asp4 | §3.3 #4 | G1 |
| LG-6.3-asp5 | §3.3 #5 | G-family |
| LG-6.3-asp6 | §3.3 #6 | G-family |
| LG-6.3-asp7 | §3.3 #7 | G-family |
| LG-6.3-asp8 | §3.3 #8 | G-family |
| LG-6.3-asp9 | §3.3 #9 | G-family |
| LG-6.3-asp10 | §3.3 #10 | G-family (ngủ GĐ0-2) |
| LG-6.3-asp11 | §3.3 #11 | G2 (ngủ GĐ1) |
| LG-6.4-L1 | §3.4 TASKGEN_GRID Lớp1 | T1 |
| LG-6.4-L2 | §3.4 TASKGEN_GRID Lớp2 | T1 |
| LG-6.4-L3 | §3.4 TASKGEN_GRID Lớp3 | T1 |
| LG-6.4-gate | §3.4 TASKGEN_GRID Cổng nghiệm | T1 |
| LG-6.4-neo | §3.4 TASKGEN_GRID Neo đo | T2 |
| LG-6.5-reuse | §3.5 REUSE_RUBRIC hàng A | U1 |
| LG-6.5-adapt | §3.5 REUSE_RUBRIC hàng B | U2 |
| LG-6.5-new | §3.5 REUSE_RUBRIC hàng none | U2 |
| LG-6.6-rule | §3.6 NAMING_CANONICAL, INV-6.6 | N1/N2 |

## 11. OPEN-Q

- **OQ-1:** `khop_dau_hieu` trong `detect_stage` dùng heuristic luật (keyword + ngưỡng số từ Brain)
  hay LLM chấm? Đề-xuất: luật trước (xác-định), LLM chỉ khi mơ-hồ + ghi `do_tin` — CEO/kỹ-thuật chốt.
- **OQ-2:** Ngưỡng phân A/B của `reuse_decision` (reuse-grade) định-lượng thế nào (số tham-số lệch,
  % khớp hợp-đồng)? Cần đồng-bộ với cổng PROMOTE & reuse-grade ở `05-kho-chi-muc.md`.
- **OQ-3:** Khi `route_song_vong` khớp NHIỀU hàng (nhiều tầng cùng vỡ) — leo lần-lượt thấp→cao hay
  để debate chọn? Hiện đặt "tầng thấp nhất trước" (INV-6.4); chờ chốt với `03d`.
