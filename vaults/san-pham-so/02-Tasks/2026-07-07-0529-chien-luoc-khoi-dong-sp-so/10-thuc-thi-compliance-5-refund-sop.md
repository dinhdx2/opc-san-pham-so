⚠️ MẪU — cần luật-sư rà trước khi áp-dụng.

# SOP Hoàn-tiền & mốc giao-hàng — Sản phẩm số [tên DN]

> **TL;DR:** SOP quy-định [tên DN] phải **công-bố công-khai** (TRƯỚC khi thu tiền) thời-hạn giao Sản-phẩm số + điều-kiện hoàn/trả, rồi mới được bán — theo Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 (Điều 37-39, giao-dịch từ xa/trên không-gian mạng) và Nghị-định 52/2013/NĐ-CP (sửa-đổi bởi Nghị-định 85/2021/NĐ-CP) về thương-mại điện-tử. Vì SP là **hàng-hoá số** (đã tải/truy-cập là dùng được ngay), chính-sách hoàn-tiền phải nêu RÕ cách xử-lý khác với hàng vật-lý — không thể "trả hàng" theo nghĩa vật-lý.

**Căn cứ pháp-lý:** Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 (hiệu-lực 01/7/2024) — Điều 37 (trách-nhiệm bên bán trong giao-dịch từ xa: cung-cấp đầy-đủ, chính-xác thông-tin hợp-đồng cho người tiêu-dùng NGHIÊN-CỨU TRƯỚC khi giao-kết), Điều 38 (giao-kết hợp-đồng từ xa — công-cụ xác-nhận, cho khách xem/tải hợp-đồng đã xác-nhận), Điều 39 (trách-nhiệm với người tiêu-dùng trong giao-dịch trên không-gian mạng); Nghị-định 52/2013/NĐ-CP về thương-mại điện-tử, sửa-đổi bổ-sung bởi Nghị-định 85/2021/NĐ-CP (25/9/2021) — quy-định công-bố thông-tin hàng-hoá/dịch-vụ, chính-sách kiểm-hàng/đổi-trả/hoàn-tiền trên website TMĐT.

---

## 1. Nguyên-tắc bắt-buộc: công-bố TRƯỚC khi thu tiền

Trước khi khách bấm "Thanh-toán", trang landing/checkout của [domain] **PHẢI hiển-thị rõ, dễ thấy** (không giấu trong link nhỏ cuối trang):
1. **Sản-phẩm là gì, giao dưới hình-thức nào** (vd: link tải PDF + link truy-cập Notion + video hosted ở [nền-tảng]).
2. **Mốc thời-gian giao hàng cụ-thể:**
   - Nếu sản-phẩm đã hoàn-thiện: "Nhận link truy-cập **ngay sau khi thanh-toán thành-công** (tự-động qua email trong vòng [X phút — điền số thật, vd 5-15 phút])".
   - Nếu là **presell/pre-order** (sản-phẩm CHƯA sản-xuất xong tại thời-điểm bán): phải ghi rõ **ngày dự-kiến giao** (vd "dự-kiến giao trước [ngày/tháng/năm]"), và nêu rõ đây là **đặt-trước**, không phải giao ngay. Đây là điều-kiện **bắt-buộc** trước khi mở presell thu tiền thật (xem cổng NEED-APPROVAL D1-04b trong `10-run-state.md`).
3. **Điều-kiện hoàn-tiền** (xem Mục 2) và **cách yêu-cầu hoàn-tiền** (liên-hệ đâu, trong bao lâu).
4. Link tới EULA (`10-thuc-thi-compliance-1-eula.md`) để khách biết phạm-vi giấy phép trước khi mua.

> Vi-phạm nguyên-tắc "công-bố trước" là rủi-ro pháp-lý CAO nhất với mô-hình presell — khách có quyền khiếu-nại/yêu-cầu hoàn-tiền nếu không được thông-báo rõ trước khi giao-kết (Điều 37-38 Luật 19/2023/QH15).

## 2. Chính-sách hoàn-tiền (mẫu — điền số ngày/điều-kiện cụ-thể của [tên DN])

### 2.1 Với sản-phẩm ĐÃ giao (link tải/truy-cập đã gửi)
Vì bản-chất hàng-hoá số **khác hàng vật-lý** — một khi đã tải file hoặc truy-cập nội-dung, "trả lại" theo nghĩa vật-lý là không thể (khách đã nhận được giá-trị). Do đó áp chính-sách theo 1 trong 2 hướng — **CEO chọn 1 hướng và công-bố nhất-quán** [cần xác minh/CEO quyết]:

- **Hướng A — Hoàn trong X ngày nếu CHƯA/ít truy-cập:** hoàn 100% trong vòng [7 — gợi-ý phổ-biến ngành, cần CEO xác-minh chọn số] ngày kể từ ngày mua, **nếu khách chứng-minh chưa tải file / chưa hoàn-thành quá [Y%] nội-dung** (kiểm bằng log truy-cập nếu SP giao qua LMS/Notion có tracking). Nếu SP giao qua file tải trực-tiếp (không track được), có thể giảm điều-kiện xuống "chưa yêu-cầu link tải lần 2" hoặc dựa thời-gian mua gần nhất.
- **Hướng B — Không hoàn-tiền sau khi đã nhận link, đổi bằng cam-kết chất-lượng khác:** thay hoàn-tiền bằng "dùng-thử xem trước" (preview/demo miễn-phí trước khi mua) để giảm nhu-cầu hoàn-tiền, kết-hợp hỗ-trợ 1-1 nếu khách không hài-lòng.

