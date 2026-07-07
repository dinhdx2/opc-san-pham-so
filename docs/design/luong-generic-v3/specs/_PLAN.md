# Kế-hoạch viết SPEC implement cho `luong-generic-v3.html`

> **Mục-đích:** Biến tài-liệu thiết-kế `luong-generic-v3.html` (v3.3) thành một **bộ spec mô-tả chi-tiết, sẵn-sàng-code**, mỗi spec ứng với một phần của tài-liệu — KÈM **cơ-chế truy-vết đảm-bảo không bỏ sót bất-kỳ chi-tiết nào** của nguồn.
> **Trạng-thái:** BẢN-THẢO kế-hoạch — CEO duyệt trước khi sinh spec.
> **Nguồn-sự-thật (SoT):** `../luong-generic-v3.html` (v3.3). Spec KHÔNG được mâu-thuẫn hay vượt ngoài SoT; muốn thêm ý mới → sửa SoT trước, rồi mới sửa spec.

---

## A · Nguyên-tắc nền

1. **SoT một chiều:** `luong-generic-v3.html` là nguồn duy-nhất. Spec *triển-khai* nó, không *phát-minh* thêm. Phát-hiện thiếu/sai trong SoT → ghi `OPEN-Q`, chỉnh SoT trước.
2. **Truy-vết hai chiều (bi-directional traceability):** mỗi *câu-khẳng-định* (claim) trong SoT phải có ≥1 spec phủ; mỗi câu trong spec phải trỏ ngược về ≥1 claim. Không claim mồ-côi, không spec bịa.
3. **Generic vs Phân-rã giữ nguyên ranh-giới:** spec phải phân-biệt rõ cái nào là **config/bảng cố-định** (generic) vs cái nào là **thuật-toán suy-ra mỗi DN** (phân-rã) — đúng §1.1 của SoT.
4. **Implementable = kiểm-được:** mỗi spec kết-thúc bằng tiêu-chí chấp-nhận (acceptance) chạy được, không phải mô-tả văn-xuôi.
5. **Bám codebase thật:** điểm cắm lấy từ §9 SoT + cây repo thật (`skills/vn-orchestrator|vn-executor|vn-onboarder`, `workflows/debate.js`, `knowledge/brain-schema.md`, `knowledge/packs/*`, `department.yaml`).

---

## B · CƠ-CHẾ ĐẢM-BẢO KHÔNG BỎ SÓT (trái tim của kế-hoạch)

Gồm 7 bước; bước B1–B2 tạo "lưới truy-vết", B3–B6 là các cổng kiểm, B7 là golden-test đầu-cuối.

### B1 · Atomize SoT → **Sổ-claim** (`_claims.md`)
Bẻ toàn-bộ HTML thành **claim nguyên-tử** = đơn-vị nhỏ nhất có-thể-kiểm. Mỗi claim 1 dòng, có **ID ổn-định**.

- **Lược-đồ ID:** `LG-<sec>[.<sub>][-<loại><seq>]`
  - `sec` = số phần (0–9) hoặc `G` (glossary).
  - Ví-dụ: `LG-1.4-R1` (Lớp 1 của cơ-chế §1.4), `LG-6.1-row3` (hàng GĐ3 của bảng rubric stage), `LG-3-PHA2-gate1` (cổng cứng NEED-APPROVAL), `LG-2-file-telos`, `LG-G-moat`.
- **Quy-tắc atomize (mỗi cái = ≥1 claim):**
  - mỗi **hàng bảng** = 1 claim; mỗi **cột schema** = 1 claim.
  - mỗi **cổng** (G0, Cổng A/B, cổng cứng, PASS/PROMOTE, cổng giai-đoạn) = 1 claim.
  - mỗi **luật/bullet** trong list = 1 claim; mỗi **note/warn/ok** box = 1 claim.
  - mỗi **bước sơ-đồ ASCII** (PHA, mũi-tên nhân-quả) = 1 claim.
  - mỗi **thuật-ngữ glossary** = 1 claim.
- **Trường mỗi claim:** `id | section | loại(rule/schema/gate/table-row/flow/term/example) | generic|phân-rã | nội-dung-1-câu | spec phủ | test phủ | trạng-thái`.
- Quy-mô ước-tính: ~200–230 claim (0:~4 · 1:~22 · 2:~16 · 3:~32 · 4:~26 · 5:~20 · 6:~34 · 7:~12 · 8:~12 · 9:~12 · glossary:~40).

### B2 · **Ma-trận phủ** (claim × spec) trong `_coverage.md`
Bảng: hàng = claim ID, cột = spec doc. Ô đánh-dấu spec nào phủ claim nào. Đọc dọc thấy 1 spec gánh gì; đọc ngang thấy 1 claim có nhà chưa. **Claim không ô nào = lỗ-hổng → chặn.**

