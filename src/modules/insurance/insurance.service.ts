import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Insurance } from './schemas/insurance.schema';
import { InsuranceClaim } from './schemas/insurance-claim.schema';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceClaimDto } from './dto/insurance-claim.dto';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectModel(Insurance.name) private insuranceModel: Model<Insurance>,
    @InjectModel(InsuranceClaim.name) private claimModel: Model<InsuranceClaim>
  ) {}

  async create(userId: string, createInsuranceDto: CreateInsuranceDto): Promise<Insurance> {
    const insuranceData = {
      ...createInsuranceDto,
      userId,
      startDate: new Date(createInsuranceDto.startDate),
      endDate: new Date(createInsuranceDto.endDate),
    };

    // Validate dates
    if (insuranceData.startDate >= insuranceData.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const insurance = new this.insuranceModel(insuranceData);
    return insurance.save();
  }

  async findByUser(userId: string, status?: string, petId?: string): Promise<Insurance[]> {
    const filter: any = { userId, isActive: true };
    if (status) filter.status = status;
    if (petId) filter.petId = petId;
    
    return this.insuranceModel
      .find(filter)
      .populate('petId', 'name species breed')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string, userId?: string): Promise<Insurance> {
    const insurance = await this.insuranceModel
      .findById(id)
      .populate('petId', 'name species breed')
      .exec();
    
    if (!insurance) {
      throw new NotFoundException('Insurance policy not found');
    }
    
    if (userId && insurance.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return insurance;
  }

  async update(id: string, userId: string, updateInsuranceDto: UpdateInsuranceDto): Promise<Insurance> {
    await this.findById(id, userId);
    
    const updateData: any = { ...updateInsuranceDto };
    
    // Handle date updates
    if (updateInsuranceDto.startDate) {
      updateData.startDate = new Date(updateInsuranceDto.startDate);
    }
    if (updateInsuranceDto.endDate) {
      updateData.endDate = new Date(updateInsuranceDto.endDate);
    }

    return this.insuranceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('petId', 'name species breed')
      .exec();
  }

  async updateStatus(id: string, userId: string, status: string): Promise<Insurance> {
    await this.findById(id, userId);
    
    const validStatuses = ['active', 'expired', 'cancelled', 'pending'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    return this.insuranceModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('petId', 'name species breed')
      .exec();
  }

  async delete(id: string, userId: string): Promise<Insurance> {
    await this.findById(id, userId);
    
    return this.insuranceModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async findActivePoliciesByPet(petId: string, userId: string): Promise<Insurance[]> {
    return this.insuranceModel
      .find({
        petId,
        userId,
        status: 'active',
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      })
      .populate('petId', 'name species breed')
      .exec();
  }

  async checkCoverage(id: string, userId: string, amount: number): Promise<any> {
    const insurance = await this.findById(id, userId);
    
    if (insurance.status !== 'active') {
      return {
        covered: false,
        reason: 'Policy is not active',
        coverageAmount: 0
      };
    }

    const currentDate = new Date();
    if (currentDate < insurance.startDate || currentDate > insurance.endDate) {
      return {
        covered: false,
        reason: 'Policy is not in effect',
        coverageAmount: 0
      };
    }

    const maxCoverage = Math.max(0, insurance.coverageLimit - insurance.deductible);
    const coverageAmount = Math.min(amount - insurance.deductible, maxCoverage);
    
    return {
      covered: coverageAmount > 0,
      coverageAmount: Math.max(0, coverageAmount),
      deductible: insurance.deductible,
      remainingLimit: insurance.coverageLimit,
      outOfPocket: Math.max(0, amount - coverageAmount)
    };
  }

  async findExpiringPolicies(userId: string, days: number = 30): Promise<Insurance[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.insuranceModel
      .find({
        userId,
        status: 'active',
        isActive: true,
        endDate: { $lte: futureDate, $gte: new Date() }
      })
      .populate('petId', 'name species breed')
      .exec();
  }

  async submitClaim(userId: string, claimDto: InsuranceClaimDto): Promise<InsuranceClaim> {
    const insurance = await this.findById(claimDto.insuranceId, userId);
    
    if (insurance.status !== 'active') {
      throw new BadRequestException('Cannot submit claim for inactive policy');
    }

    const claimData = {
      ...claimDto,
      userId,
      serviceDate: new Date(claimDto.serviceDate)
    };

    const claim = new this.claimModel(claimData);
    return claim.save();
  }

  async getUserClaims(userId: string, status?: string): Promise<InsuranceClaim[]> {
    const filter: any = { userId, isActive: true };
    if (status) filter.status = status;
    
    return this.claimModel
      .find(filter)
      .populate('insuranceId', 'provider policyNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getClaimById(claimId: string, userId: string): Promise<InsuranceClaim> {
    const claim = await this.claimModel
      .findById(claimId)
      .populate('insuranceId', 'provider policyNumber petId')
      .exec();
    
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }
    
    if (claim.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return claim;
  }
}