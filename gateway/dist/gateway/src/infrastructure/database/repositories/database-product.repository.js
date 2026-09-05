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
exports.DatabaseProductRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const product_entity_2 = require("../../../domain/product/product.entity");
let DatabaseProductRepository = class DatabaseProductRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.productRepo = this.dataSource.getRepository(product_entity_1.ProductEntity);
    }
    async findAll() {
        const rows = await this.productRepo.find({ where: { status: 1 } });
        return rows.map(row => {
            var _a, _b, _c, _d, _e, _f;
            return new product_entity_2.Product(row.id, row.name, Number(row.price), (_a = row.description) !== null && _a !== void 0 ? _a : '', (_b = row.image) !== null && _b !== void 0 ? _b : '', row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined, (_c = row.badge) !== null && _c !== void 0 ? _c : undefined, (_d = row.sku) !== null && _d !== void 0 ? _d : undefined, (_e = row.unit) !== null && _e !== void 0 ? _e : undefined, (_f = row.moq) !== null && _f !== void 0 ? _f : undefined);
        });
    }
    async findOne(id) {
        var _a, _b, _c, _d, _e, _f;
        const row = await this.productRepo.findOne({ where: { id, status: 1 } });
        if (!row)
            return null;
        return new product_entity_2.Product(row.id, row.name, Number(row.price), (_a = row.description) !== null && _a !== void 0 ? _a : '', (_b = row.image) !== null && _b !== void 0 ? _b : '', row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined, (_c = row.badge) !== null && _c !== void 0 ? _c : undefined, (_d = row.sku) !== null && _d !== void 0 ? _d : undefined, (_e = row.unit) !== null && _e !== void 0 ? _e : undefined, (_f = row.moq) !== null && _f !== void 0 ? _f : undefined);
    }
    async findByCategory(categoryId) {
        const rows = await this.productRepo.find({ where: { category: categoryId, status: 1 } });
        return rows.map(row => {
            var _a, _b, _c, _d, _e, _f;
            return new product_entity_2.Product(row.id, row.name, Number(row.price), (_a = row.description) !== null && _a !== void 0 ? _a : '', (_b = row.image) !== null && _b !== void 0 ? _b : '', row.oldPrice !== null && row.oldPrice !== undefined ? Number(row.oldPrice) : undefined, (_c = row.badge) !== null && _c !== void 0 ? _c : undefined, (_d = row.sku) !== null && _d !== void 0 ? _d : undefined, (_e = row.unit) !== null && _e !== void 0 ? _e : undefined, (_f = row.moq) !== null && _f !== void 0 ? _f : undefined);
        });
    }
};
exports.DatabaseProductRepository = DatabaseProductRepository;
exports.DatabaseProductRepository = DatabaseProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseProductRepository);
//# sourceMappingURL=database-product.repository.js.map