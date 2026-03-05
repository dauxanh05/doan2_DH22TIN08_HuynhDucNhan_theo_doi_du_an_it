# Review — TEMPLATE

> **AI review ket qua code tu T2/T3.**
> T1 hoac chat review rieng ghi ket qua vao day.
> User doc file nay de quyet dinh fix hay accept.

---

## Review Info

- **Branch:** `XX-type-ten`
- **Reviewed by:** AI (Claude Code CLI)
- **Date:** YYYY-MM-DD
- **Files reviewed:** (so luong)

---

## Checklist

### Code Quality

- [ ] Follow naming conventions (research/CONVENTIONS.md)
- [ ] Follow existing patterns (codebase/CONVENTIONS.md)
- [ ] Error handling dung (NestJS exceptions)
- [ ] Khong hardcode values
- [ ] Functions ngan gon, ten mo ta ro
- [ ] Khong mix concerns (controller vs service)

### Security (neu lien quan)

- [ ] Khong expose sensitive data (password, tokens)
- [ ] Input validation day du (DTOs + class-validator)
- [ ] Auth guard bao ve routes can thiet
- [ ] Khong co SQL injection / path traversal risks

### Anti-Hallucination

- [ ] Tat ca imports deu ton tai trong codebase
- [ ] Khong goi function khong ton tai
- [ ] Database queries match schema.prisma
- [ ] DTOs match API spec trong specs/

### Maintainability

- [ ] Code de doc, de hieu
- [ ] Khong over-engineer (khong thua abstraction)
- [ ] Consistent voi code hien tai
- [ ] Comments huu ich (khong comment obvious code)

---

## Issues Found

> Liet ke van de phat hien. Priority: HIGH / MEDIUM / LOW

<!--
### Issue #1: [Ten van de]
- **File:** `path/to/file.ts:line`
- **Priority:** HIGH / MEDIUM / LOW
- **Mo ta:** Van de gi
- **Goi y fix:** Cach fix
- **Status:** OPEN / FIXED
-->

(Chua co)

---

## Summary

- **Total issues:** 0
- **HIGH:** 0
- **MEDIUM:** 0
- **LOW:** 0
- **Verdict:** PASS / NEEDS_FIX

---

*Last reviewed: YYYY-MM-DD*
