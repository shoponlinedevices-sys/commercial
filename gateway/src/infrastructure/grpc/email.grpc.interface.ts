import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface IGrpcEmailService {
  sendEmail(input?: any, metadata?: Metadata): Observable<any>;
  sendOrderConfirmationEmail(input?: any, metadata?: Metadata): Observable<any>;
  sendPasswordResetEmail(input?: any, metadata?: Metadata): Observable<any>;
  getEmailHistory(input?: any, metadata?: Metadata): Observable<any>;
  getEmailsByRecipient(input?: any, metadata?: Metadata): Observable<any>;
  getEmailById(input?: any, metadata?: Metadata): Observable<any>;
}
