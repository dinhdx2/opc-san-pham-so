---
description: Thực thi tự động Execution Plan / SOP của một task vn-opc — tự chạy mọi bước máy làm được, chỉ dừng hỏi khi cần thông tin hoặc cần phê duyệt, được đáp ứng thì chạy tiếp tới khi xong
---
Kích hoạt skill **vn-executor** để THỰC THI (không chỉ lập kế hoạch) task sau trong vault repo.

Nếu có slug/mô tả thì dùng; nếu trống, tự chọn task mới/đang dở gần nhất có `08-execution-plan.md`:

$ARGUMENTS

Yêu cầu: tự chạy hết các bước AI-AUTO bằng tool/MCP thật, gom các cổng NEED-INFO/NEED-APPROVAL hỏi CEO 1 lượt, được đáp ứng thì tự chạy tiếp; cập nhật `10-run-state.md` và commit/push sau mỗi mốc.
