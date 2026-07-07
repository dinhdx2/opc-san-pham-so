# Sổ-claim — `luong-generic-v3.html` (v3.3)

> Sổ truy-vết: mỗi **claim nguyên-tử** của tài-liệu nguồn (SoT) có 1 ID ổn-định.
> Mỗi spec phải phủ (qua front-matter `covers:`) ≥1 claim; `tools/check-coverage.js` kiểm toàn-phủ (C1) + không-bịa (C2) + test-phủ (C3).
> **Loại** ∈ {rule, schema, gate, table-row, flow, term, example}. **GP** = generic / phân-rã / – .
> Quy-ước nhà-phủ (assignment): xem `_coverage.md`.

## §0 · Bối-cảnh
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-0-1 | schema | generic | Hai trục dọc (sinh-thành từ telos) và ngang (tranh-luận 12 phòng) bổ-trợ nhau để xây hệ-điều-hành DN bằng AI. |
| LG-0-2 | term | generic | Trục dọc là khuôn-OS sinh-thành 5 tầng (telos→định-vị→đường-cong→vòng-đời→cấu-trúc), hiện vắng trong vn-opc. |
| LG-0-3 | term | generic | Trục ngang là vn-opc tranh-luận: 12 phòng vẽ-sẵn chạy debate.js 4 pha → quyết-định + kế-hoạch. |
| LG-0-4 | rule | generic | Năm trụ cải-tiến (cross-exam, red-team, decisions-log, model-tiering, template-map) là nâng trục ngang, không phải trục dọc. |
| LG-0-5 | rule | generic | Tinh-thần: GIỮ engine debate + 12 phòng + grounding + HITL; đắp lớp sinh-thành + khép-vòng có tầng + KHO tái-dùng. |

## §1.1 · GENERIC vs PHÂN-RÃ
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-1.1-1 | rule | generic | Cái viết-một-lần-dùng-mãi (khung/bảng/luật) = GENERIC; cái suy-ra-mỗi-DN (nội-dung ô) = PHÂN-RÃ. |
| LG-1.1-2 | schema | generic | GENERIC: 6 GĐ + 11 khía-cạnh + 3 chiều tấn/thủ/hậu + 7 khối/12 phòng + 4 ngả người/agent + luật tra-kho. |
| LG-1.1-3 | table-row | generic | 6 GĐ · 11 khía-cạnh · 3 chiều · 7 khối/12 phòng · 4 ngả · luật tra-kho = bảng + luật cố-định. |
| LG-1.1-4 | gate | generic | Cổng lọc "khía-cạnh X có lý-do tồn-tại ở GĐ này?" — câu hỏi cố-định, đáp-án tùy DN. |
| LG-1.1-5 | gate | generic | Cổng tra-kho "tầng này KHO đã có & khớp ngữ-cảnh?" — luật reuse/adapt/new cố-định, tài-sản tùy ngành. |
| LG-1.1-6 | table-row | phân-rã | telos = PHÂN-RÃ, người quyết (AI không tự đặt). |
| LG-1.1-7 | table-row | generic | mục-đích GĐ = GENERIC theo GĐ = câu-hỏi-sống-còn, chỉ khoác chữ cho DN. |
| LG-1.1-8 | table-row | phân-rã | mục-tiêu = PHÂN-RÃ, outcome đo-được, suy theo khía-cạnh × DN. |
| LG-1.1-9 | table-row | phân-rã | nhiệm-vụ-chính và nhiệm-vụ-con = PHÂN-RÃ; khung 3 chiều generic, nội-dung phân-rã. |
| LG-1.1-10 | table-row | phân-rã | bộ-phận, phòng, khối = PHÂN-RÃ; neo 7 khối/12 canonical generic, gom cây tùy việc. |
| LG-1.1-11 | rule | generic | Chỉ khung + 6 bảng tra + 2 luật (lọc khía-cạnh, tra-kho) + mục-đích-GĐ = generic; mục-tiêu trở xuống phân-rã. |

## §1.2 · Hai chiều của trục
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-1.2-dn | term | generic | Chiều-sinh (suy-ra): mỗi tầng dưới suy-ra từ tầng trên; cấu-trúc là kết-quả gom NGƯỢC-LÊN ở CUỐI. |
| LG-1.2-up | term | generic | Khép-vòng (phản-hồi): đơn-vòng vá tại-chỗ; hết K vòng song-vòng leo tầng + NEO BRAIN; tài-sản chuẩn nhập KHO. |

