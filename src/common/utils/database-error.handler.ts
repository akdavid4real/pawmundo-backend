import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

export class DatabaseErrorHandler {
  static handle(error: any, operation = 'Database operation'): never {
    if (error.name === 'CastError') {
      throw new BadRequestException('Invalid ID format');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      throw new BadRequestException(`Validation failed: ${messages.join(', ')}`);
    }
    
    if (error.code === 11000) {
      throw new BadRequestException('Duplicate entry found');
    }
    
    if (error.name === 'DocumentNotFoundError') {
      throw new NotFoundException('Resource not found');
    }
    
    console.error(`${operation} failed:`, error);
    throw new InternalServerErrorException(`${operation} failed`);
  }
}