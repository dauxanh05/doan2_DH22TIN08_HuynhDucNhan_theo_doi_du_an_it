# Debug Sessions

> Tracking debug phuc tap voi hypothesis testing.
> Moi session la 1 file rieng.
> Move sang `resolved/` khi fix xong.

## Cach dung

### Tao debug session

Tao file `NNN-ten-bug.md` voi format:

```markdown
# Ten bug / van de

- **Date:** YYYY-MM-DD
- **Branch:** branch hien tai
- **Severity:** LOW / MEDIUM / HIGH / CRITICAL

## Symptoms (Trieu chung)

- Mô tả hiện tượng thấy được
- Error messages, logs

## Hypothesis (Gia thuyet)

1. **Gia thuyet 1:** Mo ta
   - **Test:** Cach kiem tra
   - **Result:** Dung / Sai / Chua test

2. **Gia thuyet 2:** Mo ta
   - **Test:** Cach kiem tra
   - **Result:** Dung / Sai / Chua test

## Root Cause (Nguyen nhan goc)

Mo ta nguyen nhan that su sau khi tim duoc.

## Resolution (Cach fix)

- Da lam gi de fix
- Files thay doi
- Commit hash (neu co)

## Lessons Learned

- Rut ra bai hoc gi tu bug nay
```

### Resolve

Move file tu root sang `resolved/`:
```bash
mv 001-ten-bug.md resolved/001-ten-bug.md
```
