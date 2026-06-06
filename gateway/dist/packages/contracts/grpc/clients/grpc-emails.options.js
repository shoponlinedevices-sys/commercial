"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcEmailsClientOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
exports.grpcEmailsClientOptions = {
    transport: microservices_1.Transport.GRPC,
    options: {
        package: 'email',
        protoPath: (0, path_1.join)(__dirname, '../../proto/email.proto'),
        loader: {
            longs: Number,
            includeDirs: [(0, path_1.join)(__dirname, '../..', 'proto')],
        },
    },
};
//# sourceMappingURL=grpc-emails.options.js.map