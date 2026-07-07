# Trạng-thái IMPLEMENT bộ spec luong-generic-v3

> Bộ spec này đã được **hiện-thực (code)** vào codebase thật. File này là bản-đồ spec → điểm-cắm + cách kiểm.
> Truy-vết 2 lớp: `npm run check-coverage` (= `docs/design/luong-generic-v3/specs/tools/check-coverage.js`, spec ↔ SoT, 220/220 claim) · `npm run check-impl` (= `tools/check-impl.js` ở GỐC repo, implement ↔ spec).

## Cách kiểm (từ gốc repo)
```bash
npm test            # 164 case tái-hiện §8 acceptance của từng spec + golden Phở Hà PHA 0→4 (spec 07)
npm run check-impl     # I1 điểm-cắm tồn-tại · I2 test xanh · I3 claim LG-* phủ test (162) · I4 claim code-được chưa test (cảnh-báo)
npm run check-coverage # C1 toàn-phủ · C2 không-bịa · C3 test-phủ · AC-glossary (spec ↔ SoT)
```

## Bản-đồ spec → điểm-cắm code/knowledge

| Spec | Bản-chất generic đã code | Điểm-cắm |
|---|---|---|
| 00 thuật-ngữ | (nền) | `knowledge/brain-schema.md` (mục Brain 2 lớp) dùng thuật-ngữ chuẩn |
| 01 mô-hình tầng | `validate_dung_tang` + `sinh_nhiem_vu_chinh` 3 lớp | `lib/tier.js` · test `tier.test.js` |
| 02 Brain 2 lớp | validator mở-rộng + cổng G0 + 5 lớp-nhịp + nhãn altitude | `lib/brain.js` · `knowledge/brain-schema.md` · `vault/00-Brain/{telos,positioning,curves,structure,lessons}.md` |
| 03 luồng tổng | router class + escalation (GIỮ `debate.js`) | `lib/flow.js#routerClass` |
| 03a PHA 0 | phát-hiện stage 3 lớp + reality-check | `lib/rule-engines.js#detectStage` · `vn-orchestrator` Bước 2b |
| 03b PHA 1 | aspect-walk → gom-ngược-lên + tra-kho + 2 cổng | skill `vn-architect` · `vn-orchestrator` Bước 7a |
| 03c PHA 2 | router SIMPLE/COMPLEX/STRATEGIC + cổng cứng NEED-APPROVAL | `lib/flow.js#routerClass,phanLoaiBuoc` · `vn-executor` Bước 2 |
| 03d PHA 3 | đơn/song-vòng + K-vòng + Cổng PASS/GIAI-ĐOẠN/CEO + guard telos + PROMOTE | `lib/loop.js` (`khepVong/congPass/congGiaiDoan/guardTelos`) · `lib/rule-engines.js#routeSongVong` · `lib/kho.js#them` · `loop-config.yaml` (K) · `vn-orchestrator` Bước 11b · `test/loop.test.js` |
| 03e PHA 4 | 3-phép-thử moat/telos/brand độc-lập + bootstrap KHO + reuse_ratio | `lib/flow.js#chay3PhepThu,taiNhapBootstrap,reuseRatio` |
| 04 taxonomy | ASPECTS[11] · KHOI[7] (MECE) · tên-kép 3 nhãn | `lib/taxonomy.js` · `knowledge/taxonomy/*.yaml` · `department.yaml maps_to` · `pack.yaml dept_maps_to` |
| 05 KHO | them/tra/dọn + lược-đồ `_index.md` 13 cột + chuẩn tên | `lib/kho.js` · `knowledge/playbook/` |
| 06 rule-engine | 6 hàm xác-định + 6 bảng tĩnh | `lib/rule-engines.js` · `knowledge/rule-engines/*.yaml` |
| 07 golden Phở Hà | test tích-hợp PHA 0→4 (6 case) | `test/golden-pho-ha.test.js` · `test/fixtures/fnb_index.md` |
| 08 bố-cục vault | đường-dẫn Brain/KHO/slot task | `knowledge/brain-schema.md` · `knowledge/playbook/README.md` |
| 09 đấu-dây | bản-đồ §9 → điểm-cắm + lộ-trình M1-M6 | `tools/impl-manifest.js` + bảng này |

