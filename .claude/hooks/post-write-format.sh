#!/bin/bash
# Auto-format file after Claude writes/edits it
# Reads hook payload from stdin, extracts file_path, runs prettier

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format supported file types
if echo "$FILE_PATH" | grep -qE '\.(ts|tsx|js|jsx|json|css|scss)$'; then
  cd "$CLAUDE_PROJECT_DIR" && npx prettier --write "$FILE_PATH" 2>/dev/null
fi

exit 0
