---
id: 03b-pha1-phan-ra
version: 0.1.0
status: draft
source_anchor: "luong-generic-v3.html §3 PHA 1 (dòng 346-379)"
covers: [LG-3-PHA1-1A, LG-3-PHA1-1B, LG-3-PHA1-1C, LG-3-PHA1-1D, LG-3-PHA1-gateA, LG-3-PHA1-gateB, LG-3-PHA1-vaora, LG-3-PHA1-why-aspect]
depends_on: [00-tong-quan-va-thuat-ngu, 01-nguyen-ly-va-mo-hinh-tang, 02-brain-schema, 04-taxonomy-generic, 06-bang-tra-rule-engines]
milestone: M4
---

# 03b · PHA 1 · Phân-rã sinh-thành

> **Trái tim trục dọc.** PHA 1 biến `telos + stage + Brain` thành **cây việc** rồi
> **SUY cấu-trúc NGƯỢC-LÊN** (việc → bộ-phận → phòng → khối) có tra-KHO mỗi tầng.
> Nguyên-lý nhân-quả: **cấu-trúc sinh SAU việc**, không vẽ-sẵn trước (INV-5 của `01-nguyen-ly`).
> Spec này *điều-phối* các luật của `01-nguyen-ly` (`validate_dung_tang`, `sinh_nhiem_vu_chinh`),
> bảng generic của `04-taxonomy` (11 khía-cạnh / 7 khối / 12 phòng) và luật reuse của `05-kho`
> thành một LUỒNG có 2 cổng CEO (A sớm/rẻ, B duyệt-gộp).

## 1. Mục-đích & phạm-vi

Spec này hiện-thực **§3 "PHA 1 · Phân-rã sinh-thành"** của SoT: luồng 4 bước
**1A lăng-kính → 1B sinh cây việc → 1C suy cấu-trúc ngược-lên + tra-kho → 1D ưu-tiên**,
cùng **Cổng A** (duyệt KHUNG) và **Cổng B** (duyệt 08-plan + cây cấu-trúc + báo-cáo tra-kho),
và hai artifact đầu-ra `06-structure.md` + `08-execution-plan.md`.

**Trong phạm-vi (in):** thứ-tự & chuyển-trạng-thái 1A→1D; định-dạng 2 file đầu-ra;
luật `why-aspect` (sinh mục-tiêu từ khía-cạnh, KHÔNG từ phòng-ban); thuật-toán
`gom_nguoc_len` 4 tầng (TẦNG 0 nhiệm-vụ-con → bộ-phận → phòng → khối) với tra-KHO mỗi tầng;
2 cổng CEO (vị-trí, nội-dung duyệt, pre/post-condition).

**Ngoài phạm-vi (out):** phép-thử đúng-tầng + cơ-chế sinh nhiệm-vụ-chính 3 lớp
(→ `01-nguyen-ly-va-mo-hinh-tang.md`, spec này GỌI lại); nội-dung 11 khía-cạnh & ánh-xạ
khía-cạnh→phòng + 7 khối/12 phòng canonical + tên-kép (→ `04-taxonomy-generic.md`);
schema `_index.md` KHO + luật reuse/adapt/new chi-tiết + cổng PROMOTE (→ `05-kho-tai-dung.md`);
6 bảng-tra GĐ/mẫu-mục-tiêu/lưới-3-lớp (→ `06-bang-tra-rule-engines.md`);
phát-hiện stage & Brain (→ `03a-pha0-khoi-tao.md`); thực-thi từng hành-động (→ `03c-pha2-thuc-thi.md`);
khép-vòng PROMOTE → cập-nhật KHO (→ `03d-pha3-khep-vong.md`).

## 2. Thuật-ngữ liên-quan

