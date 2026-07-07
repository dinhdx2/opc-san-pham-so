---
id: 03c-pha2-thuc-thi
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 PHA 2 (dòng 381-389)"
covers: [LG-3-PHA2-router, LG-3-PHA2-debate, LG-3-PHA2-executor, LG-3-PHA2-gate-cung]
depends_on: [01-nguyen-ly-va-mo-hinh-tang, 00-tong-quan-va-thuat-ngu]
milestone: M2
---

# 03c · PHA 2 Thực-thi đệ-quy

> **Spec lớp THỰC-THI.** Biến mỗi hành-động trong `08-execution-plan.md` thành một
> **brief con** chạy lại đúng máy cũ (router → debate → kế-hoạch) rồi **làm thật** bằng
> tool/MCP qua `vn-executor`. Ranh-giới CỨNG: cổng NEED-APPROVAL là luật bất-biến,
> bước nguyên-tử là đáy phân-rã. Spec này KHÔNG sinh cây việc (→ `03b-pha1-phan-ra.md`)
> và KHÔNG khép-vòng (→ `03d-pha3-khep-vong.md`).

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§3 "PHA 2 · Thực-thi đệ-quy từng hành-động"** của SoT: ý **đệ-quy
(fractal)** — mỗi hành-động trong `08-plan` = một **brief con** vào lại đúng máy cũ
(`workflows/debate.js`), thêm **phanh chi-phí** (escalation ladder) để đệ-quy không nổ
token; rồi `vn-executor` **phân-rã bước nguyên-tử** và **chạy thật** bằng tool/MCP, gom
cổng người-trong-vòng-lặp hỏi CEO 1 lượt, ghi **sổ thực-thi** `10-run-state.md` để resume.

**Trong phạm-vi (in):** (a) `router_phan_loai` → SIMPLE/COMPLEX/STRATEGIC + escalation
(LG-3-PHA2-router); (b) gọi `debate.js` đúng độ-sâu → kế-hoạch-thực-thi-riêng
`10-thuc-thi-<hành-động>.md` (LG-3-PHA2-debate); (c) schema bước nguyên-tử của
`10-run-state.md` với 4 loại {AI-AUTO/NEED-INFO/NEED-APPROVAL/HUMAN-ONLY}
(LG-3-PHA2-executor); (d) **cổng cứng** NEED-APPROVAL như luật bất-biến (LG-3-PHA2-gate-cung).

**Ngoài phạm-vi (out):** sinh cây mục-tiêu/nhiệm-vụ (→ `03b-pha1-phan-ra.md`); nội-dung
4 pha của debate (đã đặc-tả tại engine thật `workflows/debate.js`, spec này chỉ mô-tả
CÁCH GỌI); đo/định-tuyến phản-hồi & PROMOTE KHO (→ `03d-pha3-khep-vong.md`); 6 bảng-tra
(→ `06-bang-tra-rule-engines.md`). Spec này GIỮ NGUYÊN engine debate + escalation ladder
sẵn-có (LG-9-dequy, LG-0-5) — chỉ định **giao-diện gọi** và **schema sổ thực-thi**.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `HITL / human-in-the-loop` (LG-G-hitl),
`bootstrap` (LG-G-bootstrap), `cuộn-sóng / rolling-wave` (LG-G-rolling-wave),
`fractal / tự-đồng-dạng` (LG-G-fractal), `cascade` (LG-G-cascade). Thuật-ngữ riêng spec này:

- **brief con** — một hành-động trong `08-plan` được đóng-gói lại thành đầu-vào cho
  `debate.js` (đệ-quy: cùng máy, đầu-vào nhỏ hơn).
- **escalation ladder** — thang leo độ-sâu/chi-phí: SIMPLE rẻ ↗ STRATEGIC full (đã code
  trong `debate.js`, biến `SCALE`).
- **bước nguyên-tử** — một hành-động kiểm-chứng được, là **đáy** phân-rã (không phân-rã
  vô-tận).
- **sổ thực-thi (run ledger)** — `10-run-state.md`, nguồn-sự-thật để resume.

