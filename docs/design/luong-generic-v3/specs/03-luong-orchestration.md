---
id: 03-luong-orchestration
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 (dòng 294-415, sơ-đồ tổng) + §9 (671-696, điểm cắm)"
covers: [LG-3-flow]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang, 02-brain-schema]
milestone: M2
---

# 03 · Luồng Orchestration (tổng)

> **Spec CHA của 5 PHA.** Định-nghĩa state-machine **PHA 0→4** ở mức TỔNG: các state là PHA,
> các transition + cổng giữa chúng, chiều **sinh-xuống (0→2)** ↔ **khép-lên (3)** ↔ **tái-nhập (4)**.
> Mỗi PHA có một spec con mô-tả nội-tạng — spec này chỉ định **bộ-xương nối** + **router đệ-quy**
> + **escalation ladder** + **phanh chi-phí (model tiering)**. Mọi chi-tiết Vào/Ra/Cổng/thuật-toán
> bên-trong một PHA thuộc về spec con tương-ứng (`03a`–`03e`), KHÔNG lặp lại ở đây.

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§3 "Luồng tổng — PHA 0 → PHA 4"** của SoT, riêng claim khung
`LG-3-flow`: luồng tổng năm-pha với ba chiều — **sinh-thành đi xuống (PHA 0→2)**,
**khép-vòng đi lên (PHA 3)**, **mở-rộng tái-nhập (PHA 4)**. Spec định-nghĩa
state-machine cấp pha + vòng điều-phối tổng gọi từng PHA + điểm cắm vào
`vn-orchestrator/SKILL.md` và `workflows/debate.js`.

**Trong phạm-vi (in):** tập state = {PHA0…PHA4} + state phụ-trợ; bảng transition + cổng
giữa các PHA; pseudocode vòng điều-phối tổng `chay_luong()` gọi tuần-tự từng PHA và
định-tuyến vòng-lặp khép-lên/tái-nhập; cách 5 PHA nối nhau (link tới `03a`–`03e`);
**router đệ-quy SIMPLE/COMPLEX/STRATEGIC** ở mức tổng (PHA 2 gọi nó cho mỗi hành-động);
**escalation ladder** + **phanh chi-phí (model tiering)** như cơ-chế chống nổ-token của đệ-quy.

**Ngoài phạm-vi (out):** nội-tạng từng PHA — phát-hiện stage 3 lớp + G0 (→ `03a-pha0-khoi-tao.md`);
aspect-walk + sinh cây + gom-ngược-lên + tra-kho + Cổng A/B (→ `03b-pha1-phan-ra.md`);
debate.js 4-pha + executor bước nguyên-tử + cổng cứng (→ `03c-pha2-thuc-thi.md`);
đơn/song-vòng + cascade + PASS/PROMOTE + cổng-giai-đoạn (→ `03d-pha3-khep-vong.md`);
3-phép-thử + bootstrap KHO (→ `03e-pha4-mo-rong.md`). 6 hàm rule-engine (router-rubric,
stage-detect…) thuộc `06-bang-tra-rule-engines.md`. Spec này chỉ định **bộ-xương + transition**,
KHÔNG định nội-dung bên-trong PHA.

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `chiều-sinh` / `khép-vòng` (LG-1.2-dn, LG-1.2-up),
`single/double-loop` (LG-G-single-double-loop), `cascade` (LG-G-cascade), `fractal/đệ-quy`
(LG-G-fractal), `rolling-wave` (LG-G-rolling-wave), `cổng G0` (LG-G-g0),
`HITL` (LG-G-hitl), `S-curve / đường-cong` (LG-G-s-curve), `bootstrap từ KHO` (LG-G-bootstrap),
`escalation ladder` + `model-tiering` (TRỤ 4 chi-phí, LG-0-4).
Mô-hình tầng telos→cấu-trúc và luật đúng-tầng: `01-nguyen-ly-va-mo-hinh-tang.md`.
Hợp-đồng dữ-liệu Brain mà PHA 0 sinh: `02-brain-schema.md`.

## 3. Mô-hình dữ-liệu

### 3.1 · State-machine cấp PHA

