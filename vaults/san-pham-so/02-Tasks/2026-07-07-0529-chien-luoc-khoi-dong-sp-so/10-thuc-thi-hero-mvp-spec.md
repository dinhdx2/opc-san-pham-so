# Spec Hero MVP — Bộ công cụ AI cho chủ shop bán hàng online

> **TL;DR:** Đây là **spec (bản-thiết-kế)** để founder tự sản-xuất **Hero MVP** — SP số chính bán tiền, mở-rộng từ lead-magnet 20 prompt (`03-Outputs/chien-luoc-khoi-dong-sp-so/D1-01-lead-magnet-prompt-pack-chu-shop.md`) thành gói đầy-đủ: **(a)** thư-viện 60–100 prompt phân-nhóm, **(b)** 3–5 template Notion/Sheet, **(c)** 3–5 video ngắn. Phạm-vi MVP được cắt-gọn để ra mắt trong **~1–2 tuần** kể từ ngày có cổng GO (`1-06`), phần còn lại để v2 sau PMF. Giá đề-xuất theo phễu đã chốt ở Brain: tripwire 49–99k, hero ≥299k — **CHƯA chốt số cuối, chỉ chốt được sau khi đo WTP thật qua presell** `[benchmark — chốt sau presell/WTP]`.

**Neo:** `08-execution-plan.md` mục 2.1–2.3 (ĐỢT-2 sản-xuất hero) · `10-run-state.md` bước 2-01/2-02/2-03 · `00-Brain/positioning.md` (wedge = prompt-library + template + video) · `00-Brain/products.md` (catalog 3 tầng, giá đề-xuất) · `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-01-lead-magnet-prompt-pack-chu-shop.md` (bản rút-gọn dùng làm nền mở-rộng) · `10-thuc-thi-compliance-1-eula.md`/`10-thuc-thi-compliance-2-content-rights.md` (bắt-buộc rà trước khi mở bán).

**Trạng-thái phụ-thuộc:** tài-liệu này là **SPEC chuẩn-bị trước**, KHÔNG phải lệnh sản-xuất ngay — chỉ triển-khai sau khi cổng `1-06 GO/NO-GO` (protocol đo-lường ĐỢT-1) ra kết-quả **GO**. Viết sẵn spec ngay bây-giờ để không mất thời-gian chờ khi có GO (Red-team: tốc-độ ra hero sau tín-hiệu là lợi-thế cạnh-tranh).

---

## 0. Nguyên tắc thiết kế MVP (đọc trước khi làm)

1. **Không làm lại từ đầu:** 20 prompt trong lead-magnet D1-01 là **nền gốc** của thư-viện Hero — mở-rộng/biến-thể thêm, KHÔNG viết bộ mới song-song (tốn thời-gian, dễ lệch chất-lượng/giọng-văn).
2. **Lean = MVP tối-thiểu-đủ-bán, không phải MVP-đẹp-hoàn-hảo.** Mục-tiêu ra mắt nhanh để đo PMF thật, không trau-chuốt vô-hạn trước khi có doanh-thu.
3. **Founder tự làm phần "con người":** quay video, biên-tập prompt theo trải-nghiệm phỏng-vấn khách thật (founder "thạo AI, chưa thạo shop" — cần đã phỏng-vấn ≥3–5 chủ shop thật trước khi hoàn-thiện thư-viện, để tránh viết prompt "tưởng-tượng" không đúng nỗi-đau thật). AI (Claude/ChatGPT) chỉ hỗ-trợ viết nháp — **founder biên-tập/sáng-tạo đáng-kể** trước khi bán (bắt-buộc theo EULA mục 4 — rủi-ro bản-quyền nếu 100% AI không có can-thiệp con-người).
4. **Anti-piracy đưa vào scope từ đầu**, không phải "làm sau": vì moat SP số không nằm ở file (dễ copy) mà ở audience/brand — nhưng vẫn cần rào-cản tối-thiểu (watermark cá-nhân-hoá + link tải có hạn + license key) để không mất-trắng ngay tuần đầu.
5. **Giá KHÔNG neo cứng benchmark:** số 49–99k/≥299k dưới đây là điểm khởi-đầu để test presell — giá cuối chốt theo WTP đo thật (Red-team, đã ghi ở `products.md`).

---

## 1. Phạm vi Hero MVP — 3 cấu phần