## 3. Mô-hình dữ-liệu

### 3.1 · Phân-loại router (LG-3-PHA2-router)

```
RouterClass    = enum { SIMPLE, COMPLEX, STRATEGIC }
RouterDecision { action_brief:string,            # brief con của 1 hành-động trong 08-plan
                 scale:RouterClass,
                 departments:[string],           # mã dept-XX-* (lăng-kính cho debate)
                 model_tier:enum{sonnet,opus},   # suy ra từ scale (xem §4.1)
                 full_4_pha:bool }               # STRATEGIC ⇒ true; SIMPLE ⇒ bỏ cross-exam/red-team
```

Ánh-xạ scale (KHỚP `workflows/debate.js` dòng 19-21, 36-37):

| `scale` | Suy từ | Model | Pha chạy | Ý-nghĩa |
|---|---|---|---|---|
| `SIMPLE` | ≤ 2 phòng | toàn `sonnet` (`HEAVY=sonnet`) | rút gọn (1-2 lăng-kính; cross-exam 1 vòng) | đa-số hành-động — rẻ |
| `COMPLEX` | ≤ 6 phòng | `opus` cho 3 phòng lõi (01/02/03), còn lại `sonnet` | 4 pha, cross-exam 1 vòng | vừa |
| `STRATEGIC` | > 6 phòng | `opus` lõi + red-team/synth `opus` | **full 4 pha**, cross-exam tối-đa 2 vòng | hiếm — chiến-lược |

> Lưu-ý code thật: `SCALE` mặc-định **suy từ số phòng** (`DEPTS.length`), router có thể
> truyền `scale` tường-minh để ép tầng. `MAX_XEXAM_ROUNDS = STRATEGIC ? 2 : 1`.

### 3.2 · Kế-hoạch-thực-thi-riêng `10-thuc-thi-<hành-động>.md` (LG-3-PHA2-debate)

Đầu-ra của `debate.js` cho 1 hành-động (1 file / hành-động — neo LG-8-plan-action):

```
ThucThiPlan { action:string, scale:RouterClass,
              decision_report:ref,       # = trường `report` trả về từ debate.js
              red_team_flags:[string],   # claim refuted + legal_compliance_flag=true
              steps_brief:[string] }     # đầu việc thô để vn-executor phân-rã nguyên-tử
```

### 3.3 · Schema BƯỚC NGUYÊN-TỬ trong `10-run-state.md` (LG-3-PHA2-executor)

Bảng sổ thực-thi — KHỚP `vn-executor/SKILL.md` Bước 1 (code đọc/ghi trực-tiếp). **Cột
`loại` (4 nhóm)** là khóa quyết-định tự-động-hoá:

| Cột | Kiểu | Bắt-buộc | Ý-nghĩa |
|---|---|---|---|
| `id` | string | ✓ | mã bước, vd `W1-01` |
| `hanh_dong` | string | ✓ | hành-động cụ-thể, kiểm-chứng được |
| `loai` | enum `AI_AUTO\|NEED_INFO\|NEED_APPROVAL\|HUMAN_ONLY` | ✓ | **phân-loại tự-động-hoá (§4.3)** — khóa của cổng |
| `owner` | enum `AI\|AI+Human\|Human` | ✓ | suy từ `loai` (AI-AUTO→AI; HUMAN-ONLY→Human) |
| `tool` | enum `browser\|drive\|web\|file\|—` | – | tool/MCP sẽ dùng |
| `can_input` | string | – | dữ-liệu/bí-mật/điều-kiện tiên-quyết |
| `cong` | enum `none\|NEED-INFO\|NEED-APPROVAL\|HUMAN` | ✓ | cổng HITL (none chỉ khi `loai=AI_AUTO`; `HUMAN` khi `loai=HUMAN_ONLY`) |
| `phu_thuoc` | [id] | – | bước phải `DONE` trước |
| `trang_thai` | enum `TODO\|DOING\|BLOCKED-INFO\|BLOCKED-APPROVE\|HUMAN\|DONE\|FAILED` | ✓ | trạng-thái hiện-tại |
| `bang_chung` | string | – | link/file/ảnh/output — BẮT-BUỘC khi `DONE` |

