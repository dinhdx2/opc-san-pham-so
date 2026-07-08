# Sổ thực thi (run ledger) — Khởi động SP số Ngách A

> **TL;DR:** Sổ nguồn-sự-thật để resume. Executor tự chạy các bước 🟢 AI-AUTO không phụ-thuộc beachhead (protocol đo, 5 văn-bản compliance MẪU, kế-hoạch hạ-tầng, research thuế), rồi gom cổng 🟡/🔴 hỏi CEO 1 lượt (beachhead, runway, platform). Việc phụ-thuộc beachhead (lead-magnet, landing, email, nội-dung) chạy sau khi CEO chốt.
>
> Neo: `08-execution-plan.md` · `decisions-log.md` 2026-07-07 (Ngách A). Cổng cứng (tiền/pháp-lý/công-bố) LUÔN NEED-APPROVAL.

**Trạng thái:** TODO · DOING · BLOCKED-INFO · BLOCKED-APPROVE · HUMAN · DONE · FAILED

## PHA 0 — Nền-móng & compliance

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| P0-01 | Thu-hẹp beachhead xuống 1 nghề cụ-thể (AI đề-xuất 4 options → CEO chọn) | AI+Human | — | CEO chọn | NEED-INFO | — | BLOCKED-INFO | — |
| P0-02 | Xác-minh runway sinh-hoạt founder (tách war-chest, ≥60–90 ngày) | Human | — | số của CEO | NEED-INFO | — | BLOCKED-INFO | — |
| P0-03 | Soạn protocol đo lường (ngưỡng go/no-go theo 3 kịch-bản vốn 20/50/100tr) | AI | file | — | none | — | DONE | 03-Outputs/.../P0-03-protocol-do-luong.md |
| P0-04a | Draft EULA/License SP số (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-1-eula.md |
| P0-04b | Draft Content Rights Clearance checklist (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-2-content-rights.md |
| P0-04c | Draft Privacy Policy + consent NĐ 13/2023 (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-3-privacy.md |
| P0-04d | Draft Ad Compliance Review checklist Luật QC (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-4-ad-review.md |
| P0-04e | Draft SOP Refund + mốc giao hàng (Luật BVQLNTD 19/2023) (MẪU) | AI | file | — | none | — | DONE | 10-thuc-thi-compliance-5-refund-sop.md |
| P0-04f | Luật-sư rà + CEO duyệt 5 văn-bản trước khi publish | Human | — | luật-sư | NEED-APPROVAL | P0-04a..e | HUMAN | — |
| P0-05a | Kế-hoạch hạ-tầng bán self-host (so-sánh LMS/cổng thanh-toán VN + phí thật) | AI | web,file | — | none | — | DONE | 10-thuc-thi-ha-tang-ban.md |
| P0-05b | Chọn platform + domain | Human | — | CEO chọn | NEED-INFO | P0-05a | BLOCKED-INFO | — |
| P0-05c | Đăng-ký platform/domain/cổng thanh-toán (KYC) | Human | — | KYC | HUMAN | P0-05b | HUMAN | — |
| P0-06a | Research ngưỡng thuế hộ KD hiện-hành (WebSearch) | AI | web | — | none | — | DONE | 10-thuc-thi-thue-research.md |
| P0-06b | Kế-toán xác-minh + cập-nhật Brain thuế | Human | — | kế-toán | NEED-INFO | P0-06a | HUMAN | — |

## ĐỢT-1 — Validate (dep beachhead P0-01)

| id | hành động | owner | tool | cần (input) | cổng | phụ thuộc | trạng thái | bằng chứng |
|---|---|---|---|---|---|---|---|---|
| D1-01 | Làm lead-magnet miễn-phí (bộ prompt/mini-template AI, sạch bản-quyền) | AI | file | beachhead | none | P0-01 | TODO | — |
| D1-02 | Viết landing page + chuỗi email (3–5) | AI | file | beachhead | none | P0-01 | TODO | — |
| D1-03 | Soạn 8–12 kịch-bản nội-dung content-led (TikTok/Shorts/Reels) | AI | file | beachhead | none | P0-01 | TODO | — |
| D1-04a | Draft trang presell/tripwire copy (49–99k) | AI | file | beachhead | none | P0-01 | TODO | — |
| D1-04b | Mở presell thu tiền thật | Human | — | live | NEED-APPROVAL | P0-04e,D1-04a | TODO | — |
| D1-05 | Dựng bảng đo KPI (CSV tracker funnel) | AI | file | — | none | P0-03 | DONE | 03-Outputs/.../D1-05-kpi-tracker.csv |
| D1-06 | Cổng GO/NO-GO (chấm chất-lượng tín-hiệu) | Human | — | số thật | NEED-APPROVAL | D1-05 | TODO | — |

## ĐỢT-2 — Sản-xuất + scale (dep GO D1-06) — chưa mở

| id | hành động | owner | cổng | phụ thuộc | trạng thái |
|---|---|---|---|---|---|
| D2-01 | Sản-xuất hero đầy-đủ (freelancer NDA+work-for-hire) | AI+Human | NEED-APPROVAL | D1-06 | TODO |
| D2-02 | Anti-piracy (watermark/license/EULA/link hạn) | AI | none | D1-06 | TODO |
| D2-03 | Chốt giá hero theo WTP | Human | NEED-APPROVAL | D1-06 | TODO |
| D2-04 | Mở bán hero + upsell | Human | NEED-APPROVAL | D2-01..03 | TODO |
| D2-05 | Scale ads có kỷ-luật (LTV/CAC>1) | AI+Human | NEED-APPROVAL | D2-04 | TODO |
| D2-06 | Xác-nhận PMF → /vn-loop | AI | none | D2-04 | TODO |

---
## Cổng đang chờ CEO (gom 1 lượt)
- **P0-01 beachhead** (NEED-INFO) · **P0-02 runway** (NEED-INFO) · **P0-05b platform/domain** (NEED-INFO).
- **P0-04f** rà pháp-lý · **P0-06b** kế-toán · **D1-04b/D1-06** cổng tiền/công-bố → sau.
