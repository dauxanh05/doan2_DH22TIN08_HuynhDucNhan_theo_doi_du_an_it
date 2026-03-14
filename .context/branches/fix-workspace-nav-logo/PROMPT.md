# Tab Fix Workspace Navigation + Logo UX

## Vai tro
Ban la tab worker fix bug + hoan thien UX chinh cho Phase 2 workspace.
Muc tieu: sau khi xong, user co the test tron ven Phase 2 tren giao dien.

## Scope da duoc T1 chot
1. **Workspace logo**
   - Co 2 cach chon logo:
     - Upload anh tu may
     - Chon anh preset co san trong web
   - Preset images la **anh local trong project**
   - So luong preset ban dau: **10-12 anh**
   - Upload anh tu may phai co **crop step** truoc khi luu/chon

2. **Sau khi tao workspace**
   - Phai **navigate thang vao trang settings cua workspace vua tao**
   - KHONG dung o dashboard nua

3. **Sidebar / navigation**
   - Flow dua tren **current workspace**
   - `Cai dat` -> `/workspaces/:id/settings` cua current workspace
   - `Thanh vien` -> `/workspaces/:id/members` cua current workspace
   - `Du an` dang chua hoan thien phase sau, nen phai xu ly hop ly de khong chan test

4. **Neu chua co current workspace / workspace bi xoa**
   - App phai **tu ve `/workspaces`**

5. **Muc sua**
   - Khong chi va bug
   - Fix navigation/current workspace + hoan thien UX logo chinh
   - Du de test Phase 2 workspace

---

## Rules BAT BUOC
1. Doc code thuc te TRUOC khi sua, khong tu bia imports/files
2. Giu dung patterns hien tai cua project (React + TanStack Query + Zustand + feature-based)
3. Khong over-engineer. Chi lam trong scope nay
4. Neu can them assets preset, tao trong web app o vi tri hop ly, de user co the thay/bo sung sau nay
5. Sau khi xong phai chay:
   - `cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter api exec tsc --noEmit`
   - `cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit`
6. KHONG commit. Bao lai T1 tab khi xong

---

## Bat buoc doc truoc khi code
1. `.context/STATE.md`
2. `.context/research/CONVENTIONS.md`
3. `.context/research/PITFALLS.md`
4. `apps/web/src/stores/workspace.store.ts`
5. `apps/web/src/components/Sidebar.tsx`
6. `apps/web/src/components/WorkspaceSwitcher.tsx`
7. `apps/web/src/features/workspaces/WorkspaceListPage.tsx`
8. `apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx`
9. `apps/web/src/features/workspaces/CreateWorkspaceModal.tsx`
10. `apps/web/src/hooks/useCreateWorkspace.ts`
11. `apps/web/src/hooks/useWorkspaces.ts`
12. `apps/web/src/App.tsx`
13. Bat ky file route/link/nav nao lien quan workspace sau khi doc code

---

## Nhiem vu A — Fix create workspace navigation

### Van de user gap
- Tao workspace duoc
- Nhung app van dung o dashboard
- Khong vao duoc workspace settings
- Vi vay khong test tiep duoc members/settings

### Yeu cau
- Sau khi create workspace thanh cong:
  - set current workspace dung
  - navigate thang den `/workspaces/:id/settings`
- Neu list workspaces / current workspace can invalidate hoac sync state thi lam cho dung

### Can check
- `CreateWorkspaceModal.tsx`
- `useCreateWorkspace.ts`
- `workspace.store.ts`
- Query invalidation va current workspace update

### Acceptance criteria
- Tao workspace xong vao thang settings page cua workspace moi
- Refresh lai van vao duoc workspace pages binh thuong

---

## Nhiem vu B — Fix sidebar navigation theo current workspace

### Van de user gap
- `Cai dat` bam khong vao dung workspace settings
- `Du an` va flow lien quan dang sai/chan test

### Yeu cau
1. Sidebar phai dua vao `currentWorkspace`
2. Neu co `currentWorkspace`:
   - `Cai dat` -> `/workspaces/:id/settings`
   - `Thanh vien` -> `/workspaces/:id/members`