### B3 · Front-matter "Source coverage" trong MỖI spec
Mỗi spec mở đầu bằng:
```yaml
covers: [LG-2-file-telos, LG-2-file-positioning, LG-2-gate-G0, ...]   # claim phủ
depends_on: [01-nguyen-ly, ...]                                       # spec phụ-thuộc
source_anchor: "luong-generic-v3.html §2"                            # neo nguồn
```
Cuối spec có **Bảng truy-vết**: `claim ID → mục/đoạn trong spec → acceptance test`.

### B4 · Bốn cổng kiểm coverage (định-lượng, máy chạy được)
- **C1 · Toàn-phủ (no orphan):** ∀ claim ∈ `_claims.md` ⇒ xuất-hiện trong `covers:` của ≥1 spec. *(đảm-bảo "không bỏ sót".)*
- **C2 · Không-bịa (no dangling):** ∀ ID trong mọi `covers:` ⇒ tồn-tại trong `_claims.md`. *(spec không vượt nguồn.)*
- **C3 · Test-phủ:** ∀ claim loại `rule/schema/gate/table-row` ⇒ map tới ≥1 acceptance test.
- **C4 · Generic-nhãn:** ∀ claim đánh `generic` ⇒ spec hiện-thực nó dưới dạng **config/bảng tĩnh** (không hard-code rải-rác), khớp §1.1.

### B5 · Cặp agent đối-kháng (chống sót "ẩn" mà C1 không bắt)
C1 chỉ bắt claim **đã có trong sổ**; nếu atomize bỏ sót claim ngay từ B1 thì C1 mù. Nên thêm 2 lượt độc-lập:
- **Completeness critic:** 1 agent đọc LẠI từng phần HTML, liệt claim nó thấy, **diff với `_claims.md`** → claim thiếu phải bổ-sung. (loop-until-dry: lặp tới khi 2 vòng liền không ra claim mới.)
- **Scope-creep auditor:** 1 agent đọc từng spec, gắn cờ câu **không trỏ về claim nào** → hoặc xoá (bịa) hoặc tạo claim mới trong SoT (nếu hợp-lý → quay lại A.1 sửa SoT).

### B6 · Trình kiểm `check-coverage` (CI-able)
Script nhỏ (node, để trong `specs/tools/`): parse `_claims.md` + mọi front-matter `covers:` → in báo-cáo C1/C2/C3, exit≠0 nếu vi-phạm. Chạy mỗi lần sửa spec hoặc SoT. Biến "không bỏ sót" thành **điều-kiện build**, không phải niềm-tin.

### B7 · Golden-fixture từ §7 "Phở Hà"
Ví-dụ Phở Hà = **test đầu-cuối**: mỗi PHA (0→4) thành 1 kịch-bản kỳ-vọng (input Brain → output mong-đợi: stage GĐ4, danh-sách khía-cạnh thức/ngủ, cây cấu-trúc reuse 4/5, các cổng kích-hoạt…). Pipeline implement xong phải tái-tạo đúng fixture. Đây là claim-set `LG-7-*` và cũng là test tích-hợp cao nhất.

> **Tóm-tắt bảo-đảm:** B1 (sổ claim) + B4-C1 (toàn-phủ) là điều-kiện *đủ về hình-thức*; B5 (critic) vá lỗ atomize; B6 (máy) giữ nó luôn đúng theo thời-gian; B7 chứng-minh đúng *hành-vi*. Bốn lớp → "không bỏ sót" vừa được *chứng-minh* vừa được *duy-trì*.

---

## C · Bộ SPEC docs (ứng từng phần SoT)

Một spec / một phần SoT. Phần khái-niệm (0, glossary) gộp vào spec nền. `§9` là spec "đấu-dây" tổng.

| Spec file (trong `specs/`) | Phủ phần SoT | Bản-chất implement | Điểm cắm code chính |
|---|---|---|---|
| `00-tong-quan-va-thuat-ngu.md` | §0 Bối-cảnh + Glossary | từ-điển khái-niệm + nguyên-tắc kiến-trúc (2 trục) | (nền, không code) |
| `01-nguyen-ly-va-mo-hinh-tang.md` | §1 (1.1–1.4) | **domain model + luật validate**: generic/phân-rã, altitude, test đúng-tầng, **cơ-chế sinh nhiệm-vụ-chính 3 lớp** | `vn-orchestrator/SKILL.md` Bước 7; validators |
| `02-brain-schema.md` | §2 + §8 (artifact Brain) | **data contract** 00-Brain (telos/positioning/curves/structure + 5 file cũ + bộ-nhớ), nhãn altitude, cổng G0 | `knowledge/brain-schema.md` (mở-rộng) |
| `03-luong-orchestration.md` (+ phụ `03a..03e` mỗi PHA) | §3 PHA 0–4 | **state-machine pipeline** + Vào/Ra/Cổng từng PHA + router đệ-quy + phanh chi-phí | `vn-orchestrator/SKILL.md`, `workflows/debate.js`, `vn-executor` |
| `04-taxonomy-generic.md` | §4 (4.1–4.3) | **bảng cố-định as config**: 11 khía-cạnh (4 nhóm), 7 khối, 12 phòng, tên-kép 3 nhãn | `brain-schema.md` + `department.yaml aliases_vn` + pack `extends_departments` |
| `05-kho-chi-muc.md` | §5 (5.1–5.3) | **schema `_index.md` + CRUD vòng-đời** (thêm/tra/dọn, deprecate, version) | `knowledge/playbook/<ngành>/` |
| `06-bang-tra-rule-engines.md` (6 bảng = 6 hàm) | §6 (6.1–6.6) | **6 hàm xác-định**: stage-detect, double-loop-route, goal-by-aspect, **task-gen-grid**, reuse-decision, naming-dict | rải vào orchestrator/executor + `debate.js` Red-team |
| `07-fixture-pho-ha.md` | §7 | **golden end-to-end test** (B7) | test/fixtures |
| `08-artifact-vault-layout.md` | §8 | **bố-cục file & IO** vault (đường-dẫn, đọc/ghi Read/Write, git-persist) | vault + skills |
| `09-codebase-integration-map.md` | §9 | **spec đấu-dây**: mỗi hạng-mục → file/hàm/prompt + loại (giữ/thêm) + lộ-trình M1–M6 | toàn repo |
| `_claims.md` · `_coverage.md` · `tools/check-coverage.*` | (toàn-bộ) | sổ-claim + ma-trận + trình kiểm (B1/B2/B6) | — |

