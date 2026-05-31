"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const product_module_1 = require("./product/product.module");
const auth_module_1 = require("./auth/auth.module");
const ads_module_1 = require("./ads/ads.module");
const cart_module_1 = require("./cart/cart.module");
const order_module_1 = require("./order/order.module");
const notification_module_1 = require("./notification/notification.module");
const user_profile_module_1 = require("./user-profile/user-profile.module");
const delivery_address_module_1 = require("./delivery-address/delivery-address.module");
const payment_method_module_1 = require("./payment-method/payment-method.module");
const email_module_1 = require("./email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [cart_module_1.CartModule, product_module_1.ProductModule, auth_module_1.AuthModule, ads_module_1.AdsModule, order_module_1.OrderModule, notification_module_1.NotificationModule, user_profile_module_1.UserProfileModule, delivery_address_module_1.DeliveryAddressModule, payment_method_module_1.PaymentMethodModule, email_module_1.EmailModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map