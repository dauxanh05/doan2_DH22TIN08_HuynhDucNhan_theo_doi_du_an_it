# 07-feat-ai-be - Context

> **Loai:** feat | **Phu thuoc:** 06-feat-project-task-fe

## Reference
- `context/03-project-task-ai.md` - Phan AI Features (4 tinh nang)
- `context/overview.md` - AI Backend info

## Scope

Backend AI module voi 4 endpoints goi API manager.devteamos.me.

### AI Module (`src/modules/ai/`)

#### 1. AI Task Splitter
```
POST /ai/split-task
Body: { taskId, description, projectContext }
Response: { suggestions: [{ title, priority, estimatedTime }] }
```
- Nhan mo ta task lon -> goi y danh sach subtasks/checklist

#### 2. AI Progress Analyzer
```
POST /ai/analyze-progress
Body: { projectId }
Response: { analysis, risks, recommendations, overallHealth }
```
- Phan tich du lieu project -> bao cao tien do, risk areas

#### 3. AI Auto-Assign
```
POST /ai/suggest-assignee
Body: { taskId, projectId, workspaceId }
Response: { suggestions: [{ userId, reason, currentWorkload }] }
```
- Xem workload members -> goi y assign task cho ai

#### 4. AI Code Assistant
```
POST /ai/code-assist
Body: { prompt, projectContext }
Response: { instruction: "markdown content" }
```
- Mo ta task ky thuat -> sinh huong dan kien truc, code mau

### Architecture
- NestJS AI module goi HTTP request den `manager.devteamos.me`
- Xu ly response -> format -> tra ve frontend
- Model: Claude Sonnet 4.5 Thinking (hoac tuong tu)

## Rules
- AI_API_URL lay tu environment variable
- Xu ly error khi AI API khong phan hoi
- Rate limiting (tranh spam AI requests)
- Tat ca endpoints can auth (JWT guard)
