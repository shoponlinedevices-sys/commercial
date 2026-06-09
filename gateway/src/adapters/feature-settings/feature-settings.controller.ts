import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeatureSettingsService } from '../../application/feature-settings/feature-settings.service';
import { JwtAuthGuard } from '../../domain/identity/jwt-auth.guard';

@ApiTags('Feature Settings')
@ApiBearerAuth()
@Controller('feature-settings')
export class FeatureSettingsController {
  constructor(private readonly featureSettingsService: FeatureSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all feature settings' })
  @ApiResponse({ status: 200, description: 'List of feature settings retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllSettings() {
    return this.featureSettingsService.getAllSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('enabled')
  @ApiOperation({ summary: 'Get enabled feature settings' })
  @ApiResponse({ status: 200, description: 'List of enabled feature settings retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEnabledSettings() {
    return this.featureSettingsService.getEnabledSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':featureKey')
  @ApiOperation({ summary: 'Get feature setting by key' })
  @ApiResponse({ status: 200, description: 'Feature setting retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Feature setting not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSettingByKey(@Param('featureKey') featureKey: string) {
    return this.featureSettingsService.getSettingByKey(featureKey);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':featureKey')
  @ApiOperation({ summary: 'Update feature setting' })
  @ApiResponse({ status: 200, description: 'Feature setting updated successfully' })
  @ApiResponse({ status: 404, description: 'Feature setting not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateSetting(
    @Param('featureKey') featureKey: string,
    @Body() body: {
      isEnabled?: boolean;
      config?: Record<string, any>;
      startTime?: string;
      endTime?: string;
    },
  ) {
    return this.featureSettingsService.updateSetting(featureKey, body);
  }
}
