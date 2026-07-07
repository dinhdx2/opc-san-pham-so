---
name: vn-executor
description: Thực thi tự động một Execution Plan / SOP của vn-opc bằng tool & MCP thật (browser, Google Drive, web…), tự chạy các bước máy làm được và CHỈ dừng hỏi CEO khi cần thông tin hoặc cần phê duyệt; được cấp thông tin thì tự chạy tiếp tới khi hoàn thành. Dùng khi CEO gõ /vn-execute hoặc yêu cầu "thực thi / chạy / làm" một task đã có kế hoạch. Bản web/mobile — vault bằng file trong repo.
---

# Skill: vn-executor — Lớp THỰC THI (bản web/mobile)

> Trong vn-opc, `/vn-run` cho ra **quyết định + kế hoạch** (`08-execution-plan.md`) và các SOP chi tiết (`10-thuc-thi-*.md`). Những file đó là **tĩnh** — không tự làm gì.
> Skill này là **người làm việc**: đọc kế hoạch/SOP → biến thành **sổ thực thi** (run ledger) các bước nguyên tử → **tự chạy mọi bước máy làm được** bằng tool/MCP đang kết nối → **chỉ dừng lại hỏi** khi (a) thiếu thông tin/bí mật, hoặc (b) cần CEO phê duyệt một hành động ra ngoài / không hoàn tác → CEO đáp ứng xong thì **tự động chạy tiếp** đến khi hết việc máy làm được.

Nguyên tắc bất biến:
- **Tự động tối đa, hỏi tối thiểu.** Chỉ hỏi khi thật sự bị chặn (NEED-INFO) hoặc bắt buộc duyệt (NEED-APPROVAL). Không hỏi vụn vặt.
- **An toàn trước tốc độ.** Mọi hành động **tiền bạc / pháp lý / công bố ra ngoài / không hoàn tác** luôn là cổng phê duyệt — không bao giờ tự ý làm.
- **Không bịa bằng chứng.** Chỉ ghi `DONE` khi có bằng chứng thật (link, file, ảnh chụp, output). Việc người phải tự làm (KYC, nộp tiền) → AI chuẩn bị sẵn + giao checklist, KHÔNG giả vờ đã làm.
- **Tiếp tục được (resumable).** Sổ thực thi (`10-run-state.md`) là nguồn sự thật. Chạy lại `/vn-execute` luôn đọc sổ và tiếp tục đúng chỗ đang dở.
- Mọi output tiếng Việt, mở đầu TL;DR ≤3 câu.

---

## Bước 0 — Định vị task & nạp ngữ cảnh

1. Xác định **task folder** dưới `<VAULT>/02-Tasks/<slug>/`:
   - CEO chỉ rõ slug → dùng slug đó.
   - Không rõ → `Glob <VAULT>/02-Tasks/*/08-execution-plan.md`, chọn task mới/đang dở gần nhất; nếu nhiều, dùng `AskUserQuestion` cho CEO chọn.
2. Đọc bằng `Read` (bỏ qua file không tồn tại, ghi chú thiếu):
   - `08-execution-plan.md` (bắt buộc — nguồn đầu việc), `07-decision-report.md`, `09-ceo-approval.md`
   - Mọi `10-thuc-thi-*.md` (SOP chi tiết từng việc, nếu đã có)
   - `10-run-state.md` (sổ thực thi — nếu đã tồn tại từ lần chạy trước)
   - Brain: `<VAULT>/00-Brain/*.md`; cấu hình: `<VAULT>/.vncoderc`
3. **Khám phá tool đang kết nối** (đừng giả định): dùng `ToolSearch` để biết có gì dùng được, ví dụ:
   - Trình duyệt (Playwright/Chromium pre-installed; "Claude in Chrome" nếu phiên có) → thao tác web.
   - `mcp__Google_Drive__*` → đọc/ghi tài liệu, lưu output ra Drive.
   - `mcp__github__*` → tạo file/commit.
   - `WebSearch`/`WebFetch` → tra cứu số liệu thật (phí, giá, quy định).
   Ghi lại "bộ tool khả dụng" để map vào từng bước ở Bước 2.

---

## Bước 1 — Dựng / làm mới SỔ THỰC THI (`10-run-state.md`)

Phân rã mỗi đầu việc trong `08-execution-plan.md` (và mỗi SOP `10-thuc-thi-*`) thành **bước nguyên tử** — một bước = một hành động kiểm chứng được. Mỗi bước ghi vào bảng:

