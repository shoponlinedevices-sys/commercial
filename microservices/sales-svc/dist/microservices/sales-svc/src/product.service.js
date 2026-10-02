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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ProductService = class ProductService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.grpcProductService = this.client.getService('ProductService');
    }
    async getProducts(filters) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.getProducts(filters));
            return response;
        }
        catch (error) {
            console.error('Error calling products-svc:', error);
            throw new Error('Failed to fetch products from products-svc');
        }
    }
    async getProduct(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcProductService.getProduct(request));
            return response;
        }
        catch (error) {
            console.error('Error calling products-svc:', error);
            throw new Error('Failed to fetch product from products-svc');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCT_PACKAGE')),
    __metadata("design:paramtypes", [Object])
], ProductService);
//# sourceMappingURL=product.service.js.map