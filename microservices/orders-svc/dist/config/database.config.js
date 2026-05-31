"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '06081990',
    database: process.env.DB_DATABASE || 'commercial',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
}));
//# sourceMappingURL=database.config.js.map