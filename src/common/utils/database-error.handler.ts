import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

export class DatabaseErrorHandler {
  static handle(error: any, operation = 'Database operation'): never {
    if (error.name === 'CastError') {
      throw new BadRequestException(`Invalid ID format: '${error.value}' is not a valid MongoDB ObjectId`);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      throw new BadRequestException(`Database validation failed: ${messages.join(', ')}`);
    }
    
    if (error.code === 11000) {
      throw new BadRequestException(`Duplicate entry: A record with this ${Object.keys(error.keyPattern || {}).join(', ')} already exists`);
    }
    
    if (error.name === 'DocumentNotFoundError') {
      throw new NotFoundException(`Database resource not found: The requested document does not exist`);
    }
    
    console.error(`${operation} failed:`, error);
    throw new InternalServerErrorException(`${operation} failed due to an unexpected database error. Please try again or contact support if the issue persists`);
  }
}