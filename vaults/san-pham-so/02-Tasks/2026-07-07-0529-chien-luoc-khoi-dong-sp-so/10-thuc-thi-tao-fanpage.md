# 10-thực-thi — Hướng-dẫn tạo Fanpage Facebook cho ĐơnThật (chuẩn-bị chạy Meta Ads)

> **TL;DR:** Founder (cá-nhân, chưa từng có fanpage) cần **3 lớp hạ-tầng Meta**: Trang cá-nhân (đã có) → **Fanpage "ĐơnThật"** (bắt-buộc để chạy ads, chưa có Page = không chạy được ads từ profile cá-nhân) → **Meta Business Suite + Ad Account + Pixel** (nơi thật-sự chạy chiến-dịch + đo lường). Tài-liệu này có sẵn: 2-3 gợi-ý tên Page, category, bio, About, nút CTA, ý-tưởng logo/ảnh bìa, và **5 bài đăng SEED copy-dán-ngay** (rút từ 10 kịch-bản video đã có) để Page không trống trước khi bật ads. Việc **tạo Page + đăng bài KHÔNG tốn tiền** — chỉ tới bước thêm **thẻ thanh-toán** mới chạm ranh-giới chi-tiền (founder tự làm, ngoài phạm-vi AI-AUTO).

**Căn cứ:** `00-Brain/products.md` (SP thật: Kit Lên Đơn Đầu Tiên 179k, brand ĐơnThật, landing `donthat.vercel.app`), `00-Brain/positioning.md` (beachhead: người mới mở shop TikTok Shop/Shopee, 0 đơn), `10-thuc-thi-ads-launch-plan.md` mục 8 (Facebook bắt-buộc có Fanpage mới chạy ads được), `10-thuc-thi-compliance-4-ad-review.md` (không "giàu nhanh", mọi số phải có bằng-chứng), `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-03-content-scripts.md` (nguồn 10 kịch-bản seed content).

**Ngày tổng-hợp:** 11/07/2026 — các bước UI đã đối-chiếu Meta Help Center + nguồn công-khai 2026, đánh dấu rõ chỗ Facebook hay đổi giao-diện.

---

## 1. Sơ-đồ hạ-tầng Meta — vì sao cần từng lớp

```
[Tài-khoản Facebook CÁ-NHÂN thật của founder]   ← đã có (DO XUAN DINH)
        │  (là "chủ sở-hữu gốc" — Meta không cho tạo Page/Ad Account hoàn-toàn ẩn-danh)
        ▼
[FACEBOOK PAGE "ĐơnThật"]                        ← BƯỚC 1 (chương này)
        │  (Meta bắt-buộc: KHÔNG chạy quảng-cáo được từ profile cá-nhân,
        │   phải có ít-nhất 1 Page đứng tên thương-hiệu)
        ▼
[META BUSINESS SUITE / BUSINESS MANAGER]         ← BƯỚC 3
        │  (gom Page + Ad Account + Pixel + phân-quyền vào 1 nơi;
        │   tách tài-sản DN khỏi tài-khoản cá-nhân — an-toàn hơn nếu sau
        │   này thuê người quản-lý ads hoặc mở thêm kênh)
        ▼
[AD ACCOUNT]  ──liên-kết──▶  [PIXEL]  ──cài trên──▶  donthat.vercel.app
        │                        (đo PageView/InitiateCheckout/Purchase —
        │                         đã có sẵn code pixel theo `products.md`,
        │                         chỉ cần Pixel ID thật + bỏ comment)
        ▼
[THẺ THANH-TOÁN — Visa/Mastercard]              ← HUMAN-ONLY, CHI-TIỀN
   (Meta chỉ CHO PHÉP bật chiến-dịch khi có phương-thức thanh-toán hợp-lệ;
    đây là ranh-giới cứng — AI không tự thêm thẻ/chi tiền)
```

**Vì sao cần từng lớp (tóm-tắt):**
- **Page:** là "danh-tính thương-hiệu" công-khai — nơi khách thấy khi click quảng-cáo, nơi Meta gắn Pixel/Ad Account vào. Không có Page = Meta từ-chối tạo chiến-dịch.
- **Business Suite/Manager:** không bắt-buộc 100% để chạy 1 chiến-dịch nhỏ từ Page, nhưng **nên làm ngay từ đầu** vì (a) tách tài-sản kinh-doanh khỏi tài-khoản cá-nhân (an-toàn hơn nếu tài-khoản cá-nhân bị khóa), (b) là nơi duy-nhất tạo Ad Account + Pixel đúng chuẩn, (c) cần nếu sau này thêm người phụ hoặc đổi thiết-bị quản-lý.
- **Ad Account:** nơi thật-sự giữ ngân-sách + chiến-dịch; 1 Page có thể liên-kết nhiều Ad Account.
- **Pixel:** "con mắt" đo hành-vi trên landing (xem trang, bấm mua, thanh-toán xong) — không có Pixel thì Meta không tối-ưu quảng-cáo theo mục-tiêu "Purchase" được, coi như chạy mù.
- **Thẻ thanh-toán:** điều-kiện CUỐI để nút "Publish" chiến-dịch hoạt-động — Meta giữ như một "khoá" chống chạy ads mà không trả được tiền.

