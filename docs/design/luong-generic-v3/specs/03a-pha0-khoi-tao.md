---
id: 03a-pha0-khoi-tao
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 PHA 0 (dòng 300-344) + §2 G0 (dòng 290) + §6.1 (dòng 526-537) + §9 LG-9-stage"
covers: [LG-3-PHA0-vao, LG-3-PHA0-ra, LG-3-PHA0-gate, LG-3-PHA0-stage1, LG-3-PHA0-stage2, LG-3-PHA0-stage3]
depends_on: [00-tong-quan-va-thuat-ngu, 02-brain-schema, 06-bang-tra-rule-engines]
milestone: M2
---

# 03a · PHA 0 Khởi-tạo & Phát-hiện stage

> **Cổng đầu vào của cả luồng.** PHA 0 biến **khai-báo CEO** thành **Brain 2 lớp**
> rồi **phát-hiện stage HIỆN-TẠI** (không mặc-định GĐ1) bằng thuật-toán 3 lớp
> (khai-báo → đối-chiếu bằng-chứng → reality-check), qua **cổng G0**, trước khi
> chiều-sinh được phép đi xuống PHA 1. Điểm chống lỗi cốt-lõi: **chặn "tưởng GĐ5"**
> (mở-rộng-sớm) NGAY từ intake.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **PHA 0** trong §3 SoT: Vào · Ra · Cổng của pha đầu, và **thuật-toán
phát-hiện stage 3 lớp**. Output của PHA 0 là **stage hiện-tại theo từng đường-cong**
(`state.md.stage` cho đường-cong chính, `curves[].stage` cho từng dòng KD) — đầu-vào
bắt-buộc cho PHA 1 phân-rã.

**Trong phạm-vi (in):** hợp-đồng Vào (khai-báo CEO) / Ra (Brain 2 lớp); thuật-toán
`phat_hien_stage` 3 lớp (lớp khai-báo · lớp đối-chiếu bằng-chứng bằng rubric câu-sống-còn
§6.1 · lớp reality-check cross-exam); luật "không mặc-định GĐ1" + "stage theo từng
đường-cong"; framing của **cổng G0 tại PHA 0** và luật chống "tưởng GĐ5"; điểm-cắm vào
`vn-orchestrator/SKILL.md` Bước 2-3.

**Ngoài phạm-vi (in spec khác):** schema chi-tiết 13 hạng-mục Brain + trường `stage` +
**cơ-chế nội-tại của `runGateG0`** (→ `02-brain-schema.md` §3.2, §4.3 — spec này CHỈ trỏ
tới và đặt G0 vào vị-trí PHA 0); bảng **rubric phát-hiện stage** dạng generic
(→ `06-bang-tra-rule-engines.md` §6.1 — spec này GỌI rubric, không định-nghĩa lại);
luồng phân-rã sinh cây việc sau khi có stage (→ `03b-pha1-phan-ra.md`); 3-phép-thử
mở-rộng đường-cong mới (→ `03e-pha4-mo-rong.md`).

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `telos` (LG-G-telos), `đầu-cầu` (LG-G-beachhead),
`điểm-xuất-phát/mũi-nêm` (LG-G-wedge), `moat/cỗ-máy` (LG-G-moat), `đường-cong` (LG-G-s-curve),
`vòng-đời 6 GĐ` (LG-G-lifecycle-gd), `PMF` (LG-G-pmf), `optimize-before-scale`
(LG-G-optimize-before-scale), `cổng-tỉnh-táo G0` (LG-G-g0), `HITL` (LG-G-hitl).
Schema các file Brain & trường `stage`: `02-brain-schema.md`. Rubric câu-sống-còn theo GĐ
& dấu-hiệu nhận biết: `06-bang-tra-rule-engines.md` §6.1.

## 3. Mô-hình dữ-liệu

### 3.1 · Hợp-đồng Vào — khai-báo CEO (`LG-3-PHA0-vao`)

PHA 0 **Vào = khai-báo CEO** (§3 SoT dòng 336). Khai-báo là input thô do người nhập,
gồm tối-thiểu:

