import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IGrpcEmailService } from '../../../packages/contracts/grpc/interface/grpc-emails.service';
export declare class OrdersEmailProvider implements OnModuleInit {
    private readonly client;
    private emailService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    sendOrderConfirmationEmail(data: Parameters<IGrpcEmailService['sendOrderConfirmationEmail']>[0]): Promise<import("../../../packages/contracts/model/email/email.model").ISendEmailResponse>;
}
