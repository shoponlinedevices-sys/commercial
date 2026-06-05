"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcNotificationsClientOptions = void 0;
const path_1 = require("path");
exports.grpcNotificationsClientOptions = {
    transport: 1,
    options: {
        package: 'notification',
        protoPath: (0, path_1.join)(__dirname, '../../../packages/contracts/proto/notification.proto'),
        url: 'localhost:50052',
    },
};
//# sourceMappingURL=grpc-notifications.options.js.map