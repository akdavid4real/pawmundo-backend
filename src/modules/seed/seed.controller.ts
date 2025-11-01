import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @Post()
  async seedDatabase() {
    return this.seedService.seedDatabase();
  }
}


