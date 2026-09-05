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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const common_1 = require("@nestjs/common");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
let UserProfileService = class UserProfileService {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async getProfile(userId) {
        const account = await this.accountRepository.findById(userId);
        if (!account) {
            throw new common_1.BadRequestException('User not found');
        }
        return {
            id: account.id,
            username: account.username,
            email: account.email,
            full_name: account.full_name,
            phone: account.phone,
            role: account.role,
        };
    }
    async updateProfile(userId, data) {
        const account = await this.accountRepository.findById(userId);
        if (!account) {
            throw new common_1.BadRequestException('User not found');
        }
        const updateData = {};
        if (data.full_name !== undefined)
            updateData.full_name = data.full_name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        const updatedAccount = await this.accountRepository.update(userId, updateData);
        return {
            id: updatedAccount.id,
            username: updatedAccount.username,
            email: updatedAccount.email,
            full_name: updatedAccount.full_name,
            phone: updatedAccount.phone,
            role: updatedAccount.role,
        };
    }
};
exports.UserProfileService = UserProfileService;
exports.UserProfileService = UserProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_repository_1.AccountRepository])
], UserProfileService);
//# sourceMappingURL=user-profile.service.js.map