### (a) Thư viện 60–100 prompt phân nhóm

**Nền gốc:** 7 nhóm × 20 prompt đã có ở D1-01 (viết mô-tả SP · caption bán hàng · trả-lời/chốt đơn tin-nhắn · xử-lý phàn-nàn/đổi-trả · content/livestream · khuyến-mãi · tối-ưu tiêu-đề sàn) — **dùng lại nguyên**, đánh số lại theo nhóm khi ghép vào Hero.

**Mở-rộng để đạt 60–100 prompt** — 2 hướng làm giàu (không phải bịa thêm ý mới lan-man):

| Hướng mở-rộng | Cách làm | Ước tăng số-lượng |
|---|---|---|
| **Biến-thể theo ngành hàng** cho 7 nhóm gốc (thời-trang, mỹ-phẩm/skincare, thực-phẩm/đồ ăn, gia-dụng, mẹ&bé — 5 ngành phổ-biến nhất của chủ shop online VN) | Với nhóm "viết mô-tả SP" và "caption bán hàng" — thêm 1 biến-thể riêng/ngành (vd mỹ-phẩm cần lưu-ý KHÔNG cam-kết công-dụng y-tế; thực-phẩm cần lưu-ý an-toàn-thực-phẩm/hạn-sử-dụng) | +15–20 prompt |
| **5 nhóm việc MỚI** chưa có ở lead-magnet (liệt kê bên dưới) | Mỗi nhóm 3–5 prompt theo đúng format lead-magnet (nỗi-đau + prompt copy-paste + mẹo dùng) | +18–25 prompt |

**5 nhóm mới cho Hero (không có ở bản free):**

| # | Nhóm | Ví-dụ prompt |
|---|---|---|
| 8 | **Quản-lý kho & thông-báo hết hàng/pre-order** | Viết thông-báo hết hàng lịch-sự kèm gợi-ý SP thay-thế; viết tin nhắn pre-order/dự-trù nhập hàng theo mùa |
| 9 | **Chăm khách cũ & giữ chân (retention)** | Tin nhắn hỏi-thăm sau mua 3–7 ngày; xin review khéo (không ép); chương-trình giới-thiệu bạn bè (referral) đơn-giản |
| 10 | **Content theo mùa/lễ Tết VN** | Ý-tưởng content Tết/8-3/20-10/Black Friday/Noel riêng cho ngành hàng của khách — tránh đụng ngày lễ tôn-giáo/chính-trị nhạy-cảm |
| 11 | **Xử-lý khủng-hoảng nhẹ** | Phản-hồi khi bị report/hạn-chế tài-khoản tạm-thời; xử-lý seeding/review giả tiêu-cực từ đối-thủ (thông-báo sàn, KHÔNG tự đôi-co công-khai) |
| 12 | **Copy quảng-cáo trả-phí ngắn (Meta/TikTok Ads)** | Vì clarification ghi founder **cần hỗ-trợ ads** — prompt viết 3 biến-thể ad-copy ngắn (hook + benefit + CTA) để test, kèm lưu-ý tuân Ad Compliance Review (`10-thuc-thi-compliance-4-ad-review.md`) |

**Tổng đích:** 20 (gốc) + ~18 (biến-thể ngành) + ~20 (5 nhóm mới) ≈ **58–65 prompt cho v1**; tăng dần lên 80–100 ở v2 khi có phản-hồi khách thật về nhóm nào dùng nhiều nhất (ưu-tiên mở-rộng nhóm đó trước, không dàn đều).

**Định dạng ghép:** giữ nguyên format D1-01 (tiêu-đề nỗi-đau + prompt copy-paste có `[...]` + 1 dòng mẹo dùng), thêm 1 cột/nhãn **"Ngành hàng phù-hợp nhất"** để khách lọc nhanh theo ngành của họ.

### (b) 3–5 template Notion / Google Sheet

