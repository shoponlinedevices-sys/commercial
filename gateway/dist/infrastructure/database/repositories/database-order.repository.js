"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../../domain/order/order.entity");
const entities_1 = require("../entities");
let DatabaseOrderRepository = class DatabaseOrderRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.orderRepo = this.dataSource.getRepository(entities_1.OrderEntity);
        this.cartLineRepo = this.dataSource.getRepository(entities_1.CartLineEntity);
        this.productRepo = this.dataSource.getRepository(entities_1.ProductEntity);
    }
    async createOrder(userId, cartLines, fcmToken) {
        return this.dataSource.transaction(async (entityManager) => {
            let totalPrice = 0;
            for (const line of cartLines) {
                const product = await this.productRepo.findOne({ where: { id: line.productId } });
                if (product) {
                    totalPrice += parseFloat(String(product.price || '0')) * line.quantity;
                }
            }
            const orderEntity = entityManager.create(entities_1.OrderEntity, {
                userId,
                totalPrice: totalPrice.toString(),
                status: 1,
                fcmToken,
            });
            const savedOrder = await entityManager.save(entities_1.OrderEntity, orderEntity);
            if (!savedOrder.id) {
                throw new Error('Failed to create order');
            }
            const lineEntities = cartLines.map((line) => entityManager.create(entities_1.CartLineEntity, Object.assign({}, line)));
            if (lineEntities.length) {
                await entityManager.save(entities_1.CartLineEntity, lineEntities);
            }
            return new order_entity_1.Order(savedOrder.id, savedOrder.userId, savedOrder.totalPrice, savedOrder.status, savedOrder.createdAt, savedOrder.updatedAt);
        });
    }
    async findByUserId(userId) {
        const orders = await this.orderRepo.find({ where: { userId } });
        return orders.map((order) => new order_entity_1.Order(order.id, order.userId, order.totalPrice, order.status, order.createdAt, order.updatedAt));
    }
};
exports.DatabaseOrderRepository = DatabaseOrderRepository;
exports.DatabaseOrderRepository = DatabaseOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseOrderRepository);
//# sourceMappingURL=database-order.repository.js.map