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
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
let IdentityService = class IdentityService {
    constructor(accountRepository, jwtService) {
        this.accountRepository = accountRepository;
        this.jwtService = jwtService;
    }
    async login(username, password) {
        console.log(`[IdentityService] login called - username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        if (!username || !password) {
            throw new common_1.BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
        }
        const account = await this.accountRepository.findByUsername(username);
        if (!account) {
            console.error(`[IdentityService] Account not found for username: ${username}`);
            throw new common_1.UnauthorizedException('Tài khoản không tồn tại');
        }
        const passwordHash = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
        if (account.password_hash !== passwordHash) {
            console.error(`[IdentityService] Password mismatch for username: ${username}`);
            throw new common_1.UnauthorizedException('Mật khẩu không chính xác');
        }
        const user = {
            id: account.id,
            username: account.username,
            email: account.username,
        };
        const access_token = this.createAccessToken({ sub: user.id, username: user.username });
        const refresh_token = this.createRefreshToken({ sub: user.id, username: user.username });
        console.log('[IdentityService] Login success, tokens generated for user:', user.username);
        return {
            access_token,
            refresh_token,
            user,
        };
    }
    async register(username, password) {
        console.log(`[IdentityService] register called - username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        if (!username || !password) {
            throw new common_1.BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
        }
        const existingAccount = await this.accountRepository.findByUsername(username);
        if (existingAccount) {
            console.error(`[IdentityService] Username already exists: ${username}`);
            throw new common_1.BadRequestException('Tên đăng nhập đã tồn tại');
        }
        const account = await this.accountRepository.createAccount(username, password);
        console.log(`[IdentityService] Account created successfully:`, { id: account.id, username: account.username });
        const user = {
            id: account.id,
            username: account.username,
            email: account.username,
        };
        return user;
    }
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
        }
        try {
            const payload = this.jwtService.verify(refreshToken);
            const account = await this.accountRepository.findByUsername(payload.username);
            if (!account) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
            }
            const access_token = this.createAccessToken({ sub: account.id, username: account.username });
            return { access_token };
        }
        catch (error) {
            console.error('[IdentityService] Refresh token validation failed:', error);
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
        }
    }
    createAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.jwtSecret(),
            expiresIn: '15m',
        });
    }
    createRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.jwtSecret(),
            expiresIn: '7d',
        });
    }
    jwtSecret() {
        return process.env.JWT_SECRET || 'default_jwt_secret_change_me';
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_repository_1.AccountRepository,
        jwt_1.JwtService])
], IdentityService);
//# sourceMappingURL=identity.service.js.map