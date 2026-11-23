import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserProfileService, UserProfile } from '../../application/user-profile/user-profile.service';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly contactsClient: ContactsGrpcClient) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<UserProfile> {
    let response: any;
    try {
      response = await this.contactsClient.getUserProfile({ userId: parseInt(userId) });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && Number(error.code) === 5) {
        throw new NotFoundException('User profile not found');
      }
      throw error;
    }

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
