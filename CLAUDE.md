# opc-san-pham-so — hướng dẫn cho phiên Claude Code

Repo này là một **hệ điều hành DN bằng AI** (12 phòng ban debate → quyết định → tài liệu), chạy trực tiếp trong phiên Claude Code web/mobile.

> **Ngữ cảnh đầu phiên (đảm bảo đầy đủ, không phụ-thuộc hook):** Bản đồ ngữ-cảnh **đầy-đủ** được nạp thẳng vào **mọi** phiên qua import `@docs/AI-CONTEXT.md` ở cuối file này (kiến-trúc 2 lớp + sơ-đồ-tổng PHA 0→4, file map, API engine `lib/`, mô-hình vault, quy-tắc cứng) — vì `CLAUDE.md` luôn được nạp nguyên-văn, không bị cắt như output hook. Hướng-dẫn cho CEO: `docs/HUONG-DAN-VAN-HANH.md`.
>
> **Trạng thái sống (động):** đầu mỗi phiên có làm việc với DN, đọc `.vn-active-vault` (gốc repo) → `<vault>/.vncoderc` + `<vault>/00-Brain/*.md` để nắm **vault active · stage · Brain coverage · task gần đây** trước khi thực thi (hoặc gõ `/vn-status`). Engine resolve vault: `lib/vault.js#resolveActiveVault`.

## Cách dùng trong phiên này
Khi CEO gõ một trong các lệnh (hoặc yêu cầu tương đương bằng lời):

| Lệnh | Hành động | Skill |
|---|---|---|
| `/vn-onboard "<DN + ngành>"` | Thiết lập ngành + phòng ban active | `.claude/skills/vn-onboarder` |
| `/vn-run "<brief>"` | Họp hội đồng: Brain → router → debate → 3 pause CEO duyệt → tài liệu | `.claude/skills/vn-orchestrator` |
| `/vn-execute "<task>"` | **THỰC THI** kế hoạch/SOP: tự chạy bước máy làm được bằng tool/MCP, chỉ dừng hỏi khi cần thông tin/phê duyệt, đáp ứng xong tự chạy tiếp tới khi hoàn thành | `.claude/skills/vn-executor` |
| `/vn-loop "<task> — <số thật>"` | **KHÉP-VÒNG (PHA 3) + mở-rộng (PHA 4):** đo so neo → đơn/song-vòng → PASS/PROMOTE → cổng-giai-đoạn → (GĐ5/6) 3-phép-thử. Cửa vào Bước 11/11b orchestrator | `.claude/commands/vn-loop.md` |
| `/vn-playbook [dọn\|deprecate <id>]` | **KHO tái-dùng:** soi kho tài-sản (cấp repo/ngành) · dọn định-kỳ (gộp trùng/hạ-cấp) · deprecate. KHÔNG đụng TRA/PROMOTE (giữ AUTO) | `.claude/commands/vn-playbook.md` |
| `/vn-status` | Tóm tắt trạng thái vault | `.claude/commands/vn-status.md` |
| `/vn-meeting <task>` | Chạy lại debate cho 1 task | `.claude/commands/vn-meeting.md` |

**Ba lớp tách bạch:** `/vn-run` cho ra **quyết định + kế hoạch** (tĩnh: `07/08-*.md`, `10-thuc-thi-*.md`). `/vn-execute` là lớp **làm việc**: biến kế hoạch thành **sổ thực thi** `10-run-state.md` (các bước nguyên tử có phân loại AI-AUTO / NEED-INFO / NEED-APPROVAL / HUMAN-ONLY) rồi tự động chạy, gom cổng hỏi CEO 1 lượt, resume được khi chạy lại. `/vn-loop` là lớp **khép-vòng**: khi task đã có **SỐ THẬT**, đo so neo OKR/KPI → đơn-vòng (vá rẻ) / song-vòng (leo tầng) / PASS+PROMOTE / cổng-giai-đoạn / (GĐ5-6) mở-rộng — gom **4 cổng PAUSE** cho CEO (leo tầng ≥định-vị · CONG_CEO · cổng-giai-đoạn · PHA 4), phần còn lại tự chạy (PROMOTE AUTO theo rubric).

## Nguyên tắc môi trường web/mobile
- **Multi-vault:** mỗi ý-tưởng/DN một vault riêng `vaults/<slug>/`; con-trỏ `.vn-active-vault` (gốc repo) chọn vault đang dùng, fallback `vault/` cũ. Resolve qua `lib/vault.js#resolveActiveVault`; tạo vault mới bằng `/vn-onboard` (slug do AI đề-xuất, CEO duyệt). Đọc/ghi bằng `Read`/`Write`/`Glob`/`Edit` (KHÔNG dùng MCP Obsidian — không tồn tại trên web).
- **Agent phòng ban** resolve từ `.claude/agents/dept-XX-*.md` (dùng làm `agentType` trong Workflow `workflows/debate.js`).
- **Persona phòng ban đọc PER-VAULT (chỉ-đọc-vault):** mỗi DN có bộ hồ sơ riêng `<vault>/01-Departments/` (12 phòng nền + phòng pack/mới, đã tinh chỉnh theo ngữ-cảnh DN lúc `/vn-onboard` Bước 6c). Debate/router KHÔNG fallback về `knowledge/departments/` (đó là KHUÔN SINH — chỉ dùng để sao khi onboard); vault thiếu hồ sơ phòng → agent trả `persona_missing: true`, cần backfill. **Luật/template chung** vẫn đọc từ `knowledge/` bằng đường dẫn tương đối (CWD = gốc repo).
- **Lưu bền vững:** môi trường web là ephemeral → sau khi ghi vào `vault/`, luôn `git add/commit/push` để không mất dữ liệu DN.
- Mọi output tiếng Việt, mở đầu bằng TL;DR ≤3 câu. Tài liệu pháp lý/kế toán đều là MẪU, cần chuyên gia rà.

