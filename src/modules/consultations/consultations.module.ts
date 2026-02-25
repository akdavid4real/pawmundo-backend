import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { DebugController } from './debug.controller';
import { TestController } from './test.controller';
import { ConsultationsGateway } from './consultations.gateway';
import { PetsModule } from '../pets/pets.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PetsModule, AuthModule],
  controllers: [ConsultationsController, DebugController, TestController],
  providers: [ConsultationsService, ConsultationsGateway, Reflector],
  exports: [ConsultationsService, ConsultationsGateway],
})
export class ConsultationsModule { }