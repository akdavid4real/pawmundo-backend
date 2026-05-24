import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { assertNonProduction } from '../../common/utils/runtime-safety';

@ApiTags('seed')
@ApiBearerAuth()
@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @Roles('admin')
  @Post()
  async seedDatabase() {
    assertNonProduction('Seed endpoint');
    return this.seedService.seedDatabase();
  }
}


