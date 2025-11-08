import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceClaimDto } from './dto/insurance-claim.dto';
export declare class InsuranceController {
    private readonly insuranceService;
    constructor(insuranceService: InsuranceService);
    create(req: any, createInsuranceDto: CreateInsuranceDto): Promise<import("./schemas/insurance.schema").Insurance>;
    findAll(req: any, status?: string, petId?: string): Promise<import("./schemas/insurance.schema").Insurance[]>;
    findOne(id: string, req: any): Promise<import("./schemas/insurance.schema").Insurance>;
    update(id: string, updateInsuranceDto: UpdateInsuranceDto, req: any): Promise<import("./schemas/insurance.schema").Insurance>;
    updateStatus(id: string, status: string, req: any): Promise<import("./schemas/insurance.schema").Insurance>;
    remove(id: string, req: any): Promise<import("./schemas/insurance.schema").Insurance>;
    findActivePoliciesByPet(petId: string, req: any): Promise<import("./schemas/insurance.schema").Insurance[]>;
    checkCoverage(id: string, amount: number, req: any): Promise<any>;
    submitClaim(req: any, claimDto: InsuranceClaimDto): Promise<import("./schemas/insurance-claim.schema").InsuranceClaim>;
    getClaims(req: any, status?: string): Promise<import("./schemas/insurance-claim.schema").InsuranceClaim[]>;
    getClaim(claimId: string, req: any): Promise<import("./schemas/insurance-claim.schema").InsuranceClaim>;
}
