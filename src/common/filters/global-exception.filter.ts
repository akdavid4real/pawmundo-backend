import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error occurred';
    let details: any = null;
    let suggestions: string[] = [];

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const response = exceptionResponse as any;
        message = response.message || response.error || exception.message;
        details = response.details || null;
      }

      // Add specific suggestions based on status code
      suggestions = this.getStatusSuggestions(status, message);
    } else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.getMongoErrorMessage(exception);
      suggestions = this.getMongoSuggestions(exception);
    } else if (exception instanceof Error) {
      message = exception.message;
      suggestions = this.getGenericSuggestions(exception.message);
    }

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error'
    );

    // Prepare detailed error response
    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(details && { details }),
      ...(suggestions.length > 0 && { suggestions }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    response.status(status).json(errorResponse);
  }

  private getStatusSuggestions(status: number, message: string): string[] {
    const suggestions: string[] = [];

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        suggestions.push('Check your request data format and required fields');
        if (message.includes('validation')) {
          suggestions.push('Ensure all required fields are provided with correct data types');
        }
        break;
      case HttpStatus.UNAUTHORIZED:
        suggestions.push('Make sure you are logged in and have a valid JWT token');
        suggestions.push('Check if your token has expired and refresh if needed');
        break;
      case HttpStatus.FORBIDDEN:
        suggestions.push('You do not have permission to access this resource');
        suggestions.push('Ensure you are accessing your own data or have proper authorization');
        break;
      case HttpStatus.NOT_FOUND:
        suggestions.push('Check if the resource ID is correct');
        suggestions.push('Verify the resource exists and you have access to it');
        break;
      case HttpStatus.CONFLICT:
        suggestions.push('The resource already exists or conflicts with existing data');
        suggestions.push('Try using different values or update the existing resource');
        break;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        suggestions.push('Check your input data for validation errors');
        suggestions.push('Ensure all required fields meet the specified criteria');
        break;
    }

    return suggestions;
  }

  private getMongoErrorMessage(error: MongoError): string {
    switch (error.code) {
      case 11000:
        const field = this.extractDuplicateField(error.message);
        return `Duplicate value detected for ${field}. This value already exists in the database.`;
      case 121:
        return 'Document validation failed. Please check your data format.';
      default:
        return `Database operation failed: ${error.message}`;
    }
  }

  private getMongoSuggestions(error: MongoError): string[] {
    const suggestions: string[] = [];

    switch (error.code) {
      case 11000:
        suggestions.push('Use a different value for the duplicate field');
        suggestions.push('Check if you are trying to create a resource that already exists');
        break;
      case 121:
        suggestions.push('Ensure all required fields are provided');
        suggestions.push('Check that field values match the expected format');
        break;
      default:
        suggestions.push('Check your database connection');
        suggestions.push('Verify your data format matches the schema requirements');
    }

    return suggestions;
  }

  private getGenericSuggestions(message: string): string[] {
    const suggestions: string[] = [];

    if (message.includes('timeout')) {
      suggestions.push('The request timed out. Try again later.');
      suggestions.push('Check your internet connection.');
    } else if (message.includes('connection')) {
      suggestions.push('Database connection issue. Please try again.');
      suggestions.push('Contact support if the problem persists.');
    } else if (message.includes('validation')) {
      suggestions.push('Check your input data for validation errors.');
      suggestions.push('Ensure all required fields are provided correctly.');
    }

    return suggestions;
  }

  private extractDuplicateField(message: string): string {
    const match = message.match(/index: (\w+)_/);
    return match ? match[1] : 'unknown field';
  }
}