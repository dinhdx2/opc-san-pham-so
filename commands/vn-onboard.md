---
description: Onboard ý-tưởng/DN — tạo vault mới riêng theo ngành (kích hoạt pack hoặc sinh phòng ban mới có CEO duyệt) — bản web/mobile
---
Kích hoạt skill **vn-onboarder** với mô tả ý-tưởng/DN + ngành sau. **Mỗi ý-tưởng = một vault MỚI độc-lập** dưới `vaults/<slug>/`: AI đề-xuất slug ngắn từ ý-tưởng (`lib/vault.js#slugify`/`uniqueSlug`), CEO duyệt tên, tạo khung từ `vaults/_TEMPLATE/`, ghi con-trỏ `.vn-active-vault`. Cấu hình ghi `<VAULT>/.vncoderc`; Brain seed theo `vaults/_TEMPLATE/00-Brain/_SEED.md`. CEO muốn làm tiếp trên DN cũ → bỏ qua tạo mới, dùng vault đang active. Đọc/ghi bằng file (KHÔNG MCP Obsidian). Sau khi onboard xong, commit vào git.

Mô tả ý-tưởng/DN + ngành:

$ARGUMENTS
