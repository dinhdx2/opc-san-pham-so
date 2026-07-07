---
id: 08-artifact-vault-layout
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §8 (dòng 646-668)"
covers: [LG-8-telos, LG-8-positioning, LG-8-curves, LG-8-hientrang, LG-8-structure, LG-8-plan-gd, LG-8-structure-task, LG-8-plan-action, LG-8-runstate, LG-8-memory, LG-8-kho-index, LG-8-kho-asset]
depends_on: [00-tong-quan-va-thuat-ngu, 02-brain-schema, 05-kho-chi-muc, 03-luong-orchestration]
milestone: M4
---

# 08 · Bố-cục artifact & IO vault

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§8 SoT — "Bản-đồ artifact trong vault: cái gì nằm ở đâu"**: liệt-kê **MỌI** artifact mà luồng generic v3 đọc/ghi, **đường-dẫn chính-xác** của từng cái, **lớp** (altitude/loại) nó thuộc, đánh dấu **MỚI/CŨ**, và **trỏ tới spec chủ** định-nghĩa schema chi-tiết của nó. Spec này là **bản-đồ + quy-ước IO**, KHÔNG định-nghĩa lại schema (đã ở `02`/`05`/`03*`); nó giữ một-nguồn-sự-thật về **chỗ-ở** (where) và **cách-truy-cập** (how to read/write) của file, sao cho mọi spec khác và code tham-chiếu cùng một bố-cục, không lệch đường-dẫn.

**Trong phạm-vi:** bảng đầy-đủ 12 hạng-mục artifact (đường-dẫn · lớp · MỚI/CŨ · spec chủ); quy-ước IO web-vault (`Read`/`Write`/`Glob`/`Edit`, KHÔNG MCP Obsidian); luật bền-vững `git add/commit/push` (môi-trường ephemeral); ranh-giới file MỚI vs CŨ; bố-cục cây thư-mục `vault/` + `knowledge/` + `skills/`; test khớp-đường-dẫn + round-trip ghi→đọc→git.

**Ngoài phạm-vi (ở spec chủ):** trường/kiểu bên trong file Brain → `02-brain-schema.md`; cột `_index.md` + cấu-trúc thư-mục tài-sản + reuse-grade + vòng-đời KHO → `05-kho-chi-muc.md`; ngữ-nghĩa file kế-hoạch/run-state theo PHA → `03c-pha2-thuc-thi.md`/`03-luong-orchestration.md`; ngữ-nghĩa `decisions-log/calibration/lessons` trong khép-vòng → `03d-pha3-khep-vong.md`.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md`:
- **telos** (`LG-G-telos`), **moat/cỗ-máy** (`LG-G-moat`), **beachhead/đầu-cầu** (`LG-G-beachhead`), **wedge/điểm-xuất-phát** (`LG-G-wedge`).
- **s-curve/đường-cong** (`LG-G-s-curve`), **vòng-đời 6 GĐ** (`LG-G-lifecycle-gd`).
- **altitude/tempo** (`LG-G-altitude-tempo`) — thang xếp lớp file Brain.
- **3 tầng cấu-trúc** khối ▷ phòng ▷ bộ-phận (`LG-G-khoi-phong-bo-phan`), **gom-ngược-lên** (`LG-G-gom-nguoc-len`).
- **kho-index** (`LG-G-kho-index`), **reuse/adapt/new** (`LG-G-reuse-adapt-new`), **reuse-grade** (`LG-G-reuse-grade`), **promote** (`LG-G-promote`).
- **rolling-wave/cuộn-sóng** (`LG-G-rolling-wave`), **HITL** (`LG-G-hitl`).

## 3. Mô-hình dữ-liệu

### 3.1 Bảng MỌI artifact (đường-dẫn · lớp · MỚI/CŨ · spec chủ)

Quy-ước cột: **đường-dẫn chính-xác** (tương-đối gốc repo; phần Brain dưới `vault/00-Brain/`, phần task dưới `vault/02-Tasks/<slug>/`) · **lớp** (lớp-nhịp altitude của Brain §3.0 spec `02`, hoặc loại artifact với task/KHO) · **MỚI/CŨ** (so hệ vn-opc hiện có) · **spec chủ** (spec định-nghĩa schema — chỉ *tham-chiếu*, claim do spec chủ phủ) · **claim §8**.

> **Ghi-chú multi-vault (cập-nhật):** đường-dẫn `vault/...` trong bảng là **tên rút-gọn** của **vault ĐANG-DÙNG**. Thực-tế hệ chạy **multi-vault**: mỗi DN một thư-mục riêng `vaults/<slug>/`, con-trỏ `.vn-active-vault` (gốc repo) chọn vault active, fallback `vault/` (legacy) khi vắng. Code resolve qua `lib/vault.js#resolveActiveVault`. Vậy mọi `vault/00-Brain/x.md` ở bảng đọc/ghi thực-tế tại `<VAULT>/00-Brain/x.md` với `<VAULT>` = vault active. Bố-cục bên-trong vault (00-Brain/02-Tasks/03-Outputs) là BẤT-BIẾN giữa các vault.

