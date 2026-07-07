---
id: 03e-pha4-mo-rong
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 PHA 4 (dòng 402-413, bảng 3-phép-thử) + §5 (bootstrap KHO, dòng 508-515)"
covers: [LG-3-PHA4-rule, LG-3-PHA4-test1, LG-3-PHA4-test2, LG-3-PHA4-test3]
depends_on: [01-nguyen-ly-va-mo-hinh-tang, 03a-pha0-intake-stage, 03b-pha1-phan-ra, 03d-pha3-khep-vong, 05-kho-chi-muc]
milestone: M5
---

# 03e · PHA 4 Mở-rộng = đường-cong mới

> **Spec về MỞ-RỘNG có-tầng.** Vòng-đời 6 GĐ chạy trên **mỗi đường-cong**; mở-rộng KHÔNG phải
> "thêm việc" mà là **đẻ đường-cong-2** → chạy **3-phép-thử** (moat · telos · brand) để quyết
> NỚI hay ĐẺ, CÙNG-NHÀ hay BRAND-MỚI, TÊN-MẸ hay TÊN-PHỤ → **tái-nhập PHA 0/1 nhưng
> BOOTSTRAP từ KHO**. Đây là chỗ cổng PROMOTE (`03d`) "trả lãi": kho càng dày, đẻ đường sau càng rẻ.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§3 PHA 4 "Mở-rộng = đường-cong mới tái-nhập"** của SoT (dòng 402-413) +
phần **bootstrap KHO** ở §5 (dòng 508-515). Nó định **khi nào** một nhu-cầu mở-rộng kích-hoạt
đường-cong-2, **3-phép-thử** quyết-định hình-thái mở-rộng, và **cách tái-nhập** PHA 0/1 ở
chế-độ bootstrap (tra `_index.md` trước, reuse cây khối/phòng/bộ-phận sẵn).

**Trong phạm-vi (in):** mô-hình `Curve` (đường-cong) + `ExpansionDecision`; thuật-toán
`chay_3_phep_thu` → `{loai_mo_rong, nha, ten}`; thuật-toán `tai_nhap_bootstrap` (re-enter PHA 0/1
ở chế-độ KHO-first); cổng PROMOTE "trả lãi" (đo độ-rẻ giảm theo độ-dày kho); điểm-cắm vào
`03a` (intake mới của đường-cong-2) và `03b` (PHA 1C tra-kho) và `05-kho`.

**Ngoài phạm-vi (out):** cơ-chế đơn/song-vòng & PROMOTE chi-tiết (→ `03d-pha3-khep-vong.md`);
schema `_index.md` + rubric reuse/adapt/new (→ `05-kho-chi-muc.md`, `06-bang-tra-rule-engines.md`
§6.5); thuật-toán sinh cây việc & gom-ngược-lên (→ `03b-pha1-phan-ra.md`); bảng 6 GĐ
(→ `06-bang-tra-rule-engines.md` §6.1). Spec này chỉ định **luật rẽ-nhánh mở-rộng + chế-độ tái-nhập**.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `đường-cong` (LG-G-s-curve), `moat/cỗ-máy` (LG-G-moat),
`telos` (LG-G-telos), `bootstrap mồi-khởi-động` (LG-G-bootstrap), `KHO chỉ-mục` (LG-G-kho-index),
`reuse/adapt/new` (LG-G-reuse-adapt-new), `PROMOTE đạt-chuẩn-tái-dùng` (LG-G-promote),
`second-curve gieo đường kế` (LG-G-second-curve), `ambidexterity hai-tay` (LG-G-ambidexterity),
`fractal 1 brand nhiều đường-cong` (LG-G-fractal), `cash-cow bò-sữa` (LG-G-cash-cow),
`6 GĐ vòng-đời` (LG-G-lifecycle-gd).

## 3. Mô-hình dữ-liệu

### 3.1 · `Curve` (đường-cong) — đơn-vị chạy vòng-đời

