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
exports.OrdersGatewayService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let OrdersGatewayService = class OrdersGatewayService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.grpcOrdersService = this.client.getService('OrdersService');
    }
    async getUserOrders(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.getUserOrders({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to fetch user orders from orders-svc');
        }
    }
    async getOrder(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.getOrder({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to fetch order from orders-svc');
        }
    }
    async createOrder(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.createOrder(request));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to create order in orders-svc');
        }
    }
    async updateOrderStatus(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.updateOrderStatus(request));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to update order status in orders-svc');
        }
    }
    async getCart(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.getCart({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to fetch cart from orders-svc');
        }
    }
    async getCartByUserId(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.getCartByUserId({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to fetch cart by user id from orders-svc');
        }
    }
    async addToCart(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.addToCart(request));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to add to cart in orders-svc');
        }
    }
    async getCartLinesByUserId(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.getCartLinesByUserId({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to fetch cart lines from orders-svc');
        }
    }
    async removeCartLine(cartLineId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.removeCartLine({ cartLineId }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to remove cart line in orders-svc');
        }
    }
    async clearCartByUserId(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcOrdersService.clearCartByUserId({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling orders-svc:', error);
            throw new Error('Failed to clear cart in orders-svc');
        }
    }
};
exports.OrdersGatewayService = OrdersGatewayService;
exports.OrdersGatewayService = OrdersGatewayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ORDERS_PACKAGE')),
    __metadata("design:paramtypes", [Object])
], OrdersGatewayService);
//# sourceMappingURL=orders-gateway.service.js.map