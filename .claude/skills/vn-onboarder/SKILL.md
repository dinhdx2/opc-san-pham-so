---
name: vn-onboarder
description: Onboard DN vào vn-opc theo ngành — kích hoạt pack có sẵn hoặc sinh pack/agent/template mới (CEO duyệt). Dùng khi CEO gõ /vn-onboard hoặc thiết lập DN mới. Bản web/mobile — vault bằng file trong repo.
---

# Skill: vn-onboarder (bản web/mobile)

Thiết lập hệ thống vn-opc cho một DN mới theo ngành. **Mỗi ý-tưởng/DN = một vault độc-lập** dưới `vaults/<slug>/` (multi-vault). Đọc/ghi bằng file (KHÔNG MCP Obsidian). Mọi output tiếng Việt, rõ ràng cho CEO.

## Bước 0 — Tạo vault mới cho ý-tưởng (multi-vault)

> Hiện-thực qua `lib/vault.js`. `<VAULT>` = đường-dẫn vault dùng cho mọi bước sau.

1. **Đề-xuất slug ngắn** từ mô-tả ý-tưởng: `lib/vault.js#slugify` (bỏ dấu tiếng Việt → kebab ascii, ≤4 từ, bỏ stop-word). Vd "Quán cà-phê thú-cưng ở Q7" → `ca-phe-thu-cung`. Dùng `uniqueSlug` để tránh trùng (thêm `-2`…).
2. **CEO duyệt tên** bằng `AskUserQuestion` (Dùng slug đề-xuất / Sửa tên / Dùng `vault/` cũ). KHÔNG tự tạo khi chưa duyệt.
3. **Tạo khung vault**: sao `vaults/_TEMPLATE/` → `vaults/<slug>/` (các thư-mục `00-Brain` `00-Templates-Custom` `01-Departments` `02-Tasks` `03-Outputs`).
4. **Ghi con-trỏ active**: `.vn-active-vault` ở gốc repo = `vaults/<slug>` (`lib/vault.js#setActiveVault`). Đặt `<VAULT> = vaults/<slug>`.
5. CEO muốn làm tiếp trên DN cũ thay vì tạo mới → bỏ qua Bước 0, đặt `<VAULT>` = `resolveActiveVault()` (mặc-định `vault/`).

## Bước 1 — Nhận đầu vào
Thu thập từ tham số `/vn-onboard`: **mô tả DN/ý-tưởng** (tên, lĩnh vực, quy mô), **ngành** (từ khóa rõ).
Thiếu mô tả/ngành → `AskUserQuestion` hỏi CEO trước khi tiếp.

## Bước 2 — Detect & match pack có sẵn
Đọc `knowledge/packs/*/pack.yaml`, so `target_industries` với ngành DN.
- **KHỚP** → ghi `pack_code`, sang **Bước 6**.
- **KHÔNG KHỚP** → sang **Bước 3**.

## Bước 3 — Đề xuất cấu trúc phòng (ngành lạ)
Gọi agent `pack-architect` **Chế Độ A** với mô tả DN + ngành. Nhận JSON `{base_departments_applicable, new_departments, notes}`.

## Bước 4 — PAUSE: CEO duyệt danh sách phòng
`AskUserQuestion` trình: phòng nền áp dụng + phòng mới đề xuất (mã | tên | lý do | luật) + notes.
Phương án: **Duyệt toàn bộ** / **Sửa danh sách** / **Chỉ dùng 12 nền**. Chờ CEO xác nhận, không tự ý tiến hành.

## Bước 5 — Sinh tài liệu (ngành lạ, sau khi CEO duyệt)
Gọi `pack-architect` **Chế Độ B** với danh sách phòng đã duyệt + code ngành. Ghi file bằng `Write`:

| Loại | Đường dẫn |
|------|-----------|
| Agent phòng mới (agentType, cấp repo) | `.claude/agents/<dept-code>-<slug>.md` + bản sync `agents/<dept-code>-<slug>.md` |
| Hồ sơ phòng mới — KHUÔN SINH | `knowledge/packs/<code-ngành>/departments/<dept-code>/{department.yaml, agents/*.md}` |
| Pack YAML | `knowledge/packs/<code-ngành>/pack.yaml` |
| Template | `knowledge/packs/<code-ngành>/templates/<dept>/<tên>.md` |

> Agent phòng mới viết theo mẫu chỉ-đọc-vault (persona đọc từ `<VAULT>/01-Departments/<dept-code>/`, có nhánh `persona_missing` — xem `agents/dept-13-content-ip.md`). Bản per-vault của hồ sơ phòng sẽ sinh ở **Bước 6c**.

Ghi nhận `pack_code` → Bước 6.

## Bước 6 — Kích hoạt cấu hình DN
Ghi/cập nhật `<VAULT>/.vncoderc` (YAML) bằng `Write`/`Edit`:

