import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface IGrpcEmailService {
  sendEmail(input?: any, metadata?: Metadata): Observable<any>;
  sendOrderConfirmationEmail(input?: any, metadata?: Metadata): Observable<any>;
  sendPasswordResetEmail(input?: any, metadata?: Metadata): Observable<any>;
}
