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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = require("nodemailer");
const email_entity_1 = require("./email.entity");
let EmailService = class EmailService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    get emailRepository() {
        return this.dataSource.getRepository(email_entity_1.EmailEntity);
    }
    async sendEmail(to, subject, body, template, templateData) {
        const email = this.emailRepository.create({
            to,
            subject,
            body,
            template,
            templateData,
            status: 'pending',
        });
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'shoponlinedevices@gmail.com',
                to,
                subject,
                html: body,
            };
            const info = await this.transporter.sendMail(mailOptions);
            email.status = 'sent';
            email.messageId = info.messageId;
            email.sentAt = new Date();
            await this.emailRepository.save(email);
            return {
                success: true,
                messageId: info.messageId,
                emailId: email.id,
            };
        }
        catch (error) {
            email.status = 'failed';
            email.error = error instanceof Error ? error.message : 'Unknown error';
            await this.emailRepository.save(email);
            console.error('Email sending error:', error);
            return {
                success: false,
                error: email.error,
                emailId: email.id,
            };
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
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], EmailService);
//# sourceMappingURL=email.service.js.map