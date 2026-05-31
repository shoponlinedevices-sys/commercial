export interface IGrpcNotificationService {
  sendPushNotificationToUser(input?: any, metadata?: any): import('rxjs').Observable<any>;
}
