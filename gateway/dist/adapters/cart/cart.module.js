"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_controller_1 = require("./cart.controller");
const database_module_1 = require("../../infrastructure/database/database.module");
const cart_repository_1 = require("../../domain/cart/cart.repository");
const cart_service_1 = require("../../application/cart/cart.service");
const database_cart_repository_1 = require("../../infrastructure/database/repositories/database-cart.repository");
const product_module_1 = require("../product/product.module");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, product_module_1.ProductModule],
        controllers: [cart_controller_1.CartController],
        providers: [
            cart_service_1.CartService,
            {
                provide: cart_repository_1.CartRepository,
                useClass: database_cart_repository_1.DatabaseCartRepository,
            },
        ],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map