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
exports.FeatureSettingsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let FeatureSettingsService = class FeatureSettingsService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.featureSettingsGrpc = this.client.getService('FeatureSettingsService');
    }
    async getAllSettings() {
        const response = await (0, rxjs_1.firstValueFrom)(this.featureSettingsGrpc.getAllSettings({}));
        return response.settings || [];
    }
    async getEnabledSettings() {
        const response = await (0, rxjs_1.firstValueFrom)(this.featureSettingsGrpc.getEnabledSettings({}));
        return response.settings || [];
    }
    async getSettingByKey(featureKey) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.featureSettingsGrpc.getSettingByKey({ featureKey }));
            return response.setting || null;
        }
        catch (error) {
            return null;
        }
    }
    async updateSetting(featureKey, data) {
        const response = await (0, rxjs_1.firstValueFrom)(this.featureSettingsGrpc.updateSetting({
            featureKey,
            isEnabled: data.isEnabled,
            config: data.config ? JSON.stringify(data.config) : undefined,
            startTime: data.startTime,
            endTime: data.endTime,
        }));
        return response.setting;
    }
};
exports.FeatureSettingsService = FeatureSettingsService;
exports.FeatureSettingsService = FeatureSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('GRPC_FEATURE_SETTINGS_SERVICE')),
    __metadata("design:paramtypes", [Object])
], FeatureSettingsService);
//# sourceMappingURL=feature-settings.service.js.map