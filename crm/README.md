# CRM

CRM là ứng dụng Next.js riêng, có thể triển khai trên subdomain như `crm.tenmien.vn`, độc lập với website bán hàng.

## Chạy local

```powershell
npm install
npm run dev
```

CRM chạy tại `http://localhost:3012`. Khi chạy local, nếu gateway không dùng cổng mặc định `4000`, tạo `.env.local` từ `.env.example` và đặt `NEXT_PUBLIC_GATEWAY_URL` thành URL gateway local.

## Triển khai production

CRM được xuất thành website tĩnh trong thư mục `out`, phù hợp với Cloudflare Pages.

1. Tạo một Cloudflare Pages project từ repository này. Đặt **Root directory** là `crm`, **Build command** là `npm run build`, **Build output directory** là `out`. CRM thuộc pnpm workspace của repository; Cloudflare sẽ cài dependency từ lockfile workspace ở thư mục gốc.
2. Trong Pages project, đặt biến môi trường production `NEXT_PUBLIC_GATEWAY_URL` thành `https://api.thegioithietbi.online`. Giá trị này được đóng gói vào ứng dụng lúc build, nên cần build lại sau khi đổi URL.
3. Sau khi deploy lần đầu, vào **Custom domains** của Pages project và thêm `crm.thegioithietbi.online`. Đảm bảo zone `thegioithietbi.online` đã được thêm vào Cloudflare và làm theo hướng dẫn DNS/HTTPS mà Cloudflare hiển thị. Subdomain này độc lập với website ở tên miền gốc.
4. Đảm bảo API Gateway có thể được gọi từ trình duyệt qua HTTPS. Gateway hiện cho phép CORS theo origin yêu cầu.

Build production sẽ dừng nếu thiếu URL API, URL không hợp lệ, dùng HTTP hoặc trỏ đến localhost. Không cần đặt `SKIP_DEPENDENCY_INSTALL`; nếu đã thêm biến này, hãy xóa để Cloudflare cài dependency workspace. Chạy local bằng `npm run dev`; static export không dùng lệnh `next start`.
