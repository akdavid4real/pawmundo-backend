import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AuthModule } from '../auth/auth.module';
import { PetsModule } from '../pets/pets.module';
import { ClinicsModule } from '../clinics/clinics.module';

@Module({
  imports: [AuthModule, PetsModule, ClinicsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule { }
