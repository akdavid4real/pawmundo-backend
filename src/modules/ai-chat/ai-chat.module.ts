import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';
import { HealthRecord, HealthRecordSchema } from '../health-records/schemas/health-record.schema';
import { Medication, MedicationSchema } from '../medications/schemas/medication.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: HealthRecord.name, schema: HealthRecordSchema },
      { name: Medication.name, schema: MedicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AiChatController],
  providers: [AiChatService, SymptomCheckerService],
})
export class AiChatModule {}