**Bất-biến schema:** `loai=NEED_APPROVAL ⇒ cong=NEED-APPROVAL` (không bao giờ `none`);
`loai=AI_AUTO ⇒ cong=none ∧ owner=AI`; `loai=HUMAN_ONLY ⇒ cong=HUMAN ∧ owner=Human`;
`trang_thai=DONE ⇒ bang_chung ≠ null` (chống bịa
bằng-chứng — `vn-executor` Bước 0 nguyên-tắc 3).

## 4. Hành-vi / thuật-toán

### 4.1 · `router_phan_loai(action)` — phanh chi-phí đệ-quy (LG-3-PHA2-router)

```
INPUT : action            # 1 hành-động trong 08-execution-plan.md
OUTPUT: RouterDecision

func router_phan_loai(action):
    depts = chon_lang_kinh(action)            # phòng/khía-cạnh liên-quan (ít → SIMPLE)
    scale = (len(depts) <= 2) ? SIMPLE
          : (len(depts) <= 6) ? COMPLEX
          : STRATEGIC                          # = luật mặc-định debate.js
    return { action_brief: dong_goi_brief(action), scale, departments: depts,
             model_tier: (scale==SIMPLE ? sonnet : opus_cho_phong_loi),
             full_4_pha: (scale == STRATEGIC) }
```

Nguyên-tắc đệ-quy (fractal): **mỗi hành-động = brief con vào đúng máy cũ**; **đa-số rơi
SIMPLE** (Sonnet, bỏ cross-exam/red-team) để rẻ; **chỉ STRATEGIC bung full 4-pha + Opus**.

### 4.2 · `chay_hoi_dong(decision)` — gọi debate.js đúng độ-sâu (LG-3-PHA2-debate)

```
INPUT : decision:RouterDecision
OUTPUT: ThucThiPlan  → ghi 10-thuc-thi-<hành-động>.md

func chay_hoi_dong(decision):
    res = WORKFLOW(debate.js, {                # TÁI-DÙNG NGUYÊN engine — không sửa lõi
        brief: decision.action_brief,
        brainContext: doc_brain(),
        departments: decision.departments,
        scale: decision.scale })              # SCALE điều-khiển model + số pha + vòng cross-exam
    plan = lap_ke_hoach(res.report, res.redTeam)
    ghi_file("10-thuc-thi-" + slug(decision.action) + ".md", plan)
    return plan
```

> KHÔNG dùng Workflow cho cổng HITL: `debate.js` chạy nền, `AskUserQuestion` chỉ hoạt-động
> ở main loop (LG-3-PHA2-executor / `vn-executor` Bước 4). Debate chỉ ra **kế-hoạch tĩnh**;
> phần làm-thật + hỏi-duyệt do `vn-executor` đảm-nhận (§4.4).

### 4.3 · `phan_loai_buoc(step)` — gán 4 loại (LG-3-PHA2-executor)

KHỚP `vn-executor/SKILL.md` Bước 2:

```
func phan_loai_buoc(step):
    if cham_ranh_gioi_cung(step):  return NEED_APPROVAL   # §6 — ƯU-TIÊN CAO NHẤT, không thể bị ghi đè
    if thieu_input_bi_mat(step):   return NEED_INFO       # thiếu dữ-liệu/secret/quyết-định CEO
    if doi_hoi_con_nguoi_that(step): return HUMAN_ONLY    # KYC/sinh-trắc/đến ngân-hàng
    return AI_AUTO                                        # máy làm trọn vẹn, không ra tiền/không công-bố
```