| Field | Kiểu | Bắt-buộc | Ý-nghĩa | Nguồn |
|---|---|---|---|---|
| `mo_ta_dn` | string | ✓ | DN + ngành (vd "chuỗi 4 quán phở Bắc TP.HCM, mở 2 năm") | CEO |
| `tinh_trang_khai` | string | ✓ | tình-trạng hiện-tại CEO tự nói (vd "DT ~1.2 tỷ/tháng") | CEO |
| `stage_khai` | enum `GĐ1..GĐ6`? | – | stage CEO TỰ nhận (vd "sẵn-sàng GĐ5") — **chỉ là khai-báo, chưa phải sự-thật** | CEO |
| `y_dinh` | string | – | ý-định/mong-muốn (vd "mở 10 quán/12 tháng, có NĐT rót vốn") | CEO |

> Khai-báo KHÔNG được tin ngay: `stage_khai` là **giả-thuyết của người**, phải qua
> lớp 2-3 đối-chiếu số thật. Đây là lý-do PHA 0 có 3 lớp chứ không 1 lớp.

### 3.2 · Hợp-đồng Ra — Brain 2 lớp + stage (`LG-3-PHA0-ra`)

PHA 0 **Ra = Brain 2 lớp** (§2 SoT). Spec `02-brain-schema.md` định-nghĩa schema đầy-đủ;
ở đây chỉ chốt **những trường PHA 0 BẮT-BUỘC sinh ra**:

| Artifact | Trường PHA 0 chốt | Spec schema |
|---|---|---|
| `00-Brain/telos.md` | telos (AI đề-xuất, CEO quyết) + giá-trị + ranh-giới | `02` §3.1 / LG-2-file-telos |
| `00-Brain/positioning.md` | đầu-cầu · điểm-xuất-phát · moat | `02` §3.1 / LG-2-file-positioning |
| `00-Brain/curves.md` | mỗi dòng KD: `{name, positioning, engine, stage, health}` | `02` §3.1 / LG-2-file-curves |
| `state.md` | trường **`stage`** = stage HIỆN-TẠI (đường-cong chính), kèm nhãn grounding | `02` §3.2 / LG-2-file-state |

