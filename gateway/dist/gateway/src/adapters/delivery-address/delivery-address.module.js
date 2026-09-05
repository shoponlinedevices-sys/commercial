"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAddressModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_address_controller_1 = require("./delivery-address.controller");
const grpc_clients_module_1 = require("../../infrastructure/grpc/grpc-clients.module");
let DeliveryAddressModule = class DeliveryAddressModule {
};
exports.DeliveryAddressModule = DeliveryAddressModule;
exports.DeliveryAddressModule = DeliveryAddressModule = __decorate([
    (0, common_1.Module)({
        imports: [grpc_clients_module_1.GrpcClientsModule],
        controllers: [delivery_address_controller_1.DeliveryAddressController],
        providers: [],
    })
], DeliveryAddressModule);
//# sourceMappingURL=delivery-address.module.js.map