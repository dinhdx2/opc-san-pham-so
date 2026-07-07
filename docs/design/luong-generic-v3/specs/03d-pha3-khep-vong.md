---
id: 03d-pha3-khep-vong
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 PHA 3 (dòng 391-400) + §6.2 (dòng 539-550) + §5.3 (dòng 508-514)"
covers: [LG-3-PHA3-don-vong, LG-3-PHA3-song-vong, LG-3-PHA3-ceo, LG-3-PHA3-pass, LG-3-PHA3-promote, LG-3-PHA3-gate-gd, LG-3-PHA3-warn]
depends_on: [01-nguyen-ly-va-mo-hinh-tang, 02-brain-schema]
milestone: M5
---

# 03d · PHA 3 Khép-vòng

> **Spec lớp KHÉP-VÒNG (chiều đi-lên của trục dọc).** Hiện-thực phần CHẠY-THẬT → đo →
> định-tuyến phản-hồi của SoT: đơn-vòng vá tại-chỗ → song-vòng leo tầng + NEO Brain →
> CEO quyết; hai cổng nghiệm-thu TÁCH BIỆT (PASS việc ≠ PROMOTE tái-dùng) và cổng GIAI-ĐOẠN.
> Đây là mặt-trái của `01-nguyen-ly` INV-6 (LG-1.2-up): chiều-sinh đi xuống ở `03b-pha1-phan-ra.md`,
> khép-vòng đi lên ở spec này.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§3 "PHA 3 · Khép-vòng — đo, định-tuyến, nghiệm-thu"** của SoT, kèm hai
bảng-luật neo nó dùng: **§6.2** (định-tuyến song-vòng có neo Brain) và **§5.3** (vòng-đời mục KHO,
nhánh THÊM/PROMOTE). Spec định **thuật-toán định-tuyến phản-hồi** sau khi đã chạy-thật một
kế-hoạch hành-động: vá tại-chỗ trong khuôn cũ trước (đơn-vòng), hết K vòng mới sửa chính cái
khuôn ở tầng trên (song-vòng) kèm cascade sinh-lại nhánh dưới, vẫn fail thì CEO quyết.

**Trong phạm-vi (in):** vòng lặp đơn-vòng (≤K) ghi `lessons.md`; bảng định-tuyến tín-hiệu→tầng→file
Brain (§6.2) cho song-vòng; cascade sinh-lại nhánh dưới khi đổi tầng trên; **hai cổng tách-biệt**
PASS-việc (KPI/OKR) và PROMOTE-tái-dùng (reuse-grade → cất KHO + ghi 1 dòng `_index.md`); **cổng
GIAI-ĐOẠN** (đủ mục-tiêu → re-debate SỐ THẬT → GĐ kế → PHA 1); luật cảnh-báo "đừng vì 1 chiến-dịch
lỗi đổi telos".

**Ngoài phạm-vi (out):** thuật-toán SINH cây việc & gom ngược-lên (→ `03b-pha1-phan-ra.md`);
phát-hiện stage PHA 0 (→ `03a-pha0-brain-stage.md`); schema chi-tiết file Brain mỗi tầng
(→ `02-brain-schema.md`); schema cột `_index.md` + rubric reuse §6.5 + nội-dung tài-sản KHO
(→ `05-kho-chi-muc.md`); router/debate/executor của PHA 2 (→ `03c-pha2-thuc-thi.md`);
mở-rộng đường-cong mới PHA 4 (→ `03e-pha4-mo-rong.md`). Spec này chỉ định **định-tuyến + cổng**,
gọi sang `05` khi PROMOTE và gọi lại `03b/PHA 1` khi qua cổng GIAI-ĐOẠN.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `single/double-loop` (LG-G-single-double-loop — đơn-vòng vá
trong khuôn cũ; song-vòng sửa chính cái khuôn tầng trên), `cascade` (LG-G-cascade — sửa tầng trên ⇒
nhánh việc dưới sinh lại), `altitude-tempo` (LG-G-altitude-tempo — telos đổi chậm nhất, cấu-trúc
nhanh nhất), `promote` (LG-G-promote — khử-danh-tính + tham-số-hoá + gắn-nhãn + kèm rubric),
`reuse-grade` (LG-G-reuse-grade — A/B/C), `okr-kpi` (LG-G-okr-kpi), `re-founding` (LG-G-re-founding —
đổi chính telos, ngoài vòng-đời), `back-test` (LG-G-back-test), `pmf` (LG-G-pmf),
`optimize-before-scale` (LG-G-optimize-before-scale).

