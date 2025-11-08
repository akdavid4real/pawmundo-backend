export declare enum SeverityLevel {
    MILD = 1,
    MODERATE = 2,
    SEVERE = 3,
    CRITICAL = 4
}
export declare class SymptomCheckDto {
    petId: string;
    symptoms: string[];
    duration: string;
    severity: SeverityLevel;
    additionalInfo?: string;
}
