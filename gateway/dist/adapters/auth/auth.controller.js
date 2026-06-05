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
const swagger_1 = require("@nestjs/swagger");
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
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiBody)({ schema: { example: { username: 'user123', password: 'password123' } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful', schema: { example: { access_token: 'jwt_token', refresh_token: 'refresh_token', user: { id: 1, username: 'user123' } } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiBody)({ schema: { example: { refresh_token: 'refresh_token_string' } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'User registration' }),
    (0, swagger_1.ApiBody)({ schema: { example: { username: 'newuser', password: 'password123' } } }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully', schema: { example: { id: 1, username: 'newuser' } } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [identity_service_1.IdentityService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map