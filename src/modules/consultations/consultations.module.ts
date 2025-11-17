import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { DebugController } from './debug.controller';
import { TestController } from './test.controller';
import { ConsultationsGateway } from './consultations.gateway';
import { Consultation, ConsultationSchema } from './schemas/consultation.schema';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consultation.name, schema: ConsultationSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    PetsModule,
  ],
  controllers: [ConsultationsController, DebugController, TestController],
  providers: [ConsultationsService, ConsultationsGateway, Reflector],
  exports: [ConsultationsService, ConsultationsGateway],
})
export class ConsultationsModule {}