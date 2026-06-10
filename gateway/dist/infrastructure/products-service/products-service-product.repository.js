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
exports.ProductsServiceProductRepository = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("../../domain/product/product.entity");
const axios_1 = require("@nestjs/axios");
let ProductsServiceProductRepository = class ProductsServiceProductRepository {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAll() {
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products`);
            const productsData = response.data.products || response.data;
            return productsData.map((productData) => new product_entity_1.Product(productData.id, productData.name, Number(productData.price), productData.description || '', productData.image || '', productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined, productData.badge || undefined, productData.sku || undefined, productData.unit || undefined, productData.moq || undefined));
        }
        catch (error) {
            console.error('[ProductsServiceProductRepository] Error fetching products:', error);
            throw error;
        }
    }
    async findOne(id) {
        var _a;
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products/${id}`);
            const productData = response.data;
            if (!productData)
                return null;
            return new product_entity_1.Product(productData.id, productData.name, Number(productData.price), productData.description || '', productData.image || '', productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined, productData.badge || undefined, productData.sku || undefined, productData.unit || undefined, productData.moq || undefined);
        }
        catch (error) {
            console.error('[ProductsServiceProductRepository] Error fetching product:', error);
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
                return null;
            throw error;
        }
    }
    async findByCategory(categoryId) {
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003'}/products?category=${categoryId}`);
            const productsData = response.data.products || response.data;
            return productsData.map((productData) => new product_entity_1.Product(productData.id, productData.name, Number(productData.price), productData.description || '', productData.image || '', productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined, productData.badge || undefined, productData.sku || undefined, productData.unit || undefined, productData.moq || undefined));
        }
        catch (error) {
            console.error('[ProductsServiceProductRepository] Error fetching products by category:', error);
            throw error;
        }
    }
};
exports.ProductsServiceProductRepository = ProductsServiceProductRepository;
exports.ProductsServiceProductRepository = ProductsServiceProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ProductsServiceProductRepository);
//# sourceMappingURL=products-service-product.repository.js.map