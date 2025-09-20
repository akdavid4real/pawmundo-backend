import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityTrackingController } from './activity-tracking.controller';
import { ActivityTrackingService } from './activity-tracking.service';
import { Activity, ActivitySchema } from './schemas/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])
  ],
  controllers: [ActivityTrackingController],
  providers: [ActivityTrackingService],
  exports: [ActivityTrackingService]
})
export class ActivityTrackingModule {}