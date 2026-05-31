"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const email_entity_1 = require("../../infrastructure/database/entities/email.entity");
let EmailService = class EmailService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.GRPC,
            options: {
                package: 'email',
                protoPath: (0, path_1.join)(__dirname, '../../../../packages/contracts/proto/email.proto'),
                url: 'localhost:50053',
            },
        });
    }
    get emailRepository() {
        return this.dataSource.getRepository(email_entity_1.EmailEntity);
    }
    async sendEmail(data) {
        try {
            return await this.client.send('SendEmail', data).toPromise();
        }
        catch (error) {
            console.error('Error sending email via microservice:', error);
            throw error;
        }
    }
    async getEmailHistory(limit = 50) {
        return this.emailRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getEmailById(id) {
        return this.emailRepository.findOne({ where: { id } });
    }
    async getEmailsByRecipient(to, limit = 50) {
        return this.emailRepository.find({
            where: { to },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EmailService);
//# sourceMappingURL=email.service.js.map