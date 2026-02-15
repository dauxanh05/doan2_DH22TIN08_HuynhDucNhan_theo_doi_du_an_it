# Phan 3: Project, Task & AI Features

> **Quyet dinh:** Day du features + 4 AI features tich hop trong MVP

---

## Tong quan

Day la phan core lon nhat cua du an, bao gom quan ly project, task va tich hop AI.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Task detail | **Modal** (popup overlay giong Trello) |
| Description | **Plain text** (khong rich text editor) |
| Attachments | **Local storage** (luu file tren server) |
| Subtasks | Giu nguyen (2 levels: task -> subtask) |
| Assignees | Giu nguyen (nhieu nguoi 1 task) |
| Priority | Giu nguyen (URGENT, HIGH, MEDIUM, LOW) |
| Due Date | Giu nguyen |
| Checklist | Giu nguyen |
| **AI Features** | **4 cai trong MVP** |
| **AI Backend** | **API manager.devteamos.me** |

---

## Project

### API Endpoints
```
POST   /workspaces/:workspaceId/projects  # Tao project
GET    /workspaces/:workspaceId/projects  # Danh sach projects
GET    /projects/:id                      # Chi tiet project
PATCH  /projects/:id                      # Cap nhat project
DELETE /projects/:id                      # Xoa project
GET    /projects/:id/stats                # Thong ke project (cho dashboard)
```

### Database
```prisma
model Project {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  description String?
  color       String   @default("#6366f1")
  icon        String?
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace @relation(...)
  tasks       Task[]
}

enum ProjectStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}
```

---

## Task

### API Endpoints
```
POST   /projects/:projectId/tasks         # Tao task
GET    /projects/:projectId/tasks         # Danh sach tasks (filter, sort)
GET    /tasks/:id                         # Chi tiet task
PATCH  /tasks/:id                         # Cap nhat task
DELETE /tasks/:id                         # Xoa task
PATCH  /tasks/reorder                     # Sap xep lai (drag-drop)

POST   /tasks/:id/subtasks                # Tao subtask
POST   /tasks/:id/assignees               # Assign user
DELETE /tasks/:id/assignees/:userId       # Unassign user

GET    /tasks/:id/checklists              # Lay checklist items
POST   /tasks/:id/checklists              # Them checklist item
PATCH  /checklists/:id                    # Cap nhat item (toggle, rename)
DELETE /checklists/:id                    # Xoa item

POST   /tasks/:id/attachments             # Upload file
DELETE /attachments/:id                   # Xoa file
```

### Database
```prisma
model Task {
  id          String    @id @default(cuid())
  projectId   String
  parentId    String?   // null = task chinh, co value = subtask
  title       String
  description String?   // Plain text
  status      TaskStatus @default(TODO)
  priority    Priority  @default(MEDIUM)
  position    Int       @default(0)
  dueDate     DateTime?
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  project     Project   @relation(...)
  parent      Task?     @relation("Subtasks", ...)
  subtasks    Task[]    @relation("Subtasks")
  assignees   TaskAssignee[]
  comments    Comment[]
  checklists  ChecklistItem[]
  attachments Attachment[]
}

model TaskAssignee {
  taskId    String
  userId    String
  assignedAt DateTime @default(now())
  @@id([taskId, userId])
}

model ChecklistItem {
  id        String   @id @default(cuid())
  taskId    String
  title     String
  completed Boolean  @default(false)
  position  Int      @default(0)
}

model Attachment {
  id        String   @id @default(cuid())
  taskId    String
  filename  String
  path      String   // Local file path
  mimetype  String
  size      Int
  createdAt DateTime @default(now())
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  URGENT
  HIGH
  MEDIUM
  LOW
}
```

---

## AI Features

### AI Backend
- **Provider:** API tai `manager.devteamos.me`
- **Model:** Claude Sonnet 4.5 Thinking (hoac tuong tu)
- **Communication:** NestJS AI module goi API -> xu ly response -> tra ve frontend

### 4 Tinh nang AI

#### 1. Goi y chia task (AI Task Splitter)
```
Input:  Mo ta task lon (vi du: "Xay dung he thong authentication")
Output: Danh sach subtasks/checklist items goi y

API:    POST /ai/split-task
Body:   { taskId, description, projectContext }
Response: { suggestions: [{ title, priority, estimatedTime }] }
```

**Flow:**
- User tao task moi voi mo ta
- Click nut "AI goi y chia task"
- AI phan tich va goi y danh sach subtasks
- User review, chon cac goi y muon them -> tao subtasks

