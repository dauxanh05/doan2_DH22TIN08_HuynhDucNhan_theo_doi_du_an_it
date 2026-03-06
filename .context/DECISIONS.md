# Decisions Log: DevTeamOS

> **Append-only** — Chi them moi, khong sua/xoa entries cu.
> Moi entry ghi lai: tai sao chon X thay vi Y.

---

| Date | Decision | Rationale | Outcome |
|------|----------|-----------|---------|
| 2026-01-21 | pnpm workspaces thay Turborepo | Du dung cho 2 apps, giam complexity | Dang dung tot |
| 2026-01-21 | Fixed TaskStatus thay Custom Workflow | Don gian cho MVP, users khong can customize | 3 cot TODO/IN_PROGRESS/DONE |
| 2026-01-21 | 2 levels subtasks max | Du cho use cases pho bien, de implement | Task -> Subtask only |
| 2026-01-21 | Tieng Viet only cho MVP | Target thi truong VN, them EN sau (v2) | i18n deferred |
| 2026-01-21 | Google OAuth only (khong GitHub) | Pho bien nhat, GitHub them sau | passport-google-oauth20 |
| 2026-01-21 | Local file storage | Don gian, migrate S3 sau khi can | UPLOAD_DIR=./uploads |
| 2026-01-21 | Nodemailer thay BullMQ | It emails, khong can queue phuc tap | Gui sync |
| 2026-01-21 | Socket.io cho WebSocket | De dung hon raw WebSocket, ecosystem tot | @nestjs/websockets + socket.io |
| 2026-02-15 | Refresh token: DB + Cookie | An toan nhat, co the revoke token. Thay vi luu localStorage | HTTP-only cookie 7 ngay |
| 2026-02-15 | Task detail: Modal overlay | Nhanh, khong roi trang (giong Trello). Thay vi separate page | Modal popup |
| 2026-02-15 | Description: Plain text | Don gian, rich text editor them sau. Thay vi Markdown/WYSIWYG | Plain textarea |
| 2026-02-15 | 4 AI tich hop vao MVP | Nang cap gia tri san pham. Dung API manager.devteamos.me | AI module backend + 4 FE components |
| 2026-02-15 | AI Backend dung API manager.devteamos.me | Proxy qua NestJS, khong expose API key ra frontend | POST /ai/* endpoints |
| 2026-02-15 | Kanban 3 cot co dinh | Don gian, map truc tiep voi TaskStatus enum | TODO, IN_PROGRESS, DONE |
| 2026-02-15 | Filter client-side | So luong task/project khong lon, khong can server-side filter | AND logic, debounce 300ms |
| 2026-02-15 | Recharts cho dashboard | Nhe, de dung, du cho pie + bar charts | recharts package |
| 2026-02-27 | Cau truc lai context -> .context/ | CLAUDE.md 196 dong qua nang, context rot. Lay y tuong GSD | 9 files tach rieng |
| 2026-02-27 | Ap dung GSD concepts, khong cai GSD tool | GSD qua complex cho solo dev dang hoc. Lay STATE.md, REQ IDs, DECISIONS | Custom build |
| 2026-02-27 | Dot prefix .context/ | Hidden folder, khong lan voi source code. Tuong thich GSD .planning/ | ls -a de thay |
| 2026-02-27 | STATE.md < 100 dong | GSD constraint: digest, khong phai archive. Doc nhanh biet dang o dau | Read first, write after |
| 2026-02-27 | Requirement IDs (AUTH-01, WS-02...) | Tracking tu requirement -> phase -> branch -> code -> verify | 78 v1 + 10 v2 requirements |
| 2026-03-06 | Google OAuth callback dung one-time code + CacheModule | Tranh dua access token vao URL, giam ro ri token qua logs/history/referrer | `GET /auth/google/callback?code=...` + `POST /auth/google/exchange` |
| 2026-03-06 | Strict throttling cho auth endpoints | Giam brute force va abuse cho login/register/forgot-password ma van giu UX chap nhan duoc | Global 30/min + route-specific limits |
| 2026-03-06 | Password reset dung `resetNonce` single-use | JWT reset token expiry alone khong du, can chan token reuse sau khi reset thanh cong | Token reset bi vo hieu hoa sau 1 lan dung |

---

*Last updated: 2026-03-06*
