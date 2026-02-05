---
name: commit
description: Generate a conventional commit message based on staged changes. Use when committing code changes.
---

# Generate Commit Message

Analyze staged changes and generate a commit message following Conventional Commits.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Instructions

1. Run `git diff --staged` to see changes
2. Analyze and determine:
   - Type (feat, fix, refactor, docs, style, test, chore)
   - Scope (auth, tasks, projects, api, ui, etc.)
   - Description

3. Generate commit message:
   ```
   <type>(<scope>): <short description>
   
   <optional body>
   ```

## Commit Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring |
| `docs` | Documentation |
| `style` | Formatting |
| `test` | Adding tests |
| `chore` | Build, deps, configs |

## Examples

```
feat(tasks): add task assignment feature
fix(auth): handle expired token refresh
refactor(api): extract validation to middleware
docs(readme): update setup instructions
chore(deps): upgrade prisma to v5.10
```

## Learning Mode

After generating:
1. EXPLAIN why you chose that commit type
2. EXPLAIN the scope selection
3. ASK if user wants to modify before committing

## Output

```bash
git commit -m "<generated message>"
```

## After Completion

Remind user: "Nhớ update PROGRESS.md nếu đây là milestone quan trọng!"
