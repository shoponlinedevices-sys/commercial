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
exports.FeatureSettingsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const feature_settings_service_1 = require("./feature-settings.service");
let FeatureSettingsController = class FeatureSettingsController {
    constructor(featureSettingsService) {
        this.featureSettingsService = featureSettingsService;
    }
    toGrpcFeatureSetting(setting) {
        return {
            id: String(setting.id),
            featureKey: setting.featureKey,
            featureName: setting.featureName,
            isEnabled: Boolean(setting.isEnabled),
            config: setting.config ? JSON.stringify(setting.config) : '',
            startTime: setting.startTime ? new Date(setting.startTime).toISOString() : '',
            endTime: setting.endTime ? new Date(setting.endTime).toISOString() : '',
            createdAt: setting.createdAt ? new Date(setting.createdAt).toISOString() : '',
            updatedAt: setting.updatedAt ? new Date(setting.updatedAt).toISOString() : '',
        };
    }
    async getAllSettings() {
        return this.featureSettingsService.getAllSettings();
    }
    async getEnabledSettings() {
        return this.featureSettingsService.getEnabledSettings();
    }
    async getSettingByKey(featureKey) {
        return this.featureSettingsService.getSettingByKey(featureKey);
    }
    async updateSetting(featureKey, body) {
        const updateData = {
            ...body,
        };
        if (body.startTime) {
            updateData.startTime = new Date(body.startTime);
        }
        if (body.endTime) {
            updateData.endTime = new Date(body.endTime);
        }
        return this.featureSettingsService.updateSetting(featureKey, updateData);
    }
    async getAllSettingsGrpc() {
        const settings = await this.featureSettingsService.getAllSettings();
        return { settings: settings.map((setting) => this.toGrpcFeatureSetting(setting)) };
    }
    async getEnabledSettingsGrpc() {
        const settings = await this.featureSettingsService.getEnabledSettings();
        return { settings: settings.map((setting) => this.toGrpcFeatureSetting(setting)) };
    }
    async getSettingByKeyGrpc(data) {
        const setting = await this.featureSettingsService.getSettingByKey(data.featureKey);
        return { setting: setting ? this.toGrpcFeatureSetting(setting) : undefined };
    }
    async updateSettingGrpc(data) {
        const setting = await this.featureSettingsService.updateSetting(data.featureKey, {
            isEnabled: data.isEnabled,
            config: data.config ? JSON.parse(data.config) : undefined,
            startTime: data.startTime ? new Date(data.startTime) : undefined,
            endTime: data.endTime ? new Date(data.endTime) : undefined,
        });
        return {
            setting: this.toGrpcFeatureSetting(setting),
        };
    }
};
exports.FeatureSettingsController = FeatureSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getAllSettings", null);
__decorate([
    (0, common_1.Get)('enabled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getEnabledSettings", null);
__decorate([
    (0, common_1.Get)(':featureKey'),
    __param(0, (0, common_1.Param)('featureKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getSettingByKey", null);
__decorate([
    (0, common_1.Put)(':featureKey'),
    __param(0, (0, common_1.Param)('featureKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "updateSetting", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FeatureSettingsService', 'GetAllSettings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getAllSettingsGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FeatureSettingsService', 'GetEnabledSettings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getEnabledSettingsGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FeatureSettingsService', 'GetSettingByKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "getSettingByKeyGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FeatureSettingsService', 'UpdateSetting'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeatureSettingsController.prototype, "updateSettingGrpc", null);
exports.FeatureSettingsController = FeatureSettingsController = __decorate([
    (0, common_1.Controller)('feature-settings'),
    __metadata("design:paramtypes", [feature_settings_service_1.FeatureSettingsService])
], FeatureSettingsController);
//# sourceMappingURL=feature-settings.controller.js.map