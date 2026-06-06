import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ISendEmailRequest, ISendEmailResponse } from "../../model/email/email.model";

export interface IGrpcEmailService {
  sendEmail(input?: ISendEmailRequest, metadata?: Metadata): Observable<ISendEmailResponse>;
}
