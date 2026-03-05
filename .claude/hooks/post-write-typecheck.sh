#!/bin/bash
# PostToolUse hook: chạy tsc --noEmit sau khi Write/Edit file .ts/.tsx
# Kiểm tra TypeScript errors ngay lập tức

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Chỉ check TypeScript files
if ! echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$'; then
  exit 0
fi

# Xác định app (api hoặc web) để chạy tsc đúng tsconfig
if echo "$FILE_PATH" | grep -q "apps/api"; then
  cd "$CLAUDE_PROJECT_DIR/apps/api" && npx tsc --noEmit --pretty 2>&1 | head -20
elif echo "$FILE_PATH" | grep -q "apps/web"; then
  cd "$CLAUDE_PROJECT_DIR/apps/web" && npx tsc --noEmit --pretty 2>&1 | head -20
fi

exit 0
