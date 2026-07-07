# 01-Departments — bộ hồ sơ phòng ban RIÊNG của DN này

> Thư mục này được `/vn-onboard` (Bước 6c) sinh: sao KHUÔN SINH từ `knowledge/departments/` (12 phòng nền)
> + `knowledge/packs/<pack>/departments/` (phòng pack ngành), rồi **tinh chỉnh toàn bộ nội dung theo ngữ cảnh DN**
> (ngành, ICP, stage — đọc từ `.vncoderc` + `00-Brain/`).

## Cấu trúc

```
01-Departments/
├── 01-governance/ … 12-growth/     # 12 phòng nền
│   ├── department.yaml             # routing, alias, debate_role (đã thêm từ khóa ngành)
│   └── agents/*.md                 # persona từng vai, viết theo ngữ cảnh DN
└── 13-…/                           # phòng pack / phòng mới sinh theo ngành (nếu có)
```

## Quy tắc

- **Chỉ-đọc-vault:** debate/router đọc persona TỪ ĐÂY, không fallback `knowledge/departments/` (đó là khuôn sinh).
  Thiếu hồ sơ phòng → agent trả `persona_missing: true`; chạy lại `/vn-onboard` (Bước 6c) để backfill.
- **Khóa KHÔNG đổi** khi tinh chỉnh (taxonomy/router/KHO phụ thuộc): `code`, `capability_name`, `maps_to`,
  `agents[]` (id), `default_speaker`, khung frontmatter persona.
- **Grounding:** persona không chứa số bịa của DN — số ngành gắn `[benchmark ngành — cần CEO xác minh]`,
  số DN chỉ trích `00-Brain/`.
- Danh sách phòng ở đây phải khớp `active_departments` trong `.vncoderc`.
