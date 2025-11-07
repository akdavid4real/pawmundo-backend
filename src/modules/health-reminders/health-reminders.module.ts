import { Module } from '@nestjs/common';
import { HealthRemindersController } from './health-reminders.controller';
import { HealthRemindersService } from './health-reminders.service';
import { HealthRecordsModule } from '../health-records/health-records.module';
import { PetsModule } from '../pets/pets.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [HealthRecordsModule, PetsModule, NotificationsModule],
  controllers: [HealthRemindersController],
  providers: [HealthRemindersService],
  exports: [HealthRemindersService],
})
export class HealthRemindersModule {}