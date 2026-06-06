import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IdentityService, UserInfo } from '../../domain/identity/identity.service';
import { EmailService } from '../../application/email/email.service';

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  password: string;
};

type RefreshRequest = {
  refresh_token: string;
};

type ForgotPasswordRequest = {
  username: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly emailService: EmailService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ schema: { example: { username: 'user123', password: 'password123' } } })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'jwt_token', refresh_token: 'refresh_token', user: { id: 1, username: 'user123' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    console.log(`[AuthController] login called with body:`, body);
    const { username, password } = body;
    console.log(`[AuthController] Extracted username: ${username}, password length: ${password?.length || 0}`);
    try {
      const result = await this.identityService.login(username, password);
      console.log(`[AuthController] Login success:`, { user: result.user });
      return result;
    } catch (error) {
      console.error(`[AuthController] Login error:`, error);
      throw error;
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { example: { refresh_token: 'refresh_token_string' } } })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() body: RefreshRequest): Promise<{ access_token: string }> {
    console.log('[AuthController] refresh called');
    return this.identityService.refreshToken(body.refresh_token);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ schema: { example: { username: 'newuser', password: 'password123' } } })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: { example: { id: 1, username: 'newuser' } } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() body: RegisterRequest): Promise<UserInfo> {
    console.log(`[AuthController] register called with body:`, body);
    const { username, password } = body;
    console.log(`[AuthController] Extracted username: ${username}, password length: ${password?.length || 0}`);
    try {
      const user = await this.identityService.register(username, password);
      console.log(`[AuthController] Register success:`, user);
      return user;
    } catch (error) {
      console.error(`[AuthController] Register error:`, error);
      throw error;
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password - send temporary password to email' })
  @ApiBody({ schema: { example: { username: 'user123' } } })
  @ApiResponse({ status: 200, description: 'Temporary password sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<{ message: string }> {
    console.log(`[AuthController] forgotPassword called with username:`, body.username);
    const { username } = body;

    try {
      // Call auth-svc to generate temporary password
      const authResponse = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3006'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!authResponse.ok) {
        throw new Error('User not found');
      }

      const authData = await authResponse.json();
      console.log(`[AuthController] Auth service response:`, authData);

      // Send email with temporary password
      if (authData.email) {
        await this.emailService.sendPasswordResetEmail({
          to: authData.email,
          username: username,
          temporaryPassword: authData.temporaryPassword,
        });
      }

      console.log(`[AuthController] Forgot password success for username: ${username}`);
      return { message: 'Mật khẩu tạm thời đã được gửi đến email của bạn' };
    } catch (error) {
      console.error(`[AuthController] Forgot password error:`, error);
      throw new Error('Không thể gửi mật khẩu. Vui lòng kiểm tra tên đăng nhập và thử lại.');
    }
  }
}
