---
name: vn-architect
description: Phân-rã sinh-thành PHA 1 của vn-opc — duyệt 11 khía-cạnh sinh cây việc (telos→mục-đích→mục-tiêu→nhiệm-vụ-chính→nhiệm-vụ-con) rồi gom NGƯỢC-LÊN thành cây cấu-trúc (bộ-phận→phòng→khối) có tra-KHO mỗi tầng. Dùng ở Bước 7 vn-orchestrator (cổng A/B). Bản web/mobile.
---

# Skill: vn-architect — Trục dọc sinh-thành (PHA 1)

> Hiện-thực spec **03b (PHA 1)** + luật **01 (mô-hình tầng)** + bảng **04/06** + KHO **05**.
> Khác `pack-architect` (sinh pack ngành): `vn-architect` chạy **chế-độ function-first** — sinh **cây việc + cây cấu-trúc** cho một task/GĐ.
> Engine xác-định ở `lib/`: `tier.js` (`validateDungTang` đúng-tầng · `sinhNhiemVuChinh` · **`validateCayViec` — cổng bẻ-xuống nv-con**), `taxonomy.js` (11 khía-cạnh/7 khối), `rule-engines.js` (goal_by_aspect, reuse_decision, naming_dict), `kho.js` (tra). Gọi `npm test` để kiểm.

Nguyên-tắc bất-biến (kế-thừa spec 01):
- **Cấu-trúc sinh SAU việc** (gom-ngược-lên ở CUỐI), KHÔNG vẽ org-chart trước (INV-5).
- **Sinh mục-tiêu từ KHÍA-CẠNH, KHÔNG từ phòng-ban** (why-aspect, INV-P2) — khía-cạnh là trục bất-biến, không-sót (MECE).
- **Chống nén tầng**: mục-tiêu = TRẠNG-THÁI; nhiệm-vụ-chính = ĐỘNG-TỪ. Mọi item qua `validate_dung_tang`.
- **Tra-KHO mỗi tầng** trước khi đẻ mới (reuse/adapt/new).

---

## Vào / Ra
- **Vào:** `brainContext` (telos/positioning/curves/state — đã qua G0), `stage` (từ PHA 0), `_index.md` KHO ngành (nếu có).
- **Ra:** `<VAULT>/02-Tasks/<slug>/08-execution-plan.md` (cuộn-sóng) + `<VAULT>/02-Tasks/<slug>/06-structure.md` (cây + báo-cáo tra-kho).
- **2 cổng CEO (HITL ở main loop):** **Cổng A** duyệt KHUNG (sớm/rẻ) · **Cổng B** duyệt GỘP plan + cấu-trúc + tra-kho.

## Bước 1A — Lăng-kính khởi-động
Nạp **bộ kính để NGHĨ**: 7 khối + 12 phòng canonical (`knowledge/taxonomy/blocks.yaml`) + pack ngành. KHÔNG cam-kết cấu-trúc ở đây. → vật-liệu **Cổng A**.

## Bước 1B — Sinh cây việc (duyệt 11 khía-cạnh)
> **Scaffold tái-lập:** `lib/flow.js#chuanBiPHA1(stage)` → `{khia_canh_active, luoi_taskgen (5 hàng), thu_tu_gom}` — bám khung này; LLM chỉ điền nội-dung per-DN (điều-kiện-đủ/tên/ngữ-cảnh).

