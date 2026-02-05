---
name: debug
description: Analyze bugs and suggest fixes with step-by-step debugging approach. Use when encountering errors or unexpected behavior.
---

# Debug Helper

Analyze bugs systematically and suggest fixes with explanations.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Error message, file path, or description

## Instructions

### Step 1: Gather information
Ask if not provided:
1. "Error message chính xác là gì?"
2. "Bug xảy ra ở file/endpoint nào?"
3. "Có reproduce được không?"
4. "Gần đây có thay đổi gì?"

### Step 2: Analyze the problem

#### Runtime Errors:
1. Read error message and stack trace
2. Identify failing line/file
3. Trace back to root cause

#### Logic Bugs:
1. Understand expected vs actual
2. Trace data flow
3. Check edge cases

#### API Errors:
1. Check request/response format
2. Verify authentication
3. Check database queries

### Step 3: Report analysis

```
## 🐛 Bug Analysis

### Problem Summary
[1-2 sentence description]

### Root Cause
**What:** [What's wrong]
**Where:** [File:line]
**Why:** [Why it happens]

### Suggested Fix
```code
// The fixed code
```

### Explanation
[Why this fix works]
```

### Step 4: Interactive debugging
Ask:
- "Bạn có muốn tôi apply fix này không?"
- "Bạn hiểu tại sao bug xảy ra chưa?"

## Common Bug Patterns

### NestJS
- Missing `@Injectable()` decorator
- Circular dependency
- Wrong module imports
- Missing async/await

### Prisma
- Missing `await` on queries
- Wrong relation in `include`
- Type mismatch

### React
- Missing dependency in useEffect
- Wrong key in lists
- State update on unmounted component

### TypeScript
- Null/undefined not handled
- Type assertion hiding issues

## Debugging Strategies

1. **Binary Search**: Comment out half the code
2. **Console.log**: Strategic logging
3. **Read Error Carefully**: Error messages often point to solution
4. **Check Recent Changes**: `git diff`

## Example Usage

```
/debug "Cannot read property 'id' of undefined"
/debug apps/api/src/modules/auth/auth.service.ts
/debug "API returns 401 but user is logged in"
```

## After Completion

Remind user:
- "Nhớ update PROGRESS.md với debugging lesson!"
- "Có muốn tạo test case để prevent regression không?"
