# SPEC — Cơ chế Giám sát Tuân thủ luồng PHA 0→4 (fail-closed)

> **Trạng thái:** DRAFT · chờ CEO review trước khi code · v0.1 · 2026-07-06
> **Mục tiêu 1 câu:** biến việc "tuân thủ đủ luồng, không bỏ sót, thực-thi THẬT" từ *phụ-thuộc AI-nhớ* thành *cơ-chế cưỡng-chế bằng máy* — áp đồng-nhất cho mọi cửa vào (`/vn-onboard`,`/vn-run`,`/vn-execute`,`/vn-loop`,`/vn-playbook`, và yêu-cầu mô-tả tự-do).
> **Bất-biến kiến-trúc phải giữ:** chỉ **THÊM** (C6 — không sửa engine debate/router/executor/HITL/grounding) · mọi bảng generic ở **YAML 1 nơi** (C4) · cổng HITL chỉ ở main loop · `npm test`/`npm run check-impl` phải xanh.

---

## 0. Bối cảnh & vấn đề (vì sao cần)

Khung PHA 0→4 (`lib/flow.js#PHA`) đã có **cổng cứng bằng engine** ở hầu hết các pha, nên khó lọt:

| PHA | vào → ra | Cổng engine đã có | Độ chặt |
|---|---|---|---|
| 0 | khai-báo CEO → Brain 2 lớp | `runGateG0` | ✅ |
| 1 | Brain+stage → 06-structure+08-plan | Cổng A/B · `validateCayViec` · `validateDungTang` · `validateTenKep` | ✅ |
| **2** | **08-plan → 10-thuc-thi-\*+10-run-state** | **chỉ `validateRunState` (E1/E2) + `chamRanhGioiCung`** | ⚠️ **HỞ** |
| 3 | số đo thật → lessons/PROMOTE | `congPass` · `xetPromote` · `congGiaiDoan` · `guardTelos` | ✅ |
| 4 | lõi khỏe → đường-cong mới | `chay3PhepThu` | ✅ |

**Lỗ hổng:** E1 chỉ kiểm *"có chuỗi bằng-chứng"*, không kiểm chuỗi đó **THẬT** hay bước có **thực-thi bằng tool**. Hệ quả (đã xảy ra tại vault `san-pham-so`):

- **F1 — mô-tả thay thực-thi:** `1.3b-giao-thu-mo-phong.md` ghi rõ "mô-phỏng" vẫn được đánh DONE; nhiều "output" là khung/checklist/spec thay vì kết-quả tool thật.
- **F3 — sai chỗ:** file quy-trình (`1.1a`, `2.2a`, `9.1a`…) nằm trong `03-Outputs/` thay vì `02-Tasks/`.
- Rủi ro tiềm ẩn: **F2** DONE giả · **F4** bỏ sót bước/khía-cạnh · **F5** số bịa · **F6** qua cổng CEO · **F7** nén tầng/trôi telos · **F8** mất dấu.

Mục tiêu SPEC: bịt PHA 2 + siết đồng bộ 0→4, **fail-closed**.

---

## 1. Bất-biến (guarantees) mà cơ-chế PHẢI bảo-đảm

- **G-COVER** Không bỏ sót: mọi đơn-vị bắt-buộc (11 khía-cạnh · từng nhiệm-vụ-con của plan · từng cổng pha) được **phủ** hoặc **park có lý-do ghi rõ**.
- **G-REAL** Bước cần tool → **DONE ⇔ có artifact THẬT kiểm-chứng được**, không phải SOP/khung/spec.
- **G-EVID** Bằng-chứng phải **thật & sống**: file tồn-tại · URL resolve · ảnh · nguồn web có trích-dẫn · giao-dịch thật.
- **G-PLACE** deliverable→`03-Outputs`; quy-trình/SOP/spec/interim→`02-Tasks`.
- **G-ORDER** Không nhảy pha (INV-FLOW), không qua cổng CEO/ranh-giới cứng, không bịa số (grounding-tag bắt buộc), không nén tầng.
- **G-FAILCLOSED** Vi-phạm bất-kỳ ⇒ **DỪNG + báo CEO + ghi sổ kiểm-toán**; tuyệt-đối không âm-thầm khai DONE/khai pha kế.
- **G-EVERYWHERE** Áp cho **mọi** cửa vào; yêu-cầu tự-do bị router map vào PHA rồi mới chạy.