| # | Đường-dẫn chính-xác | Lớp | MỚI/CŨ | Spec chủ định-nghĩa schema | Claim |
|---|---|---|---|---|---|
| 1 | `vault/00-Brain/telos.md` | bất-biến (telos) | **MỚI** | `02-brain-schema.md` §3.1 (hàng telos) + `LG-2-file-telos` | LG-8-telos |
| 2 | `vault/00-Brain/positioning.md` | định-vị | **MỚI** | `02-brain-schema.md` §3.1 (hàng positioning) + `LG-2-file-positioning` | LG-8-positioning |
| 3 | `vault/00-Brain/curves.md` | định-vị (danh-mục) | **MỚI** | `02-brain-schema.md` §3.1 (hàng curves) + `LG-2-file-curves` | LG-8-curves |
| 4 | `vault/00-Brain/state.md` **+ 4 file cũ** (`strategy.md` · `products.md` · `budget.md` · `headcount.md`) | hiện-trạng | **CŨ** (`state.md` = **CŨ+**: thêm trường `stage`) | `02-brain-schema.md` §3.1/§3.2 + `LG-2-file-state` (+ strategy/products/budget/headcount) | LG-8-hientrang |
| 5 | `vault/00-Brain/structure.md` | cấu-trúc | **MỚI** | `02-brain-schema.md` §3.1/§3.3 (cây 3 tầng + tên-kép + `activation` + `reused_from`) + taxonomy `04` + `LG-2-file-structure` | LG-8-structure |
| 6 | `vault/02-Tasks/<slug>/08-execution-plan.md` | kế-hoạch/giai-đoạn (cuộn-sóng) | CŨ (giữ slot 08) | `03-luong-orchestration.md` / `03b-pha1-phan-ra.md` (rolling-wave); thuật-ngữ `LG-G-rolling-wave` | LG-8-plan-gd |
| 7 | `vault/02-Tasks/<slug>/06-structure.md` | cấu-trúc/task (cây suy-ra + báo-cáo tra-kho) | CŨ (giữ slot 06) | `03b-pha1-phan-ra.md` (PHA 1C gom-ngược + tra-kho reuse/adapt/new) + `05-kho-chi-muc.md` | LG-8-structure-task |
| 8 | `vault/02-Tasks/<slug>/10-thuc-thi-<action>.md` | kế-hoạch/hành-động (1 file/hành-động) | CŨ (giữ slot 10) | `03c-pha2-thuc-thi.md` (debate ra kế-hoạch-thực-thi-riêng) + `LG-3-PHA2-debate` | LG-8-plan-action |
| 9 | `vault/02-Tasks/<slug>/10-run-state.md` | sổ thực-thi (nguồn-sự-thật để resume) | CŨ | `03c-pha2-thuc-thi.md` (bước nguyên-tử AI-AUTO/NEED-INFO/NEED-APPROVAL/HUMAN-ONLY) + `LG-3-PHA2-executor` | LG-8-runstate |
| 10 | `vault/00-Brain/decisions-log.md` · `vault/00-Brain/calibration.md` · `vault/00-Brain/lessons.md` | bộ-nhớ (append-only) | `decisions-log`/`calibration` = CŨ (`decisions-log` **CŨ+**: gắn nhãn `altitude`); `lessons.md` = **MỚI** | `02-brain-schema.md` §3.1 (`LG-2-file-decisions`/`LG-2-file-calibration`) + `03d-pha3-khep-vong.md` (`lessons.md`, nhãn altitude) | LG-8-memory |
| 11 | `knowledge/playbook/<ngành>/_index.md` | KHO chỉ-mục (bảng chuẩn khối→phòng→bộ-phận) | **MỚI** | `05-kho-chi-muc.md` §5.2 (13 cột) + `LG-2-file-index` + `LG-5.1-tree` | LG-8-kho-index |
| 12 | `knowledge/playbook/<ngành>/<Kx>/<dept>/<bộ-phận>/` | KHO tài-sản (git-first, Drive tùy-chọn) | **MỚI** | `05-kho-chi-muc.md` §5.1 (cây SOP/template/persona/rubric/meta) + `LG-2-file-asset` | LG-8-kho-asset |

