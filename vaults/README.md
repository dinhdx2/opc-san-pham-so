# vaults/ — Multi-vault: mỗi ý-tưởng/DN một khoang riêng

> **Mỗi ý-tưởng mới = một vault DN độc-lập** dưới `vaults/<slug>/`, có Brain/Tasks/Outputs riêng.
> Logic đặt-tên + giải-quyết-vault: `lib/vault.js` (kiểm bằng `test/vault.test.js`).

## Cấu-trúc một vault
```
vaults/<slug>/
├── 00-Brain/              # 5 canonical (strategy/products/state/budget/headcount) + 2 bộ-nhớ
│                          # + lớp sinh-thành (telos/positioning/curves/structure/lessons) — xem knowledge/brain-schema.md
├── 00-Templates-Custom/   # template riêng DN (BYOT, ưu-tiên cao nhất)
├── 01-Departments/        # bộ hồ sơ phòng ban RIÊNG của DN (12 nền + phòng pack/mới) — sinh & tinh chỉnh
│                          # theo ngữ-cảnh DN lúc /vn-onboard (Bước 6c); debate/router CHỈ đọc từ đây
├── 02-Tasks/              # mỗi task 1 thư-mục <YYYY-MM-DD-hhmm-slug>/
└── 03-Outputs/            # .md/.csv (hoặc .docx/.xlsx nếu có office-docs)
```

> **Chỉ-đọc-vault (persona):** `knowledge/departments/` + `knowledge/packs/*/departments/` là KHUÔN SINH —
> chỉ dùng làm nguồn sao khi onboard. Debate KHÔNG fallback về khuôn sinh; vault thiếu `01-Departments/`
> → agent phòng trả `persona_missing: true`, cần chạy `/vn-onboard` (Bước 6c) để backfill.

## Con-trỏ vault đang dùng
- File **`.vn-active-vault`** ở gốc repo = đường-dẫn vault hiện-hành (1 dòng, vd `vaults/cafe-pet-q7`).
- Mọi skill resolve vault qua `lib/vault.js#resolveActiveVault`: đọc con-trỏ → nếu trống/chết thì **fallback `vault/`** (tương-thích ngược DN cũ).

## Tạo vault mới
Gõ **`/vn-onboard "<mô-tả ý-tưởng + ngành>"`** → AI đề-xuất slug ngắn (CEO duyệt) → tạo `vaults/<slug>/` từ `_TEMPLATE/` → seed Brain → ghi `.vn-active-vault` → (tuỳ chọn) kích-hoạt pack ngành.

> `_TEMPLATE/` = khung rỗng; KHÔNG phải vault thật (bị `listVaults` bỏ qua).