---

## 2. Nguyên tắc thiết kế: đẩy luật RỚT khỏi "AI phải nhớ"

Lỗi trôi vì luật ở tầng prose. SPEC dời trọng-tâm cưỡng-chế xuống 2 tầng cứng:

```
Tầng 1 (yếu)  : chữ SKILL/CLAUDE.md            — AI phải tự nhớ   ← chỗ đã trôi
Tầng 2 (mạnh) : engine lib/compliance.js        — trả PASS/FAIL   ← xác-định, có test
Tầng 3 (cứng) : hook harness + agent kiểm-soát-viên — ngoài thiện-chí AI
```

"Rất chặt" = mỗi luật đặt ở **tầng thấp nhất khả-thi**. Cổng CỨNG (ranh-giới tiền/pháp-lý, G0, evidence-real cho TOOL_EXEC, fail-closed) đặt ở **tầng 3**, không tắt được.

---

## 3. Mô hình khái niệm

### 3.1 Phân-loại lỗi (taxonomy — mã cố định, ở YAML)

| Mã | Tên | Định nghĩa ngắn |
|---|---|---|
| F1 | mô-tả-thay-thực-thi | bước cần tool nhưng chỉ ra văn-bản mô-tả |
| F2 | done-giả | DONE nhưng bằng-chứng không thật/không resolve |
| F3 | sai-chỗ | process ở Outputs / deliverable ở Tasks |
| F4 | bỏ-sót | nhiệm-vụ-con/khía-cạnh/cổng không được phủ |
| F5 | số-bịa | số không nhãn grounding / benchmark làm căn-cứ scale |
| F6 | qua-cổng | tự làm việc ranh-giới cứng / bỏ HITL |
| F7 | nén-tầng | mục-tiêu thành động-từ / trôi telos |
| F8 | mất-dấu | không commit/không ghi sổ → mất audit trail |

### 3.2 Phân-loại bước thực-thi (execution-type) — trọng-tâm PHA 2

| Loại | Nhận diện | Chuẩn "DONE" |
|---|---|---|
| `TOOL_EXEC` | động-từ làm bằng tool (deploy/dựng/chạy/tra/quét/gọi-API/browser/WebSearch) | artifact THẬT: FILE tồn-tại · URL resolve · IMAGE · CITATION có nguồn · TXN thật |
| `HUMAN_HANDOFF` | KYC/ký/nộp/chuyển-tiền/sinh-trắc | checklist + tiêu-chí nghiệm-thu ở Tasks, trạng-thái `HUMAN` (KHÔNG giả DONE) |
| `DELIVERABLE` | văn-bản LÀ sản-phẩm (policy/ad-copy/kit/landing) | file deliverable ở `03-Outputs`, đúng nội-dung |
| `SOP_SUPPORT` | SOP/spec/checklist/khung hỗ-trợ | file ở `02-Tasks`; **KHÔNG** được tính là DONE cho một bước `TOOL_EXEC` |

> Luật vàng chặn F1: **nếu bước = `TOOL_EXEC` mà bằng-chứng phân-loại là `PROSE`/`SOP_SUPPORT` → tự gắn F1 → chặn.**

### 3.3 Bất-biến mới (mở rộng E1–E3 hiện có, KHÔNG phá)

