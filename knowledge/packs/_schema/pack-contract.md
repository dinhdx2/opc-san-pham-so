# Pack Contract — schema + validator cho pack ngành

> Hợp đồng cấu trúc cho mọi industry pack (có sẵn: F&B / Retail / Tech-SaaS / Sản-phẩm-số; và pack lạ do `pack-architect` sinh).
> `pack-architect` PHẢI sinh đúng schema này; orchestrator/onboarder PHẢI validate trước khi kích hoạt pack vào `.vncoderc`.

## Cấu trúc thư mục bắt buộc
```
knowledge/packs/<code>/
├── pack.yaml                         # manifest (xem schema dưới)
├── README.md                         # mô tả pack, ngành đích, khi nào dùng
├── brain-template/                   # (khuyến nghị) seed Brain riêng ngành: strategy.md...
└── departments/
    └── <NN-name>/
        ├── department.yaml           # đúng schema knowledge/departments/_base/department_template.yaml
        └── agents/
            └── <role>.md             # persona, có frontmatter id/name_vn/department/expertise/required_refs
```

## Schema `pack.yaml` (trường bắt buộc ✓)
```yaml
name:               # ✓ tên hiển thị
code:               # ✓ mã ngắn, khớp tên thư mục (vd: fnb, retail)
version:            # ✓ semver
description:        # ✓ 1 câu
target_industries:  # ✓ list — dùng để match khi /vn-onboard
adds_departments:   # list mã phòng MỚI pack thêm (vd 13-kitchen). Có thể rỗng.
extends_departments: # list {target, add_agents[]} — thêm role vào phòng nền. Có thể rỗng.
brain_template:     # (tùy chọn) thư mục seed Brain
compliance_refs:    # ✓ list luật/quy chuẩn ngành (vd VSATTP NĐ 15/2018)
```

## Checklist validator (chạy trước khi kích hoạt)
1. `pack.yaml` có đủ trường ✓; `code` khớp tên thư mục.
2. Mỗi mục trong `adds_departments` có thư mục `departments/<NN-name>/` + `department.yaml` hợp lệ + ≥1 persona trong `agents/`.
3. Mã phòng mới KHÔNG trùng 12 phòng nền (01–12) trừ khi là `extends_departments`.
4. Mỗi `extends_departments[].target` trỏ tới phòng nền tồn tại; `add_agents` có file persona tương ứng (hoặc pack-architect sinh kèm).
5. Persona mới: frontmatter có `id`, `department`, `required_refs` chỉ trỏ **file Brain canonical** {`strategy`, `products`, `budget`, `state`, `headcount`} + lớp sinh-thành {`telos`, `positioning`, `curves`, `structure`, `lessons`} — xem bảng bí-danh cứng ở `knowledge/brain-schema.md`. KHÔNG dùng bí-danh cũ (`finance`/`market`/`marketing`/`customers`/`sales`/`product`/`people`/`operations`/`laws`).
6. `compliance_refs` không rỗng cho ngành có quy định pháp lý đặc thù.
7. Sau validate → ghi `active_departments` (12 nền + phòng pack) vào `vault/.vncoderc`.

> Lỗi validate → KHÔNG kích hoạt; báo CEO mục thiếu để `pack-architect` bổ sung. Pack chỉ THÊM/MỞ RỘNG phòng, không xoá phòng nền.