| Cột | Ý nghĩa |
|---|---|
| `id` | mã bước, vd `W1-01` (Tuần 1, việc 1) |
| `hành động` | mô tả ngắn, hành động cụ thể |
| `owner` | `AI` / `AI+Human` / `Human` (xem Bước 2) |
| `tool` | tool/MCP sẽ dùng (browser / drive / web / file / —) |
| `cần (input)` | dữ liệu/bí mật/điều kiện tiên quyết để làm được |
| `cổng` | `none` / `NEED-INFO` / `NEED-APPROVAL` |
| `phụ thuộc` | id bước phải xong trước |
| `trạng thái` | `TODO`/`DOING`/`BLOCKED-INFO`/`BLOCKED-APPROVE`/`HUMAN`/`DONE`/`FAILED` |
| `bằng chứng` | link/file/ảnh/ghi chú kết quả |

Nếu sổ đã tồn tại: **không ghi đè** — đối chiếu, thêm bước mới, giữ nguyên trạng thái bước cũ.
Mẫu sổ: `knowledge/templates-vn/_orchestrator/run-ledger.md`.

---

## Bước 2 — Phân loại khả năng tự động hoá từng bước

Gán `owner` + `cổng` cho mỗi bước theo 4 nhóm:

| Nhóm | Định nghĩa | Hành xử của executor |
|---|---|---|
| **AI-AUTO** (`owner=AI`, `cổng=none`) | Máy làm trọn vẹn ngay bằng tool kết nối, không ra tiền/không công bố | **Tự chạy** không cần hỏi. VD: soạn 4 trang policy theo FTC, viết 9 ad copy, brief mockup, tra phí PayPal/Payoneer thật, dựng dashboard/CSV, điền form nháp, gom checklist. |
| **NEED-INFO** (`cổng=NEED-INFO`) | Bị chặn vì thiếu dữ liệu/bí mật/quyết định của CEO | Để `BLOCKED-INFO`, gom lại hỏi 1 lượt (Bước 3). VD: giá bán thực mỗi SP, mật khẩu/khoá API, chọn domain, số thẻ quỹ COGS. |
| **NEED-APPROVAL** (`cổng=NEED-APPROVAL`) | AI **chuẩn bị xong**, nhưng hành động **ra ngoài / tốn tiền / khó hoàn tác** | AI làm hết phần nháp → để `BLOCKED-APPROVE` → trình CEO bấm duyệt rồi mới thực thi. VD: đăng store live, bật/đổ tiền ads, submit form đăng ký, gửi tiền, publish trang. |
| **HUMAN-ONLY** (`owner=Human`) | Bắt buộc con người thật (định danh/sinh trắc/đến ngân hàng) | AI **không thể thay**: soạn checklist "tự làm từng bước" + tiêu chí "xong = ?" → giao CEO; chờ CEO báo xong + bằng chứng. VD: mở **PayPal Business** (KYC), test giao dịch $1 thật. |

Quy tắc cứng — luôn xếp NEED-APPROVAL (không bao giờ AI-AUTO): chi tiền, ký/nộp hồ sơ pháp lý, công bố nội dung ra công chúng, gửi email/tin ra ngoài, thao tác xoá/ghi đè không hoàn tác, bất cứ việc nào CLAUDE.md/Brain đánh dấu cần chuyên gia rà (pháp lý/kế toán).

**Ánh-xạ lăng-kính 3 chiều (luồng generic v3, LG-9-lens-3chieu):** nhiệm-vụ-con từ PHA 1 mang `chiều ∈ {tấn, thủ, hậu}`. Map vào cột phân-loại:
- **tấn** (việc LÀM tạo state) → thường **AI-AUTO** (máy làm nháp/deliverable) trừ khi chạm ranh-giới cứng.
- **thủ** (việc GÁC, "hỏng kiểu gì?") → ưu-tiên soi **NEED-APPROVAL** (cổng chặn rủi-ro) + KPI-ngưỡng.
- **hậu** (CẤP nguồn-lực: tiền/máy/dữ-liệu/người) → thường **NEED-INFO** (thiếu secret/dữ-liệu) hoặc **HUMAN-ONLY**.

Cổng cứng vẫn ƯU-TIÊN CAO NHẤT (chạy TRƯỚC mọi ánh-xạ chiều): tham-chiếu `lib/flow.js#phanLoaiBuoc` cho luật xác-định.

---

## Bước 3 — VÒNG LẶP THỰC THI (trái tim của skill)

Lặp tới khi mọi bước ở trạng thái cuối (`DONE` / `HUMAN` đã giao / `FAILED` đã ghi rõ):

