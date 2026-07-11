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
| 3-03b | Soạn hướng-dẫn tạo fanpage + Business Suite + nội-dung sẵn + 5 bài seed | AI | file | — | none | — | DONE | 10-thuc-thi-tao-fanpage.md |
| 3-04 | Điền placeholder + up 3 trang pháp-lý + vá Purchase event + kiểm SEPAY_API_TOKEN | Human | — | founder | NEED-APPROVAL | 3-01 | HUMAN | — |
| 3-04b | Tạo fanpage + Business Suite + Ad Account + gắn Pixel + thẻ (founder tự làm) | Human | — | founder | NEED-APPROVAL | 3-03b | HUMAN | — |
| 3-05 | Test 1 giao-dịch thật 179k end-to-end (chi tiền thật) | Human | — | founder | NEED-APPROVAL | 3-04 | HUMAN | — |
| 3-06 | Chạy ads test Tranche 1 (~1.5–2.5tr) + đọc CAC vs 179k | Human | — | founder | NEED-APPROVAL | 3-05 | HUMAN | — |

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
