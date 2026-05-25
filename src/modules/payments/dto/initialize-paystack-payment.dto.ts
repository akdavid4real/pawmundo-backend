import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class InitializePaystackPaymentDto {
  @IsIn(['plus', 'pro'])
  plan: 'plus' | 'pro';

  @IsIn(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsIn(['NGN', 'USD'])
  currency: 'NGN' | 'USD';

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false, require_protocol: true })
  callbackUrl: string;
}
