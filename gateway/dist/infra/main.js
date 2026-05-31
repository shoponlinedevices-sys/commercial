"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const bodyParser = __importStar(require("body-parser"));
const app_module_1 = require("./app.module");
const grpc_notifications_options_1 = require("./grpc-notifications.options");
const jwt_auth_guard_1 = require("../domain/identity/jwt-auth.guard");
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.NotificationsModule);
    app.use(bodyParser.json({ limit: '1000mb' }));
    app.use(bodyParser.urlencoded({
        limit: '1000mb',
        extended: true,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    const hostGrpcPort = (_a = process.env.HOST_GRPC_PORT) !== null && _a !== void 0 ? _a : '50051';
    const hostHttpPort = (_b = process.env.HOST_HTTP_PORT) !== null && _b !== void 0 ? _b : '10051';
    const grpcOptions = grpc_notifications_options_1.grpcNotificationsClientOptions.options;
    const hostGrpcOption = {
        transport: microservices_1.Transport.GRPC,
        options: Object.assign(Object.assign({}, grpcOptions), { url: `0.0.0.0:${hostGrpcPort}` }),
    };
    app.connectMicroservice(hostGrpcOption);
    await app.startAllMicroservices();
    app.enableCors();
    await app.listen(hostHttpPort);
    console.log(`HTTP running on : ${hostHttpPort}`);
    console.log(`gRPC running on : ${hostGrpcPort}`);
}
bootstrap();
//# sourceMappingURL=main.js.map