---
type: brain
section: decisions-log
---
# Nhật ký quyết định (append-only)

> Chỉ ghi quyết-định CEO đã DUYỆT (`status: locked`). Orchestrator đọc mục `locked` TRƯỚC debate. Đảo quyết-định → thêm mục `superseded`, KHÔNG xóa lịch-sử. Nhãn `altitude ∈ {telos, dinh-vi, moat, cau-truc}`.

<!-- Mẫu mục:
## 2026-07-07 — <tiêu-đề quyết-định>
- status: locked
- altitude: <telos|dinh-vi|moat|cau-truc>
- nội-dung: <1-2 câu>
- căn-cứ: <task / số thật>
-->
