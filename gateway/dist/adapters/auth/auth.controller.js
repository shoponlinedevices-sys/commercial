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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const identity_service_1 = require("../../domain/identity/identity.service");
let AuthController = class AuthController {
    constructor(identityService) {
        this.identityService = identityService;
    }
    async login(body) {
        console.log(`[AuthController] login called with body:`, body);
        const { username, password } = body;
        console.log(`[AuthController] Extracted username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        try {
            const result = await this.identityService.login(username, password);
            console.log(`[AuthController] Login success:`, { user: result.user });
            return result;
        }
        catch (error) {
            console.error(`[AuthController] Login error:`, error);
            throw error;
        }
    }
    async refresh(body) {
        console.log('[AuthController] refresh called');
        return this.identityService.refreshToken(body.refresh_token);
    }
    async register(body) {
        console.log(`[AuthController] register called with body:`, body);
        const { username, password } = body;
        console.log(`[AuthController] Extracted username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        try {
            const user = await this.identityService.register(username, password);
            console.log(`[AuthController] Register success:`, user);
            return user;
        }
        catch (error) {
            console.error(`[AuthController] Register error:`, error);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [identity_service_1.IdentityService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map