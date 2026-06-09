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
exports.FeatureSettingsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let FeatureSettingsService = class FeatureSettingsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.salesServiceUrl = 'http://localhost:3001';
    }
    async getAllSettings() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.salesServiceUrl}/feature-settings`));
        return response.data;
    }
    async getEnabledSettings() {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.salesServiceUrl}/feature-settings/enabled`));
        return response.data;
    }
    async getSettingByKey(featureKey) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.salesServiceUrl}/feature-settings/${featureKey}`));
            return response.data;
        }
        catch (error) {
            return null;
        }
    }
    async updateSetting(featureKey, data) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${this.salesServiceUrl}/feature-settings/${featureKey}`, data));
        return response.data;
    }
};
exports.FeatureSettingsService = FeatureSettingsService;
exports.FeatureSettingsService = FeatureSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], FeatureSettingsService);
//# sourceMappingURL=feature-settings.service.js.map