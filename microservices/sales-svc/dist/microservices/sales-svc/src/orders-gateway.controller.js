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
exports.OrdersGatewayController = void 0;
const common_1 = require("@nestjs/common");
const orders_gateway_service_1 = require("./orders-gateway.service");
let OrdersGatewayController = class OrdersGatewayController {
    constructor(ordersGatewayService) {
        this.ordersGatewayService = ordersGatewayService;
    }
    async getUserOrders(userId) {
        return this.ordersGatewayService.getUserOrders(userId);
    }
    async getOrder(id) {
        return this.ordersGatewayService.getOrder(id);
    }
    async createOrder(body) {
        const result = await this.ordersGatewayService.createOrder(body);
        return result;
    }
    async updateOrderStatus(id, body) {
        return this.ordersGatewayService.updateOrderStatus({ id, status: body.status });
    }
    async getCart(id) {
        return this.ordersGatewayService.getCart(parseInt(id));
    }
    async getCartByUserId(userId) {
        return this.ordersGatewayService.getCartByUserId(parseInt(userId));
    }
    async addToCart(body) {
        return this.ordersGatewayService.addToCart(body);
    }
    async getCartLinesByUserId(userId) {
        return this.ordersGatewayService.getCartLinesByUserId(parseInt(userId));
    }
    async removeCartLine(cartLineId) {
        return this.ordersGatewayService.removeCartLine(parseInt(cartLineId));
    }
    async clearCartByUserId(userId) {
        return this.ordersGatewayService.clearCartByUserId(parseInt(userId));
    }
};
exports.OrdersGatewayController = OrdersGatewayController;
__decorate([
    (0, common_1.Get)('orders/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('cart/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getCart", null);
__decorate([
    (0, common_1.Get)('cart/by-user-id/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getCartByUserId", null);
__decorate([
    (0, common_1.Post)('cart'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Get)('cart/lines/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "getCartLinesByUserId", null);
__decorate([
    (0, common_1.Delete)('cart/lines/:cartLineId'),
    __param(0, (0, common_1.Param)('cartLineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "removeCartLine", null);
__decorate([
    (0, common_1.Delete)('cart/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersGatewayController.prototype, "clearCartByUserId", null);
exports.OrdersGatewayController = OrdersGatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [orders_gateway_service_1.OrdersGatewayService])
], OrdersGatewayController);
//# sourceMappingURL=orders-gateway.controller.js.map