Xem `00-tong-quan-va-thuat-ngu.md` cho: `telos` (LG-G-telos), `11 khía-cạnh` (LG-G-11-khia-canh),
`3 tầng cấu-trúc khối/phòng/bộ-phận` (LG-G-khoi-phong-bo-phan), `gom-ngược-lên` (LG-G-gom-nguoc-len),
`điều-kiện-đủ` (LG-G-dieu-kien-du), `sinh-nvc-3-lớp` (LG-G-sinh-nvc-3-lop),
`3 chiều tấn/thủ/hậu` (LG-G-tancong-phongthu-haucan), `reuse/adapt/new` (LG-G-reuse-adapt-new),
`reuse-grade` (LG-G-reuse-grade), `kho-index` (LG-G-kho-index), `tên-kép` (LG-G-ten-kep),
`rolling-wave` (LG-G-rolling-wave), `MECE` (LG-G-mece), `HITL` (LG-G-hitl).

## 3. Mô-hình dữ-liệu

PHA 1 KHÔNG định-nghĩa schema tầng mới (đã ở `01-nguyen-ly` §3); nó định-nghĩa **2 file đầu-ra**.

### 3.1 · `08-execution-plan.md` (LG-3-PHA1-vaora — kế-hoạch cuộn-sóng)

Đường-dẫn: `02-Tasks/<slug>/08-execution-plan.md` (LG-8-plan-gd). Chiến-lược **rolling-wave**:
GĐ hiện-tại chi-tiết tới nhiệm-vụ-con; GĐ sau CHỈ để điều-kiện-cổng.

```yaml
---
stage_hien_tai: GĐ4            # từ PHA 0 (03a)
muc_dich_gd: "<câu-sống-còn của GĐ, generic-theo-GĐ khoác chữ DN>"   # LG-1.1-7
---
```

| Field (mỗi mục-tiêu) | Kiểu | Ý-nghĩa |
|---|---|---|
| `khia_canh` | enum 1..11 | khía-cạnh đẻ ra mục-tiêu (LG-3-PHA1-why-aspect) |
| `co_ly_do_ton_tai` | bool | đáp cổng cắt-tỉa "khía-cạnh có lý-do tồn-tại ở GĐ này?" (LG-1.1-4) |
| `muc_tieu` | `trang_thai` | STATE đích, đã qua `validate_dung_tang` (§4.2) |
| `nhiem_vu_chinh[]` | NhiemVuChinh | ra từ `sinh_nhiem_vu_chinh` (gọi `01-nguyen-ly` §4.2) |
| `nhiem_vu_con[]` | nguyên-tử | mỗi nv có `chieu ∈ {tấn,thủ,hậu}` + `{đầu-vào, đầu-ra, ràng-buộc}` (đầu-vào 1C) |
| `uu_tien` | int | thứ-tự 1D cho GĐ hiện-tại |

> GĐ tương-lai chỉ ghi `{stage, dieu_kien_cong_mo}` — KHÔNG phân-rã (LG-G-rolling-wave).

### 3.2 · `06-structure.md` (LG-3-PHA1-vaora — cây cấu-trúc suy-ra + báo-cáo tra-kho)

Đường-dẫn: `02-Tasks/<slug>/06-structure.md` (LG-8-structure-task). Cây 3 tầng
**khối ▷ phòng ▷ bộ-phận**, mỗi nút mang con-trỏ canonical + reuse + lịch GĐ.

| Field (mỗi nút cây) | Kiểu | Ý-nghĩa |
|---|---|---|
| `tang` | enum `khoi\|phong\|bo_phan` | tầng cấu-trúc |
| `ten_nganh` / `ten_nang_luc` | string | tên-kép (LG-4.3-*; định-nghĩa ở `04-taxonomy`) |
| `maps_to` | `K*` / `dept-*` | neo canonical 7 khối / 12 phòng (LG-4.3-maps-to) |
| `gom_tu[]` | ref | việc/nút con đã gom NGƯỢC-LÊN (vết §4.3) |
| `tra_kho` | enum `reuse\|adapt\|new` | kết-quả tra `_index.md` (LG-6.5-*) |
| `reused_from` | path? | đường-dẫn KHO nếu reuse/adapt (LG-6.5-reuse) |
| `gd_kich_hoat` | enum GĐ | GĐ hiện-tại = `live`, còn lại = `ngủ` |

Cuối file: **báo-cáo tra-kho** = bảng tóm `{nút, tầng, tra_kho ∈ reuse/adapt/new, reused_from}`
để Cổng B duyệt (§6). Cây này là "view gom-nhóm" của cây việc trong `08-plan`, nên 2 file
duyệt CÙNG LÚC (LG-3-PHA1-gateB).

