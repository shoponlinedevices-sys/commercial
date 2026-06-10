import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(username: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            username: any;
            email: any;
        };
    }>;
    register(username: string, password: string): Promise<{
        id: number;
        username: string;
        email: string;
        fullName: string;
        role: string;
        status: number;
        createdAt: Date;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
    }>;
    forgotPassword(username: string): Promise<{
        username: string;
        email: string;
        temporaryPassword: string;
    }>;
    private generateTemporaryPassword;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
