---
description: Khép-vòng có tầng (PHA 3) + mở-rộng tái-nhập (PHA 4) cho 1 task vn-opc đã có SỐ THẬT — đo so neo → đơn/song-vòng → PASS/PROMOTE → cổng-giai-đoạn → (GĐ5/6) 3-phép-thử mở-rộng. Bản web/mobile.
---

Kích hoạt **lớp KHÉP-VÒNG** của skill `vn-orchestrator` (**Bước 11 + 11b**, PHA 3 → PHA 4) cho một task **đã chạy thực** và CEO **đã có SỐ THẬT** (ROAS, đơn/ngày, biên lãi, KPI…). KHÔNG mở debate mới như `/vn-run`; đây là vòng *đo → học → nâng tầng*.

`$ARGUMENTS` = tên task (thư mục trong `<VAULT>/02-Tasks/`) + số thật. VD: `/vn-loop "ra-mat-store-30-ngay — ROAS 1.4, đơn 35/ngày sau 30 ngày"`. Thiếu số thật → dừng hỏi CEO (NEED-INFO) trước khi đo.

## Quy trình (engine xác-định — KHÔNG ước-lượng tay)

> Engine: `lib/loop.js` (`khepVong`/`congPass`/`congGiaiDoan`/`guardTelos`/`nextStage`) · `lib/rule-engines.js#routeSongVong` · `lib/kho.js` (`them`/`xetPromote`) · `lib/flow.js#chay3PhepThu`. **K** ở `knowledge/rule-engines/loop-config.yaml` (mặc định 3). Mọi cổng CEO chạy ở **main loop** (`AskUserQuestion`), KHÔNG trong Workflow.

1. **Định vị task + nạp số thật.** Resolve vault (`lib/vault.js#resolveActiveVault`, fallback `vault/`) → `<VAULT>`. Đọc task trong `<VAULT>/02-Tasks/<task>/`: `08-execution-plan.md` (neo OKR/KPI), `07-decision-report.md`, sổ `10-run-state.md` nếu có. Trích số thật từ `$ARGUMENTS` (hoặc đọc `<VAULT>/00-Brain/state.md`). Thiếu số neo/ngưỡng → **NEED-INFO**, hỏi CEO 1 lượt.
2. **Đo so neo (read-only).** `congPass({do_duoc, nguong})` cho từng nhiệm-vụ-chính; `dat_kpi` = mọi neo PASS. Đếm `vong_da_chay` = số dòng đã ghi cho task này ở `<VAULT>/00-Brain/lessons.md`.
3. **Gọi `khepVong({dat_kpi, vong_da_chay, co_so_that, tin_hieu, bien_co_the_gioi, co_bang_chung})`** → xử theo `ket`:
   - **`PASS`** → việc xong → sang Cổng PROMOTE (mục 4) + Cổng GIAI-ĐOẠN (mục 5).
   - **`DON_VONG`** (vòng < K) — **KHÔNG pause** → vá tại-chỗ trong khuôn cũ (đổi tham-số/lịch/khuyến-mãi), ghi 1 dòng `lessons.md` (tăng `vong_da_chay`), chạy lại. *Hành động vá nếu chạm tiền/công-bố/pháp-lý sẽ được cổng cứng của `/vn-execute` gác — không gác 2 lần ở đây.* Thông báo CEO 1 dòng tóm tắt bản vá.
   - **`SONG_VONG`** (hết K + có số thật) → engine trả `tang_leo`/`file_neo`:
     - `tang_leo == cau-truc` (tầng thấp nhất) — **KHÔNG pause riêng**: neo Brain + append `decisions-log.md` nhãn `altitude` rồi **cascade quay PHA 1** (sinh-lại nhánh dưới). Điểm CEO duyệt rơi tự nhiên vào **Cổng A/B** của PHA 1 — tránh double-gate.
     - `tang_leo ∈ {định-vị, moat, telos}` — **✅ PAUSE (NEED-APPROVAL)**: `AskUserQuestion` trình tầng leo + bằng-chứng, CEO quyết trước khi neo Brain. *`guardTelos` đã chặn leo telos nếu thiếu biến-cố-thế-giới + bằng-chứng → khi đó engine trả `CONG_CEO`, KHÔNG tự sửa `telos.md`.* Duyệt xong → neo đúng file Brain + `decisions-log.md` nhãn `altitude` + cascade PHA 1.
   - **`CONG_CEO`** (hết K chưa có số thật, HOẶC chạm telos thiếu biến-cố) — **✅ PAUSE**: `AskUserQuestion` (giết / đổi-hướng) ở main loop. KHÔNG lặp mù, KHÔNG tự sửa `telos.md`.
