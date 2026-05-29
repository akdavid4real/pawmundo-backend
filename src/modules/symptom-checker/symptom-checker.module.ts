import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { EntitlementsModule } from '../entitlements/entitlements.module';

@Module({
  imports: [EntitlementsModule],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
  exports: [SymptomCheckerService],
})
export class SymptomCheckerModule { }
