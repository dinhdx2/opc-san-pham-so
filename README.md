# opc-san-pham-so

> **AI Operating System cho Công ty Việt Nam — chạy bằng Claude Code subscription, KHÔNG cần API key.**
> CEO chat 1 câu → **12 phòng ban AI họp bàn debate** → ra quyết định → sinh tài liệu `.docx/.xlsx` tuân thủ luật VN.

Đây là bản **port Claude-native** của [vn-one-person-company](https://github.com/andyluu98/vn-one-person-company) (bản gốc dùng Python + LangGraph + API key). Bản này đóng gói thành **Claude Code plugin** chạy **web/mobile-native**: dùng model Claude qua gói subscription (Opus/Sonnet), nghiên cứu bằng WebSearch tích hợp, **vault = thư mục `vault/` trong repo** (đọc/ghi bằng file, không cần MCP Obsidian) — **không tốn API key DeepSeek/Anthropic/Tavily**.

---

## ✨ Dành cho ai

Solo founder / DN nhỏ Việt Nam muốn có "ban điều hành ảo" 12 phòng ban (Pháp chế, Tài chính, Marketing, Vận hành...) để:
- Ra quyết định **dựa trên debate đa chiều** thay vì 1 góc nhìn.
- Sinh tài liệu **tuân thủ luật VN** (Luật DN 2020, BLLĐ 2019, TT 200/2014, NĐ 13/2023...).
- Mọi quyết định + tài liệu lưu **một nơi duy nhất** (`vault/` trong repo, commit lên git).
- **Không trả phí API** — chỉ cần gói Claude Code đang dùng.

---

## 🏗 Kiến trúc

### Sơ đồ tổng — Luồng generic v3 (PHA 0 → PHA 4)

Xương sống là **trục dọc sinh-thành**: chiều-sinh chạy **xuống** (PHA 0→2), khép-vòng chạy **lên** (PHA 3), mở-rộng **tái-nhập** (PHA 4). Mỗi PHA ghi rõ **Vào · Ra · Cổng** (chi-tiết: `docs/design/luong-generic-v3/`).

```
PHA 0  KHỞI-TẠO → BRAIN 2 LỚP (telos · định-vị · đường-cong · cấu-trúc)
       + PHÁT-HIỆN STAGE (khai-báo → bằng-chứng → reality-check)
       Cổng G0: telos mạch-lạc? cơ-hội khớp số thật?
                         │
                         ▼
PHA 1  PHÂN-RÃ SINH-THÀNH (chỉ GĐ hiện-tại chi-tiết)
       telos → mục-đích → [duyệt 11 KHÍA-CẠNH] → mục-tiêu
            → nhiệm-vụ-chính → nhiệm-vụ-con (tấn/thủ/hậu)
       → GOM NGƯỢC-LÊN + TRA-KHO mỗi tầng:
            việc → bộ-phận → phòng → khối (reuse/adapt/new)
       Cổng A: duyệt KHUNG   |   Cổng B: duyệt 08-plan + cấu-trúc
                         │
                         ▼
PHA 2  THỰC-THI ĐỆ-QUY từng hành-động
       mỗi hành-động = brief con → router(SIMPLE/COMPLEX/STRATEGIC)
       → hội-đồng debate.js (4 pha) → kế-hoạch riêng
       → vn-executor: bước nguyên-tử + cổng cứng NEED-APPROVAL
                         │
                         ▼
PHA 3  ĐO → ĐỊNH-TUYẾN PHẢN-HỒI
       đơn-vòng (vá, ≤K) → song-vòng (leo tầng + NEO BRAIN)
       Cổng PASS việc · Cổng PROMOTE tái-dùng → cập-nhật KHO _index
       Cổng GIAI-ĐOẠN: đủ mục-tiêu → re-debate số-thật → GĐ kế ──┐ (về PHA 1)
                         │                                        │
                         ▼ (khi GĐ5/6, lõi khỏe)                  │
PHA 4  MỞ-RỘNG = ĐƯỜNG-CONG MỚI (3-phép-thử)                      │
       GĐ5-nới / GĐ6-đẻ / brand-mới → TÁI-NHẬP PHA 0/1            │
       bootstrap từ KHO (tra _index trước) ─────────────────────┘
```

Phần **generic** (bảng/luật cố-định trong sơ đồ trên) đã hiện-thực thành **engine xác-định `lib/` + test** (xem [§ Luồng generic v3](#-luồng-generic-v3--trục-dọc-sinh-thành-telos--cấu-trúc)); phần **phân-rã** (suy mỗi DN) sống ở prompt skill.

### Luồng vận hành — 3 lệnh tách bạch (PHA 1 → 2 → 3/4)

Trong 1 phiên, CEO làm việc qua **3 lệnh tách bạch**: `/vn-run` ra *quyết-định + kế-hoạch* (PHA 1–2), `/vn-execute` *làm việc thật* (PHA 2), `/vn-loop` *đo & nâng tầng khi đã có số thật* (PHA 3–4).

```
/vn-run "<brief>"   (gõ trong Claude Code, trỏ tới vault của DN)
      ↓
[skill vn-orchestrator] đọc Brain (00-Brain) → Router phân loại task
      ↓
PAUSE 1 — Hỏi làm rõ (nếu Brain thiếu thông tin)
      ↓
[workflow debate.js] engine v2 (4 pha):
   1. Perspectives — các phòng nêu quan điểm SONG SONG (1 phòng làm "luật sư của quỷ")
   2. Cross-examination — các phòng thấy nhau → phản biện/đổi ý (STRATEGIC lặp tới 2 vòng)
   3. Red-team — trích claim rủi ro cao → bác bỏ đối kháng + gắn cờ pháp lý
   4. Synthesize — synthesizer tổng hợp (có mục ⚔️ Red-team + Đổi ý)
      ↓
07-decision-report.md  → PAUSE 2 — CEO duyệt
      ↓
08-execution-plan.md   → PAUSE 3 — CEO duyệt
      ↓
[skill office-docs] render .docx/.xlsx → 03-Outputs/

──────────────  LỚP THỰC THI (tách riêng)  ──────────────

/vn-execute "<task>"
      ↓
[skill vn-executor] đọc 08-execution-plan.md + SOP 10-thuc-thi-*
      ↓
10-run-state.md (sổ thực thi) — phân rã bước nguyên tử + phân loại:
   AI-AUTO · NEED-INFO · NEED-APPROVAL · HUMAN-ONLY
      ↓
VÒNG LẶP: tự chạy mọi bước AI-AUTO bằng tool/MCP thật
   (browser / Google Drive / WebSearch / file · agent executor)
      ↓
gặp cổng → gom hỏi CEO 1 lượt (AskUserQuestion) → đáp ứng → TỰ CHẠY TIẾP
      ↓
deliverable thật → 03-Outputs/ · cập nhật sổ · git push (resume được)
```

**Router tự quyết số phòng** tham gia theo độ phức tạp: SIMPLE (1-2), COMPLEX (3-6), STRATEGIC (7-12).

**Ba lớp tách bạch:** `/vn-run` ra *quyết định + kế hoạch* (tài liệu tĩnh). `/vn-execute` *làm việc thật* — tự động hoá bằng tool/MCP, chỉ dừng hỏi khi cần thông tin hoặc phê duyệt, được đáp ứng thì chạy tiếp tới khi xong. `/vn-loop` *khép vòng khi đã có số thật* — đo so neo OKR/KPI → đơn/song-vòng → PASS/PROMOTE → cổng-giai-đoạn → (GĐ5/6) mở-rộng, gom 4 cổng PAUSE cho CEO. Việc ra tiền / pháp lý / công bố ra ngoài luôn cần CEO duyệt.

---

## 📦 Thành phần plugin

| Thư mục | Nội dung |
|---|---|
| `agents/` | 15 agent **nền** (generic): 12 phòng ban (`dept-01-governance` … `dept-12-growth`) + `synthesizer` + `pack-architect` + `executor` (người thực thi). Mỗi agent đọc persona chi tiết từ `knowledge/`. **Phòng pack ngành** (mã ≥13) KHÔNG nằm cố-định ở đây — `/vn-onboard` sinh ra khi kích-hoạt pack (định-nghĩa ở `knowledge/packs/<pack>/departments/`). |
| `workflows/debate.js` | Engine debate v2: Perspectives (song song) → Cross-examination (phản biện/đổi ý) → Red-team (kiểm chứng đối kháng) → tổng hợp. |
| `skills/vn-orchestrator/` | Điều phối router + 3 chặng PAUSE CEO duyệt + đọc/ghi vault `vault/` + Brain Contract. |
| `skills/vn-onboarder/` | Onboard DN theo ngành (kích hoạt/sinh pack). |
| `skills/vn-executor/` | **Lớp thực thi**: kế hoạch/SOP → sổ `10-run-state.md` → tự chạy bước máy làm được bằng tool/MCP, cổng HITL (hỏi/duyệt), resume được. |
| `skills/vn-architect/` | **Trục dọc PHA 1** (luồng generic v3): duyệt 11 khía-cạnh sinh cây việc → gom NGƯỢC-LÊN thành cây cấu-trúc + tra-KHO (cổng A/B). |
| `commands/` | `/vn-run`, `/vn-onboard`, `/vn-execute`, `/vn-loop`, `/vn-playbook`, `/vn-status`, `/vn-meeting`. |
| `knowledge/` | `brain-schema.md` (Brain Contract + Brain 2 lớp) + `taxonomy/*.yaml` (11 khía-cạnh/7 khối) + `rule-engines/*.yaml` (6 bảng generic) + `playbook/` (KHO `_index.md`) + `templates-vn/` (Decision→Template) + `packs/` (validator + 4 industry pack: F&B/Retail/Tech-SaaS/Sản-phẩm-số) + **183 template** phòng-ban + `_orchestrator/` (11 file điều-phối) + **33 persona**. |
| `lib/` + `tools/` + `test/` | **Engine xác-định luồng generic v3** (`brain/taxonomy/rule-engines/tier/kho/flow/loop.js`) + `lib/vault.js` (multi-vault) + `tools/check-impl.js` (trình kiểm implement) + `test/` (164 case + golden Phở Hà). `npm test` / `npm run check-impl`. |
| `vaults/` + `.vn-active-vault` | **Multi-vault**: mỗi ý-tưởng/DN một vault riêng `vaults/<slug>/`; con-trỏ `.vn-active-vault` chọn vault đang dùng (fallback `vault/` cũ). Tạo bằng `/vn-onboard`. |
| `docs/design/luong-generic-v3/` | Tài-liệu thiết-kế (SoT `luong-generic-v3.html` + 15 spec + `tools/check-coverage.js`) — tách khỏi vault DN. |

**Model tiering (enforce trong `debate.js`) + escalation ladder:** Opus cho 3 phòng lõi rủi ro cao (Pháp chế / Chiến lược / Tài chính) + red-team + synthesizer; Sonnet cho phần còn lại. Brief **SIMPLE** hạ toàn bộ xuống Sonnet cho rẻ; **STRATEGIC** bung Opus + lặp cross-exam tới 2 vòng. (Workflow không tự áp `model:` frontmatter nên engine set model tường minh.)

---

## 🧬 Luồng generic v3 — trục dọc sinh-thành (telos → cấu-trúc)

Trục ngang (12 phòng debate) ở trên cho *quyết-định chất-lượng*. **Luồng generic v3** đắp thêm **trục dọc** *sinh-thành chiều sâu* + *khép-vòng có tầng*, theo bộ spec `docs/design/luong-generic-v3/specs/` (SoT: `luong-generic-v3.html`). Phần **generic** (bảng/luật cố-định) được hiện-thực thành **code xác-định + test**, phần **phân-rã** (suy mỗi DN) sống ở prompt skill.

| Lớp | Hiện-thực | Spec |
|---|---|---|
| **Brain 2 lớp** (telos · positioning · curves · structure + nhãn altitude + stage) + cổng **G0** | `lib/brain.js` · `vault/00-Brain/{telos,positioning,curves,structure,lessons}.md` · `knowledge/brain-schema.md` | 02, 08 |
| **Taxonomy generic** 11 khía-cạnh · 7 khối · tên-kép | `lib/taxonomy.js` · `knowledge/taxonomy/*.yaml` · `department.yaml maps_to` | 04 |
| **6 rule-engine** stage/loop/aspect/taskgen/reuse/naming | `lib/rule-engines.js` · `knowledge/rule-engines/*.yaml` | 06 |
| **Sinh nhiệm-vụ-chính 3 lớp** + validate đúng-tầng | `lib/tier.js` | 01 |
| **KHO chỉ-mục** `_index.md` 13 cột (them/tra/dọn) | `lib/kho.js` · `knowledge/playbook/` | 05 |
| **PHA 0→4** stage-detect · router · cổng cứng · khép-vòng đơn/song (K-vòng/PASS/cổng GĐ/guard telos) · PROMOTE · 3-phép-thử · bootstrap KHO | `lib/flow.js` · `lib/loop.js` + prompt `vn-orchestrator`/`vn-architect`/`vn-executor`/`debate.js` | 03a–03e |

```bash
npm test           # 164 case tái-hiện §8 acceptance của từng spec + golden Phở Hà PHA0→4
npm run check-impl  # kiểm điểm-cắm tồn-tại (I1) + test xanh (I2) + claim phủ test (I3)
```

> **Cơ-chế bám-sát spec (không bỏ sót):** mỗi acceptance test của spec (§8) → 1 case chạy được, neo claim `LG-*`; `tools/check-impl.js` biến "implement đúng spec" thành điều-kiện build (CI-able), song-song với `specs/tools/check-coverage.js` (kiểm spec ↔ SoT). **GIỮ NGUYÊN** engine debate/router/executor/HITL — trục dọc chỉ THÊM file Brain + bảng generic + bước prompt.

---

## 🔧 Yêu cầu

- **Claude Code** (web/mobile/CLI/Desktop) + gói subscription.
- **Vault = thư mục `vault/` trong repo** — đọc/ghi bằng tool `Read`/`Write`/`Glob`/`Edit`, KHÔNG cần MCP Obsidian. Môi trường web là ephemeral → commit/push để lưu bền vững.
- Skill `office-docs` (hoặc tương đương) để render `.docx/.xlsx` — tùy chọn; nếu không có sẽ fallback `.md/.csv`.

> Không cần API key DeepSeek / Anthropic / Tavily.

---

## 🚀 Cài đặt

### Cách A — Qua plugin marketplace (Claude Code CLI hỗ trợ `/plugin`)
```
/plugin marketplace add https://github.com/dinhdx2/opc-san-pham-so
/plugin install opc-san-pham-so
```
Restart Claude Code.

### Cách B — Thủ công (môi trường không có lệnh `/plugin`)
1. Clone repo về máy:
   ```bash
   git clone https://github.com/dinhdx2/opc-san-pham-so.git
   ```
2. Copy vào thư mục marketplace local của Claude:
   `~/.claude/plugins/marketplaces/<tên-marketplace>/opc-san-pham-so`
3. Thêm entry vào `marketplace.json` + `installed_plugins.json` của marketplace đó.
4. **Quan trọng:** các agent đọc `knowledge/` bằng đường dẫn. Nếu CWD khi chạy khác thư mục plugin, sửa các tham chiếu `knowledge/...` trong `agents/*.md` + `skills/vn-orchestrator/SKILL.md` thành **đường dẫn tuyệt đối** tới `knowledge/` đã cài.
5. Restart Claude Code.

---

## 📂 Chuẩn bị Vault cho 1 DN

> **Multi-vault:** mỗi ý-tưởng/DN là một vault độc-lập dưới `vaults/<slug>/` (slug ngắn do AI đề-xuất khi `/vn-onboard`, CEO duyệt). Con-trỏ `.vn-active-vault` ở gốc repo nhớ vault đang dùng giữa các phiên; thiếu con-trỏ → fallback `vault/` (DN cũ). Mọi skill resolve qua `lib/vault.js`. `/vn-status` liệt kê mọi vault + đánh dấu active.

Mỗi vault có cấu trúc:
```
<vault>/
├── 00-Brain/          5 file canonical: strategy.md · products.md · state.md · budget.md · headcount.md
│                      + 2 file bộ nhớ (tự sinh): decisions-log.md · calibration.md
│                      + lớp sinh-thành (luồng generic v3): telos · positioning · curves · structure · lessons.md
├── 00-Templates-Custom/   (template riêng của DN — ưu tiên cao nhất, BYOT)
├── 02-Tasks/          (mỗi task 1 thư mục: brief, clarification, decision-report, execution-plan)
└── 03-Outputs/        (.md/.csv, hoặc .docx/.xlsx nếu có office-docs)
```
Điền **5 file canonical** trong `00-Brain/` bằng thông tin DN (chiến lược, sản phẩm, trạng thái, ngân sách, nhân sự) — "bộ não" các phòng ban đọc trước khi debate. Hai file bộ nhớ `decisions-log.md` (quyết định đã chốt) và `calibration.md` (đối chiếu khuyến nghị ↔ kết quả thực) do hệ tự ghi — xem `knowledge/brain-schema.md`.

**Template ưu tiên (BYOT 3 tầng):** `vault/00-Templates-Custom/` > `knowledge/templates-vn/<phòng>/` > mặc định.

---

## 💬 Sử dụng

| Lệnh | Tác dụng |
|---|---|
| `/vn-onboard "<mô tả DN + ngành>"` | Thiết lập DN theo ngành: kích hoạt pack có sẵn, hoặc **sinh phòng ban + pack + template mới** (CEO duyệt) cho ngành lạ. |
| `/vn-status` | In trạng thái vault: vision, ICP, state, task gần đây. (Chạy nhanh, kiểm tra plugin sống.) |
| `/vn-run "<brief>"` | Chạy đầy đủ: đọc Brain → debate → quyết định → tài liệu. Có 3 điểm dừng CEO duyệt. |
| `/vn-execute "<task>"` | **Lớp thực thi**: biến kế-hoạch/SOP thành sổ `10-run-state.md` → tự chạy mọi bước máy làm được bằng tool/MCP, chỉ dừng hỏi khi cần thông-tin/phê-duyệt, resume được. |
| `/vn-loop "<task> — <số thật>"` | **Lớp khép-vòng (PHA 3/4)**: khi task đã có SỐ THẬT → đo so neo OKR/KPI → đơn-vòng (vá rẻ) / song-vòng (leo tầng) / PASS + PROMOTE / cổng-giai-đoạn / (GĐ5-6) 3-phép-thử mở-rộng. 4 cổng PAUSE CEO, phần còn lại tự chạy. |
| `/vn-playbook [dọn \| deprecate <id>]` | **Người-gác KHO tái-dùng** (`knowledge/playbook/`, cấp ngành): soi kho tài-sản (reuse-grade A/B) · dọn định-kỳ (gộp trùng + hạ-cấp) · deprecate. KHÔNG đụng TRA/PROMOTE — hai cái đó tự-động ở PHA 1C / PHA 3. |
| `/vn-meeting <task_folder>` | Chạy lại debate cho 1 task đã có. |

**Ví dụ:**
```
/vn-run Đánh giá hiệu quả marketing tháng 6 và đề xuất điều chỉnh tháng 7
/vn-run Soạn kế hoạch tuyển 1 trợ lý 8 triệu/tháng tại Q1, đúng luật lao động
/vn-run Có nên mở chi nhánh 1.2 tỷ Q3 không? Phân tích ROI + rủi ro
```

Lần đầu chạy tới bước debate, nếu Claude hỏi xác nhận dùng **Workflow** → đồng ý.

### Onboard theo ngành (`/vn-onboard`)

```
/vn-onboard "spa trị liệu cao cấp ở Q1 HCM"
```
- Ngành **có pack sẵn** (F&B / Retail / Tech-SaaS / Sản-phẩm-số) → kích hoạt ngay: thêm phòng ban + role + luật ngành.
- Ngành **lạ** → agent `pack-architect` đề xuất phòng ban mới (vd 13-spa, 14-trị-liệu) + luật liên quan → **CEO duyệt** → sinh agent + `pack.yaml` + template → lưu vào `knowledge/packs/` (tái dùng cho DN khác) → kích hoạt cho vault qua `.vncoderc`.

Sau onboard, `/vn-run` sẽ debate với **12 phòng nền + phòng ngành** vừa thêm.

---

## 🔄 Quan hệ với bản Python (vn-one-person-company)

Hai hệ **bổ trợ nhau, dùng chung vault**:

| | opc-san-pham-so (plugin) | vn-one-person-company (Python) |
|---|---|---|
| Model | Claude subscription (Opus/Sonnet) | DeepSeek / Anthropic API |
| Chi phí | Trong gói, không token thêm | Tốn token (rẻ) |
| Cách chạy | Tương tác trong Claude Code | Headless: cron / server / batch |
| Hợp cho | Chất lượng cao, hàng ngày | Tự động hóa, chạy nhiều DN |

Cùng quy ước vault + template → output 2 hệ đọc lẫn nhau, không phân nhánh dữ liệu.

---

## 📜 Nguồn gốc & giấy phép

- Template + persona phòng ban vendored từ [vn-one-person-company](https://github.com/andyluu98/vn-one-person-company).
- 183 template tuân thủ luật DN Việt Nam — đều là **MẪU**, cần luật sư/kế toán rà trước khi dùng chính thức.

---

**Tác giả:** [dinhdx2](https://github.com/dinhdx2)
