# Protocol đo lường + Ngưỡng GO/NO-GO — ĐỢT-1 Validate (Ngách A: AI-năng-suất cho hộ KD & freelancer VN)

> **TL;DR:** Tài liệu này là **1 protocol đo lường duy-nhất** cho ĐỢT-1 (validate cầu thật trước khi rót CapEx sản-xuất hero), gồm: định-nghĩa công-thức từng chỉ-số funnel, bảng ngưỡng GO/NO-GO theo 3 kịch-bản vốn (20/50/100 triệu), tiêu-chí chất-lượng-tín-hiệu bù cho mẫu nhỏ, và quy-tắc quyết GO/PIVOT/DỪNG. **Mọi con số ngưỡng trong bảng (b) là ĐỀ-XUẤT của AI dựa trên benchmark ngành công khai — CHƯA phải số đã chốt; CEO + phòng 03-finance phải rà và ký duyệt trước khi dùng làm căn-cứ ra quyết-định GO/NO-GO thật (đây là văn-bản MẪU/khung, cần chuyên-gia/CEO xác nhận số).**

**Neo:** `08-execution-plan.md` mục 0.3 & 1.5/1.6 · `10-run-state.md` (P0-03, D1-05, D1-06) · `decisions-log.md` 2026-07-07 (Ngách A, 5 ràng-buộc Red-team) · Brain `state.md`/`budget.md` (stage GĐ1, vốn 20–100tr). Dùng chung với `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv` (bảng ghi số thật hàng tuần).

---

## (a) Định nghĩa chỉ số funnel + công thức

Phễu 3 tầng: **impression/reach (content-led) → click (về landing) → opt-in (email/Zalo OA, lead-magnet miễn phí) → tripwire (49–99k, thu tiền thật) → hero (≥299k, ĐỢT-2)**. Nguyên tắc cứng từ Red-team: **TÁCH BẠCH lead-conversion và purchase-conversion** — cả hai đo trên cùng nền `clicks` (lưu-lượng landing), KHÔNG coi purchase-conversion là "phần trăm của opt-in" (tránh nhầm 2 tầng khác bản-chất: cho-không vs trả-tiền-thật).

| Chỉ số | Công thức | Ghi chú |
|---|---|---|
| **Impressions** | Số lượt hiển-thị nội-dung (TikTok/Shorts/Reels), lấy từ insight nền-tảng | Đo phạm-vi content-led, KHÔNG phải traffic landing |
| **Clicks** | Số lượt click từ link-in-bio/UTM về landing | Base-line cho 2 tầng conversion bên dưới |
| **CTR%** | `clicks / impressions × 100` | Sức hấp-dẫn hook nội-dung |
| **Opt-ins** | Số email hoặc Zalo OA follow mới đổi lấy lead-magnet miễn-phí | Đếm unique, khử trùng |
| **Lead-conversion% (tầng 1 — cho-không)** | `opt_ins / clicks × 100` | Benchmark: landing chuyên cho lead-magnet (traffic ấm/email-driven) đạt **~10–20%** theo GetResponse/Leadpages/Landerlab; trung-bình chung mọi loại landing chỉ **~2–11%** tùy nguồn — **[benchmark ngành — cần CEO xác minh]**, dải rộng vì phụ nguồn traffic. |
| **Tripwire orders** | Số đơn thu tiền thật ở mức 49–99k | Đây là phép-đo **WTP (willingness-to-pay) thật**, KHÔNG tính opt-in miễn-phí là "đã đo được nhu-cầu" |
| **Purchase-conversion% (tầng 2 — trả-tiền)** | `(tripwire_orders + hero_orders) / clicks × 100` | Benchmark tripwire: cold traffic **~1.5–5%**, traffic ấm (đã nuôi email/organic theo dõi lâu) có thể **~5–15%**; benchmark landing→hero trực-tiếp (không qua tripwire): **~1–3%** theo debate Red-team & đặc-thù SP số VN (`00-Brain/products.md`) — **[benchmark ngành — cần CEO xác minh]** |
| **Hero orders** | Số đơn hero (≥299k) — ĐỢT-1 thường = 0 hoặc rất ít (pre-order/early-bird thử-nghiệm); chủ-lực ở ĐỢT-2 | Giữ cột để không phải đổi cấu-trúc tracker khi bước sang ĐỢT-2 |
| **AOV (average order value)** | `tổng doanh-thu / tổng số đơn (tripwire + hero)` | Theo dõi rời-rạc theo tuần, không cộng-dồn nhầm |
| **Spend** | Tổng chi ads/boost trong kỳ (VNĐ); ĐỢT-1 khuyến-nghị content-led là chính, ads chỉ để test creative | Không gồm CapEx sản-xuất nội-dung (tính riêng ở Brain `budget.md`) |
| **CAC (customer acquisition cost)** | `spend / số khách hàng MỚI trả tiền (tripwire+hero) trong kỳ` | Nếu spend ads = 0 (thuần organic), CAC = 0 nhưng vẫn phải tính chi-phí thời-gian/cơ-hội định-tính |
| **Refund%** | `số đơn hoàn / tổng số đơn phát-sinh trong kỳ × 100` | Ngưỡng cảnh-báo chất-lượng: DN-context nêu benchmark ngành SP số **<5%**; refund cao ở mẫu nhỏ là tín-hiệu ĐỎ mạnh hơn số lượng đơn |
| **Organic vs paid** | Tỷ-lệ đơn/opt-in đến từ organic content-led so với đến từ ads trả phí (theo UTM) | Đơn từ organic đáng-tin hơn (không bị "mua" tín-hiệu bằng tiền ads) |
| **Note_signal_quality** | Ghi định-tính: người quen/lạ, phản-hồi/review, xin-mua-lại, đơn có bị hoàn không | Xem mục (c) |

