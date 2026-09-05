"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductRepository = void 0;
const product_entity_1 = require("../../domain/product/product.entity");
const product_repository_1 = require("../../domain/product/product.repository");
class InMemoryProductRepository extends product_repository_1.ProductRepository {
    constructor() {
        super(...arguments);
        this.products = [
            new product_entity_1.Product(1, 'Máy khoan động lực 850W', 2750000, 'Máy khoan đa năng cho công trình, khoan bê tông và kim loại dễ dàng.', 'https://images.unsplash.com/photo-1517638851339-4ff7b8c0d3b7?auto=format&fit=crop&w=800&q=80', 3250000, 'Ưu đãi 15%', 'DRL-850W', 'Cái', '10'),
            new product_entity_1.Product(2, 'Bộ dụng cụ cờ lê, tuốc nơ vít 45 món', 850000, 'Bộ dụng cụ cơ khí dân dụng chất lượng cao, gọn nhẹ và bền bỉ.', 'https://images.unsplash.com/photo-1510557880182-3d4d3f9e5bde?auto=format&fit=crop&w=800&q=80', 980000, 'Bán chạy', 'KT-45', 'Bộ', '5'),
            new product_entity_1.Product(3, 'Ổ cắm chống giật 6 lỗ', 240000, 'Ổ cắm đa năng bảo vệ an toàn cho các thiết bị điện gia dụng.', 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80', undefined, undefined, 'OC-6L', 'Cái', '20'),
            new product_entity_1.Product(4, 'Đèn bàn LED công nghiệp', 420000, 'Đèn LED tiêu thụ điện thấp, ánh sáng mạnh, tuổi thọ cao.', 'https://images.unsplash.com/photo-1518110837678-1f35d752a1be?auto=format&fit=crop&w=800&q=80', 520000, 'Giảm giá', 'LED-IND', 'Cái', '15'),
            new product_entity_1.Product(5, 'Bơm nước mini 220V', 1150000, 'Bơm nước cho hệ thống tưới tiêu, cấp nước sinh hoạt và công nghiệp nhẹ.', 'https://images.unsplash.com/photo-1517875039134-768eb3e5bc1d?auto=format&fit=crop&w=800&q=80', undefined, undefined, 'PMP-220', 'Bộ', '8'),
        ];
    }
    async findAll() {
        return this.products;
    }
    async findOne(id) {
        return this.products.find(product => product.id === id) || null;
    }
    async findByCategory(categoryId) {
        return this.products.filter(product => product.category === categoryId);
    }
}
exports.InMemoryProductRepository = InMemoryProductRepository;
//# sourceMappingURL=in-memory-product.repository.js.map