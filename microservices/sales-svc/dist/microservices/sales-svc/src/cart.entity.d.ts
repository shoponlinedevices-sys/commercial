import { CartLineEntity } from './cart-line.entity';
export declare class CartEntity {
    id: number;
    userId: number;
    totalPrice: string;
    status: number;
    cartLines?: CartLineEntity[];
    createdAt: Date;
    updatedAt: Date;
}
