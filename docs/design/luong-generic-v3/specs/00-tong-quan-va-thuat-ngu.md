---
id: 00-tong-quan-va-thuat-ngu
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §0 (dòng 166-186) + Glossary (dòng 697-742)"
covers: [LG-0-1, LG-0-2, LG-0-3, LG-0-4, LG-0-5, LG-G-telos, LG-G-moat, LG-G-beachhead, LG-G-wedge, LG-G-s-curve, LG-G-11-khia-canh, LG-G-du-lieu, LG-G-hau-can, LG-G-doi-tac, LG-G-ben-vung, LG-G-khoi-phong-bo-phan, LG-G-gom-nguoc-len, LG-G-dieu-kien-du, LG-G-sinh-nvc-3-lop, LG-G-back-test, LG-G-pre-mortem, LG-G-ten-kep, LG-G-kho-index, LG-G-reuse-adapt-new, LG-G-reuse-grade, LG-G-pmf, LG-G-lifecycle-gd, LG-G-optimize-before-scale, LG-G-cash-cow, LG-G-second-curve, LG-G-ambidexterity, LG-G-single-double-loop, LG-G-altitude-tempo, LG-G-tancong-phongthu-haucan, LG-G-re-founding, LG-G-okr-kpi, LG-G-rolling-wave, LG-G-waterfall, LG-G-bootstrap, LG-G-promote, LG-G-cascade, LG-G-fractal, LG-G-hitl, LG-G-mece, LG-G-g0, LG-G-generic-vs-phan-ra]
depends_on: []
milestone: M1
---

# 00 · Tổng-quan & Thuật-ngữ

## 1. Mục-đích & phạm-vi
Spec này là **spec NỀN** của bộ thiết-kế Luồng Generic v3. Nó hiện-thực hai phần của SoT: (a) **§0 Bối-cảnh** — giải-thích kiến-trúc 2 trục (trục dọc *sinh-thành* gặp trục ngang *tranh-luận*) và ranh-giới bất-biến của việc nâng-cấp; (b) **Glossary** — từ-điển thuật-ngữ chuẩn (41 term) làm khóa tham-chiếu cho mọi spec khác.
**In:** mô-hình khái-niệm 2 trục, định-nghĩa chuẩn từng thuật-ngữ, ranh-giới GIỮ/ĐẮP, luật "không thuật-ngữ mồ-côi".
**Out:** mọi luồng/pha/schema cụ-thể (thuộc spec 01–09); spec này chỉ *định-nghĩa* và *liên-kết*, không *thực-thi* hành-vi.

## 2. Thuật-ngữ liên-quan
Đây chính là spec định-nghĩa thuật-ngữ — mọi spec khác link NGƯỢC về đây qua mục §3 (bảng từ-điển chuẩn). Spec này không link ra ngoài; nó là gốc của đồ-thị tham-chiếu. Khi một spec dùng term `X`, nó ghi `→ 00-tong-quan-va-thuat-ngu.md#LG-G-X`.

## 3. Mô-hình dữ-liệu

### 3.1 · Kiến-trúc 2 trục (mô-hình khái-niệm)
| Trục | Bản-chất | Hệ hiện-có | Vai-trò |
|---|---|---|---|
| **Trục DỌC** (sinh-ththành) | Khuôn-OS sinh-thành 5 tầng: telos → định-vị × moat → đường-cong → vòng-đời GĐ1→GĐ6 → cấu-trúc (khối/phòng/bộ-phận, SUY ngược lên) + khép-vòng "chạy-thật → sửa lên" | **Vắng** trong vn-opc (Brain phẳng 1 tầng) | Đắp vào chỗ-mù lớn nhất |
| **Trục NGANG** (tranh-luận) | 12 phòng vẽ-sẵn → `debate.js` 4 pha (Perspectives → Cross-exam → Red-team → Synthesize) → quyết-định + kế-hoạch → vn-executor | **Mạnh** sẵn trong vn-opc | GIỮ NGUYÊN engine |

Hai trục **bổ-trợ** nhau (LG-0-1): dọc cho *sinh-thành chiều sâu*, ngang cho *quyết-định chất-lượng*.

