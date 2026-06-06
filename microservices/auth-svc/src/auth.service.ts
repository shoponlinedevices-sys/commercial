import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(`[AuthService] Validating user: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      console.log(`[AuthService] User not found: ${username}`);
      return null;
    }

    console.log(`[AuthService] User found: ${user.username}, id: ${user.id}`);

    // Try bcrypt first (for new users)
    let isValid = await bcrypt.compare(password, user.password);
    console.log(`[AuthService] Bcrypt comparison result: ${isValid}`);

    // If bcrypt fails, try SHA256 (for legacy users from tbl_account)
    if (!isValid) {
      const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
      isValid = sha256Hash === user.password;
      console.log(`[AuthService] SHA256 comparison result: ${isValid}`);
      console.log(`[AuthService] SHA256 hash of input: ${sha256Hash}`);
      console.log(`[AuthService] Stored password hash: ${user.password}`);
    }

    if (isValid) {
      const { password, ...result } = user;
      console.log(`[AuthService] Validation successful for user: ${username}`);
      return result;
    }
    console.log(`[AuthService] Validation failed for user: ${username}`);
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(username: string, password: string) {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    const { password: _, ...result } = user;
    return result;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newPayload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return {
      username: user.username,
      email: user.email,
      temporaryPassword,
    };
  }

  private generateTemporaryPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    console.log(`[AuthService] changePassword called for user ID: ${userId}`);
    
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.log(`[AuthService] User not found: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    let isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const sha256Hash = crypto.createHash('sha256').update(currentPassword).digest('hex');
      isValid = sha256Hash === user.password;
    }

    if (!isValid) {
      console.log(`[AuthService] Current password validation failed for user: ${userId}`);
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password with bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    console.log(`[AuthService] Password changed successfully for user: ${userId}`);
    return { message: 'Password changed successfully' };
  }
}