## §1.3 · Phép-thử đúng-tầng
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-1.3-rule | rule | generic | ĐỘNG-TỪ mở đầu ⇒ VIỆC (nhiệm-vụ); không ⇒ TRẠNG-THÁI (mục-tiêu). |
| LG-1.3-muc-dich | table-row | generic | Mục-đích = vì-sao GĐ tồn-tại = câu-sống-còn 1 câu, dạng "Chứng-minh / Đạt được X". |
| LG-1.3-muc-tieu | table-row | generic | Mục-tiêu = cái-GÌ cần ĐẠT (đo được) = TRẠNG-THÁI, không mở-đầu động-từ, dạng "Hạ-tầng sẵn-sàng". |
| LG-1.3-nv-chinh | table-row | generic | Nhiệm-vụ-chính = khối VIỆC LỚN để đạt mục-tiêu = mở-đầu ĐỘNG-TỪ, dạng "Thiết-lập luồng thanh-toán". |
| LG-1.3-nv-con | table-row | generic | Nhiệm-vụ-con = bước cụ-thể (tấn/thủ/hậu) = nguyên-tử kiểm-chứng được, dạng "Mở PayPal + KYC". |
| LG-1.3-vd-pod | example | phân-rã | POD khía-cạnh "tiền": mục-tiêu (trạng-thái) → 1 nhiệm-vụ-chính → 3 nhiệm-vụ-con (tấn/thủ/hậu). |

## §1.4 · Cơ-chế sinh nhiệm-vụ-chính 3 lớp
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-1.4-L1 | rule | generic | Lớp 1 SINH: bẻ state → chuỗi điều-kiện-đủ ĐỒNG-THỜI, mỗi chưa-đạt = 1 nhiệm-vụ-chính. |
| LG-1.4-L2 | rule | generic | Lớp 2 SOI: lưới 3 chiều tại tầng nhiệm-vụ-chính (tấn TẠO, thủ GIỮ, hậu CẤP). |
| LG-1.4-L3 | rule | generic | Lớp 3 QUÉT-NGANG: đối-chiếu chéo 11 khía-cạnh bắt việc sót xuyên-khía-cạnh. |
| LG-1.4-gate | gate | generic | Cổng nghiệm: back-test ĐỦ (mọi việc done → state đúng?) + tối-thiểu + không-trùng. |
| LG-1.4-neo | rule | generic | Mỗi nhiệm-vụ-chính gắn điều-kiện-đủ nó đóng + OKR (tấn) hoặc KPI-ngưỡng (thủ/hậu). |
| LG-1.4-vd | example | phân-rã | POD "tiền" → 4 điều-kiện-đủ → 4 nhiệm-vụ-chính: PayPal (tấn-Tiền), KYC (tấn-Rủi-ro), policy giữ (thủ-Rủi-ro), rút+đối-soát (hậu-Dữ-liệu). |

## §2 · Brain 2 lớp
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-2-altitude | rule | generic | Brain phân tầng theo nhịp-đổi: telos đổi chậm nhất, cấu-trúc/hiện-trạng nhanh nhất. |
| LG-2-file-telos | schema | – | File 00-Brain/telos.md: 1 câu lý-do-tồn-tại + giá-trị + ranh-giới (cái DN KHÔNG làm). |
| LG-2-file-positioning | schema | – | File 00-Brain/positioning.md: đầu-cầu, điểm-xuất-phát, cỗ-máy/moat. |
| LG-2-file-curves | schema | – | File 00-Brain/curves.md: sổ đường-cong (định-vị × cỗ-máy, stage, sức-khoẻ) mỗi dòng KD. |
| LG-2-file-strategy | schema | – | File strategy.md: vision/ICP/positioning + thị-trường/đối-thủ. |
| LG-2-file-products | schema | – | File products.md: catalog + unit-economics. |
| LG-2-file-budget | schema | – | File budget.md: ngân-sách/dòng-tiền/chi-phí. |
| LG-2-file-state | schema | – | File state.md: hiện-trạng + KPI + rủi-ro + trường stage (phát-hiện động). |
| LG-2-file-headcount | schema | – | File headcount.md: nhân-sự, cơ-cấu. |
| LG-2-file-structure | schema | – | File 00-Brain/structure.md: cây khối→phòng→bộ-phận + tên-kép + lịch kích-hoạt + con-trỏ reuse. |
| LG-2-file-decisions | schema | – | File decisions-log.md: quyết-định đã chốt + nhãn altitude (telos/định-vị/moat/cấu-trúc). |
| LG-2-file-calibration | schema | – | File calibration.md: phòng khuyến-nghị → kết-quả thực. |
| LG-2-file-index | schema | – | File knowledge/playbook/<ngành>/_index.md: CHỈ-MỤC KHO bảng chuẩn khối→phòng→bộ-phận. |
| LG-2-file-asset | schema | – | File knowledge/playbook/<ngành>/<asset>: KHO tài-sản đạt-chuẩn reuse-grade. |
| LG-2-gate-G0 | gate | – | Cổng G0 kiểm telos mạch-lạc + cơ-hội có-vẻ-thật trước khi đổ công-sức xuống. |
| LG-2-telos-ceo | rule | – | AI đề-xuất telos, CEO quyết (AI không có: ta thật-sự quan-tâm & chịu-đựng vì gì). |

