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
exports.ContactsGrpcClient = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ContactsGrpcClient = class ContactsGrpcClient {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.contactsService = this.client.getService('ContactsService');
    }
    getUserProfile(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getUserProfile(data)); }
    updateUserProfile(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.updateUserProfile(data)); }
    getDeliveryAddresses(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getDeliveryAddresses(data)); }
    getDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getDeliveryAddress(data)); }
    getDefaultDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getDefaultDeliveryAddress(data)); }
    createDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.createDeliveryAddress(data)); }
    updateDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.updateDeliveryAddress(data)); }
    deleteDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.deleteDeliveryAddress(data)); }
    setDefaultDeliveryAddress(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.setDefaultDeliveryAddress(data)); }
    getPaymentMethods(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getPaymentMethods(data)); }
    getPaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getPaymentMethod(data)); }
    getDefaultPaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.getDefaultPaymentMethod(data)); }
    createPaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.createPaymentMethod(data)); }
    updatePaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.updatePaymentMethod(data)); }
    deletePaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.deletePaymentMethod(data)); }
    setDefaultPaymentMethod(data) { return (0, rxjs_1.firstValueFrom)(this.contactsService.setDefaultPaymentMethod(data)); }
};
exports.ContactsGrpcClient = ContactsGrpcClient;
exports.ContactsGrpcClient = ContactsGrpcClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GRPC_CONTACTS_SERVICE')),
    __metadata("design:paramtypes", [Object])
], ContactsGrpcClient);
//# sourceMappingURL=contacts-grpc.client.js.map