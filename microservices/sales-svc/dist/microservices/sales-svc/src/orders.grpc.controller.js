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
exports.OrdersGrpcController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const order_service_1 = require("./order.service");
let OrdersGrpcController = class OrdersGrpcController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getUserOrders(data) {
        return { orders: await this.orderService.getUserOrders(data.userId) };
    }
    async getAllOrders(data) {
        return { orders: await this.orderService.getAllOrders(data) };
    }
    async getOrder(data) {
        return { order: await this.orderService.getOrderById(data.id) };
    }
    async createOrder(data) {
        return { order: await this.orderService.createOrder(data) };
    }
    async updateOrderStatus(data) {
        return { order: await this.orderService.updateOrderStatus(data.id, data.status) };
    }
    async getAllCarts() {
        return this.orderService.findAllCarts();
    }
    async getCart(data) {
        return this.orderService.getCart(data.id);
    }
    async getCartByUserId(data) {
        return this.orderService.getCartByUserId(data.userId);
    }
    async addToCart(data) {
        return this.orderService.addToCart(data);
    }
    async getCartLinesByUserId(data) {
        return this.orderService.getCartLinesByUserId(data.userId);
    }
    async removeCartLine(data) {
        return this.orderService.removeCartLine(data.cartLineId);
    }
    async clearCartByUserId(data) {
        return this.orderService.clearCartByUserId(data.userId);
    }
};
exports.OrdersGrpcController = OrdersGrpcController;
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetUserOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getUserOrders", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetAllOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getAllOrders", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getOrder", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'CreateOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "createOrder", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'UpdateOrderStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "updateOrderStatus", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetAllCarts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getAllCarts", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetCart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getCart", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetCartByUserId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getCartByUserId", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'AddToCart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "addToCart", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'GetCartLinesByUserId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "getCartLinesByUserId", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'RemoveCartLine'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "removeCartLine", null);
__decorate([
    (0, microservices_1.GrpcMethod)('OrdersService', 'ClearCartByUserId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGrpcController.prototype, "clearCartByUserId", null);
exports.OrdersGrpcController = OrdersGrpcController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrdersGrpcController);
//# sourceMappingURL=orders.grpc.controller.js.map