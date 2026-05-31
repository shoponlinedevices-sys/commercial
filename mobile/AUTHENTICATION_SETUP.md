# Hướng dẫn Setup Authentication với MySQL

## Tổng quan hệ thống
Hệ thống authentication mới sử dụng:
- **Backend**: NestJS kết nối MySQL qua TypeORM
- **Frontend**: React Native + Expo
- **Database**: MySQL (commercial) - Bảng tbl_account

## Bước 1: Chuẩn bị Database

### Thông tin kết nối:
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `06081990`
- Database: `commercial`

### Tạo bảng tbl_account:
```sql
USE commercial;

CREATE TABLE IF NOT EXISTS tbl_account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Thêm tài khoản test (tuỳ chọn):
```sql
INSERT INTO tbl_account (username, password) VALUES ('admin', '123456');
INSERT INTO tbl_account (username, password) VALUES ('user', 'password');
```

Hoặc chạy script SQL:
```bash
mysql -u root -p06081990 commercial < setup.sql
```

## Bước 2: Cài đặt Backend

### Đã cài đặt packages:
- `mysql2` - Driver MySQL
- `typeorm` - ORM

### Cấu trúc thư mục backend:
```
src/
  ├── adapters/
  │   └── auth/
  │       ├── auth.controller.ts (API endpoints)
  │       └── auth.module.ts
  ├── application/
  │   └── auth/
  │       └── auth.service.ts (Business logic)
  └── infrastructure/
      └── database/
          ├── database.module.ts (MySQL connection)
          ├── entities/
          │   └── account.entity.ts
          └── repositories/
              └── account.repository.ts
```

### Chạy backend:
```bash
cd mobile
npm run start:dev
```

Backend sẽ chạy trên `http://localhost:3000`

## Bước 3: Cài đặt Frontend

### Frontend đã được cập nhật:
- [LoginScreen.tsx](mobile/frontend/src/screens/LoginScreen.tsx) - Giao diện đăng nhập
- [productApi.ts](mobile/frontend/src/api/productApi.ts) - API client

### Chạy frontend:
```bash
cd mobile/frontend
npm start
```

Sau đó chọn:
- Android: `a`
- iOS: `i`
- Web: `w`

## Bước 4: Kiểm tra kết nối

### Kiểm tra API endpoint:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"123456"}'
```

Phản hồi mong đợi:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin"
}
```

## Flow đăng nhập

1. **Frontend**: Người dùng nhập username + password
2. **Frontend**: Gửi POST request đến `/auth/login`
3. **Backend Controller**: Nhận request
4. **Backend Service**: Xác thực thông tin
5. **Backend Repository**: Tìm kiếm trong `tbl_account`
6. **Database**: Trả về kết quả
7. **Backend**: Trả về user info hoặc lỗi
8. **Frontend**: Xử lý kết quả và điều hướng

## API Endpoints

### POST /auth/login
Đăng nhập người dùng

**Request body:**
```json
{
  "email": "admin",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin"
}
```

**Error (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Tài khoản không tồn tại"
}
```

## Khắc phục sự cố

### Lỗi: "connect ECONNREFUSED 127.0.0.1:3306"
- Đảm bảo MySQL server đang chạy
- Kiểm tra port 3306 có mở không

### Lỗi: "Unknown database 'commercial'"
- Tạo database `commercial` nếu chưa có
- Chạy script SQL setup

### Lỗi: "Access denied for user 'root'@'localhost'"
- Kiểm tra password MySQL (phải là `06081990`)
- Kiểm tra username (phải là `root`)

### Frontend không kết nối được backend
- Kiểm tra IP trong [url.ts](mobile/frontend/src/api/util/url.ts)
- Đảm bảo backend chạy trên `http://192.168.1.6:3000`

## Bảo mật

⚠️ **Lưu ý**: Hệ thống hiện tại lưu password dạng plain text, không an toàn cho production

### Cải thiện bảo mật (khuyến nghị):
1. Sử dụng bcrypt để hash password
2. Implement JWT tokens
3. Thêm CORS configuration
4. Use HTTPS

### Ví dụ hash password với bcrypt:
```bash
npm install bcrypt
```

Cập nhật auth.service.ts:
```typescript
import * as bcrypt from 'bcrypt';

// Hash password trước khi lưu
const hashedPassword = await bcrypt.hash(password, 10);

// So sánh password khi đăng nhập
const isMatch = await bcrypt.compare(inputPassword, account.password);
```

## Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [React Native Navigation](https://reactnavigation.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
