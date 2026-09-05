import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserProfileService, UserProfile } from '../../application/user-profile/user-profile.service';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly contactsClient: ContactsGrpcClient) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<UserProfile> {
    const response: any = await this.contactsClient.getUserProfile({ userId: parseInt(userId) });
    return {
      id: response.userProfile.id,
      username: response.userProfile.username,
      email: response.userProfile.email,
      full_name: response.userProfile.fullName,
      phone: response.userProfile.phone,
    };
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const response: any = await this.contactsClient.updateUserProfile({
      userId: parseInt(userId),
      fullName: data.full_name,
      phone: data.phone,
      email: data.email,
    });
    return {
      id: response.userProfile.id,
      username: response.userProfile.username,
      email: response.userProfile.email,
      full_name: response.userProfile.fullName,
      phone: response.userProfile.phone,
    };
  }
}
