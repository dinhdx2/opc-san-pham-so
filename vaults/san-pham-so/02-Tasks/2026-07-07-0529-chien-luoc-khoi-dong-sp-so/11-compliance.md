# Nhật ký giám-sát tuân thủ (compliance) — append-only

## 2026-07-07 — Cổng sau lượt AI-AUTO PHA 0 (9 bước DONE)
- **Engine:** `npm run compliance 10-run-state.md` → **✅ PASS 27 bước · 0 vi-phạm.**
- **Xử-lý 2 DENY F1 ban đầu (sửa đúng bản-chất, KHÔNG dán nhãn cho qua):**
  - `0-03` dính chữ "đo lường" → engine xếp TOOL_EXEC nhưng deliverable là spec/SOP (doc quy-trình ở 02-Tasks) → đổi mô-tả sang "spec tiêu-chí + ngưỡng" (đúng loại SOP_SUPPORT).
  - `0-06a` dính "search" → TOOL_EXEC; nó thật-sự tra web + có nguồn gov → thêm URL nguồn NĐ 141/2026 vào bằng-chứng (CITATION real).
- **E1 (DONE ⇒ bằng-chứng resolve):** 9 bước DONE đều có file thật (5 compliance MẪU + protocol spec + KPI CSV + hạ-tầng + thuế) — đã `ls` xác nhận tồn-tại.
- **Đặt đúng chỗ (F3):** deliverable dùng-được (KPI CSV) → `03-Outputs/`; spec/SOP/checklist/research (compliance MẪU, protocol, hạ-tầng, thuế) → `02-Tasks/`. Không vi-phạm.
- **Chưa chạy `kiem-soat-vien`:** task CHƯA hoàn-thành (mới xong AI-AUTO PHA 0, còn cổng CEO + ĐỢT-1/2). Sẽ chạy agent kiểm-soát-viên TRƯỚC khi khai task DONE.

## 2026-07-07 — Cổng sau lượt AI-AUTO ĐỢT-1 (9 deliverable mới)
- **Engine:** `npm run compliance` → **✅ PASS 32 bước · 0 vi-phạm.**
- **E1:** 18 bước DONE đều có file thật (lead-magnet 29KB/20 prompt · landing+5 email · presell có khối cam-kết giao/hoàn · 10 kịch-bản video · playbook outreach · spec hero · guide phỏng-vấn · kế-hoạch ads). Spot-check nội-dung: không rỗng.
- **Ranh-giới cứng GIỮ:** mọi deliverable là DRAFT — KHÔNG publish, KHÔNG thu tiền, KHÔNG gửi email/ads thật. Cổng tiền/công-bố (1-04b, 1-06, 2-x) vẫn NEED-APPROVAL; luật cần luật-sư rà (0-04f).
- **Luật QC/BVNTD áp trong copy:** không claim "giàu nhanh", claim định-lượng có điều-kiện, presell công-bố giao/hoàn trước thu tiền.
- **kiem-soat-vien:** chưa chạy (task CHƯA hoàn-thành — mới xong AI-AUTO ĐỢT-1, còn validate người làm + GO + ĐỢT-2). Sẽ chạy trước khi khai task/pha DONE.
