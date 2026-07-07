#!/bin/bash
# Stop hook — CỔNG GIÁM-SÁT fail-closed (chỉ vn-*): nếu phiên có đụng vault (marker) và task
# đang làm còn vi-phạm DENY (F1/F2/F6) → CHẶN kết-thúc, buộc sửa. Sạch → cho dừng + xoá marker.
# FAIL-OPEN mọi lỗi (không tìm được vault/CLI lỗi) → exit 0, KHÔNG bao giờ brick phiên CEO.
input=$(cat 2>/dev/null)

# chống đệ-quy
if [ "$(printf '%s' "$input" | jq -r '.stop_hook_active' 2>/dev/null)" = "true" ]; then exit 0; fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
gitdir=$(git rev-parse --git-dir 2>/dev/null) || exit 0
marker="$gitdir/vn-compliance-touched"
[ -f "$marker" ] || exit 0            # không phải phiên vn-* → không gác

# vault active + task mới nhất
ptr="$root/.vn-active-vault"
vault="vault"
[ -f "$ptr" ] && vault=$(tr -d ' \t\r\n' < "$ptr")
vdir="$root/$vault"
[ -d "$vdir/02-Tasks" ] || { rm -f "$marker"; exit 0; }
rs=$(ls -t "$vdir"/02-Tasks/*/10-run-state.md 2>/dev/null | head -1)
[ -n "$rs" ] || { rm -f "$marker"; exit 0; }

# chạy engine — LƯU-Ý: CLI --json exit 1 khi có DENY (tín-hiệu), KHÔNG coi là lỗi.
# Chỉ fail-open khi output RỖNG / không phải JSON (CLI thật sự hỏng).
out=$(node "$root/tools/compliance-check.js" "$rs" --json 2>/dev/null)
[ -z "$out" ] && exit 0
deny=$(printf '%s' "$out" | jq -r '.deny_count // empty' 2>/dev/null)
[ -z "$deny" ] && exit 0
if [ "$deny" -gt 0 ] 2>/dev/null; then
  lines=$(printf '%s' "$out" | jq -r '.vi_pham[] | select(.hook=="DENY") | "  - " + .chi_tiet' 2>/dev/null | head -20)
  {
    echo "⛔ CỔNG GIÁM-SÁT TUÂN THỦ chặn kết-thúc: task có $deny vi-phạm DENY (F1/F2/F6) chưa xử."
    echo "$lines"
    echo "→ Sửa: làm THẬT bằng tool (deploy/tra-cứu) & gắn bằng-chứng resolve được (file/URL/ảnh), HOẶC khai HUMAN trung-thực, HOẶC dời process-doc sang 02-Tasks. Rồi chạy 'npm run compliance $rs' đến khi sạch. (Trục compliance — SPEC docs/design/giam-sat-tuan-thu.)"
  } >&2
  exit 2
fi
rm -f "$marker"
exit 0