## 4. Hành-vi / thuật-toán

Luồng tổng PHA 1 (Vào: Brain + stage + `_index.md` KHO — LG-3-PHA1-vaora):

```
INPUT : brain (telos/positioning/curves/state… §02), stage (từ 03a), kho_index (§05)
OUTPUT: 08-execution-plan.md, 06-structure.md
        (qua 2 cổng CEO: A trước phân-rã, B sau)

func pha1(brain, stage, kho_index):
    lang_kinh = buoc_1A(brain, stage)              # bộ kính để NGHĨ
    >>> CỔNG A: duyệt KHUNG (telos/định-vị/lăng-kính/stage) — sớm, rẻ   # §6
    cay_viec  = buoc_1B(brain, stage, lang_kinh)   # telos→…→nhiệm-vụ-con
    cay_ct, bao_cao_kho = buoc_1C(cay_viec, kho_index)  # gom ngược-lên + tra-kho
    plan = buoc_1D(cay_viec, cay_ct)               # ưu-tiên GĐ hiện-tại
    >>> CỔNG B: duyệt 08-plan + cây cấu-trúc + báo-cáo tra-kho CÙNG LÚC  # §6
    return ghi(08-execution-plan.md, 06-structure.md)
```

### 4.1 · Bước 1A — Lăng-kính khởi-động (LG-3-PHA1-1A)

```
func buoc_1A(brain, stage):
    # 7 khối / 12 phòng nền (04-taxonomy) + pack ngành = BỘ KÍNH ĐỂ NGHĨ
    # KHÔNG phải org-chart; KHÔNG cam-kết cấu-trúc ở đây (cấu-trúc sinh ở 1C, INV-5)
    return { khoi: 7_khoi_canonical, phong: 12_phong_canonical, pack: pack_nganh(brain) }
```

Mục-đích duy-nhất: cấp khung gợi-ý để 1B duyệt cho không-sót. Đây là vật-liệu Cổng A duyệt rẻ.

### 4.2 · Bước 1B — Sinh cây việc (LG-3-PHA1-1B)

Thứ-tự nhân-quả `telos → mục-đích GĐ → [duyệt 11 khía-cạnh] → mục-tiêu → nhiệm-vụ-chính → nhiệm-vụ-con`.
**Chỉ GĐ hiện-tại chi-tiết** (GĐ sau cuộn-sóng).

```
func buoc_1B(brain, stage, lang_kinh):
    telos      = brain.telos                                  # PHÂN-RÃ, do CEO (LG-1.1-6)
    muc_dich   = bang_tra_GD[stage].cau_song_con(brain)       # GENERIC-theo-GĐ, khoác chữ DN (LG-1.1-7)
    cay = []

    # ── DUYỆT 11 KHÍA-CẠNH (cổng cắt-tỉa) — trục SINH, KHÔNG dùng phòng-ban (§4.4) ──
    for asp in 11_khia_canh:                                  # bảng generic ở 04-taxonomy
        if not co_ly_do_ton_tai(asp, stage, brain):           # cổng "lý-do tồn-tại nay?" (LG-1.1-4)
            continue                                          # cắt-tỉa: bỏ khía-cạnh không-liên-quan GĐ
        muc_tieu = sinh_muc_tieu_tu_khia_canh(asp, stage, brain)   # TRẠNG-THÁI; mẫu ở 06-bang-tra
        assert validate_dung_tang(muc_tieu).ok                # GỌI 01-nguyen-ly §4.1 (chống nén tầng)

        # GỌI cơ-chế 3 lớp của 01-nguyen-ly §4.2 (KHÔNG tái-định ở đây)
        nvc = sinh_nhiem_vu_chinh(muc_tieu, brain)            # Lớp1 điều-kiện-đủ→Lớp2 3 chiều→Lớp3 chéo→cổng→neo

        for v in nvc:
            v.nhiem_vu_con = be_thanh_nguyen_tu(v, [tan, thu, hau])  # mỗi nv-con có chiều + {đầu-vào/ra/ràng-buộc}
            for vc in v.nhiem_vu_con: assert validate_dung_tang(vc).ok
        dat_ten_chuan(nvc)                                    # kebab/tên-năng-lực (LG-5.3-chuan-ten) để 1C tra KHO
        cay.append({asp, muc_tieu, nvc})
    return {telos, muc_dich, cay}
```