## Bất-biến giữ nguyên (spec 00 §6, 09 §6)
`workflows/debate.js` (4 pha + escalation) · router · executor 4 nhóm bước · packs · grounding · HITL — **chỉ THÊM**, không phá. Trục dọc = thêm file Brain + bảng generic (YAML) + bước prompt + thư-mục KHO.

## Lộ-trình milestone (đã làm)
M1 (telos+altitude) · M2 (taxonomy+stage+tên-kép) · M4 (rule-engine+KHO+vn-architect) · M3/M5/M6 (curves+lens+khép-vòng/PROMOTE/PHA4) — phần generic code-được đều có test; phần phân-rã (suy mỗi DN) thực-thi ở prompt skill khi chạy `/vn-run`/`/vn-execute`.

## Vòng 2 — đóng gap (sau audit spec↔code)
Audit từng spec phát-hiện khoảng-trống hành-vi **code-được** vốn chỉ narrate ở prompt; đã đóng thành **engine xác-định + test** (claim phủ test 96 → 141):
- **01** `lib/tier.js`: thêm **Lớp 3 QUÉT-NGANG** (đối-chiếu chéo 11 khía-cạnh) — trước bỏ.
- **02** `lib/brain.js`: validate `curves[]` per-dòng (stage∈GĐ1..6 + name/positioning/engine/health).
- **03d** **MỚI `lib/loop.js`**: K-vòng / Cổng PASS / Cổng GIAI-ĐOẠN / Cổng CEO / guard telos (đơn-vòng↔song-vòng↔re-founding) — driver `loop-config.yaml`.
- **03e** `lib/flow.js`: `taiNhapBootstrap` + `reuseRatio` (mồi đường-cong mới từ KHO).
- **03c** `lib/flow.js#routerHanhDong` (§4.2 scale ⟂ cổng cứng) + `vn-orchestrator` Bước 7c (SOP per-hành-động).
- **05** `lib/kho.js`: `nhanhDuocKichHoat` (không nhánh rỗng, LG-5.1-activate) + `handle` (superseded_by resolvable).
- **Máy kiểm:** `check-impl` thêm **I4** (tự liệt claim code-được chưa test) · `check-coverage` **siết C3** (testable thiếu Acceptance → FAIL) · `test/{loop,artifact-layout,wiring-map}.test.js` mới.

## Vòng 3 — code-hoá nốt phần generic còn ở prompt/doc (Đợt A+B)
Audit "code vs prompt vs doc" phát-hiện vài cơ-chế generic vẫn chỉ ở prompt/doc → code-hoá thành engine xác-định + test (claim phủ test 141 → 148):
- **A1** `lib/flow.js#buocLuong/kiemTraThuTu` — **stepper transition PHA 0→4** (LG-3-flow): Vào·Ra·Cổng + INV thứ-tự (cấm nhảy vượt pha, cho tái-nhập). Đây là hàm CHUYỂN-BƯỚC THUẦN (1 bước/lời gọi); vòng `loop_gd` + driver `chay_luong` do skill main-loop điều-phối (đúng kiến-trúc HITL), KHÔNG phải state-machine tự-chạy.
- **A2** `lib/brain.js#validateCanonContent` — validate **nội-dung per-file** canonical (strategy/products/budget/headcount) + nhãn altitude decisions-log (LG-2-file-*).
- **A3** `lib/kho.js#raDinhKy` — DỌN định-kỳ: gộp mục trùng + hạ-cấp reuse-grade theo calibration (LG-5.3-don §5.3).
- **A4** `lib/kho.js#cayThuMuc` — hàm THUẦN dựng/validate đường-dẫn cây KHO `<ngành>/<Kx>/<dept>/<bộ-phận>/` (LG-5.1-tree; ghi file vẫn ở skill).
- **B1** `check-coverage.js` **AC-glossary** — spec 00 phủ trọn 46 thuật-ngữ LG-0-*/LG-G-* (spec 00 §8), thiếu → FAIL.
- **C1** `test/invariant.test.js` — code-hoá NGUYÊN-LÝ §0/§1.1 + why-aspect thành assertion (schema generic đầy-đủ, ranh generic↔phân-rã, cổng lọc/tra-kho, trục-sinh-11-khía-cạnh, _index 13 cột). 0 behavior mới.
- **C2** `lib/flow.js#chuanBiPHA0/chuanBiPHA1` — 2 helper orchestration THUẦN gói engine call thành 1 entry-point test được (intake PHA0 + scaffold walk PHA1); skill bám → giảm prompt-drift, KHÔNG sinh nội-dung per-DN.
- I4 còn **10** claim (giảm từ 67): đều là **§0/§1.1 nguyên-lý-doc thuần** (LG-0-1/4/5, LG-1.1-7/9/10), **schema bộ-nhớ/file** (calibration/asset) hoặc **HITL** (Cổng A/B) — đúng kiến-trúc "generic=code · phân-rã=prompt · HITL=main-loop", KHÔNG phải gap.

