import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlatformAdminService } from './platform-admin.service';
import { ListPlatformClinicsDto } from './dto/list-platform-clinics.dto';
import { ClinicStatusActionDto } from './dto/clinic-status-action.dto';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('platform-admin')
export class PlatformAdminController {
  constructor(private readonly platformAdminService: PlatformAdminService) {}

  @Get('clinics/stats')
  @ApiOperation({ summary: 'Get platform clinic management stats' })
  getClinicStats() {
    return this.platformAdminService.getClinicStats();
  }

  @Get('clinics')
  @ApiOperation({ summary: 'List and filter all clinics for platform admins' })
  listClinics(@Query() query: ListPlatformClinicsDto) {
    return this.platformAdminService.listClinics(query);
  }

  @Get('clinics/pending')
  @ApiOperation({ summary: 'List clinics pending platform approval' })
  listPendingClinics() {
    return this.platformAdminService.listPendingClinics();
  }

  @Get('clinics/:clinicId')
  @ApiOperation({ summary: 'Get clinic details for platform admins' })
  getClinic(@Param('clinicId') clinicId: string) {
    return this.platformAdminService.getClinic(clinicId);
  }

  @Get('clinics/:clinicId/memberships')
  @ApiOperation({ summary: 'List clinic memberships for platform admins' })
  listClinicMemberships(@Param('clinicId') clinicId: string) {
    return this.platformAdminService.listClinicMemberships(clinicId);
  }

  @Post('clinics/:clinicId/approve')
  @ApiOperation({ summary: 'Approve a clinic and activate its clinic admin membership' })
  approveClinic(@Request() req, @Param('clinicId') clinicId: string) {
    return this.platformAdminService.approveClinic(clinicId, req.user.id);
  }

  @Post('clinics/:clinicId/reject')
  @ApiOperation({ summary: 'Reject a clinic verification request' })
  rejectClinic(@Param('clinicId') clinicId: string, @Body() dto: ClinicStatusActionDto) {
    return this.platformAdminService.rejectClinic(clinicId, dto.reason);
  }

  @Post('clinics/:clinicId/suspend')
  @ApiOperation({ summary: 'Suspend an approved clinic from platform access' })
  suspendClinic(@Param('clinicId') clinicId: string, @Body() dto: ClinicStatusActionDto) {
    return this.platformAdminService.suspendClinic(clinicId, dto.reason);
  }

  @Post('clinics/:clinicId/reactivate')
  @ApiOperation({ summary: 'Reactivate a suspended approved clinic' })
  reactivateClinic(@Param('clinicId') clinicId: string) {
    return this.platformAdminService.reactivateClinic(clinicId);
  }
}