Vòng-đời GĐ1-6 chạy **trên mỗi đường-cong**, không trên cả DN (LG-3-PHA4-rule). `v1` = đường đầu;
mở-rộng đẻ `v2, v3…`. Mỗi đường-cong là một bản-ghi (neo file `00-Brain/curves.md`, xem `02-brain-schema.md` LG-2-file-curves):

| Field | Kiểu | Bắt-buộc | Ý-nghĩa |
|---|---|---|---|
| `id` | string | ✓ | khóa đường-cong (vd `c1-quan-pho`, `c2-pho-goi`) |
| `dinh_vi` | string | ✓ | định-vị (đầu-cầu × cỗ-máy) của đường-cong này |
| `stage` | enum `GĐ1..GĐ6` | ✓ | GĐ hiện-tại CỦA RIÊNG đường-cong (phát-hiện động) |
| `parent_curve` | id? | – | đường-cong-mẹ đẻ ra nó (v1 = null) |
| `nha` | enum `cung_nha\|brand_moi` | ✓ | thuộc cùng pháp-nhân/nhà hay brand riêng (kết-quả phép-thử ② telos) |
| `ten_mode` | enum `ten_me\|ten_phu` | ✓ | dùng tên-mẹ hay tên-phụ (kết-quả phép-thử ③ brand equity) |
| `suc_khoe` | enum `live\|cash_cow\|ngu\|chet` | ✓ | trạng-thái đường-cong (cash-cow nuôi bet khác — LG-G-cash-cow) |

### 3.2 · `ExpansionDecision` — kết-quả 3-phép-thử

```
ExpansionDecision {
  curve_moi_id   : string,                          # id đường-cong-2 sẽ đẻ
  test_moat      : enum{chuyen_duoc, phai_boi},      # ① — chạy thẳng được? (LG-3-PHA4-test1)
  test_telos     : enum{chung, khac},               # ② — telos chung không? (LG-3-PHA4-test2)
  test_brand     : enum{giup, khong_giup},          # ③ — tên cũ giúp bán? (LG-3-PHA4-test3)
  loai_mo_rong   : enum{GĐ5_noi, GĐ6_de},           # suy từ ①
  nha            : enum{cung_nha, brand_moi},        # suy từ ②
  ten            : enum{ten_me, ten_phu},            # suy từ ③
  reentry_stage  : enum{PHA0, PHA1},                 # GĐ5-nới → tái-nhập PHA1; GĐ6-đẻ → PHA0 full
  bootstrap_from : ref(_index.md)                   # con-trỏ KHO ngành để mồi (§5)
}
```

**Bất-biến kiểu:** ba phép-thử **độc-lập** (cột "tài-sản độc-lập" của SoT) — `loai_mo_rong`,
`nha`, `ten` mỗi cái suy từ ĐÚNG một phép-thử, không trộn. `bootstrap_from ≠ null` luôn (mở-rộng
LUÔN tái-nhập ở chế-độ KHO-first, không bao giờ from-scratch — đó là điểm khác PHA 0 lần đầu).

## 4. Hành-vi / thuật-toán

### 4.1 · `chay_3_phep_thu(nhu_cau_mo_rong, brain)` — bảng quyết-định (LG-3-PHA4-test1/2/3)

Mở-rộng đến từ tín-hiệu GĐ5/GĐ6 ở `03d` (lõi chín, lời đều, cần gieo đường-cong kế —
LG-G-second-curve). Ba phép-thử **độc-lập** trả ba quyết-định **trực-giao**:

```
INPUT : nhu_cau_mo_rong   # "mở thêm chỗ/dòng/sản-phẩm X"
        brain             # telos.md · positioning.md (moat) · curves.md
OUTPUT: ExpansionDecision

func chay_3_phep_thu(nhu_cau, brain):
  d = new ExpansionDecision

  # ── ① Cỗ-máy/moat: "chạy THẲNG sang chỗ mới được?" (LG-3-PHA4-test1) ──
  d.test_moat = moat_chuyen_duoc(brain.positioning, nhu_cau) ? chuyen_duoc : phai_boi
  d.loai_mo_rong   = (d.test_moat == chuyen_duoc) ? GĐ5_noi : GĐ6_de
  d.reentry_stage  = (d.loai_mo_rong == GĐ5_noi)  ? PHA1   : PHA0   # nới = mở chi-tiết; đẻ = intake mới

  # ── ② Telos: "có CHUNG không?" (LG-3-PHA4-test2) ──
  d.test_telos = telos_chung(brain.telos, nhu_cau) ? chung : khac
  d.nha        = (d.test_telos == chung) ? cung_nha : brand_moi

  # ── ③ Uy-tín-tên / brand equity: "tên CŨ giúp bán cái MỚI?" (LG-3-PHA4-test3) ──
  d.test_brand = ten_cu_giup_ban(brain, nhu_cau) ? giup : khong_giup
  d.ten        = (d.test_brand == giup) ? ten_me : ten_phu

  d.bootstrap_from = brain.kho_index_nganh   # luôn mồi từ KHO (§5)
  return d
```

**Bảng quyết-định (chính-tắc — SoT dòng 408-410):**

| # | Phép-thử (tài-sản độc-lập) | Hỏi | `chuyển/chung/giúp` → | `phải-bồi/khác/không` → |
|---|---|---|---|---|
| ① | Cỗ-máy/moat | chạy thẳng sang chỗ mới được? | **GĐ5 nới** (`loai=GĐ5_noi`) | **GĐ6 đẻ** (`loai=GĐ6_de`) |
| ② | Telos | có chung không? | **cùng nhà** (`nha=cung_nha`) | **brand mới** (`nha=brand_moi`) |
| ③ | Uy-tín-tên (brand equity) | tên cũ giúp bán cái mới? | **tên-mẹ** (`ten=ten_me`) | **tên-phụ** (`ten=ten_phu`) |

**Edge-case:**
- Ba phép-thử KHÔNG ràng nhau: có thể `GĐ6_de` (moat phải bồi) NHƯNG `cung_nha + ten_me`
  (telos chung, tên giúp) — vd phở-gói đông-lạnh: đẻ đường mới mà vẫn brand cũ (§8).
- `phai_boi` mà CEO vẫn ép "nới" → cảnh-báo nhân-lỗi (nhân chưa-có-moat = nhân lỗi cả-đàn,
  LG-G-optimize-before-scale); quyết cuối thuộc CEO (HITL).

### 4.2 · `tai_nhap_bootstrap(decision, brain)` — tái-nhập PHA 0/1 ở chế-độ KHO-first (LG-3-PHA4-rule)

Sau khi có `ExpansionDecision`, đẻ đường-cong-2 và **tái-nhập luồng** nhưng KHÁC lần đầu ở chỗ
**bootstrap từ KHO**: tra `_index.md` TRƯỚC, reuse cây khối/phòng/bộ-phận sẵn thay vì sinh from-scratch.

```
INPUT : decision:ExpansionDecision · brain
OUTPUT: curve_moi:Curve  (+ kích pipeline 03a/03b ở chế-độ bootstrap)

func tai_nhap_bootstrap(decision, brain):
  curve = new Curve(
      id=decision.curve_moi_id, parent_curve=brain.curve_hien_tai.id,
      nha=decision.nha, ten_mode=decision.ten, suc_khoe=live)

  if decision.loai_mo_rong == GĐ5_noi:
      # NỚI: moat chuyển được → KHÔNG intake lại, vào thẳng PHA 1 mở chi-tiết GĐ5
      curve.stage = GĐ5
      ket_qua = tra_kho_va_reuse(brain.kho_index_nganh, curve)   # PHA 1C: reuse THẲNG cây sẵn
      goto 03b.PHA1(curve, mode=BOOTSTRAP, prefer=REUSE)         # (LG-3-PHA1-1C)

  else:  # GĐ6_de — moat phải bồi → đường mới thật, intake lại từ PHA 0
      curve.stage = phat_hien_stage(curve)                       # thường GĐ1-2 cho đường mới
      goto 03a.PHA0(curve, mode=BOOTSTRAP)                       # intake mới NHƯNG vẫn mồi KHO
      # → rồi 03b.PHA1 với prefer=ADAPT (đường mới ngữ-cảnh lệch ⇒ tinh-chỉnh, ít reuse thẳng)

  return curve
```