| Loại | Hành-xử executor | VD (từ SKILL) |
|---|---|---|
| **AI-AUTO** | tự chạy, không hỏi → `DONE` + bằng-chứng | soạn policy FTC, viết ad copy, tra phí PayPal/Payoneer thật, dựng CSV/dashboard |
| **NEED-INFO** | `BLOCKED-INFO`, gom hỏi 1 lượt | giá bán thật, mật-khẩu/API key, chọn domain |
| **NEED-APPROVAL** | làm hết phần nháp → `BLOCKED-APPROVE` → chờ CEO bấm | đăng store live, bật/đổ tiền ads, submit form, publish |
| **HUMAN-ONLY** | soạn checklist + tiêu-chí "xong=?" → `HUMAN`, không chặn nhánh khác | mở PayPal Business (KYC), test giao-dịch $1 thật |

### 4.4 · Vòng-lặp thực-thi (trái tim — `vn-executor` Bước 3)

```
loop tới khi mọi bước ở trạng-thái cuối {DONE | HUMAN-đã-giao | FAILED}:
  1. chọn bước TODO/đã-gỡ-chặn có phụ_thuộc DONE và can_input đủ
  2. AI-AUTO → DOING → chạy tool/MCP → lưu 03-Outputs/ → ghi bằng_chứng → DONE
     (việc nặng/độc-lập → giao agent `executor`; nhiều việc → 1 message song-song)
  3. NEED-APPROVAL → làm xong nháp → BLOCKED-APPROVE
  4. hết bước tự-chạy → GOM mọi BLOCKED-INFO + BLOCKED-APPROVE → 1 AskUserQuestion
  5. nhận đáp ứng → ghi sổ + 03-clarification.md → TODO → QUAY LẠI b1 (tự chạy tiếp)
  6. HUMAN-ONLY → xuất checklist → HUMAN → KHÔNG chặn nhánh độc-lập
  7. lỗi → retry vài lần → vẫn lỗi: FAILED + nguyên-nhân + đề-xuất
  sau MỖI đổi trạng-thái → cập-nhật 10-run-state.md (resume), commit/push theo mốc
```

**Edge-case:**
- **Resume:** chạy lại đọc `10-run-state.md`, KHÔNG làm lại bước `DONE`, KHÔNG ghi đè
  trạng-thái cũ (SKILL Bước 1 + Quy-ước chung).
- **Bước nguyên-tử là đáy:** nếu một "bước" còn quá-thô để chạy/duyệt → tách thêm bước con
  MỘT lần, không phân-rã vô-tận (LG-3-PHA2-gate-cung — đáy).
- **HUMAN-ONLY chặn nhánh:** chỉ chặn bước có `phu_thuoc` trỏ vào nó; nhánh độc-lập vẫn chạy.

## 5. Ranh-giới generic ↔ phân-rã

| Thành-phần | GP | Ghi-chú |
|---|---|---|
| Luật router SIMPLE/COMPLEX/STRATEGIC + escalation ladder | **GENERIC** | bảng/ngưỡng cố-định trong `debate.js` (≤2 / ≤6 / >6 phòng) |
| Engine `debate.js` 4 pha + model-tiering | **GENERIC** | tái-dùng nguyên, mọi DN dùng chung (LG-9-dequy) |
| 4 loại bước {AI-AUTO/NEED-INFO/NEED-APPROVAL/HUMAN-ONLY} + cổng cứng | **GENERIC** | luật phân-loại bất-biến (`vn-executor` Bước 2) |
| `action_brief`, `departments` chọn cho 1 hành-động | **PHÂN-RÃ** | suy từ `08-plan` của DN |
| Nội-dung từng bước + bằng-chứng trong `10-run-state.md` | **PHÂN-RÃ** | mỗi task/DN khác |

**Chốt:** *cách phân-loại & cách gọi máy* là generic; *brief, phòng chọn, nội-dung bước*
là phân-rã.

## 6. Cổng & luật bất-biến

- **INV-GATE (cổng cứng — LG-3-PHA2-gate-cung):** các hành-động sau **LUÔN** `NEED-APPROVAL`,
  **không bao giờ AI-AUTO**: **(1) chi tiền · (2) ký/nộp hồ-sơ pháp-lý · (3) công-bố ra
  ngoài · (4) gửi email/tin · (5) thao-tác không hoàn-tác** (xoá/ghi-đè). Bổ-sung (SKILL
  Bước 2): bất-cứ việc nào CLAUDE.md/Brain đánh-dấu cần chuyên-gia rà (pháp-lý/kế-toán).
  Đây là **luật bất-biến** — `phan_loai_buoc` kiểm `cham_ranh_gioi_cung` TRƯỚC mọi nhánh
  khác (§4.3), không thể bị tối-ưu/ghi đè thành AI-AUTO.
