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
exports.SupplierProductCostGrpcController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const grpc_js_1 = require("@grpc/grpc-js");
const product_service_1 = require("../product.service");
let SupplierProductCostGrpcController = class SupplierProductCostGrpcController {
    constructor(productService) {
        this.productService = productService;
    }
    createSupplier(request) {
        const input = this.supplierInput(request, true);
        return this.run(async () => this.mapSupplier(await this.productService.createSupplier(input)));
    }
    listSuppliers(request) {
        const page = this.page(request.page, 1);
        const limit = this.limit(request.limit, 20);
        return this.run(async () => {
            const result = await this.productService.listSuppliers({
                search: this.optionalSearch(request.search),
                status: request.hasStatus ? this.statusValue(request.status) : undefined,
                page,
                limit,
            });
            return { ...result, items: result.items.map((supplier) => this.mapSupplier(supplier)) };
        });
    }
    getSupplier(request) {
        const id = this.positiveId(request.id, 'supplier id');
        return this.run(async () => {
            const supplier = await this.productService.getSupplier(id);
            if (!supplier)
                throw new common_1.NotFoundException('Nhà cung cấp không tồn tại');
            return this.mapSupplier(supplier);
        });
    }
    updateSupplier(request) {
        const id = this.positiveId(request.id, 'supplier id');
        const input = this.supplierInput(request, false);
        return this.run(async () => this.mapSupplier(await this.productService.updateSupplier(id, input)));
    }
    updateSupplierStatus(request) {
        const id = this.positiveId(request.id, 'supplier id');
        const statusValue = this.statusValue(request.status);
        return this.run(async () => this.mapSupplier(await this.productService.updateSupplierStatus(id, statusValue)));
    }
    createProductCost(request) {
        const input = this.productCostInput(request, true);
        return this.run(async () => this.mapCost(await this.productService.createProductCost(input)));
    }
    listProductCosts(request) {
        return this.run(() => this.listCosts(request));
    }
    getProductCost(request) {
        const id = this.bigId(request.id, 'product cost id');
        return this.run(async () => {
            const cost = await this.productService.getProductCost(id);
            if (!cost)
                throw new common_1.NotFoundException('Lần nhập không tồn tại');
            return this.mapCost(cost);
        });
    }
    updateProductCost(request) {
        const id = this.bigId(request.id, 'product cost id');
        const input = this.productCostInput(request, false);
        return this.run(async () => this.mapCost(await this.productService.updateProductCost(id, input)));
    }
    listProductCostHistory(request) {
        const productId = this.positiveId(request.productId, 'product id');
        return this.run(() => this.listCosts({
            productId,
            supplierId: 0,
            search: '',
            from: '',
            to: '',
            page: request.page,
            limit: request.limit,
            hasProductId: true,
            hasSupplierId: false,
        }));
    }
    getLatestProductCost(request) {
        const productId = this.positiveId(request.productId, 'product id');
        return this.run(async () => {
            const item = await this.productService.getLatestProductCost(productId);
            return { found: item !== null, item: item ? this.mapCost(item) : undefined };
        });
    }
    getProductCostSummary() {
        return this.run(async () => {
            const summary = await this.productService.getProductCostSummary();
            return {
                totalImports: String(summary.totalImports),
                totalValue: String(summary.totalValue),
                productsWithCost: String(summary.productsWithCost),
            };
        });
    }
    async listCosts(request) {
        const from = this.optionalDate(request.from, 'from');
        const to = this.optionalDate(request.to, 'to');
        if (from && to && from > to)
            this.invalid('from must be earlier than or equal to to');
        const result = await this.productService.listProductCosts({
            productId: request.hasProductId ? this.positiveId(request.productId, 'product id') : undefined,
            supplierId: request.hasSupplierId ? this.positiveId(request.supplierId, 'supplier id') : undefined,
            search: this.optionalSearch(request.search),
            from,
            to,
            page: this.page(request.page, 1),
            limit: this.limit(request.limit, 20),
        });
        return { ...result, items: await Promise.all(result.items.map((item) => this.mapCost(item))) };
    }
    supplierInput(request, creating) {
        if (!request || typeof request !== 'object')
            this.invalid('supplier body is required');
        const input = {};
        if (request.hasName || creating)
            input.name = this.optionalText(request.name, 'name', 255);
        if (request.hasPhone || creating)
            input.phone = this.optionalText(request.phone, 'phone', 20);
        if (request.hasEmail || creating) {
            input.email = this.optionalText(request.email, 'email', 100);
            if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
                this.invalid('email is invalid');
        }
        if (request.hasAddress || creating)
            input.address = this.optionalText(request.address, 'address');
        if (request.hasTaxCode || creating)
            input.taxCode = this.optionalText(request.taxCode, 'taxCode', 50);
        if (request.hasNote || creating)
            input.note = this.optionalText(request.note, 'note');
        if (creating && !input.name)
            this.invalid('name is required');
        if (!creating && Object.keys(input).length === 0)
            this.invalid('at least one field is required');
        return input;
    }
    productCostInput(request, creating) {
        if (!request || typeof request !== 'object')
            this.invalid('product cost body is required');
        const input = {};
        if (request.hasProductId || creating)
            input.productId = this.positiveId(request.productId, 'productId');
        if (request.hasSupplierId) {
            input.supplierId = request.supplierId === 0 ? null : this.positiveId(request.supplierId, 'supplierId');
        }
        else if (creating) {
            input.supplierId = null;
        }
        if (request.hasImportPrice || creating)
            input.importPrice = this.money(request.importPrice, 'importPrice');
        if (request.hasQuantity || creating) {
            const quantity = creating && request.quantity === 0 ? 1 : request.quantity;
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 2147483647)
                this.invalid('quantity must be a positive integer');
            input.quantity = quantity;
        }
        if (request.hasShippingFee || creating)
            input.shippingFee = this.money(request.shippingFee || '0', 'shippingFee');
        if (request.hasOtherFee || creating)
            input.otherFee = this.money(request.otherFee || '0', 'otherFee');
        if (request.hasImportDate)
            input.importDate = this.date(request.importDate, 'importDate');
        if (request.hasNote || creating)
            input.note = this.optionalText(request.note, 'note');
        if (creating && (input.productId === undefined || input.importPrice === undefined)) {
            this.invalid('productId and importPrice are required');
        }
        if (!creating && Object.keys(input).length === 0)
            this.invalid('at least one field is required');
        return input;
    }
    mapSupplier(supplier) {
        return {
            id: supplier.id,
            name: supplier.name,
            phone: supplier.phone || '',
            email: supplier.email || '',
            address: supplier.address || '',
            taxCode: supplier.taxCode || '',
            note: supplier.note || '',
            status: supplier.status,
            createdAt: this.isoDate(supplier.createdAt),
            updatedAt: this.isoDate(supplier.updatedAt),
        };
    }
    mapCost(result) {
        return {
            id: result.id,
            productId: result.productId,
            productName: result.productName,
            sku: result.sku || '',
            salePrice: String(result.salePrice),
            supplierId: result.supplierId || 0,
            supplierName: result.supplierName || '',
            importPrice: String(result.importPrice),
            quantity: result.quantity,
            shippingFee: String(result.shippingFee),
            otherFee: String(result.otherFee),
            totalGoods: String(result.totalGoods),
            totalFees: String(result.totalFees),
            totalValue: String(result.totalValue),
            unitCost: String(result.unitCost),
            expectedProfit: String(result.expectedProfit),
            profitMarginPercent: result.profitMarginPercent === null ? '' : String(result.profitMarginPercent),
            hasProfitMargin: result.profitMarginPercent !== null,
            importDate: this.isoDate(result.importDate),
            note: result.note || '',
            createdAt: this.isoDate(result.createdAt),
            hasSupplier: result.supplierId !== null,
        };
    }
    async run(operation) {
        try {
            return await operation();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                const code = error instanceof common_1.NotFoundException ? grpc_js_1.status.NOT_FOUND : grpc_js_1.status.INVALID_ARGUMENT;
                const response = error.getResponse();
                const message = typeof response === 'string'
                    ? response
                    : typeof response === 'object' && response !== null && 'message' in response
                        ? String(response.message)
                        : error.message;
                throw new microservices_1.RpcException({ code, message });
            }
            if (error instanceof microservices_1.RpcException)
                throw error;
            throw error;
        }
    }
    positiveId(value, field) {
        if (!Number.isSafeInteger(value) || value < 1)
            this.invalid(`${field} must be a positive integer`);
        return value;
    }
    page(value, fallback) {
        const page = value || fallback;
        if (!Number.isSafeInteger(page) || page < 1 || page > 1000000)
            this.invalid('page must be between 1 and 1000000');
        return page;
    }
    limit(value, fallback) {
        const limit = value || fallback;
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
            this.invalid('limit must be between 1 and 100');
        return limit;
    }
    statusValue(value) {
        if (value !== 0 && value !== 1)
            this.invalid('status must be 0 or 1');
        return value;
    }
    optionalSearch(value) {
        const search = (value || '').trim();
        if (search.length > 200)
            this.invalid('search must be at most 200 characters');
        return search || undefined;
    }
    optionalText(value, field, maxLength) {
        const text = (value || '').trim();
        if (maxLength !== undefined && text.length > maxLength)
            this.invalid(`${field} must be at most ${maxLength} characters`);
        return text || null;
    }
    money(value, field) {
        const amount = Number(value);
        if (!/^\d{1,13}(\.\d{1,2})?$/.test(value) || !Number.isFinite(amount)) {
            this.invalid(`${field} must be a non-negative amount with up to 2 decimal places`);
        }
        return amount;
    }
    date(value, field) {
        if (!value || !/(Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
            this.invalid(`${field} must be an ISO 8601 date with timezone`);
        }
        return new Date(value);
    }
    optionalDate(value, field) {
        return value ? this.date(value, field) : undefined;
    }
    bigId(value, field) {
        if (!/^[1-9]\d{0,19}$/.test(value) || value.length === 20 && value > '18446744073709551615') {
            this.invalid(`${field} must be a positive unsigned 64-bit integer`);
        }
        return value;
    }
    isoDate(value) {
        const date = value instanceof Date ? value : new Date(value);
        return Number.isFinite(date.getTime()) ? date.toISOString() : '';
    }
    invalid(message) {
        throw new microservices_1.RpcException({ code: grpc_js_1.status.INVALID_ARGUMENT, message });
    }
};
exports.SupplierProductCostGrpcController = SupplierProductCostGrpcController;
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'CreateSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "createSupplier", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'ListSuppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupplierProductCostGrpcController.prototype, "listSuppliers", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'GetSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "getSupplier", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'UpdateSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "updateSupplier", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'UpdateSupplierStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "updateSupplierStatus", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'CreateProductCost'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "createProductCost", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'ListProductCosts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupplierProductCostGrpcController.prototype, "listProductCosts", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'GetProductCost'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "getProductCost", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'UpdateProductCost'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierProductCostGrpcController.prototype, "updateProductCost", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'ListProductCostHistory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupplierProductCostGrpcController.prototype, "listProductCostHistory", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'GetLatestProductCost'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupplierProductCostGrpcController.prototype, "getLatestProductCost", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ProductService', 'GetProductCostSummary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupplierProductCostGrpcController.prototype, "getProductCostSummary", null);
exports.SupplierProductCostGrpcController = SupplierProductCostGrpcController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], SupplierProductCostGrpcController);
//# sourceMappingURL=supplier-product-cost.grpc.controller.js.map