**Bất-biến vòng:** mở-rộng = **fractal** (LG-G-fractal) — đường-cong-2 chạy LẠI đúng vòng-đời
6 GĐ của riêng nó (GĐ5-nới bắt đầu ở GĐ5; GĐ6-đẻ thường khởi từ GĐ thấp). Khép vòng đầu↔cuối:
mỗi đường mới PROMOTE tài-sản về KHO (`03d`) ⇒ đường kế đẻ rẻ hơn ⇒ hệ tự bồi-đắp.

### 4.3 · Cổng PROMOTE "trả lãi" — kho càng dày, đẻ đường sau càng rẻ (LG-3-PHA4-rule, §5)

Đây là **lý-do tồn-tại** của cặp PROMOTE↔bootstrap: cổng PROMOTE ở PHA 3 (`03d`, LG-3-PHA3-promote)
nạp tài-sản đạt-chuẩn vào `_index.md`; PHA 4 RÚT chúng ra khi bootstrap. "Trả lãi" = **chi-phí
đẻ đường-cong-n+1 GIẢM theo độ-dày & độ-chuẩn của kho**:

```
chi_phi_de(curve_n) ≈ Σ_tầng (tỷ-lệ NEW × chi-phí-sinh-mới)
                       ↓ giảm khi  tỷ-lệ REUSE/ADAPT ↑  (kho dày + chỉ-mục chuẩn)
INVARIANT  "trả lãi": reuse_ratio(curve_{n+1}) ≥ reuse_ratio(curve_n)   khi kho chỉ tăng & sạch
```

Không qua cổng PROMOTE = không vào index = không có gì để bootstrap ⇒ mở-rộng quay về from-scratch
(mất lãi). Vì vậy PHA 3 promote và PHA 4 bootstrap là **một vòng kín** (khép đầu↔cuối, SoT dòng 404).

## 5. Ranh-giới generic ↔ phân-rã

Bám §1.1 SoT (LG-1.1-1: viết-một-lần-dùng-mãi = GENERIC; suy-mỗi-DN = PHÂN-RÃ).

| Mắt-xích PHA 4 | GP | Loại | Nguồn |
|---|---|---|---|
| **3-phép-thử** (3 câu hỏi moat/telos/brand) + bảng quyết-định | **GENERIC** | luật cố-định mọi DN | config |
| Luật bootstrap "tra `_index.md` trước, reuse cây sẵn" | **GENERIC** | luật reuse/adapt/new (= §6.5) | config |
| Cổng PROMOTE "trả lãi" (cơ-chế khép vòng đầu↔cuối) | **GENERIC** | luật cố-định | config |
| **Đáp-án** mỗi phép-thử (moat của DN này CHUYỂN được không?…) | **PHÂN-RÃ** | suy theo brain × nhu-cầu | suy_ra |
| `Curve` cụ-thể (định-vị, stage, nhà, tên) của đường-cong-2 | **PHÂN-RÃ** | nội-dung ô | suy_ra / ceo |
| Tài-sản KHO được bootstrap (cây bộ-phận, SOP…) | **PHÂN-RÃ** (instance) / neo canonical generic | KHO ngành | kho |

**Chốt:** PHA 4 thêm-vào layer generic đúng **3-phép-thử + luật bootstrap**; mọi đáp-án &
đường-cong cụ-thể là phân-rã — đồng-nhất với chốt LG-1.1-11.

## 6. Cổng & luật bất-biến

- **INV-1 (vòng-đời trên đường-cong):** GĐ1-6 chạy theo TỪNG `Curve`, KHÔNG theo cả DN; mở-rộng
  = đẻ `Curve` mới rồi chạy lại vòng-đời (LG-3-PHA4-rule, INV-5 của `03d` về stage-per-curve).
- **INV-2 (3-phép-thử độc-lập):** `loai_mo_rong | nha | ten` mỗi cái suy từ ĐÚNG 1 phép-thử;
  cấm suy chéo (vd dùng telos để quyết GĐ5/GĐ6) (LG-3-PHA4-test1/2/3).
