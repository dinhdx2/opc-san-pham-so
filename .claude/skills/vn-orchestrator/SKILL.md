---
name: vn-orchestrator
description: Điều phối hội đồng vn-opc — đọc Brain, router phân loại, chạy debate workflow, 3 chặng PAUSE CEO duyệt, sinh tài liệu. Dùng khi CEO gõ /vn-run hoặc yêu cầu họp bàn DN. Bản web/mobile — vault bằng file trong repo.
---

# Skill: vn-orchestrator (bản web/mobile)

Điều phối toàn bộ quy trình họp hội đồng vn-opc từ đầu đến cuối, chạy **trong phiên Claude Code web/mobile**.
Khác bản desktop: vault là **thư mục file trong repo**, đọc/ghi bằng tool `Read`/`Write`/`Glob`/`Edit` — KHÔNG dùng MCP Obsidian.
Mọi output bằng tiếng Việt, có TL;DR, định nghĩa thuật ngữ lần đầu xuất hiện.

---

## Bước 1 — Xác định vault (multi-vault)

- **Resolve vault đang dùng** (`lib/vault.js#resolveActiveVault`): đọc con-trỏ **`.vn-active-vault`** ở gốc repo → đường-dẫn vault hiện-hành (vd `vaults/cafe-pet-q7`). Con-trỏ trống/chết → **fallback `vault/`** (DN cũ, tương-thích ngược). Gọi đường-dẫn này là `<VAULT>`; mọi bước sau đọc/ghi dưới `<VAULT>/` (vd `<VAULT>/00-Brain/`, `<VAULT>/02-Tasks/<slug>/`).
- **Chưa có vault nào** (chưa onboard ý-tưởng) → gợi-ý CEO gõ `/vn-onboard "<ý-tưởng>"` để tạo vault mới.
- Đọc/ghi bằng `Read`, `Write`, `Edit`, `Glob` — không có MCP `vault_read/vault_write`.
- Cho phép override: CEO chỉ định vault khác (vd `vaults/<slug>`) → cập-nhật `.vn-active-vault` rồi dùng.
- **Lưu bền vững:** môi trường web là ephemeral. Sau khi ghi file vào `vault/`, PHẢI `git add` + `git commit` + `git push` để dữ liệu DN không mất giữa các phiên.

---

## Bước 2 — Đọc Brain (theo Brain Contract)

Thư mục `<VAULT>/00-Brain/` gồm **7 file** = **5 file canonical** (input debate, nạp vào `brainContext`) + **2 file bộ nhớ** (`decisions-log.md`, `calibration.md` — KHÔNG nạp làm quan điểm; dùng riêng ở mục Bộ nhớ tổ chức bên dưới và Bước 11). Chi tiết schema: `knowledge/brain-schema.md`.

**5 file canonical** — đọc bằng `Read`:

```
<VAULT>/00-Brain/strategy.md    # vision/ICP/positioning + thị trường/đối thủ (thay market.md cũ)
<VAULT>/00-Brain/products.md    # catalog + unit economics
<VAULT>/00-Brain/state.md       # hiện trạng, KPI, rủi ro
<VAULT>/00-Brain/budget.md      # tài chính/ngân sách/dòng tiền (thay finance.md cũ)
<VAULT>/00-Brain/headcount.md   # nhân sự
```

**Validator (chạy trước khi fan-out):**
1. Đếm số file tồn tại + có nội dung thực. Gắn 1 dòng `Brain coverage: X/5` vào đầu `brainContext`.
2. Thiếu 1–2 file phụ → ghi chú thiếu, tiếp tục.
3. Thiếu ≥3 file, HOẶC thiếu file then chốt (`strategy.md` / `state.md`) → sang Bước 4 (PAUSE 1), gợi ý CEO chạy `/vn-onboard`.

**Grounding (truyền nguyên tắc này vào brainContext):** mọi con số phải gắn nhãn `[số thật DN]` (trích Brain canonical) hoặc `[benchmark ngành — cần CEO xác minh]`. KHÔNG dùng benchmark làm căn cứ scale. Thiếu số → `[cần CEO xác minh]`, không bịa.

