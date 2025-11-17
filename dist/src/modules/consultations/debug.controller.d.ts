import { ConsultationsService } from './consultations.service';
export declare class DebugController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    getDebugInfo(id: string): Promise<any>;
}