## 3. Mô-hình dữ-liệu

### 3.1 · Sổ vòng phản-hồi (feedback ledger)

Mỗi hành-động đã chạy-thật mang một **FeedbackState** mà PHA 3 đọc/ghi (code đọc trực-tiếp):

| Field | Kiểu | Bắt-buộc | Ý-nghĩa |
|---|---|---|---|
| `action_id` | id | ✓ | hành-động/kế-hoạch đang khép-vòng (trỏ `10-thuc-thi-<action>.md`) |
| `vong_da_chay` | int ≥0 | ✓ | số vòng vá tại-chỗ đã thử (so với ngưỡng `K`) |
| `K` | int >0 | ✓ | trần đơn-vòng trước khi buộc leo song-vòng (config, mặc-định xem §6) |
| `do_dat` | `{thuoc_do:ref, gia_tri, dat:bool}` | ✓ | kết-quả đo so neo (OKR tấn / KPI-ngưỡng thủ·hậu) từ `01` §3.3 |
| `tang_leo` | enum `cau_truc\|moat\|dinh_vi\|telos`? | – | tầng song-vòng đã leo (null nếu còn đơn-vòng) |
| `brain_neo` | [path]? | – | file Brain đã NEO khi song-vòng (theo bảng §6.2) |
| `trang_thai` | enum `dang_va\|leo_tang\|cho_ceo\|pass\|killed` | ✓ | trạng-thái khép-vòng |

### 3.2 · Bản-ghi `lessons.md` (1 dòng/vòng đơn-vòng)

| Cột | Kiểu | Ý-nghĩa |
|---|---|---|
| `ngay` | date | ngày ghi bài-học |
| `action_id` | id | hành-động liên-quan |
| `vong` | int | vòng thứ mấy |
| `quan-sat` | string | đo thấy gì lệch đích |
| `va` | string | vá tại-chỗ đã làm (trong khuôn cũ, KHÔNG leo tầng) |
| `ket-qua` | enum `do-hon\|chua-do\|het-K` | có cải-thiện không |

> `lessons.md` là file MỚI ở `00-Brain/` (LG-8-memory). Đơn-vòng GHI vào đây; song-vòng GHI vào
> file Brain của tầng (§6.2) + `decisions-log.md` (gắn nhãn altitude).

### 3.3 · Bản-ghi PROMOTE (đầu-vào cho `05-kho-chi-muc.md`)

```
PromoteRecord  { asset_path, ten_nang_luc, khia_canh:int, gd, dau_vao_ra,   # hợp-đồng ngữ-cảnh
                 reuse_grade:enum{A,B,C}, nguon_task, version }             # 1 dòng _index.md
```

Spec này chỉ DỰNG bản-ghi rồi gọi `05`; định-dạng đủ-cột & chuẩn-hoá `id` thuộc `05` (LG-5.2-*).

## 4. Hành-vi / thuật-toán

### 4.1 · `khep_vong(action, brain)` — định-tuyến phản-hồi sau chạy-thật

Hai luật khung: **(a)** đa-số phản-hồi nên DỪNG ở đơn-vòng; chỉ khi vá không nổi & có **dữ-liệu-thật**
mới leo song-vòng (LG-3-PHA3-warn). **(b)** Song-vòng PHẢI neo bằng-chứng từ file Brain tương-ứng,
không lý-luận trên không.

