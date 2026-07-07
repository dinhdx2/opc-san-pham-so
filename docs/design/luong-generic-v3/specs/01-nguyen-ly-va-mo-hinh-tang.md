---
id: 01-nguyen-ly-va-mo-hinh-tang
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §1 (dòng 187-265)"
covers: [LG-1.1-1, LG-1.1-2, LG-1.1-3, LG-1.1-4, LG-1.1-5, LG-1.1-6, LG-1.1-7, LG-1.1-8, LG-1.1-9, LG-1.1-10, LG-1.1-11, LG-1.2-dn, LG-1.2-up, LG-1.3-rule, LG-1.3-muc-dich, LG-1.3-muc-tieu, LG-1.3-nv-chinh, LG-1.3-nv-con, LG-1.3-vd-pod, LG-1.4-L1, LG-1.4-L2, LG-1.4-L3, LG-1.4-gate, LG-1.4-neo, LG-1.4-vd]
depends_on: [00-tong-quan-va-thuat-ngu]
milestone: M2
---

# 01 · Nguyên-lý & Mô-hình tầng

> **Spec quan-trọng nhất về LUẬT VALIDATE.** Định-nghĩa chuỗi tầng telos→cấu-trúc,
> phép-thử đúng-tầng (chống nén tầng) và cơ-chế sinh nhiệm-vụ-chính 3 lớp.
> Mọi spec sinh cây việc (`03b-pha1-phan-ra.md`) và mọi bảng-tra (`06-bang-tra-rule-engines.md`)
> đều trỏ ngược về các luật ở đây.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§1 "Nguyên-lý nền"** của SoT: ba luật khung mà toàn hệ phải nắm
trước khi đọc luồng — (1.1) ranh-giới **GENERIC ↔ PHÂN-RÃ**, (1.2) **hai chiều** của
trục dọc (chiều-sinh đi xuống · khép-vòng đi lên), (1.3) **phép-thử đúng-tầng**, và
(1.4) **cơ-chế sinh nhiệm-vụ-chính 3 lớp + cổng nghiệm + neo đo**.

**Trong phạm-vi (in):** kiểu dữ-liệu của chuỗi tầng; thuật-toán `validate_dung_tang`;
thuật-toán `sinh_nhiem_vu_chinh` (Lớp1→Lớp2→Lớp3→cổng→neo); bảng phân-loại
generic↔phân-rã ở mức từng mắt-xích.

**Ngoài phạm-vi (out):** nội-dung 11 khía-cạnh và bảng ánh-xạ khía-cạnh→phòng (→ `04-taxonomy-generic.md`);
6 bảng-tra GĐ/leo-tầng/mẫu-mục-tiêu/lưới-3-lớp/reuse-decision (→ `06-bang-tra-rule-engines.md`);
luồng PHA sinh cây thật (→ `03b-pha1-phan-ra.md`); khép-vòng vận-hành (→ `03d-pha3-khep-vong.md`).
Spec này chỉ định **luật & kiểu**, không định **dữ-liệu của một DN cụ-thể**.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `telos` (LG-G-telos), `điều-kiện-đủ` (LG-G-dieu-kien-du),
`gom-ngược-lên` (LG-G-gom-nguoc-len), `back-test` (LG-G-back-test), `pre-mortem` (LG-G-pre-mortem),
`3 chiều tấn/thủ/hậu` (LG-G-tancong-phongthu-haucan), `OKR/KPI` (LG-G-okr-kpi),
`single/double-loop` (LG-G-single-double-loop), `cascade` (LG-G-cascade), `MECE` (LG-G-mece),
`11 khía-cạnh` (LG-G-11-khia-canh), `3 tầng cấu-trúc khối/phòng/bộ-phận` (LG-G-khoi-phong-bo-phan).

## 3. Mô-hình dữ-liệu

### 3.1 · Chuỗi tầng (tier chain)

Trục dọc sinh ra một **chuỗi 7 mắt-xích** theo thứ-tự suy-ra (chiều-sinh):

