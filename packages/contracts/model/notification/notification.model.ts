import { Id } from "../common/common.model";

export interface ISendNotificationRequest {
    token: string;
    title: string;
    body: string;
}