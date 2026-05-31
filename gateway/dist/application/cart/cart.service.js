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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("../../domain/cart/cart.repository");
let CartService = class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    findAll() {
        return this.cartRepository.findAll();
    }
    findOne(id) {
        return this.cartRepository.findOne(id);
    }
    async getCartByUserId(userId) {
        try {
            console.log('Service: Fetching cart for userId:', userId);
            const result = await this.cartRepository.getCartByUserId(userId);
            console.log('Service: Cart result:', result);
            return result;
        }
        catch (error) {
            console.error('Service: Error fetching cart by userId:', error);
            throw error;
        }
    }
    async create(item) {
        console.log('Service: Creating cart with item:', JSON.stringify(item));
        try {
            const result = await this.cartRepository.create(item);
            console.log('Service: Cart created successfully:', JSON.stringify(result));
            return result;
        }
        catch (error) {
            console.error('Service: Error creating cart:', error);
            throw error;
        }
    }
    deleteCartLineById(id) {
        try {
            return this.cartRepository.deleteCartLineById(id);
        }
        catch (error) {
            console.error('Error deleting cart line:', error);
            throw error;
        }
    }
    getCartLinesByUserId(userId) {
        try {
            return this.cartRepository.getCartLinesByUserId(userId);
        }
        catch (error) {
            console.error('Error fetching cart lines:', error);
            throw error;
        }
    }
    async clearCartByUserId(userId) {
        try {
            await this.cartRepository.clearCartByUserId(userId);
        }
        catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository])
], CartService);
//# sourceMappingURL=cart.service.js.map