```
telos → mục-đích-GĐ → mục-tiêu → nhiệm-vụ-chính → nhiệm-vụ-con → (gom ngược) bộ-phận → phòng → khối
```

Mỗi mắt-xích là một **Tier item** với khung field chung sau (code đọc trực-tiếp):

| Field | Kiểu | Bắt-buộc | Ý-nghĩa |
|---|---|---|---|
| `tang` | enum `telos\|muc_dich\|muc_tieu\|nv_chinh\|nv_con\|bo_phan\|phong\|khoi` | ✓ | mắt-xích trong chuỗi |
| `ten` | string | ✓ | nhãn hiển-thị (tiếng Việt, dạng-ngôn-ngữ phải khớp `dang_ngon_ngu`) |
| `dang_ngon_ngu` | enum `cau_song_con\|trang_thai\|dong_tu\|nguyen_tu\|danh_tu_cau_truc` | ✓ | dạng câu BẮT-BUỘC của tầng (xem §3.2) — khóa của `validate_dung_tang` |
| `gp` | enum `generic\|phan_ra` | ✓ | cố-định (config tĩnh) hay suy-ra mỗi DN (xem §5) |
| `nguon` | enum `config\|brain\|suy_ra\|ceo` | ✓ | nơi giá-trị đến: bảng generic / file Brain / thuật-toán / CEO quyết |
| `parent_id` | id? | – | mắt-xích trên (telos không có) |

### 3.2 · Ràng-buộc `dang_ngon_ngu` theo tầng (§1.3)

| `tang` | `dang_ngon_ngu` hợp-lệ | `gp` | `nguon` | Dạng câu mẫu |
|---|---|---|---|---|
| `telos` | `cau_song_con` (lý-do-tồn-tại, hướng đuổi mãi) | phan_ra | ceo | "Đưa phở Việt ra thế-giới" |
| `muc_dich` | `cau_song_con` (1 câu, vì-sao GĐ tồn-tại) | generic | config (khoác chữ DN) | "Chứng-minh / Đạt được X" |
| `muc_tieu` | `trang_thai` (KHÔNG mở-đầu động-từ, đo đạt/chưa) | phan_ra | suy_ra | "Hạ-tầng thu tiền **sẵn-sàng**" |
| `nv_chinh` | `dong_tu` (mở-đầu ĐỘNG-TỪ + đối-tượng) | phan_ra | suy_ra | "**Thiết-lập** luồng thanh-toán" |
| `nv_con` | `nguyen_tu` (bước cụ-thể, kiểm-chứng được, có chiều tấn/thủ/hậu) | phan_ra | suy_ra | "Mở PayPal + KYC" |
| `bo_phan`/`phong`/`khoi` | `danh_tu_cau_truc` (danh-từ tổ-chức, gom ngược-lên) | phan_ra | suy_ra (neo canonical generic) | "Bộ-phận Thu-mua" |

### 3.3 · Kiểu phụ-trợ cho §1.4

```
DieuKienDu      { id, mo_ta:string, da_dat:bool, do_brain:ref }      # điều-kiện ĐỒNG-THỜI
NhiemVuChinh    { id, ten:dong_tu, chieu:enum{tan,thu,hau},          # 1 nhiệm-vụ-chính
                  khia_canh:[1..11], dong_dieu_kien:ref(DieuKienDu), # điều-kiện nó đóng
                  thuoc_do:{loai:enum{okr,kpi_nguong}, gia_tri} }    # neo đo (§1.4-neo)
MucTieu         { id, ten:trang_thai, khia_canh:int,                 # = STATE đích
                  dieu_kien_du:[DieuKienDu], nhiem_vu_chinh:[NhiemVuChinh] }
```

**Bất-biến kiểu:** `MucTieu.ten` phải là `trang_thai`; mọi `NhiemVuChinh.ten` phải là `dong_tu`;
mỗi `NhiemVuChinh` BẮT-BUỘC có `dong_dieu_kien ≠ null` và `thuoc_do ≠ null` (chống việc-ma, §1.4-neo).

## 4. Hành-vi / thuật-toán

### 4.1 · `validate_dung_tang(item)` — phép-thử đúng-tầng (§1.3)

