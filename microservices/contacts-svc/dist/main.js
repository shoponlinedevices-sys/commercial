"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    const microservice = app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'contacts',
            protoPath: (0, path_1.join)(__dirname, '../../../packages/contracts/proto/contacts.proto'),
            url: `0.0.0.0:${process.env.GRPC_PORT || 50054}`,
        },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3004);
}
bootstrap();
//# sourceMappingURL=main.js.map