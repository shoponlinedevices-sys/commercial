"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcClientsModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const email_provider_1 = require("./providers/email.provider");
const notification_provider_1 = require("./providers/notification.provider");
const contacts_grpc_client_1 = require("./contacts-grpc.client");
const grpc_path_1 = require("./grpc-path");
let GrpcClientsModule = class GrpcClientsModule {
};
exports.GrpcClientsModule = GrpcClientsModule;
exports.GrpcClientsModule = GrpcClientsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'GRPC_NOTIFICATIONS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'notification',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('notification.proto'),
                        url: process.env.NOTIFICATION_GRPC_URL || 'localhost:50051',
                    },
                },
                {
                    name: 'GRPC_EMAILS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'email',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('email.proto'),
                        url: process.env.EMAIL_GRPC_URL || 'localhost:50056',
                    },
                },
                {
                    name: 'GRPC_PRODUCTS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'product',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('product.proto'),
                        url: process.env.PRODUCTS_GRPC_URL || 'localhost:50053',
                    },
                },
                {
                    name: 'GRPC_CONTACTS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'contacts',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('contacts.proto'),
                        url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
                    },
                },
                {
                    name: 'GRPC_AUTH_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('auth.proto'),
                        url: process.env.CONTACTS_GRPC_URL || 'localhost:50054',
                        loader: { keepCase: true },
                    },
                },
                {
                    name: 'GRPC_ORDERS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'orders',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('orders.proto'),
                        url: process.env.SALES_GRPC_URL || 'localhost:50055',
                    },
                },
                {
                    name: 'GRPC_FEATURE_SETTINGS_SERVICE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'feature_settings',
                        protoPath: (0, grpc_path_1.contractsProtoPath)('feature-settings.proto'),
                        url: process.env.SALES_GRPC_URL || 'localhost:50055',
                    },
                },
            ]),
        ],
        providers: [contacts_grpc_client_1.ContactsGrpcClient, notification_provider_1.NotificationProvider, email_provider_1.EmailProvider],
        exports: [microservices_1.ClientsModule, contacts_grpc_client_1.ContactsGrpcClient, notification_provider_1.NotificationProvider, email_provider_1.EmailProvider],
    })
], GrpcClientsModule);
//# sourceMappingURL=grpc-clients.module.js.map