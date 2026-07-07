# knowledge/playbook/ — KHO tái-dùng theo ngành (luồng generic v3)

> Hiện-thực spec **05 (KHO chỉ-mục)** + **08 (bố-cục)**. Mỗi ngành một thư-mục `<ngành>/` (kebab, đồng-bộ `pack.code`).
> Danh-bạ = **generic** (khung 13 cột cố-định); tài-sản = **phân-rã theo ngành**. CRUD máy đọc: `lib/kho.js`.

## Cây thư-mục một ngành
```
knowledge/playbook/<ngành>/
 ├── _index.md                       ← CHỈ-MỤC chuẩn-hoá (bảng 13 cột — khuôn ở _TEMPLATE/_index.md)
 ├── K<n>-<ten-khoi>/
 │   └── dept-<NN>-<ten>/
 │       └── <bo-phan-slug>/         ← SOP.md · template/ · persona.md · rubric.md · meta.yaml
 └── ...                             ← CHỈ tạo nhánh khi có tài-sản ĐẠT reuse-grade (LG-5.1-activate)
```

## Vòng-đời (3 API — `lib/kho.js`)
- **`them()` = PROMOTE** (LG-5.3-them): chỉ tài-sản QUA cổng PROMOTE (PHA 3) mới chèn 1 dòng `_index.md`. "Không qua cổng = không vào index."
- **`tra()` = REUSE** (LG-5.3-tra): so 4 khóa (tên-năng-lực canonical + khía-cạnh + GĐ + đầu-vào/ra) → gọi rubric `reuse_decision` (`knowledge/rule-engines/reuse-rubric.yaml`) → REUSE/ADAPT/NEW.
- **`don()` = deprecate** (LG-5.3-don): soft-delete giữ-vết (`trạng-thái=deprecated` + `superseded_by`), KHÔNG xoá cứng.

## Khóa canonical
`tên-năng-lực` chuẩn-hoá theo `knowledge/rule-engines/naming-canonical.yaml` (`naming_dict`). Không có ánh-xạ ⇒ KHÔNG được ghi `_index.md` (INV-6.6).

> KHO khởi-đầu **rỗng**; nhánh đầu-tiên xuất-hiện sau PROMOTE đầu-tiên (PHA 3). Môi-trường web: git-first, Drive tùy-chọn.