Lỗi cốt-lõi cần chặn: **nhét một VIỆC (động-từ) vào ô mục-tiêu**. Quy-tắc vàng:
**mở-đầu bằng ĐỘNG-TỪ ⇒ VIỆC (nhiệm-vụ); ngược lại ⇒ TRẠNG-THÁI (mục-tiêu)** (LG-1.3-rule).

```
INPUT : item:TierItem            # có .tang, .ten, .dang_ngon_ngu
OUTPUT: {ok:bool, ly_do:string}

func validate_dung_tang(item):
    bat_dau_dong_tu = test_dong_tu(item.ten)   # NLP/heuristic: token đầu là động-từ hành-động?

    switch item.tang:

      case muc_dich:                            # LG-1.3-muc-dich
          # câu-sống-còn 1 câu; KHÔNG ép động-từ (cho phép "Chứng-minh/Đạt được X")
          if not la_mot_cau(item.ten): return FAIL("mục-đích phải là 1 câu-sống-còn")
          return OK

      case muc_tieu:                            # LG-1.3-muc-tieu (LUẬT then-chốt)
          if bat_dau_dong_tu:
              return FAIL("mục-tiêu mở-đầu bằng ĐỘNG-TỪ ⇒ đây là nhiệm-vụ-chính, NÉN TẦNG")
          if not bieu_dat_trang_thai(item.ten): # phải đo được "đạt/chưa"
              return FAIL("mục-tiêu phải là TRẠNG-THÁI đo đạt/chưa (vd '… sẵn-sàng')")
          return OK

      case nv_chinh:                            # LG-1.3-nv-chinh
          if not bat_dau_dong_tu:
              return FAIL("nhiệm-vụ-chính phải mở-đầu bằng ĐỘNG-TỪ + đối-tượng")
          return OK

      case nv_con:                              # LG-1.3-nv-con
          if not la_nguyen_tu_kiem_chung(item.ten):
              return FAIL("nhiệm-vụ-con phải nguyên-tử, kiểm-chứng được")
          return OK

      case telos:
          if not nguon_la_ceo(item): return FAIL("telos do CEO quyết, AI không tự đặt")
          return OK

      case bo_phan|phong|khoi:
          if bat_dau_dong_tu:
              return FAIL("tầng cấu-trúc phải là DANH-TỪ tổ-chức")
          return OK
```

**Edge-case:**
- Động-từ-hoá danh-từ ("Vận-hành" như danh-từ vs động-từ) → ưu-tiên ngữ-cảnh tầng;
  khi mơ-hồ ở tầng `muc_tieu`, đòi cụm trạng-thái rõ ("… đã/được/sẵn-sàng").
- Câu rỗng / nhiều câu ở `muc_dich` → FAIL (phải đúng 1 câu).

### 4.2 · `sinh_nhiem_vu_chinh(muc_tieu)` — cơ-chế 3 lớp (§1.4)

Nhiệm-vụ-chính KHÔNG liệt tự-do; sinh theo kỷ-luật để **bao-quát đủ, không sót, không trùng**.
Tầng nhắc: 11 khía-cạnh chống-sót ở tầng **mục-tiêu**; 3 chiều chống-sót ở tầng **nhiệm-vụ-con**;
mục này lấp đúng tầng **mục-tiêu → tập nhiệm-vụ-chính**.

