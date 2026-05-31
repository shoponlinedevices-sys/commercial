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
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("./category.entity");
let ProductService = class ProductService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get productRepository() {
        return this.dataSource.getRepository(product_entity_1.ProductEntity);
    }
    async getProducts(filters) {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        if (filters?.search) {
            queryBuilder.andWhere('product.name LIKE :search', {
                search: `%${filters.search}%`,
            });
        }
        if (filters?.category) {
            const categoryRepo = this.dataSource.getRepository(category_entity_1.CategoryEntity);
            const category = await categoryRepo.findOne({
                where: { name: filters.category, is_active: 1 },
            });
            if (category) {
                queryBuilder.andWhere('product.category = :category', {
                    category: category.id.toString(),
                });
            }
            else {
                queryBuilder.andWhere('product.category = :category', {
                    category: filters.category,
                });
            }
        }
        if (filters?.limit) {
            queryBuilder.limit(filters.limit);
        }
        if (filters?.offset) {
            queryBuilder.offset(filters.offset);
        }
        const products = await queryBuilder.getMany();
        const total = await queryBuilder.getCount();
        return {
            products,
            total,
        };
    }
    async getProduct(id) {
        const product = await this.productRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return { product };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductService);
//# sourceMappingURL=product.service.js.map