import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceClaimDto } from './dto/insurance-claim.dto';

@ApiTags('insurance')
@ApiBearerAuth()
@Controller('insurance')
@UseGuards(JwtAuthGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @ApiOperation({ summary: 'Create new insurance policy' })
  @ApiResponse({ status: 201, description: 'Insurance policy created successfully' })
  @Post()
  async create(@Request() req, @Body() createInsuranceDto: CreateInsuranceDto) {
    return this.insuranceService.create(req.user._id, createInsuranceDto);
  }

  @ApiOperation({ summary: 'Get all user insurance policies' })
  @ApiResponse({ status: 200, description: 'List of user insurance policies' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'petId', required: false, description: 'Filter by pet ID' })
  @Get()
  async findAll(@Request() req, @Query('status') status?: string, @Query('petId') petId?: string) {
    return this.insuranceService.findByUser(req.user._id, status, petId);
  }

  @ApiOperation({ summary: 'Get insurance policy by ID' })
  @ApiResponse({ status: 200, description: 'Insurance policy details' })
  @ApiResponse({ status: 404, description: 'Insurance policy not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.insuranceService.findById(id, req.user._id);
  }

  @ApiOperation({ summary: 'Update insurance policy' })
  @ApiResponse({ status: 200, description: 'Insurance policy updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInsuranceDto: UpdateInsuranceDto, @Request() req) {
    return this.insuranceService.update(id, req.user._id, updateInsuranceDto);
  }

  @ApiOperation({ summary: 'Update insurance policy status' })
  @ApiResponse({ status: 200, description: 'Insurance status updated' })
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.insuranceService.updateStatus(id, req.user._id, status);
  }

  @ApiOperation({ summary: 'Delete insurance policy' })
  @ApiResponse({ status: 200, description: 'Insurance policy deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.insuranceService.delete(id, req.user._id);
  }

  @ApiOperation({ summary: 'Get active policies by pet' })
  @ApiResponse({ status: 200, description: 'Active insurance policies for pet' })
  @Get('pet/:petId/active')
  async findActivePoliciesByPet(@Param('petId') petId: string, @Request() req) {
    return this.insuranceService.findActivePoliciesByPet(petId, req.user._id);
  }

  @ApiOperation({ summary: 'Check policy coverage for amount' })
  @ApiResponse({ status: 200, description: 'Coverage check result' })
  @Get(':id/coverage/:amount')
  async checkCoverage(@Param('id') id: string, @Param('amount') amount: number, @Request() req) {
    return this.insuranceService.checkCoverage(id, req.user._id, amount);
  }

  @ApiOperation({ summary: 'Submit insurance claim' })
  @ApiResponse({ status: 201, description: 'Claim submitted successfully' })
  @Post('claims')
  async submitClaim(@Request() req, @Body() claimDto: InsuranceClaimDto) {
    return this.insuranceService.submitClaim(req.user._id, claimDto);
  }

  @ApiOperation({ summary: 'Get user claims' })
  @ApiResponse({ status: 200, description: 'List of user claims' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @Get('claims')
  async getClaims(@Request() req, @Query('status') status?: string) {
    return this.insuranceService.getUserClaims(req.user._id, status);
  }

  @ApiOperation({ summary: 'Get claim by ID' })
  @ApiResponse({ status: 200, description: 'Claim details' })
  @Get('claims/:claimId')
  async getClaim(@Param('claimId') claimId: string, @Request() req) {
    return this.insuranceService.getClaimById(claimId, req.user._id);
  }
}