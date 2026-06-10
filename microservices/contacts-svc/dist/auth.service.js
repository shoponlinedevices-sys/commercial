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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_entity_1 = require("./user.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        console.log(`[AuthService] Validating user: ${username}`);
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            console.log(`[AuthService] User not found: ${username}`);
            return null;
        }
        console.log(`[AuthService] User found: ${user.username}, id: ${user.id}`);
        let isValid = await bcrypt.compare(password, user.password);
        console.log(`[AuthService] Bcrypt comparison result: ${isValid}`);
        if (!isValid) {
            const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
            isValid = sha256Hash === user.password;
            console.log(`[AuthService] SHA256 comparison result: ${isValid}`);
            console.log(`[AuthService] SHA256 hash of input: ${sha256Hash}`);
            console.log(`[AuthService] Stored password hash: ${user.password}`);
        }
        if (isValid) {
            const { password, ...result } = user;
            console.log(`[AuthService] Validation successful for user: ${username}`);
            return result;
        }
        console.log(`[AuthService] Validation failed for user: ${username}`);
        return null;
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };
    }
    async register(username, password) {
        const existingUser = await this.usersRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
        });
        await this.usersRepository.save(user);
        const { password: _, ...result } = user;
        return result;
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newPayload = { username: user.username, sub: user.id };
            return {
                access_token: this.jwtService.sign(newPayload),
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async forgotPassword(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const temporaryPassword = this.generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
        return {
            username: user.username,
            email: user.email,
            temporaryPassword,
        };
    }
    generateTemporaryPassword() {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
    async changePassword(userId, currentPassword, newPassword) {
        console.log(`[AuthService] changePassword called for user ID: ${userId}`);
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            console.log(`[AuthService] User not found: ${userId}`);
            throw new common_1.UnauthorizedException('User not found');
        }
        let isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            const sha256Hash = crypto.createHash('sha256').update(currentPassword).digest('hex');
            isValid = sha256Hash === user.password;
        }
        if (!isValid) {
            console.log(`[AuthService] Current password validation failed for user: ${userId}`);
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
        console.log(`[AuthService] Password changed successfully for user: ${userId}`);
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map