```
INPUT : muc_tieu:MucTieu          # .ten là TRẠNG-THÁI (state); đã qua validate_dung_tang
        brain                     # hiện-trạng DN (state.md/budget.md…) để biết điều-kiện nào CHƯA đạt
OUTPUT: tap_nvc:[NhiemVuChinh]    # tối-thiểu, không-trùng, mỗi cái có neo đo

func sinh_nhiem_vu_chinh(muc_tieu, brain):

  # ── Lớp 1 · SINH — bẻ state → chuỗi điều-kiện-đủ ĐỒNG-THỜI (LG-1.4-L1) ──
  dk = be_state_thanh_dieu_kien_du(muc_tieu)      # "state TỰ-ĐỘNG đúng khi NHỮNG đk nào đồng-thời?"
  for d in dk:
      d.da_dat = doi_chieu_brain(d, brain)        # so hiện-trạng (khoảng-cách hiện-trạng→đích)
  tap_nvc = [ tao_nvc(d) for d in dk if not d.da_dat ]   # mỗi đk CHƯA đạt → 1 nhiệm-vụ-chính (động-từ)

  # ── Lớp 2 · SOI — lưới 3 chiều tại tầng nhiệm-vụ-chính (LG-1.4-L2) ──
  # tấn = TẠO state · thủ = GIỮ state khỏi sụp (pre-mortem "hỏng kiểu gì?") · hậu = CẤP nguồn-lực
  for chieu in [tan, thu, hau]:
      if khong_co_viec_chieu(tap_nvc, chieu):
          dk_moi = sinh_dieu_kien_du_cho_chieu(muc_tieu, chieu)   # vd thủ: pre-mortem
          dk += dk_moi
          tap_nvc += [ tao_nvc(d, chieu) for d in dk_moi if not doi_chieu_brain(d, brain) ]
          # chiều trống ⇒ bổ-sung điều-kiện-đủ ⇒ VÒNG LẠI Lớp 1

  # ── Lớp 3 · QUÉT-NGANG — đối-chiếu chéo 11 khía-cạnh (LG-1.4-L3) ──
  for asp in 11_khia_canh:
      if dat_state_dung_cham(muc_tieu, asp) and chua_co_viec_cho(tap_nvc, asp):
          dk_cheo = sinh_dieu_kien_du_xuyen_khia_canh(muc_tieu, asp)  # vd Tiền đụng Hậu-cần/Dữ-liệu
          dk += dk_cheo
          tap_nvc += [ tao_nvc(d) for d in dk_cheo if not doi_chieu_brain(d, brain) ]

  # ── Cổng nghiệm — ĐỦ · TỐI-THIỂU · KHÔNG-TRÙNG (LG-1.4-gate) ──
  if not back_test_du(tap_nvc, muc_tieu):     # mọi việc done → state TỰ-ĐỘNG đúng?
      goto Lớp 1                              # còn sót → bẻ thêm điều-kiện
  for v in tap_nvc:                           # tối-thiểu: bỏ 1 việc, state còn đạt → thừa
      if back_test_du(tap_nvc \ {v}, muc_tieu): canh_bao_thua(v); tap_nvc.remove(v)
  tap_nvc = gop_trung(tap_nvc)                # không-trùng: 2 việc chồng → gộp

  # ── Neo đo (chống việc-ma) — LG-1.4-neo ──
  for v in tap_nvc:
      assert v.dong_dieu_kien != null                       # (a) điều-kiện-đủ nó đóng
      v.thuoc_do = (v.chieu == tan) ? OKR(v) : KPI_nguong(v) # (b) OKR tấn / KPI thủ+hậu
      if v.dong_dieu_kien == null: cat(v)                   # không neo được = thừa/sai-tầng → cắt

  return tap_nvc
```

**Bất-biến vòng lặp:** Lớp 2 và Lớp 3 chỉ THÊM điều-kiện rồi quay về Lớp 1 để sinh việc tương-ứng;
cổng nghiệm là điều-kiện THOÁT (back-test đủ + đã trim thừa + đã gộp trùng). Thuật-toán hội-tụ vì
tập điều-kiện-đủ của một state là hữu-hạn.

## 5. Ranh-giới generic ↔ phân-rã

Bảng phân-loại từng mắt-xích (§1.1). **GENERIC = config tĩnh viết-một-lần-dùng-mãi
(khung/bảng/luật); PHÂN-RÃ = suy-ra mỗi DN (nội-dung ô)** — LG-1.1-1.

