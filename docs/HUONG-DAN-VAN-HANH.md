# Hướng dẫn vận hành vn-opc — dành cho CEO

> **TL;DR:** Đây là sổ tay **làm theo từng bước**. Bạn chỉ cần nhớ 4 lệnh và 1 quy-tắc: `/vn-onboard` (lập DN 1 lần) → `/vn-run` (họp ra quyết-định + kế-hoạch) → `/vn-execute` (hệ tự làm) → quay lại báo **số thật** để hệ học. Quy-tắc: **ở mỗi điểm hệ dừng hỏi, xem [Bản đồ điểm dừng](#4-bản-đồ-mọi-điểm-dừng--gặp-là-làm-gì) để biết bấm gì.** Cuối buổi nhớ để hệ `commit/push`.

Tài liệu này dạy bạn **vận hành** — không cần biết lập trình, chỉ **gõ lệnh hoặc nói bằng lời**. Phần lý-thuyết (vì sao hệ làm vậy) gom ở [Phụ lục](#14-phụ-lục--hiểu-sâu-hơn-tùy-chọn); đọc khi rảnh.

---

## Mục lục
1. [Hệ thống làm gì — và 2 việc đừng nhầm](#1-hệ-thống-làm-gì--và-2-việc-đừng-nhầm)
2. [Chuẩn bị (1 phút)](#2-chuẩn-bị-1-phút)
3. [Quy trình vận hành chuẩn A→Z](#3-quy-trình-vận-hành-chuẩn-az)
4. [Bản đồ MỌI điểm dừng — gặp là làm gì](#4-bản-đồ-mọi-điểm-dừng--gặp-là-làm-gì)
5. [Sổ tay 5 lệnh (khi nào · gõ gì · bạn quyết gì)](#5-sổ-tay-5-lệnh-khi-nào--gõ-gì--bạn-quyết-gì)
6. [Vận hành /vn-execute chi tiết](#6-vận-hành-vn-execute-chi-tiết)
7. [Quay lại với SỐ THẬT — vận hành khép vòng](#7-quay-lại-với-số-thật--vận-hành-khép-vòng)
8. [Quản lý nhiều doanh nghiệp](#8-quản-lý-nhiều-doanh-nghiệp)
9. [Đọc kết quả ở đâu](#9-đọc-kết-quả-ở-đâu)
10. [Lưu dữ liệu (bắt buộc)](#10-lưu-dữ-liệu-bắt-buộc)
11. [An toàn & ranh giới](#11-an-toàn--ranh-giới)
12. [Ví dụ chạy thật A→Z — "Phở Hà"](#12-ví-dụ-chạy-thật-az--phở-hà)
13. [Xử lý sự cố (triệu chứng → cách làm)](#13-xử-lý-sự-cố-triệu-chứng--cách-làm)
14. [Phụ lục — hiểu sâu hơn (tùy chọn)](#14-phụ-lục--hiểu-sâu-hơn-tùy-chọn)

---

## 1. Hệ thống làm gì — và 2 việc đừng nhầm

Bạn có **12 trưởng-phòng AI** (Pháp lý, Chiến lược, Tài chính, Nhân sự, Vận hành, Bán hàng, Marketing, Khách hàng, Sản phẩm, Đào tạo, Báo cáo, Tăng trưởng — pack ngành có thể thêm phòng). Khi bạn ra một yêu cầu (**brief**), các phòng **tranh-luận đối-kháng** (có 1 phòng làm "luật-sư của quỷ") rồi tổng-hợp thành quyết-định cho bạn duyệt.

**3 việc khác nhau — nhớ kỹ:**

| Bạn muốn | Gõ lệnh | Kết quả |
|---|---|---|
| **Ra quyết-định + kế-hoạch** | `/vn-run "<việc>"` | **Tài liệu** để đọc & duyệt. **Không tự làm gì.** |
| **Bắt tay làm thật** | `/vn-execute` | Hệ soạn policy, viết ad, tra số, dựng bảng… **dừng hỏi khi cần.** |
| **Đã chạy xong, có SỐ THẬT → đo & nâng tầng** | `/vn-loop "<việc> — <số>"` | Hệ đo kết-quả so mục-tiêu → **vá** (chưa đạt) / **học & cất cẩm-nang** (đạt) / đề-xuất **lên giai-đoạn / mở-rộng**. |

> Nói cách khác: `/vn-run` = *họp & lên kế-hoạch*; `/vn-execute` = *thi công*; `/vn-loop` = *nghiệm-thu & nâng tầng*. Trình tự thường gặp: `/vn-run` → `/vn-execute` → (sau khi có số) `/vn-loop`.

---

## 2. Chuẩn bị (1 phút)

- Mở một phiên Claude Code (web/mobile/desktop) đang ở repo này. **Không cần API key.**
- Dữ liệu là **file trong repo** (`vault/` hoặc `vaults/<dn>/`) — không cần phần mềm ngoài.
- **Web là tạm-thời:** cuối buổi phải `commit/push` (hệ tự nhắc, bạn đồng ý) — xem [mục 10](#10-lưu-dữ-liệu-bắt-buộc).
- Mỗi phiên mới hệ **tự nhớ** bạn đang ở DN nào, giai-đoạn nào, task nào dở — không phải nhắc lại.

---

## 3. Quy trình vận hành chuẩn A→Z

Làm đúng thứ tự này cho **một DN mới**. Mỗi bước ghi rõ: **bạn GÕ gì → hệ HIỆN gì → bạn LÀM gì.**

```
┌─ BƯỚC 1 · Lập DN (chỉ 1 lần) ─────────────────────────────────────────────┐
│ GÕ :  /vn-onboard "POD store merch fan vlog, US, vốn 5000$/30 ngày"        │
│ HIỆN:  đề-xuất tên thư-mục (slug) + dò ngành (pack) + telos đề-xuất        │
│ LÀM :  duyệt tên slug · (ngành lạ → duyệt phòng mới) · DUYỆT telos (G0)    │
└───────────────────────────────────────────────────────────────────────────┘
┌─ BƯỚC 2 · Kiểm hệ đã hiểu DN ─────────────────────────────────────────────┐
│ GÕ :  /vn-status                                                           │
│ HIỆN:  vault đang dùng · chiến-lược · GIAI-ĐOẠN · ngân-sách · task gần đây │
│ LÀM :  liếc xem đúng chưa; sai số → sửa file trong 00-Brain/ rồi chạy lại  │
└───────────────────────────────────────────────────────────────────────────┘
┌─ BƯỚC 3 · Họp ra quyết-định + kế-hoạch ───────────────────────────────────┐
│ GÕ :  /vn-run "Lập kế hoạch ra mắt store trong 30 ngày, Facebook-first"    │
│ HIỆN & LÀM theo chuỗi ĐIỂM DỪNG (xem §4):                                  │
│   • PAUSE 1  → trả lời vài câu làm-rõ (mỗi câu 2-4 lựa chọn)               │
│   • (Workflow?) → bấm Đồng ý (chạy debate nhiều phòng)                     │
│   • PAUSE 2  → đọc Decision Report → Duyệt / Sửa / Họp lại                 │
│   • Cổng A   → (nếu sinh cây việc) duyệt KHUNG telos/định-vị/stage          │
│   • Cổng B / PAUSE 3 → duyệt Execution Plan + cấu-trúc + báo-cáo tra-kho   │
└───────────────────────────────────────────────────────────────────────────┘
┌─ BƯỚC 4 · Cho hệ thi công ────────────────────────────────────────────────┐
│ GÕ :  /vn-execute                                                          │
│ HIỆN:  sổ tiến-độ 10-run-state.md; tự chạy hết việc máy làm được           │
│ LÀM :  khi hệ GOM câu hỏi → trả lời 1 lượt; duyệt việc tốn tiền/công-bố    │
│        việc cần KYC/ra ngân-hàng → làm theo checklist hệ giao              │
└───────────────────────────────────────────────────────────────────────────┘
┌─ BƯỚC 5 · Quay lại với SỐ THẬT (sau khi chạy) ────────────────────────────┐
│ GÕ :  /vn-loop "ra-mat-store — ROAS 1.4, đơn 35/ngày sau 30 ngày"          │
│ HIỆN:  hệ đo so kế-hoạch → đề-xuất vá tại-chỗ / leo tầng / lên giai-đoạn   │
│ LÀM :  duyệt hướng xử-lý (xem §7)                                          │
└───────────────────────────────────────────────────────────────────────────┘
```

> **Lệnh nào cũng nói bằng lời được:** thay vì gõ `/vn-run "…"`, bạn có thể nói *"Giúp tôi lập kế hoạch ra mắt 30 ngày"* — hệ tự nhận và chạy đúng quy-trình.

---

## 4. Bản đồ MỌI điểm dừng — gặp là làm gì

**Đây là phần quan-trọng nhất.** Hệ chỉ dừng hỏi ở những điểm dưới đây. Khi gặp, tra bảng để biết bấm gì. (Cột "Ở đâu" = trong lệnh nào.)

| Điểm dừng | Ở đâu | Hệ hiện gì | BẠN làm gì |
|---|---|---|---|
| **G0 · Duyệt telos** | cuối `/vn-onboard` | "lẽ-tồn-tại" đề-xuất của DN, để trống chờ bạn | Đọc → sửa nếu mơ-hồ → nói **"telos này được"**. Chưa duyệt → hệ chặn sinh cây việc (cố ý, để khung đúng). |
| **PAUSE 1 · Làm rõ** | đầu `/vn-run` | 1-vài câu hỏi (Brain thiếu số), mỗi câu 2-4 lựa chọn | **Chọn** đáp án (hoặc gõ số thật). |
| **Xác nhận Workflow** | lần đầu `/vn-run` chạy debate | "Dùng Workflow?" | **Đồng ý** (đó là chạy nhiều phòng song-song). |
| **PAUSE 2 · Decision Report** | giữa `/vn-run` | Báo-cáo quyết-định + **cảnh-báo ĐỎ** (rủi-ro pháp-lý) | **Duyệt** / *Sửa phần X* / *Họp lại*. Đọc kỹ cảnh-báo đỏ trước khi duyệt. |
| **Cổng A · Duyệt KHUNG** | trong `/vn-run` (khi cần sinh cây việc) | telos / định-vị / giai-đoạn / lăng-kính phòng | **Duyệt khung** hoặc sửa — *trước* khi hệ phân-rã chi-tiết (rẻ, sửa sớm). |
| **Cổng B · Duyệt plan + cấu-trúc** | cuối `/vn-run` (≡ PAUSE 3) | `08-execution-plan` + `06-structure` + **báo-cáo tra-kho** (việc nào tái-dùng/đẻ-mới) | **Duyệt gộp 1 lượt** / Sửa / Bổ sung KPI. |
| **PAUSE 3 · Execution Plan** | cuối `/vn-run` (brief gọn) | Danh sách đầu việc + người + KPI + deadline | **Duyệt** / Sửa / Bổ sung KPI. |
| **NEED-INFO** | trong `/vn-execute` | Gom các việc thiếu dữ-liệu (giá bán, mật-khẩu, chọn domain…) | **Cấp thông tin** 1 lượt → hệ chạy tiếp. |
| **NEED-APPROVAL** | trong `/vn-execute` | Việc **ra tiền / công-bố / khó hoàn-tác** đã chuẩn-bị xong phần nháp | **Xem & phê-duyệt** → hệ mới thực-thi. |
| **HUMAN-ONLY** | trong `/vn-execute` | Checklist việc chỉ người làm (KYC, ra ngân-hàng) + tiêu-chí "xong = ?" | **Tự làm** theo checklist → báo "xong" + bằng-chứng. |
| **Leo tầng ≥ định-vị** | trong `/vn-loop` | Vá nhiều lần vẫn fail → hệ đề-xuất **đổi định-vị / hào / lẽ-tồn-tại** + bằng-chứng | **Duyệt hướng leo** (hoặc giữ nguyên). Hệ KHÔNG tự đổi telos. |
| **CONG_CEO · giết / đổi-hướng** | trong `/vn-loop` | Hết vòng vá mà chưa có số thật (hoặc chạm telos thiếu căn-cứ) | **Quyết:** dừng việc / đổi hướng. |
| **Cổng GIAI-ĐOẠN** | trong `/vn-loop` | Đủ mục-tiêu giai-đoạn → hệ **họp lại bằng số thật** rồi xin lên GĐ kế | **Duyệt lên giai-đoạn** (hoặc ở lại). |
| **PHA 4 · Quyết mở-rộng** | trong `/vn-loop` (chỉ GĐ5/6) | 3-phép-thử (hào/lẽ-tồn-tại/thương-hiệu) → **nới / đẻ nhánh mới / brand mới** | **Duyệt mở-rộng** → hệ mồi đường-cong mới từ KHO. |
| **Dọn KHO / Deprecate** | trong `/vn-playbook dọn` / `deprecate` | Danh-sách bản trùng/lỗi-thời sẽ gộp/hạ-hạng/gỡ | **Duyệt** mới dọn (giữ vết, không xoá cứng). |

> *PROMOTE (cất cẩm-nang vào KHO) và **vá đơn-vòng** (chỉnh nhẹ trong khuôn cũ) hệ **tự làm**, chỉ báo lại — không bắt bạn duyệt. Muốn duyệt cả PROMOTE → thêm `promote_can_duyet: true` vào `.vncoderc`.*

> **Nguyên-tắc chung khi gặp điểm dừng:** hệ luôn **gom hỏi 1 lượt**, không hỏi vụn vặt. Bạn trả lời xong, hệ **tự chạy tiếp** — không phải nhắc.

---

## 5. Sổ tay 7 lệnh (khi nào · gõ gì · bạn quyết gì)

### 5.1 `/vn-onboard "<mô tả DN + ngành>"`
- **Khi nào:** lần đầu đưa 1 DN vào hệ.
- **Bạn gõ:** mô-tả càng cụ-thể càng tốt — *ngành, vốn, thị-trường, B2B/B2C, mô-hình*. VD: `/vn-onboard "POD store merch fan vlog/hài, US, vốn 5000$/30 ngày, tự dựng Shopify + chạy ads"`.
- **Hệ làm:** đề-xuất slug → tạo `vaults/<slug>/` → dò pack ngành → seed Brain → **đề-xuất telos**.
- **Bạn quyết:** ✔ tên slug · ✔ (ngành lạ) phòng-ban mới · ✔ **telos (G0)**.

### 5.2 `/vn-status`
- **Khi nào:** đầu buổi, hoặc khi muốn biết "máy đang ở đâu".
- **Hệ hiện:** vault active + mọi vault khác · chiến-lược/ICP · **giai-đoạn** · ngân-sách · nhân-sự · quyết-định đã chốt · task gần đây.
- **Bạn quyết:** không cần quyết gì — chỉ kiểm. Số sai → mở `00-Brain/` sửa.

### 5.3 `/vn-run "<brief>"` — họp ra quyết-định + kế-hoạch
- **Khi nào:** cần một quyết-định/kế-hoạch đa-góc-nhìn.
- **Bạn gặp các điểm dừng** (xem §4): PAUSE 1 → PAUSE 2 → (Cổng A → Cổng B) → PAUSE 3.
- **Bạn quyết:** trả lời làm-rõ → duyệt Decision Report → duyệt khung & plan.
- **Hệ tự ghi nhớ:** sau khi duyệt, hệ ghi vào `decisions-log.md` nhãn **"đã chốt — không bàn lại"**; lần họp sau không lật lại.
- **Mẹo:** brief lớn (toàn công-ty) → hệ bung nhiều phòng + tranh-luận 2 vòng (kỹ hơn, chậm hơn). Brief gọn → nhanh & rẻ.

### 5.4 `/vn-execute ["<task>"]` — thi công
- **Khi nào:** sau khi đã có `08-execution-plan.md` được duyệt. Không ghi task → hệ tự chọn task dở gần nhất.
- **Hệ làm:** dựng sổ `10-run-state.md` → tự chạy việc máy làm được → gom cổng hỏi 1 lượt → chạy tiếp.
- Xem chi-tiết ở [§6](#6-vận-hành-vn-execute-chi-tiết).

### 5.5 `/vn-loop "<task> — <số thật>"` — nghiệm-thu & nâng tầng
- **Khi nào:** task đã **chạy thật** và bạn đã có **số** (ROAS, đơn/ngày, biên lãi, KPI…). VD: `/vn-loop "ra-mat-store-30-ngay — ROAS 1.4, đơn 35/ngày"`.
- **Hệ làm:** đo số so mục-tiêu → **chưa đạt** thì vá nhẹ trong khuôn cũ (tự làm), vá hoài không xong thì đề-xuất **leo tầng** (đổi định-vị/hào/telos — *xin bạn duyệt*); **đạt** thì đóng việc + **cất cẩm-nang vào KHO** (tự làm) → nếu đủ mục-tiêu giai-đoạn thì **họp lại bằng số thật** xin **lên GĐ kế**; tới GĐ5/6 lõi khỏe thì chạy **3-phép-thử** xin **mở-rộng**.
- **Bạn quyết (4 điểm):** leo tầng ≥ định-vị · giết/đổi-hướng · lên giai-đoạn · mở-rộng (xem §4). Phần còn lại hệ tự chạy.
- **Khác `/vn-run`:** `/vn-run` mở cuộc họp MỚI; `/vn-loop` *đo lại cái đã làm* rồi nâng tầng — không bàn lại từ đầu.

### 5.6 `/vn-playbook [dọn | deprecate <id>]` — người-gác KHO tái-dùng
- **Khi nào:** muốn **xem** kho cẩm-nang/SOP tái-dùng của DN (cấp ngành, xuyên mọi vault), hoặc **dọn** kho cho gọn, hoặc **gỡ** một tài-sản lỗi-thời.
- **Hệ làm:**
  - `/vn-playbook` (rỗng) → **liệt kê** kho: tài-sản nào, hạng tái-dùng A/B, còn dùng hay đã gỡ. *(Chỉ xem, không hỏi gì.)*
  - `/vn-playbook dọn` → đề-xuất **gộp bản trùng + hạ-hạng** cái đã từng tái-dùng-mà-hỏng → **bạn duyệt** mới dọn.
  - `/vn-playbook deprecate <id>` → **bạn duyệt** mới gỡ (giữ vết, không xoá cứng).
- **Lưu ý:** lệnh này **KHÔNG** tự-tay cất tài-sản (PROMOTE) hay tái-dùng (TRA) — hai việc đó hệ tự làm khi `/vn-loop` đạt KPI và khi `/vn-run` sinh cây việc. `/vn-playbook` chỉ để **soi + bảo-trì** kho.

### 5.7 `/vn-meeting <tên_task>` — họp lại task cũ
- **Khi nào:** muốn chạy lại tranh-luận cho 1 task đã có (vd sau khi cập-nhật Brain).
- **Hệ làm:** đọc lại brief + Brain → ghi đè `07-decision-report.md` mới.

---

## 6. Vận hành /vn-execute chi tiết

Mỗi đầu việc rơi vào **1 trong 4 nhóm**. Việc của bạn chỉ là phản-ứng đúng nhóm:

| Nhóm | Hệ làm | **BẠN làm** |
|---|---|---|
| **AI-AUTO** | Tự chạy ngay (soạn policy, viết ad, tra phí, dựng CSV…) | **Không cần làm gì.** |
| **NEED-INFO** | Để chờ, gom hỏi 1 lượt | **Cấp thông tin** (giá bán, mật-khẩu, chọn domain…). |
| **NEED-APPROVAL** | Chuẩn-bị xong nháp, chờ bạn | **Xem & bấm duyệt** (việc ra tiền/công-bố). |
| **HUMAN-ONLY** | Soạn checklist + tiêu-chí nghiệm-thu | **Tự làm** (KYC, ra ngân-hàng) → báo "xong" + bằng-chứng. |

**Vòng lặp thực tế bạn sẽ thấy:**
1. Hệ chạy một loạt việc AI-AUTO → lưu vào `03-Outputs/`.
2. Hết việc tự chạy → hệ **dừng, gom mọi câu hỏi vào 1 lượt** (NEED-INFO + NEED-APPROVAL + HUMAN-ONLY).
3. Bạn trả lời/duyệt → hệ **tự chạy tiếp** đến khi hết việc máy làm được.
4. **Đóng phiên giữa chừng?** Mở phiên mới, gõ lại `/vn-execute` — hệ đọc sổ, làm tiếp đúng chỗ dở (không làm lại việc `DONE`).

> **Bằng chứng:** mỗi việc `DONE` đều kèm link/file/ảnh thật. Hệ **không ghi "đã làm" suông**.

---

## 7. Quay lại với SỐ THẬT — vận hành khép vòng

Sau khi chạy thật và có **số** (ROAS, đơn, biên lãi…), quay lại gõ **`/vn-loop "<task> — <số thật>"`** (lệnh chuyên cho khép-vòng; vẫn dùng `/vn-run` được nhưng `/vn-loop` đi thẳng vào đo & nâng tầng). Hệ sẽ đo và đề-xuất **theo tầng** — bạn chỉ cần duyệt hướng:

| Hệ thấy | Hệ đề-xuất | Bạn làm |
|---|---|---|
| Gần đạt, lệch nhỏ | **Vá tại-chỗ** (đổi giá/lịch/khuyến-mãi) — *đơn-vòng* | Duyệt thử lại, chưa đổi cấu-trúc |
| Vá vài lần vẫn hỏng | **Leo tầng** — *song-vòng*: sửa cấu-trúc → định-vị → (hiếm) telos | Duyệt tầng hệ chỉ (hệ nói rõ sửa file Brain nào) |
| Đạt KPI/OKR | **PASS việc** (xong) + nếu tài-sản tốt → **PROMOTE** (cất kho tái-dùng) | Xác nhận đóng việc |
| Đủ mục-tiêu giai-đoạn | **Cổng GIAI-ĐOẠN**: họp lại bằng số thật → **lên giai-đoạn kế** | Duyệt lên GĐ → hệ mở kế-hoạch GĐ mới |

> ⚠️ **Hệ sẽ KHÔNG đổi telos chỉ vì một chiến-dịch lỗi** — đó là tính-năng bảo-vệ. Chỉ biến-cố lớn + có bằng-chứng mới chạm telos; còn lại hệ đưa về **bạn quyết** (giết/đổi-hướng) khi vá mãi không xong.

---

## 8. Quản lý nhiều doanh nghiệp

- Mỗi DN = 1 vault `vaults/<slug>/`. Con-trỏ `.vn-active-vault` nhớ bạn đang ở DN nào.
- **Xem mọi DN:** `/vn-status` (đánh dấu cái đang active).
- **Chuyển DN:** nói *"chuyển sang vault `vaults/<slug>`"* hoặc `/vn-onboard` DN mới (tự chuyển). DN cũ nguyên-vẹn.

---

## 9. Đọc kết quả ở đâu

Thường bạn **chỉ cần đọc 2 file**: `07-decision-report.md` (quyết-định) và `08-execution-plan.md` (việc cần làm). Khi thi công, theo dõi `10-run-state.md` (tiến-độ). Toàn cảnh vault:

```
<vault>/
├── 00-Brain/                 ← BỘ NÃO (số thật của DN — hệ đọc trước mọi cuộc họp)
│   ├── telos · positioning · curves        (lẽ-tồn-tại · định-vị · đường-cong)
│   ├── strategy · products · budget · state · headcount   (5 file số-thật)
│   ├── structure                            (sơ-đồ tổ-chức HỆ TỰ SUY từ việc)
│   └── decisions-log · calibration · lessons (bộ-nhớ: đã chốt / học / bài-học)
├── 02-Tasks/<ngày-giờ-slug>/ ← MỖI TASK 1 THƯ MỤC
│   ├── 07-decision-report.md  ← bạn duyệt ở PAUSE 2
│   ├── 06-structure.md        ← cây tổ-chức + báo-cáo tra-kho
│   ├── 08-execution-plan.md   ← bạn duyệt ở PAUSE 3
│   ├── 10-run-state.md        ← sổ tiến-độ (resume được)
│   └── 10-thuc-thi-<action>.md ← SOP chi-tiết / checklist việc người làm
└── 03-Outputs/<slug>/        ← DELIVERABLE THẬT (.md/.csv hoặc .docx/.xlsx)
```

---

## 10. Lưu dữ liệu (bắt buộc)

Web **tạm-thời** — hết phiên là mất nếu chưa lưu. Hệ **tự đề-nghị** `git add/commit/push` sau mỗi mốc; bạn chỉ cần **đồng ý**, hoặc chủ-động nói *"commit và push giúp tôi"*. **Cuối mỗi buổi, hỏi "đã push chưa?"** nếu không chắc.

---

## 11. An toàn & ranh giới

**5 ranh-giới CỨNG — hệ LUÔN dừng hỏi bạn, kể cả khi bạn bảo "cứ tự làm hết":**
💸 chi tiền / đổ ngân-sách / bật ads · ✍️ ký/nộp hồ-sơ pháp-lý · 📢 công-bố ra ngoài (đăng store, publish) · ✉️ gửi email/tin ra ngoài · 🗑️ xoá/ghi-đè không hoàn-tác.

Thêm:
- **Tài liệu pháp-lý/kế-toán đều là MẪU** ("cần luật-sư/kế-toán rà") — đừng ký/nộp khi chưa có chuyên-gia.
- **Không bịa số, không bịa "đã làm"** — thiếu số hệ ghi `[cần CEO xác minh]`.
- **Số tham-khảo ngành ≠ số của bạn** — chỉ scale dựa trên `[số thật DN]`.

---

## 12. Ví dụ chạy thật A→Z — "Phở Hà"

Chuỗi **4 quán** phở, DT ~1.2 tỷ/tháng. CEO khai *"sẵn-sàng GĐ5, muốn mở 10 quán, có nhà-đầu-tư rót vốn."* Đi qua đúng quy-trình §3:

1. **`/vn-onboard "Chuỗi phở Bắc 4 quán TP.HCM, DT 1.2 tỷ/tháng"`** → hệ seed Brain, đề-xuất telos *"bát phở Bắc chuẩn-vị, nhanh, sạch, giá bình-dân"* → **bạn duyệt telos (G0)**.
2. **`/vn-status`** → hệ **cảnh-báo**: khai GĐ5 nhưng số thật (quán-3 biên 6%, quán-4 chưa hoà-vốn) ⟹ **thực-tế GĐ4** → **hoãn vốn & hoãn mở 10 quán** (clone quán-lỗi = nhân-lỗi cả-đàn).
3. **`/vn-run "Làm sao mỗi quán lãi ổn & cẩm-nang lặp được?"`**
   - PAUSE 1: hệ hỏi vài số COGS → bạn cấp.
   - **Cổng A**: duyệt khung "mục-tiêu GĐ4 = 4 quán biên ≥15%".
   - PAUSE 2: đọc Decision Report (ưu-tiên kiểm-soát giá-vốn + khoá nguồn bò + đo COGS realtime).
   - **Cổng B/PAUSE 3**: duyệt Execution Plan + cấu-trúc — hệ báo **4/5 bộ-phận tái-dùng kho**, chỉ "BI/Báo-cáo" làm mới.
4. **`/vn-execute`** → hệ soạn SOP, tra giá bò thật, dựng dashboard COGS (AI-AUTO); **dừng hỏi**: "ký hợp-đồng NCC" = **NEED-APPROVAL** → bạn duyệt mới ký.
5. **Sau 1 quý, `/vn-loop "chuoi-pho — quán-3 vẫn ế dù đã giảm giá 2 lần"`** → hệ leo **song-vòng → định-vị**: *mặt-bằng sai đầu-cầu* → đề-xuất **đóng/dời quán-3** (KHÔNG đụng telos). 3 quán còn lại ≥15% → **PASS GĐ4 + PROMOTE cẩm-nang** → **lên GĐ5** → giờ mới mở quán 5-10.

---

## 13. Xử lý sự cố (triệu chứng → cách làm)

| Triệu chứng | Cách làm |
|---|---|
| Hệ không biết tôi ở DN nào | `/vn-status`; sai vault → nói *"chuyển sang vault `vaults/<slug>`"*. |
| `/vn-run` báo thiếu Brain / gợi onboard | Brain thiếu ≥3 file hoặc thiếu `strategy`/`state`. Chạy `/vn-onboard` hoặc bổ-sung 2 file đó. |
| Hệ chặn ở "G0" / đòi duyệt telos | Mở `00-Brain/telos.md`, sửa cho rõ (tránh "làm điều tốt"/"số 1"), nói *"telos này được"*. |
| Hệ "giữ GĐ4" dù tôi khai GĐ5 | Đúng thiết-kế — hệ tin **số thật** hơn nhãn. Muốn lên GĐ → phải đủ mục-tiêu GĐ hiện-tại. |
| Lỡ đóng phiên khi đang `/vn-execute` | Mở phiên mới → `/vn-execute` → hệ làm tiếp đúng chỗ dở. |
| Claude hỏi xác-nhận "Workflow" | **Đồng ý** (chạy debate nhiều phòng). |
| Muốn `.docx/.xlsx` thay vì `.md/.csv` | Cần công-cụ `office-docs` trong phiên; không có thì hệ xuất `.md/.csv`. |
| Sợ mất dữ liệu | Hỏi *"đã commit và push chưa?"*. |

---

## 14. Phụ lục — hiểu sâu hơn (tùy chọn)

*Phần này giải-thích **vì sao** hệ làm vậy. Không cần đọc để vận hành.*

**Hai trục.** *Trục ngang* = 12 phòng tranh-luận (chất-lượng quyết-định). *Trục dọc* = hệ suy mọi thứ **từ telos → cấu-trúc**: telos → định-vị/moat → đường-cong → 6 giai-đoạn → **việc** → (gom ngược-lên) bộ-phận → phòng → khối. Cấu-trúc tổ-chức là **kết-quả gom việc**, không vẽ sẵn.

**5 pha (PHA 0→4) — chính là chuỗi điểm dừng ở §4:** PHA 0 lập Brain + dò giai-đoạn + cổng G0 · PHA 1 phân-rã sinh cây việc (Cổng A/B) · PHA 2 thi công từng việc · PHA 3 khép-vòng (vá → leo tầng → PASS/PROMOTE → lên GĐ) · PHA 4 mở-rộng (đường-cong mới, 3 phép-thử moat/telos/brand).

**Hệ "nghĩ" thế nào để không sót việc.** Mục-tiêu sinh từ **11 khía-cạnh** bất-biến (Sản-phẩm · Thị-trường · Khách · Tiền · Người · Hậu-cần · Vận-hành · Dữ-liệu · Rủi-ro · Đối-tác · Bền-vững), không từ phòng-ban. Mỗi mục-tiêu (1 **trạng-thái**, vd "thu tiền sẵn-sàng") được bẻ thành **điều-kiện-đủ** → mỗi điều-kiện chưa-đạt thành 1 việc; soi đủ **3 chiều** (🗡 tấn = làm · 🛡 thủ = gác · 📦 hậu = cấp nguồn-lực); quét chéo 11 khía-cạnh bắt việc sót; rồi back-test "mọi việc xong → mục-tiêu tự đúng?".

**Giai-đoạn GĐ1→GĐ6** mỗi cái 1 câu-hỏi-sống-còn: khả-thi → PMF (khách quay-lại & trả tiền) → giao thật → lãi/đơn-vị → nhân không vỡ → duy-trì & đẻ dòng mới. Hệ **dò giai-đoạn từ số thật** để chặn "mở-rộng quá sớm".

**KHO tái-dùng.** Tài-sản chạy tốt (SOP, template) được **PROMOTE** vào `knowledge/playbook/<ngành>/` + ghi 1 dòng chỉ-mục `_index.md`; DN/đường-cong sau **tra & tái-dùng** (reuse/adapt/new), khỏi làm lại — "kho càng dày, đẻ đường sau càng rẻ".

**Bảng tra lệnh nhanh:**

| Lệnh | Dùng khi | Kết quả |
|---|---|---|
| `/vn-onboard "<DN+ngành>"` | Lập DN mới | Vault + Brain + telos chờ duyệt |
| `/vn-status` | Xem hệ hiểu gì | Tóm-tắt Brain + giai-đoạn + task |
| `/vn-run "<brief>"` | Cần quyết-định/kế-hoạch | Decision Report + Execution Plan (qua các điểm dừng §4) |
| `/vn-execute ["<task>"]` | Cho hệ thi công | Deliverable thật + sổ tiến-độ (resume) |
| `/vn-meeting <task>` | Họp lại task cũ | Decision Report mới |

**Thuật ngữ tối-thiểu:** *telos* lẽ-tồn-tại (CEO quyết) · *moat* lợi-thế khó-sao-chép · *đầu-cầu* thị-trường hẹp chiếm trước · *PMF* khách quay-lại & trả tiền · *đơn-vòng/song-vòng* vá-tại-chỗ / sửa-cấu-trúc · *PASS≠PROMOTE* đạt-KPI ≠ cất-kho · *G0* cổng kiểm telos · *HITL* điểm người duyệt.

---

*Tài liệu kỹ-thuật cho AI/lập-trình-viên: `docs/AI-CONTEXT.md` · `README.md` · `CLAUDE.md`. Bản thiết-kế gốc (SoT): `docs/design/luong-generic-v3/` (`luong-generic-v3.html` + `specs/`). Engine + test: `lib/` + `npm test` (164 case) + `npm run check-impl`.*