> [tên DN] cần chọn 1 hướng phù-hợp mô-hình bán (ebook/template dễ hoàn hơn khoá video dài) và **công-bố y-hệt** trên landing — không hứa 1 đằng, xử-lý 1 nẻo.

### 2.2 Với đơn-hàng presell (SP chưa giao)
- Hoàn 100% nếu khách yêu-cầu **trước ngày giao dự-kiến** đã công-bố (Mục 1.2).
- Nếu [tên DN] **trễ tiến-độ giao** so với ngày đã công-bố quá [X ngày — CEO đặt ngưỡng], khách có quyền yêu-cầu hoàn 100% không cần điều-kiện gì thêm — đây là nghĩa-vụ tối-thiểu để bảo-vệ khách khi mua presell.

### 2.3 Trường-hợp KHÔNG hoàn-tiền (loại-trừ)
- Khách đã hoàn-thành/tải toàn-bộ nội-dung và yêu-cầu hoàn quá thời-hạn công-bố tại Mục 2.1.
- Khách vi-phạm EULA (re-sell/chia-sẻ trái-phép) trước khi yêu-cầu hoàn.
- Lỗi phát-sinh từ phía khách (nhập sai email, không kiểm-tra thư mục spam) — [tên DN] hỗ-trợ gửi lại link, không tính là lỗi giao hàng.

## 3. Quy-trình xử-lý yêu-cầu hoàn-tiền (SOP nội-bộ)

| Bước | Việc làm | Owner | Thời-hạn |
|---|---|---|---|
| 1 | Khách gửi yêu-cầu qua [email hỗ-trợ]/[form] kèm mã đơn-hàng | Khách | — |
| 2 | Xác-nhận đã nhận yêu-cầu (auto-reply hoặc thủ-công) | [tên DN] | trong [24-48h — gợi-ý, CEO chỉnh] |
| 3 | Đối-chiếu điều-kiện Mục 2.1/2.2 (kiểm log truy-cập/ngày mua) | [tên DN] | trong [2-3 ngày làm-việc] |
| 4 | Ra quyết-định: đồng-ý hoàn / từ-chối (nêu lý-do dựa Mục 2.3) / đề-xuất giải-pháp thay-thế | [tên DN] | — |
| 5 | **Thực-hiện hoàn tiền qua đúng kênh khách đã thanh-toán** (VNPay/MoMo/ZaloPay/thẻ) | [tên DN] — **hành-động chi/hoàn tiền LUÔN cần CEO/người có thẩm-quyền tài-chính xác-nhận trước khi bấm hoàn** | trong [5-10 ngày làm-việc — theo thời-gian xử-lý thực-tế của cổng thanh-toán, cần xác minh với từng cổng] |
| 6 | Ghi log vào `refund-log.csv` (mã đơn, ngày yêu-cầu, lý-do, kết-quả, ngày hoàn) | [tên DN] | ngay sau bước 5 |
| 7 | Nếu từ-chối, khách có quyền khiếu-nại tiếp theo Luật BVQLNTD 19/2023/QH15 — cung-cấp thông-tin liên-hệ cơ-quan bảo-vệ người tiêu-dùng địa-phương nếu khách yêu-cầu | [tên DN] | — |

> **Ranh-giới cứng:** bước 5 (hoàn tiền = chi tiền thật) KHÔNG được tự-động-hoá bởi AI — luôn là hành-động NEED-APPROVAL, người có thẩm-quyền (CEO/kế-toán) xác-nhận và tự tay thực-hiện trên cổng thanh-toán/ngân-hàng.

## 4. Nội-dung bắt-buộc công-bố công-khai trên [domain]
- [ ] Trang riêng "Chính-sách đổi-trả & hoàn-tiền" (`[domain]/chinh-sach-hoan-tien`), link ở footer + tại nút mua-hàng.
- [ ] Mốc giao-hàng cụ-thể hiển-thị **ngay tại trang bán** của từng sản-phẩm (không chỉ ở trang chính-sách chung).
- [ ] Với presell: banner/nhãn rõ-ràng "ĐẶT-TRƯỚC — dự-kiến giao [ngày]" tại trang sản-phẩm và tại email xác-nhận đơn-hàng.
- [ ] Kênh liên-hệ hỗ-trợ hoàn-tiền: [email] (phản-hồi trong giờ hành-chính [giờ làm-việc]).

## 5. Checklist trước khi MỞ BÁN (gắn với cổng D1-04b trong `10-run-state.md`)
- [ ] Đã chọn xong Hướng A hay B (Mục 2.1) và viết rõ trên trang chính-sách.
- [ ] Đã set ngưỡng ngày cụ-thể (không để "[X ngày]" trống khi go-live).
- [ ] Nếu bán presell: đã có ngày giao dự-kiến THẬT (không phải placeholder) và có kế-hoạch dự-phòng nếu trễ tiến-độ.
- [ ] Trang landing đã hiển-thị đủ 4 mục ở Mục 1 TRƯỚC nút thanh-toán.
- [ ] `refund-log.csv` đã tạo sẵn (rỗng) để bắt đầu ghi từ giao-dịch đầu-tiên.

---
### Ghi-chú triển-khai (không phải nội-dung công-bố)
- [ ] Luật-sư rà lại Mục 2 (đặc-biệt điều-kiện loại-trừ) để tránh bị coi là "thoả-thuận hạn-chế quyền tối-thiểu" của người tiêu-dùng theo Luật 19/2023/QH15.
- [ ] Đối-chiếu thời-gian xử-lý hoàn tiền thực-tế của từng cổng thanh-toán VN (VNPay/MoMo/ZaloPay) trước khi công-bố số ngày cụ-thể ở Bước 5 Mục 3 — số hiện tại là gợi-ý, [cần xác minh với cổng thanh-toán thật].
