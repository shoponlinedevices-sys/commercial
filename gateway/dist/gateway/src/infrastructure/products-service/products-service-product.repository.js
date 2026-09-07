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
exports.ProductsServiceProductRepository = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const product_entity_1 = require("../../domain/product/product.entity");
const grpc_js_1 = require("@grpc/grpc-js");
const rxjs_1 = require("rxjs");
let ProductsServiceProductRepository = class ProductsServiceProductRepository {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.grpcProductService = this.client.getService('ProductService');
    }
    toProduct(productData) {
        return new product_entity_1.Product(productData.id, productData.name, Number(productData.price), productData.description || '', productData.image || '', productData.oldPrice !== null && productData.oldPrice !== undefined ? Number(productData.oldPrice) : undefined, productData.badge || undefined, productData.sku || undefined, productData.unit || undefined, productData.moq || undefined);
    }
    async findAll() {
        const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.getProducts({}));
        return (response.products || []).map((product) => this.toProduct(product));
    }
    async findOne(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.getProduct({ id }));
            return response.product ? this.toProduct(response.product) : null;
        }
        catch (error) {
            if (error.code === grpc_js_1.status.NOT_FOUND)
                return null;
            throw error;
        }
    }
    async findByCategory(categoryId) {
        const request = { category: String(categoryId) };
        const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.getProducts(request));
        return (response.products || []).map((product) => this.toProduct(product));
    }
    async create(data) {
        const request = {
            name: data.name,
            price: data.price,
            description: data.description,
            image: data.image,
            oldPrice: data.oldPrice,
            badge: data.badge,
            sku: data.sku,
            unit: data.unit,
            moq: data.moq,
            category: data.category === undefined ? undefined : String(data.category),
            createdBy: data.createdBy === undefined ? undefined : String(data.createdBy),
        };
        const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.createProduct(request));
        return this.toProduct(response.product);
    }
};
exports.ProductsServiceProductRepository = ProductsServiceProductRepository;
exports.ProductsServiceProductRepository = ProductsServiceProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('GRPC_PRODUCTS_SERVICE')),
    __metadata("design:paramtypes", [Object])
], ProductsServiceProductRepository);
//# sourceMappingURL=products-service-product.repository.js.map