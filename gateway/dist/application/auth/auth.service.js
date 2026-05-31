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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
let AuthService = class AuthService {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async login(username, password) {
        console.log(`[AuthService] login called - username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        try {
            console.log(`[AuthService] Finding account by username: ${username}`);
            const account = await this.accountRepository.findByUsername(username);
            console.log(`[AuthService] Account found:`, account ? { id: account.id, username: account.username } : 'NOT FOUND');
            if (!account) {
                console.error(`[AuthService] Account not found for username: ${username}`);
                throw new common_1.BadRequestException('Tài khoản không tồn tại');
            }
            const hash = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
            console.log(`[AuthService] Comparing passwords - stored: ${account.password_hash}, provided: ${password}, hash: ${hash}`);
            if (account.password_hash !== hash) {
                console.error(`[AuthService] Password mismatch for username: ${username}`);
                throw new common_1.BadRequestException('Mật khẩu không chính xác');
            }
            const result = {
                id: account.id,
                username: account.username,
                email: account.username,
            };
            console.log(`[AuthService] Login success:`, result);
            return result;
        }
        catch (error) {
            console.error(`[AuthService] Login error caught:`, error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Lỗi khi đăng nhập: ' + error.message);
        }
    }
    async validateCredentials(username, password) {
        const account = await this.accountRepository.findByUsername(username);
        if (!account) {
            return false;
        }
        const hash = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
        return account.password_hash === hash;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_repository_1.AccountRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map