**Bộ nhớ tổ chức (đọc TRƯỚC debate):** đọc `<VAULT>/00-Brain/decisions-log.md`:
- Lấy mọi mục `status: locked` → chèn vào đầu `brainContext` dưới tiêu đề **"QUYẾT ĐỊNH ĐÃ CHỐT — KHÔNG bàn lại"** (kèm ràng buộc cứng). Hội đồng phải tuân, KHÔNG tái tranh luận các điểm này.
- Nếu brief nối tiếp 1 task cũ (cùng chủ đề) → đọc thêm `07-decision-report.md` của task đó để mang ngữ cảnh sang (task linking), thay vì hardcode lại.

Gộp 5 file Brain + dòng coverage + nguyên tắc grounding + quyết định đã chốt thành biến `brainContext` duy nhất để truyền vào workflow.

### Bước 2b — Brain 2 lớp + phát-hiện stage + G0 (luồng generic v3)

> Hiện-thực spec `03a` (PHA 0) + `02` (Brain 2 lớp). Engine xác-định: `lib/brain.js`, `lib/rule-engines.js`. Schema: `knowledge/brain-schema.md` mục "Brain 2 lớp".
> **Gói 1 lượt (scaffold tái-lập):** `lib/flow.js#chuanBiPHA0({brain, evidence, stage_khai})` → `{stage, cau_song_con, g0_pass, coverage5, san_sang_pha1}` — bám kết-quả này thay vì tự suy từng bước.

1. **Đọc thêm lớp sinh-thành** (nếu có): `<VAULT>/00-Brain/{telos,positioning,curves,structure,lessons}.md`. Bổ-sung dòng coverage: "+telos/+positioning/+curves/+structure: có/thiếu". Thiếu → cảnh-báo "lớp sinh-thành chưa thiết-lập" (KHÔNG chặn — tương-thích ngược).
2. **Phát-hiện stage 3 lớp** (đừng mặc-định GĐ1): khai-báo CEO → đối-chiếu bằng-chứng `state.md`/`budget.md` bằng rubric `knowledge/rule-engines/stage-rubric.yaml` → reality-check. **Số nói thật hơn nhãn:** nếu CEO khai GĐ cao hơn bằng-chứng (vd "sẵn-sàng GĐ5" nhưng chưa qua cổng tối-ưu) → giữ stage bằng-chứng + cảnh-báo `BLOCK_MO_RONG_SOM`. Ghi `state.md.stage` (nhãn grounding).
3. **Cổng G0** (cổng-tỉnh-táo, `lib/brain.js#runGateG0`): kiểm `telos.approved_by` mở-đầu `"CEO"` (chấp `"CEO (tên) — duyệt…"`; placeholder `"[chờ CEO duyệt]"` vẫn BLOCK) + telos mạch-lạc + cơ-hội khớp số thật. **BLOCK → quay CEO chỉnh telos/positioning** (HITL ở main loop, không `AskUserQuestion` trong Workflow). G0 PASS mới cho chiều-sinh xuống PHA 1 (Bước 7).
4. Nạp `stage` + cảnh-báo reality-check vào `brainContext`.

---

## Bước 3 — Router phân loại brief

Đọc brief, tự quyết danh sách `departments` (mã `dept-XX-<tên>`, đúng tên file trong `.claude/agents/`) dựa trên:

1. Nội dung brief khớp lĩnh vực nào (tài chính, marketing, vận hành, pháp lý…).
2. Alias/phạm vi từng phòng trong `<VAULT>/01-Departments/*/department.yaml` (bộ hồ sơ phòng ban RIÊNG của DN, sinh lúc `/vn-onboard`). **Chỉ-đọc-vault:** KHÔNG đọc khuôn sinh `knowledge/departments/` thay thế; vault thiếu `01-Departments/` → dừng, báo CEO chạy `/vn-onboard` (Bước 6c) để backfill rồi mới debate.

| Loại | Số phòng | Khi nào dùng |
|------|----------|--------------|
| SIMPLE | 1–2 | Brief hẹp, 1 lĩnh vực rõ |
| COMPLEX | 3–6 | Brief liên phòng |
| STRATEGIC | 7–12 | Brief cấp chiến lược toàn công ty |

