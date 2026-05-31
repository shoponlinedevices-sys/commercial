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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feature_settings_entity_1 = require("./feature-settings.entity");
let FeatureSettingsService = class FeatureSettingsService {
    constructor(featureSettingsRepository) {
        this.featureSettingsRepository = featureSettingsRepository;
    }
    async getAllSettings() {
        return this.featureSettingsRepository.find();
    }
    async getSettingByKey(featureKey) {
        return this.featureSettingsRepository.findOne({
            where: { featureKey },
        });
    }
    async getEnabledSettings() {
        return this.featureSettingsRepository.find({
            where: { isEnabled: true },
        });
    }
    async updateSetting(featureKey, updateData) {
        const setting = await this.featureSettingsRepository.findOne({
            where: { featureKey },
        });
        if (!setting) {
            throw new Error(`Feature setting with key ${featureKey} not found`);
        }
        Object.assign(setting, updateData);
        return this.featureSettingsRepository.save(setting);
    }
    async createSetting(data) {
        const setting = this.featureSettingsRepository.create(data);
        return this.featureSettingsRepository.save(setting);
    }
};
exports.FeatureSettingsService = FeatureSettingsService;
exports.FeatureSettingsService = FeatureSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feature_settings_entity_1.FeatureSettingsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeatureSettingsService);
//# sourceMappingURL=feature-settings.service.js.map