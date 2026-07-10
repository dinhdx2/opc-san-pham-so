# 10-thực-thi — Kế-hoạch bật Ads THỰC-CHIẾN (Meta trước) cho Kit Lên Đơn Đầu Tiên 179k

> **TL;DR:** CEO đã chốt hướng đi: hoàn-thiện landing rồi **chạy ads ngay** (không chờ outreach dài). Tài-liệu này KHÔNG bàn lùi hướng đó — nó cho kỷ-luật để chạy an-toàn với **runway <3 tháng, war-chest ~50tr**: bật **Meta (Facebook/Instagram) Ads trước** (lý-do ở mục b), test **300.000-500.000đ/ngày × 3-5 ngày (~1,5-2,5 triệu)** `[đề-xuất — CEO chốt]`, đọc chỉ-số bằng đúng sự-kiện Purchase đã vá ở `10-thuc-thi-checklist-go-live.md`, và **tuyệt-đối không tăng ngân-sách tới khi có ≥1 ad set đạt hoà-vốn trở lên** (CAC < 179.000đ). Trần cứng: **không chi quá 10% war-chest (~5 triệu) cho ads Đợt-1** khi chưa chứng-minh có lãi.

**Neo:** `00-Brain/budget.md` (war-chest ~50tr, runway <3 tháng) · `00-Brain/products.md` (giá 179k, SePay ~0% phí) · `10-thuc-thi-checklist-go-live.md` (12 điều-kiện tiên-quyết — **PHẢI xong hết trước khi đọc tài-liệu này**) · `10-thuc-thi-compliance-4-ad-review.md` (checklist bắt-buộc trước publish) · `10-thuc-thi-protocol-do-luong.md` (nguyên-tắc "không quyết dựa 1 chỉ-số/n nhỏ"). **Cập-nhật/thay-thế phần trình-tự của `10-thuc-thi-ads-test-plan.md`:** tài-liệu cũ giả-định outreach+presell PHẢI xong trước khi bật ads (đường lean fast-validate); CEO nay quyết bật ads song-song ngay khi landing sẵn-sàng — tài-liệu này giữ nguyên **trần ngân-sách kỷ-luật** đã thống-nhất trước đó (Đợt-1 ads ≤ ~5-7 triệu, <15% war-chest) nhưng đổi trình-tự cho phù hướng mới. **Khuyến-nghị:** khi CEO xác-nhận cuối-cùng, ghi 1 dòng mới vào `00-Brain/decisions-log.md` (altitude: `dinh-vi`) để khoá lại trình-tự mới này — AI chưa tự ghi vì đây là quyết-định cần CEO trực-tiếp xác-nhận qua cổng CEO, không phải chỉ qua yêu-cầu chuyển-tiếp.

---

## (a) Điều-kiện tiên-quyết — PHẢI đủ mới bật ngân-sách ads thật

Không lặp lại chi-tiết (đã có đầy-đủ ở `10-thuc-thi-checklist-go-live.md`), chỉ liệt bảng gate nhanh:

