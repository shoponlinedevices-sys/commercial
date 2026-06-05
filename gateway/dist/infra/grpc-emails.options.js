"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcEmailsClientOptions = void 0;
const path_1 = require("path");
exports.grpcEmailsClientOptions = {
    transport: 1,
    options: {
        package: 'email',
        protoPath: (0, path_1.join)(__dirname, '../../../packages/contracts/proto/email.proto'),
        url: 'localhost:3010',
    },
};
//# sourceMappingURL=grpc-emails.options.js.map