"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGrpcService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const cart_entity_1 = require("../domain/cart/cart.entity");
const cart_line_entity_1 = require("../domain/cart/cart-line.entity");
let OrdersGrpcService = class OrdersGrpcService {
    onModuleInit() {
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.GRPC,
            options: {
                package: 'orders',
                protoPath: (0, path_1.join)(__dirname, '../../../packages/contracts/proto/orders.proto'),
                url: 'localhost:50053',
            },
        });
    }
    onModuleDestroy() {
        this.client.close();
    }
    async addToCart(userId, productId, quantity) {
        try {
            const response = await this.client.send('AddToCart', { userId, productId, quantity, cartLines: [] }).toPromise();
            return this.mapProtoToCart(response);
        }
        catch (error) {
            console.error('gRPC Error in addToCart:', error);
            throw error;
        }
    }
    async getCartByUserId(userId) {
        try {
            const response = await this.client.send('GetCartByUserId', { userId }).toPromise();
            if (!response || !response.cart) {
                return null;
            }
            return this.mapProtoToCart(response.cart);
        }
        catch (error) {
            console.error('gRPC Error in getCartByUserId:', error);
            throw error;
        }
    }
    async getCartLinesByUserId(userId) {
        try {
            const response = await this.client.send('GetCartLinesByUserId', { userId }).toPromise();
            if (!response || !response.cartLines) {
                return [];
            }
            return response.cartLines.map((line) => this.mapProtoToCartLine(line));
        }
        catch (error) {
            console.error('gRPC Error in getCartLinesByUserId:', error);
            throw error;
        }
    }
    async removeCartLine(cartLineId) {
        try {
            const response = await this.client.send('RemoveCartLine', { cartLineId }).toPromise();
            return (response === null || response === void 0 ? void 0 : response.success) || false;
        }
        catch (error) {
            console.error('gRPC Error in removeCartLine:', error);
            throw error;
        }
    }
    async clearCartByUserId(userId) {
        try {
            const response = await this.client.send('ClearCartByUserId', { userId }).toPromise();
            return (response === null || response === void 0 ? void 0 : response.success) || false;
        }
        catch (error) {
            console.error('gRPC Error in clearCartByUserId:', error);
            throw error;
        }
    }
    mapProtoToCart(proto) {
        var _a;
        return new cart_entity_1.Cart(proto.id || 0, proto.userId || 0, proto.totalPrice || '0', proto.status || 1, proto.createdAt ? new Date(proto.createdAt) : new Date(), proto.updatedAt ? new Date(proto.updatedAt) : new Date(), ((_a = proto.cartLines) === null || _a === void 0 ? void 0 : _a.map((line) => this.mapProtoToCartLine(line))) || []);
    }
    mapProtoToCartLine(proto) {
        var _a, _b;
        return new cart_line_entity_1.CartLine(proto.id || 0, proto.cartId || 0, proto.productId || 0, proto.quantity || 1, ((_a = proto.unitPrice) === null || _a === void 0 ? void 0 : _a.toString()) || '0', ((_b = proto.totalPrice) === null || _b === void 0 ? void 0 : _b.toString()) || '0', proto.status || 1, proto.createdAt ? new Date(proto.createdAt) : new Date(), proto.updatedAt ? new Date(proto.updatedAt) : new Date());
    }
};
exports.OrdersGrpcService = OrdersGrpcService;
exports.OrdersGrpcService = OrdersGrpcService = __decorate([
    (0, common_1.Injectable)()
], OrdersGrpcService);
//# sourceMappingURL=grpc-orders.service.js.map