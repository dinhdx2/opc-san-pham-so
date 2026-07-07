---
id: 05-kho-chi-muc
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §5 (dòng 471-518)"
covers: [LG-5.1-tree, LG-5.2-col-id, LG-5.2-col-tang, LG-5.2-col-ten-nl, LG-5.2-col-ten-nganh, LG-5.2-col-mapsto, LG-5.2-col-khia-canh, LG-5.2-col-gd, LG-5.2-col-io, LG-5.2-col-taisan, LG-5.2-col-reuse-grade, LG-5.2-col-trangthai, LG-5.2-col-nguon, LG-5.3-them, LG-5.3-tra, LG-5.3-don, LG-5.3-chuan-ten, LG-5.1-activate]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang, 04-taxonomy-generic]
milestone: M4
---

# 05 · KHO chỉ-mục

> **Spec về DANH-BẠ kho tái-dùng.** Định-nghĩa CHÍNH XÁC lược-đồ `_index.md`
> (13 cột) + cây thư-mục `knowledge/playbook/<ngành>/`, và 3 API vòng-đời
> `them()` (PROMOTE) · `tra()` (REUSE) · `don()` (deprecate). Kho chỉ "trả lãi"
> nếu **tra được** & **dọn được**; index chuẩn-hoá khóa là điều-kiện-đủ cho cả hai.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§5 "KHO chỉ-mục theo ngành"** của SoT: chuẩn-hoá **danh-bạ**
của kho tái-dùng để máy tra/thêm/dọn được. Index là một **bảng generic** (khung cột
cố-định, mọi DN/ngành dùng chung); **tài-sản** mà index trỏ tới là **phân-rã theo
ngành** (SOP/template/persona/rubric của một nhánh khối→phòng→bộ-phận cụ-thể).

**Trong phạm-vi (in):** schema CHÍNH XÁC của `_index.md` (13 cột, kiểu, bắt-buộc,
ví-dụ); cây thư-mục `knowledge/playbook/<ngành>/`; thuật-toán/API của 3 nghiệp-vụ
vòng-đời `them()/tra()/don()`; luật CHUẨN tên (kebab-case + tên-năng-lực canonical);
ranh-giới index-generic ↔ tài-sản-phân-rã; điểm-cắm vào `knowledge/playbook/` và
agent kiến-trúc.

**Ngoài phạm-vi (out):** **rubric reuse-decision** (reuse/adapt/new + cách chấm
reuse-grade A/B/C) — `tra()` chỉ **gọi** rubric đó, định-nghĩa ở `06-bang-tra-rule-engines.md`
(§6.5); **cơ-chế PROMOTE chuẩn-hoá tài-sản** (khử-danh-tính, tham-số-hoá) ở luồng
khép-vòng `03d-pha3-khep-vong.md`; cây cấu-trúc một-DN suy-ra mỗi task (`03b-pha1-phan-ra.md`).
Spec này định **danh-bạ & nghiệp-vụ trên danh-bạ**, không định **nội-dung tài-sản**.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `kho-index` (LG-G-kho-index),
`reuse-adapt-new` (LG-G-reuse-adapt-new), `reuse-grade` (LG-G-reuse-grade),
`promote` (LG-G-promote), `tên-kép` (LG-G-ten-kep), `gom-ngược-lên` (LG-G-gom-nguoc-len),
`3 tầng khối/phòng/bộ-phận` (LG-G-khoi-phong-bo-phan), `11 khía-cạnh` (LG-G-11-khia-canh),
`lifecycle GĐ` (LG-G-lifecycle-gd). Tên-năng-lực canonical & 7 khối/12 phòng lấy từ
`04-taxonomy-generic.md` (LG-4.2-*, LG-4.3-*).

## 3. Mô-hình dữ-liệu

### 3.1 · Cây thư-mục KHO (LG-5.1-tree)

> **Điều-kiện tạo nhánh (`LG-5.1-activate`):** chỉ tạo nhánh `K*/dept-*/<bộ-phận>/` khi có tài-sản **đạt reuse-grade** (qua cổng PROMOTE) — KHÔNG tạo nhánh rỗng / đầu-cơ.