### 3.2 · Bảng từ-điển thuật-ngữ chuẩn (41 term)
Mỗi term là 1 hàng `{thuật-ngữ | định-nghĩa | dùng ở spec/module nào}`. Đây là nguồn-sự-thật cho `tools/check-coverage.js` khi kiểm "không thuật-ngữ mồ-côi".

| Thuật-ngữ (id) | Định-nghĩa chuẩn | Dùng ở spec / module |
|---|---|---|
| **generic vs phân-rã** (LG-G-generic-vs-phan-ra) | Generic = khung/bảng-phân-loại/luật cố-định (viết 1 lần); phân-rã = nội-dung suy-ra mỗi DN. | 01-nguyen-ly §5, xuyên mọi spec |
| **telos** (LG-G-telos) | Lý-do-tồn-tại cốt-lõi: hướng đuổi mãi, không phải đích đạt-rồi-xong. | 02-brain (telos.md), 03-luong-pha §PHA0, §6 altitude |
| **moat** (LG-G-moat) | Cỗ-máy/hào — lợi-thế-bền khó-sao-chép (khác "chỉ nhanh hơn"). | 02-brain (positioning.md), §6 leo-tầng moat, §3 PHA4 test① |
| **beachhead** (LG-G-beachhead) | Đầu-cầu — lãnh-thổ hẹp chiếm & thống-trị trước. | 02-brain (positioning.md), §6 leo-tầng định-vị |
| **wedge** (LG-G-wedge) | Mũi-nêm — nước-đi-đầu mỏng nhất (= điểm-xuất-phát). | 02-brain (positioning.md) |
| **s-curve** (LG-G-s-curve) | Đường-cong — một dòng KD có quỹ-đạo sinh→lớn→bão-hoà. | 02-brain (curves.md), §3 PHA4, fractal |
| **11 khía-cạnh** (LG-G-11-khia-canh) | Bảng MECE generic "cần đạt CÁI GÌ", 4 nhóm: GIÁ-TRỊ / NGUỒN-LỰC / VẬN-HÀNH&TRI-THỨC / BẢO-VỆ&QUAN-HỆ. | 04-taxonomy (11 khía-cạnh↔phòng), §3 PHA1B, §6.3 |
| **dữ-liệu (khía-cạnh)** (LG-G-du-lieu) | Khía-cạnh dữ-liệu: tài-sản & đo-lường (instrument, analytics, privacy, IP-dữ-liệu) — tách khỏi hậu-cần. | 04-taxonomy (khía-cạnh 8) |
| **hậu-cần (khía-cạnh)** (LG-G-hau-can) | Khía-cạnh hậu-cần: chuỗi-cung & hạ-tầng đầu-vào (mua, kho, vận-chuyển, cloud). | 04-taxonomy (khía-cạnh 6) |
| **đối-tác/hệ-sinh-thái** (LG-G-doi-tac) | Khía-cạnh đối-tác: kênh, liên-minh, nền-tảng 2-phía, nhượng-quyền, dev/API, JV. | 04-taxonomy (khía-cạnh 10 MỚI) |
| **bền-vững/stakeholder** (LG-G-ben-vung) | Khía-cạnh bền-vững: giấy-phép-xã-hội, niềm-tin quản-lý, môi-trường/ESG. | 04-taxonomy (khía-cạnh 11 MỚI) |
| **khối / phòng / bộ-phận** (LG-G-khoi-phong-bo-phan) | Ba tầng cấu-trúc: 7 khối canonical ▷ 12 phòng canonical ▷ bộ-phận (lá). | 04-taxonomy (7 khối/12 phòng), §3 PHA1C |
| **gom ngược-lên** (LG-G-gom-nguoc-len) | Suy cấu-trúc từ dưới: nhiệm-vụ-con → bộ-phận → phòng → khối (cấu-trúc ở CUỐI). | 09-architect (PHA1C), §3 PHA1C |
| **điều-kiện-đủ** (LG-G-dieu-kien-du) | Tập điều-kiện mà khi ĐỒNG-THỜI đúng thì trạng-thái-đích tự-động thành-hình. | 09-architect (§1.4 L1), §6.4 |
| **sinh nhiệm-vụ-chính 3 lớp** (LG-G-sinh-nvc-3-lop) | Cơ-chế sinh nhiệm-vụ-chính: điều-kiện-đủ → lưới 3 chiều → chéo 11 khía-cạnh → back-test. | 09-architect (§1.4), §6.4 |
| **back-test** (LG-G-back-test) | Giả-định mọi nhiệm-vụ-chính done → mục-tiêu có TỰ-ĐỘNG đúng không. | 09-architect (cổng nghiệm §1.4), §6.4 |
| **pre-mortem** (LG-G-pre-mortem) | Hỏi trước "state này hỏng kiểu gì?" để sinh việc phòng-thủ. | 09-architect (lớp 2 SOI thủ) |
| **tên-kép** (LG-G-ten-kep) | 3 nhãn/đơn-vị: tên-ngành + tên-năng-lực-chuẩn + ánh-xạ canonical. | 04-taxonomy (§4.3), department.yaml aliases_vn |
| **KHO / _index.md** (LG-G-kho-index) | Kho tái-dùng theo ngành + chỉ-mục chuẩn (khối→phòng→bộ-phận) để tra/thêm/dọn. | 05-kho (KHO chỉ-mục), §3 PHA1C/PHA4 |
| **reuse / adapt / new** (LG-G-reuse-adapt-new) | 3 kết-quả tra-kho: dùng-luôn / tinh-chỉnh / đẻ-mới (theo khớp ngữ-cảnh). | 05-kho (§6.5 rubric), §3 PHA1C |
| **reuse-grade** (LG-G-reuse-grade) | Hạng tái-dùng: A dùng-luôn · B cần tinh-chỉnh · C tham-khảo. | 05-kho (cột reuse-grade §5.2) |
| **PMF** (LG-G-pmf) | Khớp sản-phẩm–thị-trường: khách chủ-động quay-lại & trả tiền. | 06-bang-tra (GĐ2), §3 PHA0 stage |
| **lifecycle / GĐ1-6** (LG-G-lifecycle-gd) | Vòng-đời mỗi đường-cong: 6 GĐ, mỗi GĐ = 1 câu-hỏi-sống-còn. | 06-bang-tra (§6.1), §3 PHA0/PHA3 |
| **optimize-before-scale** (LG-G-optimize-before-scale) | Tối-ưu cho sạch RỒI mới nhân-bản; nhân chưa-sạch = nhân-lỗi cả-đàn. | §9 gate-optimize (debate.js Red-team), §6 |
| **cash cow** (LG-G-cash-cow) | Bò-sữa — dòng chín, lời đều, nuôi bet khác. | 06-bang-tra (GĐ6), §3 PHA4 |
| **second curve / điểm-A** (LG-G-second-curve) | Gieo đường-cong kế khi lõi còn khỏe (điểm-A), không đợi suy (điểm-B). | 06-bang-tra (GĐ6), §3 PHA4 |
| **ambidexterity** (LG-G-ambidexterity) | Hai-tay — vừa vắt lõi vừa gieo dòng mới (GĐ6). | 06-bang-tra (GĐ6), §3 PHA4 |
| **single/double-loop** (LG-G-single-double-loop) | Đơn-vòng = vá trong khuôn cũ; song-vòng = sửa chính cái khuôn (tầng trên). | 03-luong-pha (§PHA3 đơn/song-vòng) |
| **altitude / tempo** (LG-G-altitude-tempo) | Độ-cao/nhịp quyết-định: telos đổi chậm nhất, cấu-trúc nhanh nhất. | 02-brain (§2 altitude), §6.2 leo-tầng, decisions-log |
| **attack/defense/logistics** (LG-G-tancong-phongthu-haucan) | 3 chiều: tấn (việc LÀM) · thủ (việc GÁC, "hỏng kiểu gì?") · hậu-cần (tiền/máy/dữ-liệu/người). | 09-architect (lăng-kính 3 chiều), §1.4 L2 |
| **re-founding** (LG-G-re-founding) | Tái-lập-nền — đổi chính telos, ngoài vòng-đời. | 03-luong-pha (§PHA3 warn), 02-brain |
| **OKR / KPI** (LG-G-okr-kpi) | OKR cho việc tấn-công; KPI-ngưỡng cho phòng-thủ/hậu-cần. | 09-architect (neo đo §1.4), §6.4 neo |
| **rolling-wave** (LG-G-rolling-wave) | Cuộn-sóng — chỉ lập chi-tiết việc gần, việc xa để khung. | 08-execution-plan (§8 plan-gd) |
| **waterfall** (LG-G-waterfall) | Lập sạch toàn-bộ một lần từ đầu — hỏng khi tương-lai bất-định. | 08-execution-plan (đối-lập rolling-wave) |
| **bootstrap** (LG-G-bootstrap) | Mồi-khởi-động: dùng cái có-sẵn để chạy bước đầu (12 phòng để nghĩ; kho để đẻ đường mới). | 03-luong-pha (§PHA1 lăng-kính, PHA4) |
| **promote** (LG-G-promote) | Đạt-chuẩn tái-dùng: khử-danh-tính + tham-số-hoá + gắn-nhãn + kèm rubric. | 05-kho (§5.3 THÊM), §3 PHA3 cổng PROMOTE |
| **cascade** (LG-G-cascade) | Sinh-lại: sửa tầng trên ⇒ nhánh việc dưới phải sinh lại. | 03-luong-pha (§PHA3 song-vòng → sinh-lại) |
| **fractal** (LG-G-fractal) | Tự-đồng-dạng: 1 brand chạy nhiều đường-cong, mỗi đường cùng vòng-đời. | 03-luong-pha (§PHA4), 02-brain (curves.md) |
| **HITL** (LG-G-hitl) | Human-in-the-loop — cổng người duyệt giữa vòng tự-động. | 03-luong-pha (PHA2 cổng cứng), vn-executor |
| **MECE** (LG-G-mece) | Không-trùng-không-sót (mutually-exclusive, collectively-exhaustive). | 04-taxonomy (11 khía-cạnh), §1.4 back-test |
| **G0** (LG-G-g0) | Cổng-tỉnh-táo: kiểm telos mạch-lạc + cơ-hội có-vẻ-thật trước khi đổ công-sức. | 02-brain (§2 gate-G0), §3 PHA0 cổng |