- **INV-3 (luôn bootstrap-KHO):** mọi tái-nhập PHA 4 có `bootstrap_from ≠ null`; PHA 1C BẮT-BUỘC
  tra `_index.md` trước khi sinh (LG-3-PHA4-rule, LG-5.3-tra). Không from-scratch.
- **INV-4 (nới ≠ from-scratch):** `GĐ5_noi` ⇒ `reentry=PHA1, prefer=REUSE` (reuse THẲNG cây sẵn,
  bỏ qua intake); `GĐ6_de` ⇒ `reentry=PHA0` (intake mới) + `prefer=ADAPT`.
- **INV-5 (PROMOTE trả lãi):** chỉ tài-sản qua cổng PROMOTE (`03d`) mới bootstrap được; reuse_ratio
  của đường kế ≥ đường trước khi kho chỉ tăng & sạch (LG-3-PHA4-rule, LG-5.3-them).
- **Cổng cứng (HITL):** quyết đẻ brand mới / đổ vốn mở-rộng / ký pháp-nhân mới → NEED-APPROVAL ở
  main loop (LG-3-PHA2-gate-cung). 3-phép-thử AI chạy được, **quyết mở-rộng cuối thuộc CEO**.

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `00-Brain/curves.md` | TÁI-NHẬP `02-brain-schema.md` | sổ đường-cong (LG-2-file-curves); PHA 4 ghi `Curve` mới vào đây |
| `03a-pha0-intake-stage.md` PHA 0 | TÁI-NHẬP | `GĐ6_de` re-enter PHA 0 ở `mode=BOOTSTRAP` (intake đường mới) |
| `03b-pha1-phan-ra.md` PHA 1C | TÁI-NHẬP | tra-kho/gom-ngược-lên với `prefer=REUSE` (nới) / `ADAPT` (đẻ) — LG-3-PHA1-1C |
| `05-kho-chi-muc.md` (`_index.md`) | TÁI-NHẬP | nguồn bootstrap; PHA 4 = phía TRA của vòng PROMOTE↔TRA (LG-5.3-tra) |
| `03d-pha3-khep-vong.md` cổng PROMOTE | TÁI-NHẬP | phía THÊM của vòng; PHA 4 "trả lãi" cho PROMOTE (LG-3-PHA3-promote) |
| `vn-orchestrator/SKILL.md` (router GĐ) | SỬA | khi stage=GĐ5/6 → nhánh PHA 4: gọi `chay_3_phep_thu` rồi `tai_nhap_bootstrap` |
| `06-bang-tra-rule-engines.md` §6.5 | THAM-CHIẾU | rubric reuse/adapt/new mà bootstrap dùng |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Bảng quyết-định 3-phép-thử (ca đúng) — LG-3-PHA4-test1/2/3

| # | Input (moat, telos, brand) | Kỳ-vọng `{loai, nha, ten}` |
|---|---|---|
| T1 | moat chuyển ✓ · telos chung ✓ · tên giúp ✓ | `{GĐ5_noi, cung_nha, ten_me}` |
| T2 | moat phải-bồi · telos chung ✓ · tên giúp ✓ | `{GĐ6_de, cung_nha, ten_me}` |
| T3 | moat phải-bồi · telos KHÁC · tên không-giúp | `{GĐ6_de, brand_moi, ten_phu}` |
| T4 | moat chuyển ✓ · telos KHÁC | `loai=GĐ5_noi` ĐỘC-LẬP với `nha=brand_moi` (kiểm trực-giao) |

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Lát Phở Hà — 3 đường-cong (LG-7-PHA4) — link LG-3-PHA4-*

Sau khi 3 quán PASS GĐ4 & PROMOTE cây bộ-phận vào KHO (`03d`/LG-7-PHA3), nhu-cầu mở-rộng cho ra
**3 đường-cong khác hình-thái** (SoT dòng 640-641):