**Không cố định số phòng** — chọn đúng phòng liên quan.

**Active departments:** đọc `<VAULT>/.vncoderc` (nếu có) bằng `Read`:
- Có `active_departments` → router CHỈ chọn phòng trong danh sách đó (12 nền + phòng pack ngành đã onboard).
- Không có `.vncoderc` / thiếu key → mặc định 12 phòng nền (`dept-01-governance` … `dept-12-growth`).

**Router phải phát quyết định dạng JSON (truy xuất được) — ghi vào `<VAULT>/02-Tasks/<slug>/02-router.md`:**
```json
{
  "scale": "SIMPLE | COMPLEX | STRATEGIC",
  "departments": ["dept-XX-...", "..."],
  "rationale": "1-2 câu vì sao chọn đúng nhóm phòng này",
  "coverage_check": "brief có khía cạnh nào KHÔNG phòng nào phụ trách không? (nếu có → bổ sung phòng)",
  "devilsAdvocate": "1 mã dept làm luật sư của quỷ"
}
```
- **Guard độ phủ:** nếu `coverage_check` lộ khía cạnh bị bỏ sót → thêm phòng phù hợp rồi mới chạy.
- **Luân phiên luật sư của quỷ:** chọn `devilsAdvocate` KHÁC task gần nhất (xem mục cuối `decisions-log.md` / `02-router.md` task trước) để góc phản biện không đóng khung 1 phòng.
- Truyền `scale` + `devilsAdvocate` vào `args` của workflow ở Bước 5; engine dùng để chọn model ladder + lặp cross-exam.

**Stage-aware (luồng generic v3):** đọc `stage` + cảnh-báo `BLOCK_MO_RONG_SOM` từ Bước 2b. Nếu brief là **mở-rộng/gọi-vốn** mà chưa qua cổng GĐ trước (vd khai GĐ5 nhưng bằng-chứng GĐ4) → KHÔNG escalate; gắn cờ "optimize-before-scale" để hội đồng ưu-tiên tối-ưu trước nhân-bản.

---

## Bước 4 — PAUSE 1: Làm rõ (nếu cần)

Kích hoạt khi Brain thiếu thông tin then chốt (ngân sách, state hiện tại…).
- Dùng `AskUserQuestion` hỏi CEO, mỗi câu 2–4 phương án.
- Ghi câu trả lời vào `<VAULT>/02-Tasks/<slug>/03-clarification.md` bằng `Write`.
- Bổ sung vào `brainContext` trước khi chạy workflow.

Brain đủ → bỏ qua, sang Bước 5.

Slug task: `YYYY-MM-DD-hhmm-<kebab-mô-tả>` — lấy ngày giờ thực từ context, không bịa.

---

## Bước 5 — Chạy debate workflow

Gọi **Workflow** tool với:

```
script path: workflows/debate.js
args: {
  brief:          <brief gốc>,
  brainContext:   <brainContext đã gộp Bước 2>,
  vault:          <đường-dẫn <VAULT> active, vd "vaults/san-pham-so" — dept agent đọc persona từ <VAULT>/01-Departments/>,
  departments:    <danh sách dept-XX-... đã chọn Bước 3>,
  scale:          <SIMPLE | COMPLEX | STRATEGIC từ router Bước 3>,
  devilsAdvocate: <1 mã dept làm "luật sư của quỷ" — luân phiên qua các task để phá thiên kiến đồng thuận; bỏ trống thì engine tự chọn>
}
```

Skill được gọi qua `/vn-run` (user chủ động) → đủ điều kiện opt-in để Workflow chạy.
Chờ workflow xong, nhận `{ scale, devilsAdvocate, views, crossExam, redTeam, debate, report }`.

