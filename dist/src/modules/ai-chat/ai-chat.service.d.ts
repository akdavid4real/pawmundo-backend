import { Model } from 'mongoose';
import { AiChatDto } from './dto/ai-chat.dto';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { PetsService } from '../pets/pets.service';
import { HealthRecordsService } from '../health-records/health-records.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { User } from '../auth/schemas/user.schema';
export declare class AiChatService {
    private symptomCheckerService;
    private petsService;
    private healthRecordsService;
    private appointmentsService;
    private userModel;
    constructor(symptomCheckerService: SymptomCheckerService, petsService: PetsService, healthRecordsService: HealthRecordsService, appointmentsService: AppointmentsService, userModel: Model<User>);
    chat(userId: string, aiChatDto: AiChatDto): Promise<{
        response: any;
        typewriter: boolean;
        timestamp: string;
    }>;
    getTypingIndicator(): Promise<{
        isTyping: boolean;
        message: string;
        timestamp: string;
    }>;
    getOfflineResponse(userId: string, message: string): Promise<{
        response: string;
        typewriter: boolean;
        timestamp: string;
    }>;
}