> **Giữ một-nguồn-sự-thật:** cột "spec chủ" là nơi schema được *định-nghĩa*; spec `08` chỉ *trỏ* tới đó. Theo quy-ước `_PLAN.md §B3` và `_coverage.md`, claim Brain `LG-2-*` / KHO `LG-5-*` do spec chủ phủ; spec này phủ đúng 12 claim `LG-8-*` (chỗ-ở artifact), KHÔNG nhân-bản claim của spec khác.

### 3.2 Quy-ước slot-số trong `02-Tasks/<slug>/`

Bốn artifact task dùng **tiền-tố-số làm slot ổn-định** để vừa giữ thứ-tự đọc vừa cho code/Glob bắt theo mẫu:

| Slot | Mẫu Glob | Số lượng/task | Vai-trò |
|---|---|---|---|
| `06-structure.md` | `06-structure.md` | 1 | cây cấu-trúc suy-ra + báo-cáo tra-kho (reuse/adapt/new) của task. |
| `08-execution-plan.md` | `08-execution-plan.md` | 1 | kế-hoạch giai-đoạn, cuộn-sóng (chỉ chi-tiết việc gần). |
| `10-thuc-thi-<action>.md` | `10-thuc-thi-*.md` | **N** (1/hành-động) | kế-hoạch-thực-thi-riêng cho từng hành-động sau debate PHA 2. |
| `10-run-state.md` | `10-run-state.md` | 1 | sổ thực-thi — nguồn-sự-thật để resume. |

> `<slug>` = thư-mục task (vd `2026-06-29-thiet-ke-luong-generic-v3`). `<action>` = kebab-case tên hành-động (vd `dam-phan-thit-bo`). `<ngành>`/`<Kx>`/`<dept>`/`<bộ-phận>` = kebab-case (chuẩn `LG-5.3-chuan-ten`, ở `05`).

## 4. Hành-vi / thuật-toán — quy-ước IO vault

### 4.1 Đọc/ghi = `Read`/`Write`/`Glob`/`Edit` (KHÔNG MCP Obsidian)

Bám CLAUDE.md ("Vault = thư-mục `vault/` trong repo, đọc/ghi bằng `Read`/`Write`/`Glob`/`Edit` — KHÔNG dùng MCP Obsidian — không tồn-tại trên web") và spec `02` §4.1:

| Thao-tác | Tool | Ghi-chú |
|---|---|---|
| Đọc 1 file | `Read` (đường-dẫn tuyệt-đối/tương-đối gốc repo) | dùng cho file đã biết đường-dẫn. |
| Liệt file theo mẫu | `Glob` (vd `vault/02-Tasks/<slug>/10-thuc-thi-*.md`) | dùng cho slot N (nhiều `10-thuc-thi-*`) + dò tồn-tại. |
| Tạo/ghi-đè file | `Write` | tạo file MỚI hoặc thay toàn-bộ. |
| Sửa tại-chỗ | `Edit` | vá 1 đoạn (vd append mục bộ-nhớ, đổi 1 trường) — KHÔNG đọc-lại để xác-minh thừa. |

- **CẤM `mcp__Obsidian__*`** và mọi MCP Obsidian: không tồn-tại trên web/mobile. Phát-hiện code/skill gọi MCP Obsidian → lỗi cấu-hình (test §8 T4).
- CWD = gốc repo; đường-dẫn tương-đối neo từ đó (persona/luật đọc từ `knowledge/` theo đường-dẫn tương-đối — CLAUDE.md).
- Tool nặng/MCP khác (browser, Google Drive cho KHO tài-sản tùy-chọn) **khám-phá bằng `ToolSearch` trước khi dùng** (CLAUDE.md vn-executor) — KHÔNG giả-định có sẵn.

