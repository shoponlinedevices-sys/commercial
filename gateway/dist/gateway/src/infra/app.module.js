"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const notification_provider_1 = require("./provider/notification-provider");
const email_provider_1 = require("./provider/email-provider");
const grpc_notifications_options_1 = require("./grpc-notifications.options");
const grpc_emails_options_1 = require("../../../packages/contracts/grpc/clients/grpc-emails.options");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                Object.assign({ name: 'GRPC_NOTIFICATIONS_SERVICE' }, grpc_notifications_options_1.grpcNotificationsClientOptions),
                Object.assign({ name: 'GRPC_EMAILS_SERVICE' }, grpc_emails_options_1.grpcEmailsClientOptions),
            ]),
        ],
        providers: [notification_provider_1.NotificationProvider, email_provider_1.EmailProvider],
        exports: [notification_provider_1.NotificationProvider, email_provider_1.EmailProvider],
    })
], NotificationsModule);
//# sourceMappingURL=app.module.js.map