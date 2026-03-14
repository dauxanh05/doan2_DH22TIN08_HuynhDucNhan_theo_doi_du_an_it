# 07-feat-ai-be - TODO

## AI Module Setup
- [x] Tao `ai.module.ts`
- [x] Tao `ai.controller.ts`
- [x] Tao `ai.service.ts`
- [x] Setup HTTP client goi manager.devteamos.me
- [x] DTOs cho 4 endpoints

## AI Endpoints
- [x] POST /ai/split-task - goi y chia task
- [x] POST /ai/analyze-progress - phan tich tien do
- [x] POST /ai/suggest-assignee - goi y assign
- [x] POST /ai/code-assist - code assistant

## Error Handling
- [x] Xu ly khi AI API timeout
- [x] Xu ly khi AI API tra ve loi
- [x] Rate limiting cho AI requests

## Test manual
- [x] Test split-task voi mo ta task lon
- [x] Test analyze-progress voi project co du lieu
- [x] Test suggest-assignee voi workspace co nhieu members
- [x] Test code-assist voi prompt ky thuat
- [x] Test error cases (API down, invalid input)
