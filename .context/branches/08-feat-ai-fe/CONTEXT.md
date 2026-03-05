# 08-feat-ai-fe - Context

> **Loai:** feat | **Phu thuoc:** 07-feat-ai-be

## Reference
- `context/03-project-task-ai.md` - AI Features UI flow
- `context/overview.md` - Frontend tech stack

## Scope

Frontend 4 AI components tich hop vao Task Detail Modal va Dashboard.

### Components

#### 1. AiTaskSplitter (`src/features/ai/AiTaskSplitter.tsx`)
- Nut "AI goi y chia task" trong Task Detail Modal
- Click -> loading -> hien danh sach suggestions
- User chon cac suggestions muon them -> tao subtasks

#### 2. AiProgressAnalyzer (`src/features/ai/AiProgressAnalyzer.tsx`)
- Nut "AI Phan tich" tren Dashboard hoac Project detail
- Click -> loading -> hien bao cao markdown
- Hien thi: overallHealth, risks, recommendations

#### 3. AiAutoAssign (`src/features/ai/AiAutoAssign.tsx`)
- Nut "AI goi y nguoi" trong Task Detail Modal (gan assignees)
- Click -> loading -> hien danh sach suggestions voi reason + workload
- User chon va assign

#### 4. AiCodeAssistant (`src/features/ai/AiCodeAssistant.tsx`)
- Tab "AI Assistant" trong Task Detail Modal
- Input prompt -> submit -> hien ket qua markdown
- Hien thi dang markdown rendered

## Rules
- Loading state khi goi AI (co the mat vai giay)
- Error handling khi AI fail
- Markdown rendering cho AI responses
- Tat ca AI features la optional (nut bam, khong bat buoc)
