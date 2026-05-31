import { OrderLineEntity } from './order-line.entity';
export declare class OrderEntity {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    orderLines?: OrderLineEntity[];
    shippingAddress?: string;
    fcmToken?: string;
    createdAt: Date;
    updatedAt: Date;
}