4. **Cổng PROMOTE (TÁCH khỏi PASS) — KHÔNG pause, AUTO theo rubric.** Tài-sản đạt reuse-grade A/B (`lib/kho.js#xetPromote`) → `lib/kho.js#them` chèn 1 dòng `_index.md` + **GHI file tài-sản** vào `knowledge/playbook/<ngành>/<Kx>/<dept>/<bộ-phận>/`. Grade C/chưa chuẩn → bỏ qua. **Gom 1 thông báo** cuối lượt: "đã cất X, Y vào KHO". *Tùy chọn: nếu `<VAULT>/.vncoderc` có `promote_can_duyet: true` → chuyển PROMOTE thành PAUSE; mặc định AUTO.*
5. **Cổng GIAI-ĐOẠN — ✅ PAUSE.** `congGiaiDoan({du_muc_tieu, stage, re_debate_pass})`: đủ mục-tiêu GĐ → **re-debate SỐ THẬT** (chạy lại Workflow `debate.js` khoanh phòng, chống mở-rộng-sớm) → quay main loop → `AskUserQuestion` trình kết-quả re-debate, CEO duyệt → `stage = stage_ke` (ghi `state.md`) → quay **PHA 1** mở chi-tiết GĐ kế. Re-debate FAIL (PMF chưa thật) → ở-lại GĐ (cờ `BLOCK_MO_RONG_SOM`).
6. **PHA 4 — mở-rộng tái-nhập (chỉ khi `stage ∈ {GĐ5, GĐ6}` + lõi khỏe) — ✅ PAUSE.** `lib/flow.js#chay3PhepThu` (moat/telos/brand) → `AskUserQuestion` trình kết-quả 3-phép-thử + lựa chọn **GĐ5-nới / GĐ6-đẻ / brand-mới**. CEO duyệt mới `taiNhapBootstrap` MỒI đường-cong mới từ KHO. Nhánh **GĐ6-đẻ / brand-mới** = tái-nhập PHA 0/1 → **bàn giao `/vn-onboard` (curve mới, qua G0 lại) hoặc `/vn-run`**. KHÔNG tự ý mở-rộng khi stage < GĐ5 (chống mở-rộng-sớm).
7. **Hiệu chỉnh + lưu bền vững.** Append đối-soát "phòng khuyến-nghị → kết-quả thực → đúng/sai" vào `<VAULT>/00-Brain/calibration.md`. Sau mỗi mốc: `git add <VAULT>/ knowledge/playbook/ && git commit && git push`.

## Sơ-đồ cổng (4 PAUSE · phần còn lại AUTO)

| Điểm | Pause? | Loại |
|---|---|---|
| Đo so neo / verdict | ❌ | AI-AUTO (read-only) |
| ĐƠN-VÒNG vá tại-chỗ | ❌ | AI-AUTO + notify (cổng cứng gác ở `/vn-execute`) |
| SONG-VÒNG leo tầng = cấu-trúc | ⚠️ hoãn | để Cổng A/B của PHA 1 (cascade) |
| SONG-VÒNG leo tầng ≥ định-vị | ✅ | NEED-APPROVAL |
| CONG_CEO (giết/đổi-hướng) | ✅ | NEED-APPROVAL |
| Cổng PROMOTE | ❌ | AI-AUTO + gom báo (rubric A/B; `promote_can_duyet` để bật pause) |
| Cổng GIAI-ĐOẠN (đổi stage) | ✅ | NEED-APPROVAL (re-debate số thật trước) |
| PHA 4 quyết mở-rộng (GĐ5/6) | ✅ | NEED-APPROVAL |

Mọi output tiếng Việt, mở đầu TL;DR ≤3 câu. Task + số thật: $ARGUMENTS
