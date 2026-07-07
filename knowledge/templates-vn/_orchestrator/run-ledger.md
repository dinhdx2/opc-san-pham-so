# SỔ THỰC THI (Run Ledger) — `10-run-state.md`

> Nguồn sự thật để **thực thi & resume** một task vn-opc. Do skill `vn-executor` sinh & cập nhật.
> Mỗi dòng = **một bước nguyên tử** (một hành động kiểm chứng được). Cập nhật ngay sau mỗi thay đổi trạng thái.

## TL;DR tiến độ
- Task: `<slug>` · Cập nhật: `<YYYY-MM-DD hh:mm>`
- Hoàn thành: **<x>/<n>** bước (`<%>`). Đang chặn: <số NEED-INFO> chờ thông tin · <số NEED-APPROVAL> chờ duyệt · <số HUMAN> CEO tự làm.

## Chú giải
- **owner:** `AI` (máy làm trọn) · `AI+Human` (máy chuẩn bị, người xác nhận/duyệt) · `Human` (chỉ người làm được).
- **cổng:** `none` · `NEED-INFO` (thiếu dữ liệu/bí mật) · `NEED-APPROVAL` (ra tiền/pháp lý/công bố/không hoàn tác → CEO duyệt mới chạy).
- **trạng thái:** `TODO` · `DOING` · `BLOCKED-INFO` · `BLOCKED-APPROVE` · `HUMAN` (đã giao CEO) · `DONE` · `FAILED`.

## Bảng bước

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|----|-----------|-------|------|-------------|------|-----------|------------|------------|
| W1-01 | <mô tả hành động cụ thể> | AI | web/drive/file/— | <điều kiện tiên quyết> | none | — | TODO | <link/file khi DONE> |

## Nhật ký gỡ cổng (HITL)
> Mỗi lần CEO cấp thông tin / phê duyệt → ghi 1 dòng (cũng append vào `03-clarification.md`).

| thời điểm | bước liên quan | CEO cung cấp / quyết định |
|---|---|---|
| <hh:mm> | <id> | <giá trị / "Duyệt" / "Từ chối — lý do"> |
