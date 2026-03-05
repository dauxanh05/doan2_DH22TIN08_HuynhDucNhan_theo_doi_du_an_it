# Branches - Huong dan su dung

> Moi folder tuong ung voi 1 git branch chuyen biet.
> Agent se doc CONTEXT.md truoc khi bat dau code tren nhanh do.

## Cau truc moi nhanh

```
XX-type-ten/
├── CONTEXT.md    # Mo ta viec can lam, scope, references den context/
├── PROGRESS.md   # Bao cao tien do, da lam gi
└── TODO.md       # Checklist viec can lam con lai
```

## Merge flow (tuan tu)

```
main ← 00-foundation ← 01-auth-be ← 02-auth-fe ← 03-workspace-be
     ← 04-workspace-fe ← 05-project-task-be ← 06-project-task-fe
     ← 07-ai-be ← 08-ai-fe ← 09-kanban-fe ← 10-realtime-be
     ← 11-realtime-fe ← 12-dashboard-be ← 13-dashboard-fe
     ← 14-polish ← 15-deploy
```

Moi nhanh merge xong ve main roi nhanh tiep theo moi branch tu main.

## Quy trinh lam viec tren moi nhanh

1. `git checkout main && git pull`
2. `git checkout -b XX-type-ten`
3. Mo Claude Code CLI session moi
4. Agent doc `branches/XX-type-ten/CONTEXT.md` de hieu scope
5. Lam tung buoc theo TODO.md (Learning Mode)
6. Cap nhat PROGRESS.md sau moi buoc
7. Xong → review → merge ve main

## Quy uoc

- **Learning Mode**: Tat ca nhanh deu giai thich tung buoc
- **Testing**: Manual only (Postman/browser), khong viet unit test
- **Commit**: Conventional commits (feat:, fix:, chore:...)
- **CONTEXT.md**: Lien ket den `context/` + scope cu the cho nhanh

## Danh sach nhanh

| # | Nhanh | Loai | Mo ta |
|---|-------|------|-------|
| 00 | chore-foundation | chore | Prisma schema, .env, Docker, Shared types |
| 01 | feat-auth-be | feat | Auth + Users backend |
| 02 | feat-auth-fe | feat | Auth + Users frontend |
| 03 | feat-workspace-be | feat | Workspace + Members backend |
| 04 | feat-workspace-fe | feat | Workspace + Members frontend |
| 05 | feat-project-task-be | feat | Project + Task + File upload backend |
| 06 | feat-project-task-fe | feat | Project + Task frontend |
| 07 | feat-ai-be | feat | 4 AI endpoints backend |
| 08 | feat-ai-fe | feat | 4 AI components frontend |
| 09 | feat-kanban-fe | feat | Kanban board + drag-drop (FE + reorder API) |
| 10 | feat-realtime-be | feat | Comments + Notifications + WebSocket backend |
| 11 | feat-realtime-fe | feat | Comments + Notifications frontend |
| 12 | feat-dashboard-be | feat | Dashboard stats + activity API |
| 13 | feat-dashboard-fe | feat | Dashboard widgets + Recharts |
| 14 | feat-polish | feat | Error handling, loading, responsive |
| 15 | chore-deploy | chore | Docker, Nginx, PM2, CI/CD |