**Engine v2 (4 pha):** Perspectives (song song) → Cross-examination (phòng phản biện/đổi ý; STRATEGIC lặp tối đa 2 vòng, dừng sớm khi hội tụ) → Red-team (trích claim rủi ro cao → bác bỏ đối kháng, gắn cờ pháp lý) → Synthesize. Report sẽ có mục **⚔️ Red-team** và **Đổi ý sau cross-exam** — trình đầy đủ cho CEO ở PAUSE 2, đặc biệt mọi cảnh báo đỏ `legal_compliance_flag`.

> Lưu ý: các agent `dept-XX` được resolve từ `.claude/agents/` (agentType cấp repo, dùng chung). Persona thì **per-vault**: mỗi agent đọc `<VAULT>/01-Departments/<phòng>/` theo dòng `VAULT:` workflow truyền vào (CWD = gốc repo). Vault thiếu hồ sơ phòng → agent trả `persona_missing: true` — dừng trình CEO backfill (`/vn-onboard` Bước 6c), KHÔNG dùng khuôn sinh `knowledge/departments/` thay thế.

---

## Bước 6 — PAUSE 2: CEO duyệt Decision Report

1. Ghi `report` vào `<VAULT>/02-Tasks/<slug>/07-decision-report.md` bằng `Write`.
2. Trình CEO: TL;DR 3 câu + `AskUserQuestion` (Duyệt / Sửa phần X / Họp lại). **Nêu nổi bật mọi cảnh báo đỏ Red-team (`legal_compliance_flag`) trước khi hỏi duyệt.**
3. CEO yêu cầu sửa → chỉnh `report`, ghi đè, hỏi lại.
4. CEO duyệt → **write-back bộ nhớ (BẮT BUỘC)**:
   - Cập nhật `<VAULT>/00-Brain/state.md`: trạng thái/kế hoạch đang chạy theo quyết định vừa duyệt.
   - Append 1 mục vào `<VAULT>/00-Brain/decisions-log.md` theo schema (status: locked), ghi rõ ràng buộc "không bàn lại" rút từ report.
   - → Bước 7.

---

## Bước 7 — PAUSE 3: CEO duyệt Execution Plan

### Bước 7a — PHA 1 phân-rã sinh-thành (luồng generic v3, qua `vn-architect`)

> Hiện-thực spec `03b` + `01` §1.4. Khi brief cần **sinh cây việc/cấu-trúc** (không chỉ 1 quyết-định gọn), gọi skill **`vn-architect`** (1A→1D) thay vì liệt việc tự-do.

1. **Cổng A** (sớm/rẻ, `AskUserQuestion`): duyệt KHUNG telos/định-vị/lăng-kính/stage trước khi phân-rã tốn-kém.
2. **Sinh cây việc 3 lớp** (`lib/tier.js#sinhNhiemVuChinh`): duyệt **11 khía-cạnh** (`knowledge/taxonomy/aspects.yaml`, cổng cắt-tỉa theo stage) → mỗi mục-tiêu (TRẠNG-THÁI) sinh nhiệm-vụ-chính (điều-kiện-đủ → **lăng-kính 3 chiều tấn/thủ/hậu** → quét chéo → cổng nghiệm → neo OKR/KPI). Mọi item qua `validate_dung_tang` (chống nén tầng: mục-tiêu ≠ động-từ).
3. **Lăng-kính tấn/thủ/hậu** (LG-9-lens-3chieu): mỗi nhiệm-vụ-con gắn `chiều` → ánh-xạ sang executor (tấn = việc LÀM/AI-AUTO · thủ = NEED-APPROVAL gác · hậu = tài-nguyên/cấp).
4. **Gom NGƯỢC-LÊN + tra-KHO** (1C, `lib/kho.js#tra`): việc → bộ-phận → phòng (`maps_to` 12 canonical) → khối (7 canonical), mỗi tầng REUSE/ADAPT/NEW. Ghi `06-structure.md` + báo-cáo tra-kho.
5. **Cổng B**: duyệt GỘP `08-plan` + `06-structure` + báo-cáo tra-kho (1 lượt).
6. **Soạn `08-execution-plan.md`**: danh sách đầu việc đánh số, mỗi việc **[Hành động]** | Người/phòng | KPI | Deadline.
7. **Ghi** `<VAULT>/02-Tasks/<slug>/08-execution-plan.md`.
8. **`AskUserQuestion`** trình CEO (Duyệt / Sửa / Bổ sung KPI).
9. **Điều chỉnh, ghi đè sau khi duyệt.** Sau khi duyệt: cập nhật mục tương ứng trong `decisions-log.md` nếu plan bổ sung ràng buộc mới (vd KPI/deadline đã chốt).

