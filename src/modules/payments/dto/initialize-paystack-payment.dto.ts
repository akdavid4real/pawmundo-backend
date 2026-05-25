import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class InitializePaystackPaymentDto {
  @IsIn(['plus', 'pro'])
  plan: 'plus' | 'pro';

  @IsIn(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsIn(['NGN', 'USD'])
  currency: 'NGN' | 'USD';

  @IsString()
  @IsNotEmpty()
  callbackUrl: string;
}
