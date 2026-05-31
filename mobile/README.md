# Mobile App Bán Hàng - NestJS, Hexagonal + Clean Architecture

Dự án này là một ứng dụng backend cho mobile app bán hàng, sử dụng NestJS (TypeScript) và áp dụng kiến trúc Hexagonal kết hợp Clean Architecture.

## Cấu trúc thư mục đề xuất

- `src/`
  - `application/` - Use cases, service application
  - `domain/` - Entities, repository interfaces, domain logic
  - `infrastructure/` - Triển khai repository, database, external services
  - `adapters/` - Controllers, REST API, GraphQL, các adapter vào/ra
  - `main.ts` - Entry point
- `test/` - Unit tests

## Khởi tạo dự án

1. Cài đặt NestJS CLI (nếu chưa có):
   ```bash
   npm i -g @nestjs/cli
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy ứng dụng:
   ```bash
   npm run start:dev
   ```

## Module ví dụ: Product
- Đã có sẵn ví dụ module Product với các layer theo kiến trúc Hexagonal + Clean Architecture.

## Ghi chú
- Đây là backend API, frontend mobile app sẽ kết nối qua REST API hoặc GraphQL.
- Có thể mở rộng thêm các module khác như Order, Customer, ...