## Vòng 4 — audit sâu spec↔code (2026-06-30, 5 đợt) — xem `AUDIT-2026-06-30.md`
Máy kiểm sâu (5 luồng song-song ánh-xạ 17 file trong specs/ ↔ code) phát-hiện bug hành-vi + gap code-được + stale, đã đóng:
- **Bug:** G0 `approved_by` so-khớp prefix `/^CEO\b/` (trước `=== 'CEO'` chặn vault production) · chuẩn-hoá enum `GĐ→GD` ở `brain.normStage` + `rule-engines.goalByAspect` + `loop.nextStage` · `flow.phanLoaiBuoc` HUMAN_ONLY→`cong='HUMAN'` (bất-biến §3.3).
- **Cổng an-toàn code-được:** `kho.them` reject `reuse_grade∉{A,B}` + `kho.xetPromote` (PASS→PROMOTE) · `loop.congGiaiDoan` nhánh re-debate FAIL→ở-lại-GĐ (§8.5) · `flow.validateRunState/validateResume` (E1/E2/E3, wire vào `vn-executor`) · `tier` TỐI-THIỂU giữ việc thủ/hậu/khía-cạnh cover duy-nhất · `tier.validateDungTang` thực-thi `dang_ngon_ngu` (§3.2).
- **Generic-hoá:** ngưỡng reuse → `reuse-config.yaml` (hết hardcode) · `rule-engines.detectStagePerCurve` (wire vào `chuanBiPHA0.stage_theo_duong_cong`) · `kho` enum `tầng` + neo version round-trip.
- **Tooling/doc:** `npm run check-coverage` (script + path) · `check-coverage` loại non-spec (15 spec) · số-liệu `_coverage` 220 · spec 08 multi-vault · §8 fixture→INLINE · count 146→164.
- Claim phủ test giữ **162** (các fix có test nhánh-nghịch); `npm test` **164 case**.

## Ghi-chú fixture §8 (repoint)
Các spec §8 từng nêu tên fixture `tests/*.cases.json` / `*.expected.json` (vd `luong_state_machine.cases.json`, `khepvong_*.json`, `pod_tien.expected.json`) — **những file đó KHÔNG tồn-tại như đường-dẫn rời**; acceptance được **kết-tinh INLINE** trong `test/*.test.js` (harness neo claim `LG-*`). Tra theo claim, không theo tên file `.json`. Bản-đồ: spec 01→`tier.test.js` · 02→`brain.test.js` · 03a/03b/06/07→`rule-engines.test.js`+`golden-pho-ha.test.js` · 03c/03d/03e→`flow.test.js`+`loop.test.js`+`golden-pho-ha.test.js` · 04→`taxonomy.test.js` · 05→`kho.test.js` · 08→`artifact-layout.test.js` · 09→`wiring-map.test.js`.