---

## 2. BƯỚC 1 — Tạo Facebook Page

> Giao-diện Facebook hay đổi vị-trí nút — nếu không thấy đúng-y như mô-tả, tìm chữ **"Trang" / "Pages" / "Tạo Trang"** trong menu, luồng logic vẫn giữ nguyên (đặt tên → category → hoàn-tất → chi-tiết Trang).

### Cách A — Nhanh, từ facebook.com/pages/create (phù-hợp nếu chỉ muốn xong Page trước, nối Business Suite sau)
1. Đăng-nhập Facebook bằng **tài-khoản cá-nhân thật** đã xác-minh số điện-thoại (bắt-buộc — profile ảo/chưa xác-minh dễ bị Meta hạn-chế tạo Page/ads).
2. Vào thẳng địa-chỉ `facebook.com/pages/create` (hoặc: bấm biểu-tượng **Trang (Pages)** ở menu trái trên Facebook → **Tạo Trang mới**).
3. Nhập **Tên Trang** — dùng đúng tên khách sẽ tìm (xem gợi-ý mục 3).
4. Nhập **Danh-mục (Category)** — gõ từ-khóa, chọn 1 trong gợi-ý hiện ra (xem gợi-ý mục 3).
5. Nhập **Mô-tả ngắn (Bio, tối-đa 255 ký-tự)** — xem nội-dung sẵn-dán mục 3.
6. Bấm **Tạo Trang (Create Page)**.
7. Facebook chuyển sang màn-hình **thiết-lập Trang**: thêm **ảnh đại-diện**, **ảnh bìa**, đặt **username/@handle**, điền **Giới-thiệu (About)** đầy-đủ, **thông-tin liên-hệ**, và **nút CTA** — làm lần-lượt theo mục 3 bên dưới.

### Cách B — Qua Meta Business Suite (khuyên dùng nếu định chạy ads ngay — gộp luôn bước "đưa Page vào Business Manager" ở BƯỚC 3, đỡ phải làm lại)
1. Vào `business.facebook.com`, đăng-nhập bằng tài-khoản cá-nhân thật.
2. Nếu chưa có Business Portfolio: bấm **Tạo tài-khoản (Create account)** → đặt **Tên doanh-nghiệp** (dùng "ĐơnThật"), điền tên bạn + email của bạn → **Gửi (Submit)**.
3. Trong Business Suite, chọn **Thêm tài-sản (Add assets) → Trang (Page) → Tạo Trang mới (Create a new Page)**.
4. Điền Tên Trang → Category → Bio như Cách A bước 3-5.
5. Page vừa tạo **tự-động nằm sẵn trong Business Portfolio** — bỏ qua được bước "thêm Page vào Business Manager" ở mục 5.

**Khuyến-nghị cho ĐơnThật: dùng Cách B** vì founder sẽ chạy ads ngay sau đó — tiết-kiệm 1 bước liên-kết thủ-công.

---

## 3. NỘI-DUNG SẴN DÁN cho Page "ĐơnThật"

### 3.1 Tên Page (chọn 1)
| # | Tên Page | Lý-do |
|---|---|---|
| 1 | **ĐơnThật** | Ngắn, khớp 100% thương-hiệu + domain `donthat.vercel.app`, dễ nhớ, dễ gõ tìm lại. Khuyên dùng nếu ưu-tiên xây thương-hiệu lâu-dài. |
| 2 | **ĐơnThật — Kit Lên Đơn Đầu Tiên** | Kèm mô-tả sản-phẩm ngay trong tên → người lạ thấy tên Page trong kết-quả tìm-kiếm/dưới quảng-cáo hiểu ngay đang bán gì, không cần bấm vào mới rõ. Tên hơi dài. |
| 3 | **ĐơnThật Shop Online** | Nhấn từ-khóa "shop online" — dễ trồi lên khi người mới mở shop tìm-kiếm trên Facebook. Rủi-ro: nghe giống page bán hàng-hoá vật-lý hơn là bán kit/template. |

> **Khuyên dùng #1** cho nhất-quán thương-hiệu dài-hạn; nếu muốn tối-ưu nhận-diện ngay từ lần thấy đầu, chọn #2. Facebook cho đổi tên Page sau này (có giới-hạn số lần/xét-duyệt nếu đổi nhiều) nên chọn #1 vẫn an-toàn.

