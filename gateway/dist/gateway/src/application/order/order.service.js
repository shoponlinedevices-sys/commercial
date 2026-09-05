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
const rxjs_1 = require("rxjs");
const order_repository_1 = require("../../domain/order/order.repository");
let OrderService = class OrderService {
    constructor(orderRepository, notificationClient) {
        this.orderRepository = orderRepository;
        this.notificationClient = notificationClient;
    }
    onModuleInit() {
        this.notificationService = this.notificationClient.getService('NotificationService');
    }
    async createOrder(userId, cartLines, fcmToken, customerEmail, customerName) {
        const order = await this.orderRepository.createOrder(userId, cartLines, fcmToken, customerEmail, customerName);
        if (fcmToken) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.notificationService.sendNotification({
                    token: fcmToken,
                    title: 'Đặt hàng thành công',
                    body: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
                    data: { orderId: order.id.toString(), type: 'order_created' },
                }));
            }
            catch (error) {
                console.error('Failed to send notification:', error);
            }
        }
        try {
            await (0, rxjs_1.firstValueFrom)(this.notificationService.createNotification({
                userId: userId.toString(),
                title: 'Đặt hàng thành công',
                message: `Đơn hàng #${order.id} của bạn đã được đặt thành công. Tổng giá: ${order.totalAmount}₫`,
                type: 'order',
                metadata: { orderId: order.id.toString(), totalAmount: order.totalAmount.toString() },
            }));
        }
        catch (error) {
            console.error('Failed to save notification to database:', error);
        }
        return order;
    }
    async findByUserId(userId) {
        console.log(`[OrderService] Finding orders for userId: ${userId}`);
        const orders = await this.orderRepository.findByUserId(userId);
        console.log(`[OrderService] Found ${orders.length} orders for userId: ${userId}`);
        return orders;
    }
    async findAll(filters) {
        return this.orderRepository.findAll(filters);
    }
    async updateStatus(orderId, status) {
        return this.orderRepository.updateStatus(orderId, status);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('GRPC_NOTIFICATIONS_SERVICE')),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository, Object])
], OrderService);
//# sourceMappingURL=order.service.js.map