Năm state CHÍNH = năm PHA, theo trục thời-gian + chiều luồng (LG-3-flow):

```
   ┌─ chiều-sinh (xuống) ─┐        ┌ khép-vòng (lên) ┐   ┌ tái-nhập ┐
  PHA0 ──▶ PHA1 ──▶ PHA2 ───────▶ PHA3 ──────────────▶ PHA4 ──┐
 (khởi-tạo)(phân-rã)(thực-thi)   (đo·định-tuyến)     (mở-rộng) │
   ▲                               │  │                        │
   │                               │  └─(cổng-giai-đoạn)─▶ PHA1 (GĐ kế, mở chi-tiết)
   │                               └─(song-vòng cascade)─▶ PHA1 (sinh-lại nhánh)
   └──────────────── tái-nhập PHA 0/1 (đường-cong mới, bootstrap KHO) ◀──┘
```

| State | PHA | Chiều | Spec con | Vai-trò 1 câu |
|---|---|---|---|---|
| `PHA0` | Khởi-tạo · Brain 2 lớp · phát-hiện stage | sinh-xuống | `03a-pha0-khoi-tao.md` | Vào=khai-báo CEO; Ra=Brain 2 lớp; Cổng=G0 |
| `PHA1` | Phân-rã sinh-thành (chỉ GĐ hiện-tại) | sinh-xuống | `03b-pha1-phan-ra.md` | sinh cây việc → gom-ngược-lên + tra-kho; Cổng A/B |
| `PHA2` | Thực-thi đệ-quy từng hành-động | sinh-xuống | `03c-pha2-thuc-thi.md` | mỗi hành-động = brief con → router → debate → executor; cổng cứng |
| `PHA3` | Khép-vòng — đo · định-tuyến · nghiệm-thu | khép-lên | `03d-pha3-khep-vong.md` | đơn-vòng → song-vòng → CEO; PASS/PROMOTE; cổng-giai-đoạn |
| `PHA4` | Mở-rộng = đường-cong mới tái-nhập | tái-nhập | `03e-pha4-mo-rong.md` | 3-phép-thử → GĐ5-nới/GĐ6-đẻ/brand-mới → tái-nhập PHA 0/1 |

### 3.2 · Field của bản-ghi luồng (`LuongState` — code đọc trực-tiếp)

| Field | Kiểu | Ý-nghĩa |
|---|---|---|
| `pha` | enum `PHA0\|PHA1\|PHA2\|PHA3\|PHA4` | state hiện-tại |
| `duong_cong_id` | id | đường-cong (S-curve) đang chạy — vòng-đời GĐ1-6 chạy TRÊN mỗi đường-cong (LG-3-PHA4-rule) |
| `stage` | enum `GĐ1..GĐ6` | giai-đoạn HIỆN-TẠI của đường-cong đó (do PHA0 phát-hiện, theo từng đường-cong) |
| `vong_don` | int | số đơn-vòng đã chạy ở PHA3 (so trần `K` để quyết leo song-vòng) |
| `cong_da_qua` | set | cổng đã pass: {G0, A, B, PASS, PROMOTE, cổng-giai-đoạn} |
| `chieu` | enum `sinh\|khep\|tai_nhap` | hướng luồng hiện-thời (suy từ `pha`) |

### 3.3 · Cổng giữa các PHA (transition guard — sở-hữu ở spec con, NEO ở đây)

| Cổng | Đặt giữa | Điều-kiện qua | Hỏng thì | Spec sở-hữu |
|---|---|---|---|---|
| **G0** | trước PHA0→PHA1 | telos mạch-lạc + cơ-hội có-vẻ-thật | dừng/sửa telos (HITL) | `03a` |
| **A** (KHUNG) | trong PHA1 (sớm) | duyệt telos/định-vị/lăng-kính/stage | sửa khung trước khi phân-rã tốn-kém | `03b` |
| **B** (PLAN+CẤU-TRÚC) | PHA1→PHA2 | duyệt 08-plan + cây cấu-trúc + báo-cáo tra-kho CÙNG LÚC | sửa kế-hoạch | `03b` |
| **cứng NEED-APPROVAL** | trong PHA2 | CEO duyệt (chi tiền/ký/công-bố/gửi/không-hoàn-tác) | chặn bước, chờ CEO | `03c` |
| **PASS việc** | trong PHA3 | đạt KPI/OKR | quay đơn-vòng | `03d` |
| **PROMOTE** | trong PHA3 (song song PASS) | đạt rubric reuse-grade | không cất KHO (vẫn PASS được) | `03d` |
| **cổng-giai-đoạn** | PHA3→PHA1(GĐ kế) | đủ mục-tiêu GĐ → re-debate SỐ THẬT | ở lại GĐ hiện-tại | `03d` |
| **3-phép-thử** | PHA3/4→tái-nhập | moat/telos/brand-equity | định tuyến GĐ5-nới·GĐ6-đẻ·brand-mới | `03e` |

