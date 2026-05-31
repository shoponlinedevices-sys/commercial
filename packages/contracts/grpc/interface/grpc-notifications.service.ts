import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { ISendNotificationRequest } from "../../model/notification/notification.model";


export interface IGrpcNotificationService {
  sendPushNotificationToUser (input?: ISendNotificationRequest, metadata?: Metadata): Observable<any>;
}
