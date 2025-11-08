import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private getStatusSuggestions;
    private getMongoErrorMessage;
    private getMongoSuggestions;
    private getGenericSuggestions;
    private isMongoError;
    private extractDuplicateField;
}