## 4. Hành-vi / thuật-toán

### 4.1 · Vòng điều-phối tổng `chay_luong()` (gọi từng PHA, nối 3 chiều)

```
INPUT : khai_bao_ceo, vault, kho_index            # _index.md KHO ngành
OUTPUT: Brain cập-nhật + cây cấu-trúc + kết-quả việc + (có-thể) đường-cong mới

func chay_luong(khai_bao_ceo, vault):

  # ── Chiều-sinh ĐI XUỐNG (PHA 0 → 2) ─────────────────────────────────────
  brain = PHA0_khoi_tao(khai_bao_ceo, vault)        # → 03a: Brain 2 lớp + stage
  if not gate_G0(brain): return halt("telos chưa mạch-lạc / cơ-hội chưa có-vẻ-thật")

  loop_gd:                                           # mỗi GĐ của đường-cong hiện-tại
    plan, cay_cau_truc = PHA1_phan_ra(brain, stage(brain), kho_index)   # → 03b
    #   trong PHA1: Cổng A (duyệt KHUNG, sớm/rẻ) rồi Cổng B (duyệt plan+cấu-trúc)

    for hanh_dong in plan.actions_GĐ_hien_tai:       # → 03c (PHA 2, ĐỆ-QUY từng hành-động)
        ket_qua = PHA2_thuc_thi_de_quy(hanh_dong, brain, vault)

        # ── Chiều khép-vòng ĐI LÊN (PHA 3) ─────────────────────────────────
        verdict = PHA3_khep_vong(ket_qua, hanh_dong, brain, vault)      # → 03d
        switch verdict.loai:
          case PASS:        ghi_xong(hanh_dong)                  # cổng PASS việc
                            if verdict.promote: cap_nhat_kho_index(verdict.asset)  # cổng PROMOTE
          case DON_VONG:    continue          # vá tại-chỗ trong plan, ≤K (03d)
          case SONG_VONG:   neo_brain(verdict.tang)              # leo tầng + NEO Brain
                            goto loop_gd       # cascade: sinh-lại nhánh dưới (PHA1)
          case CEO_QUYET:   cho_ceo(hanh_dong)                   # hết K vòng → CEO

    if cong_giai_doan(brain, stage):           # đủ mục-tiêu GĐ → re-debate SỐ THẬT
        stage = GĐ_ke(stage); goto loop_gd     # vào GĐ kế → PHA1 mở chi-tiết
    else: break loop_gd

  # ── Chiều TÁI-NHẬP (PHA 4) — khi GĐ5/6, lõi khỏe ────────────────────────
  if lieu_co_mo_rong(brain):                    # → 03e
    quyet = PHA4_mo_rong(brain, kho_index)      # 3-phép-thử: moat/telos/brand-equity
    duong_cong_moi = bootstrap_tu_kho(quyet, kho_index)   # reuse cây khối/phòng/bộ-phận
    return chay_luong_tai_nhap(duong_cong_moi, vault)     # TÁI-NHẬP PHA 0/1 cho đường-cong mới

  return brain
```

**Bất-biến luồng:**
- **INV-FLOW-1 (thứ-tự sinh-xuống):** PHA0→1→2 chạy tuần-tự một-chiều; KHÔNG nhảy
  PHA0→PHA2 (phải qua PHA1 sinh cây) — đúng sơ-đồ tổng (LG-3-flow).