```
INPUT : action:FeedbackState     # đã chạy-thật, có do_dat
        brain                    # state/budget.md (số thật) + file tầng (telos/positioning/...)
OUTPUT: ket:enum{pass, killed, leo_xong}   # + side-effect ghi Brain/lessons/KHO

func khep_vong(action, brain):

  # ── 0 · ĐO so neo (chống lặp mù) ───────────────────────────────────────────
  do = do_so_neo(action)                       # OKR(tấn) / KPI-ngưỡng(thủ·hậu) — §6.4-neo của 01
  if do.dat:
      return cong_pass(action)                 # → §4.2 (PASS việc) — KHÔNG tự PROMOTE

  # ── 1 · ĐƠN-VÒNG (mặc-định, ≤ K) — vá tại-chỗ TRONG khuôn cũ (LG-3-PHA3-don-vong) ──
  while action.vong_da_chay < action.K:
      va = va_tai_cho(action, brain)           # đổi tham-số/lịch/khuyến-mãi… KHÔNG đổi tầng trên
      ghi_lessons_md(action, va)               # 1 dòng lessons.md (§3.2)
      action.vong_da_chay += 1
      if do_so_neo(action).dat:
          return cong_pass(action)             # vá xong trong khuôn cũ → PASS
  # hết K vòng vẫn chưa đạt → buộc leo (KHÔNG lặp đơn-vòng mãi)

  # ── 2 · SONG-VÒNG — sửa CHÍNH cái khuôn ở tầng trên + NEO Brain (LG-3-PHA3-song-vong) ──
  # điều-kiện CỨNG: phải có dữ-liệu-thật ở state/budget, không leo trên cảm-tính (LG-3-PHA3-warn)
  if not co_bang_chung_that(brain):            # đọc state.md + budget.md (§6.2 dòng "nền")
      return cong_ceo(action, ly_do="thiếu bằng-chứng leo tầng")   # → §4.4

  tang = dinh_tuyen_tang(action.do_dat, brain) # bảng §6.2: tín-hiệu → tầng (xem §4.5)
  # thứ-tự ưu-tiên leo: cấu-trúc → moat → định-vị → (hiếm) telos — tầng càng cao càng phải chắc
  files = neo_brain_files(tang)                # §6.2 cột "Neo file": vd moat → positioning+products+budget
  if tang == telos and not bien_co_the_gioi_keo_dai(brain):
      return cong_ceo(action, ly_do="chỉ re-founding mới được chạm telos")  # LG-3-PHA3-warn

  cap_nhat_brain(files, ket_luan_tu_so_that(brain))   # NEO: ghi vào ĐÚNG file tầng đó (§6.2)
  ghi_decisions_log(tang, altitude=tang)              # gắn nhãn altitude (LG-8-memory)
  action.tang_leo = tang; action.brain_neo = files

  # cascade: đổi tầng trên ⇒ nhánh việc DƯỚI phải sinh lại (LG-G-cascade)
  cascade_sinh_lai(tang)                        # gọi 03b/PHA 1 sinh-lại nhánh dưới tầng `tang`
  # (đây cũng là chỗ THÊM/BỚT/SỬA bộ-phận/phòng/khối khi vận-hành thật — INV-5 của 01 vẫn giữ:
  #  cấu-trúc là KẾT-QUẢ gom ngược, ở đây sửa theo việc thật chứ không vẽ-sẵn)

  # ── 3 · Vẫn fail sau leo → CEO QUYẾT (LG-3-PHA3-ceo) ──
  if not do_so_neo(action).dat:
      return cong_ceo(action, ly_do="leo tầng vẫn không đạt")   # giết / đổi-hướng, không lặp mù
  return cong_pass(action)
```

**Edge-case:**
- `K=0` (config tắt đơn-vòng) → vào thẳng song-vòng; vẫn buộc điều-kiện `co_bang_chung_that`.
- Tín-hiệu mơ-hồ ở §6.2 (vd vừa "moat xói" vừa "đầu-cầu cạn") → leo TẦNG-THẤP-trước (moat trước
  định-vị) theo thứ-tự `cấu-trúc→moat→định-vị→telos`; chỉ leo cao hơn nếu tầng thấp đã neo mà vẫn fail.
- Đo `do.dat == true` ngay từ đầu → KHÔNG vào đơn-vòng/song-vòng; đi thẳng §4.2 rồi xét §4.3 PROMOTE.

### 4.2 · `cong_pass(action)` — Cổng PASS việc (LG-3-PHA3-pass)

```
func cong_pass(action):
    if action.do_dat.dat:                       # đạt KPI/OKR đã neo (01 §3.3)
        action.trang_thai = pass
        xet_promote(action)                     # GỌI §4.3 — PASS KHÔNG kéo theo PROMOTE
        return pass
    return cong_ceo(action, "không đạt KPI/OKR")
```

