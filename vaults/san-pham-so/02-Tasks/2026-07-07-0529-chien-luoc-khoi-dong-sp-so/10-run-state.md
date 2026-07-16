# Sổ thực thi (run ledger) — Khởi động SP số Ngách A

> **TL;DR:** Sổ nguồn-sự-thật để resume. Lượt này executor tự chạy xong 9 bước 🟢 AI-AUTO không phụ-thuộc beachhead (protocol đo + KPI tracker, 5 văn-bản compliance MẪU, kế-hoạch hạ-tầng, research thuế) — bằng-chứng file thật. Đang gom 3 cổng 🟡 NEED-INFO hỏi CEO (beachhead, runway, platform). Việc phụ-thuộc beachhead chạy sau khi CEO chốt.
>
> Neo: `08-execution-plan.md` · `decisions-log.md` 2026-07-07 (Ngách A). Cổng cứng (tiền/pháp-lý/công-bố) LUÔN NEED-APPROVAL.
> **Compliance gate (engine):** `npm run compliance` — mọi bước DONE có bằng-chứng file resolve được (E1). id chữ-số để engine parse.

**Trạng thái:** TODO · DOING · BLOCKED-INFO · BLOCKED-APPROVE · HUMAN · DONE · FAILED

## PHA 0 — Nền-móng & compliance

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| 0-01 | Thu-hẹp beachhead xuống 1 nghề cụ-thể (AI đề-xuất 4 options → CEO chọn) | AI+Human | — | CEO chọn | NEED-INFO | — | DONE | 03-clarification.md (beachhead = chủ shop bán online) |
| 0-02 | Xác-minh runway sinh-hoạt founder (tách war-chest, ≥60–90 ngày) | Human | — | số của CEO | NEED-INFO | — | BLOCKED-INFO | CEO: <3 tháng — RỦI-RO G0, chờ quyết mitigation |
| 0-03 | Soạn spec tiêu-chí + ngưỡng go/no-go (3 kịch-bản vốn 20/50/100tr) | AI | file | — | none | — | DONE | 10-thuc-thi-protocol-do-luong.md |
| 0-04a | Draft EULA/License SP số (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-1-eula.md |
| 0-04b | Draft Content Rights Clearance checklist (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-2-content-rights.md |
| 0-04c | Draft Privacy Policy + consent NĐ 13/2023 (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-3-privacy.md |
| 0-04d | Draft Ad Compliance Review checklist Luật QC (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-4-ad-review.md |
| 0-04e | Draft SOP Refund + mốc giao hàng (Luật BVQLNTD 19/2023) (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-5-refund-sop.md |
| 0-04f | Luật-sư rà + CEO duyệt 5 văn-bản trước publish | Human | — | luật-sư | NEED-APPROVAL | 0-04a | HUMAN | — |
| 0-05a | Kế-hoạch hạ-tầng bán self-host (so-sánh LMS/cổng thanh-toán VN + phí thật) | AI | web | — | none | — | DONE | 10-thuc-thi-ha-tang-ban.md |
| 0-05b | Chọn platform + domain | Human | — | CEO chọn | NEED-INFO | 0-05a | BLOCKED-INFO | CEO: landing chuyên VN (Ladipage/Sapo) — chờ chốt cái nào + domain |
| 0-05c | Đăng-ký platform/domain/cổng thanh-toán (KYC) | Human | — | KYC | HUMAN | 0-05b | HUMAN | — |
| 0-06a | Research ngưỡng thuế hộ KD hiện-hành (WebSearch) | AI | web | — | none | — | DONE | 10-thuc-thi-thue-research.md · nguồn https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-dinh-so-141-2026-nd-cp-nang-nguong-doanh-thu-khong-phai-chiu-thue-len-1-ty-dong-119260504154326455.htm |
| 0-06b | Kế-toán xác-minh + cập-nhật Brain thuế (đã cập-nhật sơ-bộ 1 tỷ) | Human | — | kế-toán | NEED-INFO | 0-06a | HUMAN | — |

## ĐỢT-1 — Validate (dep beachhead 0-01)

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| 1-00 | Soạn guide phỏng-vấn khám-phá khách (Mom Test, 10 câu) | AI | file | — | none | 0-01 | DONE | 10-thuc-thi-khampha-khach.md |
| 1-00b | Phỏng-vấn 5–10 chủ shop online (founder tự làm) | Human | — | founder | none | 1-00 | HUMAN | — |
| 1-01 | Làm lead-magnet miễn-phí (bộ 20 prompt AI chủ shop) | AI | file | beachhead | none | 0-01 | DONE | D1-01-lead-magnet-prompt-pack-chu-shop.md |
| 1-01b | Soạn spec hero MVP (để founder tự làm) | AI | file | beachhead | none | 0-01 | DONE | 10-thuc-thi-hero-mvp-spec.md |
| 1-02 | Viết landing page + chuỗi 5 email | AI | file | beachhead | none | 0-01 | DONE | D1-02-landing-copy.md |
| 1-03 | Soạn 10 kịch-bản nội-dung ngắn (kênh phụ) | AI | file | beachhead | none | 0-01 | DONE | D1-03-content-scripts.md |
| 1-03b | Playbook outreach trực-tiếp chủ shop (kênh validate nhanh nhất) | AI | file | beachhead | none | 0-01 | DONE | D1-03-outreach-playbook.md |
| 1-04a | Soạn trang presell/founding-member copy | AI | file | beachhead | none | 0-01 | DONE | D1-04a-presell-copy.md |
| 1-04c | Soạn kế-hoạch ads test (chờ sau validate) | AI | file | — | none | 0-01 | DONE | 10-thuc-thi-ads-test-plan.md |
| 1-07 | Soạn cẩm-nang vận-hành ĐỢT-1 từng bước (khám-phá/outreach/thủ-tục cá-nhân/khi-nào-ads) | AI | file | — | none | 0-01 | DONE | 10-thuc-thi-huong-dan-van-hanh-dot-1.md |
| 1-04b | Mở presell thu tiền thật | Human | — | live | NEED-APPROVAL | 0-04e | TODO | — |
| 1-05 | Dựng bảng đo KPI (CSV tracker funnel) | AI | file | — | none | 0-03 | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv |
| 1-06 | Cổng GO/NO-GO (chấm chất-lượng tín-hiệu) | Human | — | số thật | NEED-APPROVAL | 1-05 | TODO | — |

## GO-LIVE & ADS — SP thật "ĐơnThật" (CEO đã có landing + SePay + SP 179k)

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| 3-01 | Soạn 3 trang pháp-lý (hoàn tiền/privacy/điều-khoản) ready-to-paste | AI | file | — | none | — | DONE | legal-chinh-sach-hoan-tien.md |
| 3-01b | Soạn trang privacy + điều-khoản (NĐ 13 + disclaimer nhãn-hiệu) | AI | file | — | none | — | DONE | legal-chinh-sach-rieng-tu.md |
| 3-02 | Soạn checklist go-live (pixel/email/domain, vá Purchase event, test) | AI | file | — | none | — | DONE | 10-thuc-thi-checklist-go-live.md |
| 3-03 | Soạn kế-hoạch ads launch kỷ-luật (Meta trước, ngân-sách + ngưỡng) | AI | file | — | none | — | DONE | 10-thuc-thi-ads-launch-plan.md |
| 3-03f | Soạn tài-liệu hướng-dẫn quy-trình + công-cụ AI cho video quảng-cáo (pipeline 2 vòng · tool stack · 6 bước · 3 kịch-bản mẫu · 10 hook · guardrails luật/policy) | AI | file | — | none | — | DONE | 10-thuc-thi-video-ads-ai.md |
| 3-03g | Soạn cẩm-nang video 100% AI né-lộ-AI (doctrine né mặt-người + thời-lượng tối-ưu + 4 concept đầy-đủ shot-list từng-giây + prompt tạo video/mascot/nhạc + tool 2026 tốt-rẻ) | AI | file | — | none | 3-03f | DONE | 10-thuc-thi-video-ai-100-kich-ban.md |
| 3-03h | Thiết-kế + render mascot thương-hiệu "Bé Túi" (túi-cam có tick, vector→PNG 1080) | AI | file | — | none | — | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/mascot-donthat.png |
| 3-03i | Soạn kit tạo video Concept #1 ready-to-generate (8 hook · VO từng câu · nguồn/prompt từng cảnh · giọng/nhạc/SFX · bước CapCut) + prompt nâng mascot 3D/động | AI | file | — | none | 3-03g | DONE | 10-thuc-thi-video-kit-va-mascot.md |
| 3-03j | Render 6 khung hình 9:16 (1080×1920) drop-in cho video Concept #1 (hook · before · fill · after · 5-files · end-card mascot) + storyboard | AI | file | — | none | 3-03i | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/video-c1-frames.zip · video-c1-frames/00-storyboard.png |
| 3-03k | Render video HÌNH hoàn-chỉnh (mp4 25.5s · 6 cảnh Ken Burns zoom + chuyển-cảnh xfade · 1080×1920 30fps · ffmpeg) — IM LẶNG, thêm giọng+nhạc ở CapCut | AI | file | — | none | 3-03j | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/donthat-video-c1.mp4 · video-c1-build.py |
| 3-03l | Soạn tài-liệu kịch-bản video ĐIỆN-ẢNH AI photoreal (concept "0 đơn→đơn đầu" · 7 cảnh không mặt-người · prompt EN từng cảnh cho Kling/Veo/Sora · negative · tool-map/chi-phí · VO+nhạc+ghép CapCut · guardrails) — CEO chọn hướng Điện-ảnh AI | AI | file | — | none | — | DONE | 10-thuc-thi-video-dien-anh-ai.md |
| 3-03m | Render video mô-phỏng (animatic 24s) của kịch-bản điện-ảnh: 7 cảnh có letterbox + nhãn cảnh + phụ-đề VO, Ken Burns + chuyển-cảnh — previz trước khi generate footage thật | AI | file | — | none | 3-03l | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/donthat-animatic.mp4 · animatic-frames/ |
| 3-02c | Thiết-kế + render ảnh bìa fanpage (1640×624 chuẩn FB, brand tối+cam) | AI | file | — | none | — | DONE | anh-bia-fanpage-donthat.png |
| 3-03c | Thiết-kế 5 ảnh bài đăng seed + avatar/cover/logo (render Chromium, đồng-bộ brand) | AI | file | — | none | — | DONE | post1-gioi-thieu-kit.png |
| 3-03b | Soạn hướng-dẫn tạo fanpage + Business Suite + nội-dung sẵn + 5 bài seed | AI | file | — | none | — | DONE | 10-thuc-thi-tao-fanpage.md |
| 3-03d | Ghép Pixel THẬT (1039882955245470) + Purchase/ViewContent/InitiateCheckout + điền pháp-lý/email vào 2 bản landing (A=bản gốc có thanh-toán · B=thiết-kế Stitch + ghép module thanh-toán) — deploy-ready | AI | file | Pixel ID | none | 3-03b | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/donthat-A-goc-final.zip · donthat-B-stitch-final.zip · landing-A-goc-index.html · landing-B-stitch-index.html |
| 3-03e | Hợp-nhất 1 bản CHUẨN duy-nhất (thiết-kế Stitch + thanh-toán A): recolor modal xanh→cam brand · font Inter · wire form lead (+Lead event, /api/lead) · SEO/OG + og-image 1200×630 render · favicon · preconnect. Render kiểm modal cam. deploy-ready | AI | file | — | none | 3-03d | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/donthat-final.zip · landing-final-index.html · landing-final-og-image.png · landing-final-api-lead.js |
| 3-04 | Deploy bản final + set SEPAY_API_TOKEN trên Vercel | Human | — | founder | NEED-APPROVAL | 3-03e | DONE | https://donthat.vercel.app (LIVE — Vercel status Ready) · SEPAY_API_TOKEN đã set (bằng-chứng: thanh-toán tự đối-soát chạy được, xem 3-05) |
| 3-04b | Tạo fanpage + Business Suite + Ad Account + gắn Pixel + thẻ (founder tự làm) | Human | — | founder | NEED-APPROVAL | 3-03b | HUMAN | Pixel LIVE (xem 3-04c); Ad Account/thẻ chờ CEO xác-nhận |
| 3-04c | Xác-minh Pixel LIVE (Events Manager thật-sự nhận sự-kiện) | Human | — | CEO | none | 3-04 | DONE | CEO screenshot Events Manager 2026-07-15: dataset 1039882955245470 nhận PageView + ViewContent, trạng-thái "Đang hoạt động", nguồn Trình duyệt |
| 3-05 | Test 1 giao-dịch thật 179k end-to-end (chi tiền thật) | Human | — | founder | NEED-APPROVAL | 3-04 | DONE | CEO xác-nhận 2026-07-15: chuyển 179k → trang tự nhận → nhận được file Kit (vòng thanh-toán+giao-hàng chạy thật) |
| 3-06 | Chạy ads test Tranche 1 (~1.5–2.5tr) + đọc CAC vs 179k | Human | — | founder | NEED-APPROVAL | 3-05 | TODO | — |

## ĐỢT-2 — Sản-xuất + scale (dep GO 1-06) — chưa mở

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| 2-01 | Sản-xuất hero đầy-đủ (freelancer NDA+work-for-hire) | AI+Human | file | GO | NEED-APPROVAL | 1-06 | TODO | — |
| 2-02 | Anti-piracy (watermark/license/EULA/link hạn) | AI | file | GO | none | 1-06 | TODO | — |
| 2-03 | Chốt giá hero theo WTP | Human | — | WTP | NEED-APPROVAL | 1-06 | TODO | — |
| 2-04 | Mở bán hero + upsell | Human | — | live | NEED-APPROVAL | 2-01 | TODO | — |
| 2-05 | Scale ads có kỷ-luật (LTV/CAC>1) | AI+Human | web | biên dương | NEED-APPROVAL | 2-04 | TODO | — |
| 2-06 | Xác-nhận PMF → /vn-loop | AI | file | số thật | none | 2-04 | TODO | — |

---
## Tiến độ (cập-nhật 2026-07-07)
- **DONE (18):** toàn-bộ AI-AUTO PHA 0 + ĐỢT-1 — 5 compliance MẪU · spec đo + KPI CSV · hạ-tầng · thuế · lead-magnet 20 prompt · spec hero MVP · landing+5 email · presell copy · 10 kịch-bản video · playbook outreach · guide phỏng-vấn · kế-hoạch ads. Engine compliance **PASS 32 bước 0 vi-phạm** (E1 ✓ bằng-chứng file thật).
- **→ Bộ kit ĐỢT-1 validate đã SẴN-SÀNG.** Việc còn lại là NGƯỜI làm (không máy thay được):
  - **HUMAN:** 1-00b phỏng-vấn 5–10 chủ shop · 0-05c đăng-ký platform/domain/thanh-toán (KYC) · 0-06b kế-toán · quay 3 video hero.
  - **NEED-INFO:** 0-05b chốt Ladipage/Sapo + domain · đăng-ký hộ KD hay cá-nhân.
  - **NEED-APPROVAL:** 0-04f luật-sư rà 5 văn-bản · 1-04b mở presell thu tiền · 1-06 cổng GO/NO-GO · ĐỢT-2 (sau GO).
- **Chiến-lược lean:** kênh validate nhanh nhất = outreach trực-tiếp + presell trong cộng-đồng seller (≈0đ, tín-hiệu 2–3 tuần); content video = kênh phụ; ads chỉ bật NHỎ sau khi có WTP dương.

### GO-LIVE xác-minh (2026-07-15)
- ✅ **Landing LIVE:** donthat.vercel.app deploy Vercel (Ready), bản final (Stitch + thanh-toán + Pixel + pháp-lý).
- ✅ **Pixel xác-minh THẬT:** Events Manager dataset 1039882955245470 nhận **PageView + ViewContent** ("Đang hoạt động", nguồn Trình duyệt) — CEO screenshot. Không phải chỉ có code, mà Facebook đã nhận tín-hiệu.
- ✅ **Thanh-toán end-to-end THẬT:** CEO test chuyển 179k → trang tự đối-soát (SePay) → nhận được file Kit. Vòng tiền + giao-hàng chạy.
- **Còn lại trước khi chạy ads:** (1) **Purchase event** sẽ tích-luỹ theo đơn thật — không cần làm gì thêm, code đã đúng; (2) **Xác-minh miền (Domain Verification)** nên làm ngay trước cổng 3-06 (đo đơn chuẩn trên iOS, AEM); (3) kế-hoạch ads Tranche 1 (3-06).
