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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const firebase_config_1 = __importDefault(require("./firebase.config"));
let NotificationService = class NotificationService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get notificationRepository() {
        return this.dataSource.getRepository(notification_entity_1.NotificationEntity);
    }
    async sendPushNotification(token, title, body, data) {
        try {
            const message = {
                token,
                notification: {
                    title,
                    body,
                },
                data,
            };
            const response = await firebase_config_1.default.messaging().send(message);
            return {
                success: true,
                messageId: response,
            };
        }
        catch (error) {
            console.error('FCM Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async getUserNotifications(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async createNotification(data) {
        const notification = this.notificationRepository.create({
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type || 'system',
            metadata: data.metadata,
            isRead: false,
        });
        return this.notificationRepository.save(notification);
    }
    async markAsRead(id) {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.isRead = true;
        notification.readAt = new Date();
        return this.notificationRepository.save(notification);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], NotificationService);
//# sourceMappingURL=notification.service.js.map