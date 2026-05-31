import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserProfileService, UserProfile } from '../../application/user-profile/user-profile.service';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<UserProfile> {
    return await this.userProfileService.getProfile(parseInt(userId));
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    return await this.userProfileService.updateProfile(parseInt(userId), data);
  }
}
