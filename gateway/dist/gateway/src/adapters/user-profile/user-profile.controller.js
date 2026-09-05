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
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const contacts_grpc_client_1 = require("../../infrastructure/grpc/contacts-grpc.client");
let UserProfileController = class UserProfileController {
    constructor(contactsClient) {
        this.contactsClient = contactsClient;
    }
    async getProfile(userId) {
        const response = await this.contactsClient.getUserProfile({ userId: parseInt(userId) });
        return {
            id: response.userProfile.id,
            username: response.userProfile.username,
            email: response.userProfile.email,
            full_name: response.userProfile.fullName,
            phone: response.userProfile.phone,
        };
    }
    async updateProfile(userId, data) {
        const response = await this.contactsClient.updateUserProfile({
            userId: parseInt(userId),
            fullName: data.full_name,
            phone: data.phone,
            email: data.email,
        });
        return {
            id: response.userProfile.id,
            username: response.userProfile.username,
            email: response.userProfile.email,
            full_name: response.userProfile.fullName,
            phone: response.userProfile.phone,
        };
    }
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "updateProfile", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, common_1.Controller)('user-profile'),
    __metadata("design:paramtypes", [contacts_grpc_client_1.ContactsGrpcClient])
], UserProfileController);
//# sourceMappingURL=user-profile.controller.js.map