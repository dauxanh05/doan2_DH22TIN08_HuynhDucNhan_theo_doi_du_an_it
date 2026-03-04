---
name: commit
description: Generate a conventional commit message based on staged changes. Use when committing code changes.
---

# Generate Commit Message

Analyze staged changes and generate a commit message following Conventional Commits.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Pre-flight

1. Run `git diff --staged` to see changes
2. Run `git status` to see overall state
3. Doc `.context/WORKFLOW.md` neu chua biet commit convention

## Instructions

1. Run `git diff --staged` to see changes
2. Analyze and determine:
   - Type (feat, fix, refactor, docs, style, test, chore)
   - Scope (auth, users, workspace, project, task, ai, kanban, realtime, dashboard, prisma, shared, deploy)
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

## Scopes (project-specific)

`auth`, `users`, `workspace`, `project`, `task`, `ai`, `kanban`, `realtime`, `dashboard`, `prisma`, `shared`, `deploy`

## Git Push — Multiple Remotes

Project co 2 remotes. LUON hoi user muon push len tai khoan nao:

| Remote | Author | Email |
|--------|--------|-------|
| `origin` (MinhNhut05) | MinhNhut05 | leminhnut.9a10.2019@gmail.com |
| `nhan` (dauxanh05) | dauxanh05 | leminhoocaolanh@gmail.com |

```bash
git commit --author="MinhNhut05 <leminhnut.9a10.2019@gmail.com>" -m "message"
git commit --author="dauxanh05 <leminhoocaolanh@gmail.com>" -m "message"
```

## Learning Mode

After generating:
1. EXPLAIN why you chose that commit type
2. EXPLAIN the scope selection
3. ASK if user wants to modify before committing
4. ASK which remote to push to (if pushing)

## After Completion

Remind user: "Nhớ update PROGRESS.md nếu đây là milestone quan trọng!"