3. `Du an`:
   - Vi phase project chua xong, khong duoc dan den mot noi gay nham lan/chan test
   - Lua chon hop ly:
     - disable/tam an neu chua support
     - hoac route den mot placeholder an toan neu codebase da co pattern san
   - Chon cach **don gian, ro rang, khong gay ket**
4. Neu khong co `currentWorkspace` hoac workspace da invalid:
   - redirect ve `/workspaces`

### Can check
- `Sidebar.tsx`
- `WorkspaceSwitcher.tsx`
- Route guards / app routing
- Bat ky component nav nao su dung links co dinh

### Acceptance criteria
- Co current workspace thi bam `Cai dat` vao dung settings
- Bam `Thanh vien` vao dung members
- Khong co current workspace thi app tu ve `/workspaces`
- User khong bi mac ket o dashboard trong luong test workspace

---

## Nhiem vu C — Hoan thien current workspace flow

### Yeu cau
- Neu workspace vua tao -> set current workspace
- Neu workspace bi xoa -> clear current workspace va dua ve `/workspaces`
- Neu current workspace khong con ton tai trong list -> tu xu ly an toan
- Neu user co nhieu workspace -> switcher va nav van dung workspace hien tai

### Can uu tien
- Logic gan `currentWorkspace`
- Handling khi list refresh va item da bi xoa/khong ton tai
- Khong de stale state lam links sai

### Acceptance criteria
- Switch workspace xong -> nav dung workspace vua chon
- Delete workspace hien tai -> app khong crash, tu ve `/workspaces`

---

## Nhiem vu D — Workspace logo UX (upload + preset + crop)

### Muc tieu UX
Trong create/edit workspace, user co the:
1. Upload anh tu may
2. Chon anh preset co san trong app
3. Neu upload -> co buoc crop truoc khi xac nhan

### Huong lam duoc phep
- Co the them 1 khu vuc/chon logo trong:
  - `CreateWorkspaceModal.tsx`
  - `WorkspaceSettingsPage.tsx`
- Preset images la **assets local** trong project web, de sau nay user co the bo them anh
- So luong preset ban dau: **10-12 anh**
- Neu can, tao thu muc hop ly vi du:
  - `apps/web/src/assets/workspace-presets/`
  - hoac mot vi tri tuong duong de maintain
- Crop step:
  - Dung giai phap don gian, phu hop MVP
  - Khong duoc over-engineer
  - Neu can them package nho hop ly de crop, duoc phep neu thuc su can thiet

### Quan trong
- Truoc khi sua, phai doc code backend/frontend hien tai xem workspace model co field logo/avatar/icon hay chua
- Neu backend hien tai CHUA support save logo cho workspace, phai:
  - Bao lai ro trong report
  - Va trong scope nay uu tien lam UI/flow hop ly neu luu tam thoi duoc
- Nhung neu backend da co field support, thi wired end-to-end cho dung

### Can check truoc
- Prisma schema / workspace types / shared types neu lien quan
- Workspace create/update DTOs va service APIs
- Frontend hooks create/update workspace

### Acceptance criteria
- User thay duoc UI chon logo ro rang
- Co tab/2 cach chon: Upload va Preset
- Preset images hien duoc va chon duoc
- Upload co crop step
- Neu data model da support, luu duoc logo vao workspace create/update flow

---

## Nhiem vu E — Giu design don gian va de mo rong

Khi implement, uu tien huong sau:
- Preset images de o 1 cho ro rang, de user tu them sau nay
- Logic nav/current workspace tap trung, khong hardcode nhieu noi
- Khong lam architecture qua lon cho 1 bugfix
- Neu can helper nho de tao workspace links, co the them neu thuc su giup code ro hon

---

## Verify bat buoc
Sau khi xong:
1. Chay typecheck:
```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter api exec tsc --noEmit
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit
```

2. Neu co the, tu test logic nay:
- Tao workspace -> vao settings
- Tu settings -> vao members duoc
- Khong co current workspace -> ve `/workspaces`
- Switch workspace -> nav doi theo
- Neu delete workspace hien tai -> state an toan
- Logo picker hien preset + upload

---

## Cach bao lai T1 tab
Bao theo format:
1. Root cause tung bug chinh
2. Files changed
3. Cach fix navigation/current workspace
4. Cach fix logo UX
5. Neu backend/model hien tai co/khong support logo ra sao
6. tsc result
7. Chua commit
