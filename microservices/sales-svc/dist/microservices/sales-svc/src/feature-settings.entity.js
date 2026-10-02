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
exports.FeatureSettingsEntity = void 0;
const typeorm_1 = require("typeorm");
let FeatureSettingsEntity = class FeatureSettingsEntity {
};
exports.FeatureSettingsEntity = FeatureSettingsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', {
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], FeatureSettingsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_feature_key'),
    (0, typeorm_1.Column)({
        name: 'feature_key',
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], FeatureSettingsEntity.prototype, "featureKey", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'feature_name',
        length: 255,
    }),
    __metadata("design:type", String)
], FeatureSettingsEntity.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_enabled',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], FeatureSettingsEntity.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'config',
        type: 'json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], FeatureSettingsEntity.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'start_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], FeatureSettingsEntity.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'end_time',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], FeatureSettingsEntity.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FeatureSettingsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FeatureSettingsEntity.prototype, "updatedAt", void 0);
exports.FeatureSettingsEntity = FeatureSettingsEntity = __decorate([
    (0, typeorm_1.Entity)('feature_settings')
], FeatureSettingsEntity);
//# sourceMappingURL=feature-settings.entity.js.map