### 3.2 Category (Danh-mục)
- **Khuyên dùng chính: "E-commerce Website"** (hoặc tiếng Việt tương-đương "Trang thương-mại điện-tử") — khớp thực-tế: landing `donthat.vercel.app` có checkout bán trực-tiếp.
- **Phương-án an-toàn/phổ-biến hơn: "Product/Service"** ("Sản-phẩm/Dịch-vụ") — category rộng, không giới-hạn, nhiều SP số Việt Nam dùng category này vì Facebook không có mục riêng cho "template/checklist số".
- Có thể chọn **thêm 1 category phụ** (Facebook cho gắn tối-đa vài category) — gợi-ý phụ: "Digital Creator" hoặc "Educational Consultant" nếu muốn nhấn khía-cạnh hướng-dẫn/đào-tạo.

### 3.3 Username / @handle (gợi-ý, kiểm còn trống trước khi đặt)
1. `@donthat` (nếu còn trống — ưu-tiên số 1, ngắn nhất)
2. `@donthat.vn`
3. `@donthatshop`

> Đặt username **sau khi** Page đã có ảnh đại-diện/ảnh bìa/vài bài đăng (Page "trần trụi" đổi username đôi khi bị Facebook giữ chậm xét-duyệt hơn) — không bắt-buộc nhưng an-toàn.

### 3.4 Intro / tiểu-sử ngắn (hiện dưới tên Page, ngắn gọn)
> Kit 179k giúp bạn lên đơn đầu-tiên trên TikTok Shop & Shopee — không cần học, làm được ngay trong buổi.

### 3.5 Phần Giới-thiệu (About) — đầy-đủ
```
ĐơnThật — Kit Lên Đơn Đầu Tiên (TikTok Shop & Shopee)

Bạn vừa mở shop trên TikTok Shop hoặc Shopee, đã đăng sản-phẩm mà vẫn chưa
có đơn nào? ĐơnThật là bộ template/checklist/script thực-chiến (179.000đ,
mua 1 lần, nhận file ngay qua email) giúp bạn tự làm 5 việc quan-trọng nhất
để có đơn đầu-tiên:

1. Checklist khởi-động shop đúng thứ-tự
2. Template listing chuẩn sàn (copy-paste, điền tên/giá sản-phẩm của bạn)
3. Script quay video bán hàng TikTok
4. Checklist chốt đơn & cách tránh bị hoàn hàng
5. Lịch content 30 ngày đăng-gì-mỗi-ngày

Không phải khóa học lý-thuyết dài dòng — là bộ công-cụ điền-sẵn, dùng được
ngay trong vài giờ.

Kết-quả thực-tế tùy sản-phẩm, cách bạn triển-khai và thị-trường ngành hàng
của bạn — chúng tôi không cam-kết số đơn/doanh-thu cụ-thể.

ĐơnThật là sản-phẩm độc-lập của cá-nhân kinh-doanh, KHÔNG phải sản-phẩm/
đối-tác chính-thức của TikTok Shop hay Shopee. Chúng tôi cung-cấp công-cụ
hỗ-trợ người bán tự thực-hiện trên các nền-tảng đó.

🔗 Xem chi-tiết & đặt mua: donthat.vercel.app
```
> Đoạn "không cam-kết số đơn/doanh-thu" + đoạn "sản-phẩm độc-lập, KHÔNG phải đối-tác chính-thức TikTok/Shopee" là **bắt-buộc giữ nguyên** — đúng checklist `10-thuc-thi-compliance-4-ad-review.md` mục 1 (cấm cam-kết thu-nhập) và tránh hiểu-lầm liên-kết chính-thức với 2 sàn (rủi-ro vi-phạm nhãn-hiệu/gây nhầm-lẫn nếu ngụ-ý là đối-tác).

### 3.6 Nút CTA (Call-to-action button)
- Chọn nút **"Mua ngay" (Shop Now)** → liên-kết `https://donthat.vercel.app` (landing đã có đủ copy bán hàng + checkout, dẫn thẳng vào đây là hợp-lý nhất).
- Phương-án 2 nếu muốn "mềm" hơn cho khách mới: **"Tìm hiểu thêm" (Learn More)** → cùng link.
- Cách thêm (giao-diện 2026, Facebook có thể đổi nhãn/vị-trí): vào Page → **Chỉnh-sửa Trang (Edit Page)** hoặc mục **Tùy-chọn (Options)** ngay dưới ảnh bìa → **Thêm nút (Add a button)** → chọn "Shop Now/Mua ngay" → nhập URL `https://donthat.vercel.app` → **Lưu**. Chỉ được gắn **1 nút CTA** tại một thời-điểm (đổi thì phải gỡ nút cũ trước).

