import { Body, Controller, Post } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('login')
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
  async refresh(@Body() body: RefreshRequest): Promise<{ access_token: string }> {
    console.log('[AuthController] refresh called');
    return this.identityService.refreshToken(body.refresh_token);
  }

  @Post('register')
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
