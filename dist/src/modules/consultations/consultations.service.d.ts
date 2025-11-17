import { Model } from 'mongoose';
import { Consultation, ConsultationDocument } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PetsService } from '../pets/pets.service';
export declare class ConsultationsService {
    private consultationModel;
    private petsService;
    constructor(consultationModel: Model<ConsultationDocument>, petsService: PetsService);
    create(userId: string, createConsultationDto: CreateConsultationDto): Promise<Consultation>;
    findAll(userId: string): Promise<Consultation[]>;
    findByStatus(userId: string, status: string): Promise<Consultation[]>;
    findById(id: string, userId: string): Promise<Consultation>;
    update(id: string, userId: string, updateConsultationDto: UpdateConsultationDto): Promise<Consultation>;
    cancel(id: string, userId: string): Promise<Consultation>;
    startConsultation(id: string, userId: string, meetingLink: string): Promise<Consultation>;
    completeConsultation(id: string, userId: string, notes: string, prescription?: string): Promise<Consultation>;
    getUpcoming(userId: string): Promise<Consultation[]>;
    getVetQueue(): Promise<Consultation[]>;
    getVetActive(vetId: string): Promise<Consultation[]>;
    getVetHistory(vetId: string): Promise<Consultation[]>;
    acceptConsultation(consultationId: string, vetId: string): Promise<Consultation>;
    releaseConsultation(consultationId: string, vetId: string): Promise<Consultation>;
    findByIdForVet(id: string): Promise<Consultation>;
    getConsultationDebugInfo(id: string): Promise<any>;
}
