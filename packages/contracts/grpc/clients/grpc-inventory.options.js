"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcInventoryClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcInventoryClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: ['inventory'],
        protoPath: [
            (0, path_1.join)(__dirname, '../../proto/inventory.proto')
        ],
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', 'proto')],
        },
    },
};
