export declare class CartLineEntity {
    id: number;
    cartId: number;
    cart?: any;
    productId: number;
    quantity: number;
    unitPrice: number;
    status: number;
    name?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}