- E1 (giữ) DONE ⇒ bằng-chứng ≠ rỗng.
- E2 (giữ) cổng ⟂ loại.
- E3 (giữ) resume không ghi-đè DONE.
- **E4 (mới)** DONE của `TOOL_EXEC` ⇒ evidence-kind ∈ {FILE,URL,IMAGE,CITATION,TXN} **và** đã resolve OK (không phải PROSE).
- **E4b (mới, 2026-07-06)** DONE của `TOOL_EXEC/DELIVERABLE` với bằng-chứng FILE ⇒ **nội-dung KHÔNG được là "khung kết-quả rỗng"** (☐ · `[…điền…]` · `[…sau tra…]` ≥3) — bắt lỗi khai-DONE-cho-template-chưa-điền (vd 9.5a). Phân-biệt nhãn grounding `[cần CEO xác minh]` (hợp-lệ, không tính). Bổ-sung: **agent `kiem-soat-vien` BẮT BUỘC** ở cổng task-complete cho fabrication mà engine khó thấy (vd 6.2a khai ACTIVE cho asset chưa sản-xuất).
- **E5 (mới)** coverage: mọi nhiệm-vụ-con(plan) có ≥1 row; mọi khía-cạnh active được phủ hoặc park-có-lý-do.
- **E6 (mới)** placement: file `03-Outputs` phân-loại = DELIVERABLE; process→`02-Tasks`.
- **E7 (mới)** mỗi row khai `loai_exec` hợp-lệ.
- **E8 (mới)** mọi số trong deliverable có nhãn `[số thật DN]`/`[benchmark—cần xác minh]`.
- **E9 (mới)** phase-advance chỉ khi `DoD(pha) PASS ∧ cổng(pha) PASS ∧ audit CONFIRMED`.

---

## 4. Kiến trúc & module map (chỉ THÊM)

| File mới | Vai trò | Tầng |
|---|---|---|
| `lib/compliance.js` | Engine PURE: DoD · classify · coverage · placement · evidence-rules · ledger-validate · E4–E9 | 2 |
| `knowledge/rule-engines/compliance.yaml` | Bảng generic: DoD/pha · exec-classify · evidence-map · placement · tiers · taxonomy (C4) | 2 |
| `tools/compliance-check.js` (+ `npm run compliance`) | CLI gọi engine → in PASS/FAIL + vi-phạm; dùng bởi hook + main loop | 2/3 |
| `.claude/agents/kiem-soat-vien.md` (+ mirror `agents/`) | Agent kiểm-soát-viên adversarial (read-only) chấm mỗi cổng pha | 3 |
| `.claude/hooks/*` + `settings.json` | SessionStart/PreToolUse/Stop hook fail-closed | 3 |
| `<task>/11-compliance.md` | Sổ kiểm-toán per-task (append-only) | dữ-liệu |
| `test/compliance.test.js` | Case §acceptance | test |
| CLAUDE.md + `docs/AI-CONTEXT.md` | Thêm mục luật cứng "Giám sát tuân thủ" | 1 |

### 4.1 `lib/compliance.js` — API bề mặt (PURE, YAML-driven)

```
// ── Definition of Done theo pha ──
defOfDone(pha)                       -> { outputs_bat_buoc:[], cong:[], invariants:[] }
checkDoD(pha, state)                 -> { ok, missing:[{loai, chi_tiet}] }

// ── Phân-loại bước & bằng-chứng (PHA 2) ──
classifyExec(step)                   -> { loai_exec, chuan_bang_chung }
classifyEvidence(str)                -> { kind:'FILE|URL|IMAGE|CITATION|TXN|PROSE|NONE', target }
verdictEvidence(loai_exec, evKind, resolvedOK) -> { ok, ma_loi? }   // F1/F2

// ── Coverage & placement ──
coverageBijection(planTasks, ledgerRows, aspectsActive)
                                     -> { covered_pct, missing_steps:[], orphan_rows:[], aspects_thieu:[] }
classifyArtifact(path, headMeta)     -> 'DELIVERABLE'|'PROCESS'
placementCheck(files)                -> { misfiled:[{path, nen_o}] }

// ── Sổ & bất-biến ──
validateComplianceLedger(rows)       -> { ok, errors:[] }
validateRunStateStrict(rows, resolutions) -> { ok, errors:[] }  // E1..E9; resolutions do IO cấp
phaseAdvanceGate(pha, ctx)           -> { cho_phep, thieu:[] }    // gộp DoD + cổng logic + audit verdict

// ── Tier theo router ──
enforceTier(routerClass)             -> { audit_agent:bool, resolve_evidence:'full|sample|light', ... }
```

> **PURE/IO tách bạch:** `lib/compliance.js` chỉ chứa **luật** (phân-loại chuỗi bằng-chứng, phán từ kết-quả resolve). Việc **resolve thật** (file tồn-tại? URL sống?) do `tools/compliance-check.js` (có fs/network) hoặc agent làm rồi truyền `resolutions` vào. Giữ đúng khuôn "lib PURE, có test" của repo.