**Bất-biến:** PASS chỉ kết-luận "việc xong"; KHÔNG ghi gì vào KHO. PASS ≠ PROMOTE (xem §6 INV-2).

### 4.3 · `xet_promote(action)` — Cổng PROMOTE tái-dùng (LG-3-PHA3-promote, §5.3 THÊM)

```
func xet_promote(action):
    grade = cham_rubric_reuse_grade(action.asset)   # rubric reuse-grade (chi-tiết ở 05/§6.5)
    if grade in {A, B}:                             # đạt chuẩn tái-dùng (khử-danh-tính, tham-số-hoá…)
        rec = dung_promote_record(action, grade)    # §3.3
        ghi_tai_san_KHO(rec.asset_path)             # cất tài-sản vào knowledge/playbook/<ngành>/...
        cap_nhat_index_md(rec)                      # GỌI 05: chèn 1 DÒNG _index.md (đủ cột, id chuẩn)
        # "Không qua cổng = không vào index" (§5.3)
    else:
        bo_qua()                                    # grade C / chưa chuẩn → không vào index
```

**Bất-biến:** chỉ tài-sản QUA cổng PROMOTE mới được ghi `_index.md` (LG-5.3-them). Bản-thân việc
ghi cột & chuẩn-hoá `id` ủy cho `05-kho-chi-muc.md`.

### 4.4 · `cong_ceo(action, ly_do)` — Hết K / leo vẫn fail → CEO quyết (LG-3-PHA3-ceo)

```
func cong_ceo(action, ly_do):
    action.trang_thai = cho_ceo
    quyet = HOI_CEO(ly_do, bang_chung=action.brain_neo)   # AskUserQuestion ở main loop (HITL)
    switch quyet:
        case giet:        action.trang_thai = killed; return killed
        case doi_huong:   return cascade_sinh_lai(tang_moi)  # sinh lại theo hướng mới
    # KHÔNG lặp mù: không tự quay lại đơn-vòng khi đã hết K
```

### 4.5 · `dinh_tuyen_tang(do_dat, brain)` — bảng §6.2 (LG-3-PHA3-song-vong)

Ánh-xạ tín-hiệu-từ-chạy-thật → tầng leo → file Brain để NEO (bảng tĩnh §6.2, xem §5):

| Tín-hiệu từ chạy-thật | Leo tầng | Neo + cập-nhật file Brain | Nhịp |
|---|---|---|---|
| quy-trình tắc · vai quá-tải | **Cấu-trúc** | `structure.md` + `headcount.md` | nhanh |
| moat xói · kinh-tế-đơn-vị xấu | **Cỗ-máy/moat** | `positioning.md`(moat) + `products.md`(unit-econ) + `budget.md` | vừa |
| đầu-cầu cạn · sai ngách | **Định-vị** | `positioning.md`(đầu-cầu) + `strategy.md`(ICP/thị-trường) | vừa–chậm |
| chạy đúng mọi thứ vẫn èo-uột | **Telos** | `telos.md` (+ `curves.md` xét danh-mục) | rất chậm |
| *(luôn đọc để biết tầng nào vỡ)* | bằng-chứng nền | `state.md` + `budget.md` (số thật) | — |

Ba cái lợi khi neo file (SoT §6.2): (1) re-debate có grounding theo kỷ-luật "mọi số phải trích Brain";
(2) biết CHÍNH-XÁC file nào cập-nhật khi song-vòng nổ; (3) chống leo nhầm tầng (tín-hiệu ở
`products/budget` → sửa moat, đừng vội đụng `telos`).

### 4.6 · `cong_giai_doan(gd, brain)` — Cổng GIAI-ĐOẠN (LG-3-PHA3-gate-gd)

```
func cong_giai_doan(gd, brain):
    if du_muc_tieu_gd(gd):                       # mọi mục-tiêu GĐ hiện-tại đã PASS
        # câu-sống-còn của GĐ đã trả-lời ⇒ re-debate bằng SỐ THẬT tại cổng (PMF / tối-ưu)
        ok = re_debate_so_that(gd, brain)        # dùng số state/budget — chống optimize-before-scale
        if ok:
            gd_ke = gd + 1
            return goi_PHA1(gd_ke)               # vào GĐ kế ⇒ PHA 1 MỞ chi-tiết GĐ đó (03b)
    return tiep_tuc_gd(gd)                        # chưa đủ → ở lại GĐ hiện-tại
```