## 4. Hành-vi / thuật-toán
Spec nền không có thuật-toán runtime. Hành-vi duy-nhất là **luật tham-chiếu thuật-ngữ** mà các spec khác + tooling phải tuân:

```
KHI một spec/code/prompt dùng thuật-ngữ chuẩn X:
  1. X PHẢI có entry trong §3.2 (bảng từ-điển 41 term).
  2. spec dùng X ghi tham-chiếu: 00-tong-quan-va-thuat-ngu.md#LG-G-X
  3. NẾU X chưa có entry  → vi-phạm "thuật-ngữ mồ-côi" → check-coverage báo lỗi.
  4. NẾU một entry trong §3.2 KHÔNG được spec nào tham-chiếu (cột "dùng ở")
     → entry chết → cảnh-báo dọn / hoặc thiếu spec phủ.
```

Kiến-trúc 2 trục (§3.1) là khung đọc: mọi spec tự xếp mình vào *trục dọc* (sinh-thành: 02/03/04/05/06/08/09) hoặc *bổ-trợ trục ngang* (giữ engine: debate.js, executor).

## 5. Ranh-giới generic ↔ phân-rã
- **GENERIC (spec này cố-định):** mô-hình 2 trục; bảng 41 thuật-ngữ chuẩn; luật "không mồ-côi". Đây là khung viết-một-lần-dùng-mãi.
- **PHÂN-RÃ (mỗi DN tự suy):** *nội-dung* gắn vào từng term cho 1 DN cụ-thể — vd telos của Phở Hà, moat của Phở Hà, đường-cong nào đang ở GĐ nào. Spec nền KHÔNG chứa nội-dung phân-rã; nó chỉ chứa *định-nghĩa khung* của term.

