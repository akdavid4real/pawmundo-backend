import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
export declare class ConsultationsController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    create(req: any, createConsultationDto: CreateConsultationDto): Promise<import("./schemas/consultation.schema").Consultation>;
    findAll(req: any, status?: string): Promise<import("./schemas/consultation.schema").Consultation[]>;
    getUpcoming(req: any): Promise<import("./schemas/consultation.schema").Consultation[]>;
    getVetQueue(): Promise<import("./schemas/consultation.schema").Consultation[]>;
    getVetActive(req: any): Promise<import("./schemas/consultation.schema").Consultation[]>;
    getVetHistory(req: any): Promise<import("./schemas/consultation.schema").Consultation[]>;
    findOneForVet(id: string): Promise<import("./schemas/consultation.schema").Consultation>;
    findOne(id: string, req: any): Promise<import("./schemas/consultation.schema").Consultation>;
    update(id: string, req: any, updateConsultationDto: UpdateConsultationDto): Promise<import("./schemas/consultation.schema").Consultation>;
    cancel(id: string, req: any): Promise<import("./schemas/consultation.schema").Consultation>;
    startConsultation(id: string, req: any, meetingLink: string): Promise<import("./schemas/consultation.schema").Consultation>;
    completeConsultation(id: string, req: any, notes: string, prescription?: string): Promise<import("./schemas/consultation.schema").Consultation>;
    acceptConsultation(id: string, req: any): Promise<import("./schemas/consultation.schema").Consultation>;
    releaseConsultation(id: string, req: any): Promise<import("./schemas/consultation.schema").Consultation>;
}