**Edge-case:** mọi khía-cạnh đều `co_ly_do_ton_tai == false` ở GĐ rất sớm → cây tối-thiểu nhưng
KHÔNG rỗng (telos + mục-đích vẫn có); cổng cắt-tỉa chỉ tỉa khía-cạnh, không tỉa mục-đích GĐ.

### 4.3 · Bước 1C — Suy cấu-trúc NGƯỢC-LÊN + TRA-KHO (LG-3-PHA1-1C)

Đầu-vào: **danh-sách ĐẦY-ĐỦ nhiệm-vụ-con** GĐ hiện-tại, mỗi việc có `{đầu-vào, đầu-ra, ràng-buộc}`.
Gom dần lên 3 tầng; **mỗi tầng tra `_index.md` KHO** (so khía-cạnh + GĐ + đầu-vào/ra) → reuse/adapt/new.

```
func buoc_1C(cay_viec, kho_index):
    nut, bao_cao = [], []

    # TẦNG 0 · nhiệm-vụ-con — tra KHO từng việc
    for vc in cay_viec.tat_ca_nhiem_vu_con():
        kq = tra_kho(kho_index, key={khia_canh:vc.asp, gd:stage, io:vc.io})   # GỌI 05-kho §luật-tra
        # khớp ≥ ngưỡng → REUSE (SOP/template) · gần đúng → ADAPT · khác hẳn → NEW (LG-6.5-*)
        vc.tra_kho = kq.quyet_dinh; vc.reused_from = kq.path
        bao_cao.append(vc)

    # TẦNG 1 · BỘ-PHẬN — gom việc CÙNG NĂNG-LỰC → bộ-phận ứng-viên → tra KHO
    bo_phan = gom_theo(cay_viec, theo="nang_luc")
    for bp in bo_phan: bp = tra_kho_va_gan(bp, kho_index); bao_cao.append(bp)

    # TẦNG 2 · PHÒNG — gom bộ-phận CÙNG CHỨC-NĂNG → tên-kép, neo canonical-12 → tra KHO
    phong = gom_theo(bo_phan, theo="chuc_nang")
    for p in phong: p.maps_to = neo_canonical_12(p); p = tra_kho_va_gan(p, kho_index); bao_cao.append(p)

    # TẦNG 3 · KHỐI — gom phòng CÙNG SỨ-MỆNH → neo 7 khối canonical → tra KHO
    khoi = gom_theo(phong, theo="su_menh")
    for k in khoi: k.maps_to = neo_7_khoi(k); k = tra_kho_va_gan(k, kho_index); bao_cao.append(k)

    # gắn-nhãn GĐ kích-hoạt: GĐ hiện-tại=live, còn lại=ngủ; CHỈ đẻ đơn-vị khi việc lặp đủ nhiều
    gan_lich_kich_hoat(khoi, phong, bo_phan, stage)
    cay_ct = lap_cay(khoi ▷ phong ▷ bo_phan)        # mỗi nút: maps_to · reused_from · gd_kich_hoat
    return cay_ct, bao_cao
```

**Bất-biến (INV-5 của `01-nguyen-ly`):** cấu-trúc là KẾT-QUẢ gom NGƯỢC-LÊN ở CUỐI — KHÔNG được
nhét việc vào org-chart vẽ-sẵn. **Edge-case:** việc lặp chưa đủ nhiều → KHÔNG đẻ bộ-phận mới
(để việc treo dưới phòng), tránh phình tổ-chức sớm.

### 4.4 · Luật `why-aspect` — sinh từ KHÍA-CẠNH, không từ PHÒNG-BAN (LG-3-PHA1-why-aspect)

Luật BẤT-BIẾN (generic) chi-phối toàn 1B:

