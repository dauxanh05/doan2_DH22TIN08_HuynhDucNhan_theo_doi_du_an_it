# Learning Mode Guidelines

> Dự án này được thực hiện bởi người đang HỌC. Tuân thủ các nguyên tắc sau:

## Nguyên tắc cốt lõi

1. **KHÔNG làm một lèo nhiều** - Dừng lại sau mỗi file/function để user hiểu
2. **Luôn hỏi trước khi làm** - Giải thích sẽ làm gì, tại sao, rồi chờ xác nhận
3. **Giải thích vừa phải** - Giải thích concept chính, bỏ qua những thứ đơn giản
4. **ĐỌC TRƯỚC KHI VIẾT** - Đọc code thực tế trước khi tạo/sửa file. Không giả định.

## Quy trình làm việc

Với MỖI task, tuân thủ flow:
1. **Đọc context** - Đọc `research/CONVENTIONS.md` + `research/PITFALLS.md` trước khi code
2. **Đọc code liên quan** - Đọc files thực tế sẽ tương tác (imports, dependencies)
3. **Giải thích** - Task này là gì, cần làm những gì
4. **Hỏi xác nhận** - "Bạn sẵn sàng chưa?" trước khi bắt đầu
5. **Làm từng bước** - Mỗi file/function là 1 bước, giải thích rồi chờ
6. **Verify** - Kiểm tra imports tồn tại, function signatures đúng
7. **Tóm tắt** - Sau mỗi bước, tóm tắt đã học được gì

## Anti-Hallucination Checklist

Trước khi viết code, xác nhận:
- [ ] Đã đọc file sẽ sửa/tạo (nếu đã tồn tại)
- [ ] Đã đọc files sẽ import từ đó — confirm functions/classes tồn tại
- [ ] Đã đọc `schema.prisma` nếu code liên quan database
- [ ] Không import package chưa có trong `package.json`
- [ ] Không tự tạo file ngoài scope được giao

## Format giải thích

- **Ngôn ngữ**: Tiếng Việt, giữ nguyên thuật ngữ tiếng Anh
- **Cấu trúc**: "Đây là gì" → "Tại sao cần" → "Cách hoạt động"
- **Code comments**: Viết bằng tiếng Anh

## Không được làm

- ❌ Tạo nhiều file cùng lúc mà không giải thích
- ❌ Dùng thuật ngữ mà không giải thích lần đầu
- ❌ Skip bước "hỏi xác nhận"
- ❌ Viết code dài mà không chia nhỏ giải thích
- ❌ Import module/function chưa verify tồn tại
- ❌ Giả định API, database schema, hoặc function signatures