- **INV-DAY (bước nguyên-tử là đáy):** không phân-rã vô-tận; một bước = một hành-động
  kiểm-chứng được. Phanh chống đệ-quy nổ.
- **INV-EVIDENCE (chống bịa):** `DONE ⇒ bang_chung ≠ null` (link/file/ảnh/output thật);
  việc người phải tự làm → chuẩn-bị + checklist, KHÔNG giả-vờ đã làm.
- **INV-HITL (cổng ở main loop):** mọi `AskUserQuestion` chạy ở main loop của
  `vn-executor`, KHÔNG trong Workflow nền; gom cổng hỏi **1 lượt**.
- **INV-PHANH (escalation):** mặc-định leo tầng RẺ NHẤT đủ dùng (đa-số SIMPLE); chỉ leo
  Opus/full-4-pha khi STRATEGIC.
- **INV-RESUME:** `10-run-state.md` là nguồn-sự-thật; cập-nhật sau mỗi đổi trạng-thái +
  commit/push theo mốc (web ephemeral).

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `workflows/debate.js` (engine 4 pha + `SCALE`/escalation) | **GIỮ** | tái-dùng NGUYÊN cho brief con — không sửa lõi (LG-9-dequy, LG-0-5) |
| `.claude/skills/vn-executor/SKILL.md` Bước 1-3 (sổ + 4 loại + vòng-lặp) | **GIỮ** | spec này đặc-tả đúng hành-vi đã có; là nguồn schema §3.3 |
| `vn-orchestrator` → router gọi `debate.js` cho từng hành-động `08-plan` | **SỬA** | nhúng `router_phan_loai` §4.1 (phanh chi-phí đệ-quy) |
| `knowledge/templates-vn/_orchestrator/run-ledger.md` | **THAM-CHIẾU** | mẫu `10-run-state.md` (SKILL Bước 1) |
| agent `executor` (Agent tool) | **GIỮ** | nhận bước AI-AUTO nặng/độc-lập; cổng HITL vẫn ở main loop |
| `workflows/debate.js` pha Red-team | **THAM-CHIẾU** | `legal_compliance_flag` → nuôi cổng cứng (cảnh-báo đỏ vào `10-thuc-thi-*`) |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Test phân-loại router (LG-3-PHA2-router)

| # | Input (số phòng / loại brief) | Kỳ-vọng `scale` | Model | Pha |
|---|---|---|---|---|
| R1 | 1 phòng ("tra phí PayPal") | **SIMPLE** | sonnet | rút gọn (bỏ cross-exam/red-team sâu) |
| R2 | 4 phòng ("đàm-phán NCC thịt bò") | **COMPLEX** | opus lõi + sonnet | 4 pha, cross-exam 1 vòng |
| R3 | 8 phòng ("tái-cấu-trúc vốn") | **STRATEGIC** | opus | full 4 pha, cross-exam ≤2 vòng |

→ KHỚP `debate.js` dòng 19-21 (`SCALE`), 26 (`MAX_XEXAM_ROUNDS`), 36-37 (model).
fixture: INLINE `test/flow.test.js` (neo claim `LG-*`).

### 8.2 · Test cổng cứng chặn AI-AUTO (LG-3-PHA2-gate-cung)