Một kho-ngành là một thư-mục dưới `knowledge/playbook/`. Cây thư-mục **trùng đúng**
cây cấu-trúc khối→phòng→bộ-phận (PHA 1C) ⇒ tra-kho & sinh-cấu-trúc dùng chung một
bản-đồ. Chỉ tạo nhánh khi **có** tài-sản đạt reuse-grade (không vẽ-sẵn cây rỗng).

```
knowledge/playbook/<ngành>/
 ├── _index.md                       ← CHỈ-MỤC chuẩn-hoá (bảng khối→phòng→bộ-phận + tài-sản)
 ├── K1-quan-tri-chien-luoc/
 │   └── dept-01-governance/
 │       └── <bo-phan-slug>/         ← SOP.md · template/ · persona.md · rubric.md · meta.yaml
 ├── K4-san-pham-cong-nghe/
 │   └── dept-09-product-tech/
 │       └── ...
 └── ...                             ← chỉ tạo nhánh khi có tài-sản đạt reuse-grade
```

| Mức cây | Slug-pattern | Bắt-buộc | Ghi-chú |
|---|---|---|---|
| ngành (gốc) | `<ngành>` (kebab) | ✓ | mã ngành, đồng-bộ `pack.code` (vd `fnb`, `retail`, `tech-saas`) |
| khối | `K<n>-<ten-khoi>` | – | 1 trong 7 khối canonical (`04`: LG-4.2-K1..K7) |
| phòng | `dept-<NN>-<ten>` | – | 1 trong 12 phòng canonical (hoặc phòng pack thêm) |
| bộ-phận (lá) | `<bo-phan-slug>` | – | chứa tài-sản: `SOP.md` · `template/` · `persona.md` · `rubric.md` · `meta.yaml` |

> Lưu-ý môi-trường web: kho là **file trong repo** (git-first), đọc/ghi bằng
> `Read`/`Write`/`Glob`/`Edit`; Google Drive là tùy-chọn (LG-8-kho-asset). Sau ghi → commit/push.

### 3.2 · Lược-đồ `_index.md` — 13 cột CHÍNH XÁC (§5.2)

`_index.md` chứa **một bảng Markdown**; mỗi **dòng = một mục kho** (một bộ-phận/tài-sản
đã PROMOTE). Bảng nhẹ → đọc nhanh khi tra (không phải mở từng file tài-sản). Thứ-tự
cột cố-định như sau:

| # | Cột | Kiểu | Bắt-buộc | Ví-dụ | Claim |
|---|---|---|---|---|---|
| 1 | `id` | string khóa, định-dạng `<ngành>.<khối>.<phòng>.<bộ-phận>` (kebab, dùng `.` ngăn) | ✓ | `fnb.K5.dept-05.thu-mua-cung-ung` | LG-5.2-col-id |
| 2 | `tầng` | enum `khối\|phòng\|bộ-phận\|tài-sản` | ✓ | `bộ-phận` | LG-5.2-col-tang |
| 3 | `tên-năng-lực` | string (canonical, **khóa so-khớp** khi tra) | ✓ | `"Thu-mua & Cung-ứng"` | LG-5.2-col-ten-nl |
| 4 | `tên-ngành` | string (alias hiển-thị) | ✓ | `"Thu-mua NL bếp"` | LG-5.2-col-ten-nganh |
| 5 | `maps_to` | string canonical `K<n> / dept-<NN>` (cho phép `(+K.. / dept-..)` phụ) | ✓ | `K5 / dept-05` | LG-5.2-col-mapsto |
| 6 | `khía-cạnh` | enum 1 trong 11 khía-cạnh (`04`) | ✓ | `Hậu-cần` | LG-5.2-col-khia-canh |
| 7 | `GĐ` | string khoảng-stage `GĐ<m>` / `GĐ<m>-<n>` (1..6) | ✓ | `GĐ3-5` | LG-5.2-col-gd |
| 8 | `đầu-vào / đầu-ra` | string hợp-đồng-ngữ-cảnh `vào: … · ra: …` (để so-khớp reuse) | ✓ | `vào: nhu-cầu NL · ra: hợp-đồng NCC + giá` | LG-5.2-col-io |
| 9 | `tài-sản` | list file kèm (đường-dẫn tương-đối tới SOP/template/persona/rubric) | ✓ | `SOP.md, template/bang-gia.xlsx` | LG-5.2-col-taisan |
| 10 | `reuse-grade` | enum `A\|B\|C` (A dùng-luôn · B cần tinh-chỉnh · C tham-khảo) | ✓ | `A` | LG-5.2-col-reuse-grade |
| 11 | `trạng-thái` | enum `live\|ngủ\|deprecated` (deprecated = để DỌN) | ✓ | `live` | LG-5.2-col-trangthai |
| 12 | `nguồn · phiên-bản` | string `<task-gốc-PROMOTE> v<semver/n>` | ✓ | `2026-06-29-dam-phan-thit-bo v2` | LG-5.2-col-nguon |
| 13 | `superseded_by` | id? (trỏ mục thay-thế khi deprecated; rỗng nếu live/ngủ) | – | `fnb.K5.dept-05.thu-mua-cung-ung@v3` | (phục-vụ LG-5.3-don) |