---

## Bước 7c — Sinh SOP per-hành-động (PHA 2 thực-thi, luồng generic v3)

> Hiện-thực spec `03c` §4.2 (router đệ-quy 1 hành-động). Sau khi `08-execution-plan.md` được duyệt, MỖI đầu việc lớn có thể cần SOP riêng.
> **Gói 1 lượt (scaffold tái-lập):** `lib/flow.js#chuanBiPHA2(actions)` — `actions=[{hanh_dong, depts}]` → bảng per-hành-động `{scale, can_debate, cong, file_sop}`. Bám bảng này thay vì tự suy từng việc.

1. **`chuanBiPHA2(actions)`** trả mỗi hành-động: `scale` (SIMPLE/COMPLEX/STRATEGIC) · `can_debate` · `cong` (cổng cứng TRỰC-GIAO scale) · `file_sop`.
2. `can_debate=true` (COMPLEX/STRATEGIC, hoặc rủi-ro cao) → chạy lại debate (Bước 5) khoanh đúng phòng → kết-tinh `<VAULT>/02-Tasks/<slug>/<file_sop>` (**1 file / hành-động**). `can_debate=false` (SIMPLE) → SOP gọn, KHÔNG cần debate.
3. `cong=NEED-APPROVAL` → đánh-dấu để `vn-executor` gom cổng CEO 1 lượt. SOP per-hành-động là đầu-vào cho `/vn-execute`.

---

## Bước 8 — Render tài liệu (nếu task yêu cầu)

1. **Chọn template:** tra `knowledge/templates-vn/_orchestrator/decision-template-map.md` (loại quyết định + phòng phụ trách → template). Ưu tiên BYOT 3 tầng: `<VAULT>/00-Templates-Custom/<dept>/...` > `knowledge/templates-vn/<dept>/...` > mặc định.
2. **Điền tự động** từ `views`/`report`: số liệu, phòng phụ trách, KPI, deadline. Số chưa có → `[cần CEO xác minh]`. Tài liệu pháp lý/kế toán gắn dòng "MẪU — cần luật sư/kế toán rà".
3. **Probe office-docs:** nếu có skill `office-docs` → render `.docx/.xlsx` vào `<VAULT>/03-Outputs/<slug>/`.
4. **Fallback (mặc định trên web nếu KHÔNG có office-docs):** xuất `.md` cho văn bản + `.csv` cho bảng vào `<VAULT>/03-Outputs/<slug>/`, báo CEO "bản markdown — chuyển .docx sau khi cần". Không để task thất bại chỉ vì thiếu office-docs.

---

## Bước 9 — Lưu bền vững (BẮT BUỘC trên web)

Sau khi hoàn tất, chạy:
```
git add <VAULT>/ && git commit -m "vn-opc: <slug>" && git push
```
để dữ liệu DN tồn tại sau khi phiên kết thúc.

---

## Bước 10 — Bàn giao sang THỰC THI

Sau khi CEO duyệt `08-execution-plan.md`, kế hoạch vẫn là **tài liệu tĩnh**. Gợi ý CEO:
> "Kế hoạch đã chốt. Gõ **`/vn-execute`** để hệ thống bắt đầu *thực thi*: tự chạy các bước máy làm được (soạn policy, viết ad copy, tra số liệu thật…), và chỉ dừng hỏi khi cần thông tin của anh/chị hoặc cần phê duyệt việc tốn tiền/công bố."

Lớp thực thi do skill **`vn-executor`** đảm nhận (xem `.claude/skills/vn-executor/`), sinh sổ `10-run-state.md` và resume được.

---

## Bước 11 — Hiệu chỉnh (khi task đã có kết quả thực)