## 6. Cổng & luật bất-biến
Hai ranh-giới **bất-biến** rút từ §0 (LG-0-5) — mọi spec sau phải tôn-trọng:

1. **GIỮ phần đã tốt:** engine `debate.js` 4 pha + 12 phòng vẽ-sẵn + grounding (đọc bằng-chứng) + HITL (cổng người duyệt). KHÔNG viết lại, KHÔNG thay engine.
2. **CHỈ ĐẮP lớp trên/dưới + bên cạnh:** lớp *sinh-thành* phía trên (telos → cấu-trúc), lớp *khép-vòng có tầng* phía dưới (chạy-thật → sửa lên đúng altitude), và *KHO tái-dùng chuẩn-hoá* bên cạnh. Năm trụ cải-tiến cũ (cross-exam, red-team, decisions-log, model-tiering, template-map) là nâng **trục ngang** — tài-liệu này KHÔNG trùng (LG-0-4).

**Invariant:** không spec nào được phá engine debate/12 phòng/grounding/HITL để hiện-thực trục dọc.

## 7. Giao-diện & điểm-cắm code
| Hạng-mục | Loại | Ghi-chú |
|---|---|---|
| `specs/00-tong-quan-va-thuat-ngu.md` (file này) | THÊM | Spec nền, mọi spec khác `depends_on` gián-tiếp qua tham-chiếu term |
| `tools/check-coverage.js` | SỬA | Bổ-sung kiểm "không thuật-ngữ mồ-côi": đối-chiếu term dùng trong spec/code ↔ §3.2 |
| `workflows/debate.js`, 12 `dept-XX-*` agent | GIỮ | Trục ngang — không sửa do spec này |
| `knowledge/brain-schema.md`, `vn-orchestrator/SKILL.md` | (tham-chiếu) | Dùng term chuẩn theo §3.2; sửa thực-tế thuộc spec 02/04/09 |