### 3.7 Ảnh đại-diện (logo) — ý-tưởng
- **HUMAN-ONLY** (cần founder tự thiết-kế hoặc thuê thiết-kế — AI không tự tạo file ảnh cuối để đăng thay bạn).
- Ý-tưởng nhanh, không cần thuê designer: **wordmark chữ "ĐơnThật"** trên nền màu đặc (không dùng ảnh cá-nhân/chân-dung làm logo Page thương-hiệu để tránh nhầm profile cá-nhân), phối màu gợi tin-cậy + hành-động: **xanh dương/xanh lá đậm + trắng**, có-thể ghép icon dấu-tick (✓) hoặc hộp (📦) nhỏ cạnh chữ để gợi "đơn hàng thành-công".
- Kích-thước khuyến-nghị: vuông, tối-thiểu 180×180px, tối-đa 2048×2048px (Facebook hiển-thị tròn, tránh đặt chữ/chi-tiết quan-trọng sát viền).
- Công-cụ nhanh miễn-phí: Canva (mẫu "logo chữ"/"wordmark logo", tìm template có sẵn, đổi chữ + màu).

### 3.8 Ảnh bìa (cover photo) — ý-tưởng thông-điệp
- **HUMAN-ONLY** (thiết-kế/chọn ảnh — AI không tự tạo file cuối).
- Thông-điệp chính giữa ảnh: **"Kit Lên Đơn Đầu Tiên — 179k — Có đơn ngay trong buổi đầu"** (giữ đúng tinh-thần "rẻ + nhanh + không cần học" theo `positioning.md`, tránh số-liệu chưa-kiểm-chứng như "% tăng đơn").
- Có-thể ghép mockup ảnh chụp-màn-hình các template/checklist thật (làm thật hơn "banner quảng-cáo suông").
- Kèm dòng nhỏ góc dưới: `donthat.vercel.app`.
- Kích-thước khuyến-nghị 2026: **820×360px** (an-toàn cho cả desktop 820×312 và mobile 640×360 — đặt nội-dung quan-trọng ở vùng giữa, tránh 2 mép và góc dưới-trái vì ảnh đại-diện đè lên đó).

### 3.9 Thông-tin liên-hệ
- **Email hỗ-trợ:** `[cần CEO xác-nhận]` — cân-nhắc dùng email cá-nhân hiện có hay tạo 1 email riêng cho brand (vd `donthat.support@gmail.com`) để tách bạch, chuyên-nghiệp hơn khi khách liên-hệ khiếu-nại/hỏi-hàng.
- **Zalo:** `[cần CEO cung-cấp số Zalo dùng công-khai]` — nên là số đã có Zalo OA hoặc ít-nhất số Zalo cá-nhân sẵn-sàng nhận tin từ khách lạ.
- **Địa-chỉ:** vì là cá-nhân kinh-doanh online, không có cửa-hàng vật-lý → **để trống mục địa-chỉ** hoặc chọn "Chỉ phục-vụ online (Service area business / Online only)" nếu Facebook hỏi — không bắt-buộc điền địa-chỉ nhà riêng công-khai.
- **Website:** `donthat.vercel.app` (điền đúng vào mục Website trong About).

---

## 4. BƯỚC 2 — 5 bài đăng SEED (đăng TRƯỚC khi bật ads)

**Vì sao cần seed trước:** Page vừa tạo mà chạy ads ngay thường bị khách click vào thấy "Page trống, 0 bài đăng, 0 like" → giảm tin-cậy, giảm tỷ-lệ chuyển-đổi, và Meta cũng đánh-giá thấp Page mới hoàn-toàn không hoạt-động khi xét-duyệt quảng-cáo. Đăng **5 bài dưới đây cách nhau vài giờ đến 1 ngày** (không đăng dồn 1 lúc) trước khi qua BƯỚC 3.

Nội-dung dưới đây là **bản text/ảnh copy-dán được ngay** — nếu founder đã quay xong video theo `D1-03-content-scripts.md` kịch-bản tương-ứng thì đăng kèm video sẽ tốt hơn; nếu chưa quay kịp, cứ đăng bản text+ảnh trước để Page không trống, quay video bổ-sung sau (quay video là **HUMAN-ONLY**, AI chỉ soạn caption).