### 4.2 `knowledge/rule-engines/compliance.yaml` — schema phác

```yaml
pha_dod:
  PHA0: { outputs: [telos.md, .vncoderc, "5 canonical"], cong: [G0], invariants: [E8] }
  PHA1: { outputs: [06-structure.md, 08-execution-plan.md], cong: [A, B], invariants: [E5, E7] }
  PHA2: { outputs: [10-run-state.md, "10-thuc-thi-*"], cong: [ranh-gioi-cung],
          invariants: [E1, E2, E4, E5, E6, E7, E8] }
  PHA3: { outputs: [lessons.md, decisions-log.md], cong: [PASS, PROMOTE, GIAI-DOAN] }
  PHA4: { outputs: [curves.md], cong: [3-phep-thu] }

exec_classify:
  TOOL_EXEC:     { verbs: [deploy, dựng, chạy, tra, quét, "gọi api", browser, search, fetch, render], evidence_ok: [FILE, URL, IMAGE, CITATION, TXN] }
  HUMAN_HANDOFF: { keywords: [KYC, ký, nộp, "chuyển tiền", sinh-trắc], evidence_ok: [CHECKLIST_HUMAN] }
  DELIVERABLE:   { markers: [policy, "ad copy", kit, landing, "chuỗi email"], evidence_ok: [FILE] }
  SOP_SUPPORT:   { markers: [khung, checklist, spec, sop, brief, "quy-tắc"], evidence_ok: [FILE_TASKS] }

evidence_map:  { FILE: file_exists, URL: url_resolves, IMAGE: is_image_file, CITATION: has_source_url, TXN: txn_verified, PROSE: NEVER_for_TOOL_EXEC }
placement:     { outputs_cho: [DELIVERABLE], tasks_cho: [SOP_SUPPORT, spec, checklist, framework, interim], process_markers: [khung, checklist, spec, sop, brief, "quy-tắc", "kịch-bản", shortlist] }
tiers:         { STRATEGIC: {audit_agent: true, resolve: full}, COMPLEX: {audit_agent: true, resolve: sample}, SIMPLE: {audit_agent: false, resolve: light} }
always_on:     [ranh-gioi-cung, G0, "evidence-real-TOOL_EXEC", fail-closed]
taxonomy:      { F1: mo-ta-thay-thuc-thi, F2: done-gia, F3: sai-cho, F4: bo-sot, F5: so-bia, F6: qua-cong, F7: nen-tang, F8: mat-dau }
```

### 4.3 Sổ kiểm-toán `<task>/11-compliance.md` (append-only)

```
| pha | cổng | thời-điểm | kiểm (DoD·cover·place·evid·audit) | verdict | mã-lỗi | bằng-chứng-resolve | cách-xử |
|-----|------|-----------|-----------------------------------|---------|--------|--------------------|---------|
| PHA2| ...  | ...       | DoD✅ cover 92% place✅ evid✅ audit✅ | PASS   | —      | link...            | —       |
```
Rollup 1 dòng vào `10-run-state.md` TL;DR: `Compliance: PHA2 PASS · cover 100% · 0 cờ`.

### 4.4 Agent `kiem-soat-vien` (adversarial, read-only)

- **Vai:** ở mỗi cổng pha, đọc output+DoD+ledger, **cố BÁC** claim DONE, tự resolve bằng-chứng (mở URL/đọc file), soi F1–F8.
- **Tools:** Read, Grep, Glob, WebFetch (read-only). KHÔNG Write/Edit/Bash-ghi.
- **Ra:** JSON schema `{ verdict: CONFIRMED|VIOLATIONS, vi_pham:[{ma, buoc, bang_chung, ly_do}], cover_pct }`.
- **Chạy:** spawn qua **Agent tool** từ main loop (đọc kết-quả → nếu VIOLATIONS: main loop dừng + hỏi CEO). KHÔNG dùng Workflow-nền cho khâu cần HITL (đúng luật §6 CLAUDE.md).
- **Tier:** bật ở STRATEGIC/COMPLEX; ở SIMPLE thay bằng chỉ engine-check.

