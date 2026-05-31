# Frontend Mobile App (React Native)

Đây là dự án frontend mobile sử dụng React Native với TypeScript, nằm trong thư mục `mobile/frontend`.

## Khởi động dự án

1. Cài đặt dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Chạy ứng dụng trên Android:
   ```bash
   npx react-native run-android
   ```
   Hoặc trên iOS (nếu dùng macOS):
   ```bash
   npx react-native run-ios
   ```

## Kết nối backend
- Đảm bảo backend NestJS đang chạy ở http://localhost:3000
- Các API sẽ gọi về backend này để lấy dữ liệu sản phẩm, đơn hàng, ...

## Cấu trúc đề xuất
- `App.tsx`: Điểm khởi đầu ứng dụng
- `src/screens/ProductScreen.tsx`: Màn hình danh sách sản phẩm (mẫu)
- `src/api/productApi.ts`: Hàm fetch dữ liệu sản phẩm từ backend

## Ghi chú
- Có thể mở rộng thêm các màn hình khác như Đơn hàng, Khách hàng, ...
