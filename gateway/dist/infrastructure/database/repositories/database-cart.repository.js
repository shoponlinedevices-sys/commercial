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
exports.DatabaseCartRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("../../../domain/cart/cart.entity");
const entities_1 = require("../entities");
let DatabaseCartRepository = class DatabaseCartRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.cartRepo = this.dataSource.getRepository(entities_1.CartEntity);
        this.productRepo = this.dataSource.getRepository(entities_1.ProductEntity);
    }
    async findAll() {
        const rows = await this.cartRepo.find();
        return rows.map(row => new cart_entity_1.Cart(row.id, row.userId, row.totalPrice, row.status, row.createdAt, row.updatedAt));
    }
    async findOne(id) {
        const row = await this.cartRepo.findOne({ where: { id } });
        if (!row)
            return null;
        return new cart_entity_1.Cart(row.id, row.userId, row.totalPrice, row.status, row.createdAt, row.updatedAt);
    }
    async findOneByUserId(userId) {
        try {
            console.log('Repository: Finding cart for userId:', userId);
            const cart = await this.cartRepo.findOne({ where: { userId: +userId } });
            if (!cart) {
                console.log('Repository: No cart found for userId:', userId);
                return null;
            }
            console.log('Repository: Cart found, fetching lines for cartId:', cart.id);
            const lines = await this.dataSource.getRepository(entities_1.CartLineEntity).find({ where: { cartId: cart.id } });
            console.log('Repository: Found lines:', lines.length);
            for (const line of lines) {
                const product = await this.productRepo.findOne({ where: { id: line.productId } });
                if (product) {
                    line.product = product;
                }
            }
            const cartLines = lines.map(line => {
                var _a;
                return ({
                    id: line.id,
                    cartId: line.cartId,
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    totalPrice: line.totalPrice,
                    status: line.status,
                    createdAt: line.createdAt,
                    updatedAt: line.updatedAt,
                    name: line.name,
                    image: (_a = line.product) === null || _a === void 0 ? void 0 : _a.image
                });
            });
            console.log('Repository: Mapped cartLines:', cartLines);
            return new cart_entity_1.Cart(cart.id, cart.userId, cart.totalPrice, cart.status, cart.createdAt, cart.updatedAt, cartLines);
        }
        catch (error) {
            console.error('Repository: Error in findOneByUserId:', error);
            throw error;
        }
    }
    getCartByUserId(userId) {
        return this.findOneByUserId(userId);
    }
    async create(item) {
        console.log('Repository: Creating cart for userId:', item.userId, 'with cartLines:', item.cartLines);
        const result = await this.dataSource.transaction(async (entityManager) => {
            const findExistingCart = await this.cartRepo.findOne({ where: { userId: item.userId, status: 1 } });
            console.log('Repository: Existing cart found:', !!findExistingCart);
            if (findExistingCart) {
                for (const line of item.cartLines) {
                    const product = await entityManager.findOne(entities_1.ProductEntity, { where: { id: line.productId } });
                    if (!product) {
                        throw new Error(`Product with id ${line.productId} does not exist`);
                    }
                    const findExistingProductCartLine = await entityManager.find(entities_1.CartLineEntity, { where: { cartId: findExistingCart.id, productId: line.productId } });
                    if (findExistingProductCartLine.length) {
                        const existingLine = findExistingProductCartLine[0];
                        existingLine.quantity += line.quantity;
                        const unitPriceNum = parseFloat(existingLine.unitPrice);
                        existingLine.totalPrice = (unitPriceNum * existingLine.quantity).toString();
                        await entityManager.save(entities_1.CartLineEntity, existingLine);
                    }
                    else {
                        const lineEntity = entityManager.create(entities_1.CartLineEntity, {
                            cartId: findExistingCart.id,
                            productId: line.productId,
                            quantity: line.quantity,
                            unitPrice: line.unitPrice.toString(),
                            totalPrice: (Number(line.unitPrice) * line.quantity).toString(),
                            name: line.name || product.name || 'Unknown Product',
                        });
                        const savedLine = await entityManager.save(entities_1.CartLineEntity, lineEntity);
                        console.log('Repository: Saved cart line with id:', savedLine.id);
                    }
                }
                return findExistingCart;
            }
            else {
                console.log('Repository: Creating new cart');
                const cartEntity = entityManager.create(entities_1.CartEntity, item);
                const savedCart = await entityManager.save(entities_1.CartEntity, cartEntity);
                console.log('Repository: Saved cart with id:', savedCart.id);
                if (!savedCart.id) {
                    throw new Error('Failed to create cart');
                }
                const lineEntities = [];
                for (const line of item.cartLines) {
                    const product = await entityManager.findOne(entities_1.ProductEntity, { where: { id: line.productId } });
                    if (!product) {
                        throw new Error(`Product with id ${line.productId} does not exist`);
                    }
                    const lineEntity = entityManager.create(entities_1.CartLineEntity, {
                        cartId: savedCart.id,
                        productId: line.productId,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice.toString(),
                        totalPrice: (Number(line.unitPrice) * line.quantity).toString(),
                        name: line.name || product.name || 'Unknown Product',
                    });
                    lineEntities.push(lineEntity);
                }
                if (lineEntities.length) {
                    const savedLines = await entityManager.save(entities_1.CartLineEntity, lineEntities);
                    console.log('Repository: Saved', savedLines.length, 'cart lines');
                }
                return savedCart;
            }
        });
        const lines = await this.dataSource.getRepository(entities_1.CartLineEntity).find({ where: { cartId: result.id } });
        for (const line of lines) {
            const product = await this.productRepo.findOne({ where: { id: line.productId } });
            if (product) {
                line.product = product;
            }
        }
        return new cart_entity_1.Cart(result.id, result.userId, result.totalPrice, result.status, result.createdAt, result.updatedAt, lines.map(line => {
            var _a;
            return ({
                id: line.id,
                cartId: line.cartId,
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                totalPrice: line.totalPrice,
                status: line.status,
                createdAt: line.createdAt,
                updatedAt: line.updatedAt,
                name: line.name,
                image: (_a = line.product) === null || _a === void 0 ? void 0 : _a.image
            });
        }));
    }
    deleteCartLineById(lineId) {
        return this.dataSource.transaction(async (entityManager) => {
            const line = await entityManager.findOne(entities_1.CartLineEntity, { where: { id: lineId } });
            if (!line) {
                throw new Error('Cart line not found');
            }
            await entityManager.delete(entities_1.CartLineEntity, { id: lineId });
        });
    }
    getCartLinesByUserId(userId) {
        return this.dataSource.transaction(async (entityManager) => {
            const cart = await entityManager.findOne(entities_1.CartEntity, { where: { userId: userId } });
            if (!cart) {
                return [];
            }
            const lines = await entityManager.find(entities_1.CartLineEntity, { where: { cartId: cart.id } });
            return lines;
        });
    }
    async clearCartByUserId(userId) {
        return this.dataSource.transaction(async (entityManager) => {
            const cart = await entityManager.findOne(entities_1.CartEntity, { where: { userId: userId } });
            if (!cart) {
                return;
            }
            await entityManager.delete(entities_1.CartLineEntity, { cartId: cart.id });
        });
    }
};
exports.DatabaseCartRepository = DatabaseCartRepository;
exports.DatabaseCartRepository = DatabaseCartRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseCartRepository);
//# sourceMappingURL=database-cart.repository.js.map