- **INV-FLOW-2 (khép-lên có tầng):** PHA3 mặc-định ĐƠN-VÒNG; chỉ hết `K` vòng mới
  SONG-VÒNG leo tầng + NEO Brain; song-vòng đổi tầng trên ⇒ **cascade** quay về PHA1
  (chi-tiết ở `03d`/`01 §6 INV-6`).
- **INV-FLOW-3 (tái-nhập = đường-cong mới):** PHA4 KHÔNG sửa đường-cong cũ; nó đẻ
  `duong_cong_moi` rồi tái-nhập PHA 0/1 — vòng-đời GĐ1-6 lặp trên đường mới.
- **INV-FLOW-4 (hội-tụ):** mỗi GĐ thoát qua cổng-giai-đoạn; `K` chặn vòng đơn vô-hạn;
  PHA4 chỉ kích khi lõi khỏe (GĐ5/6) ⇒ luồng không lặp mù.

### 4.2 · Router đệ-quy + escalation ladder (phanh chi-phí) — gọi trong PHA 2

Ý **đệ-quy/fractal:** mỗi hành-động trong `08-plan` = một **brief con** vào lại đúng máy cũ
(`debate.js`). Để đệ-quy KHÔNG nổ token, gắn **phanh chi-phí = model tiering theo `scale`**:

```
func router_de_quy(hanh_dong, brain):
  scale = phan_loai(hanh_dong)        # SIMPLE | COMPLEX | STRATEGIC  (rubric ở 06)
  # ── escalation ladder (rẻ → đắt) ──
  switch scale:
    case SIMPLE:    1–2 lăng-kính · bỏ cross-exam/red-team · TOÀN model RẺ (sonnet)
    case COMPLEX:   vài phòng · 1 vòng cross-exam · model lõi mạnh + còn-lại rẻ
    case STRATEGIC: full 4-pha (Perspectives→Cross-exam→Red-team→Synthesize)
                    · ≤2 vòng cross-exam (loop-until-dry, guard token)
                    · model MẠNH cho phòng lõi rủi-ro + red-team + synthesizer
  ket_hoach = debate_js(hanh_dong.brief_con, scale)   # → 10-thuc-thi-<action>.md
  return giao_executor(ket_hoach)     # bước nguyên-tử + cổng cứng (→ 03c)
```

**Quy-tắc phanh:** đa-số hành-động là SIMPLE ⇒ rẻ; chỉ STRATEGIC mới bung full + model
đắt nhất. Bước nguyên-tử của executor là **đáy** — không phân-rã vô-tận (chống đệ-quy
không-dừng). (Map model cụ-thể + guard token: §7, hiện đã có sẵn trong `workflows/debate.js`.)

**Edge-case:**
- Hành-động vừa SIMPLE vừa chạm cổng cứng (vd chi tiền nhỏ) ⇒ vẫn NEED-APPROVAL
  (cổng cứng ĐỘC-LẬP với `scale`; tiết-kiệm model KHÔNG được bỏ HITL).
- STRATEGIC nhưng ngân-sách token cạn ⇒ guard token chặn vòng cross-exam 2 (xuống 1 vòng).

## 5. Ranh-giới generic ↔ phân-rã

| Thành-phần | GP | Ghi-chú |
|---|---|---|
| Bộ-xương 5 PHA + thứ-tự sinh-xuống/khép-lên/tái-nhập | **GENERIC** | state-machine cố-định, mọi DN dùng chung (LG-3-flow) |
| Tập cổng giữa PHA + chiều transition | **GENERIC** | luật chuyển-state cố-định (G0/A/B/cứng/PASS/PROMOTE/GĐ) |
| Router phân-loại SIMPLE/COMPLEX/STRATEGIC + escalation ladder + model-tiering | **GENERIC** | rubric + ladder cố-định (rubric ở `06`); chống nổ token |
| `stage`, `duong_cong_id`, nội-dung plan/cây, kết-quả việc | **PHÂN-RÃ** | suy-ra mỗi DN/mỗi đường-cong (do PHA con sinh) |

