export interface IGrpcEmailService {
  sendEmail(input?: any, metadata?: any): import('rxjs').Observable<any>;
}