| Mắt-xích | GP | Loại config | Nguồn | Claim |
|---|---|---|---|---|
| 6 GĐ · 11 khía-cạnh · 3 chiều · 7 khối/12 phòng · 4 ngả · luật tra-kho | **GENERIC** | bảng + luật cố-định, mọi DN dùng chung | config | LG-1.1-2, LG-1.1-3 |
| Cổng lọc "khía-cạnh X có lý-do tồn-tại ở GĐ này?" | **GENERIC** (câu hỏi) / phân-rã (đáp-án) | câu hỏi cố-định | config / DN | LG-1.1-4 |
| Cổng tra-kho "tầng này KHO đã có & khớp ngữ-cảnh?" | **GENERIC** (luật reuse/adapt/new) / phân-rã (tài-sản) | luật cố-định | config / ngành | LG-1.1-5 |
| `telos` | **PHÂN-RÃ** | — | CEO quyết (AI không tự đặt) | LG-1.1-6 |
| `mục-đích GĐ` | **GENERIC theo GĐ** | = câu-hỏi-sống-còn của GĐ, chỉ khoác chữ DN | config | LG-1.1-7 |
| `mục-tiêu` | **PHÂN-RÃ** | outcome đo-được, suy theo khía-cạnh × DN | suy-ra | LG-1.1-8 |
| `nhiệm-vụ-chính` · `nhiệm-vụ-con` | **PHÂN-RÃ** | khung 3 chiều generic; nội-dung phân-rã | suy-ra | LG-1.1-9 |
| `bộ-phận · phòng · khối` (cấu-trúc) | **PHÂN-RÃ** | neo 7 khối/12 canonical generic; gom cây tùy việc | suy-ra | LG-1.1-10 |

**Chốt (LG-1.1-11):** chỉ **khung + 6 bảng tra + 2 luật (lọc khía-cạnh, tra-kho) + `mục-đích-GĐ`**
là generic; **`mục-tiêu` trở xuống đến tận cây khối/phòng/bộ-phận đều phân-rã.**

## 6. Cổng & luật bất-biến

- **INV-1 (chống nén tầng):** `muc_tieu` không được mở-đầu động-từ; `nv_chinh` phải mở-đầu động-từ
  (LG-1.3-rule). `validate_dung_tang` là cổng chặn TRƯỚC khi ghi item vào cây.
- **INV-2 (telos do người):** `telos.nguon == ceo`; AI chỉ đề-xuất (LG-1.1-6).
- **INV-3 (neo đo bắt-buộc):** mọi `NhiemVuChinh` có `dong_dieu_kien` + `thuoc_do`; thiếu ⇒ cắt (LG-1.4-neo).
- **INV-4 (cổng nghiệm):** tập nhiệm-vụ-chính phải qua ĐỦ (back-test) · TỐI-THIỂU · KHÔNG-TRÙNG (LG-1.4-gate).
- **INV-5 (chiều-sinh):** cấu-trúc (bộ-phận→phòng→khối) là KẾT-QUẢ gom NGƯỢC-LÊN ở CUỐI,
  không vẽ-sẵn rồi nhét việc (LG-1.2-dn).
- **INV-6 (khép-vòng có tầng):** đơn-vòng (vá tại-chỗ) trước; hết K vòng mới song-vòng leo tầng
  + NEO BRAIN; đổi tầng trên ⇒ cascade sinh-lại nhánh dưới; tài-sản đạt chuẩn ⇒ nhập KHO (LG-1.2-up).
  (Cơ-chế vận-hành chi-tiết ở `03d-pha3-khep-vong.md`.)

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `vn-orchestrator/SKILL.md` Bước 7 (sinh cây việc) | SỬA | gọi `validate_dung_tang` + `sinh_nhiem_vu_chinh` (LG-9-taskgen) |
| prompt `vn-architect` (hoặc mở-rộng `pack-architect`) | THÊM | nhúng pseudocode §4 làm luật phân-rã (LG-9-architect) |
| `knowledge/brain-schema.md` | SỬA | thêm 11 khía-cạnh + 7 khối canonical làm bảng generic (LG-9-taxonomy) |
| `workflows/debate.js` pha Red-team | SỬA | cổng nghiệm back-test/tối-thiểu/không-trùng làm phản-biện (LG-9-gate-optimize) |
| `06-bang-tra-rule-engines.md` | THAM-CHIẾU | lưới Lớp1/2/3 + cổng + neo (LG-6.4-*) là biểu-diễn bảng của §4.2 |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Unit-test `validate_dung_tang` (ca đúng/sai)

