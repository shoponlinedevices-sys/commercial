import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('auth/register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('auth/refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() body: { username: string }) {
    return this.authService.forgotPassword(body.username);
  }

  @Post('auth/change-password')
  async changePassword(@Body() body: { userId: number; currentPassword: string; newPassword: string }) {
    return this.authService.changePassword(body.userId, body.currentPassword, body.newPassword);
  }
}