| # | Bước | Kỳ-vọng `loai` | Kỳ-vọng `cong` |
|---|---|---|---|
| G1 | "Đổ $200 ngân-sách ads" (chi tiền) | **NEED-APPROVAL** | NEED-APPROVAL (KHÔNG được AI-AUTO) |
| G2 | "Submit form đăng-ký kinh-doanh" (ký/nộp pháp-lý) | **NEED-APPROVAL** | NEED-APPROVAL |
| G3 | "Publish landing page ra công-chúng" (công-bố) | **NEED-APPROVAL** | NEED-APPROVAL |
| G4 | "Gửi email chào-hàng tới list KH" (gửi tin) | **NEED-APPROVAL** | NEED-APPROVAL |
| G5 | "Xoá toàn-bộ bucket cũ" (không hoàn-tác) | **NEED-APPROVAL** | NEED-APPROVAL |
| G6 | "Soạn 4 trang policy theo FTC" (chỉ nháp) | **AI-AUTO** | none |

**Khẳng-định chống ghi-đè:** với G1-G5, dù step "có-vẻ máy làm được", `phan_loai_buoc`
PHẢI trả `NEED_APPROVAL` vì `cham_ranh_gioi_cung` chạy TRƯỚC nhánh AI-AUTO (§4.3). Test
đảo: không có cách nào để G1-G5 ra `cong=none`.

→ acceptance **INLINE** trong `test/flow.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.3 · Test bất-biến schema sổ (LG-3-PHA2-executor)

- E1: mọi dòng `trang_thai=DONE` ⇒ `bang_chung ≠ null` (chống bịa).
- E2: `loai=NEED_APPROVAL ⇒ cong=NEED-APPROVAL`; `loai=AI_AUTO ⇒ cong=none ∧ owner=AI`.
- E3: resume — nạp `10-run-state.md` có sẵn → bước `DONE` không bị chạy lại / ghi đè.

→ acceptance **INLINE** trong `test/flow.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.4 · Lát Phở Hà (LG-7-PHA2)

Hành-động **"đàm-phán thịt bò sản-lượng-gộp"**: router → **COMPLEX** → `debate.js` →
`10-thuc-thi-dam-phan-thit-bo.md`; bước **"ký HĐ NCC"** PHẢI được phân-loại **NEED-APPROVAL**
(ký/nộp pháp-lý + chi tiền) — không tự ký. Liên-kết test cổng cứng §8.2.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (debate stage-aware) — router/escalation thuộc engine đã có; theo
  LG-9-uutien (M1+M2 tối-thiểu).
- **Trước:** `01-nguyen-ly-va-mo-hinh-tang.md` (tầng/validate cho cây việc nguồn),
  `03b-pha1-phan-ra.md` (sinh `08-execution-plan.md` — đầu-vào của PHA 2).
- **Sau / dùng spec này:** `03d-pha3-khep-vong.md` (đo kết-quả thực-thi → định-tuyến
  phản-hồi), `06-bang-tra-rule-engines.md` (bảng reuse khi tra-kho trong bước AI-AUTO).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-PHA2-router | §3.1, §4.1, §5, §6 INV-PHANH | §8.1 R1-R3 phân-loại scale + escalation đúng |
| LG-3-PHA2-debate | §3.2, §4.2, §7 | §8.4 hành-động → `10-thuc-thi-<action>.md` qua debate.js |
| LG-3-PHA2-executor | §3.3, §4.3, §4.4, §6 INV-EVIDENCE/RESUME | §8.3 E1-E3 schema sổ + 4 loại + resume |
| LG-3-PHA2-gate-cung | §3.3 bất-biến, §4.3, §6 INV-GATE/INV-DAY | §8.2 G1-G6 cổng cứng chặn AI-AUTO; §8.4 ký HĐ NCC |

## 11. OPEN-Q

- **OQ-1:** `chon_lang_kinh(action)` chọn phòng cho brief con bằng bảng khía-cạnh→phòng
  (§4 SoT) hay heuristic riêng? Hiện đặt số-phòng quyết scale → cần luật chọn phòng ổn-định
  để scale không dao-động tuỳ-tiện. CEO/đội kỹ-thuật chốt.
- **OQ-2:** Ngưỡng `K` (số lần tách bước con trước khi coi là đáy) — SoT chỉ nói "bước
  nguyên-tử là đáy" không cho số. Đề-xuất tách tối-đa 1 lần, vượt → đẩy NEED-INFO hỏi CEO.
