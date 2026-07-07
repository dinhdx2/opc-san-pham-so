---
id: 09-codebase-integration-map
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §9 (Ánh-xạ vào codebase hiện-tại, dòng 670-694)"
covers: [LG-9-brain, LG-9-taxonomy, LG-9-taskgen, LG-9-stage, LG-9-architect, LG-9-kho-index, LG-9-gate-optimize, LG-9-lens-3chieu, LG-9-tenkep, LG-9-khepvong, LG-9-dequy, LG-9-uutien]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang, 02-brain-schema, 03-luong-orchestration, 03a-pha0-khoi-tao, 03b-pha1-phan-ra, 03c-pha2-thuc-thi, 03d-pha3-khep-vong, 03e-pha4-mo-rong, 04-taxonomy-generic, 05-kho-chi-muc, 06-bang-tra-rule-engines, 07-fixture-pho-ha, 08-artifact-vault-layout]
milestone: M1
---

# 09 · Bản-đồ đấu-dây codebase

## 1. Mục-đích & phạm-vi

Spec này là **spec TỔNG đấu-dây**: nó KHÔNG định-nghĩa thêm hành-vi mới, mà **nối mọi spec nội-dung (01–08) vào code thật** và chốt **thứ-tự triển-khai M1–M6**. Mỗi hàng §9 của SoT (12 hạng-mục) được map tới: (a) điểm-cắm code cụ-thể (file/hàm/prompt), (b) loại đụng-chạm GIỮ / THÊM / SỬA, (c) spec chi-tiết định-nghĩa "phải làm gì" ở điểm-cắm đó. Bất-biến chủ-đạo lấy nguyên từ SoT: **tái-dùng tối-đa · thêm tối-thiểu** — engine debate, router, executor, packs, grounding, HITL đều GIỮ; trục dọc chủ-yếu là **thêm file Brain + thêm bước prompt + thêm thư-mục KHO**, không phải code nặng.

