"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodModule = void 0;
const common_1 = require("@nestjs/common");
const payment_method_controller_1 = require("./payment-method.controller");
const payment_method_service_1 = require("../../application/payment-method/payment-method.service");
const payment_method_repository_1 = require("../../infrastructure/database/repositories/payment-method.repository");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
const database_module_1 = require("../../infrastructure/database/database.module");
const grpc_clients_module_1 = require("../../infrastructure/grpc/grpc-clients.module");
let PaymentMethodModule = class PaymentMethodModule {
};
exports.PaymentMethodModule = PaymentMethodModule;
exports.PaymentMethodModule = PaymentMethodModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, grpc_clients_module_1.GrpcClientsModule],
        controllers: [payment_method_controller_1.PaymentMethodController],
        providers: [payment_method_service_1.PaymentMethodService, payment_method_repository_1.PaymentMethodRepository, account_repository_1.AccountRepository],
        exports: [payment_method_service_1.PaymentMethodService],
    })
], PaymentMethodModule);
//# sourceMappingURL=payment-method.module.js.map