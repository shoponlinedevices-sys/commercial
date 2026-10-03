# CRM

CRM là ứng dụng Next.js riêng, có thể triển khai trên subdomain như `crm.tenmien.vn`, độc lập với website bán hàng.

## Chạy local

```powershell
npm install
npm run dev
```

CRM chạy tại `http://localhost:3012`. Khi chạy local, nếu gateway không dùng cổng mặc định `4000`, tạo `.env.local` từ `.env.example` và đặt `NEXT_PUBLIC_GATEWAY_URL` thành URL gateway local.

## Triển khai production

1. Cấu hình thư mục ứng dụng là `crm`, lệnh build là `npm run build` và lệnh chạy là `npm start`. Ứng dụng nhận cổng từ biến môi trường `PORT` của hosting; nếu không được cung cấp, Next.js dùng cổng `3000`.
2. Đặt `NEXT_PUBLIC_GATEWAY_URL` trong môi trường build thành URL HTTPS công khai của API Gateway, ví dụ `https://api.tenmien.vn`. Giá trị này được đóng gói vào ứng dụng lúc build, nên cần build lại sau khi đổi URL.
3. Tạo DNS cho `crm.tenmien.vn` theo đích CNAME/A mà hosting cung cấp; cấu hình hosting định tuyến subdomain tới ứng dụng CRM và bật HTTPS cho tên miền đó.
4. Đảm bảo API Gateway có thể được gọi từ trình duyệt qua HTTPS. Gateway hiện cho phép CORS theo origin yêu cầu.

Build production sẽ dừng nếu thiếu URL API, URL không hợp lệ, dùng HTTP hoặc trỏ đến localhost.