## 8. Tiêu-chí chấp-nhận
- **AC-1 (mọi thuật-ngữ có entry):** test `glossary-completeness` — quét toàn bộ `specs/*.md` + code lấy mọi token in-đậm/`<term>`; mỗi term PHẢI khớp 1 id `LG-G-*` trong §3.2. Thiếu ⇒ fail.
- **AC-2 (không thuật-ngữ mồ-côi):** test `no-orphan-term` — mỗi entry §3.2 phải được ≥1 spec tham-chiếu (cột "dùng ở" trỏ tới spec tồn-tại). Entry không ai dùng ⇒ cảnh-báo.
- **AC-3 (đủ 40 + 5 nền):** test `covers-count` — front-matter `covers:` chứa đúng LG-0-1..5 và đủ 40 id `LG-G-*` (không sót, không thừa). Đối-chiếu với `_claims.md` Glossary.
- **AC-4 (2 trục & 2 ranh-giới):** test `context-claims` (fixture đọc §3.1 + §6) — xác-nhận bảng 2 trục có cả "GIỮ engine" và "ĐẮP lớp trên/dưới".

## 9. Phụ-thuộc & thứ-tự
- **Milestone:** M1 (cùng nhóm telos + altitude nền).
- **Thứ-tự:** spec nền — phải có **TRƯỚC** mọi spec khác vì 01–09 đều tham-chiếu từ-điển §3.2. `depends_on: []`.