> 12 cột bắt-buộc đến từ §5.2 SoT (LG-5.2-col-id … LG-5.2-col-nguon). Cột 13
> `superseded_by` là cột **dẫn-xuất từ luật DỌN §5.3** (LG-5.3-don yêu-cầu "trỏ
> `superseded_by`"); để cùng bảng cho 1 nguồn-sự-thật, không phát-sinh claim mới.

### 3.3 · Kiểu phụ-trợ cho API §4

```
KhoItem        { id, tang, ten_nang_luc, ten_nganh, maps_to,         # = 1 dòng _index.md
                 khia_canh, gd, io:{vao,ra}, tai_san:[path],
                 reuse_grade:enum{A,B,C}, trang_thai:enum{live,ngu,deprecated},
                 nguon, phien_ban, superseded_by:id? }
TraContext     { ten_nang_luc, khia_canh, gd, io:{vao,ra} }          # 4 khóa so-khớp (§4.2)
UngVien        { item:KhoItem, diem_khop:float, ket_luan:enum{reuse,adapt,new} } # do rubric 06 chấm
PromoteInput   { tai_san_chuan:[path], meta:{ten_nl,ten_nganh,maps_to,khia_canh,
                 gd,io,reuse_grade,nguon,phien_ban}, task_goc, qua_cong_promote:bool }
```

**Bất-biến kiểu:** `KhoItem.id` duy-nhất trong một kho-ngành; `reuse_grade ∈ {A,B,C}`;
`superseded_by ≠ null` ⟺ `trang_thai == deprecated`.

## 4. Hành-vi / thuật-toán

Ba nghiệp-vụ vòng-đời. Cả ba thao-tác trên `_index.md` (danh-bạ) + cây tài-sản; sau
mỗi nghiệp-vụ ghi file → commit/push (môi-trường web ephemeral).

### 4.1 · `them(promoteInput)` — THÊM = PROMOTE (LG-5.3-them)

Chỉ-mục là **append-only có cổng**: không qua cổng PROMOTE thì KHÔNG vào index.

```
INPUT : p:PromoteInput            # tài-sản đã chuẩn-hoá + meta + cờ qua_cong_promote
OUTPUT: KhoItem | REJECT

func them(p):
    if not p.qua_cong_promote:                       # cổng PROMOTE ở PHA 3 (rubric reuse-grade)
        return REJECT("chưa qua cổng PROMOTE — không vào index")   # (LG-5.3-them, LG-3-PHA3-promote)

    id = chuan_hoa_id(p.meta)                         # <ngành>.<khối>.<phòng>.<bộ-phận>, kebab (§6)
    assert validate_chuan_ten(id, p.meta.ten_nl)     # kebab-case + tên-năng-lực canonical (LG-5.3-chuan-ten)

    duong_dan = cay_thu_muc(p.meta)                   # knowledge/playbook/<ngành>/K*/dept-*/<bộ-phận>/
    ghi_tai_san(duong_dan, p.tai_san_chuan)           # ghi SOP/template/persona/rubric (+meta.yaml)

    item = build_KhoItem(id, p.meta, duong_dan)       # đủ 12 cột bắt-buộc, trang_thai=live
    if ton_tai(id):                                   # cùng id đã có → đây là phiên-bản mới
        cu = lay(id); cu.trang_thai = deprecated      # hạ-cấp bản cũ, GIỮ VẾT (không xoá cứng)
        cu.superseded_by = item.id_co_version         # trỏ bản thay-thế (đồng-bộ với don(), §4.3)
        item.phien_ban = tang_version(cu.phien_ban)
    chen_dong_index(item)                             # chèn 1 dòng _index.md đủ cột, id chuẩn
    commit_push()                                     # lưu bền-vững
    return item
```

**Edge-case:** thiếu bất-kỳ cột bắt-buộc nào (1–12) ⇒ REJECT (index phải đủ cột để
máy tra). `tài-sản` rỗng ⇒ REJECT (không có gì để reuse).

### 4.2 · `tra(ctx)` — TRA = REUSE (LG-5.3-tra)

So-khớp **4 khóa** rồi **gọi rubric §6.5** để xếp reuse/adapt/new + grade. `tra()`
KHÔNG tự định nghĩa rubric — chỉ cấp ứng-viên và ngữ-cảnh cho nó (ranh-giới §1).

```
INPUT : ctx:TraContext            # tên-năng-lực + khía-cạnh + GĐ + đầu-vào/ra (4 khóa)
        index = doc(_index.md)    # chỉ dòng trang_thai ∈ {live, ngủ} (bỏ deprecated)
OUTPUT: [UngVien]                 # sắp giảm theo diem_khop, kèm ket_luan của rubric

func tra(ctx, index):
    ung_vien = []
    for item in index where item.trang_thai != deprecated:        # deprecated không gợi-ý reuse
        if item.ten_nang_luc != canonical(ctx.ten_nang_luc): continue  # khóa CỨNG: tên-năng-lực canonical
        diem = w1*khop_khia_canh(item, ctx)        # 1 trong 11 (LG-5.2-col-khia-canh)
             + w2*khop_gd(item, ctx)               # khoảng-stage giao nhau (LG-5.2-col-gd)
             + w3*khop_io(item, ctx)               # hợp-đồng vào/ra (LG-5.2-col-io)
        ung_vien.append({item, diem_khop: diem})
    ung_vien.sort(desc diem_khop)

    for uv in ung_vien:                            # rubric reuse-decision: KHÔNG ở spec này
        uv.ket_luan = rubric_reuse_decision(uv, ctx)   # → reuse / adapt / new (06-bang-tra §6.5)
        # reuse: grade A + ngữ-cảnh trùng → dùng-luôn, ghi reused_from (LG-6.5-reuse)
        # adapt: grade B, lệch tham-số  → tinh-chỉnh, ghi delta để PROMOTE sau (LG-6.5-adapt)
        # new  : không có/khác hẳn      → đẻ mới; nếu tốt → ứng-viên PROMOTE (LG-6.5-new)
    return ung_vien
```

**Edge-case:** không ứng-viên nào khớp tên-năng-lực canonical ⇒ trả `[]` ⇒ caller
hiểu là **NEW** (đẻ mới). Gọi ở PHA 1C (gom ngược-lên) và PHA 4 (bootstrap đường-cong
mới) — LG-3-PHA1C, LG-3-PHA4-rule.

### 4.3 · `don(id, [superseded_by])` — DỌN = deprecate (LG-5.3-don)

DỌN là **soft-delete giữ vết**, KHÔNG xoá cứng (để truy-vết & cho calibration học).

```
INPUT : id, superseded_by?        # mục thay-thế (nếu có bản mới)
OUTPUT: KhoItem(deprecated)

func don(id, superseded_by=null):
    item = lay(id)
    item.trang_thai = deprecated                   # giữ dòng + file tài-sản (KHÔNG xoá cứng)
    item.superseded_by = superseded_by             # trỏ bản thay-thế nếu có
    cap_nhat_dong_index(item)
    commit_push()
    return item

# Bảo-trì định-kỳ (rà _index.md):
func ra_dinh_ky(index):
    gop_trung(index)                               # 2 mục trùng ngữ-cảnh → gộp, deprecate cái yếu
    for item in index:
        if calibration_cho_thay_hay_hong(item):    # dùng-lại hay lỗi (calibration.md)
            ha_cap_reuse_grade(item)               # A→B→C theo bằng-chứng thực
```

**Edge-case:** deprecate một mục đang được mục khác trỏ `superseded_by` ⇒ giữ chuỗi
phiên-bản (không cắt link). Xoá-cứng chỉ khi CEO duyệt (ranh-giới §6).

## 5. Ranh-giới generic ↔ phân-rã

Bám LG-1.1-1: viết-một-lần-dùng-mãi = GENERIC; suy-ra-mỗi-DN = PHÂN-RÃ.

| Thành-phần | GP | Loại | Nguồn | Claim |
|---|---|---|---|---|
| **Lược-đồ 13 cột `_index.md`** (khung bảng) | **GENERIC** | bảng cột cố-định, mọi ngành dùng chung | config | LG-5.2-col-* |
| **Cây thư-mục `K*/dept-*/<bộ-phận>`** (bản-đồ) | **GENERIC** | trùng cây canonical 7 khối/12 phòng | config | LG-5.1-tree |
| **Luật them/tra/don + CHUẨN tên** | **GENERIC** | luật vòng-đời cố-định | config | LG-5.3-* |
| **`tên-năng-lực` canonical** (khóa tra) | **GENERIC** | từ-điển canonical xuyên-ngành | config (`04`) | LG-4.3-ten-nang-luc |
| **Dòng index của một bộ-phận** (giá-trị 13 ô) | **PHÂN-RÃ** | suy mỗi DN/ngành khi PROMOTE | suy-ra/PROMOTE | LG-5.3-them |
| **Tài-sản** (SOP/template/persona/rubric file) | **PHÂN-RÃ theo ngành** | nội-dung một nhánh khối→phòng→bộ-phận | suy-ra | LG-8-kho-asset |
| **`tên-ngành`** (alias hiển-thị) | **PHÂN-RÃ** | nhãn ngành đọc-hiểu | suy-ra | LG-5.2-col-ten-nganh |

**Chốt:** **index = generic** (khung + khóa); **tài-sản = phân-rã theo ngành**. Index
nhẹ & chuẩn-khóa nên máy so-khớp được; cây thư-mục trùng cây cấu-trúc nên tra-kho và
sinh-cấu-trúc dùng chung một bản-đồ (SoT §5, ghi-chú "Vì sao index tách khỏi tài-sản").

## 6. Cổng & luật bất-biến

- **INV-1 (cổng PROMOTE):** chỉ `them()` qua cổng PROMOTE PHA 3 mới vào index; không
  qua cổng = không vào index (LG-5.3-them). Không bịa dòng index khi tài-sản chưa đạt rubric.
- **INV-2 (CHUẨN tên — LG-5.3-chuan-ten):** slug **kebab-case không dấu-cách**;
  `id` = `<ngành>.<khối>.<phòng>.<bộ-phận>`; `tên-năng-lực` theo **từ-điển canonical**
  (đồng-bộ 12 phòng, `04`) để khóa tra ổn-định xuyên-ngành. Vi-phạm ⇒ `them()` REJECT.
- **INV-3 (đủ 12 cột bắt-buộc):** mỗi dòng index đủ cột 1–12 (§3.2); thiếu ⇒ không tra
  được bằng máy ⇒ REJECT.
- **INV-4 (DỌN giữ-vết):** DỌN = `trạng-thái=deprecated` + `superseded_by`, KHÔNG xoá
  cứng (LG-5.3-don). Xoá-cứng là thao-tác **không hoàn-tác** ⇒ NEED-APPROVAL CEO.
- **INV-5 (deprecated không gợi-ý reuse):** `tra()` bỏ qua dòng `deprecated` khi xếp
  ứng-viên (chỉ live/ngủ), nhưng GIỮ chúng để truy-vết.
- **INV-6 (rubric ở ngoài):** `tra()` **gọi** rubric reuse-decision (`06`, §6.5) chứ
  không tự định-nghĩa; spec này không chấm reuse-grade, chỉ cấp ứng-viên + ngữ-cảnh.

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `knowledge/playbook/<ngành>/_index.md` | THÊM | tạo bảng 13 cột (§3.2) — artifact MỚI (LG-8-kho-index) |
| `knowledge/playbook/<ngành>/K*/dept-*/<bộ-phận>/` | THÊM | cây tài-sản git-first, Drive tùy-chọn (LG-8-kho-asset) |
| skill `vn-architect` **HOẶC** mở-rộng `agents/pack-architect.md` | THÊM | nhúng luật `them/tra/don` + CHUẨN tên làm luật tra-kho (LG-9-kho-index, LG-9-architect) |
| `vn-orchestrator/SKILL.md` PHA 1C (gom ngược-lên) | SỬA | gọi `tra(ctx)` để reuse/adapt/new khi suy cấu-trúc (LG-3-PHA1C) |
| `vn-orchestrator/SKILL.md` PHA 3 (khép-vòng) Bước PROMOTE | SỬA | gọi `them(promoteInput)` sau cổng PROMOTE (LG-9-khepvong) |
| `06-bang-tra-rule-engines.md` §6.5 | THAM-CHIẾU | rubric reuse-decision mà `tra()` gọi (LG-6.5-*) |
| `04-taxonomy-generic.md` | THAM-CHIẾU | từ-điển tên-năng-lực canonical + 7 khối/12 phòng (LG-4.3-*) |

> Hiện repo chỉ có `pack-architect`; `vn-architect` là skill **đề-xuất MỚI** (chưa tồn-tại)
> — khớp spec `01` §7 ("skill vn-architect HOẶC mở-rộng pack-architect"). Cây
> `knowledge/playbook/` cũng chưa tồn-tại (kho rỗng cho tới PROMOTE đầu-tiên).

## 8. Tiêu-chí chấp-nhận

### 8.1 · Round-trip thêm → tra → dọn (LG-5.3-them/tra/don)

| # | Bước | Kỳ-vọng |
|---|---|---|
| R1 | `them()` với `qua_cong_promote=false` | **REJECT** ("chưa qua cổng PROMOTE") — INV-1 |
| R2 | `them()` với input hợp-lệ (đủ 12 cột, kebab, tên-NL canonical) | OK: tài-sản ghi vào cây đúng `K*/dept-*/<bộ-phận>/` + chèn 1 dòng `_index.md` đủ cột, `id` chuẩn, `trạng-thái=live` |
| R3 | `tra(ctx)` với `ctx` khớp mục R2 | trả ≥1 `UngVien` chứa mục R2, `diem_khop` cao nhất; rubric (mock) gán `reuse`/`adapt` |
| R4 | `don(id_R2, superseded_by=…)` | mục R2 `trạng-thái=deprecated` + `superseded_by` set; dòng & file VẪN còn (giữ vết) — INV-4 |
| R5 | `tra(ctx)` lại sau R4 | KHÔNG còn gợi-ý mục R2 (deprecated bị loại) — INV-5 |
| R6 | `them()` cùng `id` (phiên-bản mới) | bản cũ tự `deprecated`+`superseded_by`→bản mới; bản mới `live`, `phiên-bản` tăng |

→ acceptance **INLINE** trong `test/kho.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Test so-khớp reuse 4-khóa (LG-5.3-tra)

Cho `_index.md` có mục `fnb.K5.dept-05.thu-mua-cung-ung` (tên-NL "Thu-mua & Cung-ứng",
khía-cạnh Hậu-cần, GĐ3-5, vào: nhu-cầu NL · ra: hợp-đồng NCC + giá, grade A):

| # | `ctx` tra | Kỳ-vọng |
|---|---|---|
| M1 | tên-NL "Thu-mua & Cung-ứng" + Hậu-cần + GĐ4 + io trùng | ứng-viên #1 = mục đó, `diem_khop` cao → rubric `reuse` (grade A) — lát Phở Hà LG-7-PHA1C ("Thu-mua ADAPT") |
| M2 | tên-NL canonical khác hẳn (vd "BI & Báo-cáo") | `[]` (không khớp khóa tên-NL) ⇒ caller hiểu **NEW** — LG-7-PHA1C "BI/Báo-cáo NEW" |
| M3 | đúng tên-NL nhưng GĐ & io lệch | vẫn là ứng-viên nhưng `diem_khop` thấp hơn ⇒ rubric thiên `adapt`/`new` |
| M4 | đúng tên-NL nhưng mục đang `deprecated` | KHÔNG xuất-hiện trong ứng-viên (INV-5) |

→ acceptance **INLINE** trong `test/kho.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.3 · Lược-đồ & cây hợp-lệ (LG-5.2-col-*, LG-5.1-tree)

- S1: parser đọc `_index.md` mẫu → 13 cột đúng tên & thứ-tự (§3.2); thiếu 1 cột
  bắt-buộc ⇒ lỗi schema.
- S2: `id` không kebab / chứa dấu-cách / tên-NL không trong từ-điển canonical ⇒
  `validate_chuan_ten` FAIL (LG-5.3-chuan-ten).
- S3: đường-dẫn tài-sản R2 nằm đúng `knowledge/playbook/<ngành>/K*/dept-*/<bộ-phận>/`
  và trùng cây cấu-trúc canonical (LG-5.1-tree).

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M4 (gom ngược-lên + kho) — theo LG-9-uutien ("M4 gom ngược + kho").
- **Trước:** `00-tong-quan-va-thuat-ngu.md` (thuật-ngữ); `01-nguyen-ly-va-mo-hinh-tang.md`
  (generic↔phân-rã, gom ngược-lên); `04-taxonomy-generic.md` (tên-năng-lực canonical,
  7 khối/12 phòng — khóa tra & cây thư-mục).
- **Sau / dùng spec này:** `03b-pha1-phan-ra.md` (PHA 1C gọi `tra()`),
  `03d-pha3-khep-vong.md` (cổng PROMOTE gọi `them()`), `03e-pha4-mo-rong.md`
  (bootstrap gọi `tra()`), `06-bang-tra-rule-engines.md` (§6.5 rubric mà `tra()` gọi).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-5.1-tree | §3.1 | §8.3 S3 tài-sản nằm đúng cây `K*/dept-*/<bộ-phận>` |
| LG-5.1-activate | §3.1 (điều-kiện tạo nhánh) | t_no_empty_branch (không nhánh rỗng) |
| LG-5.2-col-id | §3.2 cột 1 | §8.3 S1 cột `id` + S2 `id` kebab/canonical |
| LG-5.2-col-tang | §3.2 cột 2 | §8.3 S1 cột `tầng` enum khối/phòng/bộ-phận/tài-sản |
| LG-5.2-col-ten-nl | §3.2 cột 3 | §8.2 M1/M2 khóa so-khớp tên-năng-lực |
| LG-5.2-col-ten-nganh | §3.2 cột 4 | §8.3 S1 cột `tên-ngành` (alias) |
| LG-5.2-col-mapsto | §3.2 cột 5 | §8.3 S1 cột `maps_to` canonical |
| LG-5.2-col-khia-canh | §3.2 cột 6 | §8.2 M1 khớp khía-cạnh (Hậu-cần) |
| LG-5.2-col-gd | §3.2 cột 7 | §8.2 M1/M3 khớp khoảng-GĐ |
| LG-5.2-col-io | §3.2 cột 8 | §8.2 M1/M3 khớp hợp-đồng vào/ra |
| LG-5.2-col-taisan | §3.2 cột 9 | §8.1 R2 ghi tài-sản + §8.3 S1 |
| LG-5.2-col-reuse-grade | §3.2 cột 10 | §8.2 M1 grade A → reuse |
| LG-5.2-col-trangthai | §3.2 cột 11 | §8.1 R4 deprecated + §8.2 M4 |
| LG-5.2-col-nguon | §3.2 cột 12 | §8.1 R6 phiên-bản tăng |
| LG-5.3-them | §4.1, §6 INV-1 | §8.1 R1 (REJECT chưa cổng) / R2 (vào index) |
| LG-5.3-tra | §4.2, §6 INV-5/6 | §8.2 M1–M4 so-khớp 4 khóa + gọi rubric |
| LG-5.3-don | §4.3, §6 INV-4 | §8.1 R4/R5 deprecated giữ-vết + superseded_by |
| LG-5.3-chuan-ten | §6 INV-2 | §8.3 S2 kebab + tên-NL canonical |

## 11. OPEN-Q

- **OQ-1:** Trọng-số `w1/w2/w3` của `diem_khop` (§4.2) và ngưỡng chuyển reuse↔adapt↔new
  — đặt cứng ở spec này hay để rubric `06` §6.5 quyết toàn-bộ? Đề-xuất: ngưỡng thuộc
  rubric `06`; spec này chỉ xếp ứng-viên thô. Chờ chốt cùng `06-bang-tra`.
- **OQ-2:** `vn-architect` là **skill mới** hay **mở-rộng `pack-architect`**? (cùng OPEN-Q
  với spec `01` §7 / LG-9-architect). Ảnh-hưởng nơi nhúng luật `them/tra/don`.
- **OQ-3:** Quy-ước version trong `id`/`nguồn·phiên-bản` (semver `v2` vs số chạy
  `@v3`) chưa nhất-quán trong SoT — cần chốt một dạng để `superseded_by` trỏ ổn-định.