### Post 1 — Bài giới-thiệu Kit (bài đầu tiên trên Page)
**Nội-dung:**
```
Xin chào 👋 Đây là ĐơnThật.

Mình làm ra Kit Lên Đơn Đầu Tiên sau khi thấy rất nhiều người mới mở shop
TikTok Shop/Shopee rơi vào tình-trạng: đăng 5-10 sản-phẩm xong... im-lìm.
Không biết viết listing sao cho đúng, không biết quay video bán hàng bắt
đầu từ đâu, không biết làm sao để có đơn đầu tiên.

Kit gồm 5 phần dùng ngay: checklist khởi-động shop, template listing chuẩn
sàn, script quay video bán hàng, checklist chốt đơn & tránh hoàn, lịch
content 30 ngày. 179.000đ, mua 1 lần, nhận file qua email ngay sau khi
thanh-toán.

Không phải khóa học dài dòng — là bộ công-cụ điền-sẵn, làm được trong
vài giờ. Kết-quả tùy sản-phẩm và cách bạn triển-khai, mình không cam-kết
số đơn cụ-thể.

👉 Xem chi-tiết: donthat.vercel.app

#ĐơnThật #TikTokShop #Shopee #banhangonline
```
**Gợi-ý hình:** ảnh mockup bộ Kit (chụp-màn-hình 5 phần trong 1 khung ảnh ghép) hoặc ảnh cover Page thu nhỏ.

### Post 2 — rút từ kịch-bản #1 (viết mô-tả sản-phẩm hàng-loạt)
**Nội-dung:**
```
Đăng 20 sản-phẩm mà mô-tả y-chang nhau, khách lướt qua luôn? 😩

Mình từng vậy — nhập 20 mẫu áo mới, ngồi viết mô-tả từng cái, hết ý sau
sản-phẩm thứ 5, viết đại cho xong. Kết-quả: mô-tả nhạt, chẳng ai click.

Trong Kit Lên Đơn Đầu Tiên có sẵn template listing chuẩn sàn — điền tên
sản-phẩm + 2-3 đặc-điểm vào là ra ngay mô-tả bán-hàng có hook, không lặp
y-chang giữa các sản-phẩm, không mất cả buổi ngồi nghĩ.

👉 Kit đầy-đủ: donthat.vercel.app

#TikTokShop #Shopee #viếtmôtảsảnphẩm
```
**Gợi-ý hình:** ảnh chụp-màn-hình before/after 1 đoạn mô-tả sản-phẩm (bản cũ khô-khan vs bản dùng template).

### Post 3 — rút từ kịch-bản #4 (viết caption/quảng-cáo bán hàng)
**Nội-dung:**
```
Ngồi cắn bút nghĩ caption bán hàng hơn nửa tiếng mà vẫn chưa ra chữ nào? ✍️

Gõ rồi xoá, gõ rồi xoá — cảm-giác quen không?

Trong Kit có công-thức viết caption 3 phần (hook - lợi-ích - kêu-gọi hành-
động) — cứ theo khung đó điền vào, ra ngay vài phương-án caption trong ít
phút, chọn cái ưng nhất rồi chỉnh vài chữ cho đúng giọng shop của bạn.

👉 Lấy Kit: donthat.vercel.app

#captionbánhàng #TikTokShop #Shopee
```
**Gợi-ý hình:** ảnh điện-thoại đang gõ caption dở-dang, hoặc slide "công-thức 3 phần" dạng infographic đơn-giản.

### Post 4 — rút từ kịch-bản #10 (trả-lời "inbox giá" tràn-ngập)
**Nội-dung:**
```
Dưới mỗi bài đăng: "ib mình giá ạ" x50 lần? 😵

Ngồi mở từng inbox trả lời riêng-lẻ, vừa mất thời-gian vừa dễ sót khách.

Kit Lên Đơn Đầu Tiên có sẵn mẫu câu trả-lời-nhanh chuẩn, kèm cách hướng-
dẫn khách bấm thẳng vào link xem giá/đặt hàng — giảm hẳn thời-gian gõ tay
từng người mà khách vẫn cảm-thấy được trả-lời tử-tế.

👉 donthat.vercel.app

#Shopee #TikTokShop #chốtđơn
```
**Gợi-ý hình:** ảnh chụp-màn-hình (làm mờ tên thật) 1 loạt comment "ib giá" lặp-lại, tạo sự đồng-cảm ngay từ hình.

### Post 5 — tặng lead-magnet (Bộ 20 Prompt AI miễn-phí)
**Nội-dung:**
```
Tặng miễn-phí: Bộ 20 Prompt AI cho chủ shop bán hàng online 🎁

20 prompt copy-paste thẳng vào ChatGPT/Claude (bản miễn-phí dùng được) —
viết mô-tả sản-phẩm, caption bán hàng, trả-lời tin-nhắn khách, xử-lý
bình-luận tiêu-cực... không cần biết "prompt" là gì, cứ điền chỗ trống
rồi dán vào là có bản-nháp trong 30 giây.

Đây là quà tặng miễn-phí, không kèm điều-kiện mua Kit. Nếu sau này bạn
cần thêm bộ công-cụ đầy-đủ để lên đơn đầu-tiên, ĐơnThật có Kit 179k ở
donthat.vercel.app.

👉 Nhận bộ prompt miễn-phí, để lại email tại: donthat.vercel.app

#quàtặngmiễnphí #AIchobánhàng #TikTokShop
```
**Gợi-ý hình:** ảnh bìa "20 Prompt AI" dạng ebook cover đơn-giản (có-thể làm nhanh trên Canva).