| Đường-cong | ① moat | ② telos | ③ brand | Quyết-định | Tái-nhập |
|---|---|---|---|---|---|
| **Mở quán 5-10** (HCM/HN) | chuyển ✓ | chung ✓ | giúp ✓ | `GĐ5_noi · cung_nha · ten_me` | PHA 1C **reuse THẲNG** cây bộ-phận + Cẩm-nang vừa PROMOTE → mở nhanh & rẻ |
| **Phở-gói đông-lạnh** (siêu-thị) | phải-bồi (SX công-nghiệp) | chung ✓ | giúp ✓ | `GĐ6_de · cung_nha · ten_me` | PHA 0 intake đường mới (brand cũ), `prefer=ADAPT` |
| **Chuỗi cà-phê** | – | KHÁC | – | `nha=brand_moi` | đường-cong riêng, brand mới |

Kiểm: (a) "mở quán 5-10" tái-nhập ở `reentry=PHA1, prefer=REUSE` (nới ≠ from-scratch, INV-4);
(b) phở-gói chứng-minh 3 phép-thử ĐỘC-LẬP (GĐ6_de mà vẫn cung_nha+ten_me, INV-2);
(c) cà-phê telos-khác ⇒ brand mới (LG-3-PHA4-test2);
(d) cả 3 đều `bootstrap_from = _index.md F&B` (INV-3) → reuse_ratio quán-5 cao hơn quán-1 ("trả lãi", INV-5).

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.3 · Bootstrap "trả lãi" (LG-3-PHA4-rule, §5)

Giả-định KHO sau GĐ4 có cây bộ-phận F&B grade-A. `tai_nhap_bootstrap` cho "mở quán-5" PHẢI cho
`reuse_ratio` cao (≥ ngưỡng) và **không sinh NEW** cho bộ-phận đã có; so với "quán-1" (kho rỗng,
toàn NEW) ⇒ chi-phí đẻ giảm rõ. Ngược lại, nếu xoá KHO (không PROMOTE) ⇒ quán-5 rơi về from-scratch.

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M5 (mở-rộng/đường-cong-kế) — sau khi pipeline + kho + khép-vòng có (M2/M4),
  theo LG-9-uutien ("M3/M5/M6 dần").
- **Trước:** `01-nguyen-ly` (tầng & vòng-đời), `03a-pha0-intake-stage` (intake re-enter),
  `03b-pha1-phan-ra` (PHA 1C tra-kho), `03d-pha3-khep-vong` (PROMOTE + stage-per-curve),
  `05-kho-chi-muc` (`_index.md` để bootstrap).
- **Sau / dùng spec này:** `09-codebase-integration-map.md` (đấu-dây router GĐ5/6 → PHA 4).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-PHA4-rule | §1, §3.1, §4.2, §4.3, §6 INV-1/3/5 | §8.2 tái-nhập bootstrap-KHO; §8.3 "trả lãi" reuse_ratio tăng |
| LG-3-PHA4-test1 | §4.1 bảng ①, §6 INV-2 | T1/T2/T3 moat chuyển→GĐ5_noi / phải-bồi→GĐ6_de; §8.2 quán-5 vs phở-gói |
| LG-3-PHA4-test2 | §4.1 bảng ②, §6 INV-2 | T3/T4 telos chung→cung_nha / khác→brand_moi; §8.2 cà-phê |
| LG-3-PHA4-test3 | §4.1 bảng ③, §6 INV-2 | T1/T3 tên giúp→ten_me / không→ten_phu; §8.2 phở-gói ten_me |

## 11. OPEN-Q

- **OQ-1:** `moat_chuyen_duoc` / `telos_chung` / `ten_cu_giup_ban` đo bằng rubric tự-động hay
  bắt-buộc debate phòng-ban (02 Chiến-lược + 12 Tăng-trưởng + 07 Marketing)? Đề-xuất: AI chấm
  sơ-bộ từ Brain, STRATEGIC luôn qua debate; CEO chốt — chờ ranh-giới auto/HITL.
- **OQ-2:** ngưỡng `reuse_ratio` để tuyên "trả lãi" và ngưỡng khớp ngữ-cảnh REUSE-thẳng (GĐ5-nới)
  vs ADAPT (GĐ6-đẻ) lấy từ rubric §6.5 — cần con-số cụ-thể cho fixture §8.3.
