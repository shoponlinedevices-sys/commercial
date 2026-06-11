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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../domain/identity/public.decorator");
const cart_dto_1 = require("./dto/cart.dto");
const cart_service_1 = require("../../application/cart/cart.service");
const product_service_1 = require("../../application/product/product.service");
let CartController = class CartController {
    constructor(cartService, productService) {
        this.cartService = cartService;
        this.productService = productService;
    }
    findAll() {
        return this.cartService.findAll();
    }
    findOne(id) {
        return this.cartService.findOne(parseInt(id, 10));
    }
    async getCartByUserId(userId) {
        try {
            console.log('Fetching cart for userId:', userId);
            const result = await this.cartService.getCartByUserId(userId);
            console.log('getCartByUserId result:', result);
            return { cart: result };
        }
        catch (error) {
            console.error('Error in getCartByUserId controller:', error);
            throw error;
        }
    }
    async addToCart(body) {
        try {
            console.log('Controller: addToCart called with body:', JSON.stringify(body));
            const product = await this.productService.findOne(body.productId);
            console.log('Controller: Product found:', product ? product.name : 'null');
            if (!product) {
                throw new Error(`Product with id ${body.productId} not found`);
            }
            console.log('Controller: Calling cartService.addToCart');
            const result = await this.cartService.addToCart(body.userId, body.productId, body.quantity);
            console.log('Controller: Cart created successfully:', JSON.stringify(result));
            return result;
        }
        catch (error) {
            console.error('Controller: Error in addToCart:', error);
            throw error;
        }
    }
    removeFromCart(id) {
        console.log(`Attempting to delete cart line with id: ${id}`);
        return this.cartService.deleteCartLineById(parseInt(id, 10));
    }
    getCartLinesByUserId(userId) {
        return this.cartService.getCartLinesByUserId(userId);
    }
    clearCartByUserId(userId) {
        return this.cartService.clearCartByUserId(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all carts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of carts retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/by-user-id/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCartByUserId", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item added to cart successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('/lines/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeFromCart", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/lines/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart lines by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart lines retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCartLinesByUserId", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear cart by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCartByUserId", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        product_service_1.ProductService])
], CartController);
//# sourceMappingURL=cart.controller.js.map