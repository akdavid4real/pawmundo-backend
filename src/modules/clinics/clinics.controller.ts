import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ClinicsService } from './clinics.service';
import { RegisterClinicDto } from './dto/register-clinic.dto';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';

@ApiTags('clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search approved clinics for signup and appointment booking' })
  search(@Query('q') query?: string) {
    return this.clinicsService.search(query);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a clinic and clinic admin for platform approval' })
  @ApiResponse({ status: 201, description: 'Clinic submitted for approval' })
  registerClinic(@Body() dto: RegisterClinicDto) {
    return this.clinicsService.registerClinic(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user clinic memberships' })
  getMyClinic(@Request() req) {
    return this.clinicsService.getMyClinicContext(req.user.id);
  }

  @Get('admin/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get clinic admin dashboard stats' })
  getAdminDashboard(@Request() req) {
    return this.clinicsService.getAdminDashboard(req.user.id);
  }

  @Get('admin/vets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List vets for the clinic admin clinic' })
  listVets(@Request() req) {
    return this.clinicsService.listClinicVets(req.user.id);
  }

  @Post('admin/vets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or attach a vet to the clinic admin clinic' })
  createVet(@Request() req, @Body() dto: CreateClinicVetDto) {
    return this.clinicsService.createClinicVet(req.user.id, dto);
  }

  @Post('admin/vets/:membershipId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending vet membership' })
  approveVet(@Request() req, @Param('membershipId') membershipId: string) {
    return this.clinicsService.approveVet(req.user.id, membershipId);
  }

  @Post('admin/vets/:membershipId/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a vet membership' })
  suspendVet(@Request() req, @Param('membershipId') membershipId: string) {
    return this.clinicsService.suspendVet(req.user.id, membershipId);
  }

  @Delete('admin/vets/:membershipId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a vet from the clinic' })
  removeVet(@Request() req, @Param('membershipId') membershipId: string) {
    return this.clinicsService.removeVet(req.user.id, membershipId);
  }

  @Post(':clinicId/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request vet membership in an approved clinic' })
  requestMembership(@Request() req, @Param('clinicId') clinicId: string) {
    return this.clinicsService.requestVetMembership(req.user.id, clinicId);
  }

  @Get(':clinicId/vets')
  @ApiOperation({ summary: 'List active vets for an approved clinic' })
  listApprovedClinicVets(@Param('clinicId') clinicId: string) {
    return this.clinicsService.listApprovedClinicVets(clinicId);
  }

}
