"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcContactsClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcContactsClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: ['contacts'],
        protoPath: [
            (0, path_1.join)(__dirname, '../../proto/contacts.proto')
        ],
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', 'proto')],
        },
    },
};
//# sourceMappingURL=grpc-contacts.options.js.map