### 4.2 Bền-vững: `git add/commit/push` sau mỗi mốc (ephemeral)

Môi-trường web là **ephemeral** → sau khi ghi vào `vault/` phải đẩy lên git để không mất dữ-liệu DN (CLAUDE.md "Lưu bền-vững").

```
function persist(paths[], message):
  # paths[] = mọi file vừa ghi/sửa trong mốc này
  git add <paths...>            # hoặc git add vault/ knowledge/ khi nhiều file
  git commit -m "<message>"     # 1 mốc = 1 commit ý-nghĩa
  git push                      # đẩy ngay; web ephemeral, không trì-hoãn
```

- **Mốc commit/push** ít nhất tại: (a) sau khi orchestrator sinh `06-structure.md` + `08-execution-plan.md` (cuối PHA 1); (b) sau mỗi mốc executor cập-nhật `10-run-state.md` (resume-safe); (c) sau khi PROMOTE ghi `_index.md` + thư-mục tài-sản KHO; (d) sau khi neo Brain (`telos/positioning/.../structure/decisions-log/lessons`).
- `10-run-state.md` là **nguồn-sự-thật để resume** → commit/push sau mỗi mốc của nó (đồng-bộ `LG-8-runstate` + CLAUDE.md vn-executor).
- KHO tài-sản **git-first**, Google Drive **tùy-chọn** (`LG-8-kho-asset`): file nhị-phân lớn có thể để Drive, nhưng `_index.md` + metadata luôn ở git.

### 4.3 Vòng đời IO của một artifact (chiều-sinh & khép-vòng)

```
sinh (PHA 0→1): orchestrator Read Brain (telos/positioning/curves/state+4cũ/structure)
             → Write 02-Tasks/<slug>/06-structure.md + 08-execution-plan.md
             → persist()                                    # mốc (a)
debate/exec (PHA 2): Write 10-thuc-thi-<action>.md (1/action)
             → executor Edit/Write 10-run-state.md mỗi bước → persist() mỗi mốc  # (b)
khép-vòng (PHA 3): Edit decisions-log.md (+altitude) · Write/Edit lessons.md
             → PROMOTE: Write knowledge/playbook/<ngành>/<...>/<asset> + Edit _index.md
             → Edit 00-Brain/* tầng leo (neo Brain) → persist()  # (c)(d)
```

## 5. Ranh-giới generic ↔ phân-rã

| Phần | Loại | Vì sao |
|---|---|---|
| **Bảng đường-dẫn + slot-số + quy-ước IO** (§3, §4) | **generic** (bảng/luật cố-định) | viết-một-lần; mọi DN dùng đúng bố-cục & cách truy-cập. |
| **Tool đọc/ghi (`Read`/`Write`/`Glob`/`Edit`) + luật git-persist** | **generic** | cố-định cho môi-trường web-vault. |
| **Mẫu `<slug>`/`<action>`/`<ngành>`/`<Kx>`/`<dept>`/`<bộ-phận>`** | **generic** (khuôn tên) | khuôn kebab-case cố-định; *giá-trị* điền là phân-rã. |
| **NỘI-DUNG bên trong mỗi file** (telos câu gì, cây bộ-phận nào, các `10-thuc-thi-*` cụ-thể, `<ngành>` là gì) | **phân-rã** | suy-ra mỗi DN/ngành; không hard-code. |

> Khớp `LG-1.1-1`: khung/đường-dẫn/luật-IO = GENERIC; nội-dung ô = PHÂN-RÃ.

## 6. Cổng & luật bất-biến

### 6.1 Ranh-giới file MỚI vs CŨ (bất-biến tương-thích)

- **MỚI (6 hạng-mục):** `telos.md`, `positioning.md`, `curves.md`, `structure.md` (đều ở `00-Brain/`); `lessons.md`; KHO `knowledge/playbook/<ngành>/_index.md` + thư-mục tài-sản. → tạo bằng `Write`; KHÔNG đụng file cũ.
- **CŨ (giữ tương-thích):** 5 file canonical (`strategy/products/budget/state/headcount`) + `decisions-log.md` + `calibration.md` + slot task `06/08/10*`. → đọc đúng ý-nghĩa hiện có.
- **CŨ+ (chỉ THÊM, không phá):** `state.md` thêm trường `stage` (phát-hiện động, **KHÔNG mặc-định GĐ1** — `LG-8-hientrang`); `decisions-log.md` thêm nhãn `altitude` per-mục (`LG-8-memory`).
- **Invariant:** không đổi tên / không bỏ trường file CŨ; bí-danh cũ `finance.md`/`market.md` vẫn KHÔNG dùng (đồng-bộ `02` §3.1). Khi chỉ có file CŨ, luồng vẫn chạy (lớp sinh-thành chưa thiết-lập = cảnh-báo, không chặn — `02` §4.2).

