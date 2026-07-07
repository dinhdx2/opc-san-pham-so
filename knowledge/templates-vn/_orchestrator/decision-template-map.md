# Decision → Template Map

> Biến 183 template thành tài sản truy xuất được. Khi Bước 8 cần xuất tài liệu, tra bảng này:
> **loại quyết định/đầu ra → phòng → template gợi ý** (đường dẫn dưới `knowledge/templates-vn/<phòng>/`).
> Thứ tự ưu tiên (BYOT 3 tầng): `vault/00-Templates-Custom/<phòng>/...` > `knowledge/templates-vn/<phòng>/...` > mặc định.
> Điền template tự động từ `views` / `report` của task (số liệu, phòng phụ trách, KPI). Số chưa có → để `[cần CEO xác minh]`.

## Bảng tra theo intent

| Đầu ra CEO cần | Phòng | Template gợi ý (`knowledge/templates-vn/<phòng>/...`) |
|---|---|---|
| Hợp đồng lao động / nội quy / NDA | 01-governance | `hop-dong-lao-dong-mau.md`, `noi-quy-lao-dong` (04-people), `nda-mau.md` |
| Điều lệ / quy chế HĐQT / cổ đông | 01-governance | `dieu-le-cong-ty.md`, `quy-che-hdqt.md`, `thoa-thuan-co-dong.md` |
| Checklist tuân thủ / giấy phép | 01-governance | `checklist-tuan-thu-phap-ly.md`, `danh-sach-giay-phep-con.md`, `checklist-dkkd.md` |
| Kế hoạch chiến lược / OKR / phân tích cạnh tranh | 02-strategy | `02-strategy/` (kế hoạch năm, SWOT, OKR) |
| Ngân sách / P&L / dòng tiền / định giá | 03-finance | `ngan-sach-nam.md`, `bao-cao-pl.md`, `cashflow-forecast-12-thang.md`, `phan-tich-hoa-von.md` |
| Chính sách tài chính / giá / công nợ | 03-finance | `chinh-sach-tai-chinh.md`, `chinh-sach-dinh-gia.md`, `chinh-sach-quan-ly-cong-no.md` |
| Tuyển dụng / JD / onboarding / lương thưởng | 04-people | `sop-tuyen-dung.md`, `jd-vi-tri-chu-chot.md`, `checklist-onboarding-30-60-90.md`, `quy-che-luong-thuong.md` |
| SOP vận hành / kho / nhà cung cấp | 05-operations | `sop-cot-loi.md`, `sop-quan-ly-kho.md`, `sop-danh-gia-nha-cung-cap.md`, `scorecard-ncc.md` |
| Quy trình bán hàng / CRM / pipeline / báo giá | 06-sales | `quy-trinh-ban-hang.md`, `thiet-lap-crm.md`, `theo-doi-pipeline.md`, `mau-de-xuat-bao-gia.md` |
| Kế hoạch marketing / nội dung / ads / SEO | 07-marketing | `ke-hoach-marketing-nam.md`, `lich-noi-dung.md`, `quy-trinh-chay-ads.md`, `quy-trinh-seo.md` |
| CSKH / khiếu nại / NPS / loyalty | 08-customer | `sop-xu-ly-khieu-nai.md`, `frm-khao-sat-nps-csat.md`, `man-loyalty-retention.md` |
| Sản phẩm / tech / automation | 09-product-tech | `09-product-tech/` |
| Đào tạo / mentoring / ROI đào tạo | 10-training | `ke-hoach-dao-tao-hang-nam.md`, `chuong-trinh-dao-tao-hoi-nhap.md`, `bao-cao-roi-dao-tao.md` |
| Dashboard / KPI / báo cáo quản trị | 11-reporting | `man-tu-dien-kpi.md`, `man-thiet-ke-dashboard.md`, `frm-bao-cao-quan-tri-hang-thang.md` |
| Gọi vốn / cap table / term sheet / nhượng quyền | 12-growth | `pitch-deck.md`, `cap-table.md`, `term-sheet-template.md`, `thiet-ke-mo-hinh-nhuong-quyen.md` |

## Quy tắc chọn
1. Xác định **phòng chịu trách nhiệm** đầu ra (từ `report` mục Khuyến nghị) + **loại tài liệu** (proposal / report / plan / policy / contract / SOP).
2. Tra bảng → lấy template ở tầng cao nhất có sẵn (Custom > templates-vn > mặc định).
3. Nếu không có template khớp → dùng template gần nhất cùng phòng + ghi chú "đã chỉnh từ mẫu X".
4. Mọi tài liệu pháp lý/kế toán: gắn dòng cảnh báo "MẪU — cần luật sư/kế toán rà trước khi dùng chính thức".