## 10. Bảng truy-vết
| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-0-1 | §3.1 (2 trục bổ-trợ) | AC-4 context-claims |
| LG-0-2 | §3.1 (trục dọc 5 tầng) | AC-4 context-claims |
| LG-0-3 | §3.1 (trục ngang 12 phòng/debate.js) | AC-4 context-claims |
| LG-0-4 | §6 luật bất-biến (5 trụ nâng trục ngang) | AC-4 context-claims |
| LG-0-5 | §6 GIỮ engine + ĐẮP lớp trên/dưới | AC-4 context-claims |
| LG-G-generic-vs-phan-ra | §3.2 hàng *generic vs phân-rã* | AC-1 glossary-completeness |
| LG-G-telos | §3.2 hàng *telos* | AC-1 glossary-completeness |
| LG-G-moat | §3.2 hàng *moat* | AC-1 glossary-completeness |
| LG-G-beachhead | §3.2 hàng *beachhead* | AC-1 glossary-completeness |
| LG-G-wedge | §3.2 hàng *wedge* | AC-1 glossary-completeness |
| LG-G-s-curve | §3.2 hàng *s-curve* | AC-1 glossary-completeness |
| LG-G-11-khia-canh | §3.2 hàng *11 khía-cạnh* | AC-1 glossary-completeness |
| LG-G-du-lieu | §3.2 hàng *dữ-liệu (khía-cạnh)* | AC-1 glossary-completeness |
| LG-G-hau-can | §3.2 hàng *hậu-cần (khía-cạnh)* | AC-1 glossary-completeness |
| LG-G-doi-tac | §3.2 hàng *đối-tác/hệ-sinh-thái* | AC-1 glossary-completeness |
| LG-G-ben-vung | §3.2 hàng *bền-vững/stakeholder* | AC-1 glossary-completeness |
| LG-G-khoi-phong-bo-phan | §3.2 hàng *khối/phòng/bộ-phận* | AC-1 glossary-completeness |
| LG-G-gom-nguoc-len | §3.2 hàng *gom ngược-lên* | AC-1 glossary-completeness |
| LG-G-dieu-kien-du | §3.2 hàng *điều-kiện-đủ* | AC-1 glossary-completeness |
| LG-G-sinh-nvc-3-lop | §3.2 hàng *sinh nhiệm-vụ-chính 3 lớp* | AC-1 glossary-completeness |
| LG-G-back-test | §3.2 hàng *back-test* | AC-1 glossary-completeness |
| LG-G-pre-mortem | §3.2 hàng *pre-mortem* | AC-1 glossary-completeness |
| LG-G-ten-kep | §3.2 hàng *tên-kép* | AC-1 glossary-completeness |
| LG-G-kho-index | §3.2 hàng *KHO/_index.md* | AC-1 glossary-completeness |
| LG-G-reuse-adapt-new | §3.2 hàng *reuse/adapt/new* | AC-1 glossary-completeness |
| LG-G-reuse-grade | §3.2 hàng *reuse-grade* | AC-1 glossary-completeness |
| LG-G-pmf | §3.2 hàng *PMF* | AC-1 glossary-completeness |
| LG-G-lifecycle-gd | §3.2 hàng *lifecycle/GĐ1-6* | AC-1 glossary-completeness |
| LG-G-optimize-before-scale | §3.2 hàng *optimize-before-scale* | AC-1 glossary-completeness |
| LG-G-cash-cow | §3.2 hàng *cash cow* | AC-1 glossary-completeness |
| LG-G-second-curve | §3.2 hàng *second curve/điểm-A* | AC-1 glossary-completeness |
| LG-G-ambidexterity | §3.2 hàng *ambidexterity* | AC-1 glossary-completeness |
| LG-G-single-double-loop | §3.2 hàng *single/double-loop* | AC-1 glossary-completeness |
| LG-G-altitude-tempo | §3.2 hàng *altitude/tempo* | AC-1 glossary-completeness |
| LG-G-tancong-phongthu-haucan | §3.2 hàng *attack/defense/logistics* | AC-1 glossary-completeness |
| LG-G-re-founding | §3.2 hàng *re-founding* | AC-1 glossary-completeness |
| LG-G-okr-kpi | §3.2 hàng *OKR/KPI* | AC-1 glossary-completeness |
| LG-G-rolling-wave | §3.2 hàng *rolling-wave* | AC-1 glossary-completeness |
| LG-G-waterfall | §3.2 hàng *waterfall* | AC-1 glossary-completeness |
| LG-G-bootstrap | §3.2 hàng *bootstrap* | AC-1 glossary-completeness |
| LG-G-promote | §3.2 hàng *promote* | AC-1 glossary-completeness |
| LG-G-cascade | §3.2 hàng *cascade* | AC-1 glossary-completeness |
| LG-G-fractal | §3.2 hàng *fractal* | AC-1 glossary-completeness |
| LG-G-hitl | §3.2 hàng *HITL* | AC-1 glossary-completeness |
| LG-G-mece | §3.2 hàng *MECE* | AC-1 glossary-completeness |
| LG-G-g0 | §3.2 hàng *G0* | AC-1 glossary-completeness |

## 11. OPEN-Q
- Cách tooling nhận-diện "token là thuật-ngữ chuẩn" trong spec (in-đậm? cú-pháp `[[term]]`? id `LG-G-*`?) — cần chốt quy-ước máy-đọc cho `check-coverage.js` (AC-1/AC-2). Đề-xuất: tham-chiếu bằng id `LG-G-*`, dạng tự-do chỉ để người đọc.