1. **Chọn bước chạy được:** các bước `TODO`/đã được gỡ chặn mà `phụ thuộc` đã `DONE` và `cần (input)` đã đủ.
2. **Chạy AI-AUTO ngay** (không hỏi): đặt `DOING` → dùng tool/MCP map ở Bước 2 thực thi → lưu kết quả vào `<VAULT>/03-Outputs/<slug>/` (hoặc Drive nếu CEO muốn) → ghi `bằng chứng` → đặt `DONE`. Việc nặng/độc lập có thể giao agent `executor` (xem Bước 4) hoặc chạy song song nhiều agent trong 1 message.
3. **Với NEED-APPROVAL:** làm xong toàn bộ phần nháp/chuẩn bị trước, rồi để `BLOCKED-APPROVE`.
4. **Khi hết bước tự chạy được → gom cổng, hỏi 1 lượt:** tập hợp TẤT CẢ bước đang `BLOCKED-INFO` + `BLOCKED-APPROVE`, dùng **một** `AskUserQuestion` (gộp nhiều câu, mỗi câu kèm 2–4 phương án; nêu rõ "việc gì, cần gì, vì sao chặn"). Đừng hỏi rải rác từng bước.
5. **Nhận đáp ứng → tự gỡ chặn:** ghi câu trả lời/giá trị vào sổ + `03-clarification.md` (append), chuyển bước sang `TODO`, **quay lại bước 1 của vòng lặp và tự chạy tiếp** — không chờ CEO nhắc.
6. **HUMAN-ONLY:** xuất checklist tự làm + tiêu chí nghiệm thu vào `10-thuc-thi-<n>-*.md`, đặt `HUMAN`, nêu rõ trong báo cáo "đang chờ CEO tự làm việc X". Không chặn các nhánh khác — tiếp tục mọi việc không phụ thuộc nó.
7. **Lỗi:** retry hợp lý (vd thao tác mạng) tối đa vài lần; vẫn lỗi → `FAILED` + ghi nguyên nhân + đề xuất cách xử lý, không lặng lẽ bỏ qua.

Sau **mỗi** thay đổi trạng thái, cập nhật `10-run-state.md` ngay (sổ là nguồn sự thật để resume). **Kiểm bất-biến sổ bằng engine** `lib/flow.js#validateRunState(rows)` (E1 `DONE ⇒ bằng-chứng ≠ null` chống bịa · E2 `cong ⟂ loai`: `none ⟺ AI_AUTO`, `HUMAN_ONLY ⇒ HUMAN`): nếu trả `errors` ≠ [] → SỬA dòng sai trước khi đi tiếp, KHÔNG ghi `DONE` thiếu bằng-chứng. Khi resume (đầu Bước 1, đọc sổ cũ): chạy `lib/flow.js#validateResume(prev, next)` để chắc bước `DONE` cũ KHÔNG bị chạy lại/ghi-đè (E3).

---

## Bước 4 — Giao việc cho agent `executor` (tuỳ chọn)

Với bước AI-AUTO nặng/độc lập (research sâu 1 việc, soạn 1 bộ tài liệu, thao tác browser nhiều bước), spawn agent `executor` qua **Agent tool** để tách ngữ cảnh; nhiều việc độc lập → gửi nhiều Agent trong **một** message để chạy song song. Mỗi agent trả kết quả + đường dẫn file đã tạo; executor (skill, ở main loop) ghi vào sổ và xử lý cổng.

> Lưu ý: **Cổng HITL (hỏi/duyệt) luôn ở main loop của skill này** — vì `AskUserQuestion` chỉ hoạt động ở main loop, không hoạt động trong Workflow chạy nền. Đừng dùng Workflow tool cho các bước cần phê duyệt giữa chừng.

---

## Bước 5 — Lưu output & bằng chứng

- Kết quả mỗi bước AI-AUTO/NEED-APPROVAL lưu `<VAULT>/03-Outputs/<slug>/<id>-<tên>.md` (hoặc `.csv`); nếu CEO muốn trên Google Drive và có `mcp__Google_Drive__*` → tạo file Drive và lưu link vào sổ.
- SOP chi tiết từng việc (kể cả việc HUMAN-ONLY) lưu `<VAULT>/02-Tasks/<slug>/10-thuc-thi-<n>-<slug-viec>.md` đúng như tên ví dụ CEO đã nêu.
- Ảnh chụp màn hình thao tác browser (nếu có) lưu kèm và link trong cột `bằng chứng`.

---

## Bước 6 — Báo cáo tiến độ cho CEO