| # | Template | Cột/section chính | Ưu-tiên MVP |
|---|---|---|---|
| 1 | **Lịch content 30 ngày** | Ngày · Kênh (FB/TikTok/Shopee) · Định-dạng (ảnh/video/livestream) · Ý-tưởng cụ-thể · Trạng-thái (đã đăng/chưa) · Link bài đăng · Ghi-chú hiệu-quả (lượt tương-tác) | **BẮT BUỘC v1** |
| 2 | **Quản-lý tin-nhắn & chốt đơn** (inbox/order tracker) | Ngày · Kênh (Zalo/FB/Shopee Chat) · Tên khách (viết tắt — tránh lưu PII đầy-đủ không cần-thiết, đối-chiếu NĐ 13/2023) · SP quan-tâm · Trạng-thái (đang tư-vấn/đã chốt/huỷ) · Giá-trị đơn · Ngày follow-up tiếp | **BẮT BUỘC v1** |
| 3 | **Kế-hoạch khuyến-mãi theo quý** | Dịp/tên chương-trình · Thời-gian · SP áp-dụng · Mức giảm · Giá vốn (founder tự điền) · Biên lợi-nhuận dự-kiến · Kênh quảng-bá | **BẮT BUỘC v1** |
| 4 | Theo-dõi tồn-kho & bổ-sung đơn-giản | SP · Tồn hiện-tại · Ngưỡng cảnh-báo · Ngày nhập tiếp-theo | Để v2 |
| 5 | Theo-dõi phản-hồi/review khách hàng | Ngày · Kênh · Nội-dung feedback · Loại (khen/phàn-nàn) · Đã xử-lý? · Hành-động | Để v2 |

**MVP tối-thiểu = 3 template (1,2,3).** Làm bằng Google Sheet (miễn-phí, khách không cần tài-khoản Notion) là lựa-chọn AN-TOÀN hơn cho khách phổ-thông ít rành công-cụ; bản Notion làm thêm ở v2 cho khách quen Notion (2 định-dạng cùng nội-dung, không phải làm lại từ đầu — export/convert).

### (c) 3–5 video ngắn hướng dẫn (founder tự quay theo kịch bản dưới)

Mỗi video 3–7 phút, quay bằng điện-thoại là đủ (không cần ê-kíp), founder xuất-hiện nói trực-tiếp (đúng moat "thương-hiệu cá-nhân" đã chốt ở `positioning.md`).

**Video 1 — Cách dùng bộ prompt AI viết mô-tả & caption bán hàng (BẮT BUỘC v1, ~5 phút)**
- 0:00–0:30 — Mở đầu: chào, nêu vấn-đề ("viết content bán hàng mất cả buổi, giờ chỉ 5 phút")
- 0:30–2:00 — Demo thật: mở ChatGPT/Claude, copy 1 prompt từ thư-viện, điền chỗ trống, gửi, đọc kết-quả
- 2:00–3:30 — Chỉ cách sửa lại cho đúng giọng-văn shop mình (đưa ví-dụ trước/sau)
- 3:30–4:30 — Lưu-ý grounding: nhắc lại phải tự kiểm giá/công-dụng, không để AI bịa
- 4:30–5:00 — Kết + hướng dẫn qua video tiếp-theo

**Video 2 — Cách dùng prompt trả-lời tin-nhắn & chốt đơn khéo (BẮT BUỘC v1, ~5 phút)**
- 0:00–0:30 — Mở đầu: nỗi-đau "khách hỏi giá xong im re, không biết chốt sao"
- 0:30–2:30 — Demo 2 tình-huống thật: khách hỏi giá + khách nói "để suy nghĩ thêm", dùng đúng prompt 8/9 trong thư-viện
- 2:30–4:00 — Mẹo tuỳ-biến theo ngành hàng của khách xem video
- 4:00–5:00 — Kết + nhắc không nên copy máy-móc, luôn đọc lại trước khi gửi

**Video 3 — Cách dùng template Lịch content 30 ngày (BẮT BUỘC v1, ~4 phút)**
- 0:00–0:30 — Mở đầu: nỗi-đau "không biết đăng gì, hết ý-tưởng sau vài hôm"
- 0:30–2:30 — Walkthrough Google Sheet: các cột, cách điền, cách dùng kết-hợp prompt nhóm "content/livestream" để lấp đầy 30 ô ý-tưởng nhanh
- 2:30–3:30 — Demo lấy 1 dòng trong sheet, chạy qua AI ra content thật
- 3:30–4:00 — Kết

**Video 4 — Cách dùng template Quản-lý tin-nhắn & chốt đơn (v2, ~4 phút)**
- Walkthrough sheet inbox/order tracker; cách ghi-chú follow-up; lưu-ý không ghi số điện-thoại/CCCD đầy-đủ vào cột công-khai chia-sẻ

