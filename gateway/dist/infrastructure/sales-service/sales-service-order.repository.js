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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesServiceOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("../../domain/order/order.entity");
const axios_1 = require("@nestjs/axios");
let SalesServiceOrderRepository = class SalesServiceOrderRepository {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async createOrder(userId, cartLines, fcmToken) {
        try {
            const response = await this.httpService.axiosRef.post(`${process.env.SALES_SERVICE_URL || 'http://localhost:3001'}/orders`, {
                userId: userId.toString(),
                totalAmount: 0,
                orderLines: cartLines,
                fcmToken,
            });
            const orderData = response.data;
            return new order_entity_1.Order(parseInt(orderData.id), parseInt(orderData.userId), orderData.totalAmount || 0, orderData.status || 'pending', new Date(orderData.createdAt), new Date(orderData.updatedAt));
        }
        catch (error) {
            console.error('[SalesServiceOrderRepository] Error creating order:', error);
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            console.log(`[SalesServiceOrderRepository] Fetching orders for userId: ${userId}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const url = `${salesServiceUrl}/orders/user/${userId}`;
            console.log(`[SalesServiceOrderRepository] Calling URL: ${url}`);
            const response = await this.httpService.axiosRef.get(url);
            const ordersData = response.data;
            console.log(`[SalesServiceOrderRepository] Found ${ordersData.length} orders`);
            console.log(`[SalesServiceOrderRepository] Orders data:`, JSON.stringify(ordersData, null, 2));
            return ordersData.map((orderData) => {
                var _a;
                return new order_entity_1.Order(parseInt(orderData.id), parseInt(orderData.userId), orderData.totalAmount || 0, orderData.status || 'pending', new Date(orderData.createdAt), new Date(orderData.updatedAt), (_a = orderData.orderLines) === null || _a === void 0 ? void 0 : _a.map((line) => ({
                    productId: parseInt(line.productId),
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                })));
            });
        }
        catch (error) {
            console.error('[SalesServiceOrderRepository] Error fetching orders:', error);
            console.error('[SalesServiceOrderRepository] Error details:', JSON.stringify(error, null, 2));
            throw error;
        }
    }
};
exports.SalesServiceOrderRepository = SalesServiceOrderRepository;
exports.SalesServiceOrderRepository = SalesServiceOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SalesServiceOrderRepository);
//# sourceMappingURL=sales-service-order.repository.js.map