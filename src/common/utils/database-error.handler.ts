import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class DatabaseErrorHandler {
  static handle(error: any, operation = 'Database operation'): never {
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      const fields = error.meta?.target || [];
      throw new BadRequestException(`Duplicate entry: A record with this ${Array.isArray(fields) ? fields.join(', ') : fields} already exists`);
    }

    // Prisma record not found
    if (error.code === 'P2025') {
      throw new NotFoundException(`Database resource not found: The requested record does not exist`);
    }

    // Prisma foreign key constraint violation
    if (error.code === 'P2003') {
      throw new BadRequestException(`Invalid reference: The referenced record does not exist`);
    }

    // Prisma validation error
    if (error.name === 'PrismaClientValidationError') {
      throw new BadRequestException(`Database validation failed: ${error.message}`);
    }

    // Invalid UUID format
    if (error.message?.includes('invalid input syntax for type uuid')) {
      throw new BadRequestException(`Invalid ID format: The provided ID is not a valid UUID`);
    }

    // NestJS HTTP exceptions - rethrow as-is
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    console.error(`${operation} failed:`, error);
    throw new InternalServerErrorException(`${operation} failed due to an unexpected database error. Please try again or contact support if the issue persists`);
  }
}