| # | Input (`tang`, `ten`) | Kỳ-vọng |
|---|---|---|
| T1 | `muc_tieu`, "Hạ-tầng NHẬN thanh-toán sẵn-sàng & hợp-lệ" | **OK** (trạng-thái) |
| T2 | `muc_tieu`, "Thông luồng thanh-toán US" | **FAIL** (động-từ ⇒ nén tầng) — ca sai nổi-tiếng của SoT |
| T3 | `nv_chinh`, "Thiết-lập luồng thanh-toán xuyên-biên" | **OK** (động-từ) |
| T4 | `nv_chinh`, "Hạ-tầng thu tiền sẵn-sàng" | **FAIL** (không động-từ) |
| T5 | `muc_dich`, "Chứng-minh có khách trả tiền lặp-lại" | **OK** (câu-sống-còn) |
| T6 | `nv_con`, "Mở PayPal + KYC" | **OK** (nguyên-tử) |
| T7 | `telos`, ten bất-kỳ, `nguon≠ceo` | **FAIL** (telos do CEO) |

→ acceptance **INLINE** trong `test/tier.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Tái-tạo ví-dụ POD "tiền" (LG-1.3-vd-pod + LG-1.4-vd)

Cho `muc_tieu` = "Hạ-tầng NHẬN thanh-toán từ khách Mỹ **sẵn-sàng & hợp-lệ** — không bị chặn/giữ tiền"
và `brain` = hiện-trạng chưa có cổng thanh-toán quốc-tế. `sinh_nhiem_vu_chinh` PHẢI cho ra
**đúng 4 nhiệm-vụ-chính** (không thừa, không thiếu):

| # | Nhiệm-vụ-chính (động-từ) | Chiều | Khía-cạnh | Điều-kiện-đủ nó đóng |
|---|---|---|---|---|
| ① | Thiết-lập PayPal Biz + Payoneer | 🗡 tấn | Tiền | có cổng nhận tiền hoạt-động |
| ② | Hoàn-tất pháp-nhân & KYC xuyên-biên | 🗡 tấn | Rủi-ro | pháp-nhân/KYC hợp-lệ |
| ③ | Thiết-lập tuân-thủ policy chống giữ payout | 🛡 thủ | Rủi-ro | tiền không bị freeze |
| ④ | Dựng luồng rút + đối-soát số | 📦 hậu | Dữ-liệu·Hậu-cần | rút & đối-soát về VND được |

Kiểm thêm: ① là MỘT nhiệm-vụ-chính (LG-1.3-vd-pod), nhiệm-vụ-con 3 chiều của nó =
{tấn: mở PayPal+KYC · thủ: đọc policy tránh giữ payout · hậu: giấy-tờ pháp-nhân, tài-khoản nhận}.

### 8.3 · Back-test bỏ việc-④ ⇒ FAIL (LG-1.4-gate)

`back_test_du({①②③}, muc_tieu)` PHẢI trả **false** ("tiền kẹt trên cổng, chưa rút được");
do đó ④ KHÔNG bị trim ở bước tối-thiểu → giữ. Đảo lại, `back_test_du({①②③④}, muc_tieu) == true`.

### 8.4 · 3 chiều phủ đủ (LG-1.4-L2)

Tập {①②③④} có ≥1 việc mỗi chiều tấn/thủ/hậu ⇒ Lớp 2 không bổ-sung thêm (không sót loại việc).

→ acceptance **INLINE** trong `test/tier.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (debate stage-aware + 11 khía-cạnh/7 khối) — theo LG-9-uutien.
- **Trước:** `00-tong-quan-va-thuat-ngu.md` (thuật-ngữ).
- **Sau / dùng spec này:** `03b-pha1-phan-ra.md` (chạy thuật-toán sinh cây),
  `04-taxonomy-generic.md` (11 khía-cạnh/7 khối mà Lớp 3 quét), `06-bang-tra-rule-engines.md`
  (lưới Lớp1/2/3 + reuse), `03d-pha3-khep-vong.md` (đơn/song-vòng của §1.2-up).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-1.1-1 | §5 | §8.2 phân-loại đúng generic↔phân-rã của mắt-xích |
