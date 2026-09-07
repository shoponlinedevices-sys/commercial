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
const email_service_1 = require("../../application/email/email.service");
const common_2 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AuthController = class AuthController {
    constructor(emailService, authClient) {
        this.emailService = emailService;
        this.authClient = authClient;
    }
    onModuleInit() {
        this.authGrpcService = this.authClient.getService('AuthService');
    }
    async login(body) {
        return (0, rxjs_1.firstValueFrom)(this.authGrpcService.login(body));
    }
    async refresh(body) {
        return (0, rxjs_1.firstValueFrom)(this.authGrpcService.refresh(body));
    }
    async register(body) {
        return (0, rxjs_1.firstValueFrom)(this.authGrpcService.register(Object.assign(Object.assign({}, body), { createdBy: body.createdBy || body.username })));
    }
    async forgotPassword(body) {
        try {
            const authData = await (0, rxjs_1.firstValueFrom)(this.authGrpcService.forgotPassword(body));
            if (authData.email) {
                await this.emailService.sendPasswordResetEmail({
                    to: authData.email,
                    username: body.username,
                    temporaryPassword: authData.temporaryPassword,
                });
            }
            return { message: 'Mật khẩu tạm thời đã được gửi đến email của bạn' };
        }
        catch (error) {
            console.error(`[AuthController] Forgot password error:`, error);
            throw new Error('Không thể gửi mật khẩu. Vui lòng kiểm tra tên đăng nhập và thử lại.');
        }
    }
    async changePassword(body) {
        try {
            return (0, rxjs_1.firstValueFrom)(this.authGrpcService.changePassword(body));
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
    __param(1, (0, common_2.Inject)('GRPC_AUTH_SERVICE')),
    __metadata("design:paramtypes", [email_service_1.EmailService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map