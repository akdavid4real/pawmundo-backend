import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export class ValidationUtil {
  static validateObjectId(id: string, fieldName = 'ID'): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
  }

  static validateDate(dateString: string, fieldName = 'date'): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
    return date;
  }

  static validateOptionalDate(dateString?: string, fieldName = 'date'): Date | undefined {
    if (!dateString) return undefined;
    return this.validateDate(dateString, fieldName);
  }

  static validatePort(portString: string | undefined, defaultPort: number): number {
    if (!portString) return defaultPort;
    const port = parseInt(portString, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      return defaultPort;
    }
    return port;
  }
}