- **KHÍA-CẠNH** trả lời "cần đạt CÁI GÌ" → thuộc **MỤC-TIÊU** (đầu chuỗi).
- **PHÒNG-BAN** trả lời "AI có năng-lực làm" → thuộc **THỰC-THI** (cuối chuỗi, suy ra SAU ở 1C).
- Sinh mục-tiêu từ phòng-ban = lấy cái-có-SAU đẻ cái-có-TRƯỚC = vòng luẩn-quẩn + "vẽ-sẵn".
- Phòng-ban map **nhiều-nhiều** với khía-cạnh (vd Rủi-ro trải khắp pháp-chế + tài-chính + vận-hành)
  → trục SINH lộn-xộn; khía-cạnh là trục **sạch, BẤT-BIẾN, đảm-bảo KHÔNG-SÓT** (MECE).

→ Hệ-quả thiết-kế: vòng lặp 1B duyệt theo `11_khia_canh`, KHÔNG theo `12_phong`; phòng chỉ xuất-hiện
ở 1C như view gom-nhóm của cây việc.

### 4.5 · Bước 1D — Thứ-tự ưu-tiên (LG-3-PHA1-1D)

```
func buoc_1D(cay_viec, cay_ct):
    return xep_uu_tien(cay_viec.action_list(stage))   # CHỈ action-list GĐ hiện-tại
```

## 5. Ranh-giới generic ↔ phân-rã

| Thành-phần PHA 1 | GP | Lý-do |
|---|---|---|
| Lăng-kính 7 khối/12 phòng + bảng 11 khía-cạnh (1A, vòng-lặp 1B) | **GENERIC** | bảng cố-định, mọi DN dùng chung (LG-1.1-2; `04-taxonomy`) |
| Cổng cắt-tỉa "khía-cạnh X có lý-do tồn-tại ở GĐ này?" | **GENERIC** câu-hỏi / **PHÂN-RÃ** đáp-án | LG-1.1-4 |
| Luật tra-kho reuse/adapt/new (1C) | **GENERIC** | luật cố-định; tài-sản tùy ngành (LG-1.1-5; `05-kho`) |
| Luật `why-aspect` (sinh từ khía-cạnh) | **GENERIC** | LG-3-PHA1-why-aspect (trục bất-biến) |
| `mục-đích GĐ` | **GENERIC-theo-GĐ** | câu-sống-còn của GĐ, khoác chữ DN (LG-1.1-7) |
| `mục-tiêu → nhiệm-vụ-con` (cây việc 1B) | **PHÂN-RÃ** | suy theo khía-cạnh × DN (LG-1.1-8/9) |
| cây `bộ-phận → phòng → khối` (1C) + thứ-tự 1D | **PHÂN-RÃ** | gom NGƯỢC-LÊN tùy việc; neo canonical generic (LG-1.1-10) |

## 6. Cổng & luật bất-biến

### 6.1 · Cổng A — duyệt KHUNG (LG-3-PHA1-gateA)

- **Vị-trí:** SAU 1A, TRƯỚC 1B (trước phân-rã tốn-kém).
- **Duyệt:** telos · định-vị · lăng-kính · stage. **Lý-do:** sớm & rẻ — bắt sai-khung trước khi
  đổ công-sức sinh cả cây việc (LG-G-hitl).
- **Pre:** Brain + stage có (từ 03a). **Post:** CEO chốt KHUNG → mở 1B; nếu bác → quay 03a/CEO.
- **Loại:** HITL ở main loop (theo CLAUDE.md: `AskUserQuestion` ở main loop, KHÔNG trong Workflow).

### 6.2 · Cổng B — duyệt GỘP plan + cấu-trúc + tra-kho (LG-3-PHA1-gateB)

- **Vị-trí:** SAU 1D (cuối PHA 1).
- **Duyệt CÙNG LÚC:** `08-execution-plan.md` + cây cấu-trúc-suy-ra (`06-structure.md`) + **báo-cáo
  tra-kho** (nút nào reuse / adapt / new). **Lý-do gộp:** cấu-trúc chính là "view gom-nhóm" của
  cây việc — duyệt RỜI sẽ vô-nghĩa.
- **Pre:** 1B/1C/1D xong, mọi item qua `validate_dung_tang`. **Post:** CEO chốt → ghi 2 file +
  commit/push (vault ephemeral); nếu bác nhánh nào → cascade sinh-lại nhánh đó.

