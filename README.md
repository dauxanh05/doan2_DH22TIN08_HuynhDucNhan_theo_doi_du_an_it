# DevTeamOS - Hệ thống quản lý tiến độ dự án

## Giới thiệu

DevTeamOS là webapp quản lý tiến độ dự án, hỗ trợ các nhóm nhỏ (2-15 người) theo dõi công việc và cộng tác hiệu quả.

## Thông tin sinh viên

| Họ và tên | MSSV | Lớp |
|-----------|------|-----|
| Huỳnh Đức Nhân | 226610 | DH22TIN08 |

## Công nghệ sử dụng

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL
- **Khác**: Docker, pnpm workspaces

## Chức năng chính

- Đăng nhập / Đăng ký tài khoản
- Quản lý Workspace và Project
- Kanban board quản lý Task
- Phân quyền thành viên (Owner, Admin, Member, Viewer)

## Cài đặt và chạy

```bash
# Clone repo
git clone https://github.com/le-lee-05/doan2_DH22TIN08_HuynhDucNhan_quanlyproject.git

# Cài dependencies
pnpm install

# Chạy database
docker compose up -d

# Chạy ứng dụng
pnpm dev
```

## Cấu trúc thư mục

```
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend React
├── packages/
│   └── shared/       # Types dùng chung
└── docker-compose.yml
```