### 6.2 Luật bền-vững (CỨNG về dữ-liệu, không phải cổng HITL)

- Ghi `vault/` mà **không** `git add/commit/push` ⇒ vi-phạm bền-vững (web ephemeral mất dữ-liệu DN). Mọi mốc §4.2 phải kết bằng `persist()`.
- `git push` KHÔNG thuộc ranh-giới-cứng-HITL (không phải chi tiền/ký pháp-lý/công-bố ra ngoài/gửi email); đây là lưu nội-bộ repo, executor tự chạy. (Phân-biệt với cổng cứng NEED-APPROVAL `LG-3-PHA2-gate-cung` ở `03c`.)

## 7. Giao-diện & điểm-cắm code

Đồng-bộ §9 SoT (`LG-9-*`) — điểm cắm của *bố-cục/IO* (loại: GIỮ/THÊM):

| Hạng-mục | File/điểm cắm | Loại |
|---|---|---|
| Bảng đường-dẫn 12 artifact (bản-đồ chuẩn) | spec này + tham-chiếu trong `skills/vn-orchestrator/SKILL.md` & `skills/vn-executor/SKILL.md` (đường-dẫn ghi file) | THÊM (tài-liệu) |
| File Brain MỚI `00-Brain/{telos,positioning,curves,structure}.md` | `knowledge/brain-schema.md` (schema, `LG-9-brain`) + ghi tại orchestrator | THÊM |
| `lessons.md` + nhãn `altitude` decisions-log | `skills/vn-orchestrator/SKILL.md` Bước 11 (khép-vòng, `LG-9-khepvong`) | THÊM |
| Thư-mục KHO `knowledge/playbook/<ngành>/` (`_index.md` + tài-sản) | `knowledge/playbook/` (`LG-9-kho-index`) | THÊM thư-mục |
| Slot task `06/08/10*/10-run-state` | `skills/vn-orchestrator` (sinh 06/08), `skills/vn-executor` (sinh 10*/run-state) — GIỮ slot hiện có | GIỮ |
| Quy-ước `Read`/`Write`/`Glob`/`Edit` + git-persist | CLAUDE.md (đã có) + 2 SKILL.md tuân-thủ | GIỮ |

> KHÔNG tạo cơ-chế lưu-trữ song-song; toàn-bộ là **file trong repo** + git. KHÔNG MCP Obsidian (web không có).

## 8. Tiêu-chí chấp-nhận

Fixture đặt ở `specs/tools/` hoặc `test/fixtures/` (thống-nhất với `02`/`07`). Mỗi test trả pass/fail máy-đọc.

| # | Test | Kỳ-vọng |
|---|---|---|
| T1 | **Khớp đường-dẫn spec chủ:** mỗi đường-dẫn ở §3.1 đối-chiếu với đường-dẫn nêu trong spec chủ tương-ứng (`02`/`05`/`03*`) | trùng tuyệt-đối (không lệch tiền-tố `vault/`/`knowledge/`, không sai tên file). |
| T2 | **Đủ 12 artifact:** đếm hàng §3.1 | = 12, phủ đúng 12 claim `LG-8-*` (1-1). |
| T3 | **MỚI/CŨ đúng nguồn:** so cột MỚI/CŨ với §8 SoT (telos/positioning/curves/structure/lessons/_index/asset = MỚI; còn lại CŨ; state/decisions = CŨ+) | khớp từng hàng. |
| T4 | **Cấm MCP Obsidian:** grep code/skill tìm lời gọi `mcp__Obsidian` hoặc Obsidian MCP | = 0; nếu >0 → lỗi cấu-hình. |
| T5 | **Round-trip ghi→đọc:** `Write` 1 file mẫu vào đúng đường-dẫn §3.1 → `Read`/`Glob` lại | nội-dung khớp; `Glob` mẫu `10-thuc-thi-*.md` bắt được N file. |
| T6 | **Round-trip git-persist:** sau `Write`, chạy `persist()` (`git add/commit/push` — dry-run/local) | file vào staging + commit tạo; cây sạch sau commit (không file `vault/` lạc ngoài git). |
| T7 | **Slot task ổn-định:** trong `02-Tasks/<slug>/` có đúng 1× `06-structure.md`, 1× `08-execution-plan.md`, 1× `10-run-state.md`, N× `10-thuc-thi-*.md` | đúng số-lượng/slot (§3.2). |
| T8 | **state.stage không mặc-định GĐ1:** file `state.md` mới-tạo thiếu `stage` | KHÔNG tự điền GĐ1; phát cảnh-báo (đồng-bộ `02` T5 / `LG-8-hientrang`). |