> **Trước khi đăng bất-kỳ bài nào trong 5 bài trên:** chạy qua checklist `10-thuc-thi-compliance-4-ad-review.md` mục 4 (không claim số chưa kiểm-chứng, không "giàu nhanh", đã có disclosure nếu cần) — 5 bài trên đã tuân theo nhưng vẫn nên tự rà lại 1 lượt trước khi bấm Đăng.

---

## 5. BƯỚC 3 — Business Suite + Ad Account + Pixel

> Nếu đã tạo Page qua **Cách B** (mục 2) thì Page đã nằm sẵn trong Business Portfolio — bỏ qua bước "thêm Page vào Business Manager", làm thẳng từ bước tạo Ad Account.

1. **Vào Meta Business Suite:** `business.facebook.com`, đăng-nhập bằng tài-khoản cá-nhân đã tạo Page.
2. **(Nếu tạo Page qua Cách A — cần thêm Page vào Business Manager):** vào biểu-tượng bánh-răng **Cài-đặt doanh-nghiệp (Business Settings)** ở menu trái → **Tài-khoản (Accounts) → Trang (Pages)** → **Thêm (Add)** → chọn Page "ĐơnThật" đã tạo.
3. **Tạo Ad Account:** trong Business Settings → **Tài-khoản (Accounts) → Tài-khoản quảng-cáo (Ad accounts)** → **Thêm (Add) → Tạo tài-khoản quảng-cáo mới (Create a new ad account)** → đặt tên (vd "ĐơnThật Ads"), chọn múi-giờ **(GMT+7) Việt Nam** và đơn-vị tiền-tệ **VND** (chọn đúng ngay từ đầu — **Meta KHÔNG cho đổi múi-giờ/tiền-tệ sau khi Ad Account đã tạo**, sai là phải tạo tài-khoản mới).
4. **Tạo Pixel & liên-kết Ad Account:** vào **Tất-cả công-cụ (All tools) → Trình quản-lý sự-kiện (Events Manager)** → **Kết-nối nguồn dữ-liệu (Connect data sources) → Web → Meta Pixel → Kết-nối** → đặt tên Pixel (vd "ĐơnThật Website Pixel") → chọn gắn Pixel này với Ad Account vừa tạo ở bước 3.
5. **Lấy Pixel ID + đối-chiếu code đã có sẵn:** copy **Pixel ID** vừa tạo, đối-chiếu với đoạn code Pixel đã cài sẵn (nhưng đang comment) trên `donthat.vercel.app` theo `products.md`/`10-thuc-thi-ads-launch-plan.md` — thay đúng Pixel ID thật rồi bỏ comment để Pixel bắt đầu ghi-nhận PageView/InitiateCheckout/Purchase (việc sửa code — nếu founder không tự làm, đây là việc kỹ-thuật cần người phụ-trách web, không phải phần Facebook UI).
6. **Kiểm Pixel sống:** cài extension **Meta Pixel Helper** (Chrome) → mở `donthat.vercel.app` → xác-nhận Pixel Helper hiện xanh, bắt được sự-kiện PageView.
7. **Thêm phương-thức thanh-toán (HUMAN-ONLY, CHI-TIỀN — AI KHÔNG tự làm bước này):** Business Settings → **Thanh-toán (Payment) → Phương-thức thanh-toán (Payment methods) → Thêm phương-thức thanh-toán** → nhập thẻ **Visa/Mastercard debit hoặc credit** (loại phổ-biến, dễ mở tại các ngân-hàng VN như Vietcombank/Techcombank/ACB). MoMo/ZaloPay hỗ-trợ trực-tiếp cho Ad Account VN **chưa xác-nhận chắc-chắn** — thẻ Visa/Mastercard là lựa-chọn an-toàn nhất hiện-tại.

### Checklist "đủ điều-kiện chạy ads" (tự kiểm trước khi bấm Publish chiến-dịch)
- [ ] Tài-khoản Facebook cá-nhân đã xác-minh số điện-thoại, hoạt-động **≥10 ngày** trước khi tạo/chạy ads (giảm rủi-ro bị coi tài-khoản mới đáng-ngờ — theo `10-thuc-thi-ads-launch-plan.md` mục 8).
- [ ] Page "ĐơnThật" đã có ảnh đại-diện + ảnh bìa + About đầy-đủ + ít-nhất 5 bài đăng (BƯỚC 2).
- [ ] Page nằm trong Business Portfolio, đúng chủ-sở-hữu.
- [ ] Ad Account đã tạo đúng múi-giờ GMT+7 / tiền-tệ VND.
- [ ] Pixel đã tạo, liên-kết đúng Ad Account, Pixel Helper xác-nhận sống trên `donthat.vercel.app`.
- [ ] Đã thêm ít-nhất 1 phương-thức thanh-toán hợp-lệ (thẻ Visa/Mastercard).
- [ ] (Nếu Meta yêu-cầu) đã hoàn-tất xác-minh danh-tính cá-nhân/doanh-nghiệp khi được nhắc — xem mục 6.

