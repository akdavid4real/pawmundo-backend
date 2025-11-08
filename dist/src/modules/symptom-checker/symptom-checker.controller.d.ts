import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckDto } from './dto/symptom-check.dto';
declare class ChatMessageDto {
    message: string;
}
export declare class SymptomCheckerController {
    private readonly symptomCheckerService;
    constructor(symptomCheckerService: SymptomCheckerService);
    checkSymptoms(req: any, symptomCheckDto: SymptomCheckDto): Promise<{
        petInfo: {
            name: string;
            species: string;
            breed: string;
            age: number;
        };
        analysis: any;
        timestamp: Date;
    }>;
    chatWithAI(req: any, chatDto: ChatMessageDto): Promise<{
        response: string;
    }>;
    getHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/symptom-check.schema").SymptomCheck, {}, {}> & import("./schemas/symptom-check.schema").SymptomCheck & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
export {};
