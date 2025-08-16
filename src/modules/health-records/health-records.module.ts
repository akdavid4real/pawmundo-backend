import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthRecordsController } from './health-records.controller';
import { HealthRecordsService } from './health-records.service';
import { HealthRecord, HealthRecordSchema } from './schemas/health-record.schema';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthRecord.name, schema: HealthRecordSchema }]),
    PetsModule,
  ],
  controllers: [HealthRecordsController],
  providers: [HealthRecordsService],
  exports: [HealthRecordsService],
})
export class HealthRecordsModule {}