## §3 · Luồng PHA 0→4
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-3-flow | flow | – | Luồng tổng PHA 0→4: sinh-thành xuống (0→2), khép-vòng lên (3), mở-rộng tái-nhập (4). |
| LG-3-PHA0-vao | term | – | PHA 0 Vào: khai-báo CEO. |
| LG-3-PHA0-ra | term | – | PHA 0 Ra: Brain 2 lớp (§2). |
| LG-3-PHA0-gate | gate | – | PHA 0 Cổng: G0. |
| LG-3-PHA0-stage1 | flow | – | PHA 0 Lớp khai-báo: CEO nói tình-trạng hiện-tại (vd "4 quán, DT 1.2 tỷ/tháng"). |
| LG-3-PHA0-stage2 | flow | – | PHA 0 Lớp đối-chiếu bằng-chứng: đọc state/budget.md → suy stage bằng rubric câu-sống-còn. |
| LG-3-PHA0-stage3 | flow | – | PHA 0 Lớp reality-check: cross-exam stage khai-báo vs bằng-chứng + tiêu-chí cổng. |
| LG-3-PHA1-1A | flow | phân-rã | PHA 1A Lăng-kính khởi-động: dùng 7 khối/12 phòng nền làm bộ kính để NGHĨ. |
| LG-3-PHA1-1B | flow | phân-rã | PHA 1B Sinh cây việc: telos→mục-đích GĐ → duyệt 11 KHÍA-CẠNH → mục-tiêu → nhiệm-vụ-chính/con. |
| LG-3-PHA1-1C | flow | phân-rã | PHA 1C Suy cấu-trúc NGƯỢC-LÊN + TRA-KHO: gom dần bộ-phận→phòng→khối, tra _index.md. |
| LG-3-PHA1-1D | flow | phân-rã | PHA 1D Thứ-tự ưu-tiên action-list GĐ hiện-tại. |
| LG-3-PHA1-gateA | gate | phân-rã | PHA 1 Cổng A: duyệt KHUNG (telos/định-vị/lăng-kính/stage) sớm, rẻ, trước phân-rã. |
| LG-3-PHA1-gateB | gate | phân-rã | PHA 1 Cổng B: duyệt 08-plan + cây cấu-trúc + báo-cáo tra-kho CÙNG LÚC. |
| LG-3-PHA1-vaora | term | phân-rã | PHA 1 Vào: Brain + stage + _index.md; Ra: 06-structure.md + 08-execution-plan.md. |
| LG-3-PHA1-why-aspect | rule | generic | Sinh mục-tiêu từ KHÍA-CẠNH không từ PHÒNG-BAN vì khía-cạnh là trục BẤT-BIẾN, KHÔNG-SÓT. |
| LG-3-PHA2-router | flow | – | PHA 2 Router SIMPLE/COMPLEX/STRATEGIC → escalation: SIMPLE rẻ (Sonnet), STRATEGIC full 4-pha (Opus). |
| LG-3-PHA2-debate | flow | – | PHA 2 Hội-đồng debate.js 4-pha → kế-hoạch-thực-thi-riêng 10-thuc-thi-<hành-động>.md. |
| LG-3-PHA2-executor | flow | – | PHA 2 vn-executor: bước nguyên-tử (AI-AUTO/NEED-INFO/NEED-APPROVAL/HUMAN-ONLY) → sổ 10-run-state.md. |
| LG-3-PHA2-gate-cung | gate | – | PHA 2 Cổng cứng NEED-APPROVAL: chi tiền, ký/nộp pháp-lý, công-bố, gửi email/tin, thao-tác không hoàn-tác. |
| LG-3-PHA3-don-vong | flow | – | PHA 3 Đơn-vòng (≤K): vá tại-chỗ trong kế-hoạch + ghi lessons.md. |
| LG-3-PHA3-song-vong | flow | – | PHA 3 Song-vòng: leo đúng tầng (cấu-trúc→moat→định-vị→telos) + NEO file Brain tầng đó. |
| LG-3-PHA3-ceo | flow | – | PHA 3 Hết K vòng → CEO quyết (giết/đổi-hướng), không lặp mù. |
| LG-3-PHA3-pass | gate | – | PHA 3 Cổng PASS việc: đạt KPI/OKR → xong. |
| LG-3-PHA3-promote | gate | – | PHA 3 Cổng PROMOTE: đạt rubric reuse-grade → cất KHO + ghi 1 dòng _index.md. |
| LG-3-PHA3-gate-gd | gate | – | PHA 3 Cổng GIAI-ĐOẠN: đủ mục-tiêu GĐ → re-debate SỐ THẬT → GĐ kế → PHA 1 mở chi-tiết. |
| LG-3-PHA3-warn | rule | – | Đừng vì 1 chiến-dịch lỗi đổi telos; chỉ biến-cố-thế-giới mới chạm, phải có bằng-chứng từ Brain. |
| LG-3-PHA4-rule | flow | – | PHA 4 Mở-rộng = đường-cong mới: bootstrap từ KHO (tra _index.md), reuse cây khối/phòng/bộ-phận. |
| LG-3-PHA4-test1 | table-row | – | PHA 4 Phép-thử ① moat: chạy thẳng chỗ mới được? → GĐ5 nới hoặc GĐ6 đẻ. |
| LG-3-PHA4-test2 | table-row | – | PHA 4 Phép-thử ② telos: chung không? → chung cùng nhà, khác brand mới. |
| LG-3-PHA4-test3 | table-row | – | PHA 4 Phép-thử ③ brand equity: tên cũ giúp bán cái mới? → giúp tên-mẹ, không tên-phụ. |