> **Vì sao tách 2 tầng:** opt-in đo "quan-tâm miễn-phí" (rẻ, dễ đạt số cao ảo); purchase-conversion đo "sẵn-sàng trả tiền" (khó, ít, nhưng thật). DN chỉ nên tin ngưỡng GO khi **CẢ HAI** đạt — opt-in cao mà 0 đơn tripwire là tín-hiệu ĐỎ (nội-dung hấp-dẫn nhưng offer/giá/niềm-tin chưa đủ để móc ví).

---

## (b) Bảng ngưỡng GO/NO-GO theo 3 kịch-bản vốn

> **Toàn bộ số trong bảng dưới là ĐỀ-XUẤT (proposal) của AI, gắn nhãn `[benchmark ngành — cần CEO xác minh]` và `[đề-xuất — cần CEO + 03-finance chốt]`.** Nguyên-tắc thiết-kế: KHÔNG đòi ý-nghĩa thống-kê (mẫu 20–100tr quá nhỏ để test A/B chuẩn); thay vào đó dùng **ngưỡng-số-tuyệt-đối tối-thiểu** (đủ để không kết-luận vội trên n=1..3) kết-hợp **cổng chất-lượng-tín-hiệu định-tính** ở mục (c). Cửa-sổ thời-gian theo nhịp content-led "compound 60–90 ngày" đã chốt ở `08-execution-plan.md` mục 1.3.

| Kịch bản vốn ĐỢT-1 | Opt-in tối-thiểu (cỡ mẫu sàn) | Presell/tripwire orders tối-thiểu | Cửa-sổ thời-gian gợi-ý | Ngưỡng KILL (dừng/pivot) |
|---|---|---|---|---|
| **20 triệu** (organic gần như 100%, ads test rất nhỏ ≤2–3tr để thử creative) | **≥ 100–150** opt-in cộng-dồn | **≥ 5** đơn tripwire thật (không tính người quen) | **8–10 tuần** (≈60–70 ngày), ≥ 8–12 nội-dung đã đăng đều | Sau đủ cửa-sổ mà: (i) < 50 opt-in TOÀN kỳ, HOẶC (ii) 0 đơn tripwire dù đã mời presell ≥ 2 đợt tới ≥ 50 opt-in, HOẶC (iii) refund > 40% trên số đơn ít-ỏi có được |
| **50 triệu** (organic + ads test ~10–15tr để so kênh/creative) | **≥ 300–500** opt-in cộng-dồn | **≥ 15–25** đơn tripwire thật | **8–10 tuần**, có thể chạy song-song 2 kênh ads (TikTok Ads vs Meta) để so | Sau đủ cửa-sổ mà: (i) < 150 opt-in, HOẶC (ii) purchase-conversion tripwire < 0.3% dù clicks đã > 3.000, HOẶC (iii) LTV/CAC (ước theo AOV/refund) chưa vượt 1 sau khi chi hết ngân-sách ads test |
| **100 triệu** (organic + ads có kiểm-soát ~20–30tr, đủ thử thêm pre-order hero sớm) | **≥ 600–1.000** opt-in cộng-dồn | **≥ 30–50** đơn tripwire thật **+ ≥ 5–10** đơn pre-order/early-bird hero (giá rút-gọn) để đo thêm WTP tầng cao | **10–12 tuần** | Sau đủ cửa-sổ mà: (i) < 300 opt-in, HOẶC (ii) < 15 đơn tripwire, HOẶC (iii) đã chi > 50% war-chest ĐỢT-1 mà LTV/CAC chưa > 1 (điều-kiện dừng đã pre-register ở `08-execution-plan.md`) |