### 4.5 Hooks (harness fail-closed)

| Hook | Chặn gì |
|---|---|
| SessionStart | Nạp trạng-thái compliance + nhắc luật cứng (terse, <2KB) |
| PreToolUse (Write/Edit) | Nếu ghi vào `03-Outputs/` mà `classifyArtifact=PROCESS` → **WARN/DENY** (F3) |
| PreToolUse (chỉnh 10-run-state) | Nếu set `DONE` cho `TOOL_EXEC` mà bằng-chứng `PROSE` → **DENY** (F1/F2) |
| Stop | Nếu ledger có vi-phạm mở / có DONE fail E4 / chưa commit → **chặn Stop + feedback** (F8) |

> Hook gọi `node tools/compliance-check.js` (logic nặng ở node; hook chỉ chuyển verdict — tránh giới-hạn ~2KB output).

---

## 5. Luồng cưỡng-chế (đặt cổng kiểm-toán vào state-machine sẵn có)

```
[Lệnh /vn-* | Yêu-cầu tự-do]
   → Router: {SIMPLE|COMPLEX|STRATEGIC} + map vào PHA
   → Chạy PHA n  (skill tương ứng)
   → ┌──────── CỔNG KIỂM-TOÁN (fail-closed, chèn trước routerHanhDong) ────────┐
      1. validateRunStateStrict (E1..E9)            [engine, tầng 2]
      2. coverageBijection (plan↔ledger↔aspect)      [engine, tầng 2]
      3. placementCheck (Outputs vs Tasks)           [engine, tầng 2]
      4. resolve evidence THẬT (file/URL/img/cite)   [tool/hook, tầng 3]
      5. kiem-soat-vien adversarial (STRATEGIC/COMPLEX) [agent, tầng 3]
      6. ghi 11-compliance
     └── tất cả PASS? ── no ─→ DỪNG + báo CEO (main loop) + đề cách-xử
                          └─ yes ─→ phaseAdvanceGate cho khai PHA n+1
```

- Chèn tại **`lib/flow.js#routerHanhDong`/`luongTong`** qua `phaseAdvanceGate` (bọc, KHÔNG sửa logic cũ — C6).
- Yêu-cầu tự-do: router phân loại + gán PHA + DoD-contract trước khi chạy → cùng đi qua cổng.

---

## 6. Ánh-xạ LỖI → CƠ-CHẾ chặn (truy vết thiết kế)

| Lỗi | Chặn bởi | Tầng |
|---|---|---|
| F1 mô-tả thay thực-thi | `verdictEvidence` (E4) + kiểm-soát-viên | 2+3 |
| F2 done-giả | resolve evidence (E4) + audit | 3 |
| F3 sai-chỗ | `placementCheck` (E6) + PreToolUse hook | 2+3 |
| F4 bỏ-sót | `coverageBijection` (E5) | 2 |
| F5 số-bịa | grounding-tag gate (E8) + `validateCanonContent` (có sẵn) | 2 |
| F6 qua-cổng | `chamRanhGioiCung` (có sẵn) + PreToolUse | 3 |
| F7 nén-tầng | `validateDungTang`+`guardTelos` (có sẵn) | 2 |
| F8 mất-dấu | Stop hook + `11-compliance` | 3 |

---

## 7. Tier theo router (đánh-đổi tốc-độ/độ-chặt)

| Router class | engine-check | resolve evidence | kiểm-soát-viên | Cổng CỨNG |
|---|---|---|---|---|
| STRATEGIC | đầy-đủ | full | có | luôn bật |
| COMPLEX | đầy-đủ | sample | có | luôn bật |
| SIMPLE | đầy-đủ | light | không (chỉ engine) | luôn bật |

Cổng CỨNG (`always_on`) không tắt được ở mọi tier: ranh-giới tiền/pháp-lý · G0 · evidence-real cho TOOL_EXEC · fail-closed.

---

## 8. Test plan (`npm test` phải xanh; cơ-chế tự-kiểm)