## §4 · 7 khối · 12 phòng · tên-kép
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-4.1-asp1 | table-row | generic | Khía-cạnh 1 Sản-phẩm → phòng 09 Sản-phẩm & Công-nghệ. |
| LG-4.1-asp2 | table-row | generic | Khía-cạnh 2 Thị-trường → phòng 02 Chiến-lược, 07 Marketing. |
| LG-4.1-asp3 | table-row | generic | Khía-cạnh 3 Khách-hàng → phòng 06 Bán-hàng, 08 Khách-hàng. |
| LG-4.1-asp4 | table-row | generic | Khía-cạnh 4 Tiền → phòng 03 Tài-chính, 12 Tăng-trưởng (vốn). |
| LG-4.1-asp5 | table-row | generic | Khía-cạnh 5 Con-người → phòng 04 Nhân-sự, 10 Đào-tạo. |
| LG-4.1-asp6 | table-row | generic | Khía-cạnh 6 Hậu-cần → phòng 05 Vận-hành (chuỗi-cung), 03 (chi-phí mua). |
| LG-4.1-asp7 | table-row | generic | Khía-cạnh 7 Vận-hành → phòng 05 Vận-hành. |
| LG-4.1-asp8 | table-row | generic | Khía-cạnh 8 Dữ-liệu → phòng 11 Báo-cáo, 09 (hạ-tầng dữ-liệu). |
| LG-4.1-asp9 | table-row | generic | Khía-cạnh 9 Rủi-ro → phòng 01 Quản-trị & Pháp-lý (+ xuyên-suốt). |
| LG-4.1-asp10 | table-row | generic | Khía-cạnh 10 (MỚI) Đối-tác & Hệ-sinh-thái → phòng 02, 06 (kênh), 12 (NĐT/JV), 05 (NCC). |
| LG-4.1-asp11 | table-row | generic | Khía-cạnh 11 (MỚI) Bền-vững & Stakeholder → phòng 01, 02, 11 (báo-cáo ESG). |
| LG-4.1-review | rule | generic | CEO-review tách Dữ-liệu ≠ Hậu-cần + bổ-sung Đối-tác & Bền-vững (9→11); khía-cạnh ≠ phòng, không đẻ phòng mới. |
| LG-4.2-K1 | table-row | generic | Khối K1 Quản-trị & Chiến-lược = phòng 01, 02, 12. |
| LG-4.2-K2 | table-row | generic | Khối K2 Tài-chính = phòng 03. |
| LG-4.2-K3 | table-row | generic | Khối K3 Thị-trường & Khách-hàng = phòng 06, 07, 08. |
| LG-4.2-K4 | table-row | generic | Khối K4 Sản-phẩm & Công-nghệ = phòng 09. |
| LG-4.2-K5 | table-row | generic | Khối K5 Vận-hành & Chuỗi-cung = phòng 05. |
| LG-4.2-K6 | table-row | generic | Khối K6 Con-người = phòng 04, 10. |
| LG-4.2-K7 | table-row | generic | Khối K7 Dữ-liệu & Đo-lường = phòng 11. |
| LG-4.3-ten-nganh | table-row | generic | Tên-ngành (hiển-thị): người trong ngành đọc hiểu ngay. |
| LG-4.3-ten-nang-luc | table-row | generic | Tên-năng-lực chuẩn: khóa so-sánh xuyên-ngành + khóa tra KHO. |
| LG-4.3-maps-to | table-row | generic | Ánh-xạ canonical (maps_to K*/dept-*): neo 7 khối/12 phòng + tái-dùng template/persona. |
| LG-4.3-rule | rule | generic | Tên-kép áp 3 tầng (khối/phòng/bộ-phận); cắm aliases_vn + extends_departments; tên-chuẩn là khóa tra KHO. |
| LG-4.3-chuyen-sau | rule | generic | Đơn-vị ngành thường là chuyên-sâu của 1 phòng canonical: map "trực-thuộc gần nhất", không 1-đối-1 cứng. |