**Edge-case:** re-debate SỐ THẬT FAIL (vd PMF chưa thật, lãi/đv chưa dương) ⇒ KHÔNG lên GĐ kế dù
"cảm thấy đủ" — đây là chốt chống mở-rộng-sớm (LG-G-optimize-before-scale), nối tiếp reality-check PHA 0.

## 5. Ranh-giới generic ↔ phân-rã

| Mắt-xích | GP | Loại | Nguồn | Ghi-chú |
|---|---|---|---|---|
| Trình-tự đơn-vòng → song-vòng → CEO; ngưỡng `K` là biến config | **GENERIC** | luật + config cố-định | config | LG-3-PHA3-don-vong / -song-vong / -ceo |
| Bảng §6.2 tín-hiệu→tầng→file Brain (4 hàng + nền) | **GENERIC** | bảng-tra cố-định | config | mọi DN dùng chung |
| Hai cổng PASS / PROMOTE tách-biệt; luật "qua cổng mới vào index" | **GENERIC** | luật cố-định | config | LG-3-PHA3-pass / -promote |
| Cổng GIAI-ĐOẠN: đủ mục-tiêu → re-debate số-thật → GĐ kế | **GENERIC** | luật cố-định | config | LG-3-PHA3-gate-gd |
| Luật cảnh-báo "đừng đổi telos vì 1 chiến-dịch lỗi" | **GENERIC** | luật bất-biến | config | LG-3-PHA3-warn |
| Tín-hiệu CỤ-THỂ của một DN (quán-3 ế, moat nào xói…) | **PHÂN-RÃ** | đọc số thật | brain | nội-dung ô, suy mỗi DN |
| Ngưỡng KPI/OKR mỗi việc; reuse-grade mỗi tài-sản | **PHÂN-RÃ** | neo từ `01` §3.3 / chấm rubric | suy_ra | giá-trị tùy DN/tài-sản |

**Chốt:** **trình-tự khép-vòng + bảng §6.2 + 3 cổng (PASS/PROMOTE/GIAI-ĐOẠN) + luật cảnh-báo telos
là generic**; còn **tín-hiệu nào kích, leo tầng nào, đạt grade nào đều phân-rã từ số thật của DN.**

## 6. Cổng & luật bất-biến

- **INV-1 (đơn-vòng trước, có trần K):** mặc-định vá tại-chỗ ≤ K vòng; KHÔNG leo song-vòng khi chưa
  hết K hoặc chưa có dữ-liệu-thật (LG-3-PHA3-don-vong, LG-3-PHA3-warn).
- **INV-2 (PASS ≠ PROMOTE):** hai cổng TÁCH BIỆT. PASS dùng KPI/OKR; PROMOTE dùng rubric reuse-grade.
  Một việc có-thể PASS mà KHÔNG PROMOTE (LG-3-PHA3-pass, LG-3-PHA3-promote).
- **INV-3 (qua cổng mới vào index):** chỉ tài-sản qua cổng PROMOTE mới ghi 1 dòng `_index.md`;
  "không qua cổng = không vào index" (§5.3, LG-5.3-them).
- **INV-4 (song-vòng phải neo Brain):** mọi lần leo tầng PHẢI cập-nhật ĐÚNG file Brain của tầng đó
  theo bảng §6.2 + gắn nhãn altitude ở `decisions-log.md`; cấm leo trên cảm-tính (LG-3-PHA3-song-vong).
- **INV-5 (cascade khi đổi tầng trên):** đổi tầng trên ⇒ BẮT-BUỘC sinh-lại nhánh việc dưới (gọi
  `03b/PHA 1`); không để cây dưới lệch khuôn mới (LG-G-cascade).
- **INV-6 (chống lặp mù):** hết K + leo vẫn fail ⇒ CỔNG CEO (giết / đổi-hướng), không tự quay lại
  đơn-vòng (LG-3-PHA3-ceo). Cổng CEO chạy ở **main loop** (`AskUserQuestion`/HITL), KHÔNG trong Workflow nền.
