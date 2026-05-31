"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contacts_service_1 = require("./contacts.service");
const contacts_controller_1 = require("./contacts.controller");
const user_profile_entity_1 = require("./user-profile.entity");
const delivery_address_entity_1 = require("./delivery-address.entity");
const payment_method_entity_1 = require("./payment-method.entity");
const app_module_1 = require("./app.module");
let ContactsModule = class ContactsModule {
};
exports.ContactsModule = ContactsModule;
exports.ContactsModule = ContactsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_module_1.AppModule),
            typeorm_1.TypeOrmModule.forFeature([
                user_profile_entity_1.UserProfileEntity,
                delivery_address_entity_1.DeliveryAddressEntity,
                payment_method_entity_1.PaymentMethodEntity,
            ]),
        ],
        controllers: [contacts_controller_1.ContactsController],
        providers: [contacts_service_1.ContactsService],
        exports: [contacts_service_1.ContactsService],
    })
], ContactsModule);
//# sourceMappingURL=contacts.module.js.map