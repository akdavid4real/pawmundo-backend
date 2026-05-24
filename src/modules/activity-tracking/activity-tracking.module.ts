import { Module } from '@nestjs/common';
import { ActivityTrackingController } from './activity-tracking.controller';
import { ActivityTrackingService } from './activity-tracking.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [ActivityTrackingController],
  providers: [ActivityTrackingService],
  exports: [ActivityTrackingService],
})
export class ActivityTrackingModule { }
