"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcProductsClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcProductsClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: ['product'],
        protoPath: [
            (0, path_1.join)(__dirname, '../../proto/product.proto')
        ],
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', 'proto')],
        },
    },
};
//# sourceMappingURL=grpc-products.options.js.map