---
id: 02-brain-schema
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §2 (dòng 266-293)"
covers: [LG-2-altitude, LG-2-file-telos, LG-2-file-positioning, LG-2-file-curves, LG-2-file-strategy, LG-2-file-products, LG-2-file-budget, LG-2-file-state, LG-2-file-headcount, LG-2-file-structure, LG-2-file-decisions, LG-2-file-calibration, LG-2-file-index, LG-2-file-asset, LG-2-gate-G0, LG-2-telos-ceo]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang]
milestone: M1
---

# 02 · Brain Schema (2 lớp)

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§2 SoT — "Brain 2 lớp, phân tầng theo nhịp"**: định-nghĩa **hợp-đồng dữ-liệu** (data contract) của toàn-bộ Brain sau khi nâng cấp. Brain cũ trộn mọi thứ vào 1 rổ phẳng 5+2 file; bản này **phân tầng theo nhịp-đổi** (altitude/tempo): `telos` đổi chậm nhất → `cấu-trúc`/`hiện-trạng` đổi nhanh nhất, và gắn **nhãn altitude** cho mỗi file để khâu khép-vòng (PHA 3) biết "leo tới tầng nào". Spec này **MỞ-RỘNG** `knowledge/brain-schema.md` hiện có — KHÔNG phá tương-thích 5 file canonical + 2 file bộ-nhớ đang chạy.

**Trong phạm-vi:** schema của 13 hạng-mục Brain (3 file MỚI ở `00-Brain/`, 5 file canonical cũ, `structure.md` MỚI, 2 file bộ-nhớ cũ-mở-rộng, 2 file KHO ở `knowledge/playbook/`); trường `stage` động trong `state.md`; cây 3 tầng + con-trỏ `reused_from` trong `structure.md`; thuật-toán nạp + validator mở-rộng; cổng **G0**; luật bất-biến "AI đề-xuất telos, CEO quyết" và "altitude/tempo".

**Ngoài phạm-vi (in spec khác):** luồng PHA 0→4 dùng các file này (→ `03*`); ngữ-nghĩa 11 khía-cạnh/7 khối/12 phòng/tên-kép bên trong `structure.md` (→ `04-taxonomy-generic.md`); schema cột `_index.md` chi-tiết + vòng-đời tài-sản KHO (→ `05-kho-chi-muc.md`); bố-cục IO/đường-dẫn vault tổng (→ `08-artifact-vault-layout.md`); rubric phát-hiện stage (→ `06-bang-tra-rule-engines.md`, dùng ở `03a`).

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md`:
- **telos** (`LG-G-telos`) — lý-do-tồn-tại cốt-lõi, hướng đuổi mãi, không phải đích đạt-rồi-xong.
- **moat / cỗ-máy** (`LG-G-moat`), **đầu-cầu/beachhead** (`LG-G-beachhead`), **mũi-nêm/wedge = điểm-xuất-phát** (`LG-G-wedge`).
- **đường-cong/s-curve** (`LG-G-s-curve`), **vòng-đời 6 GĐ** (`LG-G-lifecycle-gd`).
- **altitude/tempo** (`LG-G-altitude-tempo`) — độ-cao/nhịp quyết-định: telos đổi chậm nhất, cấu-trúc nhanh nhất.
- **3 tầng cấu-trúc** khối ▷ phòng ▷ bộ-phận (`LG-G-khoi-phong-bo-phan`); **gom-ngược-lên** (`LG-G-gom-nguoc-len`).
- **reuse/adapt/new** (`LG-G-reuse-adapt-new`), **reuse-grade A/B/C** (`LG-G-reuse-grade`), **kho-index** (`LG-G-kho-index`).
- **G0 / cổng-tỉnh-táo** (`LG-G-g0`); **single/double-loop** (`LG-G-single-double-loop`).

## 3. Mô-hình dữ-liệu

### 3.0 Năm lớp-nhịp (altitude tempo) — `LG-2-altitude`

Brain xếp theo **nhịp-đổi**, từ chậm nhất → nhanh nhất. Đây là trục sắp-xếp file VÀ là thang để PHA 3 chọn tầng leo:

| Lớp-nhịp | Nhịp-đổi | File thuộc lớp |
|---|---|---|
| **bất-biến** | chậm nhất | `00-Brain/telos.md` |
| **định-vị** | vừa | `00-Brain/positioning.md`, `00-Brain/curves.md` (danh-mục) |
| **hiện-trạng** | nhanh | `strategy.md`, `products.md`, `budget.md`, `state.md`, `headcount.md` |
| **cấu-trúc** | nhanh nhất | `00-Brain/structure.md` |
| **bộ-nhớ** | — (append-only, không phải perspective) | `decisions-log.md`, `calibration.md`, `knowledge/playbook/<ngành>/_index.md`, `knowledge/playbook/<ngành>/<asset>` |

> SoT dùng pill `bất-biến · định-vị · hiện-trạng · bộ-nhớ`; cột "Định-vị" của SoT gộp `positioning` + `curves` (danh-mục), cột "Cấu-trúc" tách riêng cho `structure.md`. Spec giữ 5 nhãn-nhịp để khép-vòng (PHA 3) ánh-xạ 1-1 với thang leo `cấu-trúc → moat(định-vị) → telos` (xem §6.3).

### 3.1 Bảng schema từng file Brain

Quy-ước cột: **đường-dẫn** (tương đối gốc repo / dưới `vault/00-Brain/` trừ khi ghi rõ) · **lớp-nhịp** · **trường bắt-buộc** · **nhãn altitude** (giá-trị enum của trường `altitude:` trong front-matter, để khép-vòng đọc máy) · **MỚI/CŨ**.

| Đường-dẫn | Lớp-nhịp | Trường bắt-buộc | Nhãn altitude | MỚI/CŨ | Claim |
|---|---|---|---|---|---|
| `00-Brain/telos.md` | bất-biến | `telos` (1 câu lý-do-tồn-tại) · `values[]` (giá-trị) · `boundaries[]` (ranh-giới = cái DN **KHÔNG** làm) | `telos` | **MỚI** | LG-2-file-telos |
| `00-Brain/positioning.md` | định-vị | `beachhead` (đầu-cầu) · `wedge` (điểm-xuất-phát) · `moat` (cỗ-máy/hào) | `dinh-vi` | **MỚI** | LG-2-file-positioning |
| `00-Brain/curves.md` | định-vị (danh-mục) | `curves[]`, mỗi dòng KD: `{ name, positioning, engine(moat), stage(GĐ1..6), health }` | `dinh-vi` | **MỚI** | LG-2-file-curves |
| `strategy.md` | hiện-trạng | vision · ICP · positioning · **thị-trường/đối-thủ** (+ mission/USP/go-to-market giữ từ schema cũ) | `hien-trang` | CŨ | LG-2-file-strategy |
| `products.md` | hiện-trạng | catalog (danh-mục SP/DV) · unit-economics (giá, biên gộp, AOV, ROAS hòa-vốn) | `hien-trang` | CŨ | LG-2-file-products |
| `budget.md` | hiện-trạng | ngân-sách · dòng-tiền · doanh-thu · chi-phí · phân-bổ vốn | `hien-trang` | CŨ | LG-2-file-budget |
| `state.md` | hiện-trạng | hiện-trạng · KPI hiện-tại · rủi-ro nổi-cộm · **`stage`** (trường MỚI, phát-hiện động — §3.2) | `hien-trang` | **CŨ+** | LG-2-file-state |
| `headcount.md` | hiện-trạng | nhân-sự · cơ-cấu · kế-hoạch tuyển | `hien-trang` | CŨ | LG-2-file-headcount |
| `00-Brain/structure.md` | cấu-trúc | cây **khối → phòng → bộ-phận** (suy-ra) · **tên-kép** mỗi nút · lịch kích-hoạt theo GĐ · con-trỏ **`reused_from`** mỗi đơn-vị tái-dùng (§3.3) | `cau-truc` | **MỚI** | LG-2-file-structure |
| `decisions-log.md` | bộ-nhớ | append-only; mỗi mục: `{ id, decision, status(locked/superseded), `**altitude**` ∈ telos/dinh-vi/moat/cau-truc }` | (n/a — gắn `altitude` per-mục) | **CŨ+** | LG-2-file-decisions |
| `calibration.md` | bộ-nhớ | append-only; mỗi mục: phòng khuyến-nghị → kết-quả thực | (n/a) | CŨ | LG-2-file-calibration |
| `knowledge/playbook/<ngành>/_index.md` | bộ-nhớ (KHO) | **CHỈ-MỤC KHO**: bảng chuẩn-hoá khối→phòng→bộ-phận của ngành (cột chi-tiết → `05-kho-chi-muc.md`) | (n/a) | **MỚI** | LG-2-file-index |
| `knowledge/playbook/<ngành>/<asset>` | bộ-nhớ (KHO) | **kho tài-sản** đạt-chuẩn reuse-grade (git-first, Drive tùy-chọn); cấu-trúc thư-mục/grade → `05` | (n/a) | **MỚI** | LG-2-file-asset |

> **Tương-thích ngược (CŨ):** 5 file canonical (`strategy/products/budget/state/headcount`) GIỮ ý-nghĩa hiện có trong `knowledge/brain-schema.md`; `state.md` chỉ **thêm** trường `stage` (`CŨ+`), `decisions-log.md` chỉ **thêm** trường `altitude` per-mục (`CŨ+`). Không đổi tên, không bỏ trường cũ. Bí-danh cũ `finance.md`/`market.md` vẫn KHÔNG dùng.

### 3.2 Trường `stage` động trong `state.md` — `LG-2-file-state`

- `stage` ∈ `{ GĐ1, GĐ2, GĐ3, GĐ4, GĐ5, GĐ6 }` (vòng-đời 6 GĐ, `LG-G-lifecycle-gd`).
- **Phát-hiện động, KHÔNG mặc-định GĐ1** (đồng-bộ `LG-8-hientrang`): giá-trị do PHA 0 suy ra qua 3 lớp (khai-báo CEO → đối-chiếu bằng-chứng `state/budget.md` → reality-check); rubric câu-sống-còn nằm ở `06-bang-tra-rule-engines.md`, luồng ở `03a-pha0-khoi-tao.md`.
- Ghi kèm **nhãn grounding** theo `brain-schema.md`: `[số thật DN]` / `[benchmark ngành — cần CEO xác minh]` / `[cần CEO xác minh]`; stage suy từ số thật trong Brain, không bịa.
- Nếu DN nhiều đường-cong: `state.md.stage` là stage của đường-cong **đang vận-hành chính**; stage **theo từng đường-cong** sống ở `curves[].stage` (`curves.md`).

### 3.3 Cây 3 tầng + `reused_from` trong `structure.md` — `LG-2-file-structure`

- **Cây 3 tầng** (`LG-G-khoi-phong-bo-phan`): `khối` (7 canonical) ▷ `phòng` (12 canonical) ▷ `bộ-phận` (lá). Cây này là **kết-quả gom-ngược-lên** ở CUỐI PHA 1 (`LG-G-gom-nguoc-len`), không phải nhập tay từ đầu.
- Mỗi nút mang **tên-kép** (3 nhãn: tên-ngành + tên-năng-lực-chuẩn + ánh-xạ canonical `maps_to` K*/dept-*); ngữ-nghĩa đầy-đủ ở `04-taxonomy-generic.md`.
- Mỗi nút có **`activation`** = lịch kích-hoạt theo GĐ (nút thức ở stage nào).
- Mỗi **đơn-vị tái-dùng** (lấy từ KHO) PHẢI ghi con-trỏ **`reused_from`** trỏ về id tài-sản trong `_index.md` (id chuẩn `<ngành>.<khối>.<phòng>.<bộ-phận>` — xem `05`). Đơn-vị đẻ-mới để trống `reused_from` (ứng-viên PROMOTE sau).

Lược-đồ tối-thiểu một nút (YAML/Markdown trong `structure.md`):
```yaml
- block: K3                      # khối canonical
  dept: dept-06                  # phòng canonical (maps_to)
  unit: "Quầy đặt-món online"    # bộ-phận (lá), tên-ngành
  capability: "order-capture"   # tên-năng-lực-chuẩn (khóa tra KHO)
  activation: [GĐ3, GĐ4]         # lịch kích-hoạt theo GĐ
  reused_from: "pho.K3.dept-06.order-capture@v2"   # con-trỏ KHO; rỗng nếu NEW
```

## 4. Hành-vi / thuật-toán

### 4.1 Thuật-toán nạp Brain (load)

Mở-rộng bước "Validator (orchestrator chạy trước fan-out)" của `brain-schema.md`. Đọc bằng `Read`/`Glob` (web-vault, KHÔNG MCP Obsidian).

```
function loadBrain():
  # --- Lớp hiện-trạng: 5 file canonical cũ (giữ nguyên hành vi) ---
  canon = readAll([strategy, products, budget, state, headcount])  # dưới vault/00-Brain/
  coverage5 = count(file ∈ canon: tồn-tại AND nội-dung-thực)        # 0..5

  # --- Lớp mới: 3 file 00-Brain mới + structure ---
  telos       = read(00-Brain/telos.md)         # optional khi chạy debate lần đầu
  positioning = read(00-Brain/positioning.md)
  curves      = read(00-Brain/curves.md)
  structure   = read(00-Brain/structure.md)

  # --- Bộ-nhớ ---
  decisions = read(decisions-log.md); lockedDecisions = filter(status==locked)
  calibration = read(calibration.md)

  # --- KHO theo ngành (nếu đã onboard) ---
  index = read(knowledge/playbook/<ngành>/_index.md)   # optional

  return BrainContext{ canon, coverage5, telos, positioning, curves,
                       structure, lockedDecisions, calibration, index,
                       stage = state.stage }
```

- `lockedDecisions` nạp vào `brainContext` mục "QUYẾT ĐỊNH ĐÃ CHỐT — KHÔNG bàn lại" (giữ cơ-chế hiện có).
- Ghi 1 dòng tóm-tắt độ-đầy-đủ vào `brainContext` (mở-rộng "Brain coverage: X/5" → thêm "+telos/+positioning/+curves/+structure: có/thiếu").

### 4.2 Validator (mở-rộng validator hiện có 5/5 file)

Giữ nguyên 4 quy-tắc 5-file của `brain-schema.md`, **thêm** kiểm lớp mới (non-blocking trừ G0):

```
function validateBrain(B):
  # (1) GIỮ NGUYÊN luật 5 canonical cũ:
  if B.coverage5 < 3 OR thiếu(strategy.md) OR thiếu(state.md):
      → PAUSE 1, gợi-ý CEO chạy /vn-onboard           # luật cũ
  if 1 ≤ (5 - B.coverage5) ≤ 2: ghi-chú thiếu; tiếp-tục # luật cũ

  # (2) MỚI — kiểm trường bắt-buộc từng file nếu file tồn-tại:
  for f in [telos, positioning, curves, structure, state]:
      if f tồn-tại: assert mọi trường-bắt-buộc(f) ở §3.1 có-mặt & không-rỗng
                    else → cảnh-báo "FILE_INCOMPLETE: <f> thiếu <trường>"

  # (3) MỚI — state.stage:
  if state tồn-tại AND state.stage absent:
      → cảnh-báo "STAGE_MISSING — PHA 0 phải phát-hiện stage, KHÔNG mặc-định GĐ1"
  if state.stage ∉ {GĐ1..GĐ6}: → lỗi "STAGE_INVALID"

  # (4) MỚI — structure.reused_from trỏ id hợp-lệ:
  for node in structure.tree:
      if node.reused_from set AND not existsInIndex(node.reused_from):
          → cảnh-báo "REUSE_DANGLING"

  # (5) MỚI — cổng G0 (chỉ khi PHA 0 / có telos):
  runGateG0(B)     # §4.3
```

Validator **phân-cấp mức**: `lỗi` (chặn build/test), `cảnh-báo` (ghi-chú, tiếp-tục), `PAUSE` (hỏi CEO). Tương-thích: nếu CHỈ có 5 file cũ + chưa có file mới → validator vẫn chạy xanh ở luật (1), chỉ phát cảnh-báo "lớp sinh-thành chưa thiết-lập".

### 4.3 Cổng G0 — `LG-2-gate-G0`

G0 = **cổng-tỉnh-táo** (`LG-G-g0`): kiểm **telos mạch-lạc** + **cơ-hội có-vẻ-thật** TRƯỚC khi đổ công-sức xuống các tầng dưới (phân-rã PHA 1+).

```
function runGateG0(B):
  # tiền-điều-kiện: đã có đề-xuất telos (AI đề-xuất) + đã được CEO quyết (§6.1)
  assert B.telos.telos present AND B.telos.approved_by == "CEO"   # LG-2-telos-ceo

  coherent = checkCoherent(B.telos, B.positioning, B.curves)
    # mạch-lạc: telos ↔ values ↔ boundaries không mâu-thuẫn;
    #           positioning/curves nằm TRONG ranh-giới telos
  plausible = checkPlausible(B.positioning, B.state, B.budget)
    # cơ-hội có-vẻ-thật: đầu-cầu + moat khả-tín so bằng-chứng state/budget (số thật)

  if NOT (coherent AND plausible):
      → BLOCK PHA 1; trả lý-do cụ-thể; quay lại CEO chỉnh telos/positioning
  else: PASS → cho phép chiều-sinh đi xuống