## Khi chạy debate (Workflow)
`/vn-run` là lệnh CEO chủ động → đủ điều kiện opt-in để gọi Workflow tool với `workflows/debate.js`.

## Khi thực thi (vn-executor)
- **Cổng người-trong-vòng-lặp (HITL) ở main loop**, KHÔNG dùng Workflow: `AskUserQuestion` chỉ chạy ở main loop, không chạy trong Workflow nền. Việc nặng/độc lập có thể giao agent `executor` qua **Agent tool** (nhiều việc độc lập → 1 message để chạy song song).
- **Khám phá tool/MCP bằng `ToolSearch`** trước khi dùng (browser, `mcp__Google_Drive__*`…) — đừng giả định có sẵn.
- **Ranh giới CỨNG luôn cần CEO duyệt:** chi tiền, ký/nộp hồ sơ pháp lý, công bố ra ngoài, gửi email/tin, thao tác không hoàn tác. Không bịa bằng chứng "đã làm".
- Sổ `10-run-state.md` là nguồn sự thật để resume; commit/push sau mỗi mốc.

## Luồng generic v3 (trục dọc sinh-thành)
Phần **generic** (bảng/luật cố-định) đã được hiện-thực thành **engine xác-định + test** dưới `lib/` + config `knowledge/{taxonomy,rule-engines}/*.yaml`; phần **phân-rã** sống ở prompt skill. Spec gốc: `docs/design/luong-generic-v3/specs/`.
- `lib/brain.js` (Brain 2 lớp + G0 + validate nội-dung canonical) · `lib/taxonomy.js` (11 khía-cạnh/7 khối) · `lib/rule-engines.js` (6 hàm) · `lib/tier.js` (validate đúng-tầng + sinh nhiệm-vụ-chính 3 lớp) · `lib/kho.js` (KHO _index 13 cột + dọn định-kỳ + cây thư-mục) · `lib/flow.js` (router/cổng cứng/3-phép-thử/bootstrap + state-machine luồng PHA0→4) · `lib/loop.js` (khép-vòng PHA 3: K-vòng/PASS/cổng GĐ/guard telos). Skill `vn-architect` chạy PHA 1.
- **Kiểm trước khi đổi:** `npm test` (164 case §8 + golden Phở Hà) · `npm run check-impl` (điểm-cắm tồn-tại + test xanh + claim phủ). Sửa bảng generic → sửa YAML 1 nơi, KHÔNG hard-code rải-rác (bất-biến C4).
- **GIỮ NGUYÊN** engine debate/router/executor/HITL/grounding — trục dọc chỉ THÊM.

## Giám sát tuân thủ (compliance — fail-closed, áp MỌI lệnh/yêu-cầu)
Cơ-chế cưỡng-chế để **không bỏ sót bước** và **không "mô-tả thay vì thực-thi thật"** khắp luồng PHA 0→4. Engine: `lib/compliance.js` + `knowledge/rule-engines/compliance.yaml`; CLI `npm run compliance <đường-dẫn 10-run-state.md>`; agent `kiem-soat-vien` soi chiều-sâu; spec `docs/design/giam-sat-tuan-thu/SPEC.md`.
- **Ở CỔNG PHA / trước khi khai DONE hoặc báo hoàn-thành:** chạy cổng kiểm-toán (engine + placement + coverage; STRATEGIC/COMPLEX thêm agent `kiem-soat-vien`). Vi-phạm **F1/F2/F6 → DENY (DỪNG, sửa rồi mới đi tiếp)**; **F3 → WARN**.
- **Bằng-chứng phải THẬT:** bước cần tool (deploy/tra-cứu/build) → DONE ⇔ có **file resolve được / URL sống / ảnh / nguồn trích-dẫn / giao-dịch thật**; SOP/khung/spec/"mô-phỏng" **KHÔNG** tính là DONE (đó là F1).
- **Đúng chỗ:** `03-Outputs/` chỉ chứa **deliverable thật**; SOP/spec/checklist/khung/interim → `02-Tasks/`.
- Chi-tiết bất-biến E1–E9 + taxonomy F1–F8: xem SPEC. Trục compliance chỉ **THÊM** (C4/C6), không sửa engine cũ.

---

## Bản đồ ngữ-cảnh đầy-đủ (import — nạp vào mọi phiên)

> Toàn văn `docs/AI-CONTEXT.md` được import ngay dưới đây để **mọi phiên có đủ ngữ-cảnh** (kiến-trúc, file-map, API engine `lib/`, mô-hình vault, thuật-ngữ) — thay cho SessionStart hook (hook bị cắt output khi >~2KB nên không đảm-bảo). Token tốn thêm là chủ-ý: ưu-tiên chất-lượng. Sửa bản-đồ → sửa `docs/AI-CONTEXT.md` (1 nơi duy-nhất).

@docs/AI-CONTEXT.md
