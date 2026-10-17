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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
let NotificationsController = class NotificationsController {
    findAll() {
        return [
            {
                id: 1,
                title: 'Đơn hàng mới',
                message: 'Bạn có 2 đơn hàng chờ xử lý.',
                unread: true,
            },
            {
                id: 2,
                title: 'Khuyến mãi thêm',
                message: 'Giảm 5% cho đơn hàng từ 5 sản phẩm.',
                unread: false,
            },
        ];
    }
    findByUser(userId) {
        return [
            {
                id: 1,
                userId: parseInt(userId),
                title: 'Đơn hàng mới',
                message: 'Bạn có 2 đơn hàng chờ xử lý.',
                type: 'order',
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                userId: parseInt(userId),
                title: 'Khuyến mãi thêm',
                message: 'Giảm 5% cho đơn hàng từ 5 sản phẩm.',
                type: 'promotion',
                isRead: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findByUser", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications')
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map