## §5 · KHO chỉ-mục
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-5.1-tree | schema | generic | Cây KHO: knowledge/playbook/<ngành>/ → _index.md + K*/dept-*/<bộ-phận>/ (SOP/template/persona/rubric/meta). |
| LG-5.1-activate | rule | generic | Chỉ tạo nhánh thư-mục KHO khi có tài-sản đạt reuse-grade (không tạo nhánh rỗng). |
| LG-5.2-col-id | schema | generic | Cột id: <ngành>.<khối>.<phòng>.<bộ-phận> (khóa chuẩn-hoá). |
| LG-5.2-col-tang | schema | generic | Cột tầng: khối / phòng / bộ-phận / tài-sản. |
| LG-5.2-col-ten-nl | schema | generic | Cột tên-năng-lực: tên-chuẩn (khóa so-khớp khi tra). |
| LG-5.2-col-ten-nganh | schema | generic | Cột tên-ngành: alias hiển-thị. |
| LG-5.2-col-mapsto | schema | generic | Cột maps_to: neo canonical (K*/dept-*). |
| LG-5.2-col-khia-canh | schema | generic | Cột khía-cạnh: 1 trong 11 (phục-vụ). |
| LG-5.2-col-gd | schema | generic | Cột GĐ: stage thường kích-hoạt. |
| LG-5.2-col-io | schema | generic | Cột đầu-vào/đầu-ra: hợp-đồng ngữ-cảnh để so-khớp reuse. |
| LG-5.2-col-taisan | schema | generic | Cột tài-sản: file kèm (SOP/template/persona/rubric). |
| LG-5.2-col-reuse-grade | schema | generic | Cột reuse-grade: A dùng-luôn / B tinh-chỉnh / C tham-khảo. |
| LG-5.2-col-trangthai | schema | generic | Cột trạng-thái: live / ngủ / deprecated (để DỌN). |
| LG-5.2-col-nguon | schema | generic | Cột nguồn/phiên-bản: task gốc PROMOTE + version. |
| LG-5.3-them | rule | generic | THÊM (PROMOTE): cổng PROMOTE PHA 3 → ghi tài-sản + chèn 1 dòng _index.md (id chuẩn). |
| LG-5.3-tra | rule | generic | TRA (REUSE): PHA 1C/PHA 4 so-khớp tên-năng-lực + khía-cạnh + GĐ + đầu-vào/ra. |
| LG-5.3-don | rule | generic | DỌN: tài-sản lỗi-thời/trùng → trạng-thái deprecated (giữ vết) + superseded_by; định-kỳ gộp trùng. |
| LG-5.3-chuan-ten | rule | generic | CHUẨN tên: kebab-case; tên-năng-lực theo từ-điển canonical để khóa tra ổn-định. |

## §6 · Bảng tra
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-6.1-gd1 | table-row | generic | GĐ1 khả-thi/có bài-toán đáng giải? — chưa rõ vấn-đề/chưa có sản-phẩm. |
| LG-6.1-gd2 | table-row | generic | GĐ2 kéo & trả (PMF)? — có sản-phẩm, tìm khách quay-lại & trả tiền. |
| LG-6.1-gd3 | table-row | generic | GĐ3 giao thật ở điều-kiện thật? — PMF rồi, lo giao-hàng/vận-hành ổn. |
| LG-6.1-gd4 | table-row | generic | GĐ4 lãi/đơn-vị, lặp được? — giao ổn, tối-ưu biên lãi từng đơn-vị. |
| LG-6.1-gd5 | table-row | generic | GĐ5 nhân không vỡ? — nhân-bản sang điểm/thị-trường mới. |
| LG-6.1-gd6 | table-row | generic | GĐ6 duy-trì + tái-tạo? — lõi chín, lời đều, cần gieo đường-cong kế. |
| LG-6.2-cau-truc | table-row | generic | Tín-hiệu quy-trình tắc/vai quá-tải → leo Cấu-trúc → structure.md + headcount.md (nhanh). |
| LG-6.2-moat | table-row | generic | Tín-hiệu moat xói/kinh-tế-đơn-vị xấu → leo Cỗ-máy/moat → positioning + products + budget (vừa). |
| LG-6.2-dinh-vi | table-row | generic | Tín-hiệu đầu-cầu cạn/sai ngách → leo Định-vị → positioning + strategy (vừa–chậm). |
| LG-6.2-telos | table-row | generic | Tín-hiệu chạy đúng vẫn èo-uột → leo Telos → telos.md + curves.md (rất chậm). |
| LG-6.2-nen | table-row | generic | Luôn đọc bằng-chứng nền state.md + budget.md (số thật) để biết tầng nào vỡ. |
| LG-6.3-asp1 | table-row | generic | Mẫu mục-tiêu Sản-phẩm: "Chất-lượng/định-nghĩa sản-phẩm đạt chuẩn X". |
| LG-6.3-asp2 | table-row | generic | Mẫu mục-tiêu Thị-trường: "Đầu-cầu & thông-điệp được xác-nhận". |
| LG-6.3-asp3 | table-row | generic | Mẫu mục-tiêu Khách-hàng: "Tỷ-lệ khách quay-lại ≥ Y%". |
| LG-6.3-asp4 | table-row | generic | Mẫu mục-tiêu Tiền: "Hạ-tầng thu tiền sẵn-sàng" / "Biên lãi/đv ≥ Z%". |
| LG-6.3-asp5 | table-row | generic | Mẫu mục-tiêu Con-người: "Vai then-chốt có người thay được founder". |
| LG-6.3-asp6 | table-row | generic | Mẫu mục-tiêu Hậu-cần: "Nguồn-cung & hạ-tầng ổn giá, đủ, đúng hạn". |
| LG-6.3-asp7 | table-row | generic | Mẫu mục-tiêu Vận-hành: "Quy-trình lõi chạy ổn-định, lặp được". |
| LG-6.3-asp8 | table-row | generic | Mẫu mục-tiêu Dữ-liệu: "Số then-chốt được đo & tin-cậy (1 nguồn-sự-thật)". |
| LG-6.3-asp9 | table-row | generic | Mẫu mục-tiêu Rủi-ro: "Rủi-ro pháp-lý/IP được chặn (cổng kiểm)". |
| LG-6.3-asp10 | table-row | generic | Mẫu mục-tiêu Đối-tác: "Kênh/đối-tác then-chốt đã chốt & ràng-buộc rõ". |
| LG-6.3-asp11 | table-row | generic | Mẫu mục-tiêu Bền-vững: "Giấy-phép-xã-hội & tuân-thủ ESG được duy-trì". |
| LG-6.4-L1 | table-row | generic | Lưới Lớp 1 Sinh: mỗi điều-kiện chưa-đạt → 1 nhiệm-vụ-chính (động-từ). |
| LG-6.4-L2 | table-row | generic | Lưới Lớp 2 Soi 3 chiều: LÀM/GIỮ/CẤP → bổ-sung việc thủ/hậu bị quên. |
| LG-6.4-L3 | table-row | generic | Lưới Lớp 3 Quét ngang: đạt state đụng khía-cạnh nào khác chưa có việc? |
| LG-6.4-gate | table-row | generic | Lưới Cổng nghiệm: state tự-động đúng? bỏ 1 việc còn đạt? 2 việc chồng? |
| LG-6.4-neo | table-row | generic | Lưới Neo đo: mỗi việc đóng điều-kiện nào, đo bằng OKR/KPI-ngưỡng. |
| LG-6.5-reuse | table-row | generic | REUSE: khớp cao (grade A, hợp-đồng ngữ-cảnh trùng) → dùng-luôn, ghi reused_from. |
| LG-6.5-adapt | table-row | generic | ADAPT: gần đúng (lệch tham-số, grade B) → tinh-chỉnh, ghi delta để PROMOTE sau. |
| LG-6.5-new | table-row | generic | NEW: không có/khác hẳn ngữ-cảnh → đẻ mới; nếu tốt → ứng-viên PROMOTE. |
| LG-6.6-rule | rule | generic | Từ-điển tên-năng-lực chuẩn = khóa so-khớp xuyên-ngành (tra-kho, calibration, gộp trùng). |