### 6.3 · Luật bất-biến

- **INV-P1 (chiều-sinh):** cấu-trúc sinh ở 1C bằng gom NGƯỢC-LÊN, SAU cây việc 1B (kế-thừa INV-5
  của `01-nguyen-ly`; LG-1.2-dn).
- **INV-P2 (why-aspect):** vòng-lặp sinh mục-tiêu duyệt theo 11 khía-cạnh, KHÔNG theo 12 phòng
  (LG-3-PHA1-why-aspect).
- **INV-P3 (đúng-tầng):** mọi `mục-tiêu/nv-chính/nv-con` PHẢI qua `validate_dung_tang` của
  `01-nguyen-ly` trước khi vào cây.
- **INV-P4 (rolling-wave):** chỉ GĐ hiện-tại chi-tiết; GĐ sau chỉ điều-kiện-cổng (LG-G-rolling-wave).
- **INV-P5 (tra-kho mỗi tầng):** TẦNG 0→3 đều tra `_index.md` trước khi đẻ mới (LG-1.1-5, LG-6.5-*).

## 7. Giao-diện & điểm-cắm code

| Điểm-cắm | Loại | Ghi-chú |
|---|---|---|
| skill `vn-architect` (HOẶC mở-rộng `pack-architect`) | THÊM | chủ thể chạy luồng 1A→1D = aspect-walk → gom-ngược-lên + tra-kho (LG-9-architect) |
| `vn-orchestrator/SKILL.md` Bước 7 (sinh cây việc) | SỬA | gọi `vn-architect` cho 1B/1C; nhúng 2 cổng A/B ở main loop (LG-9-taskgen, LG-9-lens-3chieu) |
| `01-nguyen-ly` `validate_dung_tang` + `sinh_nhiem_vu_chinh` | GỌI | 1B dùng làm luật đúng-tầng & cơ-chế 3 lớp (KHÔNG tái-định) |
| `04-taxonomy-generic.md` (11 khía-cạnh / 7 khối / 12 phòng / tên-kép) | GỌI | bảng generic cho 1A duyệt + 1C neo canonical |
| `05-kho-tai-dung.md` (`_index.md` + luật reuse) | GỌI | `tra_kho` ở 1C; báo-cáo tra-kho cho Cổng B (LG-9-kho-index) |
| `06-structure.md` · `08-execution-plan.md` | THÊM | 2 artifact đầu-ra (LG-8-structure-task, LG-8-plan-gd) |

## 8. Tiêu-chí chấp-nhận

### 8.1 · Lát Phở Hà — duyệt 11 khía-cạnh GĐ4 (LG-7-PHA1)

Cho `stage = GĐ4` (đã chốt ở 03a/PHA 0) + Brain Phở Hà. Vòng-lặp 1B (`co_ly_do_ton_tai`) PHẢI cho:

| Khía-cạnh | Kỳ-vọng cổng cắt-tỉa |
|---|---|
| Tiền · Hậu-cần · Vận-hành · Dữ-liệu · Rủi-ro · Con-người | **CÓ** (sinh mục-tiêu) |
| Đối-tác | **NHẸ** (vốn HOÃN ở GĐ4) |
| Bền-vững · Đào-tạo | **NGỦ** (không sinh việc GĐ này) |

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.2 · Lát Phở Hà — 1C gom ngược-lên + tra-kho (LG-7-PHA1C)

Chạy `buoc_1C` trên cây việc GĐ4 → báo-cáo tra-kho PHẢI cho **4/5 bộ-phận reuse KHO**
(Bếp-trung-tâm REUSE · Thu-mua ADAPT · Kiểm-soát-giá · ATTP) và **chỉ BI/Báo-cáo = NEW**.
Kiểm thêm: mỗi nút có `maps_to` canonical + `gd_kich_hoat` (GĐ4 live, còn lại ngủ).

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

### 8.3 · Cổng B duyệt-gộp (LG-3-PHA1-gateB)

Test: chạy PHA 1 tới hết 1D → đảm-bảo cổng phát ĐÚNG MỘT lượt hỏi CEO mang CẢ
`08-plan` + `06-structure` + báo-cáo tra-kho (không tách rời).

