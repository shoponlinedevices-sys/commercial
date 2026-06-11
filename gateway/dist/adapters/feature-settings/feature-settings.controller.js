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
const swagger_1 = require("@nestjs/swagger");
const feature_settings_service_1 = require("../../application/feature-settings/feature-settings.service");
let FeatureSettingsController = class FeatureSettingsController {
    constructor(featureSettingsService) {
        this.featureSettingsService = featureSettingsService;
    }
    getAllSettings() {
        return this.featureSettingsService.getAllSettings();
    }
    getEnabledSettings() {
        return this.featureSettingsService.getEnabledSettings();
    }
    getSettingByKey(featureKey) {
        return this.featureSettingsService.getSettingByKey(featureKey);
    }
    updateSetting(featureKey, body) {
        return this.featureSettingsService.updateSetting(featureKey, body);
    }
};
exports.FeatureSettingsController = FeatureSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feature settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feature settings retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeatureSettingsController.prototype, "getAllSettings", null);
__decorate([
    (0, common_1.Get)('enabled'),
    (0, swagger_1.ApiOperation)({ summary: 'Get enabled feature settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of enabled feature settings retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeatureSettingsController.prototype, "getEnabledSettings", null);
__decorate([
    (0, common_1.Get)(':featureKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feature setting by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature setting retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feature setting not found' }),
    __param(0, (0, common_1.Param)('featureKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeatureSettingsController.prototype, "getSettingByKey", null);
__decorate([
    (0, common_1.Put)(':featureKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feature setting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature setting updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feature setting not found' }),
    __param(0, (0, common_1.Param)('featureKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FeatureSettingsController.prototype, "updateSetting", null);
exports.FeatureSettingsController = FeatureSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Feature Settings'),
    (0, common_1.Controller)('feature-settings'),
    __metadata("design:paramtypes", [feature_settings_service_1.FeatureSettingsService])
], FeatureSettingsController);
//# sourceMappingURL=feature-settings.controller.js.map