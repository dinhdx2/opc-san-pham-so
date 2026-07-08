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
| 1-01 | Làm lead-magnet miễn-phí (bộ prompt/mini-template AI, sạch bản-quyền) | AI | file | beachhead | none | 0-01 | TODO | — |
| 1-02 | Viết landing page + chuỗi email (3–5) | AI | file | beachhead | none | 0-01 | TODO | — |
| 1-03 | Soạn 8–12 kịch-bản nội-dung content-led (TikTok/Shorts/Reels) | AI | file | beachhead | none | 0-01 | TODO | — |
| 1-04a | Draft trang presell/tripwire copy (49–99k) | AI | file | beachhead | none | 0-01 | TODO | — |
| 1-04b | Mở presell thu tiền thật | Human | — | live | NEED-APPROVAL | 0-04e | TODO | — |
| 1-05 | Dựng bảng đo KPI (CSV tracker funnel) | AI | file | — | none | 0-03 | DONE | 03-Outputs/chien-luoc-khoi-dong-sp-so/D1-05-kpi-tracker.csv |
| 1-06 | Cổng GO/NO-GO (chấm chất-lượng tín-hiệu) | Human | — | số thật | NEED-APPROVAL | 1-05 | TODO | — |

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
## Tiến độ lượt này
- **DONE (9):** 0-03, 0-04a–e, 0-05a, 0-06a, 1-05 — bằng-chứng file thật (engine compliance PASS, E1 ✓).
- **Cổng đang chờ CEO (gom 1 lượt):** 0-01 beachhead · 0-02 runway · 0-05b platform/domain (NEED-INFO).
- **Chờ sau:** 0-04f luật-sư rà · 0-06b kế-toán · 1-04b/1-06 cổng tiền/công-bố · ĐỢT-2 (sau GO).
- **Tự chạy tiếp khi CEO chốt beachhead:** 1-01 lead-magnet · 1-02 landing+email · 1-03 kịch-bản nội-dung · 1-04a presell copy.
