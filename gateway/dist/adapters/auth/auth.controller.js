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
const email_service_1 = require("../../application/email/email.service");
let AuthController = class AuthController {
    constructor(identityService, emailService) {
        this.identityService = identityService;
        this.emailService = emailService;
    }
    async login(body) {
        console.log(`[AuthController] login called with body:`, body);
        const { username, password } = body;
        console.log(`[AuthController] Extracted username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        try {
            const authResponse = await fetch(`${process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!authResponse.ok) {
                throw new Error('Authentication failed');
            }
            const result = await authResponse.json();
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
        const authResponse = await fetch(`${process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004'}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: body.refresh_token }),
        });
        if (!authResponse.ok) {
            throw new Error('Token refresh failed');
        }
        return await authResponse.json();
    }
    async register(body) {
        console.log(`[AuthController] register called with body:`, body);
        const { username, password } = body;
        console.log(`[AuthController] Extracted username: ${username}, password length: ${(password === null || password === void 0 ? void 0 : password.length) || 0}`);
        try {
            const authResponse = await fetch(`${process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!authResponse.ok) {
                throw new Error('Registration failed');
            }
            const user = await authResponse.json();
            console.log(`[AuthController] Register success:`, user);
            return user;
        }
        catch (error) {
            console.error(`[AuthController] Register error:`, error);
            throw error;
        }
    }
    async forgotPassword(body) {
        console.log(`[AuthController] forgotPassword called with username:`, body.username);
        const { username } = body;
        try {
            const authResponse = await fetch(`${process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004'}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            if (!authResponse.ok) {
                throw new Error('User not found');
            }
            const authData = await authResponse.json();
            console.log(`[AuthController] Auth service response:`, authData);
            if (authData.email) {
                await this.emailService.sendPasswordResetEmail({
                    to: authData.email,
                    username: username,
                    temporaryPassword: authData.temporaryPassword,
                });
            }
            console.log(`[AuthController] Forgot password success for username: ${username}`);
            return { message: 'Mật khẩu tạm thời đã được gửi đến email của bạn' };
        }
        catch (error) {
            console.error(`[AuthController] Forgot password error:`, error);
            throw new Error('Không thể gửi mật khẩu. Vui lòng kiểm tra tên đăng nhập và thử lại.');
        }
    }
    async changePassword(body) {
        console.log(`[AuthController] changePassword called for user ID:`, body.userId);
        const { userId, currentPassword, newPassword } = body;
        try {
            const authResponse = await fetch(`${process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004'}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, currentPassword, newPassword }),
            });
            if (!authResponse.ok) {
                const errorData = await authResponse.json();
                throw new Error(errorData.message || 'Failed to change password');
            }
            const authData = await authResponse.json();
            console.log(`[AuthController] Password changed successfully for user ID: ${userId}`);
            return { message: 'Mật khẩu đã được thay đổi thành công' };
        }
        catch (error) {
            console.error(`[AuthController] Change password error:`, error);
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
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Forgot password - send temporary password to email' }),
    (0, swagger_1.ApiBody)({ schema: { example: { username: 'user123' } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Temporary password sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiBody)({ schema: { example: { userId: 1, currentPassword: 'oldpassword', newPassword: 'newpassword' } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current password is incorrect' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [identity_service_1.IdentityService,
        email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map