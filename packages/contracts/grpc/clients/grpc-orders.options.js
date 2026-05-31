"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcOrdersClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcOrdersClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: ['orders'],
        protoPath: [
            (0, path_1.join)(__dirname, '../../proto/orders.proto')
        ],
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', 'proto')],
        },
    },
};
//# sourceMappingURL=grpc-orders.options.js.map