**In-scope:** ma-trận đấu-dây §9, lộ-trình M1–M6, danh-mục điểm-cắm, bất-biến kiến-trúc, truy-vết 12 claim.
**Out-of-scope:** chi-tiết schema/thuật-toán của từng hạng-mục — đã nằm ở spec 01–08 (spec này chỉ LINK, không lặp). Spec này là "sơ-đồ dây", không phải "thiết-bị".

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md`: **GIỮ / THÊM / SỬA** (loại đụng-chạm), **điểm-cắm** (insertion point), **milestone M1–M6**, **trục dọc / trục ngang**, **telos · altitude · 11 khía-cạnh · 7 khối · tên-kép · gom-ngược-lên · KHO · khép-vòng đơn/song · reuse-grade · escalation ladder · HITL**. Bảng generic 11 khía-cạnh / 7 khối / 12 phòng: `04-taxonomy-generic.md`. Cơ-chế sinh nhiệm-vụ-chính 3 lớp: `01-nguyen-ly-va-mo-hinh-tang.md` §4.

## 3. Ma-trận đấu-dây §9 (bảng tổng)

> Cột "Loại": **GIỮ** = không sửa code, tái-dùng nguyên · **THÊM** = thêm file/bảng/prompt/thư-mục mới · **SỬA** = chỉnh file/prompt có sẵn. Cột "Spec chi-tiết" trỏ tới spec 01–08 định-nghĩa nội-dung; spec 09 chỉ là dây nối.

| # | Hạng-mục (§9) | Claim | File / hàm / prompt cắm (cây repo thật) | Loại | Spec định-nghĩa chi-tiết |
|---|---|---|---|---|---|
| 1 | 3 file Brain mới (telos/positioning/curves) + structure 3 tầng + trường stage | `LG-9-brain` | `knowledge/brain-schema.md` (mở-rộng từ "5 canonical + 2 memory" → thêm `telos.md`, `positioning.md`, `curves.md`, `structure.md`, `lessons.md` + trường `stage` trong `state.md` + nhãn `altitude` trong `decisions-log.md`) | **SỬA** (mở-rộng schema) + **THÊM** (file vault) | `02-brain-schema.md` (§3 mô-hình dữ-liệu), `08-artifact-vault-layout.md` (bố-cục file) |
| 2 | 11 khía-cạnh + 7 khối canonical (bảng generic) | `LG-9-taxonomy` | `knowledge/brain-schema.md` (mục taxonomy generic) **+** `skills/vn-orchestrator/SKILL.md` (chèn bảng tham-chiếu cạnh Bước 3 router) | **THÊM** (bảng generic) | `04-taxonomy-generic.md` (§3 bảng 11 khía-cạnh/7 khối/12 phòng) |
| 3 | Cơ-chế sinh nhiệm-vụ-chính 3 lớp (điều-kiện-đủ → 3 chiều → chéo khía-cạnh → back-test) | `LG-9-taskgen` | `skills/vn-orchestrator/SKILL.md` **Bước 7** (PAUSE 3 Execution Plan) + prompt `vn-architect` (hạng-mục 5) | **THÊM** (luật/prompt) | `01-nguyen-ly-va-mo-hinh-tang.md` §1.4 + `06-bang-tra-rule-engines.md` (hàm task-gen-grid, claim `LG-6.4-*`) |
| 4 | Phát-hiện stage + bơm câu-sống-còn | `LG-9-stage` | `skills/vn-orchestrator/SKILL.md` **Bước 2–3** (sau đọc Brain, trước/trong router): đọc `state.md`/`budget.md` → suy stage bằng rubric câu-sống-còn → nạp vào `brainContext` | **SỬA** (thêm prompt/luật vào bước có sẵn) | `03a-pha0-khoi-tao.md` (3 lớp khai-báo/đối-chiếu/reality-check) + `06-bang-tra-rule-engines.md` (hàm stage-detect, claim `LG-6.1-*`) |
| 5 | Phân-rã sinh-thành (aspect-walk → gom ngược-lên 3 tầng + tra-kho) | `LG-9-architect` | **skill mới `skills/vn-architect/SKILL.md`** HOẶC mở-rộng agent `pack-architect` (`.claude/agents/pack-architect` + persona) ở chế-độ function-first | **THÊM** (agent/skill mới) | `03b-pha1-phan-ra.md` (PHA 1A/1B/1C) + `01-nguyen-ly-va-mo-hinh-tang.md` §1.4 |
| 6 | KHO chỉ-mục `_index.md` + rubric reuse-decision | `LG-9-kho-index` | thư-mục **mới** `knowledge/playbook/<ngành>/` (`_index.md` + cây `K*/dept-*/<bộ-phận>/`) + luật reuse/adapt/new trong `vn-architect` | **THÊM** (thư-mục + luật) | `05-kho-chi-muc.md` (schema `_index.md` 13 cột + CRUD) + `06-bang-tra-rule-engines.md` (hàm reuse-decision, claim `LG-6.5-*`) |
| 7 | Cổng optimize-before-scale + phép-thử telos | `LG-9-gate-optimize` | `workflows/debate.js` **pha Red-team** (Phase 3): thêm luật vào prompt extract-claims/red-team — gắn cờ "nhân-bản khi chưa-sạch" + phép-thử telos cho brief mở-rộng (PHA 4) | **SỬA** (thêm luật vào prompt pha có sẵn) | `03e-pha4-mo-rong.md` (3 phép-thử moat/telos/brand, claim `LG-3-PHA4-test*`) + `06-bang-tra-rule-engines.md` |
| 8 | Lăng-kính tấn/thủ/hậu (3 chiều) khi lập-kế-hoạch | `LG-9-lens-3chieu` | `skills/vn-orchestrator/SKILL.md` **Bước 7** + `skills/vn-executor/SKILL.md` **Bước 1** (cột phân-loại bước; ánh-xạ tấn=AI-AUTO làm, thủ=NEED-APPROVAL gác, hậu=tài-nguyên) | **SỬA** (thêm cột/prompt vào bước có sẵn) | `01-nguyen-ly-va-mo-hinh-tang.md` §1.4-L2 + `03b/03c` |
| 9 | Tên-kép 3 tầng (industry skin + canonical) | `LG-9-tenkep` | `knowledge/departments/*/department.yaml` trường **`aliases_vn`** (ĐÃ CÓ) + `knowledge/packs/*/pack.yaml` trường **`extends_departments`** (ĐÃ CÓ) — tái-dùng trường sẵn, thêm `maps_to`/tên-năng-lực-chuẩn | **SỬA** (mở rộng trường có sẵn, không đẻ trường mới khi tránh được) | `04-taxonomy-generic.md` §4.3 (tên-ngành/tên-năng-lực/maps_to) |
| 10 | Khép-vòng đơn/song + neo Brain + PROMOTE→index | `LG-9-khepvong` | `skills/vn-orchestrator/SKILL.md` **Bước 11** (hiệu-chỉnh) + `vault/00-Brain/calibration.md` (ĐÃ CÓ) + `knowledge/playbook/` (PROMOTE → chèn dòng `_index.md`) | **SỬA** (mở-rộng Bước 11) + **THÊM** (đường PROMOTE) | `03d-pha3-khep-vong.md` (đơn/song-vòng, cổng PASS/PROMOTE/giai-đoạn) + `05-kho-chi-muc.md` (THÊM/PROMOTE) |
| 11 | Đệ-quy hành-động qua router | `LG-9-dequy` | `workflows/debate.js` (4 pha) + escalation ladder (`deptModel`/`HEAVY`/`LIGHT`/`MAX_XEXAM_ROUNDS`) + router Bước 3 | **GIỮ NGUYÊN** | `03c-pha2-thuc-thi.md` (router SIMPLE/COMPLEX/STRATEGIC → debate → executor) |
| 12 | Ưu-tiên triển-khai M1–M6 | `LG-9-uutien` | (không cắm 1 file — là lộ-trình điều-phối toàn-bộ §4–§6 spec này) | (lộ-trình) | mục 4 & 9 spec này |

## 4. Thứ-tự triển-khai theo milestone (LG-9-uutien)

Bám đúng box "Ưu-tiên triển-khai" của SoT (dòng 693): gói tối-thiểu = **M1 + M2** (vá 2 điểm mù lớn nhất, rẻ); sau đó **M4** (đi sâu trục dọc + bật vòng tái-dùng); còn lại **M3/M5/M6** đắp dần. "11 khía-cạnh + 7 khối" là bảng generic — đổi prompt là xong → **gộp vào M2**.

| Milestone | Nội-dung | Hạng-mục §9 phủ | Tập spec triển-khai | Bản-chất công-việc |
|---|---|---|---|---|
| **M1** | telos + altitude | #1 (`LG-9-brain`) | `02-brain-schema` (telos/positioning/curves/structure + nhãn altitude + G0), một phần `08-artifact`, `00`/`01` nền | THÊM file Brain + mở-rộng `brain-schema.md`. Rẻ, ít code. |
| **M2** | debate stage-aware + 11 khía-cạnh / 7 khối | #2 (`LG-9-taxonomy`) + #4 (`LG-9-stage`) + #9 (`LG-9-tenkep`) | `04-taxonomy`, `03a-pha0`, `06-bang-tra` (hàm stage-detect), `vn-orchestrator/SKILL.md` Bước 2–3 | THÊM bảng generic + SỬA prompt orchestrator. Tên-kép gộp vào đây vì cùng đụng taxonomy. |
| **M4** | gom-ngược-lên 3 tầng + tra-kho (KHO) | #3 (`LG-9-taskgen`) + #5 (`LG-9-architect`) + #6 (`LG-9-kho-index`) | `01` §1.4, `03b-pha1`, `05-kho`, `06-bang-tra` (task-gen-grid + reuse-decision), skill `vn-architect` | THÊM skill `vn-architect` + thư-mục `knowledge/playbook/` + `_index.md`. Phần "code" thật-sự nhất. |
| **M3** | đường-cong (S-curve) + mở-rộng | (hỗ-trợ #1: `curves.md`) | `02-brain-schema` (curves), `03e-pha4` | THÊM `curves.md` per-đường-cong, dùng ở PHA 4. |
| **M5** | lăng-kính tấn/thủ/hậu | #8 (`LG-9-lens-3chieu`) | `01` §1.4-L2, `vn-orchestrator/SKILL.md` Bước 7, `vn-executor/SKILL.md` Bước 1 | SỬA: thêm cột/prompt phân-loại 3 chiều. |
| **M6** | khép-vòng + kho (vòng học) | #7 (`LG-9-gate-optimize`) + #10 (`LG-9-khepvong`) | `03d-pha3`, `05-kho` (PROMOTE), `06-bang-tra`, `workflows/debate.js` Red-team, Bước 11 + `calibration.md` | SỬA Red-team prompt + mở-rộng Bước 11 + đường PROMOTE→`_index.md`. |
| **(GIỮ)** | đệ-quy router | #11 (`LG-9-dequy`) | — | KHÔNG triển-khai mới: tái-dùng `debate.js` + escalation ladder nguyên trạng ở mọi milestone. |

**Đường-tới-hạn (critical path):** M1 → M2 → M4. M3/M5/M6 song-song-được sau M2 (không chặn nhau), nhưng M6 (PROMOTE) phụ-thuộc M4 (KHO `_index.md` đã tồn-tại để chèn dòng).

## 5. Ranh-giới generic ↔ phân-rã

Spec 09 chỉ đấu-dây nên không tự sinh dữ-liệu; ranh-giới generic/phân-rã của từng hạng-mục thuộc spec gốc. Tóm-tắt cho mục-đích đấu-dây:

- **GENERIC (config/bảng tĩnh cắm vào code):** bảng 11 khía-cạnh / 7 khối / 12 phòng (#2 — vào `brain-schema.md` + SKILL.md), rubric stage (#4 — `06-bang-tra`), rubric reuse-decision A/B/C (#6), luật 3 lớp sinh nhiệm-vụ (#3), 3 chiều tấn/thủ/hậu (#8), 3 phép-thử mở-rộng (#7), từ-điển tên-năng-lực-chuẩn (#9). Bất-biến C4: phải hiện-thực dưới dạng **bảng/luật ở 1 nơi** (file schema/prompt dùng-chung), KHÔNG hard-code rải-rác.
- **PHÂN-RÃ (AI suy mỗi DN, KHÔNG cắm tĩnh):** nội-dung telos/positioning/curves/structure của từng DN (#1 — file vault), kết-quả aspect-walk + cây gom-ngược (#5), nội-dung `_index.md` mỗi ngành (#6 — tài-sản, không phải schema), tên-ngành cụ-thể trong `aliases_vn` (#9).

## 6. Cổng & luật bất-biến

**Bất-biến chủ-đạo (SoT dòng 674-675): "tái-dùng tối-đa · thêm tối-thiểu" — KHÔNG đập đi xây lại.** Cụ-thể GIỮ NGUYÊN, KHÔNG được phá khi triển-khai:

1. **`workflows/debate.js`** — engine 4 pha (Perspectives → Cross-examination → Red-team → Synthesize), schemas, escalation ladder. Chỉ được **thêm luật vào prompt** pha Red-team (#7), KHÔNG đổi cấu-trúc pha / signature. (`LG-9-dequy` GIỮ NGUYÊN.)
2. **Router** (`vn-orchestrator` Bước 3) — phân-loại SIMPLE/COMPLEX/STRATEGIC, guard độ-phủ, luân-phiên luật-sư-của-quỷ. Chỉ THÊM bước stage-detect (#4) cạnh nó.
3. **Executor** (`vn-executor`) — 4 nhóm bước AI-AUTO/NEED-INFO/NEED-APPROVAL/HUMAN-ONLY, sổ `10-run-state.md` resume-được, cổng HITL ở main loop. Chỉ THÊM ánh-xạ 3 chiều vào cột phân-loại (#8).
4. **Packs** (`knowledge/packs/*`) — `adds_departments` / `extends_departments` / `aliases_vn`. Tên-kép (#9) **tái-dùng trường có sẵn**, KHÔNG đẻ schema pack mới khi tránh được.
5. **Grounding** (nhãn `[số thật DN]` / `[benchmark ngành — cần CEO xác minh]`, brain-schema validator) — GIỮ; file Brain mới (#1) tuân cùng luật grounding.
6. **HITL** — 3 PAUSE của orchestrator + cổng phê-duyệt của executor. Mọi hạng-mục mới phải cắm cổng vào các PAUSE/cổng SẴN-CÓ, KHÔNG tạo cơ-chế duyệt song-song.

**Cổng CỨNG kế-thừa (không hạng-mục §9 nào được nới):** NEED-APPROVAL cho chi tiền / ký-nộp pháp-lý / công-bố / gửi email-tin / thao-tác không-hoàn-tác (claim `LG-3-PHA2-gate-cung`). Cổng G0 (`LG-2-gate-G0`) kiểm telos trước khi đổ công-sức — M1 phải cài.

**Pre-condition triển-khai:** M6 (PROMOTE → `_index.md`) yêu-cầu M4 đã tạo `knowledge/playbook/<ngành>/_index.md`. **Post-condition mỗi milestone:** `tools/check-coverage.js` xanh cho tập claim của milestone đó.

## 7. Giao-diện & điểm-cắm code (danh-mục cụ-thể)

Liệt-kê đầy-đủ điểm-cắm, gom theo file thật trong repo (đường-dẫn tuyệt-đối tính từ gốc repo):

**A. `knowledge/brain-schema.md`** — [SỬA + THÊM]
- Mở-rộng bảng "5 file canonical" → thêm `telos.md`, `positioning.md`, `curves.md`, `structure.md` (Brain) + `lessons.md` (memory) (#1). → spec `02`.
- Thêm mục "Taxonomy generic": bảng 11 khía-cạnh (4 nhóm) + 7 khối + 12 phòng (#2). → spec `04`.
- Thêm trường `stage` (state.md) + nhãn `altitude` (decisions-log.md) (#1, #4). → spec `02`.

**B. `skills/vn-orchestrator/SKILL.md`** — [SỬA]
- Bước 2–3: chèn stage-detect (đọc `state.md`/`budget.md` → rubric câu-sống-còn → `brainContext`) + bảng tham-chiếu 11 khía-cạnh/7 khối cạnh router (#2, #4). → spec `03a`, `06`.
- Bước 7: chèn cơ-chế sinh nhiệm-vụ-chính 3 lớp + lăng-kính tấn/thủ/hậu (#3, #8). → spec `01` §1.4, `06`.
- Bước 11: mở-rộng khép-vòng đơn/song + neo Brain + đường PROMOTE (#10). → spec `03d`, `05`.

**C. `workflows/debate.js`** — [SỬA prompt, GIỮ cấu-trúc]
- Phase 3 Red-team (`claims`/`redTeam` prompts ~dòng 179-198): thêm luật optimize-before-scale + phép-thử telos cho brief mở-rộng (#7). → spec `03e`, `06`.
- Phần escalation ladder + 4 pha: GIỮ NGUYÊN (#11). → spec `03c`.

**D. `skills/vn-executor/SKILL.md`** — [SỬA]
- Bước 1–2: ánh-xạ 3 chiều tấn/thủ/hậu vào cột phân-loại bước (tấn↔việc LÀM, thủ↔NEED-APPROVAL gác, hậu↔tài-nguyên) (#8). → spec `01` §1.4-L2, `03c`.

**E. `knowledge/departments/*/department.yaml` + `knowledge/packs/*/pack.yaml`** — [SỬA, tái-dùng trường]
- `aliases_vn` (đã có ở mọi department.yaml) + `extends_departments` (đã có ở pack.yaml) mang 3 tầng tên-kép; thêm `maps_to`/tên-năng-lực-chuẩn làm khóa tra-KHO (#9). → spec `04` §4.3.

**F. Mới — `skills/vn-architect/SKILL.md`** (hoặc mở-rộng agent `pack-architect`) — [THÊM]
- aspect-walk → gom-ngược-lên 3 tầng + tra-kho reuse/adapt/new (#5, #6). → spec `03b`, `05`, `06`.

**G. Mới — `knowledge/playbook/<ngành>/`** — [THÊM thư-mục]
- `_index.md` (bảng chuẩn 13 cột) + cây `K*/dept-*/<bộ-phận>/` tài-sản (#6). → spec `05`.

## 8. Tiêu-chí chấp-nhận

Test cho spec đấu-dây = **mỗi hạng-mục §9 phải có spec chi-tiết tương-ứng + điểm-cắm tồn-tại trong repo** (không hạng-mục nào mồ-côi):

| ID test | Kiểm | Pass khi |
|---|---|---|
| T9-map-complete | Mỗi hàng mục 3 có ô "Spec định-nghĩa chi-tiết" trỏ tới spec 01–08 tồn-tại trong `specs/` | 12/12 hàng có spec link sống (file tồn-tại) |
| T9-anchor-exists | Mỗi điểm-cắm mục 7 (loại GIỮ/SỬA) trỏ tới file đang tồn-tại trong repo | `brain-schema.md`, `vn-orchestrator/SKILL.md`, `debate.js`, `vn-executor/SKILL.md`, `department.yaml`, `pack.yaml` đều tồn-tại; điểm THÊM ghi rõ "mới" |
| T9-keep-invariant | Hạng-mục `LG-9-dequy` không có dòng SỬA/THÊM nào chạm cấu-trúc 4 pha của `debate.js` | grep `debate.js` trong cột "Loại" chỉ ra "SỬA prompt" hoặc "GIỮ", không "đổi pha/signature" |
| T9-milestone-order | M6 (PROMOTE) liệt M4 là pre-condition; M1→M2→M4 là critical path | mục 4 ghi đúng phụ-thuộc; `check-coverage` xanh theo từng milestone |
| T9-no-orphan-spec | Mỗi spec 01–08 được ≥1 hàng §9 tham-chiếu (đấu-dây 2 chiều) | 01,02,03(a-e),04,05,06,07,08 đều xuất-hiện ở cột spec chi-tiết hoặc mục 4 |
| T9-cover-12 | `covers:` front-matter = đúng 12 claim `LG-9-*` | `tools/check-coverage.js` C1+C2 xanh cho nhóm LG-9 |

**Lát Phở Hà (LG-7-*) liên-quan:** spec 09 là sơ-đồ dây → không có fixture số-liệu riêng. Nó được nghiệm gián-tiếp: golden-fixture Phở Hà (`07-fixture-pho-ha.md`) chạy đúng PHA 0→4 ⟹ chứng tỏ các điểm-cắm M1/M2/M4 (stage-detect GĐ4, aspect-walk 11 khía-cạnh, gom-ngược reuse 4/5, PROMOTE) đã đấu đúng. Test tích-hợp `07` là acceptance đầu-cuối cho ma-trận đấu-dây này.

## 9. Phụ-thuộc & thứ-tự

- **Milestone của spec 09:** **M1** (khởi-dây sớm — phải có bản-đồ trước khi triển-khai bất-kỳ milestone nào), nhưng **nội-dung dây** chỉ hoàn-chỉnh khi spec 01–08 đã viết → `depends_on` toàn-bộ 01–08.
- **Thứ-tự đọc khuyến-nghị:** đọc `00`/`01`/`02` (nền) → `04` (taxonomy) → `03a–03e` (luồng) → `05`/`06` (kho + rule-engine) → `08` (vault) → **09 (spec này) để thấy toàn-cảnh đấu-dây** → `07` (golden-test khóa hành-vi).
- **Lộ-trình triển-khai code:** theo mục 4 — M1 → M2 (+taxonomy/stage/tên-kép) → M4 (architect + KHO) → M3/M5/M6 dần. `LG-9-dequy` không có pha triển-khai (GIỮ).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-9-brain | §3 hàng 1 · §7.A | T9-anchor-exists, T9-map-complete |
| LG-9-taxonomy | §3 hàng 2 · §7.A,B · §5 (generic) | T9-map-complete, T9-anchor-exists |
| LG-9-taskgen | §3 hàng 3 · §7.B | T9-map-complete |
| LG-9-stage | §3 hàng 4 · §7.B | T9-map-complete, T9-anchor-exists |
| LG-9-architect | §3 hàng 5 · §7.F | T9-map-complete (spec 03b/01), T9-anchor-exists (file "mới") |
| LG-9-kho-index | §3 hàng 6 · §7.G | T9-map-complete (spec 05/06) |
| LG-9-gate-optimize | §3 hàng 7 · §7.C · §6 cổng cứng | T9-keep-invariant, T9-map-complete |
| LG-9-lens-3chieu | §3 hàng 8 · §7.B,D | T9-map-complete, T9-anchor-exists |
| LG-9-tenkep | §3 hàng 9 · §7.E · §5 (generic) | T9-anchor-exists (trường có sẵn), T9-map-complete |
| LG-9-khepvong | §3 hàng 10 · §7.B Bước 11 | T9-map-complete (spec 03d/05) |
| LG-9-dequy | §3 hàng 11 · §6.1 · §4 (GIỮ) | T9-keep-invariant |
| LG-9-uutien | §3 hàng 12 · §4 (M1–M6) · §9 | T9-milestone-order |

## 11. OPEN-Q

1. Hạng-mục #5 (`LG-9-architect`): **skill `vn-architect` MỚI** hay **mở-rộng agent `pack-architect` sẵn-có** (chế-độ function-first)? SoT cho cả 2 lựa-chọn (dòng 684). Đề-xuất: skill mới `vn-architect` để tách rõ trục-dọc (sinh-thành) khỏi `pack-architect` (sinh pack ngành) — cần CEO chốt vì ảnh-hưởng critical path M4.
2. Hạng-mục #9 (`LG-9-tenkep`): khóa tra-KHO "tên-năng-lực-chuẩn" có cần **trường mới** trong `department.yaml` (vd `capability_name`/`maps_to`) hay nhét vào `aliases_vn` đủ? SoT nói "tái-dùng trường có sẵn" nhưng `maps_to` canonical (claim `LG-4.3-maps-to`) có thể cần trường riêng — giáp-ranh giữa bất-biến "thêm tối-thiểu" và nhu-cầu khóa tra ổn-định. Cần `04-taxonomy` chốt trước, spec 09 theo sau.