Chốt: spec CHA định **khung luồng + cổng + router/ladder (generic)**; mọi **nội-dung
chảy qua luồng** là phân-rã, do `03a`–`03e` sinh.

## 6. Cổng & luật bất-biến

- **INV-FLOW-1..4** (xem §4.1) là invariant của state-machine tổng.
- Tám cổng ở **§3.3** là **transition guard** — spec CHA NEO chúng vào đúng cạnh giữa các
  PHA; **điều-kiện + hành-vi chi-tiết** thuộc spec con sở-hữu (cột cuối §3.3). Spec CHA
  chỉ ràng: (a) thứ-tự cổng theo luồng, (b) cổng nào chặn transition nào.
- **HITL ở main loop, KHÔNG trong Workflow nền:** mọi cổng cần CEO (G0, A, B, cứng, CEO-quyết)
  chạy ở main loop của `vn-orchestrator/SKILL.md`; `debate.js` chỉ chạy phần debate
  (không hỏi CEO). (Theo CLAUDE.md: `AskUserQuestion` chỉ ở main loop.)
- **Phanh chi-phí là bắt-buộc:** PHA2 đệ-quy PHẢI đi qua router + escalation ladder; cấm
  bung full 4-pha + model đắt cho mọi hành-động không-phân-biệt.

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| `skills/vn-orchestrator/SKILL.md` (toàn-bộ Bước 1→11) | SỬA | là HIỆN-THÂN của vòng `chay_luong()`: Bước 2-3=PHA0/router · Bước 5-7=PHA1/2 + Cổng A/B (PAUSE) · Bước 11=PHA3 khép-vòng (LG-9-stage, LG-9-taskgen, LG-9-khepvong) |
| `skills/vn-orchestrator/SKILL.md` Bước 3 (Router) | GIỮ + SỬA | phát `scale` SIMPLE/COMPLEX/STRATEGIC ra `02-router.md`, truyền vào `args` workflow — chính là router đệ-quy §4.2 |
| `workflows/debate.js` (model tiering + escalation ladder, dòng 28-39) | GIỮ NGUYÊN | `deptModel`/`HEAVY`/`LIGHT` + `MAX_XEXAM_ROUNDS` + guard token = phanh chi-phí §4.2 đã hiện-thực; spec CHA chỉ neo, không sửa (LG-9-dequy) |
| `workflows/debate.js` 4-pha (Perspectives→Cross-exam→Red-team→Synthesize) | GIỮ NGUYÊN | engine PHA2 gọi cho mỗi brief con (đệ-quy/fractal) |
| `vn-executor` (sổ `10-run-state.md`) | THAM-CHIẾU | đáy đệ-quy PHA2; chi-tiết ở `03c` |
| Spec con `03a`–`03e` | LINK | mỗi PHA một spec; spec CHA chỉ nối + neo cổng |

> Cắm theo §9 SoT (dòng 681-690): router/debate/escalation = **GIỮ NGUYÊN** (tái-dùng
> `debate.js` + ladder); trục dọc chủ-yếu thêm bước prompt trong `SKILL.md`, không code nặng.

## 8. Tiêu-chí chấp-nhận

### 8.1 · Thứ-tự PHA + chiều luồng (state-machine)

| # | Kịch-bản | Kỳ-vọng |
|---|---|---|
| T1 | đường đi-xuống của 1 đường-cong | thứ-tự `PHA0 → PHA1 → PHA2` đúng, KHÔNG nhảy PHA0→PHA2 (INV-FLOW-1) |
| T2 | G0 fail (telos chưa mạch-lạc) | `chay_luong` HALT trước PHA1; KHÔNG sinh cây (cổng §3.3) |
| T3 | PHA3 trả `PASS` + đạt rubric reuse | gọi PASS việc + PROMOTE → `cap_nhat_kho_index` (2 cổng tách biệt) |
| T4 | PHA3 trả `DON_VONG` (vong_don < K) | vá tại-chỗ, KHÔNG leo tầng (INV-FLOW-2) |
| T5 | PHA3 trả `SONG_VONG` | NEO Brain tầng đó + `goto loop_gd` (cascade về PHA1) — chiều khép-lên (INV-FLOW-2) |
| T6 | đủ mục-tiêu GĐ | cổng-giai-đoạn → `stage=GĐ_ke` → PHA1 mở chi-tiết GĐ kế |
| T7 | GĐ5/6 lõi khỏe | PHA4 chạy 3-phép-thử → `bootstrap_tu_kho` → tái-nhập PHA 0/1 cho đường-cong mới (INV-FLOW-3) |

