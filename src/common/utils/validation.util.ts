import { BadRequestException } from '@nestjs/common';

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ValidationUtil {
  static validateId(id: string, fieldName = 'ID'): void {
    if (!id || !UUID_REGEX.test(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: '${id}' is not a valid UUID`);
    }
  }

  /** @deprecated Use validateId instead */
  static validateObjectId(id: string, fieldName = 'ID'): void {
    this.validateId(id, fieldName);
  }

  static validateDate(dateString: string, fieldName = 'date'): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid ${fieldName} format: '${dateString}' is not a valid date. Use format: YYYY-MM-DD or ISO 8601`);
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