```yaml
company_name: "<tên DN>"
industry: "<ngành>"
onboarded_at: "<YYYY-MM-DD>"
active_packs:
  - <pack_code>            # bỏ trống nếu chỉ dùng 12 nền
active_departments:
  - dept-01-governance
  - dept-02-strategy
  - dept-03-finance
  - dept-04-people
  - dept-05-operations
  - dept-06-sales
  - dept-07-marketing
  - dept-08-customer
  - dept-09-product-tech
  - dept-10-training
  - dept-11-reporting
  - dept-12-growth
  # - dept-13-<slug>       # phòng pack ngành (nếu có)
```
`.vncoderc` đã tồn tại → đọc trước, merge `active_departments`/`active_packs`, không xóa cấu hình cũ.

## Bước 6b — Khởi tạo Brain (nếu trống)
Nếu `<VAULT>/00-Brain/` còn trống, tạo 5 file canonical `strategy.md / products.md / state.md / budget.md / headcount.md` (với `state.md` có trường `stage`, phát-hiện động — KHÔNG mặc-định GĐ1) + lớp sinh-thành `telos.md` (`approved_by: "[chờ CEO duyệt]"`) / `positioning.md` / `curves.md` / `structure.md` / `lessons.md` theo `vaults/_TEMPLATE/00-Brain/_SEED.md` + `knowledge/brain-schema.md`. Xoá `_SEED.md` sau khi seed xong. Hỏi bổ sung phần thiếu bằng `AskUserQuestion`.

## Bước 6c — Sinh & tinh chỉnh 01-Departments (bộ hồ sơ phòng ban RIÊNG của DN)

> **Chỉ-đọc-vault:** từ sau bước này, mọi debate/router đọc persona phòng ban từ `<VAULT>/01-Departments/` — KHÔNG fallback về khuôn sinh. Vault chưa có thư mục này = chưa onboard xong.

1. **Nguồn khuôn sinh** — theo `active_departments` trong `.vncoderc`:
   - 12 phòng nền: `knowledge/departments/<XX-tên>/` (department.yaml + agents/*.md).
   - Phòng pack: `knowledge/packs/<pack>/departments/<dept-code>/`.
   - Phòng mới ngành lạ: output pack-architect vừa ghi ở Bước 5.
2. **Sao cấu trúc** sang `<VAULT>/01-Departments/<XX-tên>/` (giữ nguyên tên file, cây `department.yaml` + `agents/*.md`).
3. **Tinh chỉnh TOÀN BỘ nội dung theo ngữ cảnh DN** (đọc `.vncoderc` + Brain vừa seed ở 6b: industry, ICP, stage, telos):
   - Persona `agents/*.md`: viết lại Vai trò / Chuyên môn / deliverables / ví dụ cho đúng ngành & mô hình DN (vd Finance của DN sản-phẩm-số nói phí payment gateway, unit economics khóa học — không nói P&L chung chung).
   - `department.yaml`: `routing_rules[].keywords` + `aliases_vn` **bổ sung** từ khóa/tên gọi theo ngành (giữ keyword gốc).
   - **GIỮ NGUYÊN KHÓA** (taxonomy/router/KHO phụ thuộc): `code`, `capability_name`, `maps_to`, `agents[]` (id), `default_speaker`, khung frontmatter persona (`id`, `department`…).
   - **Grounding:** persona KHÔNG chứa số bịa của DN — số ngành gắn `[benchmark ngành — cần CEO xác minh]`; số DN chỉ trích Brain.
4. **Việc nặng → fan-out Agent tool** (nhiều agent song song, mỗi agent 3–4 phòng, giao rõ danh sách file nguồn→đích + khối ngữ cảnh DN). Xong **kiểm đủ**: số thư mục phòng = số `active_departments`, mỗi phòng đủ file như khuôn, khóa YAML không đổi.
5. Onboard lại DN cũ (vault đã có `01-Departments/`) → chỉ sinh phòng còn thiếu + hỏi CEO trước khi ghi đè phòng đã tinh chỉnh.

## Bước 7 — Báo cáo + lưu
Trình CEO: pack kích hoạt, phòng active (mã + tên VN), bộ hồ sơ `01-Departments/` đã sinh (số phòng + số file), file đã tạo, bước tiếp theo (`/vn-run <brief>`).
Commit: `git add -A && git commit -m "vn-opc onboard: <tên DN>" && git push`.

## Ràng buộc
- KHÔNG sửa KHUÔN SINH 12 phòng nền trong `knowledge/departments/` (01–12) — tinh chỉnh CHỈ diễn ra trong `<VAULT>/01-Departments/`. Mã phòng mới ≥ 13, không trùng.
- Mọi tài liệu là MẪU — không phải tư vấn pháp lý chính thức.
- Không tiến hành Bước 5 khi chưa có duyệt ở Bước 4.
