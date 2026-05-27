import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InitializePaystackPaymentDto } from './dto/initialize-paystack-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Initialize Paystack checkout' })
  @Post('paystack/initialize')
  initializePaystack(@Request() req, @Body() dto: InitializePaystackPaymentDto) {
    return this.paymentsService.initialize(req.user, dto);
  }

  @ApiOperation({ summary: 'Verify Paystack checkout' })
  @Get('paystack/verify/:reference')
  verifyPaystack(@Request() req, @Param('reference') reference: string) {
    return this.paymentsService.verify(req.user.id, reference);
  }

  @ApiOperation({ summary: 'Get current subscription entitlement' })
  @Get('subscription/current')
  getCurrentSubscription(@Request() req) {
    return this.paymentsService.getCurrentSubscription(req.user.id);
  }
}
