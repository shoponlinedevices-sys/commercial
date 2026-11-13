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
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003';
let OrderService = class OrderService {
    constructor(orderRepository, notificationClient, orderClient) {
        this.orderRepository = orderRepository;
        this.notificationClient = notificationClient;
        this.orderClient = orderClient;
    }
    onModuleInit() {
        this.notificationService = this.notificationClient.getService('NotificationService');
        this.orderService = this.orderClient.getService('OrdersService');
    }
    async callInventory(action, payload) {
        const response = await fetch(`${PRODUCTS_SERVICE_URL}/inventory/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error((data === null || data === void 0 ? void 0 : data.message) || (data === null || data === void 0 ? void 0 : data.error) || `Inventory ${action} request failed`);
        }
        return data;
    }
    async reserveOrderLines(cartLines, createdBy) {
        var _a;
        const results = [];
        for (const [index, line] of (cartLines || []).entries()) {
            const productId = Number(line.productId);
            const quantity = Number(line.quantity || 0);
            if (!productId || quantity <= 0) {
                continue;
            }
            const referenceId = `ORD-RES-${Date.now()}-${index}`;
            const result = await this.callInventory('reserve', {
                productId,
                quantity,
                referenceType: 'order',
                referenceId,
                note: `Đặt hàng - ${createdBy !== null && createdBy !== void 0 ? createdBy : 'gateway'}`,
                createdBy,
            });
            results.push({ productId, quantity, referenceId });
            if ((_a = result === null || result === void 0 ? void 0 : result.transaction) === null || _a === void 0 ? void 0 : _a.referenceId) {
                results[results.length - 1].referenceId = result.transaction.referenceId;
            }
        }
        return results;
    }
    async releaseOrderLines(cartLines, createdBy) {
        for (const [index, line] of (cartLines || []).entries()) {
            const productId = Number(line.productId);
            const quantity = Number(line.quantity || 0);
            if (!productId || quantity <= 0) {
                continue;
            }
            await this.callInventory('release', {
                productId,
                quantity,
                referenceType: 'order',
                referenceId: `ORD-REL-${Date.now()}-${index}`,
                note: `Huỷ / giải phóng kho - ${createdBy !== null && createdBy !== void 0 ? createdBy : 'gateway'}`,
                createdBy,
            });
        }
    }
    async settleOrderInventoryForStatus(order, nextStatus, createdBy) {
        if (!order || !order.orderLines || order.orderLines.length === 0) {
            return;
        }
        const normalized = (nextStatus || '').trim().toLowerCase();
        if (normalized === 'cancelled' || normalized === 'rejected' || normalized === 'canceled') {
            await this.releaseOrderLines(order.orderLines, createdBy);
            return;
        }
        if (normalized === 'completed' || normalized === 'delivered' || normalized === 'fulfilled') {
            for (const line of order.orderLines) {
                const productId = Number(line.productId);
                const quantity = Number(line.quantity || 0);
                if (!productId || quantity <= 0) {
                    continue;
                }
                await this.callInventory('sale', {
                    productId,
                    quantity,
                    referenceType: 'order',
                    referenceId: `ORD-SALE-${order.id}-${Date.now()}`,
                    note: `Bán hàng - đơn ${order.id}`,
                    createdBy,
                });
            }
            return;
        }
        if (normalized === 'returned' || normalized === 'refund') {
            for (const line of order.orderLines) {
                const productId = Number(line.productId);
                const quantity = Number(line.quantity || 0);
                if (!productId || quantity <= 0) {
                    continue;
                }
                await this.callInventory('return', {
                    productId,
                    quantity,
                    referenceType: 'order',
                    referenceId: `ORD-RET-${order.id}-${Date.now()}`,
                    note: `Trả hàng - đơn ${order.id}`,
                    createdBy,
                });
            }
        }
    }
    async createOrder(input) {
        try {
            await this.reserveOrderLines(input.orderLines, input.createdBy);
            const order = await (0, rxjs_1.firstValueFrom)(this.orderService.createOrder(input));
            if (input.fcmToken) {
                try {
                    await (0, rxjs_1.firstValueFrom)(this.notificationService.sendNotification({
                        token: input.fcmToken,
                        title: 'Đặt hàng thành công',
                        body: `Đơn hàng #${order.order.id} của bạn đã được đặt thành công. Tổng giá: ${order.order.totalAmount}₫`,
                        data: { orderId: order.order.id.toString(), type: 'order_created' },
                    }));
                }
                catch (error) {
                    console.error('Failed to send notification:', error);
                }
            }
            try {
                await (0, rxjs_1.firstValueFrom)(this.notificationService.createNotification({
                    userId: input.userId.toString(),
                    title: 'Đặt hàng thành công',
                    message: `Đơn hàng #${order.order.id} của bạn đã được đặt thành công. Tổng giá: ${order.order.totalAmount}₫`,
                    type: 'order',
                    metadata: { orderId: order.order.id.toString(), totalAmount: order.order.totalAmount.toString() },
                }));
            }
            catch (error) {
                console.error('Failed to save notification to database:', error);
            }
            return order.order;
        }
        catch (error) {
            await this.releaseOrderLines(input.orderLines, input.createdBy).catch((releaseError) => {
                console.error('Failed to release reserved inventory after order creation failure:', releaseError);
            });
            throw error;
        }
    }
    async findByUserId(userId) {
        console.log(`[OrderService] Finding orders for userId: ${userId}`);
        const orders = await (0, rxjs_1.firstValueFrom)(this.orderService.getUserOrders({ userId }));
        console.log(`[OrderService] Found ${orders.orders.length} orders for userId: ${userId}`);
        return orders.orders;
    }
    async findAll(filters) {
        return (0, rxjs_1.firstValueFrom)(this.orderService.getAllOrders(filters));
    }
    async updateStatus(orderId, status, createdBy) {
        const currentOrders = await (0, rxjs_1.firstValueFrom)(this.orderService.getAllOrders());
        const currentOrder = currentOrders.find((order) => order.id.toString() === orderId);
        const previousStatus = (currentOrder === null || currentOrder === void 0 ? void 0 : currentOrder.status) || 'pending';
        const updated = await (0, rxjs_1.firstValueFrom)(this.orderService.updateOrderStatus({ id: orderId, status, createdBy }));
        try {
            await this.settleOrderInventoryForStatus(updated.order, status, createdBy);
        }
        catch (error) {
            console.error(`Failed to sync inventory for order ${orderId} status ${status}:`, error);
        }
        if (previousStatus && previousStatus.toLowerCase() === 'cancelled' && status.toLowerCase() !== 'cancelled') {
            await this.reserveOrderLines((currentOrder === null || currentOrder === void 0 ? void 0 : currentOrder.orderLines) || [], createdBy).catch((reserveError) => {
                console.error('Failed to re-reserve inventory after status recovery:', reserveError);
            });
        }
        return updated.order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('GRPC_NOTIFICATIONS_SERVICE')),
    __param(2, (0, common_1.Inject)('GRPC_ORDERS_SERVICE')),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository, Object, Object])
], OrderService);
//# sourceMappingURL=order.service.js.map