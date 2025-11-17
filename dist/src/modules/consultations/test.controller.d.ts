import { ConsultationsService } from './consultations.service';
export declare class TestController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    testConsultation(id: string): Promise<any>;
}
