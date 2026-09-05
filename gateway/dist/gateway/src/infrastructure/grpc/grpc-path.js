"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractsProtoPath = contractsProtoPath;
const fs_1 = require("fs");
const path_1 = require("path");
function contractsProtoPath(fileName) {
    const currentWorkspace = (0, path_1.join)(process.cwd(), 'packages', 'contracts', 'proto');
    const parentWorkspace = (0, path_1.join)(process.cwd(), '..', 'packages', 'contracts', 'proto');
    const protoDirectory = (0, fs_1.existsSync)(currentWorkspace) ? currentWorkspace : parentWorkspace;
    return (0, path_1.join)(protoDirectory, fileName);
}
//# sourceMappingURL=grpc-path.js.map