import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsDate, IsEmail } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  priceId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  reference: string;
}

export class InitializePaymentDto {
  @ApiProperty({ description: 'Price Id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  priceId: string;

  @ApiProperty({ description: 'Invitation Id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  invitationId: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Payment reference', example: 'yuefiuq3ryf74827e298e32e3' })
  @IsNotEmpty()
  @IsString()
  reference: string;
}

export class UpdatePaymentDto {
    @IsOptional()
    @IsString()
    status?: string;
  
    @IsOptional()
    @IsString()
    reference?: string;
  }


  export class PaymentResponseDto {
    @IsUUID()
    id: string;
  
    @IsUUID()
    eventId: string;
  
    @IsUUID()
    userId: string;
  
    @IsUUID()
    priceId: string;
  
    @IsString()
    status: string;
  
    @IsString()
    reference: string;
  
    @IsDate()
    createdAt: Date;
  
    @IsDate()
    updatedAt: Date;
  
    @IsOptional()
    @IsDate()
    deletedAt?: Date;
  }