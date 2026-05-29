import { Module } from '@nestjs/common';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { SymptomCheckerModule } from '../symptom-checker/symptom-checker.module';
import { PetsModule } from '../pets/pets.module';
import { HealthRecordsModule } from '../health-records/health-records.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { EntitlementsModule } from '../entitlements/entitlements.module';

@Module({
  imports: [SymptomCheckerModule, PetsModule, HealthRecordsModule, AppointmentsModule, EntitlementsModule],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule { }
