import { Model } from 'mongoose';
import { Insurance } from './schemas/insurance.schema';
import { InsuranceClaim } from './schemas/insurance-claim.schema';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceClaimDto } from './dto/insurance-claim.dto';
export declare class InsuranceService {
    private insuranceModel;
    private claimModel;
    constructor(insuranceModel: Model<Insurance>, claimModel: Model<InsuranceClaim>);
    create(userId: string, createInsuranceDto: CreateInsuranceDto): Promise<Insurance>;
    findByUser(userId: string, status?: string, petId?: string): Promise<Insurance[]>;
    findById(id: string, userId?: string): Promise<Insurance>;
    update(id: string, userId: string, updateInsuranceDto: UpdateInsuranceDto): Promise<Insurance>;
    updateStatus(id: string, userId: string, status: string): Promise<Insurance>;
    delete(id: string, userId: string): Promise<Insurance>;
    findActivePoliciesByPet(petId: string, userId: string): Promise<Insurance[]>;
    checkCoverage(id: string, userId: string, amount: number): Promise<any>;
    findExpiringPolicies(userId: string, days?: number): Promise<Insurance[]>;
    submitClaim(userId: string, claimDto: InsuranceClaimDto): Promise<InsuranceClaim>;
    getUserClaims(userId: string, status?: string): Promise<InsuranceClaim[]>;
    getClaimById(claimId: string, userId: string): Promise<InsuranceClaim>;
}
