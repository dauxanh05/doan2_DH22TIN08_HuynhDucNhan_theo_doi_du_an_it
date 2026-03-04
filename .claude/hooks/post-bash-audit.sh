#!/bin/bash
# Audit log: ghi lai moi Bash command Claude chay
# Reads hook payload from stdin, logs tool_name + command

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/audit.log"

if [ -n "$COMMAND" ]; then
  echo "[$TIMESTAMP] $TOOL_NAME: $COMMAND" >> "$LOG_FILE"
fi

exit 0