## §7 · Ví-dụ Phở Hà (fixture)
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-7-PHA0 | example | phân-rã | Phở Hà khai GĐ5 nhưng budget cho thấy quán-3 (6%), quán-4 chưa hòa-vốn → thực-tế GĐ4, HOÃN vốn & mở 10 quán. |
| LG-7-PHA1 | example | phân-rã | Duyệt 11 khía-cạnh GĐ4: Tiền/Hậu-cần/Vận-hành/Dữ-liệu/Rủi-ro/Con-người ✓; Đối-tác nhẹ (vốn HOÃN); Bền-vững & Đào-tạo ngủ. |
| LG-7-PHA1C | example | phân-rã | PHA 1C gom ngược-lên: 4/5 bộ-phận reuse kho (Bếp-TT, Thu-mua ADAPT, Kiểm-soát-giá, ATTP), chỉ BI/Báo-cáo NEW. |
| LG-7-PHA2 | example | phân-rã | PHA 2 "đàm-phán thịt bò sản-lượng-gộp" router COMPLEX → debate → 10-thuc-thi; cổng cứng ký HĐ NCC. |
| LG-7-PHA3 | example | phân-rã | PHA 3 quán-3 song-vòng phát-hiện sai đầu-cầu (định-vị) → đóng/dời; 3 quán ≥15% PASS GĐ4 + PROMOTE vào kho. |
| LG-7-PHA4 | example | phân-rã | PHA 4 mở 10 quán GĐ5-nới (reuse cây); phở-gói GĐ6-đẻ (bồi moat); cà-phê brand-mới (telos khác). |

