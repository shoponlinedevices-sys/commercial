import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IdentityService, UserInfo } from '../../domain/identity/identity.service';

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

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly identityService: IdentityService) {}

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
}