```

- **Edge-case:** telos mơ-hồ/đa-nghĩa (vd "làm điều tốt") → `coherent=false` → G0 chặn (xem test §8). Cơ-hội chỉ dựa benchmark, thiếu số thật DN → `plausible` hạ mức → cảnh-báo "cần số thật để qua G0".
- G0 KHÔNG dùng `AskUserQuestion` trong Workflow nền; nếu cần CEO chỉnh → trả về main loop (HITL).

## 5. Ranh-giới generic ↔ phân-rã

| Phần | Loại | Vì sao |
|---|---|---|
| **Bộ 5 lớp-nhịp + nhãn altitude** (§3.0) | **generic** (bảng cố-định) | viết-một-lần, mọi DN dùng chung thang nhịp/leo. |
| **Danh-sách trường bắt-buộc mỗi file** (§3.1) | **generic** (schema/contract) | hợp-đồng dữ-liệu cố-định; code đọc theo trường. |
| **Cây 3 tầng canonical 7 khối/12 phòng** làm KHUNG `structure.md` | **generic** | neo canonical cố-định (chi-tiết `04`). |
| **Logic G0, logic validator, luật `stage∈GĐ1..6`** | **generic** | luật/cổng cố-định cho mọi DN. |
| **Giá-trị bên trong file** (telos câu gì, beachhead nào, curves nào, stage cụ-thể, cây bộ-phận, `reused_from` nào) | **phân-rã** | suy-ra mỗi DN/ngành; không hard-code. |

> Khớp `LG-1.1-1`: khung/bảng/luật = GENERIC; nội-dung ô = PHÂN-RÃ. `telos` là PHÂN-RÃ và **người quyết** (`LG-1.1-6`).

## 6. Cổng & luật bất-biến

### 6.1 "AI đề-xuất telos, CEO quyết" — `LG-2-telos-ceo` (bất-biến)

- **AI ĐƯỢC:** đề-xuất bản-thảo telos/values/boundaries từ bằng-chứng Brain + đối-thoại CEO.
- **AI KHÔNG ĐƯỢC:** tự chốt telos. Lý-do: telos chứa "cái AI không có" — *ta thật-sự quan-tâm & chịu-đựng vì gì*. Đây thuộc nhóm ranh-giới CỨNG cần CEO duyệt (đồng-bộ HITL của CLAUDE.md & `LG-1.1-6`).
- **Hệ-quả schema:** `telos.md` mang trường `approved_by` (phải = "CEO") + `proposed_by: AI`; G0 (§4.3) **assert** điều này trước khi PASS. Đảo telos → ghi mục mới ở `decisions-log.md` nhãn `altitude: telos`, status `superseded` cho mục cũ (giữ vết, không xóa).

### 6.2 Altitude tempo — `LG-2-altitude` (luật bất-biến)

- Brain phân tầng theo nhịp-đổi: `telos` đổi **chậm nhất**, `cấu-trúc`/`hiện-trạng` đổi **nhanh nhất** (§3.0).
- **Invariant khép-vòng:** một biến-cố chỉ được leo lên đúng tầng theo bằng-chứng; "chạy đúng vẫn èo-uột" mới chạm telos (đồng-bộ `LG-3-PHA3-warn` ở spec `03d`). `decisions-log.md` gắn `altitude` để truy "quyết-định này thuộc tầng nào".

### 6.3 Ánh-xạ nhãn-nhịp → thang leo khép-vòng (pre/post-condition cho `03d`)

`cấu-trúc → định-vị(moat) → telos`; lớp `hiện-trạng` là **bằng-chứng nền** (state/budget số thật) để biết tầng nào vỡ, không phải tầng leo. (Tham-chiếu, không phủ claim ở spec này.)

## 7. Giao-diện & điểm-cắm code

**Điểm cắm chính = MỞ-RỘNG `knowledge/brain-schema.md`** (loại: **SỬA/THÊM**, GIỮ tương-thích 5 file cũ + 2 file bộ-nhớ). Cụ-thể:

| Hạng-mục | File/điểm cắm | Loại |
|---|---|---|
| Bảng 13 hạng-mục + 5 lớp-nhịp + nhãn altitude | `knowledge/brain-schema.md` (thêm mục "Brain 2 lớp") | THÊM |
| Giữ "5 file canonical" + "File bộ-nhớ" + "grounding" hiện có | `knowledge/brain-schema.md` mục cũ | GIỮ |
| Trường `stage` trong `state.md` | `knowledge/brain-schema.md` (mô-tả) + đọc tại `vn-orchestrator/SKILL.md` Bước 2-3 (`LG-9-stage`) | THÊM |
| Cây 3 tầng + `reused_from` (`structure.md`) | `knowledge/brain-schema.md` + cắm taxonomy `04` + KHO `05` | THÊM |
| Validator mở-rộng (§4.2) + G0 (§4.3) | mô-tả ở `brain-schema.md`; chạy tại `vn-orchestrator/SKILL.md` (trước fan-out) | THÊM/SỬA |
| Nhãn `altitude` per-mục trong `decisions-log.md` | `knowledge/brain-schema.md` mục "File bộ-nhớ" | SỬA (CŨ+) |
| `_index.md` + `<asset>` KHO | `knowledge/playbook/<ngành>/` (schema chi-tiết ở `05`) | THÊM |

> Đồng-bộ `LG-9-brain`: "3 file Brain mới + structure(3 tầng) + stage → mở-rộng `knowledge/brain-schema.md`". KHÔNG tạo file schema mới song-song; tất-cả đắp vào file hiện có để 5 file cũ vẫn đọc đúng.

## 8. Tiêu-chí chấp-nhận

Fixture đặt ở `specs/tools/` hoặc `test/fixtures/` (thống-nhất với `08`). Mỗi test trả pass/fail máy-đọc.

| # | Test | Kỳ-vọng |
|---|---|---|
| T1 | **Validator — đủ file:** Brain có cả 5 canonical + telos/positioning/curves/structure đầy-đủ trường | validator xanh; `brainContext` ghi "coverage 5/5 +telos/+positioning/+curves/+structure: có". |
| T2 | **Validator — thiếu file then-chốt:** bỏ `state.md` (hoặc `strategy.md`) | PAUSE 1, gợi-ý `/vn-onboard` (luật cũ giữ nguyên). |
| T3 | **Validator — thiếu file mới:** chỉ 5 file cũ, chưa có telos/structure | xanh ở luật 5-file + cảnh-báo "lớp sinh-thành chưa thiết-lập" (tương-thích ngược). |
| T4 | **Trường bắt-buộc thiếu:** `telos.md` thiếu `boundaries` | cảnh-báo `FILE_INCOMPLETE: telos thiếu boundaries`. |
| T5 | **stage:** `state.md` không có `stage` → cảnh-báo `STAGE_MISSING`; `stage: GĐ9` → lỗi `STAGE_INVALID`; `stage: GĐ4` → hợp-lệ. | đúng 3 nhánh. |
| T6 | **reused_from:** nút `structure` trỏ id không có trong `_index.md` | cảnh-báo `REUSE_DANGLING`. |
| T7 | **G0 chặn telos mơ-hồ:** telos = "làm điều tốt" (đa-nghĩa, không ranh-giới) | G0 `coherent=false` → BLOCK PHA 1 + lý-do. |
| T8 | **G0 chặn cơ-hội không-thật:** positioning/moat không khớp số thật `state/budget` | G0 `plausible=false` → BLOCK + "cần số thật". |
| T9 | **G0 + telos-ceo:** `telos.approved_by != CEO` | G0 BLOCK (assert §6.1). |
| T10 | **G0 PASS:** telos mạch-lạc + cơ-hội có-vẻ-thật + CEO-approved | PASS → cho phép chiều-sinh PHA 1. |

**Lát Phở Hà liên-quan** (golden, chi-tiết ở `07-fixture-pho-ha.md`): `state.md.stage` khai GĐ5 nhưng bằng-chứng `budget` (quán-3 6%, quán-4 chưa hòa-vốn) → reality-check hạ về GĐ4 (`LG-7-PHA0`); `structure.md` ghi 4/5 bộ-phận có `reused_from`, 1 (BI/Báo-cáo) rỗng = NEW (`LG-7-PHA1C`). Spec này chỉ cung-cấp **schema** đỡ các giá-trị đó; assertion end-to-end thuộc `07`.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** **M1** (telos + altitude) là ưu-tiên cao nhất theo `LG-9-uutien`; phần `structure`/`reused_from` + `_index` nghiêng M2/M4.
- **Spec phải có trước:** `00-tong-quan-va-thuat-ngu.md` (thuật-ngữ), `01-nguyen-ly-va-mo-hinh-tang.md` (generic/phân-rã, altitude, gom-ngược-lên).
- **Spec dùng spec này:** `03a-pha0-khoi-tao.md` (G0 + phát-hiện stage), `03d-pha3-khep-vong.md` (thang leo altitude), `04-taxonomy-generic.md` (tên-kép trong structure), `05-kho-chi-muc.md` (`_index`/asset + `reused_from`), `08-artifact-vault-layout.md` (IO).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-2-altitude | §3.0, §6.2 | T1 (lớp-nhịp gắn nhãn altitude), thang leo §6.3 |
| LG-2-file-telos | §3.1 (hàng telos) | T4 (trường bắt-buộc), T7/T9 (qua G0) |
| LG-2-file-positioning | §3.1 (hàng positioning) | T1, T8 |
| LG-2-file-curves | §3.1 (hàng curves) | T1 (trường `curves[]`) |
| LG-2-file-strategy | §3.1 (hàng strategy) | T1, T2 (then-chốt) |
| LG-2-file-products | §3.1 (hàng products) | T1 |
| LG-2-file-budget | §3.1 (hàng budget) | T1, T8 (bằng-chứng plausible) |
| LG-2-file-state | §3.1, §3.2 | T2, T5 (stage), T1 |
| LG-2-file-headcount | §3.1 (hàng headcount) | T1 |
| LG-2-file-structure | §3.1, §3.3 | T1, T6 (reused_from) |
| LG-2-file-decisions | §3.1 (hàng decisions), §6.1, §6.2 | T1 (nhãn altitude per-mục) |
| LG-2-file-calibration | §3.1 (hàng calibration) | T1 |
| LG-2-file-index | §3.1 (hàng _index) | T6 (id KHO hợp-lệ) |
| LG-2-file-asset | §3.1 (hàng asset) | T1 (tồn-tại KHO; grade ở `05`) |
| LG-2-gate-G0 | §4.3 | T7, T8, T9, T10 |
| LG-2-telos-ceo | §6.1, §4.3 (assert) | T9 |

## 11. OPEN-Q

1. Nhãn `altitude` của file dùng enum 5 giá-trị `telos/dinh-vi/danh-muc/hien-trang/cau-truc` (theo lớp-nhịp) hay 4 giá-trị khớp `decisions-log` (`telos/dinh-vi/moat/cau-truc`)? — đề-xuất: file dùng 5 (lớp-nhịp), `decisions-log` giữ 4 (tầng leo); cần CEO chốt để check-coverage/validator dùng nhất-quán.
2. `curves.md` so với `state.md.stage`: khi 1 đường-cong → có nên ép `state.stage == curves[0].stage` (ràng-buộc cứng) hay chỉ cảnh-báo lệch? — đề-xuất: cảnh-báo.
3. Trường `health` trong `curves[]` để enum (xanh/vàng/đỏ) hay tự-do? — chờ `06` chốt rubric sức-khoẻ.
