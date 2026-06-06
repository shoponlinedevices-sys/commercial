export interface IGrpcEmailService {
  sendEmail(input?: any, metadata?: any): import('rxjs').Observable<any>;
  sendOrderConfirmationEmail(input?: any, metadata?: any): import('rxjs').Observable<any>;
  sendPasswordResetEmail(input?: any, metadata?: any): import('rxjs').Observable<any>;
}
