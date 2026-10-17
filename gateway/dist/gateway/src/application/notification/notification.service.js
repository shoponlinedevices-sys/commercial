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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("../../infrastructure/database/entities/notification.entity");
let NotificationService = class NotificationService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get notificationRepository() {
        return this.dataSource.getRepository(notification_entity_1.NotificationEntity);
    }
    async getUserNotifications(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async markAsRead(id) {
        try {
            const notificationId = typeof id === 'string' ? parseInt(id, 10) : id;
            console.log('Marking notification as read with ID:', notificationId, 'Type:', typeof notificationId);
            const result = await this.notificationRepository
                .createQueryBuilder()
                .update(notification_entity_1.NotificationEntity)
                .set({
                isRead: true,
                readAt: () => 'NOW()'
            })
                .where('id = :id', { id: notificationId })
                .execute();
            console.log('Update result:', result);
            if (result.affected === 0) {
                console.log('No notification was updated with ID:', notificationId);
                throw new Error('Notification not found or not updated');
            }
            const updatedNotification = await this.notificationRepository.findOne({
                where: { id: notificationId }
            });
            console.log('Updated notification:', updatedNotification);
            return updatedNotification;
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], NotificationService);
//# sourceMappingURL=notification.service.js.map