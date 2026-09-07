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
exports.SalesServiceOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const order_entity_1 = require("../../domain/order/order.entity");
let SalesServiceOrderRepository = class SalesServiceOrderRepository {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.ordersService = this.client.getService('OrdersService');
    }
    toOrder(data) {
        var _a;
        return new order_entity_1.Order(parseInt(data.id, 10), parseInt(data.userId, 10), data.totalAmount || 0, data.status || 'pending', new Date(data.createdAt), new Date(data.updatedAt), (_a = data.orderLines) === null || _a === void 0 ? void 0 : _a.map((line) => ({
            productId: parseInt(line.productId, 10), quantity: line.quantity, unitPrice: line.unitPrice,
        })));
    }
    async createOrder(userId, totalAmount, cartLines, fcmToken, customerEmail, customerName, createdBy) {
        const calculatedTotal = cartLines.reduce((total, line) => total + Number(line.unitPrice || 0) * Number(line.quantity || 0), 0);
        const orderTotal = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : calculatedTotal;
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.createOrder({
            userId: userId.toString(), totalAmount: orderTotal, orderLines: cartLines, fcmToken, customerEmail, customerName, createdBy: createdBy === undefined ? undefined : String(createdBy),
        }));
        return this.toOrder(response.order);
    }
    async findByUserId(userId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getUserOrders({ userId: userId.toString() }));
        return (response.orders || []).map((order) => this.toOrder(order));
    }
    async findAll(filters) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getAllOrders(filters || {}));
        return (response.orders || []).map((order) => this.toOrder(order));
    }
    async updateStatus(orderId, status, createdBy) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.updateOrderStatus({ id: orderId, status, createdBy: createdBy === undefined ? undefined : String(createdBy) }));
        return this.toOrder(response.order);
    }
};
exports.SalesServiceOrderRepository = SalesServiceOrderRepository;
exports.SalesServiceOrderRepository = SalesServiceOrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GRPC_ORDERS_SERVICE')),
    __metadata("design:paramtypes", [Object])
], SalesServiceOrderRepository);
//# sourceMappingURL=sales-service-order.repository.js.map