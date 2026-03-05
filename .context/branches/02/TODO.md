# TODO — Branch 02: Auth Frontend

## Phase 1: Foundation (tuần tự)
- [ ] Tạo `src/services/api.ts` — Axios instance + interceptor
- [ ] Tạo `src/stores/auth.store.ts` — Zustand auth store
- [ ] Tạo `src/components/ProtectedRoute.tsx`
- [ ] Cập nhật router — thêm auth routes

## Phase 2: Auth Pages (song song được)
- [ ] Tạo `AuthLayout.tsx` — layout chung auth pages
- [ ] Tạo `LoginPage.tsx` + `LoginForm.tsx` + `useLogin.ts`
- [ ] Tạo `RegisterPage.tsx` + `RegisterForm.tsx` + `useRegister.ts`
- [ ] Tạo `GoogleLoginButton.tsx`

## Phase 3: Email Features (song song được)
- [ ] Tạo `ForgotPasswordPage.tsx` + `useForgotPassword.ts`
- [ ] Tạo `ResetPasswordPage.tsx` + `useResetPassword.ts`
- [ ] Tạo `VerifyEmailPage.tsx`

## Phase 4: User Profile (tuần tự)
- [ ] Tạo `useCurrentUser.ts` — query hook
- [ ] Tạo Profile Settings page (nếu trong scope)

## Phase 5: Polish
- [ ] Test toàn bộ auth flow (register → verify → login → refresh → logout)
- [ ] Test Google OAuth flow
- [ ] Test error handling (wrong password, expired token, etc.)
- [ ] Responsive UI check

## Thứ tự thực hiện
```
Phase 1 (tuần tự) → Phase 2 (song song) → Phase 3 (song song) → Phase 4 → Phase 5
```

## Notes
- Access token lưu trong memory (biến JS), KHÔNG lưu localStorage
- Refresh token = HTTP-only cookie, browser tự xử lý
- Zustand persist: chỉ lưu user info, KHÔNG lưu token
- Frontend port: 5173 (Vite default)
- Backend port: 3000 (NestJS default)

---

*Created: 2026-03-05*