| # | Điều-kiện | Nguồn xác-nhận | Trạng-thái |
|---|---|---|---|
| 1 | Pixel Meta + TikTok đã sống (bắn đúng PageView/ViewContent/InitiateCheckout/**Purchase-CompletePayment**) | Checklist go-live mục (a)+(h), Pixel Helper xanh | ☐ chưa xác-nhận |
| 2 | Trang Chính-sách Quyền riêng-tư sống, link từ footer + form opt-in | Checklist go-live mục (d) | ☐ chưa xác-nhận |
| 3 | Trang Chính-sách Đổi trả/Hoàn tiền sống + banner ngắn trước nút mua | Checklist go-live mục (d.5) | ☐ chưa xác-nhận |
| 4 | Đã TEST 1 giao-dịch thật 179k THÀNH-CÔNG end-to-end (không chỉ "code chạy được" mà PHẢI thấy tiền vào + file tải được) | Checklist go-live mục (g) | ☐ chưa xác-nhận |
| 5 | ENV var `SEPAY_API_TOKEN` sống trên Vercel (nếu không, ads dẫn khách vào 1 cổng thanh-toán hỏng = vừa mất tiền ads vừa mất khách) | Checklist go-live mục (g.0) | ☐ chưa xác-nhận |
| 6 | Đã chạy checklist `10-thuc-thi-compliance-4-ad-review.md` cho MỌI creative dự-định đăng (không claim "giàu nhanh"/"lên đơn chắc-chắn", không cam-kết tuyệt-đối) | Tự rà trước khi publish từng creative | ☐ chưa xác-nhận |
| 7 | Founder đã có phương-tiện thanh-toán ads: **thẻ Visa/Mastercard** (đa-số ngân-hàng VN phát-hành thẻ ATM/ghi-nợ nội-địa có logo Visa/Mastercard dùng được), hoặc MoMo (riêng cho Meta) | Tự kiểm ví/thẻ | ☐ chưa xác-nhận |
| 8 | Tài-khoản Facebook cá-nhân đã xác-minh SĐT, có ít-nhất 1 Fanpage (Facebook **bắt-buộc chạy ads qua Fanpage**, không chạy được từ profile cá-nhân) | Tự kiểm | ☐ chưa xác-nhận |

> Thiếu bất-kỳ mục 1-5 → **DỪNG, quay lại checklist go-live**, không bật ads dù đã có creative đẹp. Mục 6 là ranh-giới cứng compliance (F1/F2 theo engine tuân-thủ của hệ-thống — nội-dung "mô-tả xong" không tính, phải thật-sự rà từng creative). Mục 7-8 là điều-kiện kỹ-thuật để tài-khoản ads được duyệt.

*Nguồn điều-kiện tài-khoản cá-nhân: [Tổng quát tài khoản quảng cáo Facebook Ads cá nhân — smarkgo.com](https://smarkgo.com/kien-thuc-facebook-ads/tong-quat-tai-khoan-quang-cao-facebook-ads-ca-nhan)*

---

## (b) Chọn kênh ĐẦU: **Meta (Facebook/Instagram) Ads** — TikTok Ads Manager để Tranche 2

### Bảng so-sánh sàn ngân-sách tối-thiểu (đây là lý-do quyết-định chính)

| | **Meta Ads Manager** | **TikTok Ads Manager (chính-thức)** |
|---|---|---|
| Sàn tối-thiểu kỹ-thuật | Không có mức sàn cứng cao; thực-tế cần **~100.000-200.000đ/ngày/ad set** để thuật-toán có dữ-liệu | **20 USD/ngày/ad-group** (~530.000đ) **+ 50 USD/ngày/campaign** (~1.325.000đ) nếu dùng Campaign Budget Optimization |
| Test 2-3 ad set/audience cùng lúc với ngân-sách 300.000-500.000đ/ngày | **Khả-thi** (chia ~100.000-165.000đ/ad set) | **KHÔNG khả-thi** — riêng sàn ad-group đã cần tối-thiểu 2×530.000=1.060.000đ hoặc 3×530.000=1.590.000đ/ngày, vượt xa ngân-sách test đề-xuất |
| Yêu-cầu tài-khoản cá-nhân | Có thẻ Visa/Mastercard **hoặc MoMo**, tài-khoản FB xác-minh SĐT ≥10 ngày, có Fanpage | Có thẻ Visa/Mastercard/JCB (chưa xác-nhận hỗ-trợ MoMo), nạp tối-thiểu ~200.000đ/lần |
| Nguồn | [Meta minimum daily budget — vi-vn.facebook.com](https://vi-vn.facebook.com/business/help/214319341922580) | [Budget & Bidding FAQ — ads.tiktok.com](https://ads.tiktok.com/help/article/budget-and-bidding-faq?lang=vi), [TikTok Ads Payment Methods — cardwisechoice.com](https://cardwisechoice.com/blog/visa-and-mastercard-for-tiktok-ads) |

### Lý-do chọn Meta trước
1. **Khớp đúng ngân-sách kỷ-luật đề-xuất** (mục d) — TikTok Ads Manager chính-thức đòi sàn cao hơn hẳn 300-500k/ngày, dùng ngay sẽ buộc phải tăng ngân-sách chỉ để "đạt sàn nền-tảng" chứ không phải vì có tín-hiệu tốt — đi ngược nguyên-tắc kỷ-luật.
2. Pixel Meta cũng đã có sẵn code (chỉ cần bỏ comment, giống TikTok — không lệch công-sức kỹ-thuật giữa 2 kênh).
3. Beachhead (người mới mở shop TikTok Shop/Shopee, 0 đơn) vẫn hoạt-động đông trên Facebook — nhiều **nhóm cộng-đồng bán hàng online/TikTok Shop VN** tồn-tại lâu-đời trên Facebook; Meta có sẵn targeting theo sở-thích "kinh-doanh online", "TikTok Shop", "Shopee", "quản-lý bán hàng".
4. SP là **tự-checkout ngay trên landing** (không cần bước "lead form" trung-gian) — hợp mục-tiêu Purchase/Conversions của Meta, vốn linh-hoạt ngân-sách nhỏ hơn TikTok.

### Vai-trò TikTok trong kế-hoạch
- **Tranche 2 trở đi** (khi ngân-sách/ngày đã đủ lớn để đạt sàn TikTok Ads Manager, tức đã qua Tranche 1 Meta và có tín-hiệu dương) — sẽ mở TikTok Ads Manager chính-thức để đa-kênh-hoá, vì về lâu-dài TikTok Ads hợp bản-chất SP (bán hàng cho seller TikTok Shop) hơn.
- **Song-song ngay từ Tranche 1, chi-phí gần-như 0đ:** dùng **TikTok "Boost post"** (đẩy 1 bài/video tự-nhiên đã đăng) thay vì mở Ads Manager đầy-đủ — Boost post không bị ràng sàn ad-group/campaign nói trên, có-thể chi vài chục-trăm-nghìn/bài để thử hook trước khi cam-kết ngân-sách Ads Manager chính-thức. Đây là kênh PHỤ, không tính vào Tranche 1 Meta ở mục (d).

---

## (c) Cấu-trúc campaign đơn-giản (Meta Ads Manager)

```
1 CAMPAIGN — "ĐơnThật — Kit Lên Đơn — Test T1"
  Mục-tiêu: Sales (Purchase) — dùng pixel event "Purchase" đã vá ở checklist go-live (a.5)
  Ngân-sách: đặt ở cấp CAMPAIGN (Advantage+ campaign budget BẬT) để Meta tự phân-bổ giữa các ad set
        │
        ├─ AD SET 1 — "Sở-thích rộng: kinh-doanh online"
        │    Targeting: 22-45 tuổi, VN, sở-thích "kinh doanh online", "bán hàng online", "khởi nghiệp nhỏ"
        │    Placements: Advantage+ (tự-động, ưu-tiên Facebook Feed + Reels + Instagram)
        │
        ├─ AD SET 2 — "Sở-thích hẹp: TikTok Shop / Shopee seller"
        │    Targeting: 22-45 tuổi, VN, sở-thích/hành-vi "TikTok Shop", "Shopee", "quản lý bán hàng"
        │    Placements: Advantage+ (như trên)
        │
        └─ (tuỳ ngân-sách) AD SET 3 — "Lookalike/Broad rộng nhất"
             Targeting: Advantage+ Audience (Meta tự tìm dựa trên pixel + creative), KHÔNG giới-hạn sở-thích
             Dùng khi muốn xem thuật-toán tự tìm đối-tượng có tốt hơn targeting thủ-công không
```

- **Creative:** dùng ảnh/video đã có sẵn — tái-dùng kịch-bản ở `D1-03-content-scripts.md` nếu có bản quay rồi, hoặc ảnh chụp màn-hình landing/sản-phẩm kèm copy ngắn nêu đúng nỗi-đau "mở shop rồi mà vẫn im-lìm". **Bắt-buộc chạy qua `10-thuc-thi-compliance-4-ad-review.md` trước khi đăng bất-kỳ creative nào.**
- **Nếu Purchase objective không lên được impression / báo "Learning Limited" sau 3-4 ngày mà không tiêu hết ngân-sách:** đổi tạm objective sang **Traffic** (lượt xem trang) hoặc **Engagement** để thu rẻ hơn dữ-liệu ban-đầu, tích-luỹ ≥8-10 sự-kiện Purchase/InitiateCheckout trong pixel rồi quay lại Purchase objective. Đây là tình-huống bình-thường với ngân-sách nhỏ + tài-khoản mới, không phải dấu-hiệu sản-phẩm tệ.
- **KHÔNG** dùng Lead-generation objective riêng (không cần — landing đã tự-checkout, form opt-in chỉ là nhánh phụ cho người "chưa sẵn-sàng mua ngay").

---

## (d) Ngân-sách test kỷ-luật `[đề-xuất — CEO chốt cùng 03-finance]`

| Giai-đoạn | Ngân-sách | Điều-kiện mở | % war-chest (50tr) |
|---|---|---|---|
| **Tranche 1 — Test 3 ad set trên** | **300.000-500.000đ/ngày × 3-5 ngày = 1.500.000-2.500.000đ TỔNG** | Đủ 8 điều-kiện mục (a) | **3-5%** |
| **Tranche 2 — mở-rộng NẾU Tranche 1 có ≥1 ad set hoà-vốn trở lên** | Thêm tối-đa 2.500.000-4.500.000đ (giữ tổng Đợt-1 ads **≤ 5.000.000-7.000.000đ**) | CAC ad set thắng < 179.000đ VÀ ≥3 đơn (không phải 1 đơn may-mắn) | Tổng **≤ 10-14%** |
| **TUYỆT-ĐỐI KHÔNG vượt** | > 7.000.000đ ads trong Đợt-1 | — | > 14% |

**Cách chia trong ngày:** Advantage+ campaign budget để Meta tự phân-bổ giữa 2-3 ad set — không cần chia thủ-công từng ad set. Chạy liên-tục 3-5 ngày (không tắt/bật giữa chừng — làm vậy sẽ reset learning phase, tốn tiền vô-ích).

**Vì sao mức thấp:** (1) đây là ĐƠN-VÒNG test đầu-tiên trên 1 tài-khoản ads mới, chưa có dữ-liệu — không cần chi lớn để trả lời câu hỏi "kênh này có nói-chuyện được với beachhead không"; (2) giữ ≥86-90% war-chost cho việc khác (vận-hành, dự-phòng runway, ĐỢT-2 nếu mở); (3) runway <3 tháng không cho-phép thử-sai đắt.

---

## (e) Toán unit economics — ngưỡng SCALE / GIỮ / KILL

| Khoản | Số |
|---|---|
| Giá bán (P) | **179.000đ** |
| Phí SePay/giao-dịch | **~0%** (mô-hình thuê-bao, không tính %/GD theo `00-Brain/products.md` + `10-thuc-thi-ha-tang-ban.md`) — **lưu-ý:** khuyến-mãi "500 giao-dịch miễn-phí/tháng" của SePay từng công-bố hiệu-lực đến 31/12/2025 đã **hết hạn** tính tới nay (07/2026) — `[cần founder xác-minh lại phí gói SePay hiện-hành tại my.sepay.vn/bang-gia trước khi tính chính-xác 100%, dù khả-năng cao vẫn là phí thuê-bao cố-định/tháng chứ không phải %/đơn]` |
| Chi-phí nhân-bản thêm 1 đơn | **≈0đ** (sản-phẩm số đã sản-xuất xong) |
| **Biên gộp/đơn** | **≈179.000đ** (gần 100% — đặc-thù SP số) |
| **Ngưỡng hoà-vốn ads (breakeven)** | **CAC (cost/purchase) < 179.000đ** ⇔ **ROAS ≥ 1,0x** |

### Bảng ngưỡng quyết-định `[đề-xuất — CEO chốt]`

| Ngưỡng | Điều-kiện | Hành-động |
|---|---|---|
| **SCALE** | CAC ≤ **90.000đ** (ROAS ≥ ~2,0x) **VÀ** ≥3 đơn Purchase trong cùng 1 ad set (không phải 1 đơn may-mắn) **VÀ** không có refund/complaint bất-thường | Mở Tranche 2, tăng ngân-sách ad set đó (KHÔNG tăng đều tất-cả ad set) |
| **GIỮ (theo-dõi thêm)** | CAC trong khoảng **90.000-179.000đ** (ROAS 1,0-2,0x) | Có lãi nhưng mỏng — chạy thêm 1 đợt test creative khác (đổi hook/ảnh, GIỮ NGUYÊN ngân-sách) trước khi quyết tăng tiền |
| **KILL** | CAC ≥ **179.000đ** (ROAS ≤1,0x) sau khi chi hết Tranche 1, **HOẶC** 0 đơn dù đã chi hết 1,5-2,5tr, **HOẶC** CTR quá thấp không tiêu hết ngân-sách trong 3-5 ngày (dấu-hiệu targeting/creative sai từ gốc) | Tắt ad set đó, KHÔNG đổ thêm tiền — thử targeting/creative khác trong Tranche 1 còn lại, hoặc dừng hẳn kênh này 1 thời-gian |

> **Vì sao ngưỡng SCALE (90.000đ) thấp hơn nhiều breakeven (179.000đ):** founder full-time không thu-nhập khác — mỗi đơn phải vừa hoà chi-phí ads vừa **nuôi được founder + tái đầu-tư**, không chỉ hoà-vốn kế-toán thuần-tuý. ROAS=1,0x (breakeven) chỉ đủ điều-kiện xếp "GIỮ", chưa đủ để bơm thêm tiền.

---

## (f) Đọc chỉ-số 3-7 ngày đầu

| Chỉ-số | Công-thức | Định-hướng đọc nhanh `[benchmark ngành — cần đối-chiếu số thật Ads Manager, KHÔNG neo cứng]` |
|---|---|---|
| **CTR** | `clicks / impressions × 100` | Nếu quá thấp so trung-bình quảng-cáo VN (thường 1-2%+ với creative tốt) → hook/targeting sai, cân-nhắc đổi creative trước khi hết Tranche 1 |
| **CPC** | `spend / clicks` | Benchmark blended VN ~3.000-5.000đ/click (1 nguồn tổng-hợp, dải rộng, chỉ tham-khảo) |
| **CPM** | `spend / impressions × 1000` | Meta VN ~20.000-50.000đ/1000 hiển-thị theo 1 nguồn; **1 nguồn khác ghi 180.000đ — chênh-lệch lớn giữa các nguồn SEO-blog, KHÔNG dùng làm ngưỡng cứng**, chỉ để định-hướng thô |
| **Cost/Purchase (= CAC ads)** | `spend / số sự-kiện Purchase (pixel)` | Đối-chiếu trực-tiếp bảng ngưỡng mục (e) — đây là chỉ-số QUYẾT-ĐỊNH, các chỉ-số trên chỉ để CHẨN-ĐOÁN nguyên-nhân khi Cost/Purchase xấu |
| **ROAS** | `(số đơn × 179.000) / spend` | ≥2,0x mới tính "có lãi đáng-kể" theo ngưỡng SCALE mục (e) |

**Ghi số vào tracker đã có sẵn:** dùng lại `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv` — cột `tripwire_orders` = số đơn Kit 179k từ ads (đặt `hero_orders`=0, `aov_vnd`=179000), `spend_vnd`/`cac_vnd` điền theo Meta Ads Manager. Không tạo tracker riêng để so-sánh trực-tiếp với kênh khác (organic/outreach) trên cùng nền `clicks`.

**Nguyên-tắc n nhỏ (kế-thừa `10-thuc-thi-protocol-do-luong.md`):** với 1,5-2,5tr ngân-sách và giá 179k, Tranche 1 có-thể chỉ tạo ra 5-15 đơn (nếu CAC tốt) — **KHÔNG quyết SCALE/KILL chỉ dựa 1 đơn đơn-lẻ**. Đợi đủ 3-5 ngày HOẶC hết ngân-sách Tranche 1 (tuỳ cái nào đến trước) rồi mới tổng-kết theo bảng (e).

*Nguồn benchmark: [Chi phí quảng cáo TikTok/Facebook VN 2026 — phuctdigital.com](https://phuctdigital.com/gia-chay-quang-cao-tiktok/), [Chi phí quảng cáo trên TikTok — miccreative.vn](https://miccreative.vn/chi-phi-quang-cao-tren-tiktok/) — đây là benchmark ngành tổng-hợp từ blog SEO, dải số không thống-nhất giữa nguồn, chỉ dùng định-hướng thô, luôn ưu-tiên số THẬT founder đọc trực-tiếp trong Ads Manager.*

---

## (g) Cảnh-báo kỷ-luật — đọc kỹ trước khi bấm publish

> **Với runway <3 tháng, đây là quy-tắc CỨNG, không du-di:**

1. **KHÔNG tăng ngân-sách bất-kỳ ad set nào tới khi chính ad set đó đạt ngưỡng SCALE ở mục (e).** Ad set khác có lãi không tự-động cho phép tăng ad set đang lỗ "vì tin nó sẽ tốt lên" — mỗi ad set là 1 quyết-định độc-lập.
2. **Trần cứng Đợt-1: không chi quá 10% war-chest (~5 triệu) cho ads** khi CHƯA có ít-nhất 1 ad set đạt hoà-vốn trở lên (CAC < 179.000đ). Muốn vượt trần này (Tranche 2 lên tới 7 triệu) **bắt-buộc** đã chứng-minh ≥1 ad set SCALE-worthy trước.
3. **Không bao giờ tăng ngân-sách chỉ vì "đã chi rồi, tiếc"** (sunk-cost fallacy) — mỗi tranche là 1 quyết-định độc-lập dựa trên số CAC/ROAS thật của chính tranche đó, không phải cảm-giác.
4. **Nếu KILL cả Tranche 1** (0 ad set nào đạt tối-thiểu "GIỮ"): DỪNG ads, không mở tranche mới ngay — quay lại xem lại offer/hook/targeting, hoặc thử outreach/organic song-song (kênh gần-0đ) trong lúc chỉnh creative, rồi mới thử lại 1 tranche mới với NGÂN-SÁCH BẰNG hoặc thấp hơn Tranche 1 (không tăng khi đang thua).
5. **Runway là ưu-tiên số 1:** nếu sau 2 tranche liên-tiếp đều KILL, founder cần dừng lại đánh-giá tổng-thể (không phải chỉ đổi creative lần 3) trước khi tiếp-tục đốt thêm ngân-sách ads — cân-nhắc quay lại outreach/presell trực-tiếp (gần-0đ, đã có sẵn `D1-03-outreach-playbook.md`) để bảo-toàn vốn trong lúc tìm đúng công-thức.
6. **Việc thực-sự bấm "Publish"/nạp tiền vào tài-khoản ads (chi tiền thật) LUÔN LUÔN là hành-động do chính founder/CEO tự bấm** — AI không có quyền truy-cập tài-khoản ads hay ngân-hàng của founder, tài-liệu này chỉ chuẩn-bị kế-hoạch để CEO duyệt và tự chạy khi đủ điều-kiện mục (a).

---

## Tóm-tắt trình-tự

```
Checklist go-live 12 mục (10-thuc-thi-checklist-go-live.md) — TẤT-CẢ ✅
        ↓
Rà creative qua 10-thuc-thi-compliance-4-ad-review.md
        ↓
CEO tự bấm: nạp thẻ Visa/Mastercard hoặc MoMo vào Meta Ads Manager
        ↓
Bật Tranche 1 — 1 campaign / 2-3 ad set / 300.000-500.000đ/ngày × 3-5 ngày (~1,5-2,5tr)
        ↓
Đọc CTR/CPC/CPM hàng ngày (chẩn-đoán) + Cost/Purchase-ROAS cuối tranche (quyết-định) — ghi vào D1-05-kpi-tracker.csv
        ↓
   SCALE (≥1 ad set CAC<90k, ≥3 đơn)  |  GIỮ (test thêm creative)  |  KILL (dừng, xem lại offer/hook)
        ↓ (nếu SCALE)
Tranche 2 — tăng CÓ CHỌN-LỌC ad set thắng, tổng Đợt-1 ads ≤ 5-7 triệu (≤10-14% war-chest)
        ↓ (khi ngân-sách/ngày đủ lớn)
Mở TikTok Ads Manager chính-thức (đã đạt sàn 1,3tr+/ngày) — song-song có-thể test TikTok Boost Post giá rẻ ngay từ Tranche 1
```

---

## Nguồn tham-khảo
- [Meta minimum daily budget — vi-vn.facebook.com](https://vi-vn.facebook.com/business/help/214319341922580)
- [Tổng quát tài khoản quảng cáo Facebook Ads cá nhân — smarkgo.com](https://smarkgo.com/kien-thuc-facebook-ads/tong-quat-tai-khoan-quang-cao-facebook-ads-ca-nhan)
- [TikTok Ads Budget & Bidding FAQ — ads.tiktok.com](https://ads.tiktok.com/help/article/budget-and-bidding-faq?lang=vi)
- [TikTok Ads Payment Methods / Visa Mastercard — cardwisechoice.com](https://cardwisechoice.com/blog/visa-and-mastercard-for-tiktok-ads)
- [Chi phí quảng cáo TikTok VN 2026 — phuctdigital.com](https://phuctdigital.com/gia-chay-quang-cao-tiktok/)
- [Chi phí quảng cáo trên TikTok — miccreative.vn](https://miccreative.vn/chi-phi-quang-cao-tren-tiktok/)
- [About Parameters (CompletePayment) — ads.tiktok.com](https://ads.tiktok.com/help/article/about-parameters)
- Tỷ giá quy-đổi USD→VND dùng trong tài-liệu: ~26.500đ/USD, theo tỷ-giá Vietcombank 10/07/2026 [tygiausd.org](https://tygiausd.org/nganhang/Vietcombank) — **biến-động theo ngày, đối-chiếu lại lúc nạp tiền thật**.
