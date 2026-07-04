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
exports.SalesServiceCartRepository = void 0;
const common_1 = require("@nestjs/common");
const cart_entity_1 = require("../../domain/cart/cart.entity");
const axios_1 = require("@nestjs/axios");
let SalesServiceCartRepository = class SalesServiceCartRepository {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAll() {
        try {
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const response = await this.httpService.axiosRef.get(`${salesServiceUrl}/cart`);
            const cartsData = response.data;
            return cartsData.map((cartData) => new cart_entity_1.Cart(cartData.id, cartData.userId, cartData.totalPrice, cartData.status, new Date(cartData.createdAt), new Date(cartData.updatedAt), cartData.cartLines));
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error fetching carts:', error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const response = await this.httpService.axiosRef.get(`${salesServiceUrl}/cart/${id}`);
            const cartData = response.data;
            if (!cartData)
                return null;
            return new cart_entity_1.Cart(cartData.id, cartData.userId, cartData.totalPrice, cartData.status, new Date(cartData.createdAt), new Date(cartData.updatedAt), cartData.cartLines);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error fetching cart:', error);
            throw error;
        }
    }
    async getCartByUserId(userId) {
        try {
            console.log(`[SalesServiceCartRepository] Fetching cart for userId: ${userId}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const url = `${salesServiceUrl}/cart/by-user-id/${userId}`;
            console.log(`[SalesServiceCartRepository] Calling URL: ${url}`);
            const response = await this.httpService.axiosRef.get(url);
            const cartData = response.data.cart;
            console.log(`[SalesServiceCartRepository] Cart data:`, JSON.stringify(cartData, null, 2));
            if (!cartData) {
                console.log(`[SalesServiceCartRepository] No cart found for userId: ${userId}`);
                return null;
            }
            return new cart_entity_1.Cart(cartData.id, cartData.userId, cartData.totalPrice, cartData.status, new Date(cartData.createdAt), new Date(cartData.updatedAt), cartData.cartLines);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error fetching cart by userId:', error);
            throw error;
        }
    }
    async create(item) {
        try {
            console.log('[SalesServiceCartRepository] Creating cart for userId:', item.userId);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const response = await this.httpService.axiosRef.post(`${salesServiceUrl}/cart`, {
                userId: item.userId,
                cartLines: item.cartLines,
            });
            const cartData = response.data;
            console.log('[SalesServiceCartRepository] Cart created successfully:', JSON.stringify(cartData, null, 2));
            return new cart_entity_1.Cart(cartData.id, cartData.userId, cartData.totalPrice, cartData.status, new Date(cartData.createdAt), new Date(cartData.updatedAt), cartData.cartLines);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error creating cart:', error);
            throw error;
        }
    }
    async deleteCartLineById(id) {
        try {
            console.log(`[SalesServiceCartRepository] Deleting cart line with id: ${id}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            await this.httpService.axiosRef.delete(`${salesServiceUrl}/cart/lines/${id}`);
            console.log(`[SalesServiceCartRepository] Cart line deleted successfully`);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error deleting cart line:', error);
            throw error;
        }
    }
    async getCartLinesByUserId(userId) {
        try {
            console.log(`[SalesServiceCartRepository] Fetching cart lines for userId: ${userId}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const url = `${salesServiceUrl}/cart/lines/user/${userId}`;
            console.log(`[SalesServiceCartRepository] Calling URL: ${url}`);
            const response = await this.httpService.axiosRef.get(url);
            const cartLinesData = response.data.cartLines || [];
            console.log(`[SalesServiceCartRepository] Found ${cartLinesData.length} cart lines`);
            return cartLinesData;
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error fetching cart lines by userId:', error);
            throw error;
        }
    }
    async clearCartByUserId(userId) {
        try {
            console.log(`[SalesServiceCartRepository] Clearing cart for userId: ${userId}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            await this.httpService.axiosRef.delete(`${salesServiceUrl}/cart/user/${userId}`);
            console.log(`[SalesServiceCartRepository] Cart cleared successfully`);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error clearing cart:', error);
            throw error;
        }
    }
    async addToCart(userId, productId, quantity, image) {
        try {
            console.log(`[SalesServiceCartRepository] Adding to cart - userId: ${userId}, productId: ${productId}, quantity: ${quantity}, image: ${image}`);
            const salesServiceUrl = process.env.SALES_SERVICE_URL || 'http://localhost:3001';
            const response = await this.httpService.axiosRef.post(`${salesServiceUrl}/cart`, {
                userId,
                productId,
                quantity,
                image,
            });
            const cartData = response.data;
            console.log('[SalesServiceCartRepository] Item added to cart successfully:', JSON.stringify(cartData, null, 2));
            return new cart_entity_1.Cart(cartData.id, cartData.userId, cartData.totalPrice, cartData.status, new Date(cartData.createdAt), new Date(cartData.updatedAt), cartData.cartLines);
        }
        catch (error) {
            console.error('[SalesServiceCartRepository] Error adding to cart:', error);
            throw error;
        }
    }
};
exports.SalesServiceCartRepository = SalesServiceCartRepository;
exports.SalesServiceCartRepository = SalesServiceCartRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SalesServiceCartRepository);
//# sourceMappingURL=sales-service-cart.repository.js.map