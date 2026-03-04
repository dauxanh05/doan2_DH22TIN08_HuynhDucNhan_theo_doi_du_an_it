---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Anti-Hallucination Rules

> CAC QUY TAC NAY LA BAT BUOC. Vi pham = code sai, bug kho tim.

## Rule 1: DOC CODE TRUOC KHI VIET

- Truoc khi sua/tao file: DOC file do (neu da ton tai) va cac file lien quan
- Truoc khi import module/function: DOC file nguon de confirm no TON TAI
- Truoc khi goi Prisma query: DOC `apps/api/prisma/schema.prisma` de confirm model/field
- KHONG viet code dua tren "tri nho" — LUON verify bang cach doc

## Rule 2: KHONG TU BIA

- KHONG import module/package chua co trong `package.json`
- KHONG goi function chua ton tai trong codebase
- KHONG gia dinh database schema — doc `schema.prisma`
- KHONG gia dinh API endpoint — doc controller tuong ung
- KHONG gia dinh component props — doc component file
- KHONG gia dinh env variables — doc `.context/COMMANDS.md`

## Rule 3: FOLLOW CONTRACTS

- Khi co file `CONTRACTS.md` trong `.context/branches/XX/`: follow chinh xac
- Neu CONTRACTS.md noi dung interface X → dung dung interface X
- Neu CONTRACTS.md khong liet ke function Y → KHONG tu tao function Y
- Neu can them gi ngoai contracts → HOI user truoc

## Rule 4: SCOPE BOUNDARIES

- CHI lam trong scope duoc giao (PROMPT.md hoac user instruction)
- KHONG sua file ngoai scope
- KHONG tao file moi ngoai danh sach da dinh
- KHONG refactor code khong lien quan
- KHONG them features khong duoc yeu cau

## Rule 5: KHI KHONG CHAC

- KHONG doan — HOI user
- Neu 2 cach deu hop ly → trinh bay ca 2, de user chon
- Neu thay code cu co ve sai → bao user, KHONG tu sua (tru khi trong scope)

## Checklist truoc khi submit code

- [ ] Da doc code thuc te cua cac file lien quan
- [ ] Tat ca imports deu ton tai trong codebase
- [ ] Tat ca function calls match signature thuc te
- [ ] Database queries match schema.prisma
- [ ] Khong co file nao ngoai scope
- [ ] Khong co feature nao ngoai yeu cau