- **INV-7 (telos bất-khả-xâm vì 1 chiến-dịch):** chạm `telos.md` CHỈ khi biến-cố-thế-giới kéo dài
  (re-founding), không vì A/B-test; phải có bằng-chứng từ Brain (LG-3-PHA3-warn).
- **INV-8 (cổng GIAI-ĐOẠN cần SỐ THẬT):** chỉ lên GĐ kế khi re-debate bằng số thật (state/budget) đạt;
  chống mở-rộng-sớm (LG-3-PHA3-gate-gd).

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `vn-orchestrator/SKILL.md` **Bước 11** (khép-vòng) | THÊM | hiện-thực `khep_vong` + 3 cổng; gọi đơn/song-vòng + PROMOTE→index (LG-9-khepvong) |
| `00-Brain/lessons.md` | THÊM (MỚI) | đơn-vòng ghi 1 dòng/vòng (§3.2); file MỚI theo LG-8-memory |
| `00-Brain/calibration.md` | SỬA | song-vòng/PASS đối-soát "phòng khuyến-nghị → kết-quả thực" (LG-2-file-calibration, LG-9-khepvong) |
| `00-Brain/decisions-log.md` | SỬA | mỗi lần leo tầng ghi quyết-định + nhãn altitude (telos/định-vị/moat/cấu-trúc) |
| `05-kho-chi-muc.md` (`cap_nhat_index_md`) | THAM-CHIẾU | cổng PROMOTE GỌI sang để ghi tài-sản + 1 dòng `_index.md` (LG-5.3-them) |
| `03b-pha1-phan-ra.md` (`cascade_sinh_lai`, `goi_PHA1`) | THAM-CHIẾU | cascade khi đổi tầng trên + cổng GIAI-ĐOẠN mở GĐ kế |
| `06-bang-tra-rule-engines.md` §6.2 | THAM-CHIẾU | bảng định-tuyến song-vòng là biểu-diễn bảng của §4.5 |
| `workflows/debate.js` (re-debate cổng GĐ) | SỬA | re-debate SỐ THẬT tại cổng GIAI-ĐOẠN dùng grounding state/budget |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Đơn-vòng dừng trước K (LG-3-PHA3-don-vong)
Cho `action` với `K=3`, vá vòng-1 chưa đạt, vá vòng-2 đạt KPI ⇒ `khep_vong` trả `pass` SAU vòng-2,
`lessons.md` có đúng 2 dòng, `tang_leo == null` (KHÔNG leo song-vòng). → fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`).

### 8.2 · Hết K → song-vòng neo đúng file (LG-3-PHA3-song-vong + định-tuyến §6.2)
Cho `action` hết `K=2` vẫn fail, tín-hiệu = "moat xói · kinh-tế-đơn-vị xấu", `state/budget` có số thật
⇒ `dinh_tuyen_tang` trả `moat`; `neo_brain_files` = `{positioning.md, products.md, budget.md}`;
`cascade_sinh_lai(moat)` được gọi. → fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`).

### 8.3 · PASS ≠ PROMOTE (LG-3-PHA3-pass + LG-3-PHA3-promote)
- 8.3a: việc đạt KPI nhưng tài-sản reuse-grade C ⇒ `pass == true` và `_index.md` KHÔNG thêm dòng.
- 8.3b: việc đạt KPI và tài-sản reuse-grade A ⇒ `pass == true` và `cap_nhat_index_md` được gọi
  đúng 1 lần (1 dòng, id chuẩn). → fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`).

### 8.4 · Cảnh-báo telos (LG-3-PHA3-warn)
Tín-hiệu suy ra tầng `telos` nhưng KHÔNG có biến-cố-thế-giới kéo dài ⇒ `khep_vong` đi `cong_ceo`
(không tự sửa `telos.md`); và bất-kỳ song-vòng nào thiếu `co_bang_chung_that` ⇒ `cong_ceo`.
→ fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`).