> **Cửa vào:** CEO gõ **`/vn-loop "<task> — <số thật>"`** (lệnh riêng cho lớp khép-vòng, xem `commands/vn-loop.md`) HOẶC quay lại `/vn-run` với số thật. Bước 11 + 11b là engine của lệnh đó; mọi cổng CEO chạy ở **main loop**, KHÔNG trong Workflow.

Khi CEO quay lại với SỐ THỰC của một task đã chạy (vd ROAS/đơn sau 30 ngày):
- Append 1 mục đối chiếu vào `<VAULT>/00-Brain/calibration.md` (phòng khuyến nghị → kết quả thực → đúng/sai).
- Nếu 1 phòng nhiều lần lệch ở 1 loại brief → ghi chú điều chỉnh persona/router; nếu nhiều lần đúng → cân nhắc tăng trọng số ý kiến phòng đó. (Vòng lặp học — nền cho cải tiến sau.)

### Bước 11b — Khép-vòng có tầng (PHA 3, luồng generic v3)

> Hiện-thực spec `03d`. **Engine xác-định:** `lib/loop.js` (`khepVong`/`congPass`/`congGiaiDoan`/`guardTelos`) + `lib/rule-engines.js#routeSongVong` + `lib/kho.js#them`. Tham-số **K** ở `knowledge/rule-engines/loop-config.yaml`. **Đo so neo OKR/KPI TRƯỚC**, rồi để engine quyết — KHÔNG ước-lượng tay.

**Bước nguyên-tử (theo verdict của `khepVong`):**
1. **Đo so neo:** `congPass({do_duoc, nguong})` cho từng nhiệm-vụ-chính (`dat_kpi` = mọi neo PASS). Đếm `vong_da_chay` = số dòng ĐÃ ghi ở `<VAULT>/00-Brain/lessons.md` cho task này.
2. **Gọi `khepVong({dat_kpi, vong_da_chay, co_so_that, tin_hieu, bien_co_the_gioi, co_bang_chung})`** → xử theo `ket`:
   - **`PASS`** → việc xong; sang Cổng PROMOTE (mục 3) + Cổng GIAI-ĐOẠN (mục 4).
   - **`DON_VONG`** (vong < K) — **KHÔNG pause** → vá tại-chỗ TRONG khuôn cũ (đổi tham-số/lịch/khuyến-mãi), **ghi 1 dòng `<VAULT>/00-Brain/lessons.md`** (tăng `vong_da_chay`), KHÔNG leo tầng → chạy lại. *Hành động vá chạm tiền/công-bố/pháp-lý sẽ bị cổng cứng của `/vn-execute` gác — KHÔNG gác 2 lần ở đây; chỉ notify CEO 1 dòng.*
   - **`SONG_VONG`** (hết K + có số thật) → engine trả `tang_leo`/`file_neo`:
     - `tang_leo == cau-truc` (tầng thấp nhất) — **KHÔNG pause riêng**: neo Brain + `decisions-log.md` nhãn `altitude` + **cascade** quay Bước 7. Điểm CEO duyệt rơi tự nhiên vào **Cổng A/B** của PHA 1 (tránh double-gate).
     - `tang_leo ∈ {định-vị, moat, telos}` — **✅ PAUSE (NEED-APPROVAL):** `AskUserQuestion` trình tầng leo + bằng-chứng → CEO duyệt → **ghi đúng file Brain tầng đó** + append `decisions-log.md` nhãn `altitude: <tang_leo>` + **cascade** quay Bước 7. *Engine đã chặn leo telos nếu thiếu biến-cố-thế-giới/bằng-chứng (`guardTelos`) — trả `CONG_CEO` thay vì leo; "đừng đổi telos vì 1 chiến-dịch lỗi".*
   - **`CONG_CEO`** (hết K chưa có số thật, HOẶC chạm telos thiếu biến-cố) — **✅ PAUSE:** `AskUserQuestion` (giết / đổi-hướng) ở main loop, KHÔNG lặp mù, KHÔNG tự sửa `telos.md`.