## §8 · Artifact vault
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-8-telos | table-row | – | 00-Brain/telos.md (MỚI). |
| LG-8-positioning | table-row | – | 00-Brain/positioning.md (MỚI): đầu-cầu, điểm-xuất-phát, moat. |
| LG-8-curves | table-row | – | 00-Brain/curves.md (MỚI): stage theo TỪNG đường-cong. |
| LG-8-hientrang | table-row | – | state.md + 4 file cũ: trường stage phát-hiện động, không mặc-định GĐ1. |
| LG-8-structure | table-row | – | 00-Brain/structure.md (MỚI): cây khối→phòng→bộ-phận + tên-kép + lịch GĐ + reused_from. |
| LG-8-plan-gd | table-row | – | 02-Tasks/<slug>/08-execution-plan.md: cuộn-sóng (rolling-wave). |
| LG-8-structure-task | table-row | – | 02-Tasks/<slug>/06-structure.md: cây suy-ra + báo-cáo tra-kho (reuse/adapt/new). |
| LG-8-plan-action | table-row | – | 02-Tasks/<slug>/10-thuc-thi-<action>.md: 1 file/hành-động. |
| LG-8-runstate | table-row | – | 10-run-state.md: nguồn-sự-thật để resume. |
| LG-8-memory | table-row | – | decisions-log.md + calibration.md + lessons.md (MỚI); decisions-log gắn nhãn altitude. |
| LG-8-kho-index | table-row | – | knowledge/playbook/<ngành>/_index.md (MỚI): bảng chuẩn khối→phòng→bộ-phận. |
| LG-8-kho-asset | table-row | – | knowledge/playbook/<ngành>/<Kx>/<dept>/<bộ-phận>/ (MỚI): git-first, Drive tùy chọn. |

## §9 · Ánh-xạ codebase
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-9-brain | table-row | – | 3 file Brain mới + structure(3 tầng) + stage → mở-rộng knowledge/brain-schema.md. |
| LG-9-taxonomy | table-row | – | 11 khía-cạnh + 7 khối canonical → brain-schema.md + vn-orchestrator SKILL.md (bảng generic). |
| LG-9-taskgen | table-row | – | Cơ-chế sinh nhiệm-vụ-chính 3 lớp → SKILL.md Bước 7 + prompt vn-architect. |
| LG-9-stage | table-row | – | Phát-hiện stage + bơm câu-sống-còn → vn-orchestrator SKILL.md Bước 2-3. |
| LG-9-architect | table-row | – | Phân-rã sinh-thành (aspect-walk → gom ngược-lên + tra-kho) → skill vn-architect HOẶC mở-rộng pack-architect. |
| LG-9-kho-index | table-row | – | KHO chỉ-mục _index.md + rubric reuse-decision → knowledge/playbook/ + luật vn-architect. |
| LG-9-gate-optimize | table-row | – | Cổng optimize-before-scale + phép-thử telos → workflows/debate.js pha Red-team. |
| LG-9-lens-3chieu | table-row | – | Lăng-kính tấn/thủ/hậu → SKILL.md Bước 7 + executor Bước 1 (cột loại). |
| LG-9-tenkep | table-row | – | Tên-kép 3 tầng → department.yaml aliases_vn + pack extends_departments (tái-dùng trường có sẵn). |
| LG-9-khepvong | table-row | – | Khép-vòng đơn/song + neo Brain + PROMOTE→index → SKILL.md Bước 11 + calibration.md + knowledge/playbook/. |
| LG-9-dequy | table-row | – | Đệ-quy hành-động qua router → tái-dùng nguyên debate.js + escalation ladder (GIỮ NGUYÊN). |
| LG-9-uutien | rule | – | Ưu-tiên: M1 (telos+altitude) + M2 (debate stage-aware + 11 khía-cạnh/7 khối) tối-thiểu; M4 (gom ngược + kho); M3/M5/M6 dần. |

