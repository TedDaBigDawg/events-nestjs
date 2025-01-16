import { Controller, Post, Body, ValidationPipe, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto, VerifyPaymentDto } from './dto/payment.dto'; // Adjust the DTO location accordingly
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a payment for an event invitation' })
        @ApiResponse({
          status: 201,
          description: 'The payment has been successfully initialized.',
        })
        @ApiResponse({ status: 400, description: 'Bad Request.' })
  async initializePayment(@Body(ValidationPipe) dto: InitializePaymentDto, @Request() req) {
    const user = req.isce_auth;
    try {
      const result = await this.paymentService.initializePayment(dto, user);
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }


  @Post('verify')
  @ApiOperation({ summary: 'Verify a payment for an event invitation' })
        @ApiResponse({
          status: 201,
          description: 'The payment has been successfully verified, attendee created.',
        })
  async verifyPayment(@Body(ValidationPipe) dto: VerifyPaymentDto, @Request() req) {
    const user = req.isce_auth;
    const { reference } = dto;
    try {
      const result = await this.paymentService.verifyPayment(reference);
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
