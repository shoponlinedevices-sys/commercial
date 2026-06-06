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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_line_entity_1 = require("./order-line.entity");
let OrderService = class OrderService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get orderRepository() {
        return this.dataSource.getRepository(order_entity_1.OrderEntity);
    }
    get orderLineRepository() {
        return this.dataSource.getRepository(order_line_entity_1.OrderLineEntity);
    }
    async getUserOrders(userId) {
        return this.orderRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getOrderById(orderId) {
        return this.orderRepository.findOne({
            where: { id: orderId },
        });
    }
    async createOrder(data) {
        return this.dataSource.transaction(async (manager) => {
            const order = manager.create(order_entity_1.OrderEntity, {
                userId: data.userId,
                totalAmount: data.totalAmount,
                shippingAddress: data.shippingAddress,
                fcmToken: data.fcmToken,
                status: 'pending',
            });
            const savedOrder = await manager.save(order_entity_1.OrderEntity, order);
            const orderLineEntities = data.orderLines.map((line) => {
                const unitPrice = parseFloat(line.unitPrice);
                const totalPrice = unitPrice * line.quantity;
                return manager.create(order_line_entity_1.OrderLineEntity, {
                    orderId: savedOrder.id,
                    productId: line.productId.toString(),
                    unitPrice: line.unitPrice,
                    quantity: line.quantity,
                    totalPrice: totalPrice.toString(),
                });
            });
            if (orderLineEntities.length > 0) {
                await manager.save(order_line_entity_1.OrderLineEntity, orderLineEntities);
            }
            return manager.findOne(order_entity_1.OrderEntity, {
                where: { id: savedOrder.id },
                relations: ['orderLines'],
            });
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        return this.orderRepository.save(order);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderService);
//# sourceMappingURL=order.service.js.map