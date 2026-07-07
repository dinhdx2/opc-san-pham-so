---
description: In trạng thái vault vn-opc (vault active + Brain + task gần đây) — bản web/mobile
---
Resolve vault đang dùng qua `lib/vault.js#resolveActiveVault` (đọc con-trỏ `.vn-active-vault` ở gốc repo, fallback `vault/`) → gọi `<VAULT>`. **Liệt kê MỌI vault** (`lib/vault.js#listVaults`: `vault/` legacy + `vaults/*`), đánh dấu vault đang active. Sau đó đọc `<VAULT>/00-Brain/*.md` bằng Read + Glob `<VAULT>/02-Tasks/`. Tóm tắt: vision/chiến lược, ICP, state hiện tại (kèm trường **`stage`**), ngân sách, nhân sự, **quyết định đã chốt gần nhất (`decisions-log.md`)**, số task gần đây. Nếu chưa có vault nào / `<VAULT>/00-Brain/` trống → báo CEO chạy `/vn-onboard "<ý-tưởng>"` để tạo vault. Tiếng Việt, ngắn gọn, có TL;DR.