## Glossary
| ID | Loại | GP | Nội-dung |
|---|---|---|---|
| LG-G-generic-vs-phan-ra | term | – | Generic = khung/bảng-phân-loại/luật cố-định (viết 1 lần); phân-rã = nội-dung suy-ra mỗi DN. |
| LG-G-telos | term | – | Lý-do-tồn-tại cốt-lõi: hướng đuổi mãi, không phải đích đạt-rồi-xong. |
| LG-G-moat | term | – | Cỗ-máy/hào — lợi-thế-bền khó-sao-chép (khác "chỉ nhanh hơn"). |
| LG-G-beachhead | term | – | Đầu-cầu — lãnh-thổ hẹp chiếm & thống-trị trước. |
| LG-G-wedge | term | – | Mũi-nêm — nước-đi-đầu mỏng nhất (= điểm-xuất-phát). |
| LG-G-s-curve | term | – | Đường-cong — một dòng KD có quỹ-đạo sinh→lớn→bão-hoà. |
| LG-G-11-khia-canh | term | – | Bảng MECE generic "cần đạt CÁI GÌ", 4 nhóm: GIÁ-TRỊ/NGUỒN-LỰC/VẬN-HÀNH&TRI-THỨC/BẢO-VỆ&QUAN-HỆ. |
| LG-G-du-lieu | term | – | Khía-cạnh dữ-liệu: tài-sản & đo-lường (instrument, analytics, privacy, IP-dữ-liệu). |
| LG-G-hau-can | term | – | Khía-cạnh hậu-cần: chuỗi-cung & hạ-tầng đầu-vào (mua, kho, vận-chuyển, cloud). |
| LG-G-doi-tac | term | – | Khía-cạnh đối-tác/hệ-sinh-thái: kênh, liên-minh, nền-tảng 2-phía, nhượng-quyền, dev/API, JV. |
| LG-G-ben-vung | term | – | Khía-cạnh bền-vững/stakeholder: giấy-phép-xã-hội, niềm-tin quản-lý, môi-trường/ESG. |
| LG-G-khoi-phong-bo-phan | term | – | Ba tầng cấu-trúc: 7 khối canonical ▷ 12 phòng canonical ▷ bộ-phận (lá). |
| LG-G-gom-nguoc-len | term | – | Suy cấu-trúc từ dưới: nhiệm-vụ-con → bộ-phận → phòng → khối (cấu-trúc ở CUỐI). |
| LG-G-dieu-kien-du | term | – | Tập điều-kiện mà khi ĐỒNG-THỜI đúng thì trạng-thái-đích tự-động thành-hình. |
| LG-G-sinh-nvc-3-lop | term | – | Cơ-chế sinh nhiệm-vụ-chính: điều-kiện-đủ → lưới 3 chiều → chéo 11 khía-cạnh → back-test. |
| LG-G-back-test | term | – | Giả-định mọi nhiệm-vụ-chính done → mục-tiêu có TỰ-ĐỘNG đúng không. |
| LG-G-pre-mortem | term | – | Hỏi trước "state này hỏng kiểu gì?" để sinh việc phòng-thủ. |
| LG-G-ten-kep | term | – | 3 nhãn/đơn-vị: tên-ngành + tên-năng-lực-chuẩn + ánh-xạ canonical. |
| LG-G-kho-index | term | – | Kho tái-dùng theo ngành + chỉ-mục chuẩn (khối→phòng→bộ-phận) để tra/thêm/dọn. |
| LG-G-reuse-adapt-new | term | – | 3 kết-quả tra-kho: dùng-luôn / tinh-chỉnh / đẻ-mới (theo khớp ngữ-cảnh). |
| LG-G-reuse-grade | term | – | Hạng tái-dùng: A dùng-luôn · B cần tinh-chỉnh · C tham-khảo. |
| LG-G-pmf | term | – | Khớp sản-phẩm–thị-trường: khách chủ-động quay-lại & trả tiền. |
| LG-G-lifecycle-gd | term | – | Vòng-đời mỗi đường-cong: 6 GĐ, mỗi GĐ = 1 câu-hỏi-sống-còn. |
| LG-G-optimize-before-scale | term | – | Tối-ưu cho sạch RỒI mới nhân-bản; nhân chưa-sạch = nhân-lỗi cả-đàn. |
| LG-G-cash-cow | term | – | Bò-sữa — dòng chín, lời đều, nuôi bet khác. |
| LG-G-second-curve | term | – | Gieo đường-cong kế khi lõi còn khỏe (điểm-A), không đợi suy (điểm-B). |
| LG-G-ambidexterity | term | – | Hai-tay — vừa vắt lõi vừa gieo dòng mới (GĐ6). |
| LG-G-single-double-loop | term | – | Đơn-vòng = vá trong khuôn cũ; song-vòng = sửa chính cái khuôn (tầng trên). |
| LG-G-altitude-tempo | term | – | Độ-cao/nhịp quyết-định: telos đổi chậm nhất, cấu-trúc nhanh nhất. |
| LG-G-tancong-phongthu-haucan | term | – | 3 chiều: tấn (việc LÀM) · thủ (việc GÁC, "hỏng kiểu gì?") · hậu-cần (tiền/máy/dữ-liệu/người). |
| LG-G-re-founding | term | – | Tái-lập-nền — đổi chính telos, ngoài vòng-đời. |
| LG-G-okr-kpi | term | – | OKR cho việc tấn-công; KPI-ngưỡng cho phòng-thủ/hậu-cần. |
| LG-G-rolling-wave | term | – | Cuộn-sóng — chỉ lập chi-tiết việc gần, việc xa để khung. |
| LG-G-waterfall | term | – | Lập sạch toàn-bộ một lần từ đầu — hỏng khi tương-lai bất-định. |
| LG-G-bootstrap | term | – | Mồi-khởi-động: dùng cái có-sẵn để chạy bước đầu (12 phòng để nghĩ; kho để đẻ đường mới). |
| LG-G-promote | term | – | Đạt-chuẩn tái-dùng: khử-danh-tính + tham-số-hoá + gắn-nhãn + kèm rubric. |
| LG-G-cascade | term | – | Sinh-lại: sửa tầng trên ⇒ nhánh việc dưới phải sinh lại. |
| LG-G-fractal | term | – | Tự-đồng-dạng: 1 brand chạy nhiều đường-cong, mỗi đường cùng vòng-đời. |
| LG-G-hitl | term | – | Human-in-the-loop — cổng người duyệt giữa vòng tự-động. |
| LG-G-mece | term | – | Không-trùng-không-sót (mutually-exclusive, collectively-exhaustive). |
| LG-G-g0 | term | – | Cổng-tỉnh-táo: kiểm telos mạch-lạc + cơ-hội có-vẻ-thật trước khi đổ công-sức. |
