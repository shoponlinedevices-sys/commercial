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
let CartRepository = class CartRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.cartRepo = this.dataSource.getRepository(entities_1.CartEntity);
        this.cartLineRepo = this.dataSource.getRepository(entities_1.CartLineEntity);
    }
    async addToCart(accountId, productId, quantity) {
        var _a;
        let cart = await this.cartRepo.findOne({
            where: { userId: accountId, status: 1 },
            relations: { cartLines: true },
        });
        if (!cart) {
            cart = this.cartRepo.create({
                userId: accountId,
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
        return cart;
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map