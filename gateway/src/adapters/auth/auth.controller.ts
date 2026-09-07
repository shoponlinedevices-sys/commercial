import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService } from '../../application/email/email.service';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface AuthGrpcService {
  login(data: LoginRequest): any;
  refresh(data: RefreshRequest): any;
  register(data: RegisterRequest): any;
  forgotPassword(data: ForgotPasswordRequest): any;
  changePassword(data: ChangePasswordRequest): any;
}

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  password: string;
  createdBy?: string;
};

type RefreshRequest = {
  refresh_token: string;
};

type ForgotPasswordRequest = {
  username: string;
};

type ChangePasswordRequest = {
  userId: number;
  currentPassword: string;
  newPassword: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController implements OnModuleInit {
  private authGrpcService!: AuthGrpcService;

  constructor(
    private readonly emailService: EmailService,
    @Inject('GRPC_AUTH_SERVICE') private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService = this.authClient.getService<AuthGrpcService>('AuthService');
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ schema: { example: { username: 'user123', password: 'password123' } } })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'jwt_token', refresh_token: 'refresh_token', user: { id: 1, username: 'user123' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(this.authGrpcService.login(body));
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { example: { refresh_token: 'refresh_token_string' } } })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() body: RefreshRequest): Promise<{ access_token: string }> {
    return firstValueFrom(this.authGrpcService.refresh(body));
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ schema: { example: { username: 'newuser', password: 'password123' } } })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: { example: { id: 1, username: 'newuser' } } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() body: RegisterRequest): Promise<LoginResponse['user']> {
    return firstValueFrom(this.authGrpcService.register({ ...body, createdBy: body.createdBy || body.username }));
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password - send temporary password to email' })
  @ApiBody({ schema: { example: { username: 'user123' } } })
  @ApiResponse({ status: 200, description: 'Temporary password sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const authData: any = await firstValueFrom(this.authGrpcService.forgotPassword(body));

      // Send email with temporary password
      if (authData.email) {
        await this.emailService.sendPasswordResetEmail({
          to: authData.email,
          username: body.username,
          temporaryPassword: authData.temporaryPassword,
        });
      }

      return { message: 'Mật khẩu tạm thời đã được gửi đến email của bạn' };
    } catch (error) {
      console.error(`[AuthController] Forgot password error:`, error);
      throw new Error('Không thể gửi mật khẩu. Vui lòng kiểm tra tên đăng nhập và thử lại.');
    }
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ schema: { example: { userId: 1, currentPassword: 'oldpassword', newPassword: 'newpassword' } } })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(@Body() body: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      return firstValueFrom(this.authGrpcService.changePassword(body));
    } catch (error) {
      console.error(`[AuthController] Change password error:`, error);
      throw error;
    }
  }
}
