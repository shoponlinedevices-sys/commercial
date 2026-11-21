import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
            status: any;
        };
    }>;
    register(body: {
        username: string;
        password: string;
        createdBy?: string;
    }): Promise<{
        id: number;
        username: string;
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
    }>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
    }>;
    forgotPassword(body: {
        username: string;
    }): Promise<{
        username: string;
        email: string;
        temporaryPassword: string;
    }>;
    changePassword(body: {
        userId: number;
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    loginGrpc(data: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
            status: any;
        };
    }>;
    registerGrpc(data: {
        username: string;
        password: string;
        createdBy?: string;
    }): Promise<{
        id: number;
        username: string;
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
    }>;
    refreshGrpc(data: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
    }>;
    forgotPasswordGrpc(data: {
        username: string;
    }): Promise<{
        username: string;
        email: string;
        temporaryPassword: string;
    }>;
    changePasswordGrpc(data: {
        userId: number;
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
