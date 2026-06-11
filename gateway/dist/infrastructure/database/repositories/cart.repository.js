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
exports.CartRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const cart_repository_1 = require("../../../domain/cart/cart.repository");
const cart_entity_1 = require("../../../domain/cart/cart.entity");
const cart_line_entity_1 = require("../../../domain/cart/cart-line.entity");
let CartRepository = class CartRepository extends cart_repository_1.CartRepository {
    constructor(dataSource) {
        super();
        this.dataSource = dataSource;
        this.cartRepo = this.dataSource.getRepository(entities_1.CartEntity);
        this.cartLineRepo = this.dataSource.getRepository(entities_1.CartLineEntity);
    }
    async findAll() {
        const carts = await this.cartRepo.find({ relations: { cartLines: true } });
        return carts.map(cart => this.entityToDomain(cart));
    }
    async findOne(id) {
        const cart = await this.cartRepo.findOne({ where: { id }, relations: { cartLines: true } });
        return cart ? this.entityToDomain(cart) : null;
    }
    async getCartByUserId(userId) {
        const cart = await this.cartRepo.findOne({
            where: { userId, status: 1 },
            relations: { cartLines: true }
        });
        return cart ? this.entityToDomain(cart) : null;
    }
    async create(item) {
        console.log('Repository: Creating cart with item:', JSON.stringify(item));
        try {
            const cart = this.cartRepo.create({
                userId: item.userId,
                status: item.status || 1,
            });
            const savedCart = await this.cartRepo.save(cart);
            if (item.cartLines && item.cartLines.length > 0) {
                const cartLines = item.cartLines.map(line => this.cartLineRepo.create({
                    cartId: savedCart.id,
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    name: line.name,
                    status: line.status || 1,
                }));
                await this.cartLineRepo.save(cartLines);
            }
            return this.entityToDomain(savedCart);
        }
        catch (error) {
            console.error('Repository: Error creating cart:', error);
            throw error;
        }
    }
    async addToCart(userId, productId, quantity) {
        var _a;
        let cart = await this.cartRepo.findOne({
            where: { userId, status: 1 },
            relations: { cartLines: true },
        });
        if (!cart) {
            cart = this.cartRepo.create({
                userId,
                status: 1,
            });
            cart = await this.cartRepo.save(cart);
        }
        const existingCartLine = (_a = cart.cartLines) === null || _a === void 0 ? void 0 : _a.find(line => line.productId === productId);
        if (existingCartLine) {
            existingCartLine.quantity = (existingCartLine.quantity || 0) + quantity;
            await this.cartLineRepo.save(existingCartLine);
        }
        else {
            const newCartLine = this.cartLineRepo.create({
                cartId: cart.id,
                productId,
                quantity,
            });
            await this.cartLineRepo.save(newCartLine);
        }
        const updatedCart = await this.cartRepo.findOne({
            where: { id: cart.id },
            relations: { cartLines: true },
        });
        return updatedCart ? this.entityToDomain(updatedCart) : this.entityToDomain(cart);
    }
    async clearCartByUserId(userId) {
        await this.cartLineRepo.delete({ cart: { userId } });
        await this.cartRepo.delete({ userId });
    }
    entityToDomain(entity) {
        var _a, _b, _c, _d, _e, _f;
        const id = entity.id !== undefined ? entity.id : 0;
        const userId = entity.userId !== undefined ? entity.userId : 0;
        return new cart_entity_1.Cart(id, userId, (_a = entity.totalPrice) !== null && _a !== void 0 ? _a : '0', (_b = entity.status) !== null && _b !== void 0 ? _b : 1, (_c = entity.createdAt) !== null && _c !== void 0 ? _c : new Date(), (_d = entity.updatedAt) !== null && _d !== void 0 ? _d : new Date(), (_f = (_e = entity.cartLines) === null || _e === void 0 ? void 0 : _e.map(line => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return new cart_line_entity_1.CartLine(line.id !== undefined ? line.id : 0, (_a = line.cartId) !== null && _a !== void 0 ? _a : 0, (_b = line.productId) !== null && _b !== void 0 ? _b : 0, (_c = line.quantity) !== null && _c !== void 0 ? _c : 1, (_d = line.unitPrice) !== null && _d !== void 0 ? _d : '0', (_e = line.totalPrice) !== null && _e !== void 0 ? _e : '0', (_f = line.status) !== null && _f !== void 0 ? _f : 1, (_g = line.createdAt) !== null && _g !== void 0 ? _g : new Date(), (_h = line.updatedAt) !== null && _h !== void 0 ? _h : new Date(), line.name);
        })) !== null && _f !== void 0 ? _f : []);
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map