**Ghi chú áp-dụng bảng:**
- Số "opt-in tối-thiểu" và "presell tối-thiểu" là **sàn để có đủ tín-hiệu tối-thiểu quan-sát được** (không phải mục-tiêu lý-tưởng) — đạt sàn là điều-kiện CẦN, chưa phải ĐỦ để GO (còn phải qua cổng chất-lượng-tín-hiệu mục (c)).
- Nếu vốn thực-tế nằm giữa 2 mốc (vd 35tr), nội-suy tuyến-tính giữa 2 kịch-bản liền kề, CEO+Finance tự chốt số cụ-thể.
- "Ngưỡng KILL" ở đây là chi-tiết-hoá của "Điều-kiện DỪNG/PIVOT (pre-register)" đã ghi ở `08-execution-plan.md` — không thay-thế, chỉ làm rõ số theo từng kịch-bản vốn.
- Benchmark opt-in (~10–20%) và tripwire (~1.5–5% cold / ~5–15% ấm) lấy từ nguồn marketing quốc-tế (không phải số riêng thị-trường VN/TikTok VN) — **cần CEO đối-chiếu với dữ-liệu thật của chính kênh khi có, không neo cứng benchmark ngoại.**

---

## (c) Tiêu chí chất-lượng-tín-hiệu (định-tính) — bù cho mẫu nhỏ

Vì n nhỏ (5–50 đơn) không đủ ý-nghĩa thống-kê, PHẢI kết-hợp các cổng định-tính sau trước khi kết-luận GO:

1. **Tách người-quen vs người-lạ:** chỉ tính đơn/opt-in từ người **KHÔNG quen founder** (bạn bè, gia-đình, đồng-nghiệp cũ loại ra khỏi mẫu tín-hiệu WTP thật). Nếu > 50% đơn tripwire đến từ người quen → tín-hiệu YẾU, không được tính là "đạt ngưỡng GO" dù đủ số lượng.
2. **Soi refund/hoàn tiền:** hoàn trong 7–14 ngày đầu là tín-hiệu thất-vọng thật (mạnh hơn việc đếm số đơn). Bất-kỳ refund nào cũng nên phỏng-vấn ngắn lý-do (1–2 câu) để phân-biệt "sai kỳ-vọng nội-dung" vs "khó khăn kỹ-thuật/thanh-toán".
3. **Mua-lại / xin nâng-cấp hero:** dù n nhỏ, nếu có khách tripwire chủ-động hỏi mua hero/nâng-cấp trước khi ĐỢT-2 mở bán → tín-hiệu dương RẤT mạnh (WTP tầng cao), nặng-ký hơn nhiều so với opt-in số lớn.
4. **Organic vs paid:** đơn đến từ nội-dung organic (người xem hết video → tự tìm landing) đáng tin hơn đơn đến từ ads nhắm hẹp — vì ads có thể "mua" traffic không đại-diện đúng ICP thật.
5. **Phỏng-vấn định-tính ngắn mỗi người mua tripwire** (2–3 câu: vì sao mua, có đúng nỗi-đau không, có sẵn-sàng trả thêm cho bản đầy-đủ không) — ghi vào cột `note_signal_quality` của tracker.
6. **Tín-hiệu sớm trước cả opt-in:** tỷ-lệ xem hết video, lưu (save), chia-sẻ (share), bình-luận hỏi-thêm trên nội-dung free — nếu content được xem nhiều mà KHÔNG ai hỏi-thêm/lưu, đó là dấu-hiệu nội-dung giải-trí chứ chưa chạm đúng nỗi-đau (khác với hook hấp-dẫn nhưng vô-thưởng-vô-phạt).
7. **Không launch/GO chỉ vì đạt số lượng** nếu đa-số buyers là người quen, hoặc tất-cả đơn đến trong 1 ngày duy-nhất từ 1 nguồn (rủi-ro bias mẫu/gian-lận nội-bộ).

