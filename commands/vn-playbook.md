---
description: KHO tái-dùng (playbook) — SOI (xem kho có gì) + DỌN định-kỳ (lọc trùng/hạ-cấp) + DEPRECATE (gỡ tài-sản lỗi-thời). KHÔNG đụng TRA/PROMOTE (giữ AUTO ở PHA 1C/PHA 3). Bản web/mobile.
---

Người-gác-KHO: **soi** và **bảo-trì** kho tài-sản tái-dùng (`knowledge/playbook/`). KHO là cấp **repo/ngành** (xuyên vault) — khác `/vn-status` (1 vault). Lệnh này **CỐ Ý KHÔNG** làm TRA (tái-dùng) và PROMOTE (cất tài-sản): hai cái đó ở lại đúng chỗ tự-động — TRA trong PHA 1C (`vn-architect`), PROMOTE theo rubric trong PHA 3 (`/vn-loop`). Đây chỉ là cửa READ + MAINTAIN.

`$ARGUMENTS` quyết chế-độ: rỗng → **soi**; `dọn` → **dọn định-kỳ**; `deprecate <id> [→ <id-thay-thế>]` → **gỡ 1 tài-sản**. Có thể kèm tên ngành để lọc (vd `/vn-playbook fnb`).

## Engine (giữ nguyên — KHÔNG sửa `lib/kho.js`)

> `lib/kho.js`: `parseIndexMd`/`serializeIndexMd` (đọc/ghi bảng 13 cột) · `raDinhKy(index,{hong})` (dọn: gộp trùng + hạ-cấp grade theo calibration) · `don(id, supersededBy, index)` (deprecate giữ-vết) · `cayThuMuc(id)` (suy đường-dẫn). Chỉ-mục: `knowledge/playbook/<ngành>/_index.md` (khuôn ở `_TEMPLATE/_index.md`). KHO rỗng (chỉ có `_TEMPLATE`) → báo "chưa có tài-sản nào, kho sẽ đầy dần khi `/vn-loop` PROMOTE".

## Chế-độ 1 — SOI (mặc định, READ-ONLY, KHÔNG pause)

1. Glob `knowledge/playbook/*/_index.md` (**bỏ `_TEMPLATE`**). Mỗi file → `parseIndexMd(md)`. Lọc theo ngành nếu `$ARGUMENTS` nêu (hoặc theo `active_packs` trong `<VAULT>/.vncoderc`).
2. Trình bảng gom theo **ngành → khối (K1..K7) → phòng (dept-XX) → bộ-phận**, mỗi dòng: tên-năng-lực · `reuse-grade` (A/B) · `trạng-thái` (live/deprecated) · GĐ · đầu-vào→đầu-ra · nguồn·phiên-bản. Đánh dấu mục `deprecated` riêng.
3. Tóm-tắt cuối: tổng số tài-sản live, phân-bố grade A/B, số deprecated, ngành nào dày/mỏng. KHO rỗng → câu báo ở trên. **Không ghi gì, không git.**

## Chế-độ 2 — DỌN định-kỳ (`/vn-playbook dọn`) — ✅ PAUSE

1. Đọc mỗi `_index.md` → `parseIndexMd`. Suy danh-sách `hong` (tài-sản "đã tái-dùng nhưng hỏng") từ `<VAULT>/00-Brain/calibration.md` (mục đối-soát báo SAI/kém). Không có calibration → `hong = []` (chỉ gộp trùng).
2. `raDinhKy(index, { hong })` → báo-cáo `{ gop:[id...], ha_cap:[{id, grade_moi}] }`: **gộp trùng** (cùng id nhiều bản live → giữ phiên-bản cao nhất, hạ bản cũ thành `deprecated`) + **hạ-cấp grade** A→B→C cho mục calibration báo hỏng.
3. **`AskUserQuestion`** (main loop): trình danh-sách sẽ gộp/hạ-cấp + lý-do → CEO **Duyệt / Bỏ mục X / Huỷ**. Không có gì để dọn → báo "kho sạch", dừng.
4. Duyệt → `serializeIndexMd(index)` ghi đè từng `_index.md` → `git add knowledge/playbook/ && git commit -m "vn-playbook: dọn định-kỳ" && git push`.

## Chế-độ 3 — DEPRECATE (`/vn-playbook deprecate <id> [→ <id-thay-thế>]`) — ✅ PAUSE

1. Tìm `id` trong các `_index.md`. Không thấy mục live → báo lỗi, dừng. `cayThuMuc(id)` để hiện đường-dẫn tài-sản liên-quan.
2. **`AskUserQuestion`**: xác-nhận gỡ `<id>` (kèm `superseded_by` nếu có) → CEO **Duyệt / Huỷ**.
3. Duyệt → `don(id, supersededBy, index)` (soft-delete giữ-vết: `trạng-thái=deprecated` + `superseded_by`, KHÔNG xoá cứng file) → `serializeIndexMd` ghi đè → `git add/commit/push`.

## Sơ-đồ cổng

| Chế-độ | Pause? | Loại |
|---|---|---|
| Soi | ❌ | READ-ONLY |
| Dọn định-kỳ | ✅ | NEED-APPROVAL (CEO duyệt trước khi gộp/hạ-cấp) |
| Deprecate | ✅ | NEED-APPROVAL (CEO duyệt trước khi gỡ) |

**CỐ Ý KHÔNG có** `tra`/`promote` thủ-công: giữ TRA tự-động (PHA 1C) + PROMOTE tự-động theo rubric (PHA 3). Muốn duyệt PROMOTE → đặt `promote_can_duyet: true` ở `.vncoderc` (xem `/vn-loop`).

Mọi output tiếng Việt, mở đầu TL;DR ≤3 câu. Chế-độ/ngành/id: $ARGUMENTS