Mỗi lượt dừng (hỏi cổng) hoặc khi hoàn tất, in:
- **TL;DR ≤3 câu:** đã tự làm xong gì / đang chặn ở đâu / cần CEO làm gì tiếp.
- **Bảng tiến độ:** `% hoàn thành` (DONE / tổng), số bước theo trạng thái.
- **Đang chờ CEO:** danh sách NEED-INFO + NEED-APPROVAL + HUMAN-ONLY (rõ "ai làm gì").
- **Tự chạy tiếp khi:** liệt kê việc sẽ tự động làm ngay sau khi CEO đáp ứng cổng.

---

## Bước 6.5 — CỔNG GIÁM-SÁT TUÂN THỦ (compliance — fail-closed)

Trước khi khai một bước `DONE`, trước khi báo "hoàn thành task", và trước khi bàn giao khép-vòng: **chạy cổng kiểm-toán** (SPEC `docs/design/giam-sat-tuan-thu/`). Đây là chặn PHA 2 khỏi lỗi "mô-tả thay vì thực-thi" + "sai chỗ".

1. **Engine (bắt buộc):** `npm run compliance <VAULT>/02-Tasks/<slug>/10-run-state.md` (gọi `lib/compliance.js`). Đọc vi-phạm:
   - **F1** (bước cần tool nhưng bằng-chứng là SOP/khung/spec/"mô-phỏng") · **F2** (bằng-chứng không resolve) · **F6** (qua ranh-giới cứng) → **DENY**: DỪNG, sửa (làm THẬT bằng tool/MCP, hoặc khai `HUMAN` trung-thực, hoặc bổ-sung bằng-chứng resolve được) rồi mới khai DONE.
   - **F3** (process nằm `03-Outputs/`) → **WARN**: ghi nhận, dời sang `02-Tasks/` khi tiện.
2. **Bằng-chứng phải THẬT:** bước `TOOL_EXEC` (deploy/tra-cứu/build/ráp) → `DONE` ⇔ có **file resolve được / URL sống / ảnh / nguồn trích-dẫn / giao-dịch thật**. Ghi bằng-chứng bằng **đường-dẫn đầy-đủ hoặc URL có `https://`** (để resolve được), KHÔNG chỉ mô-tả bằng lời.
3. **Đặt đúng chỗ:** deliverable thật → `03-Outputs/`; SOP/spec/checklist/khung/interim → `02-Tasks/`.
4. **BẮT BUỘC chạy agent `kiem-soat-vien` TRƯỚC KHI báo task hoàn-thành** (không được skip — engine chỉ bắt cơ-học; agent bắt chiều-sâu: research không nguồn · **khung/kết-quả rỗng khai DONE** · **status khống** vd asset register khai ACTIVE cho thứ chưa sản-xuất · số bịa). Giao qua Agent tool (read-only), yêu-cầu MỞ từng file bằng-chứng; nhận JSON verdict; `VIOLATIONS` → xử như **DENY** (đi làm THẬT hoặc khai đúng trạng-thái, KHÔNG dán nhãn cho qua). *Bài học 2026-07-06: bỏ bước này → lọt F1 9.5a (bảng kết-quả trống) & 6.2a (khai khống asset) mà engine không bắt được.*
5. Ghi kết-quả cổng (engine + agent) vào `11-compliance.md` (append-only) + rollup 1 dòng vào TL;DR `10-run-state.md`.

> Bất-biến: engine kiểm cơ-học (E1/E4/E5/E6/E7), agent kiểm chiều-sâu. Cổng CỨNG (ranh-giới tiền/pháp-lý, evidence-real, fail-closed) **không tắt**.

---

## Bước 7 — Lưu bền vững (BẮT BUỘC trên web)

Môi trường web ephemeral → sau khi cập nhật sổ/outputs, chạy:
```
git add <VAULT>/ && git commit -m "vn-exec: <slug> — <tóm tắt bước>" && git push -u origin <branch>
```
để không mất tiến độ giữa các phiên. Commit sau mỗi mốc đáng kể (xong 1 cụm bước, hoặc trước khi dừng hỏi CEO).

---

## Quy ước chung
- **Resume:** `/vn-execute` lần sau chỉ đọc `10-run-state.md` và tiếp tục — không làm lại bước `DONE`.
- **Phạm vi 1 lượt:** tự chạy hết mọi bước AI-AUTO khả thi rồi mới dừng — không dừng nửa chừng nếu còn việc máy làm được.
- **Tiếng Việt**, giữ thuật ngữ EN (KYC, ROAS, CAPI…) nhưng định nghĩa lần đầu.
- **Truy xuất được:** mỗi bước `DONE` phải có `bằng chứng`; mỗi quyết định gỡ cổng ghi lại trong `03-clarification.md`.
