"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: ['orders', 'feature_settings'],
            protoPath: [
                (0, path_1.join)(__dirname, '../../../packages/contracts/proto/orders.proto'),
                (0, path_1.join)(__dirname, '../../../packages/contracts/proto/feature-settings.proto'),
            ],
            url: `0.0.0.0:${process.env.GRPC_PORT || 50055}`,
            loader: {
                longs: Number,
                includeDirs: [(0, path_1.join)(__dirname, '../../../packages/contracts/proto')],
            },
        },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3001);
    console.log(`Sales-svc Service gRPC running on port ${process.env.GRPC_PORT || 50055}`);
}
bootstrap();
//# sourceMappingURL=main.js.map