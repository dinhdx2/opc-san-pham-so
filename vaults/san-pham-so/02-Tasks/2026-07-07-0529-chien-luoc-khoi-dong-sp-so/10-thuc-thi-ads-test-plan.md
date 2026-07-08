# 10-thực-thi — Kế-hoạch Ads Test (Meta/TikTok) — CHỈ chạy SAU khi có tín-hiệu WTP

> **TL;DR:** Đây là kế-hoạch CHỜ SẴN, KHÔNG phải lệnh chạy ngay — founder yêu-cầu hỗ-trợ chiến-lược ads, nhưng nguyên-tắc CỨNG (Red-team, đã chốt ở `decisions-log.md` #5) là: **với audience=0 và runway <3 tháng, đốt ads lạnh TRƯỚC KHI validate WTP qua outreach/presell là RỦI-RO #1 cháy vốn mà không có tín-hiệu.** Tài-liệu này nêu: điều-kiện tiên-quyết PHẢI đạt trước khi tiêu 1đ ads, ngân-sách test nhỏ đề-xuất, cấu-trúc campaign Meta/TikTok cho lead-magnet, chỉ-số đọc, và ngưỡng scale/kill. Việc **thực-sự bấm chạy ads (chi tiền)** luôn là cổng NEED-APPROVAL của CEO — tài-liệu này chỉ chuẩn-bị sẵn để khi đủ điều-kiện, CEO duyệt là chạy được ngay, không mất thời-gian soạn lúc nước-rút.

**Neo:** `decisions-log.md` 2026-07-07 (ràng-buộc Red-team #5) · `03-clarification.md` lượt 2 (runway <3 tháng, cần hỗ-trợ ads) · `10-thuc-thi-protocol-do-luong.md` (định-nghĩa CTR/CPL/CAC, bảng ngưỡng GO/NO-GO 3 kịch-bản vốn) · `D1-03-outreach-playbook.md` (kênh CHÍNH chạy trước) · `10-thuc-thi-compliance-4-ad-review.md` (checklist bắt-buộc trước publish bất-kỳ ads nào) · `budget.md` (vốn ~50tr, Đợt-1 ~20-30%).

---

## 0. CẢNH-BÁO RÕ (đọc trước khi làm bất-kỳ bước nào dưới đây)

> **Đốt ads lạnh trước khi validate = rủi-ro #1 với runway <3 tháng.** Founder đã xác-nhận (`03-clarification.md`): full-time, không thu-nhập khác, runway sinh-hoạt dưới ngưỡng an-toàn 60-90 ngày. Ads lạnh (nhắm vào người chưa biết DN, chưa qua sàng-lọc tự-nhiên như outreach) tốn tiền THẬT ngay cả khi target sai — nếu chạy trước khi biết ai thật-sự cần sản-phẩm, tiền mất mà KHÔNG đổi lại được tín-hiệu WTP tin-cậy (vì chưa biết offer/giá/hook nào đúng, ads chỉ khuếch-đại cái đã có chứ không tự tìm ra cái đúng). Thứ-tự bắt-buộc: **outreach + presell trước → có tín-hiệu WTP dương → ads test NHỎ để nhân-rộng cái đã chứng-minh hoạt-động, không phải để "đi tìm" tín-hiệu từ đầu.**

---

## 1. Điều-kiện TIÊN-QUYẾT — PHẢI đạt ĐỦ trước khi tiêu 1đ ads

Tất-cả các điều-kiện dưới đây phải ✅ trước khi CEO duyệt ngân-sách ads test (không được bỏ-qua điều nào):

| # | Điều-kiện | Vì sao bắt-buộc | Trạng-thái hiện-tại (08/07/2026) |
|---|---|---|---|
| 1 | Đã có **≥ 1-3 đơn tripwire/presell thật** (49-99k) từ **người LẠ** (không quen founder) qua outreach — theo `D1-03-outreach-playbook.md` | Chứng-minh có người thật-sự móc ví, không chỉ "thích ý-tưởng" | Chưa (outreach chưa chạy — chờ CEO chốt beachhead cụ-thể xong mới triển-khai) |
| 2 | Đã hoàn-thành **≥ 5 buổi phỏng-vấn khám-phá khách** (`10-thuc-thi-khampha-khach.md`) với tín-hiệu ĐỦ MẠNH (không YẾU) | Biết đúng hook/pain/ngôn-ngữ để viết creative ads — chạy ads với hook sai = đốt tiền chắc-chắn | Chưa |
| 3 | **5 văn-bản compliance đã CEO/luật-sư duyệt** (EULA, content rights, privacy, ad-review, refund SOP) | Ads publish mà chưa qua ad-review checklist = rủi-ro pháp-lý (Luật Quảng-cáo, "giàu nhanh") | 5 văn-bản đã DRAFT (DONE ở `10-run-state.md`), CHỜ luật-sư rà (0-04f) |
| 4 | **Landing/presell + tracking (UTM/pixel) đã sống** | Không có nơi đo CTR/CPL/conversion thì chạy ads vô-nghĩa | Chờ CEO chọn platform + domain (0-05b) |
| 5 | **Runway sinh-hoạt founder đã có phương-án mitigation** (dù <3 tháng) — CEO đã xác-nhận chấp-nhận rủi-ro G0 và có kế-hoạch dự-phòng | Ads test dù nhỏ vẫn là chi tiêu thêm trên nền runway đã mỏng | CEO đã chọn đường lean fast-validate (chấp-nhận rủi-ro có kiểm-soát) — vẫn cần theo-dõi sát |
| 6 | **Tín-hiệu định-tính dương** ở mục (c) `10-thuc-thi-protocol-do-luong.md`: đa-số buyers là người lạ, refund thấp, có ít-nhất 1 người hỏi mua hero/nâng-cấp | Ads chỉ nên nhân-rộng cái ĐÃ chứng-minh hoạt-động | Chưa đo được (chưa có outreach chạy) |

**→ Kết-luận hiện-tại: CHƯA đủ điều-kiện chạy ads. Ưu-tiên tuyệt-đối: outreach + phỏng-vấn khám-phá trước.** Mục 2-6 dưới đây chuẩn-bị SẴN để khi đủ điều-kiện, chạy được ngay.

---

## 2. Ngân-sách test nhỏ đề-xuất `[đề-xuất — cần chốt cùng CEO + 03-finance]`

### 2.1 Đối-chiếu 2 nguồn số trong Brain (cần CEO chốt cách hiểu đúng)
- `budget.md`: Đợt-1 VALIDATE = **~20-30% của tổng vốn ~50tr = ~10-15 triệu**, dùng cho **TOÀN-BỘ** landing + lead-magnet + presell + đo WTP (KHÔNG riêng ads).
- `10-thuc-thi-protocol-do-luong.md` bảng (b), dòng "kịch-bản vốn 50 triệu": mô-tả **~10-15 triệu dành RIÊNG cho ads test** để so kênh/creative — con-số này áp cho kịch-bản tổng vốn Đợt-1 = 50 triệu, KHÁC với cách đọc ở `budget.md` (nơi 50tr là TỔNG vốn cả DN, Đợt-1 chỉ 20-30% của nó).
- **Hai cách đọc này KHÔNG khớp nhau về quy-mô** — đây là điểm CEO/03-finance cần chốt lại. Tài-liệu này khuyến-nghị dùng cách đọc THẬN-TRỌNG hơn (an-toàn hơn cho runway <3 tháng).

### 2.2 Đề-xuất cụ-thể (cách đọc thận-trọng)
| Giai-đoạn | Ngân-sách ads `[đề-xuất]` | Điều-kiện mở |
|---|---|---|
| **Tranche 1 — Test creative/kênh siêu-nhỏ** | **1.000.000 – 2.000.000đ TỔNG** (không phải/ngày) | Sau khi đạt ĐỦ mục 1 (≥1-3 đơn tripwire người lạ từ outreach) |
| **Tranche 2 — Mở-rộng nếu Tranche 1 có tín-hiệu** | Thêm tối-đa **3.000.000 – 5.000.000đ** (tổng dùng ads Đợt-1 KHÔNG vượt **~5-7 triệu**, tức <15% tổng vốn 50tr) | CPL/CTR Tranche 1 đạt ngưỡng mục 4, có ≥1 đơn presell từ ads |
| **TUYỆT-ĐỐI KHÔNG chạy** | >7 triệu ads trong Đợt-1 | Vượt mức này đi ngược nguyên-tắc "validate rẻ, giữ vốn cho ĐỢT-2 sản-xuất hero" |

> Lý-do chọn mức thấp: (1) outreach gần 0đ đã là kênh chính, ads chỉ để KIỂM-TRA xem kênh trả-phí có khuếch-đại được cái outreach đã chứng-minh hay không — không cần ngân-sách lớn để trả lời câu hỏi này; (2) giữ ≥70-80% vốn 50tr cho ĐỢT-2 sản-xuất hero (chỉ chạy sau GO); (3) runway <3 tháng không cho phép thử-sai đắt.

---

## 3. Cấu-trúc campaign (chuẩn-bị sẵn, chưa bật)

### 3.1 Meta (Facebook/Instagram) Ads
- **Mục-tiêu chiến-dịch:** Leads (Lead generation) hoặc Traffic về landing lead-magnet — KHÔNG chọn Conversions/Purchase ngay (chưa đủ dữ-liệu để thuật-toán tối-ưu đúng, dễ tốn ngân-sách học máy vô-ích ở quy-mô nhỏ).
- **Ad set targeting:** sở-thích/hành-vi liên-quan "kinh-doanh online", "Shopee", "TikTok Shop", "quản-lý bán hàng", "khởi-nghiệp nhỏ" + độ tuổi 22-45, vị-trí VN (thu hẹp theo thành-phố nếu ngân-sách quá nhỏ để chạy cả nước hiệu-quả). Có-thể test thêm targeting "lookalike" từ danh-sách email/SĐT thu được qua outreach (nếu đủ ≥100 người và đã có đồng-ý dùng dữ-liệu).
- **Creative:** tái-dùng kịch-bản/video ở `D1-03-content-scripts.md` (đã có sẵn, không cần dựng riêng cho ads) — ưu-tiên video có tương-tác organic tốt nhất làm creative test đầu-tiên.
- **Ngân-sách/ngày:** mức kỹ-thuật tối-thiểu Meta cho chiến-dịch tối-ưu click/conversion là **khoảng 5 USD/ngày** (~125.000đ/ngày theo tỷ-giá tham-khảo ~25.000đ/USD `[cần xác-minh tỷ-giá ngày chạy]`); mức "thực-tế đề-xuất bởi agency" để thoát learning-phase tốt hơn là 50-150 USD/ngày — **QUÁ CAO so với ngân-sách Đợt-1 của DN này, KHÔNG áp-dụng**. Đề-xuất chạy **50.000-150.000đ/ngày** trong 5-7 ngày/đợt test `[đề-xuất — cần chốt]`, chấp-nhận thuật-toán chưa tối-ưu hoàn-toàn — mục-tiêu là tín-hiệu ĐỊNH-HƯỚNG, không phải hiệu-suất tối-đa.
- Nguồn benchmark ngân-sách: [Meta Ads Minimum Budget 2026 — get-ryze.ai](https://www.get-ryze.ai/blog/meta-ads-minimum-budget-guide-starting-budget), [Meta Ads Minimum Daily Budget 2026 — stackmatix.com](https://www.stackmatix.com/blog/meta-ads-minimum-daily-budget-2026) — **đây là benchmark THỊ-TRƯỜNG CHUNG (chủ-yếu US/global), KHÔNG có số riêng VN, cần đối-chiếu thực-tế khi vào Ads Manager VN**.

### 3.2 TikTok Ads
- **Mục-tiêu:** Traffic hoặc Lead Generation (Instant Form) về landing/lead-magnet.
- **Ad group targeting:** tương-tự Meta, thêm sở-thích "TikTok Shop seller", "kinh-doanh nhỏ", nhắm theo hành-vi tương-tác với video bán-hàng/kinh-doanh.
- **Creative:** dùng trực-tiếp video content-led đã quay (native TikTok content luôn hiệu-quả hơn creative "quá quảng-cáo" trên nền-tảng này).
- **Ngân-sách tối-thiểu nền-tảng (VN):** theo nguồn tổng-hợp, mức sàn ở cấp **ad-group là ~500.000đ/ngày** (~20 USD), cấp **campaign ~1.250.000đ/ngày** (~50 USD); ngân-sách trọn-đời (lifetime budget) tối-thiểu ~12.500.000đ (~500 USD) — **các mức này khá cao so với Tranche 1 (1-2tr tổng) của DN**, nên Tranche 1 khuyến-nghị dùng **TikTok "Boost post" (đẩy bài tự-nhiên)** thay vì mở Ads Manager đầy-đủ, vì Boost post không bị ràng mức sàn ad-group/campaign nói trên và cho-phép chi rất nhỏ (vài chục-trăm nghìn/bài) để test hook trước khi cam-kết ngân-sách Ads Manager chính-thức ở Tranche 2.
- Nguồn: [TikAdSuite — Minimum Budget for TikTok Ads 2026](https://tikadsuite.com/blog/minimum-budget-for-tiktok-ads/), [stackmatix.com — TikTok Ads Minimum Daily Budget 2026](https://www.stackmatix.com/blog/tiktok-ads-minimum-daily-budget-2026) — **lưu-ý nguồn ghi rõ nhà quảng-cáo ở VN nên tự xác-nhận mức sàn mới-nhất trực-tiếp trong TikTok Ads Manager vì có-thể thay-đổi theo tỷ-giá** `[cần xác-minh tại thời-điểm chạy]`.

### 3.3 Google Ads
- Không ưu-tiên ở Đợt-1 (search-intent phù ICP "chủ shop online tìm giải-pháp AI" chưa đủ volume tìm-kiếm cụ-thể để nhắm hiệu-quả với ngân-sách nhỏ) — để dành đánh-giá lại ở ĐỢT-2 nếu cần đa-kênh hoá sau PMF.

---

## 4. Chỉ-số đọc (dùng chung định-nghĩa với `10-thuc-thi-protocol-do-luong.md` mục a)

| Chỉ-số | Công-thức | Ngưỡng đọc nhanh Tranche 1 `[đề-xuất — cần chốt]` |
|---|---|---|
| **CTR (click-through rate)** | `clicks / impressions × 100` | Nếu CTR quá thấp so với video organic tốt nhất (vd giảm >50%) → hook ads không khớp targeting, dừng sớm thay vì chờ hết ngân-sách |
| **CPL (cost per lead = chi-phí mỗi opt-in)** | `spend / số opt-in mới` | So-sánh với CAC=0 của outreach (kênh chính) — nếu CPL ads cao hơn nhiều lần "chi-phí cơ-hội" outreach mà không rút ngắn đáng-kể thời-gian, cân-nhắc dồn lại outreach |
| **Cost/presell (= CAC ads riêng cho kênh ads)** | `spend / số đơn tripwire đến từ ads (theo UTM)` | Đối-chiếu ngưỡng CAC tổng ở bảng (b) `10-thuc-thi-protocol-do-luong.md` theo đúng kịch-bản vốn |
| **Organic vs paid (đã có sẵn trong tracker)** | Tỷ-lệ đơn/opt-in từ ads so với outreach/organic | Đơn từ ads dễ "mua" traffic không đại-diện — luôn đối-chiếu tín-hiệu định-tính mục (c) trước khi tin số ads đơn-lẻ |

> Ghi mọi số ads vào **cùng 1 tracker** `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv` — không tạo bảng riêng, để so-sánh trực-tiếp với outreach/organic trên cùng nền `clicks`.

---

## 5. Ngưỡng SCALE / KILL cho ads test

- **SCALE (tăng ngân-sách sang Tranche 2, rồi mở dần cho ĐỢT-2):** CTR ads ≥ 70% CTR trung-bình của content organic tốt nhất VÀ có ≥1 đơn presell/tripwire với CAC (cost/presell) thấp hơn AOV × biên gộp ước-tính (LTV/CAC>1 sơ-bộ) VÀ tín-hiệu định-tính mục (c) protocol-do-luong.md dương.
- **GIỮ NGUYÊN mức test (không tăng thêm):** có tín-hiệu nhưng CPL/CAC ở ngưỡng biên (chưa rõ dương hay âm) — chạy thêm 1 đợt test creative khác (đổi hook, không đổi ngân-sách) trước khi quyết tăng tiền.
- **KILL (dừng ads, quay lại 100% outreach/organic):** 
  - Chi hết Tranche 1 (1-2 triệu) mà **0 đơn presell** từ ads, HOẶC
  - CPL cao gấp nhiều lần chi-phí cơ-hội outreach mà không có tín-hiệu định-tính bù (không ai hỏi thêm/lưu/chia-sẻ), HOẶC
  - Refund/complaint từ khách đến qua ads cao bất-thường so với khách từ outreach (dấu-hiệu ads "mua" sai đối-tượng).
- **Không bao giờ tăng ngân-sách ads chỉ vì "đã chi rồi, tiếc"** — mỗi tranche là 1 quyết-định độc-lập, đối-chiếu lại đủ 3 nguồn (định-lượng bảng 4 + định-tính mục (c) protocol + runway còn lại) trước khi mở tranche tiếp.

---

## 6. Compliance & ranh-giới cứng (nhắc lại)

- **TRƯỚC khi publish bất-kỳ ads nào:** chạy đầy-đủ checklist `10-thuc-thi-compliance-4-ad-review.md` (không claim "giàu nhanh", mọi số phải có nguồn, testimonial phải xin phép, minh-bạch nếu có yếu-tố tài-trợ).
- **Việc bấm nút chạy ads (chi tiền thật) LUÔN là cổng NEED-APPROVAL của CEO** — tài-liệu này chỉ là kế-hoạch/chuẩn-bị, KHÔNG phải bằng-chứng đã chạy ads. Không tự tạo tài-khoản quảng-cáo hay chi tiêu thay CEO.
- Landing/trang thu lead phải đã có **Privacy Policy + consent** (`10-thuc-thi-compliance-3-privacy.md`) và **SOP refund** (`10-thuc-thi-compliance-5-refund-sop.md`) sống TRƯỚC khi ads dẫn traffic vào presell — không được để ads chạy trước khi 2 văn-bản này go-live.

## 7. Tóm-tắt trình-tự (để CEO dễ theo-dõi)
```
Outreach + presell (D1-03-outreach-playbook.md)  →  ≥1-3 đơn tripwire người lạ + phỏng-vấn khám-phá đủ mạnh
        ↓ (ĐẠT)
5 văn-bản compliance đã duyệt + landing/tracking sống
        ↓ (ĐẠT)
CEO duyệt ngân-sách Tranche 1 (1-2 triệu, 5-7 ngày)  →  đo CTR/CPL/cost-per-presell
        ↓
SCALE (Tranche 2, tối-đa ~5-7tr tổng)  |  GIỮ NGUYÊN  |  KILL (quay lại outreach)
```