---

## (d) Quy tắc quyết GO / PIVOT / DỪNG

> Mọi quyết ở mục này đều là **NEED-APPROVAL** (ranh-giới cứng — quyết-định chiến-lược ảnh-hưởng tiền/hướng-đi): AI chỉ tổng-hợp số liệu + đề-xuất verdict theo bảng (b)+(c), **CEO + 03-finance ký quyết cuối** (khớp cổng D1-06 ở `10-run-state.md`).

- **GO** (tiến ĐỢT-2 — sản-xuất hero): đạt ĐỒNG-THỜI (i) ngưỡng định-lượng tối-thiểu theo đúng kịch-bản vốn ở bảng (b) VÀ (ii) đa-số tín-hiệu chất-lượng ở mục (c) là dương (buyers chủ-yếu người lạ, refund thấp <ngưỡng cảnh-báo, có ít-nhất 1 tín-hiệu quan-tâm hero/mua-lại).
- **PIVOT** (đổi 1 biến-số rồi thử lại — KHÔNG phải dừng hẳn): khi định-lượng CHƯA đạt ngưỡng bảng (b) **NHƯNG** tín-hiệu định-tính mục (c) đủ mạnh để cho rằng vấn-đề nằm ở biến-số có-thể-sửa (giá tripwire, hook nội-dung, persona/nghề beachhead, kênh phân-phối) chứ không phải nhu-cầu = 0. Biến cần thử đổi theo thứ-tự ưu-tiên rẻ nhất trước: **giá/offer → hook/kịch-bản nội-dung → persona/nghề trong cùng Ngách A → kênh (TikTok↔Reels↔YouTube Shorts)**. **Giới-hạn tối-đa 1–2 vòng pivot** trong cùng ĐỢT-1 trước khi phải đánh-giá lại toàn-bộ hoặc báo CEO cân-nhắc dừng (tránh pivot vô-hạn ăn hết vốn).
- **DỪNG** khi xảy-ra bất-kỳ điều nào: (i) chạm ngưỡng KILL ở bảng (b) tương-ứng kịch-bản vốn thật, (ii) đã chi > 50% war-chest ĐỢT-1 mà LTV/CAC ước-tính chưa > 1, (iii) 0 người trả tiền dù đã đủ cỡ mẫu + cửa-sổ thời-gian + đã thử pivot tối-đa, hoặc (iv) vi-phạm compliance nghiêm-trọng (thông-điệp chạm "giàu nhanh", thiếu văn-bản pháp-lý bắt-buộc ở PHA 0) — các điều-kiện này đã pre-register ở `08-execution-plan.md` mục "Điều-kiện DỪNG/PIVOT", tài-liệu này chỉ **định-lượng hoá** theo kịch-bản vốn cụ-thể.
- **Không quyết GO/PIVOT/DỪNG chỉ dựa 1 chỉ-số đơn-lẻ.** Luôn đối-chiếu cả bảng (b) VÀ mục (c) trước khi trình CEO; nếu 2 nguồn tín-hiệu mâu-thuẫn (định-lượng đạt nhưng định-tính xấu, hoặc ngược lại) → KHÔNG tự kết-luận, đưa cả 2 luồng dữ-liệu cho CEO+Finance quyết trực-tiếp.

---

## Cách dùng cùng tracker
Điền số thật hàng tuần vào `03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv`, cộng-dồn theo cửa-sổ thời-gian ở bảng (b), rồi đối-chiếu ngưỡng tại cổng D1-06. Khi có đủ số thật → dùng làm input cho `/vn-loop "<task> — <số thật>"` để đo so neo và quyết PASS/PROMOTE.

## Nguồn tham-khảo (benchmark ngoài — KHÔNG phải số thật DN)
- Opt-in/landing conversion: GetResponse (trung-bình landing 10.76% qua 18 ngành), Leadpages "Landing Page Conversion Benchmarks 2026", Landerlab "Landing Page Conversion Rate Benchmarks by Industry".
- Tripwire conversion: Data Driven Marketing — "How to Measure Your Tripwire Conversion Rate" (cold traffic 1.5–5%, ấm 5–15%, dải phổ-biến 1.5–3%).
- Benchmark landing→hero (1–3%) và refund SP số (<5%): kế-thừa từ Red-team debate (`05-debate.md`) và `00-Brain/products.md` đặc-thù SP số VN — chưa có nguồn ngoài độc-lập, cần CEO đối-chiếu số thật.