---

## 6. Lưu-ý tránh khoá Page / tài-khoản ads mới

- **KHÔNG bật ads ngay lập-tức sau khi vừa tạo Page/Ad Account.** Nên có vài ngày hoạt-động thật trước: đăng bài (BƯỚC 2), tự vào Page tương-tác, mời vài người quen like/theo-dõi thật — tránh mẫu-hình "0 hoạt-động → chi tiền ads ngay" dễ bị hệ-thống Meta gắn cờ review.
- **Không dùng công-cụ giả-lập/anti-detect browser, proxy, mua Page/tài-khoản có sẵn, hay tạo tương-tác ảo** để "làm nóng" nhanh — đây là hành-vi vi-phạm Điều-khoản Meta, rủi-ro khoá vĩnh-viễn cao hơn là giúp-ích; cách an-toàn nhất vẫn là hoạt-động thật, chậm mà chắc.
- **Ngân-sách ads:** khi CEO duyệt chi tiền (cổng NEED-APPROVAL riêng), nên bắt-đầu ngân-sách nhỏ rồi tăng dần từ-từ (không tăng gấp-đôi/nhảy-vọt trong 1 ngày) — hệ-thống Meta cần thời-gian "học" tài-khoản mới, tăng đột-ngột dễ bị coi bất-thường.
- **Nội-dung tuân-thủ chính-sách quảng-cáo Meta:** không chỉ tuân Luật Quảng-cáo VN (đã có `10-thuc-thi-compliance-4-ad-review.md`) mà còn phải qua được **Meta Ad Policies** riêng — tránh ngôn-từ giật-gân/before-after phóng-đại, tránh landing yêu-cầu quá nhiều thông-tin cá-nhân không cần-thiết, đảm-bảo landing có chính-sách bảo-mật/hoàn-tiền rõ-ràng (đã có `legal-chinh-sach-hoan-tien.md`, `legal-chinh-sach-rieng-tu.md` trong `03-Outputs/`) — Meta thường quét landing tự-động, thiếu các trang chính-sách này dễ bị từ-chối duyệt quảng-cáo.
- **Xác-minh danh-tính nếu Meta đòi hỏi:** với sản-phẩm giáo-dục/công-cụ thông-thường như Kit Lên Đơn Đầu Tiên, Meta **thường KHÔNG** bắt xác-minh danh-tính nghiêm-ngặt như nhóm tài-chính/tín-dụng (chính-sách xác-minh identity 2026 hiện siết chủ-yếu ở quảng-cáo tài-chính/ngân-hàng/tiền-ảo/bảo-hiểm). Tuy-nhiên nếu tài-khoản ads bị Meta yêu-cầu xác-minh (thường xảy ra khi chi ngân-sách lớn/nhanh hoặc bị flag ngẫu-nhiên), founder cần chuẩn-bị sẵn **CCCD/CMND thật** để upload khi được yêu-cầu — đây là **HUMAN-ONLY** (KYC, AI không thể làm thay).
- **1 thẻ thanh-toán/tài-khoản là đủ** — không cần gắn nhiều thẻ cùng lúc, tránh làm hệ-thống nghi-ngờ.

---

## 7. Checklist hoàn-tất trước khi bật ads

- [ ] **Page "ĐơnThật" đã tạo**, đúng category, có username, About đầy-đủ, nút CTA trỏ `donthat.vercel.app`.
- [ ] **Ảnh đại-diện + ảnh bìa** đã thiết-kế và đăng (HUMAN-ONLY — founder/thiết-kế tự làm).
- [ ] **Thông-tin liên-hệ** (email hỗ-trợ, Zalo) đã điền — **cần CEO xác-nhận** email/Zalo dùng công-khai.
- [ ] **5 bài đăng SEED** (mục 4) đã đăng, cách nhau vài giờ–1 ngày, không dồn 1 lúc.
- [ ] Page đã tồn-tại/hoạt-động **ít-nhất vài ngày** trước khi bật ads (mục 6).
- [ ] **Business Suite** đã tạo, Page nằm trong Business Portfolio.
- [ ] **Ad Account** đã tạo đúng múi-giờ GMT+7 / VND.
- [ ] **Pixel** đã tạo, gắn đúng Pixel ID thật vào code `donthat.vercel.app`, Pixel Helper xác-nhận sống.
- [ ] **Phương-thức thanh-toán** đã thêm (HUMAN-ONLY, chi-tiền — CEO/founder tự thực-hiện, KHÔNG phải AI).
- [ ] Landing đã có đủ **chính-sách hoàn-tiền + bảo-mật** hiển-thị công-khai (đã có sẵn ở `03-Outputs/`, cần đăng lên `donthat.vercel.app` nếu chưa).
- [ ] Đã rà `10-thuc-thi-compliance-4-ad-review.md` cho MỌI bài đăng/creative trước khi publish (kể cả bài seed lẫn ads thật).
- [ ] Ngân-sách + việc bấm "Publish" chiến-dịch ads thật = **cổng NEED-APPROVAL riêng của CEO** (ranh-giới cứng chi-tiền) — checklist này chỉ chuẩn-bị hạ-tầng, KHÔNG bao-gồm quyết-định chi ngân-sách.

