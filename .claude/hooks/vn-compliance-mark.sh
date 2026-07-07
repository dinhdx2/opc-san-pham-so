#!/bin/bash
# PostToolUse (Write|Edit) — đánh dấu "phiên này có đụng VAULT" để Stop-gate biết đây là việc vn-*.
# Scope "chỉ vn-*": chỉ tạo marker khi file_path nằm trong vault; code thường KHÔNG tạo marker.
# Luôn exit 0 (không bao giờ cản thao-tác). Fail-open tuyệt-đối.
input=$(cat 2>/dev/null)
fp=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$fp" ] && exit 0
case "$fp" in
  *"/vaults/"*|*"/vault/"*|*"/02-Tasks/"*|*"/03-Outputs/"*)
    gitdir=$(git rev-parse --git-dir 2>/dev/null) && : > "$gitdir/vn-compliance-touched" 2>/dev/null
    ;;
esac
exit 0