**Bất-biến Ra:** `state.md.stage` ∈ `{GĐ1..GĐ6}`, **phát-hiện động**, KHÔNG mặc-định GĐ1
(LG-8-hientrang). DN nhiều đường-cong → `state.md.stage` là đường-cong đang vận-hành
chính; stage **theo từng đường-cong** sống ở `curves[].stage` (§3 SoT dòng 336: "stage
theo từng đường-cong").

## 4. Hành-vi / thuật-toán — phát-hiện stage 3 lớp

Bảng 3 lớp (§3 SoT dòng 339-343) ánh-xạ thành thuật-toán `phat_hien_stage`. **Ý-tưởng cốt:
số nói thật hơn nhãn** → lớp khai-báo chỉ cho giả-thuyết; lớp bằng-chứng & reality-check
mới quyết stage thật.

```
INPUT : khai_bao        # §3.1 (có stage_khai có-thể-rỗng)
        brain           # state.md + budget.md + curves.md (số thật, đã có nhãn grounding)
OUTPUT: { stage_thuc:GĐ, stage_theo_duong_cong:[{curve, stage}], canh_bao:[..] }

func phat_hien_stage(khai_bao, brain):

  # ── Lớp 1 · KHAI-BÁO (LG-3-PHA0-stage1) ──
  # CEO nói tình-trạng hiện-tại (vd "4 quán, DT 1.2 tỷ/tháng, muốn mở rộng").
  # Vì sao: DN cũ vào hệ ở GĐ GIỮA — không bắt khởi-động lại từ GĐ1.
  stage_gia_thuyet = khai_bao.stage_khai          # có-thể rỗng → suy hoàn-toàn từ lớp 2

  # ── Lớp 2 · ĐỐI-CHIẾU BẰNG-CHỨNG (LG-3-PHA0-stage2) ──
  # Đọc state/budget.md → suy stage bằng RUBRIC câu-sống-còn §6.1.
  # Vì sao: số nói thật hơn nhãn.
  for curve in brain.curves:
      bc = doc_bang_chung(curve, brain.state, brain.budget)   # số thật/đường-cong
      curve.stage_suy = rubric_cau_song_con(bc)               # §6.1: GĐ = câu-sống-còn nào CHƯA trả xong
  stage_bang_chung = stage_cua(brain.curve_chinh)             # đường-cong vận-hành chính

  # ── Lớp 3 · REALITY-CHECK (LG-3-PHA0-stage3) ──
  # Cross-exam: stage khai-báo VS stage bằng-chứng + tiêu-chí cổng GĐ.
  # Vì sao: người hay TƯỞNG mình ở GĐ5 trong khi chưa qua PMF/tối-ưu.
  if stage_gia_thuyet != null AND stage_gia_thuyet > stage_bang_chung:
      # khai cao hơn bằng-chứng → CHẶN "tưởng GĐ5" (xem §6)
      ly_do = cross_exam(stage_gia_thuyet, stage_bang_chung, brain)
              # vd "khai GĐ5 nhưng cổng tối-ưu GĐ4 CHƯA qua: quán-3 biên 6%, quán-4 chưa hòa-vốn"
      canh_bao += BLOCK_MO_RONG_SOM(ly_do)
      stage_thuc = stage_bang_chung               # bằng-chứng THẮNG nhãn
  else:
      stage_thuc = stage_bang_chung               # luôn lấy bằng-chứng làm gốc

  return { stage_thuc,
           stage_theo_duong_cong = [{c.name, c.stage_suy} for c in brain.curves],
           canh_bao }
```

**Luật cốt-lõi:**
- **Bằng-chứng > nhãn:** `stage_thuc` LUÔN suy từ số thật (lớp 2); `stage_khai` chỉ dùng để
  PHÁT-HIỆN lệch (lớp 3), không bao giờ ghi đè bằng-chứng.
- **Không mặc-định GĐ1:** nếu Brain có số → suy đúng GĐ4-6 cho DN cũ; chỉ DN chưa-có-gì
  mới ra GĐ1 (rubric §6.1 dòng GĐ1: "chưa rõ vấn-đề / chưa có sản-phẩm").
- **Theo từng đường-cong:** mỗi `curve` có stage riêng (`curves[].stage`); một DN có thể
  GĐ6 ở lõi và GĐ1 ở đường-cong mới.

**Edge-case:**
- `stage_khai` rỗng → bỏ lớp 3 so-lệch, lấy thẳng `stage_bang_chung`.
- Thiếu số thật (chỉ benchmark / `[cần CEO xác minh]`) → hạ độ-tin; cảnh-báo
  "cần số thật để chốt stage" (đồng-bộ luật grounding `02` §3.2), KHÔNG đoán GĐ cao.
- Khai THẤP hơn bằng-chứng (khai GĐ3, số cho GĐ4) → không chặn nhưng ghi cảnh-báo
  để re-debate; bằng-chứng vẫn thắng.

## 5. Ranh-giới generic ↔ phân-rã

| Phần | Loại | Vì sao |
|---|---|---|
| Khung 3 lớp phát-hiện stage (khai-báo→bằng-chứng→reality-check) | **GENERIC** | quy-trình cố-định mọi DN dùng chung |
| Rubric câu-sống-còn 6 GĐ (§6.1) + dấu-hiệu nhận biết | **GENERIC** | bảng-tra tĩnh (`06-bang-tra-rule-engines.md`) |
| Cổng G0 (câu hỏi telos mạch-lạc? cơ-hội có-vẻ-thật?) | **GENERIC** (câu hỏi) | luật cố-định; đáp-án tùy DN |
| `telos`, `đầu-cầu`, `moat`, số thật, **stage thực** | **PHÂN-RÃ** | nội-dung từng DN (suy từ Brain / CEO quyết telos) |

## 6. Cổng & luật bất-biến

### 6.1 · Cổng G0 tại PHA 0 (`LG-3-PHA0-gate`)

PHA 0 **Cổng = G0** (§3 SoT dòng 336; §2 SoT dòng 290). G0 = **cổng-tỉnh-táo**: kiểm
**telos mạch-lạc** + **cơ-hội có-vẻ-thật** TRƯỚC khi đổ công-sức xuống PHA 1. Cơ-chế
`runGateG0` (telos `approved_by` mở-đầu `"CEO"` → `checkCoherent` → `checkPlausible` → PASS/BLOCK)
định-nghĩa ở `02-brain-schema.md` §4.3 — spec này CHỈ đặt G0 vào **vị-trí cuối PHA 0**:
chạy SAU khi Brain + stage đã sinh, là điều-kiện THOÁT của PHA 0.

- **POST-condition PHA 0:** `runGateG0(B) == PASS` **VÀ** `state.stage` đã phát-hiện hợp-lệ
  → mới cho chiều-sinh xuống PHA 1. G0 BLOCK → quay CEO chỉnh telos/positioning (HITL,
  không `AskUserQuestion` trong Workflow nền).

### 6.2 · Luật chống "tưởng GĐ5" (chống mở-rộng-sớm)

- **INV (reality-check bắt-buộc):** nếu `stage_khai > stage_bang_chung` → BLOCK mọi việc
  mở-rộng/gọi-vốn của GĐ cao hơn, NGAY từ intake (§3 SoT dòng 342: "chặn mở-rộng-sớm NGAY
  từ intake"). Lý-do: `optimize-before-scale` (LG-G-optimize-before-scale) — clone khi
  chưa qua cổng tối-ưu = **nhân-lỗi cả-đàn**.
- **INV (bằng-chứng thắng nhãn):** không bao giờ ghi `state.stage` = `stage_khai` khi nó
  vượt bằng-chứng; phải hạ về `stage_bang_chung` + ghi cảnh-báo có lý-do số-thật cụ-thể.
- **INV (không mặc-định GĐ1):** validator `02` §4.2 phát "STAGE_MISSING — PHA 0 phải
  phát-hiện stage, KHÔNG mặc-định GĐ1" nếu `state.stage` vắng.

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `vn-orchestrator/SKILL.md` **Bước 2** (Đọc Brain) | SỬA | sau khi gộp brainContext, chạy `phat_hien_stage`; ghi `state.stage` + cảnh-báo reality-check (LG-9-stage) |
| `vn-orchestrator/SKILL.md` **Bước 3** (Router) | SỬA | router đọc `stage_thuc` + cảnh-báo "tưởng GĐ5" để KHÔNG escalate brief mở-rộng khi chưa qua cổng GĐ trước (LG-9-stage) |
| `06-bang-tra-rule-engines.md` §6.1 | THAM-CHIẾU | rubric câu-sống-còn 6 GĐ mà Lớp 2 gọi |
| `02-brain-schema.md` §3.2, §4.3 | THAM-CHIẾU | schema trường `stage` + cơ-chế `runGateG0` mà §6.1 đặt vào cuối PHA 0 |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Lát Phở Hà — khai GĐ5 → bằng-chứng GĐ4 (`LG-7-PHA0`)

Fixture từ §7 SoT (dòng 602-608). Input:
- `khai_bao` = { mo_ta_dn: "chuỗi 4 quán phở Bắc TP.HCM, 2 năm", tinh_trang_khai: "DT ~1.2 tỷ/tháng",
  `stage_khai = GĐ5`, y_dinh: "mở 10 quán/12 tháng, có NĐT rót vốn" }.
- `brain.budget` = { quán-3 biên 6%, quán-4 mở 3 tháng chưa hòa-vốn, chỉ 2 quán ~18% }.

Kỳ-vọng output `phat_hien_stage`:

| Kiểm | Kỳ-vọng |
|---|---|
| Lớp 2 `stage_bang_chung` | **GĐ4** (câu-sống-còn "lãi/đơn-vị, lặp được?" CHƯA trả xong — biên đơn-vị chưa đồng-đều) |
| Lớp 3 reality-check | phát lệch `GĐ5 (khai) > GĐ4 (bằng-chứng)` → `canh_bao` BLOCK mở-rộng-sớm với lý-do "quán-3 biên 6%, quán-4 chưa hòa-vốn" |
| `stage_thuc` ghi vào `state.md` | **GĐ4** (bằng-chứng thắng nhãn) |
| Hệ-quả PHA 0 → PHA 1 | HOÃN vốn & HOÃN mở 10 quán; PHA 1 phân-rã theo **GĐ4** (tối-ưu trước nhân-bản) |

→ acceptance **INLINE** trong `test/rule-engines.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Không mặc-định GĐ1 cho DN cũ

`phat_hien_stage` với Brain có số thật của DN đang chạy PHẢI cho `stage_thuc ≥ GĐ2`
(không rơi về GĐ1). DN chưa-có-sản-phẩm (`brain` trống) → mới ra GĐ1.

### 8.3 · Stage theo từng đường-cong

DN có 2 đường-cong (lõi GĐ6 + bet mới GĐ1) → `stage_theo_duong_cong` trả đúng 2 stage
khác nhau; `state.md.stage` = stage đường-cong vận-hành chính.

### 8.4 · G0 chặn telos mơ-hồ

Telos "làm điều tốt" → `runGateG0` BLOCK (coherent=false) → PHA 0 KHÔNG thoát, không
cho xuống PHA 1 (đồng-bộ test `02` §8).

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (debate stage-aware) — theo LG-9-uutien (M2 tối-thiểu gồm phát-hiện stage).
- **Trước:** `00-tong-quan-va-thuat-ngu.md`; `02-brain-schema.md` (schema `stage` + `runGateG0`);
  `06-bang-tra-rule-engines.md` §6.1 (rubric câu-sống-còn — có thể song-song, nhưng §4 spec này GỌI nó).
- **Sau / dùng spec này:** `03b-pha1-phan-ra.md` (nhận `stage_thuc` làm đầu-vào phân-rã);
  `03e-pha4-mo-rong.md` (tái-nhập PHA 0 khi mở đường-cong mới).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-PHA0-vao | §3.1 | §8.1 input khai-báo CEO (Phở Hà) |
| LG-3-PHA0-ra | §3.2 | §8.1 output `state.stage` + Brain 2 lớp; §8.3 stage/đường-cong |
| LG-3-PHA0-gate | §6.1 | §8.4 G0 chặn telos mơ-hồ; POST-condition PASS mới xuống PHA 1 |
| LG-3-PHA0-stage1 | §4 Lớp 1 | §8.1 nhận `stage_khai=GĐ5`; §8.2 DN cũ không khởi-động lại GĐ1 |
| LG-3-PHA0-stage2 | §4 Lớp 2 | §8.1 rubric §6.1 → `stage_bang_chung=GĐ4`; §8.2/§8.3 suy từ số thật |
| LG-3-PHA0-stage3 | §4 Lớp 3, §6.2 | §8.1 cross-exam phát lệch → BLOCK "tưởng GĐ5" |

## 11. OPEN-Q

- **OQ-1:** Ngưỡng định-lượng chuyển GĐ4→GĐ5 (vd "≥ X% quán đạt biên ≥ Y%") nên cứng trong
  rubric §6.1 hay để CEO/đội chốt theo ngành? Hiện rubric §6.1 chỉ định-tính ("đang nhân-bản")
  — Phở Hà dùng "chỉ 2/4 quán đạt ~18%" làm bằng-chứng định-tính.
- **OQ-2:** Cross-exam lớp 3 tự-động đến đâu vs cần CEO xác-nhận khi số thật mâu-thuẫn nhãn?
  Đề-xuất: tự-động hạ stage + cảnh-báo, nhưng quyết HOÃN-mở-rộng đưa về HITL ở main loop.
