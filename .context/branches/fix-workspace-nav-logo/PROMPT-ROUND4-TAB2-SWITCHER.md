# Tab Worker 2 — Fix Current Workspace / Workspace Switcher Not Showing Correctly Right After Login

## Vai trò
Bạn là tab worker chuyên fix bug frontend về workspace state.
Mục tiêu của tab này: fix bug **mới đăng nhập xong thì bấm workspace không hiện đúng / current workspace chưa sẵn sàng**, nhưng sau khi bấm vào flow khác như "Tạo workspace mới" thì danh sách/state mới hiện đúng.

## Bối cảnh bug user report
User mô tả gần đúng như sau:
- Sau khi mới đăng nhập vào app
- Bấm chọn workspace đã có sẵn
- App có chuyển trang, nhưng trạng thái workspace/current workspace không hiển thị đúng ngay
- Có cảm giác "chưa hiện gì"
- Nhưng nếu bấm vào **Tạo workspace mới** hoặc đi qua flow khác rồi quay về dashboard thì những workspace đã tạo lại hiện ra bình thường

=> Dấu hiệu mạnh cho thấy bug nằm ở:
- hydration / timing của Zustand persist
- sync giữa React Query `useWorkspaces()` và Zustand `currentWorkspace`
- logic điều hướng sau select workspace
- component hiển thị đang phụ thuộc `currentWorkspace` nhưng store chưa được populate đúng lúc đầu session

---

## Rules BẮT BUỘC
1. Đọc code thật trước khi sửa, không tự bịa
2. Giữ đúng patterns project: React + TanStack Query + Zustand persist
3. Không commit
4. Sau khi sửa xong phải chạy verify
5. Báo lại đúng format ở cuối file này

---

## Đọc trước khi code
### Context files
1. `.context/STATE.md`
2. `.context/research/CONVENTIONS.md`
3. `.context/research/PITFALLS.md`
4. `.context/branches/fix-workspace-nav-logo/PROMPT.md`
5. `.context/branches/fix-workspace-nav-logo/PROMPT-ROUND3.md`

### Files code bắt buộc đọc
1. `apps/web/src/hooks/useWorkspaces.ts`
2. `apps/web/src/stores/workspace.store.ts`
3. `apps/web/src/components/WorkspaceSwitcher.tsx`
4. `apps/web/src/features/workspaces/WorkspaceListPage.tsx`
5. `apps/web/src/layouts/DashboardLayout.tsx`
6. `apps/web/src/components/Sidebar.tsx`
7. `apps/web/src/App.tsx`
8. Nếu cần thêm auth hydration context, đọc tiếp:
   - `apps/web/src/stores/auth.store.ts`
   - `apps/web/src/services/api.ts`

---

## Mục tiêu fix
Fix để sau flow này hoạt động đúng:
1. User login thành công
2. Vào app với session mới
3. Danh sách workspaces hiện đúng
4. Bấm chọn 1 workspace từ workspace list hoặc switcher
5. `currentWorkspace` được set đúng ngay
6. Dashboard / sidebar / switcher hiển thị đúng ngay, không cần đi qua flow tạo workspace hay thao tác phụ khác

---

## Giả thuyết root cause cần kiểm tra
Bạn phải kiểm tra kỹ từng giả thuyết, không được assume.

### Hypothesis A — `useWorkspaces()` setWorkspaces nhưng không khởi tạo `currentWorkspace` khi session mới
- Hiện tại hook có vẻ chỉ:
  - set danh sách `workspaces`
  - clear `currentWorkspace` nếu stale
- Nhưng nếu `currentWorkspace` là null lúc mới login thì có thể không có nhánh auto-pick workspace hợp lệ nào
- Kết quả: UI nào phụ thuộc `currentWorkspace` sẽ rỗng dù list đã có data

### Hypothesis B — Zustand persist hydration timing
- `currentWorkspace` được persist riêng
- Khi app vừa load sau login, component render trước khi hydration/query hoàn chỉnh
- Một số page/layout có thể đọc state quá sớm rồi redirect/render fallback sai

### Hypothesis C — `WorkspaceListPage` setCurrentWorkspace xong navigate('/') nhưng dashboard/layout đọc source khác hoặc bị overwrite
- `handleSelect()` hiện setCurrentWorkspace rồi navigate('/'), nhưng có thể nơi render dashboard đang dựa vào query khác / route logic khác
- Cũng có thể `useWorkspaces()` refetch sau đó ghi đè state ngoài ý muốn

### Hypothesis D — `WorkspaceSwitcher` chỉ switch id trong store list nhưng store list chưa đồng bộ lúc đầu
- `switchWorkspace(workspaceId)` dùng `workspaces` từ Zustand store
- Nếu list trong store chưa sẵn khi user thao tác nhanh, currentWorkspace không được set

### Hypothesis E — dashboard/sidebar phụ thuộc currentWorkspace nhưng thiếu auto-recovery
- Khi có `workspaces[]` nhưng `currentWorkspace` null, app nên có rule rõ ràng:
  - auto-pick workspace đầu tiên?
  - hoặc điều hướng `/workspaces`?
- Hiện tại behavior có thể đang nửa vời nên tạo bug UX

---

## Những gì cần làm
### 1. Xác định luồng state thực tế
Trong report phải nêu rõ:
- Sau login, component/hook nào fetch workspaces đầu tiên?
- Ai populate Zustand `workspaces`?
- Khi `currentWorkspace` null mà `workspaces.length > 0`, app đang làm gì?
- Vì sao bấm "Tạo workspace mới" rồi quay lại thì state lại hiện đúng?

### 2. Chọn fix nhỏ nhất nhưng đúng bản chất
Có thể fix nằm ở một hoặc nhiều chỗ sau (chỉ làm sau khi xác minh):
- `useWorkspaces.ts`
  - ngoài việc clear stale workspace, có thể cần set current workspace hợp lệ khi:
    - currentWorkspace null
    - danh sách workspaces có data
- `WorkspaceListPage.tsx`
  - bảo đảm `handleSelect()` set đúng object mới nhất từ query data
- `WorkspaceSwitcher.tsx`
  - không phụ thuộc mù quáng vào store list nếu timing chưa sẵn
- `DashboardLayout.tsx` / `Sidebar.tsx`
  - thêm logic fallback hợp lý nếu có workspace list nhưng current workspace chưa được chọn

### 3. Không thêm behavior mâu thuẫn với user expectation
Ưu tiên behavior rõ ràng:
- nếu có workspace và chưa có current workspace -> app nên tự recover nhất quán
- không để trạng thái “list có mà current workspace rỗng” kéo dài vô thời hạn

### 4. Giữ scope đúng bug hiện tại
Không sửa tràn lan unrelated features.

---

## Acceptance criteria
Bug chỉ được coi là fix khi đạt đủ:
- Mới login xong vẫn thấy flow workspace ổn định
- Bấm 1 workspace có sẵn -> current workspace hiện đúng ngay
- Không cần bấm “Tạo workspace mới” để kích hoạt state
- Dashboard / sidebar / switcher không còn tình trạng rỗng sai lúc đầu
- Reload lại app vẫn có behavior nhất quán
- TypeScript pass

---

## Verify bắt buộc
Chạy:
```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit
```

Nếu bạn có chạy manual reproduction thì ghi rõ:
- before fix: reproduce được thế nào
- after fix: flow nào đã hết lỗi

---

## Báo lại cho T1 theo format
1. Root cause chính xác
2. Files changed
3. Luồng state trước fix bị hỏng ở đâu
4. Cách fix hydration / currentWorkspace / switcher / fallback logic
5. Kết quả verify
6. Chưa commit
