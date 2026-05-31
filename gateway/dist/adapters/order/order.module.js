"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const axios_1 = require("@nestjs/axios");
const path_1 = require("path");
const order_controller_1 = require("./order.controller");
const order_service_1 = require("../../application/order/order.service");
const order_repository_1 = require("../../domain/order/order.repository");
const database_order_repository_1 = require("../../infrastructure/database/repositories/database-order.repository");
const database_module_1 = require("../../infrastructure/database/database.module");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            axios_1.HttpModule,
            microservices_1.ClientsModule.register([
                {
                    name: 'NOTIFICATION_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'notification',
                        protoPath: (0, path_1.join)(__dirname, '../../../../packages/contracts/proto/notification.proto'),
                        url: 'localhost:50052',
                        options: {
                            longs: Number,
                        },
                    },
                },
            ]),
        ],
        controllers: [order_controller_1.OrderController],
        providers: [
            order_service_1.OrderService,
            {
                provide: order_repository_1.OrderRepository,
                useClass: database_order_repository_1.DatabaseOrderRepository,
            },
        ],
        exports: [order_service_1.OrderService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map