**Video 5 — Lên kịch bản livestream + dùng prompt content mùa-vụ (v2, ~6 phút)**
- Demo dùng prompt 16 (kịch-bản livestream) + prompt nhóm 10 (content mùa/Tết) để chuẩn-bị 1 buổi live thật

**MVP tối-thiểu = 3 video (1,2,3).** Video 4,5 làm ở v2 sau khi có phản-hồi khách dùng nhiều nhất phần nào.

---

## 2. Phạm vi MVP tối thiểu (ra mắt ~1–2 tuần) vs để lại v2

| Cấu phần | **v1 — MVP (trong scope, ra mắt ngay khi có GO)** | **v2 — để sau (ngoài scope, làm sau PMF)** |
|---|---|---|
| Thư-viện prompt | **58–65 prompt** (7 nhóm gốc + biến-thể 5 ngành + 5 nhóm mới) | Mở rộng lên 80–100, thêm ngành hàng khác theo yêu-cầu khách thật |
| Template | **3 template Sheet** (lịch content, inbox/order tracker, kế-hoạch khuyến-mãi) | Bản Notion song-song + 2 template thêm (tồn-kho, feedback log) + tự-động-hoá (Zapier/Make nối sheet) |
| Video | **3 video cốt-lõi** (~14 phút tổng, quay điện-thoại, không cần dựng phức-tạp) | 2 video thêm + case-study khách thật (cần đợi có khách dùng để quay) |
| Chống copy | License key đơn-giản (mã theo email, đối-chiếu thủ-công khi có khiếu-nại) + watermark tên/email khách trên PDF/file tải + link tải Google Drive có hạn (đổi link mỗi X lượt tải bất-thường) | DRM tự-động hoá đầy-đủ, hệ-thống cấp-phát key tự-động qua platform bán |
| Giao hàng | Link Drive/Notion share thủ-công (nếu 0-05b chưa chốt platform tự-động) hoặc qua EDD nếu WordPress đã dựng xong (`10-thuc-thi-ha-tang-ban.md`) | Tự-động 100% qua LMS/checkout tích-hợp |
| Cộng-đồng/SP#2 | KHÔNG mở — chỉ Hero đơn-lẻ | Membership/cộng-đồng người-học (SP#2, mở SAU PMF hero — Red-team: chống mở-rộng-sớm) |

---

## 3. Timeline gợi ý (~10–12 ngày làm việc kể từ ngày có GO)

| Ngày | Việc |
|---|---|
| 1–2 | Mở-rộng thư-viện prompt 20 → 58–65 (AI hỗ-trợ viết nháp theo khung mục 1a, founder biên-tập theo phỏng-vấn khách thật) |
| 3–4 | Dựng 3 template Google Sheet (mục 1b), điền sẵn 3–5 dòng ví-dụ mẫu để khách dễ bắt-đầu |
| 5–7 | Viết kịch-bản chi-tiết (đã có khung ở mục 1c) + quay + dựng nhẹ 3 video |
| 8 | Ghép gói Hero: 1 folder/link duy-nhất (prompt-library + 3 sheet + 3 video) + gắn watermark/mã license cơ-bản |
| 9 | QC nội-bộ: chạy thử MỖI prompt 1 lần trên ChatGPT/Claude free-tier (không lỗi, không đòi trả phí mới chạy được) + kiểm sheet không lỗi công-thức + video xem lại đủ nghe rõ |
| 10 | Rà lại đối-chiếu EULA/Content Rights (`10-thuc-thi-compliance-1-eula.md`, `-2-content-rights.md`) đã có sẵn từ PHA 0 — gắn link EULA vào bước thanh-toán |
| 11–12 | Set giá theo mục 4 + soft-launch nội-bộ cho danh-sách email/Zalo đã presell trước (KHÔNG quảng-cáo rộng ngay — vẫn là NEED-APPROVAL khi mở bán công-khai, xem `2-04` trong run-state) |

> Mốc là **khung tham-khảo**, không phải deadline cứng — founder full-time có thể rút ngắn nếu prompt/template làm nhanh hơn dự-kiến.

---

## 4. Giá theo phễu (đề xuất — CHƯA chốt số cuối)

