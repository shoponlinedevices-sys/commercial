export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    fullName: string;
    role: string;
    status: number;
    prepaymentEnabled: number;
    cashOnDeliveryEnabled: number;
    paymentSettings: {
        show_only_prepayment?: boolean;
        show_both_options?: boolean;
    } | null;
    createdAt: Date;
}
