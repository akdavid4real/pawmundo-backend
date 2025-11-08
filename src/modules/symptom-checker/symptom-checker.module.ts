import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';
import { HealthRecord, HealthRecordSchema } from '../health-records/schemas/health-record.schema';
import { Medication, MedicationSchema } from '../medications/schemas/medication.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { SymptomCheck, SymptomCheckSchema } from './schemas/symptom-check.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: HealthRecord.name, schema: HealthRecordSchema },
      { name: Medication.name, schema: MedicationSchema },
      { name: User.name, schema: UserSchema },
      { name: SymptomCheck.name, schema: SymptomCheckSchema },
    ]),
  ],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
  exports: [SymptomCheckerService],
})
export class SymptomCheckerModule {}