`muc_dich = câu-sống-còn của stage` (rubric `stage-rubric.yaml`, khoác chữ DN). Rồi **duyệt 11 khía-cạnh** (`aspects.yaml`):
1. Cổng cắt-tỉa: "khía-cạnh X có lý-do tồn-tại ở GĐ này?" (`goal_by_aspect(asp, stage).active`) — không → bỏ (phòng tương-ứng ngủ).
2. Sinh `mục-tiêu` = TRẠNG-THÁI (mẫu `aspect-goal.yaml`); `validate_dung_tang` phải OK.
3. `sinh_nhiem_vu_chinh(muc_tieu, brain)` (3 lớp: điều-kiện-đủ → soi 3 chiều tấn/thủ/hậu → quét chéo 11 khía-cạnh → cổng nghiệm đủ/tối-thiểu/không-trùng → neo OKR/KPI).
4. **BẮT BUỘC — KHÔNG ĐƯỢC BỎ QUA:** bẻ **MỖI** nhiệm-vụ-chính → **≥1 nhiệm-vụ-con nguyên-tử**, mỗi nv-con khai `chiều ∈ {tấn 🗡,thủ 🛡,hậu 📦}` + `{đầu-vào → đầu-ra, ràng-buộc}` (soi-3-chiều: 🗡 LÀM gì tạo state · 🛡 state hỏng kiểu gì → việc GÁC · 📦 cần CẤP gì để chạy). Đặt **tên-năng-lực canonical** (`naming_dict`) để 1C tra KHO. **NVC dừng ở dạng động-từ mà KHÔNG có nv-con = phân-rã DỞ-DANG → fail cổng tự-kiểm dưới.**

> CHỈ GĐ hiện-tại chi-tiết; GĐ sau cuộn-sóng (chỉ điều-kiện-cổng).

### Cổng tự-kiểm 1B (BẮT BUỘC chạy TRƯỚC Cổng B — chống "quên bẻ nv-con")
Dựng cây việc thành dữ-liệu `cayViec = [{ id, ten, nv_con:[{ten, chieu}] }]` rồi chạy engine:
```
node -e 'const t=require("./lib/tier");const r=t.validateCayViec(CAY);console.log(JSON.stringify(r,null,2))'
```
- `r.loi` ≠ [] (vd "NVC … CHƯA bẻ xuống nhiệm-vụ-con") → **DỪNG, bẻ tiếp; KHÔNG được mở Cổng B.**
- `r.canh_bao` (thiếu nv-con tấn / cả cây thiếu 1 chiều) → soi lại pre-mortem trước khi trình.
- Đồng-thời mọi mục-tiêu + nhiệm-vụ-chính phải qua `validate_dung_tang` (0 lỗi).

## Bước 1C — Gom NGƯỢC-LÊN + tra-KHO mỗi tầng
Từ danh-sách ĐẦY-ĐỦ nhiệm-vụ-con, gom dần: **TẦNG 0 nhiệm-vụ-con → bộ-phận → phòng (neo `maps_to` 12 canonical) → khối (neo 7 canonical)**. Mỗi tầng **`tra(ctx)`** (`lib/kho.js`, khóa = tên-năng-lực + khía-cạnh + GĐ + đầu-vào/ra) → **REUSE / ADAPT / NEW**:
- REUSE (grade A, ngữ-cảnh trùng) → dùng-luôn; ghi `reused_from`.
- ADAPT (grade B, lệch tham-số) → tinh-chỉnh; ghi delta để PROMOTE sau.
- NEW (không khớp) → đẻ mới; nếu chạy tốt → ứng-viên PROMOTE (PHA 3).

Gắn `gd_kich_hoat` (GĐ hiện-tại = live, còn lại = ngủ). **Việc lặp chưa đủ nhiều → KHÔNG đẻ bộ-phận** (treo dưới phòng, tránh phình tổ-chức).

## Bước 1D — Ưu-tiên
Xếp thứ-tự **action-list của GĐ hiện-tại** → ghi `08-execution-plan.md`.

## Cổng A / Cổng B
- **Cổng A** (sau 1A): `AskUserQuestion` duyệt telos/định-vị/lăng-kính/stage — bắt sai-khung trước khi phân-rã tốn-kém.
- **Cổng B** (sau 1D, **CHỈ mở khi cổng tự-kiểm 1B `r.loi == []`**): `AskUserQuestion` duyệt CÙNG LÚC `08-plan` + `06-structure` + **báo-cáo tra-kho** (reuse/adapt/new) + **xác-nhận đã bẻ nv-con** (số nv-con/NVC + đủ 3 chiều). Bác nhánh nào → cascade sinh-lại nhánh đó. Sau duyệt → ghi 2 file + `git add/commit/push`.

> Việc nặng/độc-lập (1 nhánh khía-cạnh) có thể giao agent qua **Agent tool**; cổng CEO LUÔN ở main loop (`AskUserQuestion` không chạy trong Workflow nền).
