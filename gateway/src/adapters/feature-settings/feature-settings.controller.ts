import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeatureSettingsService } from '../../application/feature-settings/feature-settings.service';

@ApiTags('Feature Settings')
@Controller('feature-settings')
export class FeatureSettingsController {
  constructor(private readonly featureSettingsService: FeatureSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all feature settings' })
  @ApiResponse({ status: 200, description: 'List of feature settings retrieved successfully' })
  getAllSettings() {
    return this.featureSettingsService.getAllSettings();
  }

  @Get('enabled')
  @ApiOperation({ summary: 'Get enabled feature settings' })
  @ApiResponse({ status: 200, description: 'List of enabled feature settings retrieved successfully' })
  getEnabledSettings() {
    return this.featureSettingsService.getEnabledSettings();
  }

  @Get(':featureKey')
  @ApiOperation({ summary: 'Get feature setting by key' })
  @ApiResponse({ status: 200, description: 'Feature setting retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Feature setting not found' })
  getSettingByKey(@Param('featureKey') featureKey: string) {
    return this.featureSettingsService.getSettingByKey(featureKey);
  }

  @Put(':featureKey')
  @ApiOperation({ summary: 'Update feature setting' })
  @ApiResponse({ status: 200, description: 'Feature setting updated successfully' })
  @ApiResponse({ status: 404, description: 'Feature setting not found' })
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
