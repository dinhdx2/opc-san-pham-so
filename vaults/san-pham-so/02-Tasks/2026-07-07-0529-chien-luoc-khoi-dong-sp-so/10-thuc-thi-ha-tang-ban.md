# P0-05a — Kế-hoạch hạ-tầng bán SP số self-host (vốn nhỏ, bootstrapping)

> **TL;DR:** Khuyến-nghị Đợt-1: **WordPress + Easy Digital Downloads (tự-host)** làm nền chính để giữ **owned-audience** (moat thật của DN, theo Brain), + **SePay/Casso (VietQR tự-động)** làm cổng thanh-toán chính vì phí ~0% (rẻ hơn hẳn cổng thẻ 1-2,75%), + **email free-tier + Zalo OA gói Cơ-bản (0đ)**. Ước chi-phí hạ-tầng **~40.000–100.000đ/tháng** (chưa gồm domain năm đầu ~250.000đ và phí SePay/Casso nếu hết khuyến-mãi). Mọi phí có nguồn URL; số chưa xác-minh được đánh dấu **[cần xác minh]**.

**Ngày tổng-hợp:** 08/07/2026. **Phạm-vi:** so-sánh nền-tảng bán/giao SP số + cổng thanh-toán VN + email/Zalo OA + giao-hàng tự-động/chống-copy, cho DN sản-phẩm-số VN giai-đoạn GĐ1 (chưa doanh-thu, vốn nhỏ 20/50/100tr theo `P0-03-protocol-do-luong.md`).

---

## 1. So-sánh nền-tảng bán/giao SP số

### (a) Tự-host — WordPress + WooCommerce/Easy Digital Downloads, hoặc trang đơn + Google Sites