- **Unit:** DoD thiếu output → phát-hiện · TOOL_EXEC+PROSE → F1 · misfiled → F3 · missing step → E5 · số không nhãn → E8 · placement classify đúng.
- **Backward-compat:** `validateRunStateStrict` với resolutions rỗng phải **tương-thích** hành-vi E1–E3 cũ (mọi test §8 hiện tại vẫn xanh).
- **Golden retro:** chạy cơ-chế trên vault `san-pham-so` hiện tại → **kỳ-vọng** gắn cờ đúng: `1.3b` F1, nhóm `1.1a/2.2a/9.1a/...` F3, coverage các khía-cạnh.
- **check-impl:** thêm điểm-cắm `compliance` vào manifest.

---

## 9. Rollout (5 đợt, không phá luồng đang chạy)

- **A. Engine + YAML + test** — ✅ **XONG 2026-07-06** (`lib/compliance.js` · `knowledge/rule-engines/compliance.yaml` · `test/compliance.test.js` 10 case gồm golden bắt F1/1.3b · `npm test` 179/179 · `check-impl` PASS). Chưa đổi hành-vi luồng.
- **B. Wiring skill** — ✅ **XONG 2026-07-06**: `tools/compliance-check.js` + `npm run compliance` (IO resolve file THẬT); cổng "Bước 6.5" ở `vn-executor` + note ở `vn-orchestrator` (2 nơi mirror); luật cứng CLAUDE.md + bảng AI-CONTEXT. Cổng mềm (chưa DENY hook).
- **C. Hooks fail-closed** — ✅ **XONG 2026-07-06** (chỉ vn-*): `.claude/settings.json` + `.claude/hooks/vn-compliance-{mark,stop}.sh`. PostToolUse đánh marker khi ghi vault (code thường KHÔNG bị gác); **Stop hook chặn (exit 2)** khi task active còn DENY, fail-open mọi lỗi. Test standalone 5 case PASS.
- **D. Agent kiểm-soát-viên** — ✅ **XONG 2026-07-06**: `.claude/agents/kiem-soat-vien.md` (+ mirror) read-only adversarial, output JSON verdict.
- **E. Retro-clean `san-pham-so`** — ✅ **XONG 2026-07-06**: dời **16 process-doc** `03-Outputs → 02-Tasks/process` (git mv giữ lịch-sử) + sửa **7 F1** cho honest (9.1b/6.2b/5.1b → SOP_SUPPORT qua tinh-chỉnh engine · 4.1b/7.1b gắn URL live · 3.1a trỏ form thật + ghi TODO backend · 1.3b → giao thật webhook). `npm run compliance` → **PASS 0 vi-phạm**; sổ `11-compliance.md`. Toàn-bộ A→E hoàn-tất.

---

## 10. QUYẾT ĐỊNH — ĐÃ CHỐT (CEO duyệt 2026-07-06)

1. **Độ cứng hook:** ✅ **DENY** cho F1/F2/F6 (mô-tả-giả-DONE · ranh-giới tiền/pháp-lý) · **WARN** cho F3 (sai chỗ). → `compliance.yaml#hook_policy`.
2. **Độ nặng auditor:** ✅ **full** — chấp-nhận đánh-đổi token để bảo chất-lượng (auditor ở mọi cổng pha cho STRATEGIC/COMPLEX; SIMPLE dùng engine-check).
3. **Ngân sách:** ✅ chấp-nhận thêm token/độ-trễ mỗi lệnh để bảo chất-lượng.
4. **Sổ:** ✅ **file riêng `11-compliance.md`/task** + rollup 1 dòng vào `10-run-state.md`.
5. **Retro-clean vault `san-pham-so`:** ✅ **làm trong đợt này** (đợt E).
6. **Tên gọi:** ✅ **`compliance`** (EN) cho file/lệnh/module.

---

## 11. Non-goals (ngoài phạm-vi lần này)

- Không thay engine debate/router/loop hiện có (chỉ bọc cổng).
- Không tự-động-hoá các bước HUMAN-ONLY (KYC/ký/nộp) — vẫn là checklist cho người.
- Không đặt mục-tiêu "0% lỗi tuyệt-đối" — mục-tiêu là **fail-closed + audit-được**: lỗi bị chặn hoặc lộ ra sổ, không trôi âm-thầm.
