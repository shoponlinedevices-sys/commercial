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
exports.AdsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AdsController = class AdsController {
    findAll() {
        return [
            {
                id: 1,
                title: 'Giảm giá mùa hè',
                subtitle: 'Ưu đãi tới 20% cho thiết bị điện và cơ khí.',
                image: 'https://images.unsplash.com/photo-1493679987494-4b53cd4cc041?auto=format&fit=crop&w=900&q=80',
                backgroundColor: '#ffedd5',
            },
            {
                id: 2,
                title: 'Mua 1 tặng 1',
                subtitle: 'Phụ kiện công nghiệp giá tốt cho khách hàng thân thiết.',
                image: 'https://images.unsplash.com/photo-1517638851339-4ff7b8c0d3b7?auto=format&fit=crop&w=900&q=80',
                backgroundColor: '#dbeafe',
            },
        ];
    }
};
exports.AdsController = AdsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all advertisements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of advertisements retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findAll", null);
exports.AdsController = AdsController = __decorate([
    (0, swagger_1.ApiTags)('Advertisements'),
    (0, common_1.Controller)('ads')
], AdsController);
//# sourceMappingURL=ads.controller.js.map