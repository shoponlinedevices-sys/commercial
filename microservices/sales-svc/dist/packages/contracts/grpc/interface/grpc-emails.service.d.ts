import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ISendEmailRequest, ISendEmailResponse, ISendOrderConfirmationEmailRequest, ISendPasswordResetEmailRequest } from "../../model/email/email.model";
export interface IGrpcEmailService {
    sendEmail(input?: ISendEmailRequest, metadata?: Metadata): Observable<ISendEmailResponse>;
    sendOrderConfirmationEmail(input?: ISendOrderConfirmationEmailRequest, metadata?: Metadata): Observable<ISendEmailResponse>;
    sendPasswordResetEmail(input?: ISendPasswordResetEmailRequest, metadata?: Metadata): Observable<ISendEmailResponse>;
}
