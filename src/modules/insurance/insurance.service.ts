import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InsuranceStatus, ClaimStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceClaimDto } from './dto/insurance-claim.dto';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class InsuranceService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  private mapInsuranceStatus(status: string): InsuranceStatus {
    const statusMap: Record<string, InsuranceStatus> = {
      active: InsuranceStatus.insurance_active,
      insurance_active: InsuranceStatus.insurance_active,
      expired: InsuranceStatus.expired,
      cancelled: InsuranceStatus.insurance_cancelled,
      insurance_cancelled: InsuranceStatus.insurance_cancelled,
      pending: InsuranceStatus.insurance_pending,
      insurance_pending: InsuranceStatus.insurance_pending,
    };

    return statusMap[status] || (status as InsuranceStatus);
  }

  async create(userId: string, createInsuranceDto: CreateInsuranceDto) {
    await this.petsService.findById(createInsuranceDto.petId, userId);

    const startDate = new Date(createInsuranceDto.startDate);
    const endDate = new Date(createInsuranceDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(`Invalid date range: Start date (${createInsuranceDto.startDate}) must be before end date (${createInsuranceDto.endDate})`);
    }

    return this.prisma.insurance.create({
      data: {
        ...createInsuranceDto,
        userId,
        startDate,
        endDate,
      },
    });
  }

  async findByUser(userId: string, status?: string, petId?: string) {
    const where: any = { userId, isActive: true };
    if (status) where.status = this.mapInsuranceStatus(status);
    if (petId) {
      await this.petsService.findById(petId, userId);
      where.petId = petId;
    }

    return this.prisma.insurance.findMany({
      where,
      include: { pet: { select: { name: true, species: true, breed: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId?: string) {
    const insurance = await this.prisma.insurance.findUnique({
      where: { id },
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });

    if (!insurance) {
      throw new NotFoundException(`Insurance policy with ID '${id}' does not exist`);
    }
    if (userId && insurance.userId !== userId) {
      throw new ForbiddenException(`You don't have permission to access insurance policy '${id}'. This policy belongs to another user.`);
    }

    return insurance;
  }

  async update(id: string, userId: string, updateInsuranceDto: UpdateInsuranceDto) {
    await this.findById(id, userId);
    if (updateInsuranceDto.petId) {
      await this.petsService.findById(updateInsuranceDto.petId, userId);
    }

    const updateData: any = { ...updateInsuranceDto };
    if (updateInsuranceDto.startDate) updateData.startDate = new Date(updateInsuranceDto.startDate);
    if (updateInsuranceDto.endDate) updateData.endDate = new Date(updateInsuranceDto.endDate);
    if (updateInsuranceDto.status) updateData.status = this.mapInsuranceStatus(updateInsuranceDto.status);

    return this.prisma.insurance.update({
      where: { id },
      data: updateData,
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });
  }

  async updateStatus(id: string, userId: string, status: string) {
    await this.findById(id, userId);
    const mappedStatus = this.mapInsuranceStatus(status);

    const validStatuses: InsuranceStatus[] = [
      InsuranceStatus.insurance_active,
      InsuranceStatus.expired,
      InsuranceStatus.insurance_cancelled,
      InsuranceStatus.insurance_pending,
    ];
    if (!validStatuses.includes(mappedStatus)) {
      throw new BadRequestException(`Invalid insurance status '${status}'. Valid options are: ${validStatuses.join(', ')}`);
    }

    return this.prisma.insurance.update({
      where: { id },
      data: { status: mappedStatus },
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.insurance.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findActivePoliciesByPet(petId: string, userId: string) {
    const now = new Date();
    return this.prisma.insurance.findMany({
      where: {
        petId, userId,
        status: InsuranceStatus.insurance_active,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });
  }

  async checkCoverage(id: string, userId: string, amount: number) {
    const insurance = await this.findById(id, userId);

    if (insurance.status !== InsuranceStatus.insurance_active) {
      return { covered: false, reason: 'Policy is not active', coverageAmount: 0 };
    }

    const currentDate = new Date();
    if (currentDate < insurance.startDate || currentDate > insurance.endDate) {
      return { covered: false, reason: 'Policy is not in effect', coverageAmount: 0 };
    }

    const maxCoverage = Math.max(0, insurance.coverageLimit - insurance.deductible);
    const coverageAmount = Math.min(amount - insurance.deductible, maxCoverage);

    return {
      covered: coverageAmount > 0,
      coverageAmount: Math.max(0, coverageAmount),
      deductible: insurance.deductible,
      remainingLimit: insurance.coverageLimit,
      outOfPocket: Math.max(0, amount - coverageAmount),
    };
  }

  async findExpiringPolicies(userId: string, days: number = 30) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.insurance.findMany({
      where: {
        userId,
        status: InsuranceStatus.insurance_active,
        isActive: true,
        endDate: { lte: futureDate, gte: now },
      },
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });
  }

  async submitClaim(userId: string, claimDto: InsuranceClaimDto) {
    const insurance = await this.findById(claimDto.insuranceId, userId);

    if (insurance.status !== InsuranceStatus.insurance_active) {
      throw new BadRequestException(`Cannot submit claim for insurance policy '${claimDto.insuranceId}' because it has status '${insurance.status}'. Only active policies can accept claims.`);
    }

    return this.prisma.insuranceClaim.create({
      data: {
        ...claimDto,
        userId,
        serviceDate: new Date(claimDto.serviceDate),
      },
    });
  }

  async getUserClaims(userId: string, status?: string) {
    const where: any = { userId, isActive: true };
    if (status) where.status = status as ClaimStatus;

    return this.prisma.insuranceClaim.findMany({
      where,
      include: {
        insurance: { select: { provider: true, policyNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClaimById(claimId: string, userId: string) {
    const claim = await this.prisma.insuranceClaim.findUnique({
      where: { id: claimId },
      include: {
        insurance: { select: { provider: true, policyNumber: true, petId: true } },
      },
    });

    if (!claim) {
      throw new NotFoundException(`Insurance claim with ID '${claimId}' does not exist`);
    }
    if (claim.userId !== userId) {
      throw new ForbiddenException(`You don't have permission to access insurance claim '${claimId}'. This claim belongs to another user.`);
    }

    return claim;
  }
}
