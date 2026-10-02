export interface ISendEmailRequest {
    to: string;
    subject: string;
    body: string;
    template?: string;
    templateData?: Record<string, string>;
}
export interface ISendOrderConfirmationEmailRequest {
    to: string;
    orderId: string;
    totalAmount: number;
    orderLines: IOrderLine[];
    shippingAddress?: string;
    customerName?: string;
}
export interface ISendPasswordResetEmailRequest {
    to: string;
    username: string;
    temporaryPassword: string;
}
export interface IOrderLine {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productImage?: string;
}
export interface ISendEmailResponse {
    success: boolean;
    messageId?: string;
    emailId?: number;
    error?: string;
}