| Tầng | SP | Giá đề-xuất | Trạng-thái |
|---|---|---|---|
| Free | Lead-magnet 20 prompt (D1-01) | 0đ | Đã có |
| Tripwire | Mini-bộ công-cụ (prompt chọn-lọc + 1 template) | **49.000–99.000đ** | `[benchmark — chốt sau presell/WTP]` |
| **Hero** | Thư-viện 58–100 prompt + 3–5 template + 3–5 video | **≥ 299.000đ** | `[benchmark — chốt sau presell/WTP]` |

**Nguyên-tắc chốt giá (Red-team, đã ghi ở `products.md`):** KHÔNG khoá giá cứng theo benchmark — chỉ chốt số cuối SAU khi đo được WTP qua presell/tripwire thật (`1-04b`, `1-06`). Nếu tripwire bán chạy ở 49k mà ít người mua ở 99k, ưu-tiên tín-hiệu thật hơn con số đề-xuất ở đây.

---

## 5. Định nghĩa hoàn thành — Definition of Done (Hero MVP)

- [ ] Thư-viện ≥ 58 prompt, mỗi prompt đã chạy-thử ít-nhất 1 lần trên ChatGPT/Claude bản miễn-phí, không lỗi
- [ ] 3 template Google Sheet hoạt-động, không lỗi công-thức, đã điền sẵn ví-dụ mẫu
- [ ] 3 video quay xong, nghe/nhìn rõ, upload xong (link riêng-tư/không-liệt-kê trước khi mở bán công-khai)
- [ ] Gói Hero đóng thành 1 link/folder giao-hàng duy-nhất
- [ ] Watermark tên/email khách + license key cơ-bản gắn vào file tải (chống re-sell tối-thiểu)
- [ ] EULA + Content Rights Clearance đã qua rà luật-sư (`0-04f`) và hiển-thị tại bước thanh-toán
- [ ] Giá cuối đã đối-chiếu ít-nhất 1 vòng presell/tripwire thật, không chỉ dùng số đề-xuất ở mục 4

---

## 6. Rủi ro & phụ thuộc

- **Phụ-thuộc cổng `1-06` GO/NO-GO** — spec này KHÔNG được triển-khai sản-xuất trước khi có kết-quả GO (tránh rót CapEx trước khi có tín-hiệu cầu thật, đúng khung `08-execution-plan.md`).
- **Phụ-thuộc `0-04f`** (luật-sư rà 5 văn-bản compliance) — không mở bán thật khi chưa rà xong, đặc-biệt EULA mục 4 (nội-dung AI-hỗ-trợ, rủi-ro bản-quyền).
- **Phụ-thuộc `0-05b`** (chọn platform/domain) — quyết-định cơ-chế giao-hàng tự-động hay thủ-công ở giai-đoạn v1.
- **Rủi-ro tải-lậu:** thư-viện prompt dạng text rất dễ copy — anti-piracy ở mục 1c/2 chỉ giảm-thiểu, không triệt-để; moat thật vẫn là audience + brand + tốc-độ ra SP mới (theo `positioning.md`), không kỳ-vọng file không-thể-copy.
- **Rủi-ro nội-dung AI-generated:** founder PHẢI biên-tập/thêm sáng-tạo đáng-kể lên mọi prompt/template trước khi bán — không bán nguyên-văn output AI chưa qua tay người (rủi-ro pháp-lý bản-quyền đã nêu ở EULA mục 4).
- **Rủi-ro lệch nỗi-đau thật:** nếu founder chưa phỏng-vấn đủ 3–5 chủ shop thật trước khi hoàn-thiện thư-viện mở-rộng, prompt có thể "đúng về AI, sai về nghề" — ưu-tiên dành thời-gian phỏng-vấn trước ngày 1–2 của timeline nếu chưa làm.

---

## 7. Bước tiếp theo

1. Chờ kết-quả cổng `1-06` (GO/NO-GO) — spec này sẵn-sàng triển-khai ngay khi có GO.
2. Khi GO: chạy theo Timeline mục 3, cập-nhật tiến-độ vào `10-run-state.md` (bước `2-01` Sản-xuất hero, `2-02` Anti-piracy, `2-03` Chốt giá).
3. Mở bán hero (`2-04`) vẫn là cổng 🔴 **NEED-APPROVAL** (CEO duyệt trước khi công-khai/thu tiền) — spec này KHÔNG tự động kích-hoạt bán hàng.
