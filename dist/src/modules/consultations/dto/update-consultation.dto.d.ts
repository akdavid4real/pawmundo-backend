import { CreateConsultationDto } from './create-consultation.dto';
declare const UpdateConsultationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateConsultationDto>>;
export declare class UpdateConsultationDto extends UpdateConsultationDto_base {
    status?: string;
    notes?: string;
    prescription?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
    meetingLink?: string;
    meetingId?: string;
    paymentStatus?: string;
}
export {};
