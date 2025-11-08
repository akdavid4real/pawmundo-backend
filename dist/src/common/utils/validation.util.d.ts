export declare class ValidationUtil {
    static validateObjectId(id: string, fieldName?: string): void;
    static validateDate(dateString: string, fieldName?: string): Date;
    static validateOptionalDate(dateString?: string, fieldName?: string): Date | undefined;
    static validatePort(portString: string | undefined, defaultPort: number): number;
}
