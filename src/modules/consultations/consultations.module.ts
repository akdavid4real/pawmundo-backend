import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { PetsModule } from '../pets/pets.module';
import { AuthModule } from '../auth/auth.module';
import { ClinicsModule } from '../clinics/clinics.module';

@Module({
  imports: [PetsModule, AuthModule, ClinicsModule],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, Reflector],
  exports: [ConsultationsService],
})
export class ConsultationsModule { }