#### 2. Phan tich tien do (AI Progress Analyzer)
```
Input:  Du lieu project (tasks, statuses, due dates, timeline)
Output: Bao cao phan tich: dang nhanh/cham, risk areas, goi y

API:    POST /ai/analyze-progress
Body:   { projectId }
Response: { analysis, risks, recommendations, overallHealth }
```

**Flow:**
- Tren Dashboard hoac Project detail co nut "AI Phan tich"
- AI xem tong the du lieu project
- Tra ve bao cao: tien do chung, task nao bi delay, goi y uu tien

#### 3. Auto-assign task (AI Auto-Assign)
```
Input:  Task info + danh sach members + workload hien tai
Output: Goi y assign task cho ai

API:    POST /ai/suggest-assignee
Body:   { taskId, projectId, workspaceId }
Response: { suggestions: [{ userId, reason, currentWorkload }] }
```

**Flow:**
- Khi tao task moi, co nut "AI goi y nguoi"
- AI xem workload cac member, skill (dua tren task da lam)
- Goi y 1-3 nguoi phu hop, kem ly do
- User chon va assign

#### 4. AI Code Assistant (AI Leader)
```
Input:  Mo ta task ky thuat + project context
Output: Huong dan kien truc, code mau, cac buoc thuc hien

API:    POST /ai/code-assist
Body:   { prompt, projectContext }
Response: { instruction: "markdown content" }
```

**Flow:**
- Trong task detail, co tab "AI Assistant"
- User mo ta muon lam gi
- AI doc PROJECT_CONTEXT + schema -> sinh ra huong dan chi tiet
- Hien thi dang markdown trong task

---

## Frontend Pages

| Page | Route | Mo ta |
|------|-------|-------|
| Project List | `/workspaces/:wId/projects` | Danh sach projects + tao moi |
| Project Detail | `/projects/:id` | Chi tiet project (chua Kanban) |
| Task Detail | Modal overlay | Mo khi click task tren Kanban |

### Task Detail Modal - Layout
```
+------------------------------------------+
| [x] Task Title (editable)                |
|------------------------------------------|
| Status: [TODO ▼]  Priority: [MEDIUM ▼]  |
| Due: [Pick date]  Assignees: [+Add]     |
|------------------------------------------|
| Description (plain text area)            |
|------------------------------------------|
| Subtasks                                 |
| [ ] Subtask 1                            |
| [ ] Subtask 2                            |
| [+ Add subtask]                          |
|------------------------------------------|
| Checklist                                |
| [x] Item 1                              |
| [ ] Item 2                              |
| [+ Add item]                            |
|------------------------------------------|
| Attachments                             |
| [file1.pdf] [file2.png]                 |
| [+ Upload]                              |
|------------------------------------------|
| AI Assistant  |  Comments                |
| [Tab content] |  [Tab content]           |
|------------------------------------------|
| [AI Goi y chia task] [AI Goi y nguoi]   |
+------------------------------------------+
```

---

## Files can tao/cap nhat

### Backend
- `src/modules/projects/projects.module.ts`
- `src/modules/projects/projects.controller.ts`
- `src/modules/projects/projects.service.ts`
- `src/modules/projects/dto/*.ts`
- `src/modules/tasks/tasks.module.ts`
- `src/modules/tasks/tasks.controller.ts`
- `src/modules/tasks/tasks.service.ts`
- `src/modules/tasks/dto/*.ts`
- `src/modules/files/files.module.ts`
- `src/modules/files/files.controller.ts`
- `src/modules/files/files.service.ts`
- **`src/modules/ai/ai.module.ts`** (moi)
- **`src/modules/ai/ai.controller.ts`** (moi)
- **`src/modules/ai/ai.service.ts`** (moi)

### Frontend
- `src/features/projects/ProjectListPage.tsx`
- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/tasks/TaskDetailModal.tsx`
- `src/features/tasks/SubtaskList.tsx`
- `src/features/tasks/ChecklistSection.tsx`
- `src/features/tasks/AttachmentSection.tsx`
- **`src/features/ai/AiTaskSplitter.tsx`** (moi)
- **`src/features/ai/AiProgressAnalyzer.tsx`** (moi)
- **`src/features/ai/AiAutoAssign.tsx`** (moi)
- **`src/features/ai/AiCodeAssistant.tsx`** (moi)

---

*Last updated: 2026-02-15*
