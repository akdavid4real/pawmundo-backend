import { ForbiddenException } from '@nestjs/common';

export function assertNonProduction(featureName: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new ForbiddenException(`${featureName} is disabled in production`);
  }
}
