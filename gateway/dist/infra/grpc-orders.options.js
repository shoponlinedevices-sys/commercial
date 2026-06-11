"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcOrdersClientOptions = void 0;
const path_1 = require("path");
const microservices_1 = require("@nestjs/microservices");
exports.grpcOrdersClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: 'orders',
        protoPath: (0, path_1.join)(__dirname, '../../../packages/contracts/proto/orders.proto'),
        url: 'localhost:50053',
    },
};
//# sourceMappingURL=grpc-orders.options.js.map