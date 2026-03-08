# PROMPT — Branch 04-feat-workspace-fe

> T2 Feature Chat. Lam theo tung phase, HOI xac nhan sau moi phase.

---

## Doc truoc khi bat dau (BAT BUOC)

```
1. .context/branches/04-feat-workspace-fe/CONTRACTS.md  ← API contracts, imports, patterns
2. .context/specs/02-workspace-team.md                   ← full specs (Frontend Pages section)
3. .context/research/CONVENTIONS.md                      ← coding rules
4. .context/research/PITFALLS.md                         ← cam bay
5. Doc code thuc te:
   - apps/web/src/hooks/useLogin.ts                      ← mutation hook pattern
   - apps/web/src/hooks/useCurrentUser.ts                ← query hook pattern
   - apps/web/src/stores/auth.store.ts                   ← store pattern (persist)
   - apps/web/src/stores/workspace.store.ts              ← existing store to expand
   - apps/web/src/features/auth/LoginPage.tsx            ← page pattern (form + hook)
   - apps/web/src/features/auth/RegisterPage.tsx         ← page pattern
   - apps/web/src/components/Sidebar.tsx                 ← sidebar (add WorkspaceSwitcher)
   - apps/web/src/components/Header.tsx                  ← header layout
   - apps/web/src/layouts/DashboardLayout.tsx            ← layout structure
   - apps/web/src/App.tsx                                ← routing
   - apps/web/src/components/ProtectedRoute.tsx          ← route guard
```

---

## Phases (lam TUAN TU — hoi xac nhan giua moi phase)

### Phase 1: Expand Store + Create Hooks (10 hooks)
Doc `.context/branches/04-feat-workspace-fe/phases/01-store-hooks.md`

### Phase 2: Pages (4 pages)
Doc `.context/branches/04-feat-workspace-fe/phases/02-pages.md`

### Phase 3: Components + Routing
Doc `.context/branches/04-feat-workspace-fe/phases/03-components-routing.md`

---

## Rules

1. Follow CONTRACTS.md CHINH XAC — ko tu bia import/component
2. Kiem tra import TON TAI truoc khi dung
3. Code comments tieng ANH
4. KHONG tao file ngoai scope — hoi user truoc
5. KHONG commit — de user review
6. Cap nhat `.context/branches/04-feat-workspace-fe/PROGRESS.md` sau MOI phase
7. Giai thich tung buoc (Learning Mode)
8. Dung Zustand selectors: `useStore((s) => s.field)` — ko destructure
9. API calls dung `@/services/api` (Axios instance) — ko tao instance moi
10. Styling: Tailwind + lucide-react icons + react-hot-toast
