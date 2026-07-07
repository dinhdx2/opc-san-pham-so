---
description: Chạy lại debate cho 1 task_folder vn-opc có sẵn — bản web/mobile
---
Resolve vault đang dùng (`lib/vault.js#resolveActiveVault`, fallback `vault/`) → `<VAULT>`. Nhận tên task_folder trong `<VAULT>/02-Tasks/`. Đọc `00-brief.md` của task đó + Brain (theo Brain Contract: 5 file canonical + `decisions-log.md`) bằng Read. Xác định `departments` + `scale` + `devilsAdvocate`: nếu task có `02-router.md` thì tái dùng; nếu không, chạy lại bước Router của skill `vn-orchestrator`. Chạy lại Workflow `workflows/debate.js` với args `{ brief, brainContext, departments, scale, devilsAdvocate }`, ghi đè `<VAULT>/02-Tasks/<task_folder>/07-decision-report.md`. Sau đó commit vào git. Brief/tên task: $ARGUMENTS
