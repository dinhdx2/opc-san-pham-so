# Ma-trận phủ — claim → spec

> Bản-đồ phân-công: claim (theo tiền-tố) thuộc về spec nào. Mỗi spec khai `covers:` đúng các claim trong nhóm của nó.
> Kiểm tự-động: `node tools/check-coverage.js`.
> **Trạng-thái hiện-tại: 220/220 claim được phủ — C1 PASS · C2 PASS · C3 PASS.** (15 spec)
> *(B5 đối-kháng đã chạy: +3 claim bổ-sung từ lỗ atomize — LG-G-generic-vs-phan-ra, LG-4.3-chuyen-sau, LG-5.1-activate; scope-creep auditor: NONE đáng sửa.)*

| Nhóm claim | Spec phủ | #claim | Trạng-thái |
|---|---|---|---|
| LG-0-* · LG-G-* | `00-tong-quan-va-thuat-ngu.md` | 46 | ✅ |
| LG-1.1-* · LG-1.2-* · LG-1.3-* · LG-1.4-* | `01-nguyen-ly-va-mo-hinh-tang.md` | 25 | ✅ |
| LG-2-* | `02-brain-schema.md` | 16 | ✅ |
| LG-3-flow | `03-luong-orchestration.md` | 1 | ✅ |
| LG-3-PHA0-* | `03a-pha0-khoi-tao.md` | 6 | ✅ |
| LG-3-PHA1-* | `03b-pha1-phan-ra.md` | 8 | ✅ |
| LG-3-PHA2-* | `03c-pha2-thuc-thi.md` | 4 | ✅ |
| LG-3-PHA3-* | `03d-pha3-khep-vong.md` | 7 | ✅ |
| LG-3-PHA4-* | `03e-pha4-mo-rong.md` | 4 | ✅ |
| LG-4.* | `04-taxonomy-generic.md` | 24 | ✅ |
| LG-5.* | `05-kho-chi-muc.md` | 18 | ✅ |
| LG-6.* | `06-bang-tra-rule-engines.md` | 31 | ✅ |
| LG-7-* | `07-fixture-pho-ha.md` | 6 | ✅ |
| LG-8-* | `08-artifact-vault-layout.md` | 12 | ✅ |
| LG-9-* | `09-codebase-integration-map.md` | 12 | ✅ |
| **Tổng** | **15 spec** | **220** | **✅ C1/C2/C3 PASS** |

**Quy-ước:** một claim có thể được spec khác *tham-chiếu* (link) nhưng chỉ **một** spec *phủ* (khai trong `covers:`) để check-coverage không nhập-nhằng.

**Còn lại (tùy chọn, B5 trong _PLAN.md):** chạy cặp agent đối-kháng (completeness critic đọc lại HTML tìm claim atomize còn sót · scope-creep auditor soi câu spec không trỏ claim) để bắt lỗ atomize mà C1 không thấy.
