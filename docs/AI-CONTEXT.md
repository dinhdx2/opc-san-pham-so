# AI-CONTEXT — Bản đồ ngữ cảnh cho phiên Claude Code

> **Mục đích:** đây là *bản đồ ngữ cảnh đầy-đủ-mà-đặc* để mỗi phiên Claude Code mới hiểu trọn hệ
> thống. File này được **`CLAUDE.md` import** (`@docs/AI-CONTEXT.md`) nên **nạp nguyên-văn vào MỌI phiên**
> (CLAUDE.md luôn auto-load, không bị cắt) — không phụ-thuộc hook. **Trạng thái sống** (vault active, Brain
> coverage, task gần đây) là phần ĐỘNG: đọc trực-tiếp `.vn-active-vault` + `<vault>/00-Brain/*` đầu phiên
> (hoặc `/vn-status`). Khi cần chi-tiết sâu hơn → đọc file được trỏ ở [Tra cứu nhanh](#tra-cứu-nhanh-cần-x--đọc-đâu).
> Quy ước cứng nằm ở `CLAUDE.md`; file này KHÔNG lặp lại mà BỔ SUNG bản đồ + API + thuật ngữ.

---

## 1. Hệ thống này là gì (1 đoạn)

`opc-san-pham-so` là **hệ điều hành doanh nghiệp bằng AI** chạy *native trong phiên Claude Code web/mobile*,
**không cần API key** (dùng model qua gói subscription). CEO chat 1 câu → **12 phòng ban AI tranh luận
đối kháng** (debate) → ra **quyết định + kế hoạch** → rồi một lớp riêng **tự thực thi** kế hoạch bằng
tool/MCP thật. Dữ liệu DN sống trong **vault = thư mục file trong repo** (đọc/ghi bằng `Read/Write/Glob/Edit`,
KHÔNG dùng MCP Obsidian). Môi trường web **ephemeral** → phải `git commit/push` sau mỗi mốc để khỏi mất dữ liệu.

## 2. Ba lớp tách bạch (xương sống — nhớ kỹ)

```
LỚP QUYẾT ĐỊNH  /vn-run "<brief>"   → skill vn-orchestrator → workflows/debate.js
   Brain → Router(SIMPLE/COMPLEX/STRATEGIC) → 4 pha debate → 3 PAUSE CEO duyệt → tài liệu TĨNH
   Output: 02-router.md · 05-debate.md · 07-decision-report.md · 08-execution-plan.md · 06-structure.md

LỚP THỰC THI    /vn-execute "<task>" → skill vn-executor (KHÔNG dùng Workflow)
   08-execution-plan + SOP → sổ 10-run-state.md (bước nguyên tử, phân loại 4 nhóm)
   → VÒNG LẶP tự chạy AI-AUTO → gom cổng hỏi CEO 1 lượt (AskUserQuestion) → chạy tiếp → resume được
   Output: 10-run-state.md · 03-Outputs/<slug>/* (deliverable thật) · 10-thuc-thi-*.md (SOP)

LỚP KHÉP-VÒNG   /vn-loop "<task> — <số thật>" → vn-orchestrator Bước 11/11b (PHA 3 → PHA 4)
   đo so neo OKR/KPI (lib/loop.js) → khepVong: ĐƠN-VÒNG(≤K vá rẻ)/SONG-VÒNG(leo tầng+cascade)/PASS
   → PROMOTE(kho.js, AUTO) → cổng-giai-đoạn(re-debate số thật) → (GĐ5/6) flow.chay3PhepThu mở-rộng
   4 PAUSE: leo tầng ≥định-vị · CONG_CEO · cổng-giai-đoạn · PHA 4 (còn lại AUTO)
   Output: 00-Brain/lessons.md · decisions-log.md(altitude) · calibration.md · playbook/_index.md
```

- `/vn-run` cho ra **quyết định + kế hoạch** (tĩnh, không tự làm gì).
- `/vn-execute` **làm việc thật**: biến kế hoạch thành sổ thực thi rồi tự động hoá, chỉ dừng hỏi khi
  cần thông tin (NEED-INFO) hoặc phê duyệt (NEED-APPROVAL); đáp ứng xong tự chạy tiếp tới khi xong.
- `/vn-loop` **khép-vòng khi đã có SỐ THẬT**: đo → đơn/song-vòng → PASS/PROMOTE → cổng-giai-đoạn →
  (GĐ5/6) mở-rộng. Engine xác-định `lib/loop.js`+`flow.chay3PhepThu`; mọi cổng CEO ở main loop.
- **Trục ngang** (12 phòng debate) cho *chất-lượng quyết-định*. **Trục dọc** (generic v3) cho *sinh-thành chiều-sâu* (telos→cấu-trúc) + *khép-vòng có tầng*. Trục dọc chỉ **THÊM**, KHÔNG đụng engine ngang.

## 3. Bản đồ thư mục (mỗi mục = 1 dòng vai trò)

| Đường dẫn | Vai trò |
|---|---|
| `CLAUDE.md` | Quy ước cứng cho phiên (auto-load). Bảng lệnh, nguyên tắc web/mobile, ranh-giới HITL. |
| `README.md` | Giới thiệu sản phẩm + cài đặt + kiến trúc (cho người đọc GitHub). |
| `docs/AI-CONTEXT.md` | **File này** — bản đồ ngữ cảnh cho phiên AI. |
| `docs/HUONG-DAN-VAN-HANH.md` | Hướng dẫn vận hành chi-tiết cho CEO (người dùng). |
| `commands/*.md` | 7 slash-command: `vn-run · vn-onboard · vn-execute · vn-loop · vn-playbook · vn-status · vn-meeting` (đều `$ARGUMENTS` → kích hoạt skill). `vn-loop` = cửa vào lớp khép-vòng (PHA 3/4, Bước 11/11b orchestrator); `vn-playbook` = người-gác-KHO (soi/dọn/deprecate, KHÔNG đụng TRA/PROMOTE auto). |
| `skills/vn-orchestrator/SKILL.md` | Điều phối debate: 11 bước (vault→Brain→G0→router→3 PAUSE→tài liệu→bàn giao thực thi→khép-vòng). |
| `skills/vn-executor/SKILL.md` | Lớp thực thi: 7 bước (định vị task→sổ→phân loại 4 nhóm→vòng lặp→giao agent→lưu→báo cáo). |
| `skills/vn-onboarder/SKILL.md` | Onboard DN: tạo vault mới + match/sinh pack ngành + seed Brain + `.vncoderc`. |
| `skills/vn-architect/SKILL.md` | PHA 1 sinh-thành: duyệt 11 khía-cạnh → cây việc → gom-ngược cây cấu-trúc + tra-KHO (cổng A/B). |
| `.claude/{skills,agents,commands}/` | **Bản plugin được Claude Code nạp** (mirror của thư mục gốc cùng tên). Sửa skill/agent → đồng bộ cả 2 nơi. |
| `agents/dept-01..12-*.md` | 12 agent phòng ban **nền** (agentType trong debate, cấp repo dùng chung). Persona chi-tiết đọc **PER-VAULT** từ `<vault>/01-Departments/<phòng>/` (chỉ-đọc-vault; thiếu → trả `persona_missing: true`, cần backfill). Phòng **pack ngành** (mã ≥13) do `/vn-onboard` sinh khi kích-hoạt pack — KHÔNG cố-định trong bộ nền. |
| `agents/{synthesizer,pack-architect,executor}.md` | Tổng-hợp report · sinh pack ngành lạ · người thực thi việc nặng (Agent tool). |
| `workflows/debate.js` | Engine debate v2 (4 pha): Perspectives→Cross-examination→Red-team→Synthesize. Set model TƯỜNG MINH (tiering). |
| `lib/*.js` | **Engine xác-định** generic v3 (PURE, có test). Xem §4. |
| `tools/check-impl.js` · `tools/impl-manifest.js` | Trình kiểm "implement đúng spec": điểm-cắm tồn-tại + test xanh + claim phủ. `npm run check-impl`. |
| `test/*.test.js` · `test/run.js` | 164 case (§8 acceptance từng spec) + golden Phở Hà + artifact-layout + wiring-map + invariant. `npm test`. |
| `knowledge/brain-schema.md` | Brain Contract (5 canonical + 2 bộ-nhớ) + Brain 2 lớp + cổng G0 + grounding. |
| `knowledge/taxonomy/{aspects,blocks}.yaml` | 11 khía-cạnh (4 nhóm MECE) · 7 khối (phủ 12 phòng). Driver cho `lib/taxonomy.js`. |
| `knowledge/rule-engines/*.yaml` | 6 bảng tĩnh: stage-rubric · loop-routing · aspect-goal · taskgen-grid · reuse-rubric · naming-canonical. |
| `knowledge/departments/*/department.yaml` | **KHUÔN SINH** hồ sơ 12 phòng nền (persona + alias + phạm vi). `/vn-onboard` (Bước 6c) sao vào `<vault>/01-Departments/` rồi tinh chỉnh theo DN; runtime debate/router KHÔNG đọc trực-tiếp từ đây. |
| `knowledge/packs/{fnb,retail,tech-saas,digital-products,_schema}/` | 4 pack ngành sẵn + schema validator. Pack = thêm phòng/luật/template ngành. |
| `knowledge/templates-vn/<phòng>/*.md` | 183 template tuân thủ luật VN (MẪU) + `_orchestrator/` (11 file: intake, run-ledger, decision-map…). |
| `knowledge/playbook/` | KHO `_index.md` (13 cột) — tài-sản tái dùng đã PROMOTE (reuse-grade A/B). |
| `vault/` (legacy) · `vaults/<slug>/` | **Vault DN.** Mỗi DN 1 vault. Con-trỏ `.vn-active-vault` (gốc repo) chọn vault đang dùng. |
| `vaults/_TEMPLATE/` | Khung vault rỗng để `/vn-onboard` sao ra vault mới (có `00-Brain/_SEED.md`). |
| `docs/design/luong-generic-v3/` | Bộ spec gốc (SoT `luong-generic-v3.html` + 15 spec + `tools/check-coverage.js`). Đọc khi sửa engine. |

## 4. Engine xác-định `lib/` (API bề mặt — gọi/đọc khi cần luật chính xác)

| File | Xuất ra (hàm chính) | Việc |
|---|---|---|
| `lib/vault.js` | `resolveActiveVault · setActiveVault · listVaults · slugify · uniqueSlug` | Multi-vault: con-trỏ `.vn-active-vault`, slug tiếng Việt→kebab, fallback `vault/`. |
| `lib/brain.js` | `validateBrain · runGateG0 · countCoverage5 · validateCanonContent · normStage · FILE_ALTITUDE · STAGES` | Brain 2 lớp: validate 5 canonical + lớp sinh-thành + **nội-dung per-file** (ICP/unit-econ/số thật/altitude); **cổng G0** (approved_by mở-đầu CEO); `normStage` chuẩn-hoá GĐ→GD. |
| `lib/taxonomy.js` | `deptsOfAspect · blockOfDept · assertPartition · validateTenKep` | 11 khía-cạnh ↔ 12 phòng ↔ 7 khối (MECE). Tên-kép 3 nhãn. |
| `lib/rule-engines.js` | `detectStage · detectStagePerCurve · routeSongVong · goalByAspect · taskGenGrid · reuseDecision · namingResolve · REUSE_CONFIG` | 6 hàm PURE từ 6 YAML. Phát-hiện GĐ (+ per-đường-cong), định-tuyến tầng leo, mục-tiêu theo khía-cạnh, reuse A/B/C (ngưỡng ở `reuse-config.yaml`). |
| `lib/tier.js` | `validateDungTang · sinhNhiemVuChinh · validateCayViec · TANG` | Chống nén tầng (mục-tiêu=TRẠNG-THÁI, nv-chính=ĐỘNG-TỪ, `dang_ngon_ngu` khớp tầng §3.2). Sinh nhiệm-vụ-chính 3 lớp + cổng đủ/tối-thiểu(giữ thủ/hậu)/không-trùng. **`validateCayViec`: cổng chống "quên bẻ nv-con" — mỗi NVC phải có ≥1 nhiệm-vụ-con khai chiều tấn/thủ/hậu (chạy TRƯỚC Cổng B của vn-architect).** |
| `lib/kho.js` | `them · xetPromote · tra · don · raDinhKy · cayThuMuc · serializeIndexMd · parseIndexMd · TANG_ENUM` | KHO `_index.md` 13 cột: PROMOTE (them — chỉ grade A/B) · xét-promote (xetPromote) · REUSE (tra) · deprecate (don) · dọn định-kỳ (raDinhKy) · đường-dẫn cây (cayThuMuc). |
| `lib/flow.js` | `routerClass · routerHanhDong · chamRanhGioiCung · phanLoaiBuoc · validateRunState · validateResume · dinhTuyenTang · chay3PhepThu · taiNhapBootstrap · reuseRatio · buocLuong · kiemTraThuTu · chuanBiPHA0 · chuanBiPHA1 · chuanBiPHA2` | Router scale (+1 hành-động §4.2), **ranh-giới cứng**, phân-loại bước (+ validate sổ run-state E1/E2/E3), 3-phép-thử + bootstrap KHO, **stepper transition PHA0→4** + scaffold PHA0/1/2. |
| `lib/loop.js` | `khepVong · congPass · congGiaiDoan · guardTelos · nextStage · K` | **Khép-vòng có tầng PHA 3:** đơn-vòng(≤K)/song-vòng(leo tầng+cascade)/Cổng PASS/Cổng GIAI-ĐOẠN/Cổng CEO + guard telos. K ở `loop-config.yaml`. |
| `lib/compliance.js` | `classifyExec · classifyEvidence · verdictEvidence · coverageBijection · placementCheck · validateRunStateStrict · phaseAdvanceGate · checkDoD · enforceTier · hookPolicy` | **Giám-sát tuân thủ PHA 0→4 (fail-closed):** bắt F1 mô-tả-thay-thực-thi · F2 done-giả · F3 sai-chỗ · F4 bỏ-sót (E1/E4/E5/E6/E7/E9). CLI `tools/compliance-check.js` (`npm run compliance`) + agent `kiem-soat-vien`. Bảng `compliance.yaml`. Spec `docs/design/giam-sat-tuan-thu/`. |
| `lib/text.js` · `lib/yaml.js` | tiện-ích NLP nhẹ · loader YAML không phụ-thuộc | Hỗ trợ các engine trên. |

> **Bất-biến C4:** mọi bảng generic sống ở YAML (1 nơi), KHÔNG hard-code rải-rác. Sửa luật → sửa YAML → `npm test`.

## 5. Mô hình dữ liệu Vault

```
<VAULT>/                              # vault/ (legacy) HOẶC vaults/<slug>/
├── .vncoderc                         # cấu hình DN: company_name, industry, stage, active_departments[], active_packs[]
├── 00-Brain/                         # "bộ não" — các phòng đọc TRƯỚC debate
│   ├── strategy.md products.md state.md budget.md headcount.md   # 5 CANONICAL (input debate)
│   ├── decisions-log.md calibration.md                          # 2 BỘ-NHỚ (append-only; KHÔNG là quan điểm)
│   └── telos.md positioning.md curves.md structure.md lessons.md # LỚP SINH-THÀNH (generic v3)
├── 00-Templates-Custom/              # template riêng DN (BYOT — ưu tiên cao nhất)
├── 01-Departments/<XX-tên>/          # bộ hồ sơ phòng ban RIÊNG của DN (12 nền + pack/mới) — department.yaml
│                                     # + agents/*.md tinh chỉnh theo ngữ-cảnh DN; debate/router CHỈ đọc từ đây
├── 02-Tasks/<YYYY-MM-DD-hhmm-slug>/  # mỗi task 1 thư mục
│   ├── 00-brief.md 02-router.md 03-clarification.md 05-debate.md
│   ├── 07-decision-report.md 08-execution-plan.md 06-structure.md
│   └── 10-run-state.md 10-thuc-thi-*.md   # sổ thực thi + SOP
└── 03-Outputs/<slug>/                # deliverable thật (.md/.csv, hoặc .docx/.xlsx nếu có office-docs)
```

- **Persona per-vault (chỉ-đọc-vault):** debate/router đọc hồ sơ phòng từ `01-Departments/` của vault active (workflow truyền `vault` vào args; agent fallback đọc `.vn-active-vault`). `knowledge/departments/` + `knowledge/packs/*/departments/` chỉ là KHUÔN SINH. Thiếu hồ sơ phòng → agent trả `persona_missing: true` → chạy `/vn-onboard` (Bước 6c) backfill. Khóa `code/capability_name/maps_to/agents[]/default_speaker` KHÔNG đổi khi tinh chỉnh.
- **Brain Contract:** persona CHỈ trích quan điểm từ **5 file canonical**. Thiếu số → nhãn `[cần CEO xác minh]`, KHÔNG bịa.
- **Grounding:** số phải gắn `[số thật DN]` (từ Brain) hoặc `[benchmark ngành — cần CEO xác minh]`. Benchmark KHÔNG dùng làm căn cứ scale.
- **Brain 2 lớp (altitude tempo, chậm→nhanh):** `telos` → `dinh-vi`(positioning/curves) → `hien-trang`(5 canonical) → `cau-truc`(structure) → `bộ-nhớ`(decisions-log/lessons/KHO).
- **stage ∈ {GĐ1..GĐ6}** ở `state.md`: **phát-hiện động** (khai-báo → đối-chiếu budget/state → reality-check). Số nói thật hơn nhãn → khai GĐ cao mà bằng-chứng thấp = cảnh-báo `BLOCK_MO_RONG_SOM`.

## 6. Quy tắc cứng (guardrails — KHÔNG vi phạm)

1. **Cổng HITL chỉ ở main loop.** `AskUserQuestion` KHÔNG chạy trong Workflow nền. Việc cần CEO duyệt giữa chừng → KHÔNG dùng Workflow tool; giao việc nặng độc lập qua **Agent tool**.
2. **Ranh-giới cứng LUÔN NEED-APPROVAL** (`lib/flow.js#chamRanhGioiCung`): chi tiền · ký/nộp hồ-sơ pháp-lý · công-bố ra ngoài · gửi email/tin · thao tác không hoàn-tác. Không bao giờ AI-AUTO.
3. **Cổng G0 trước khi đổ công sức:** `telos.approved_by == CEO` + telos mạch-lạc + cơ-hội khớp số thật. Fail → quay CEO chỉnh (HITL main loop). **AI đề-xuất telos, CEO quyết.**
4. **Không bịa bằng-chứng "đã làm".** Chỉ ghi `DONE` khi có link/file/ảnh/output thật. Việc người phải tự làm (KYC, nộp tiền) → soạn checklist, KHÔNG giả vờ.
5. **Lưu bền vững:** sau mỗi mốc ghi vault → `git add/commit/push` (web ephemeral).
6. **GIỮ NGUYÊN** engine debate/router/executor/HITL/grounding. Trục dọc generic v3 chỉ THÊM file Brain + bảng generic + bước prompt.
7. **`/vn-run` là opt-in hợp-lệ để gọi Workflow** (CEO chủ động). Tài liệu pháp-lý/kế-toán đều là **MẪU**, cần chuyên gia rà.
8. Mọi output **tiếng Việt**, mở đầu **TL;DR ≤3 câu**; định nghĩa thuật ngữ EN lần đầu.

## 7. Vòng đời vận hành (ai gọi gì → sinh gì)

```
/vn-onboard "<DN+ngành>"  → vn-onboarder  → tạo vaults/<slug>/ + .vncoderc + seed Brain (telos chờ CEO duyệt)
                                            + sinh 01-Departments/ (hồ sơ 12 phòng nền + pack/mới, tinh chỉnh theo DN)
/vn-status                → đọc .vn-active-vault → tóm tắt Brain + stage + task gần đây + quyết định đã chốt
/vn-run "<brief>"         → vn-orchestrator → debate.js → 3 PAUSE → 07-decision-report + 08-execution-plan
   └─(brief cần sinh cây)→ vn-architect (PHA 1: 11 khía-cạnh → cây việc → cây cấu-trúc, cổng A/B)
/vn-execute "<task>"      → vn-executor   → 10-run-state.md → tự chạy AI-AUTO → cổng → 03-Outputs/*
/vn-loop "<task>—<số>"    → vn-orchestrator Bước 11/11b → đo so neo → đơn/song-vòng → PASS/PROMOTE → cổng-GĐ → (GĐ5/6) mở-rộng
/vn-playbook [dọn|deprecate <id>] → kho.js → soi KHO (read) · dọn định-kỳ (raDinhKy, PAUSE) · deprecate (don, PAUSE). KHÔNG tra/them.
/vn-meeting <task_folder> → chạy lại debate cho 1 task có sẵn (tái dùng 02-router.md nếu có)
```

3 PAUSE của `/vn-run`: **PAUSE 1** làm rõ Brain thiếu · **PAUSE 2** duyệt Decision Report · **PAUSE 3** duyệt Execution Plan.
4 nhóm bước của `/vn-execute`: **AI-AUTO** (tự chạy) · **NEED-INFO** (thiếu dữ-liệu) · **NEED-APPROVAL** (ra ngoài/tốn tiền) · **HUMAN-ONLY** (KYC/sinh-trắc).
4 PAUSE của `/vn-loop`: **leo tầng ≥định-vị** · **CONG_CEO** (giết/đổi-hướng) · **cổng-giai-đoạn** (đổi stage) · **PHA 4** (quyết mở-rộng GĐ5/6). Đo/verdict · vá đơn-vòng · leo tầng cấu-trúc (→ Cổng A/B) · PROMOTE = AUTO.

## 8. Khép-vòng có tầng (generic v3 PHA 3 — khi task đã có SỐ THẬT)

> **Cửa vào: `/vn-loop "<task> — <số thật>"`** (engine = vn-orchestrator Bước 11/11b). Sơ-đồ 4 cổng PAUSE ở §7.

- **ĐƠN-VÒNG** (≤K vòng): vá tại-chỗ trong khuôn cũ (đổi tham-số/lịch/khuyến-mãi), ghi `lessons.md`. Đạt KPI → **Cổng PASS việc**.
- **SONG-VÒNG** (hết K vẫn fail + có số thật): `routeSongVong()` → leo tầng (cấu-trúc < moat < định-vị < telos, ưu-tiên THẤP nhất) + neo đúng file Brain + ghi `decisions-log` nhãn `altitude`. **Đừng đổi telos vì 1 chiến-dịch lỗi.**
- **Cổng PROMOTE** (TÁCH khỏi PASS): tài-sản grade A/B → `kho.them()` cất `playbook/` + 1 dòng `_index.md`.
- **Cổng GIAI-ĐOẠN:** đủ mục-tiêu GĐ → re-debate SỐ THẬT (chống mở-rộng-sớm) → `stage = GĐ kế`.
- **PHA 4 (GĐ5/6):** 3-phép-thử moat/telos/brand (`flow.chay3PhepThu`) → GĐ5-nới / GĐ6-đẻ / brand-mới.

## Tra cứu nhanh (cần X → đọc đâu)

| Cần biết… | Đọc |
|---|---|
| Quy ước cứng của phiên | `CLAUDE.md` |
| Cách CEO vận hành từng lệnh | `docs/HUONG-DAN-VAN-HANH.md` |
| Luật debate / model tiering | `workflows/debate.js` |
| Quy trình 1 lệnh chính xác | `skills/<tên>/SKILL.md` (+ mirror `.claude/skills/`) |
| Schema Brain / G0 / grounding | `knowledge/brain-schema.md` · `lib/brain.js` |
| Bảng generic (stage/reuse/aspect…) | `knowledge/rule-engines/*.yaml` · `knowledge/taxonomy/*.yaml` |
| Persona/phạm vi 1 phòng | `<VAULT>/01-Departments/<phòng>/` (bản DN đang dùng) · `agents/dept-XX-*.md` (agentType) · khuôn sinh: `knowledge/departments/<phòng>/` |
| Template tài liệu VN | `knowledge/templates-vn/<phòng>/` (BYOT: `<VAULT>/00-Templates-Custom/` ưu tiên) |
| Trạng thái DN hiện tại | `<VAULT>/00-Brain/*.md` + `<VAULT>/.vncoderc` (đọc đầu phiên, hoặc `/vn-status`) |
| Spec gốc trục dọc | `docs/design/luong-generic-v3/specs/` |
| Kiểm hệ còn đúng | `npm test` (164 case) · `npm run check-impl` |

## Thuật ngữ (glossary tối thiểu)

- **Vault**: thư mục dữ liệu 1 DN. **Brain**: `00-Brain/` — bộ não các phòng đọc trước debate.
- **telos**: lẽ-tồn-tại bất-biến của DN (CEO quyết). **positioning/moat/wedge/beachhead**: định-vị/hào/điểm-xuất-phát/đầu-cầu.
- **khía-cạnh (aspect)**: 11 trục bất-biến sinh mục-tiêu (KHÔNG sinh từ phòng-ban). **khối (block)**: 7 nhóm phủ 12 phòng.
- **stage GĐ1..GĐ6**: vòng đời DN (khả-thi→PMF→…→mở-rộng). **reuse-grade A/B/C**: dùng-luôn / tinh-chỉnh / đẻ-mới.
- **nén tầng**: lỗi viết mục-tiêu thành động-từ (phải là TRẠNG-THÁI). **tấn/thủ/hậu**: việc LÀM / việc GÁC / CẤP nguồn-lực.
- **HITL**: human-in-the-loop (cổng hỏi/duyệt CEO). **BYOT**: bring-your-own-template (template riêng DN ưu tiên).
- **devilsAdvocate**: 1 phòng/phiên bắt buộc phản biện đa số (phá thiên-kiến đồng-thuận; luân phiên qua task).
</content>
</invoke>
