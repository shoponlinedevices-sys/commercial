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
        };
    }>;
    register(body: {
        username: string;
        password: string;
    }): Promise<{
        id: number;
        username: string;
        email: string;
        fullName: string;
        role: string;
        status: number;
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
}