### 8.4 · INV-P2 why-aspect (LG-3-PHA1-why-aspect)

Test cấu-trúc: vòng-lặp sinh mục-tiêu của `buoc_1B` lặp trên tập `11_khia_canh`, KHÔNG trên
`12_phong`; mọi `phong` chỉ sinh trong `buoc_1C` (gom-nhóm). Lát thử: Rủi-ro sinh đúng 1 mục-tiêu
ở 1B nhưng map tới ≥2 phòng ở 1C (chứng-minh quan-hệ nhiều-nhiều ⇒ không-được làm trục sinh).

→ acceptance **INLINE** trong `test/flow.test.js + test/golden-pho-ha.test.js` (neo claim `LG-*`); tên fixture `.json` cũ chỉ MINH-HOẠ, KHÔNG phải file rời — xem `IMPL-STATUS.md` mục “Ghi-chú fixture §8”.

## 9. Phụ-thuộc & thứ-tự

- **Milestone:** M4 (gom-ngược-lên + KHO) — theo LG-9-uutien (sau M1/M2).
- **Trước (BẮT-BUỘC có):** `01-nguyen-ly-va-mo-hinh-tang.md` (luật đúng-tầng + sinh nvc 3 lớp),
  `04-taxonomy-generic.md` (11 khía-cạnh/7 khối/12 phòng/tên-kép), `05-kho-tai-dung.md`
  (`_index.md` + reuse), `06-bang-tra-rule-engines.md` (bảng GĐ + mẫu mục-tiêu + lưới 3 lớp),
  `03a-pha0-khoi-tao.md` (cấp Brain + stage).
- **Sau / dùng spec này:** `03c-pha2-thuc-thi.md` (đọc `08-plan` làm brief con),
  `03d-pha3-khep-vong.md` (thêm/bớt/sửa cấu-trúc khi vận-hành + PROMOTE → KHO).

## 10. Bảng truy-vết

| Claim ID | Mục trong spec | Acceptance test |
|---|---|---|
| LG-3-PHA1-1A | §4.1 | §8.1 lăng-kính cấp bộ-kính (input vòng-lặp 1B) |
| LG-3-PHA1-1B | §3.1, §4.2 | §8.1 aspect-walk → mục-tiêu → nvc → nv-con |
| LG-3-PHA1-1C | §3.2, §4.3 | §8.2 gom ngược-lên + tra-kho 4 tầng |
| LG-3-PHA1-1D | §4.5 | §8.2/§8.3 action-list GĐ hiện-tại có `uu_tien` |
| LG-3-PHA1-gateA | §6.1 | §8.3 cổng KHUNG phát trước 1B |
| LG-3-PHA1-gateB | §6.2 | §8.3 duyệt-gộp plan+cấu-trúc+tra-kho 1 lượt |
| LG-3-PHA1-vaora | §3.1, §3.2, §4 | §8.2 ra `06-structure.md` + `08-execution-plan.md`; vào Brain+stage+_index |
| LG-3-PHA1-why-aspect | §4.4, §6.3 INV-P2 | §8.4 vòng-lặp theo 11 khía-cạnh, không theo phòng |

## 11. OPEN-Q

- **OQ-1:** Ngưỡng "việc lặp đủ nhiều" để 1C ĐẺ bộ-phận mới (vs treo việc dưới phòng) — định-lượng
  bao nhiêu lần lặp / khối-lượng? Hiện để heuristic; chờ CEO/đội kiến-trúc chốt.
- **OQ-2:** Ngưỡng khớp ngữ-cảnh REUSE vs ADAPT khi tra `_index.md` (1C TẦNG 0) — số cụ-thể thuộc
  `05-kho-tai-dung.md`; PHA 1 chỉ tiêu-thụ kết-quả. Cần `05-kho` chốt rubric trước khi viết fixture §8.2.
- **OQ-3:** Cổng A bác KHUNG → quay 03a hay dừng hỏi CEO trực-tiếp? Ranh-giới cascade khi đổi telos
  ở Cổng A chờ thống-nhất với `03d` (khép-vòng).