→ acceptance **INLINE** trong `test/flow.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Router đệ-quy + phanh chi-phí

| # | Input hành-động | Kỳ-vọng |
|---|---|---|
| R1 | brief con SIMPLE | 1-2 lăng-kính · bỏ cross-exam/red-team · TOÀN model rẻ (sonnet) — `deptModel` trả 'sonnet' |
| R2 | brief con STRATEGIC | full 4-pha · ≤2 vòng cross-exam · model mạnh cho phòng lõi + red-team + synthesizer |
| R3 | SIMPLE nhưng chạm chi tiền | vẫn NEED-APPROVAL (cổng cứng độc-lập `scale`) — edge §4.2 |
| R4 | STRATEGIC, token cạn | guard token chặn cross-exam vòng 2 (về 1 vòng) |

→ map kỳ-vọng về `workflows/debate.js` dòng 28-39 (đã hiện-thực); test gọi `debate.js`
với `scale` khác nhau, assert `model` mỗi label.

### 8.3 · Lát Phở Hà (chiều sinh-xuống → khép-lên → tái-nhập)

Dùng fixture §7 (LG-7-*) như golden end-to-end của luồng tổng (chi-tiết từng PHA ở
`07-fixture-pho-ha.md`): PHA0 phát-hiện **GĐ4** (không GĐ5 như khai) ⇒ G0/reality-check
chặn mở-rộng-sớm; PHA1→PHA2 sinh & chạy action GĐ4; PHA3 quán-3 song-vòng (leo định-vị)
→ cascade PHA1; 3 quán PASS + PROMOTE; PHA4 mở 10 quán = GĐ5-nới (bootstrap KHO).
Spec CHA chỉ kiểm **chuỗi PHA + cổng kích đúng thứ-tự**; nội-dung mỗi PHA do spec con kiểm.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M2 (pipeline + debate stage-aware). Router/ladder/model-tiering đã có sẵn
  trong `debate.js` (GIỮ NGUYÊN) — theo LG-9-dequy, LG-9-uutien.
- **Trước:** `00` (thuật-ngữ), `01` (mô-hình tầng — PHA1 dùng), `02` (Brain — PHA0 sinh).
- **Sau / là spec con của spec này:** `03a-pha0-khoi-tao.md`, `03b-pha1-phan-ra.md`,
  `03c-pha2-thuc-thi.md`, `03d-pha3-khep-vong.md`, `03e-pha4-mo-rong.md`. Mỗi spec con phủ
  nhóm claim `LG-3-PHA<n>-*` tương-ứng; spec CHA chỉ phủ `LG-3-flow`.

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-flow | §3.1 (state-machine 5 PHA), §3.3 (cổng giữa PHA), §4.1 (`chay_luong` + INV-FLOW-1..4), §4.2 (router đệ-quy + ladder), §6 | T1 thứ-tự sinh-xuống · T2 G0 chặn · T5 khép-lên cascade · T7 tái-nhập đường-cong mới · R1/R2 phanh chi-phí · §8.3 lát Phở Hà đầu-cuối |

## 11. OPEN-Q

- **OQ-1:** Trần `K` vòng đơn trước khi leo song-vòng (PHA3) = số cứng generic hay cấu-hình
  theo độ-rủi-ro hành-động? SoT nói "≤K" mà không chốt K. Đề-xuất: mặc-định K nhỏ (vd 2-3),
  CEO/đội kỹ-thuật chỉnh; chi-tiết chốt ở `03d`.
- **OQ-2:** "guard token" của escalation ladder (STRATEGIC vòng 2) đo bằng ngưỡng token tuyệt-đối
  hay tỉ-lệ ngân-sách phiên? `debate.js` đã có guard nhưng SoT không định ngưỡng — chờ CEO chốt
  chính-sách chi-phí.