| LG-1.1-2 | §5 | §8 bảng §5 liệt 6 trục generic |
| LG-1.1-3 | §5 | §8 bảng §5 dòng "6 GĐ…cố-định" |
| LG-1.1-4 | §5 | §8 dòng cổng-lọc (câu hỏi generic, đáp-án phân-rã) |
| LG-1.1-5 | §5 | §8 dòng cổng-tra-kho (luật generic, tài-sản phân-rã) |
| LG-1.1-6 | §3.2, §6 INV-2 | T7 telos `nguon≠ceo` ⇒ FAIL |
| LG-1.1-7 | §3.2, §5 | §8 mục-đích-GĐ = generic-theo-GĐ |
| LG-1.1-8 | §3.2, §5 | T1 mục-tiêu = trạng-thái phân-rã |
| LG-1.1-9 | §3.3, §5 | §8.2 nhiệm-vụ-chính/con phân-rã, khung 3 chiều generic |
| LG-1.1-10 | §3.2, §5 | §8 dòng cấu-trúc phân-rã, neo canonical generic |
| LG-1.1-11 | §5 chốt | §8 bảng §5 ranh-giới mục-tiêu-trở-xuống = phân-rã |
| LG-1.2-dn | §6 INV-5 | §8.2 cấu-trúc gom NGƯỢC-LÊN (kiểm thứ-tự sinh) |
| LG-1.2-up | §6 INV-6 | §8 luật đơn/song-vòng + cascade + nhập-KHO |
| LG-1.3-rule | §4.1, §6 INV-1 | T2/T4 động-từ ⇒ việc; trạng-thái ⇒ mục-tiêu |
| LG-1.3-muc-dich | §3.2, §4.1 | T5 mục-đích = câu-sống-còn |
| LG-1.3-muc-tieu | §3.2, §4.1 | T1/T2 mục-tiêu = trạng-thái, fail nếu động-từ |
| LG-1.3-nv-chinh | §3.2, §4.1 | T3/T4 nhiệm-vụ-chính = động-từ |
| LG-1.3-nv-con | §3.2, §4.1 | T6 nhiệm-vụ-con nguyên-tử |
| LG-1.3-vd-pod | §8.2 | §8.2 POD "tiền": mục-tiêu→1 nvc→3 nvcon |
| LG-1.4-L1 | §4.2 Lớp1 | §8.2 bẻ state → 4 điều-kiện-đủ → 4 nvc |
| LG-1.4-L2 | §4.2 Lớp2 | §8.4 phủ đủ 3 chiều tấn/thủ/hậu |
| LG-1.4-L3 | §4.2 Lớp3 | §8.2 việc④ xuyên Dữ-liệu·Hậu-cần (quét chéo) |
| LG-1.4-gate | §4.2 cổng | §8.3 bỏ ④ ⇒ back-test FAIL |
| LG-1.4-neo | §3.3, §4.2 neo, §6 INV-3 | §8.2 mỗi nvc gắn điều-kiện + OKR(tấn)/KPI(thủ/hậu) |
| LG-1.4-vd | §8.2 | §8.2 POD "tiền" → 4 điều-kiện → 4 nvc đúng nhãn |

## 11. OPEN-Q

- **OQ-1:** `test_dong_tu` dựa NLP tiếng Việt hay danh-sách động-từ + heuristic vị-trí? (danh-từ động-từ-hoá
  như "Vận-hành" gây nhập-nhằng). Đề-xuất: từ-điển động-từ hành-động + cờ tầng; CEO/đội kỹ-thuật chốt ngưỡng.
- **OQ-2:** Lớp 2 pre-mortem ("hỏng kiểu gì?") tự-động đến đâu vs cần debate phòng-ban? Hiện đặt ở
  `workflows/debate.js` pha Red-team (LG-9-gate-optimize) — chờ chốt ranh-giới auto/HITL.