---

## Việc-cần-founder-tự-làm (ngoài phạm-vi AI-AUTO)

| Việc | Vì sao AI không tự làm |
|---|---|
| Đăng-nhập Facebook, bấm các nút tạo Page/Business Suite/Ad Account/Pixel | Cần tài-khoản thật, phiên đăng-nhập thật của founder — AI không có quyền truy-cập trình-duyệt Facebook của founder |
| Thiết-kế ảnh đại-diện (logo) + ảnh bìa | Cần công-cụ thiết-kế (Canva) + gu thẩm-mỹ founder chọn — AI chỉ gợi-ý ý-tưởng/thông-điệp |
| Quay 10 video theo kịch-bản đã có | HUMAN-ONLY theo `D1-03-content-scripts.md` — cần founder xuất-hiện |
| Xác-nhận email hỗ-trợ / số Zalo dùng công-khai | Thông-tin định-danh cá-nhân — cần CEO quyết-định dùng số/email nào |
| Thêm thẻ Visa/Mastercard vào Business Suite | Chạm ranh-giới cứng **chi-tiền** — luôn cần CEO/founder tự thao-tác |
| Upload CCCD/CMND nếu Meta yêu-cầu xác-minh danh-tính | KYC — dữ-liệu định-danh, AI không có và không được xử-lý thay |
| Bấm "Publish" chiến-dịch ads thật (chi ngân-sách) | Ranh-giới cứng chi-tiền — luôn cần cổng NEED-APPROVAL của CEO |

---

## Nguồn tham-khảo (đối-chiếu 11/07/2026)
- [Create a Facebook Page | Facebook Help Centre](https://www.facebook.com/help/104002523024878)
- [How to Create a Facebook Page | Meta Business Help Center](https://www.facebook.com/business/help/1199464373557428)
- [How to Create a Meta Business and Facebook Ad Account — Leadsie](https://www.leadsie.com/blog/how-to-create-meta-business-manager-and-facebook-ad-account)
- [Add an ad account to your business portfolio in Meta Business Suite | Meta Business Help Centre](https://www.facebook.com/business/help/915885887059947)
- [How to Create an Ad Account in Meta Ads Manager | Meta Business Help Center](https://www.facebook.com/business/help/407323696966570)
- [Set up and install the Meta Pixel | Meta Business Help Center](https://www.facebook.com/business/help/952192354843755)
- [How to Generate Meta Pixel Code in Events Manager? — digitalbikana](https://blog.digitalbikana.com/how-to-generate-meta-pixel-code-in-events-manager/)
- [Add an action button to your Facebook Page | Facebook Help Centre](https://www.facebook.com/help/977869848936797)
- [Facebook Page profile picture and cover photo dimensions | Facebook Help Center](https://www.facebook.com/help/125379114252045)
- [Vietnam | Meta Business Help Center](https://www.facebook.com/business/help/156344978275918)
- [Accepted payment options for Meta Ads | Meta Business Help Center](https://www.facebook.com/business/help/212763688755026)
- [Meta Identity Verification for Financial Ads 2026 — AuditSocials](https://www.auditsocials.com/blog/meta-identity-verification-financial-advertisers-2026)
- [About Business Verification in Meta Business Suite | Meta Business Help Center](https://www.facebook.com/business/help/1095661473946872)

> ⚠️ Facebook/Meta thường-xuyên thay đổi vị-trí nút/tên nhãn trong giao-diện (VD: "Business Manager" đổi tên/gộp dần vào "Meta Business Suite" qua các năm). Nếu vào thời-điểm founder thực-hiện mà giao-diện khác mô-tả ở trên, **logic thứ-tự các bước (Page → Business Suite → Ad Account → Pixel → Thanh-toán) vẫn đúng** — tìm đúng chức-năng theo tên gần-giống thay vì tên chính-xác từng chữ.
