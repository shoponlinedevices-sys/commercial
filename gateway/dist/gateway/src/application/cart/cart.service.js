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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let CartService = class CartService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.ordersService = this.client.getService('OrdersService');
    }
    async findAll() {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getAllCarts({}));
        return response.carts || [];
    }
    async findOne(id) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getCart({ id }));
        return response.cart || null;
    }
    async getCartByUserId(userId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getCartByUserId({ userId }));
        return response.cart || null;
    }
    async create(item) {
        var _a, _b;
        const line = (_a = item.cartLines) === null || _a === void 0 ? void 0 : _a[0];
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.addToCart({
            userId: item.userId,
            productId: (line === null || line === void 0 ? void 0 : line.productId) || 0,
            quantity: (line === null || line === void 0 ? void 0 : line.quantity) || 0,
            cartLines: (_b = item.cartLines) === null || _b === void 0 ? void 0 : _b.map((cartLine) => (Object.assign(Object.assign({}, cartLine), { unitPrice: Number(cartLine.unitPrice) }))),
            image: line === null || line === void 0 ? void 0 : line.image,
        }));
        return response.cart;
    }
    async addToCart(userId, productId, quantity, image) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.addToCart({ userId, productId, quantity, image }));
        return response.cart;
    }
    async updateCartLineQuantity(cartLineId, quantity) {
        await (0, rxjs_1.firstValueFrom)(this.ordersService.updateCartLineQuantity({ cartLineId, quantity }));
    }
    async deleteCartLineById(id) {
        await (0, rxjs_1.firstValueFrom)(this.ordersService.removeCartLine({ cartLineId: id }));
    }
    async getCartLinesByUserId(userId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.ordersService.getCartLinesByUserId({ userId }));
        return response.cartLines || [];
    }
    async clearCartByUserId(userId) {
        await (0, rxjs_1.firstValueFrom)(this.ordersService.clearCartByUserId({ userId }));
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GRPC_ORDERS_SERVICE')),
    __metadata("design:paramtypes", [Object])
], CartService);
//# sourceMappingURL=cart.service.js.map