| Hạng-mục | Chi-phí | Nguồn |
|---|---|---|
| Hosting VN (WordPress) | VinaHost từ **~0,7 USD/tháng** (≈18.000đ, tỷ giá tham-khảo ~25.500đ/USD [cần xác minh tỷ giá ngày mua]); LANIT từ **17.600đ/tháng** | [VinaHost WordPress Hosting](https://vinahost.vn/en/wordpress-hosting/), [LANIT](https://lanit.com.vn/wordpress-hosting-en.html) — truy-cập 08/07/2026 |
| Hosting quốc-tế (thay-thế) | StableHost từ **1,75 USD/tháng** (gói Starter), Hostinger có gói tương-đương giá thấp [số cụ-thể chưa tra được — cần xem trực-tiếp] | [Vietnix — hướng-dẫn StableHost](https://vietnix.vn/mua-hosting-stablehost/) |
| Domain .com/.vn | **[chưa tra được giá cụ-thể — cần xác minh]**, ước-tính thị-trường phổ-biến 200.000–350.000đ/năm (KHÔNG phải số thật, chỉ để tham-khảo lập ngân-sách) | — |
| Plugin bán SP số | **Easy Digital Downloads** — bản lõi **miễn-phí** (giỏ hàng, cấp link tải tự-động ngay sau thanh-toán, giới-hạn số lần tải); extension nâng-cao tính phí riêng theo add-on **[giá từng add-on chưa tra được — cần xem easydigitaldownloads.com/downloads]** | [WordPress.org — EDD](https://wordpress.org/plugins/easy-digital-downloads/), [easydigitaldownloads.com](https://easydigitaldownloads.com/) |
| Trang đơn (Google Sites) + link thanh-toán ngoài | **0đ** (Google Sites free) nhưng giao SP thủ-công (tự gửi link Drive sau khi thấy tiền về qua SePay/Casso) — chỉ phù-hợp test cực sớm, không tự-động-hoá | — |

**Ưu điểm:** owned-audience 100% (data khách, email list DN giữ toàn-bộ) — đúng moat đã xác-định trong Brain; chi-phí biến-đổi thấp nhất (chỉ mất phí cổng thanh-toán, KHÔNG mất % platform); toàn quyền tuỳ-biến giao-diện/luồng bán.

**Nhược điểm:** cần vài ngày–1 tuần dựng (kỹ-năng kỹ-thuật cơ-bản, hoặc thuê freelancer setup 1 lần — chi-phí thị-trường phổ-biến nhưng **[chưa tra được số cụ-thể — cần xác minh]**); tự chịu trách-nhiệm bảo-mật/backup/update; tốc-độ ra-mắt chậm hơn nền-tảng có sẵn.

### (b) Nền-tảng chuyên (landing/website VN + LMS/checkout global)

**VN:**

| Nền-tảng | Giá | Ghi-chú | Nguồn |
|---|---|---|---|
| **Ladipage** | PRO **229.000đ/tháng** (cam-kết ≥12 tháng); Standard **2.748.000đ/năm**; Enterprise **689.000đ/tháng** (≥12 tháng) | Bảng giá áp-dụng từ 07/07/2026; có gói STARTER free dùng-thử. Chỉ chuyên landing page — vẫn cần nối thêm cổng thanh-toán + công-cụ giao file riêng | [ladipage.vn/banggia](https://ladipage.vn/banggia) |
| **Sapo Web** | Web Standard **499.000đ/tháng** (+ setup fee 1.500.000đ 1 lần, miễn nếu ký ≥2 năm); Omni **600.000đ/tháng** (≥2 năm) | Có giỏ hàng/tồn-kho/tích-hợp giao-vận đầy-đủ hơn Ladipage, nhưng không chuyên LMS/digital-delivery | [sapo.vn/bang-gia-sapo-web.html](https://www.sapo.vn/bang-gia-sapo-web.html) |
| **Getfly CRM** | 417.000–1.568.000đ/tháng theo số user (+ setup ~1.500.000đ) | Đây là CRM/chăm-sóc KH, KHÔNG phải nền bán SP số chính — **khuyến-nghị BỎ QUA ở Đợt-1** (over-kill so với quy-mô validate) | [getfly.vn/bang-gia.html](https://getfly.vn/bang-gia.html) |

**Global:**

| Nền-tảng | Giá | Ghi-chú | Nguồn |
|---|---|---|---|
| **Gumroad** | **10% flat**/giao-dịch bán trực-tiếp (30% nếu khách tìm qua Gumroad Discover); không phí tháng | Merchant-of-record (tự thu/nộp thuế VAT hộ ở các nước áp-dụng) | [gumroad.com/pricing](https://gumroad.com/pricing) |
| **Payhip** | Free: **5%/giao-dịch**; Plus 29 USD/tháng (~740.000đ): **2%**; Pro 99 USD/tháng (~2.520.000đ): **0%** | Cộng thêm phí Stripe/PayPal ~2,9%+0,3 USD trên MỌI gói | [payhip.com/pricing](https://payhip.com/pricing) |
| **Teachable** | Starter 39 USD/tháng (~995.000đ) + **7,5%** phí giao-dịch; Builder 89 USD/tháng (~2.270.000đ): **0%** phí platform | Vẫn cộng phí xử-lý thẻ ~2,9%+0,3 USD/giao-dịch qua Teachable:pay (Stripe) | [teachable.com/pricing](https://www.teachable.com/pricing) |

**Ưu điểm:** dựng nhanh (vài giờ–1 ngày), có sẵn giỏ hàng/thanh-toán/giao SP số tự-động, giao-diện chuyên-nghiệp sẵn.

**Nhược điểm:** VN (Ladipage/Sapo) vẫn phải tự nối cổng thanh-toán VN riêng (cộng thêm phí gateway); phụ-thuộc uptime/chính-sách nhà cung-cấp. Global (Gumroad/Payhip/Teachable) chủ-yếu nhận thẻ quốc-tế/PayPal/Stripe — khách VN quen chuyển-khoản/ví điện-tử sẽ khó thanh-toán hơn (tỷ-lệ chuyển-đổi thấp hơn tại VN); doanh-thu USD phải quy-đổi; nghĩa-vụ thuế xuyên biên-giới phức-tạp hơn; "khách hàng" (checkout, một phần data) nằm trên hạ-tầng của họ → rủi-ro khoá tài-khoản cao hơn tự-host.

### (c) Sàn nội-dung VN (Unica/Kyna/Gitiho/Edumall)

- **Unica:** hoa-hồng chia-sẻ dao-động **30–80%** cho platform tuỳ tier/loại hợp-đồng (tức giảng-viên/nhà sản-xuất giữ khoảng 20–60%), theo các nguồn không chính-thức (blog/help-center) — **[số dao-động giữa các nguồn, cần xác-minh chính-xác qua hợp-đồng thật trước khi ký]**. Nguồn: [help.unica.vn/loi-nhuan-tu-khoa-hoc.html](https://help.unica.vn/loi-nhuan-tu-khoa-hoc.html).
- **Kyna, Gitiho, Edumall:** **[không tra được % chia sẻ hoa-hồng công-khai — cần liên-hệ trực-tiếp sàn để xác-minh trước khi ký hợp-đồng]**.

**Ưu điểm:** traffic có sẵn, không cần tự làm marketing/kỹ-thuật, uy-tín thương-hiệu sàn giúp bán nhanh hơn giai-đoạn đầu.

**Nhược điểm — RỦI-RO CHIẾN-LƯỢC:** sàn giữ data khách (email/số điện-thoại người học) → **KHÔNG giữ được owned-audience**, đối-lập trực-tiếp với moat đã xác-định trong Brain DN (`00-Brain/products.md`/`curves.md`: "moat = audience sở-hữu, không phải file"). Nếu dùng sàn làm kênh CHÍNH sẽ tự triệt-tiêu lợi-thế cạnh-tranh dài-hạn — chỉ nên dùng sàn như kênh PHỤ/thử ngách, không thay-thế kênh tự-host.

---

## 2. Cổng thanh-toán VN

| Cổng | Phí giao-dịch | Điều-kiện đăng-ký | Nguồn |
|---|---|---|---|
| **VNPay** — Cổng thanh-toán online (web) | Nội-địa (thẻ/TK NH/ví điện-tử): **1,1% + 1.650đ**/GD; thẻ quốc-tế: **2,75% + 2.500đ**/GD (đã gồm VAT) | — | [vnpay.vn/dich-vu](https://vnpay.vn/dich-vu/0f61zmr3hwgs), truy-cập 08/07/2026 |
| **VNPay** — VNPAY-QR (chỉ QR) | Nội-địa: **0,88%**; quốc-tế: **2,2%** | Đăng-ký QR cho hộ kinh-doanh **cần giấy phép đăng-ký kinh-doanh** — cá-nhân chưa lập hộ KD có thể khó đăng-ký trực-tiếp | [vnpay.vn/dang-ky-qr-thanh-toan-ho-kinh-doanh](https://vnpay.vn/dang-ky-qr-thanh-toan-ho-kinh-doanh-0py2hr0eb3ja) |
| **MoMo Business** | Online ước **~1–2%**/GD; QR ước **0–1%**; nguồn không chính-thức nêu trung-bình ~2%/đơn cho tích-hợp cổng online | Cá-nhân KD: CMND/CCCD; nếu KHÔNG có giấy-phép KD cần bổ-sung ảnh cửa-hàng + chứng-minh loại hàng-hoá/dịch-vụ | **[phí chính-xác phụ-thuộc thoả-thuận riêng từng merchant — cần xác-minh qua MoMo Business khi đăng-ký]**; [posapp.vn — hướng-dẫn](https://posapp.vn/momo-cho-cua-hang-momo-business) |
| **ZaloPay** | KHÔNG công-bố biểu-phí online cố-định cho merchant nhỏ; phí "theo thoả-thuận giữa ZION và Đơn-vị-chấp-nhận-thanh-toán từng trường-hợp" | Cá-nhân KD: CMND/CCCD/hộ-chiếu + TK ngân-hàng; hộ KD: + mã-số-thuế hộ KD; DN: + GPKD | [zalopay.vn/quy-dinh/bieu-phi...](https://zalopay.vn/quy-dinh/bieu-phi-su-dung-dich-vu-trung-gian-thanh-toan-zalopay) — **[phí cụ-thể cần xác-minh trực-tiếp khi đăng-ký]** |
| **SePay** (chuyển-khoản tự-động VietQR) | **KHÔNG thu % trên giao-dịch** — mô-hình thuê-bao theo gói/tháng; từng có khuyến-mãi **500 giao-dịch miễn-phí/tháng trong 1 năm** cho hộ KD cá-thể/freelancer, áp-dụng 26/06/2025–31/12/2025 | Chỉ cần TK ngân-hàng cá-nhân/DN, không cần KYC merchant nặng như cổng thẻ | [sepay.vn](https://sepay.vn/) — **[giá gói cụ-thể + hiệu-lực khuyến-mãi hiện-tại (07/2026) chưa tra được đầy-đủ, trang bảng-giá không truy-cập được tự-động — cần CEO/kế-toán vào sepay.vn/bang-gia.html xác-minh trực-tiếp]** |
| **Casso** | Tương-tự SePay: KHÔNG phí %/giao-dịch; có gói dùng-thử 14 ngày/100 giao-dịch (Pioneer/Standard) | Tương-tự SePay | [casso.vn](https://casso.vn/) — **[giá gói cụ-thể chưa tra được, trang bảng-giá không truy-cập được tự-động — cần xác-minh trực-tiếp tại casso.vn/bang-gia]** |

**Nhận-định:** với AOV thấp (SP số VN thường 49.000–499.000đ), phí %/GD của cổng thẻ (VNPay/MoMo/ZaloPay, 0,88–2,75%) ăn vào biên gộp đáng-kể hơn tỷ-trọng phí thuê-bao cố-định của SePay/Casso — **SePay/Casso rẻ hơn ở giai-đoạn validate volume thấp**. Đánh-đổi: khách phải tự thao-tác chuyển-khoản/quét QR (thêm 1 bước so với bấm "Thanh-toán bằng thẻ" 1-chạm) → có-thể giảm tỷ-lệ chuyển-đổi ở nhóm khách quen dùng thẻ/ví; không hỗ-trợ trả góp/thẻ quốc-tế.

---

## 3. Email marketing + Zalo OA + giao SP số tự-động + chống-copy

### Email marketing

| Công-cụ | Free tier | Gói trả-phí | Nguồn |
|---|---|---|---|
| Mailchimp | **250 contact / 500 email gửi/tháng** (đã giảm mạnh so với trước) | Tuỳ bậc, tính theo số contact | [retainful.com/blog/mailchimp-pricing](https://www.retainful.com/blog/mailchimp-pricing) |
| GetResponse | **500 contact**, tính-năng giới-hạn | Email Marketing từ **~19 USD/tháng** (~485.000đ, **[giá VNĐ cần xác-minh, đây là giá niêm-yết USD]**) | so-sánh workfx.ai/mailercloud |

Khuyến-nghị Đợt-1: dùng **free tier** (GetResponse 500 contact hoặc Mailchimp 250 contact) — đủ cho giai-đoạn validate <500 lead ban-đầu; nâng-cấp khi list lớn hơn.

### Zalo OA

| Hạng-mục | Chi-phí | Nguồn |
|---|---|---|
| Tạo OA | **Miễn-phí** | [oa.zalo.me](https://oa.zalo.me/home/documents/guides/khoi-tao-zalo-official-account_61) |
| Xác-thực doanh-nghiệp | **Miễn-phí** (xác-thực trong 14 ngày sau tạo) | [oa.zalo.me — chi-phí vận-hành OA xác-thực](https://oa.zalo.me/home/documents/guides/chi-phi-van-hanh-tai-khoan-zalo-oa-doanh-nghiep-xac-thuc_4294439646029434342) |
| Gói Cơ-bản (mặc-định sau xác-thực) | **Miễn-phí** — đủ CSKH/broadcast giới-hạn Đợt-1 | cùng nguồn trên |
| Gói Nâng-cao | **99.000đ/tháng** (đã gồm VAT 10%, bảng giá áp-dụng từ 01/06/2026) | [smsthuonghieu.com/goi-zalo-oa](https://www.smsthuonghieu.com/goi-zalo-oa/) |

### Giao SP số tự-động + chống-copy cơ-bản

- **Easy Digital Downloads** (WordPress): tự-động cấp link tải NGAY sau khi thanh-toán thành-công, giới-hạn số lần tải, link hết-hạn — chống share tràn-lan ở mức cơ-bản. Bản lõi miễn-phí; extension nâng-cao (đa cổng thanh-toán, giới-hạn IP...) tính phí riêng **[giá từng add-on chưa tra được]**.
- **Chống-copy cơ-bản không tốn thêm chi-phí:** watermark tên/email người mua trên PDF/video, link tải giới-hạn thời-gian (24–72h) + số lần download, mã kích-hoạt/license-key cho template/preset, cấp-phát thủ-công qua email (không đăng public link tải).
- **Lưu-ý:** không có giải-pháp nào chống copy 100% với file số — mục-tiêu thực-tế là "đủ khó/đủ mất công để nản người muốn share lại", không phải khoá tuyệt-đối. Xem thêm `10-thuc-thi-compliance-1-eula.md` (license) và `10-thuc-thi-compliance-2-content-rights.md`.

---

## 4. KHUYẾN-NGHỊ stack tối-thiểu-khả-thi cho Đợt-1 (validate)

**Tiêu-chí chọn:** rẻ nhất có-thể, nhanh dựng, giữ tối-đa owned-audience (moat).

| Lớp | Lựa-chọn | Lý-do |
|---|---|---|
| Nền-tảng bán | **WordPress + Easy Digital Downloads** (tự-host) | Giữ 100% owned-audience + chi-phí biến-đổi thấp nhất; nếu ưu-tiên tốc-độ dựng landing hơn full-control, phương-án thay-thế là Ladipage PRO (229.000đ/tháng) nhưng vẫn cần tự nối cổng thanh-toán + công-cụ giao file riêng nên tổng chi-phí/công-sức không rẻ hơn |
| Hosting | VinaHost/LANIT ~18.000–50.000đ/tháng | Đủ cho traffic thấp giai-đoạn validate |
| Domain | .com/.vn, ước ~250.000đ/năm (~20.000đ/tháng phân-bổ) | **[cần xác-minh giá cụ-thể lúc mua]** |
| Cổng thanh-toán CHÍNH | **SePay hoặc Casso** (VietQR tự-động) | Không phí %/GD, phù-hợp AOV thấp; để ngỏ VNPay/MoMo cho Đợt-2 khi đã lập hộ kinh-doanh chính-thức (tăng tỷ-lệ chuyển-đổi nhóm khách quen thẻ/ví) |
| Email | GetResponse hoặc Mailchimp **free tier** | Giữ list ngay từ đầu — đây LÀ moat, không trì-hoãn |
| Zalo OA | Gói **Cơ-bản (0đ)** | Đủ CSKH giai-đoạn đầu |
| Chống-copy | Watermark + link tải hạn-giờ (built-in EDD) | Không tốn thêm chi-phí |

**Ước chi-phí hạ-tầng/tháng (Đợt-1, KHÔNG gồm ads/nội-dung):**

| Khoản | Ước-tính |
|---|---|
| Hosting | 20.000–50.000đ |
| Domain (phân-bổ) | ~20.000–30.000đ |
| Cổng thanh-toán (SePay/Casso) | 0đ nếu còn trong hạn khuyến-mãi 500GD miễn-phí, hoặc phí thuê-bao **[cần xác-minh số cụ-thể]** |
| Email | 0đ (free tier) |
| Zalo OA | 0đ (gói cơ-bản) |
| Plugin EDD | 0đ (bản lõi) |
| **Tổng ước-tính** | **~40.000–100.000đ/tháng** (chưa gồm domain năm đầu ~250.000đ 1 lần, và phí SePay/Casso nếu hết khuyến-mãi) |

So-sánh: rẻ hơn nhiều so với nền-tảng chuyên (Ladipage/Sapo 229.000–2.748.000đ/năm) hoặc global (10%/GD Gumroad, hoặc 39–99 USD/tháng Teachable/Payhip) — phù-hợp vốn nhỏ 20/50/100tr đã nêu ở `P0-03-protocol-do-luong.md`.

**Điều-kiện đi kèm:** stack này cần kỹ-năng kỹ-thuật cơ-bản để dựng WordPress (hoặc thuê freelancer setup 1 lần, chi-phí thị-trường **[chưa tra được — cần xác-minh]**). Nếu CEO không rành kỹ-thuật và cần dựng SIÊU nhanh (trong ngày) để test tín-hiệu sớm-nhất, phương-án fallback là Google Sites (free) + link Casso/SePay QR + giao file thủ-công qua email/Drive — chấp-nhận không tự-động-hoá, chỉ dùng cho vài chục đơn đầu-tiên.

---

## Điểm cần CEO/kỹ-thuật xác-minh trước khi triển-khai

1. Giá domain cụ-thể tại nhà đăng-ký sẽ dùng (chưa tra được số thật).
2. Phí gói SePay/Casso cụ-thể + hiệu-lực khuyến-mãi 500GD/tháng tại thời-điểm đăng-ký (trang bảng-giá không truy-cập được qua công-cụ tự-động, cần vào trực-tiếp).
3. Phí MoMo Business/ZaloPay chính-xác — phụ-thuộc thoả-thuận riêng, cần liên-hệ trực-tiếp trước khi tích-hợp.
4. % hoa-hồng chính-xác nếu cân-nhắc kênh sàn (Unica/Kyna/Gitiho/Edumall) — số hiện có không thống-nhất giữa nguồn, cần hỏi thẳng sàn/đọc hợp-đồng trước khi ký.
5. Chi-phí thuê freelancer setup WordPress nếu CEO không tự dựng được.
