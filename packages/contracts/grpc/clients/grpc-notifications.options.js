"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcNotificationsClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcNotificationsClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: ['notificationToken', 'notification'],
        protoPath: [
            (0, path_1.join)(__dirname, '../../_proto/notification-token.proto'),
            (0, path_1.join)(__dirname, '../../_proto/notification.proto')
        ],
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', '_proto')],
        },
    },
};
//# sourceMappingURL=grpc-notifications.options.js.map