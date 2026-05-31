"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./entities/account.entity");
const product_entity_1 = require("./entities/product.entity");
const entities_1 = require("./entities");
const notification_entity_1 = require("./entities/notification.entity");
const delivery_address_entity_1 = require("./entities/delivery-address.entity");
const payment_method_entity_1 = require("./entities/payment-method.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: 'DATABASE_CONNECTION',
                useFactory: async () => {
                    const dataSource = new typeorm_1.DataSource({
                        type: 'mysql',
                        host: 'localhost',
                        port: 3306,
                        username: 'root',
                        password: '06081990',
                        database: 'commercial',
                        entities: [account_entity_1.AccountEntity, product_entity_1.ProductEntity, entities_1.CartEntity, entities_1.CartLineEntity, entities_1.OrderEntity, notification_entity_1.NotificationEntity, delivery_address_entity_1.DeliveryAddressEntity, payment_method_entity_1.PaymentMethodEntity],
                        synchronize: false,
                        logging: true,
                    });
                    await dataSource.initialize();
                    return dataSource;
                },
            },
            {
                provide: 'DATA_SOURCE',
                useFactory: async () => {
                    const dataSource = new typeorm_1.DataSource({
                        type: 'mysql',
                        host: 'localhost',
                        port: 3306,
                        username: 'root',
                        password: '06081990',
                        database: 'commercial',
                        entities: [account_entity_1.AccountEntity, product_entity_1.ProductEntity, entities_1.CartEntity, entities_1.CartLineEntity, entities_1.OrderEntity, notification_entity_1.NotificationEntity, delivery_address_entity_1.DeliveryAddressEntity, payment_method_entity_1.PaymentMethodEntity],
                        synchronize: false,
                        logging: true,
                    });
                    await dataSource.initialize();
                    return dataSource;
                },
            },
        ],
        exports: ['DATABASE_CONNECTION', 'DATA_SOURCE'],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map