### 8.5 · Cổng GIAI-ĐOẠN cần số thật (LG-3-PHA3-gate-gd)
Đủ mục-tiêu GĐ nhưng `re_debate_so_that` FAIL (PMF chưa thật) ⇒ `cong_giai_doan` trả `tiep_tuc_gd`
(không lên GĐ kế). Khi re-debate PASS ⇒ `goi_PHA1(gd+1)`. → fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`).

### 8.6 · Lát Phở Hà — song-vòng → định-vị (LG-7-PHA3)
Tái-tạo SoT §7: quán-3 vẫn ế sau 2 vòng vá lịch-ca/khuyến-mãi (đơn-vòng hết K) ⇒ song-vòng đọc
`positioning.md`+`strategy.md` ⇒ tầng = **định-vị** (mặt-bằng sai đầu-cầu), KHÔNG đụng `telos`
⇒ quyết đóng/dời quán-3 (sửa `positioning.md`). Sau khi 3 quán còn lại ≥15% + cẩm-nang hoàn-chỉnh
⇒ **PASS GĐ4** + **PROMOTE** "Cẩm-nang mở-quán chuẩn" / "Bảng định-mức" / bộ-phận "BI/Báo-cáo quán"
⇒ ghi 3 dòng `_index.md` (reuse-grade A) ⇒ qua cổng tối-ưu ⇒ vào GĐ5.
→ fixture INLINE `test/loop.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`) (assert: tầng==định-vị, telos không đổi, đúng 3 dòng index, PASS GĐ4→GĐ5).

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M5 (khép-vòng đơn/song + PROMOTE→index) — sau M2 (sinh cây), theo LG-9-uutien
  (M3/M5/M6 dần). Cổng GIAI-ĐOẠN + cascade dựa M4 (gom ngược + kho).
- **Trước:** `01-nguyen-ly-va-mo-hinh-tang.md` (INV-6, neo OKR/KPI §3.3), `02-brain-schema.md`
  (file Brain mỗi tầng), `03b-pha1-phan-ra.md` (để cascade/cổng GĐ gọi lại), `05-kho-chi-muc.md`
  (để PROMOTE ghi index).
- **Sau / dùng spec này:** `03e-pha4-mo-rong.md` (bootstrap từ KHO mà cổng PROMOTE bồi),
  `06-bang-tra-rule-engines.md` (§6.2 là bảng của §4.5).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-PHA3-don-vong | §3.1, §3.2, §4.1 (ĐƠN-VÒNG), §6 INV-1 | §8.1 vá ≤K + ghi `lessons.md`, không leo |
| LG-3-PHA3-song-vong | §3.1, §4.1 (SONG-VÒNG), §4.5, §6 INV-4/INV-5 | §8.2 hết K → neo đúng file §6.2 + cascade |
| LG-3-PHA3-ceo | §4.4, §6 INV-6 | §8.4 leo/thiếu bằng-chứng → cổng CEO, không lặp mù |
| LG-3-PHA3-pass | §4.2, §6 INV-2 | §8.3 đạt KPI/OKR → PASS, không tự PROMOTE |
| LG-3-PHA3-promote | §3.3, §4.3, §6 INV-2/INV-3 | §8.3b reuse-grade A → cất KHO + 1 dòng `_index.md` |
| LG-3-PHA3-gate-gd | §4.6, §6 INV-8 | §8.5 đủ mục-tiêu → re-debate số thật → GĐ kế → PHA 1 |
| LG-3-PHA3-warn | §4.1 (luật khung), §6 INV-7 | §8.4 không đổi telos vì 1 chiến-dịch; cần bằng-chứng Brain |

## 11. OPEN-Q

- **OQ-1:** Giá-trị mặc-định của `K` (trần đơn-vòng) là bao nhiêu, và có khác theo tầng/loại việc
  không? SoT chỉ nói "≤ K vòng". Đề-xuất: `K=2-3` mức action, CEO/đội chốt; có thể neo theo nhịp §6.2.
- **OQ-2:** `re_debate_so_that` ở cổng GIAI-ĐOẠN tự-động đến đâu vs cần debate đầy-đủ 12 phòng? Hiện
  đặt ở `workflows/debate.js` (grounding state/budget) — chờ chốt ranh-giới auto/HITL như OQ-2 của `01`.
- **OQ-3:** Rubric reuse-grade (chấm A/B/C) định-nghĩa ở `05` hay `06`? Spec này chỉ GỌI; cần `05`/`06`
  chốt tiêu-chí chấm để §4.3 ổn-định.
