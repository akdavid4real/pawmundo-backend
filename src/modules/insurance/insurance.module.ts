import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { Insurance, InsuranceSchema } from './schemas/insurance.schema';
import { InsuranceClaim, InsuranceClaimSchema } from './schemas/insurance-claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema },
      { name: InsuranceClaim.name, schema: InsuranceClaimSchema }
    ]),
  ],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}