3. **Cổng PROMOTE (TÁCH BIỆT PASS) — KHÔNG pause, AUTO theo rubric:** tài-sản đạt reuse-grade A/B (`lib/kho.js#xetPromote`) → `lib/kho.js#them` chèn 1 dòng `_index.md`; **skill GHI file tài-sản** vào `knowledge/playbook/<ngành>/<Kx>/<dept>/<bộ-phận>/` (`kho.js` thuần — chỉ quản chỉ-mục, KHÔNG đụng filesystem). Chỉ tạo nhánh KHO khi CÓ tài-sản (không nhánh rỗng). Grade C/chưa chuẩn → không vào index. PASS ≠ PROMOTE. **Gom 1 thông báo** cuối lượt ("đã cất X, Y vào KHO"). *Tùy chọn: `<VAULT>/.vncoderc` có `promote_can_duyet: true` → chuyển PROMOTE thành PAUSE; mặc định AUTO (promote rẻ + đảo được + có rubric khách quan).*
4. **Cổng GIAI-ĐOẠN — ✅ PAUSE:** `congGiaiDoan({du_muc_tieu, stage, re_debate_pass})` → đủ mục-tiêu GĐ → **re-debate SỐ THẬT** (chạy lại Workflow `debate.js` khoanh phòng, chống mở-rộng-sớm) → quay main loop → `AskUserQuestion` trình kết-quả, CEO duyệt → `stage = stage_ke` (ghi `state.md`) → quay Bước 7 (PHA 1 mở chi-tiết GĐ kế). Re-debate FAIL → ở-lại GĐ (cờ `BLOCK_MO_RONG_SOM`).
5. **PHA 4 (GĐ5/6, lõi khỏe) — ✅ PAUSE:** `lib/flow.js#chay3PhepThu` (moat/telos/brand) → `AskUserQuestion` trình kết-quả 3-phép-thử + lựa chọn **GĐ5-nới/GĐ6-đẻ/brand-mới** → CEO duyệt mới `taiNhapBootstrap(ket3, can_dung, _index)` MỒI đường-cong mới từ KHO (đo `reuse_ratio` "trả lãi"). Nhánh GĐ6-đẻ/brand-mới = tái-nhập PHA 0/1 → bàn giao `/vn-onboard` (qua G0 lại) / `/vn-run`. KHÔNG mở-rộng khi stage < GĐ5.

**Sơ-đồ cổng (4 PAUSE · phần còn lại AUTO):** leo tầng ≥định-vị · CONG_CEO · cổng-giai-đoạn · PHA 4 = **NEED-APPROVAL**. Đo/verdict · vá đơn-vòng · leo tầng cấu-trúc (để Cổng A/B) · PROMOTE = **AUTO** (PROMOTE gom-báo, bật pause qua `promote_can_duyet`).

> Mọi cổng CEO ở main loop (`AskUserQuestion` KHÔNG chạy trong Workflow nền). Sau mỗi mốc: `git add/commit/push`.

---

## Quy ước chung

- **Slug:** `YYYY-MM-DD-hhmm-<kebab>` — dùng ngày giờ thực từ context.
- **Ngôn ngữ:** tiếng Việt; giữ thuật ngữ EN (KPI, OKR, ROAS…) nhưng định nghĩa lần đầu.
- **CEO-friendly:** mỗi output mở đầu TL;DR ≤3 câu.
- **Truy xuất được:** mọi khuyến nghị ghi rõ phòng đề xuất, trace về `views` JSON.
- **Cổng giám-sát tuân thủ (compliance, fail-closed):** ở mỗi ranh-giới pha (Cổng A/B Bước 7a, bàn-giao Bước 10, khép-vòng Bước 11) chạy cổng kiểm-toán `phaseAdvanceGate` — chỉ khai pha kế khi **DoD + cổng-pha + audit** đều PASS. STRATEGIC/COMPLEX giao agent `kiem-soat-vien` (read-only) soi chiều-sâu (F1 mô-tả-thay-thực-thi · F5 số bịa · F4 bỏ sót); F1/F2/F6 → DENY. Engine `lib/compliance.js` · CLI `npm run compliance` · SPEC `docs/design/giam-sat-tuan-thu/`.
