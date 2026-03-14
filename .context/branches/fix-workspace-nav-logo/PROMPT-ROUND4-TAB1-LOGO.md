# Tab Worker 1 — Fix Logo Upload Not Persisting / Not Displaying After Save

## Vai trò
Bạn là tab worker chuyên fix bug frontend cho workspace logo.
Mục tiêu của tab này: fix dứt điểm bug **chọn ảnh + crop thì preview hiện, nhưng bấm Lưu logo xong ảnh không hiển thị thật**.

## Bối cảnh bug user report
Triệu chứng user mô tả:
- Chọn ảnh từ máy -> crop -> preview hiện bình thường
- Bấm **Lưu logo**
- Có **toast success** và request API **200 OK**
- Nhưng logo thật không hiện sau khi save
- User phải làm hành động khác hoặc reload/flow khác mới có thể thấy state đúng hoặc vẫn không thấy

=> Nghĩa là bug khả năng cao nằm ở **frontend state sync / render source / store sync**, không phải upload request bị fail.

---

## Rules BẮT BUỘC
1. Đọc code thật trước khi sửa, không tự bịa
2. Giữ đúng patterns project: React + TanStack Query + Zustand
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
1. `apps/web/src/components/LogoPicker.tsx`
2. `apps/web/src/hooks/useUploadWorkspaceLogo.ts`
3. `apps/web/src/hooks/useUpdateWorkspace.ts`
4. `apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx`
5. `apps/web/src/stores/workspace.store.ts`
6. Nếu cần thêm context hiển thị logo, đọc tiếp:
   - `apps/web/src/components/WorkspaceSwitcher.tsx`
   - `apps/web/src/components/Sidebar.tsx`
   - `apps/web/src/hooks/useWorkspace.ts`
   - `apps/web/src/hooks/useWorkspaces.ts`

---

## Mục tiêu fix
Fix để sau flow này hoạt động đúng:
1. Mở Workspace Settings
2. Upload PNG/JPG/WebP
3. Crop
4. Preview hiện
5. Bấm **Lưu logo**
6. Request API thành công
7. Logo phải hiển thị đúng ngay sau save ở:
   - chính `LogoPicker`
   - vùng đang dùng `currentWorkspace.logo` nếu có
   - sau refetch vẫn đúng, không bị revert về null/logo cũ

---

## Giả thuyết root cause cần kiểm tra
Bạn phải kiểm tra kỹ từng giả thuyết dưới đây, không được assume bừa:

### Hypothesis A — `displayLogo` bị overwrite bởi effect sync từ prop cũ
- `LogoPicker.tsx` có `displayLogo` local state
- Có thể `onSuccess` set logo mới xong, nhưng một `useEffect(() => setDisplayLogo(currentLogo), [currentLogo])` chạy lại với `currentLogo` cũ/null
- Kết quả: UI bị revert mất ảnh

### Hypothesis B — response `data.logo` là relative path nhưng render source không resolve đúng
- API có thể trả `/uploads/workspace-logos/xxx.png`
- Cần check frontend đang render relative path trực tiếp hay cần full origin
- Nếu frontend ở `5173` và API ở `3001`, relative `/uploads/...` sẽ hit frontend origin thay vì backend origin nếu không có reverse proxy/static handling đúng
- Cần xác minh kỹ bằng code hiện tại trước khi sửa

### Hypothesis C — Zustand `currentWorkspace` được sync nhưng query data / page data không sync đúng
- `useUploadWorkspaceLogo.ts` có sync store nhưng `WorkspaceSettingsPage.tsx` hoặc `useWorkspace()` có thể trả object cũ
- Component hiển thị ảnh có thể lấy từ source khác với source vừa được update

### Hypothesis D — upload success nhưng query invalidation/refetch chưa đủ hoặc sai timing
- invalidate có thể chưa đủ nếu component đang dùng cache cũ hoặc stale reference
- Có thể cần `await invalidateQueries` / `refetchQueries` / optimistic update đúng chỗ

### Hypothesis E — preview URL và saved URL chuyển đổi sai
- Preview là base64 / object URL, save xong đổi sang server path nhưng path đó không load được
- User thấy preview trước save nhưng mất ảnh sau save vì source mới invalid

---

## Những gì cần làm
### 1. Xác định source render logo hiện tại
Làm rõ trong report:
- `LogoPicker` đang render từ gì?
- `WorkspaceSettingsPage` đang truyền `currentLogo` từ đâu?
- `WorkspaceSwitcher` / sidebar render logo từ đâu?
- Sau save, state nào thay đổi trước? query hay store?

### 2. Fix đúng chỗ, không patch tạm
Ưu tiên approach sạch:
- Nếu vấn đề là relative path -> chuẩn hóa helper source URL hoặc render URL đúng backend origin
- Nếu vấn đề là effect overwrite -> sửa logic sync để không đè lên optimistic/saved state sai thời điểm
- Nếu vấn đề là invalidate timing -> sửa mutation hook cho chắc chắn
- Nếu cần, dùng queryClient.setQueryData để đồng bộ ngay cache của `['workspace', workspaceId]` và/hoặc `['workspaces']`

### 3. Không làm quá scope
- Không refactor rộng cả module nếu không cần
- Không đổi API backend nếu frontend fix là đủ
- Chỉ sửa backend nếu xác minh chắc backend đang trả path sai

---

## Acceptance criteria
Bug chỉ được coi là fix khi đạt đủ:
- Upload ảnh -> crop -> save -> logo hiện ngay
- Không cần refresh trang
- Không cần làm thêm hành động khác để logo xuất hiện
- Vào lại workspace settings vẫn thấy logo đúng
- Workspace switcher / nơi dùng `currentWorkspace.logo` không bị mất ảnh vì stale state
- TypeScript pass

---

## Verify bắt buộc
Chạy:
```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit
```

Nếu bạn có chạy app manual check thì ghi rõ kết quả quan sát.

---

## Báo lại cho T1 theo format
1. Root cause chính xác
2. Files changed
3. Nếu có vấn đề relative URL/path thì giải thích rõ
4. Cách fix state sync / cache sync / render source
5. Kết quả verify
6. Chưa commit
