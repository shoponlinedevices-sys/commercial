"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const database_module_1 = require("../../infrastructure/database/database.module");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
const identity_service_1 = require("../../domain/identity/identity.service");
const jwt_strategy_1 = require("../../domain/identity/jwt.strategy");
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        providers: [identity_service_1.IdentityService, account_repository_1.AccountRepository, jwt_strategy_1.JwtStrategy],
        exports: [identity_service_1.IdentityService],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map