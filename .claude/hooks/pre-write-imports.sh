#!/bin/bash
# PreToolUse hook: check imports trước khi Write/Edit
# Đọc file sắp được write, grep imports, verify file tồn tại

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [ -z "$FILE_PATH" ] || [ -z "$CONTENT" ]; then
  exit 0
fi

# Chỉ check TypeScript files
if ! echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$'; then
  exit 0
fi

# Xác định base dir
if echo "$FILE_PATH" | grep -q "apps/api"; then
  BASE_DIR="$CLAUDE_PROJECT_DIR/apps/api/src"
elif echo "$FILE_PATH" | grep -q "apps/web"; then
  BASE_DIR="$CLAUDE_PROJECT_DIR/apps/web/src"
else
  exit 0
fi

# Extract relative imports và check file tồn tại
MISSING=""
FILE_DIR=$(dirname "$FILE_PATH")

while IFS= read -r imp; do
  # Bỏ qua external imports (không bắt đầu bằng . hoặc @/)
  if ! echo "$imp" | grep -qE "^(\.|@/)"; then
    continue
  fi

  # Convert @/ alias thành src/
  RESOLVED=$(echo "$imp" | sed "s|^@/|$BASE_DIR/|")

  # Nếu là relative import
  if echo "$imp" | grep -q "^\."; then
    RESOLVED="$FILE_DIR/$imp"
  fi

  # Check file tồn tại (thử .ts, .tsx, /index.ts, /index.tsx)
  FOUND=false
  for EXT in ".ts" ".tsx" "/index.ts" "/index.tsx" ""; do
    if [ -f "${RESOLVED}${EXT}" ]; then
      FOUND=true
      break
    fi
  done

  if [ "$FOUND" = false ]; then
    MISSING="$MISSING\n  ⚠ Import not found: $imp"
  fi
done <<< "$(echo "$CONTENT" | grep -oP "from\s+['\"]([^'\"]+)['\"]" | sed "s/from\s*['\"]//;s/['\"]$//")"

if [ -n "$MISSING" ]; then
  echo "⚠ Import check warnings:$MISSING"
  echo "  (Files may need to be created first)"
fi

exit 0