---

## D · TEMPLATE spec chuẩn (mọi spec dùng chung — đảm-bảo "chi-tiết, code được")

```
---
id, version, status, source_anchor
covers: [LG-...]            # B3
depends_on: [...]
---
1. Mục-đích & phạm-vi (1 đoạn)
2. Thuật-ngữ liên-quan (link 00)
3. Mô-hình dữ-liệu      — schema/field/kiểu/định-dạng file CHÍNH XÁC (bảng)
4. Hành-vi / thuật-toán — pseudocode, thứ-tự, chuyển-trạng-thái, edge-case
5. Ranh-giới generic ↔ phân-rã — cái gì là config tĩnh, cái gì suy-ra
6. Cổng & luật bất-biến — gates, ràng-buộc CỨNG (vd NEED-APPROVAL), pre/post-condition
7. Giao-diện & điểm-cắm code — file/hàm/prompt cụ-thể (từ §9)
8. Tiêu-chí chấp-nhận — test/fixture chạy được (gồm lát Phở Hà liên-quan)
9. Phụ-thuộc & thứ-tự — milestone M1–M6, spec chặn trước
10. Bảng truy-vết — claim ID → mục spec → test (B3)
11. OPEN-Q — chỗ SoT mơ-hồ cần CEO chốt
```

---

## E · Thứ-tự thực-hiện (bám M1–M6 của §9 SoT) + Definition-of-Done

| Đợt | Spec viết | Lý-do (theo ưu-tiên §9) |
|---|---|---|
| **0 · Hạ-tầng truy-vết** | `_claims.md`, `_coverage.md`, `00`, `tools/check-coverage` | phải có lưới trước khi viết spec nội-dung |
| **1 (M1+M2)** | `02-brain-schema`, `04-taxonomy`, `01-nguyen-ly` | vá 2 điểm mù lớn nhất: telos+altitude, debate nhận-thức-GĐ, 11 khía-cạnh/7 khối |
| **2 (M2+M4)** | `03-luong` (+PHA), `06-bang-tra`, `05-kho` | pipeline + 6 rule-engine + kho tái-dùng |
| **3** | `08-artifact`, `09-integration`, `07-fixture` | đấu-dây + golden-test khóa hành-vi |

**DoD mỗi spec:** (a) đủ 11 mục template; (b) mọi `covers:` qua C2; (c) phần claim của nó qua C1; (d) ≥1 acceptance test cho mỗi claim rule/gate/schema; (e) critic+auditor (B5) ký; (f) OPEN-Q rỗng hoặc đã có quyết CEO.

---

## F · Quy-trình đồng-bộ khi SoT đổi (chống "spec mục-rữa")

1. Sửa `luong-generic-v3.html` (vd v3.4) →
2. cập-nhật `_claims.md` (thêm/sửa/đánh `deprecated` claim, GIỮ ID cũ để vết) →
3. `check-coverage` báo claim mới chưa phủ / spec trỏ claim đã chết →
4. sửa spec liên-quan tới khi C1–C3 xanh →
5. commit cả SoT + claim + spec cùng lượt. *(ID ổn-định ⇒ diff truy được "đổi gì, ảnh-hưởng spec nào".)*

---

## G · OPEN-Q cần CEO chốt trước khi chạy

1. Spec viết bằng **Markdown trong `specs/`** (đề-xuất) hay định-dạng khác?
2. Trình `check-coverage` viết **Node** (repo đã có `workflows/*.js`) — đồng-ý?
3. `03-luong` tách 5 file con/PHA (chi-tiết hơn) hay gộp 1 file? (đề-xuất: tách.)
4. Có sinh luôn **đợt 0 (sổ-claim + ma-trận + trình kiểm)** ngay sau khi duyệt kế-hoạch này không?