**Lát Phở Hà liên-quan** (golden, chi-tiết ở `07-fixture-pho-ha.md`): kịch-bản Phở Hà sinh ra đúng các đường-dẫn `vault/02-Tasks/<slug>/{06-structure,08-execution-plan,10-thuc-thi-dam-phan-thit-bo,10-run-state}.md`; PROMOTE "Cẩm-nang mở-quán" + "Bảng định-mức" + "BI/Báo-cáo quán" ghi vào `knowledge/playbook/<ngành f&b>/<...>/` và chèn 3 dòng `_index.md` (`LG-7-PHA3`); đóng/dời quán-3 → `Edit positioning.md` + mục `decisions-log.md` nhãn `altitude: dinh-vi`. Spec này chỉ đảm-bảo **chỗ-ở/đường-dẫn** của các file đó; assertion end-to-end thuộc `07`.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** **M4** (gom-ngược + kho) là mốc chính (KHO `_index`/tài-sản + slot task đầy-đủ); phần file Brain MỚI nghiêng M1/M2 (đi cùng `02`). Theo `LG-9-uutien`: M1/M2 tối-thiểu trước, M4 (kho) sau.
- **Spec phải có trước:** `00-tong-quan-va-thuat-ngu.md` (thuật-ngữ); `02-brain-schema.md` (schema Brain — chủ của hàng 1-5, 10); `05-kho-chi-muc.md` (schema KHO — chủ của hàng 11-12); `03-luong-orchestration.md`/`03b`/`03c`/`03d` (ngữ-nghĩa slot task + bộ-nhớ — chủ của hàng 6-9, 10).
- **Spec dùng spec này:** `07-fixture-pho-ha.md` (golden khớp đường-dẫn) + `09-codebase-integration-map.md` (đấu-dây IO vào skills).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-8-telos | §3.1 (hàng 1) | T1, T2, T3 |
| LG-8-positioning | §3.1 (hàng 2) | T1, T2, T3 |
| LG-8-curves | §3.1 (hàng 3) | T1, T2, T3 |
| LG-8-hientrang | §3.1 (hàng 4), §6.1 (CŨ+ stage) | T3, T8 |
| LG-8-structure | §3.1 (hàng 5) | T1, T2, T3 |
| LG-8-plan-gd | §3.1 (hàng 6), §3.2 | T1, T5, T7 |
| LG-8-structure-task | §3.1 (hàng 7), §3.2 | T1, T7 |
| LG-8-plan-action | §3.1 (hàng 8), §3.2 | T5 (Glob N), T7 |
| LG-8-runstate | §3.1 (hàng 9), §3.2, §4.2 | T6, T7 |
| LG-8-memory | §3.1 (hàng 10), §6.1 (CŨ+ altitude) | T3 |
| LG-8-kho-index | §3.1 (hàng 11) | T1, T2, T3 |
| LG-8-kho-asset | §3.1 (hàng 12), §4.2 (git-first) | T1, T3, T6 |

## 11. OPEN-Q

1. KHO tài-sản "git-first, Drive tùy-chọn" (`LG-8-kho-asset`): khi nào dùng Drive thay git (ngưỡng dung-lượng file nhị-phân?) — đề-xuất: chỉ Drive cho asset > N MB, `_index.md` + metadata luôn git; cần CEO/kỹ-thuật chốt ngưỡng.
2. Tần-suất `git push`: push sau **mỗi** mốc §4.2 hay gom-batch cuối phiên? — đề-xuất: push mỗi mốc (`10-run-state` resume-safe); cần xác-nhận để khỏi nghẽn nếu mốc dày.
