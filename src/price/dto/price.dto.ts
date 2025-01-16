import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreatePriceDto {
  @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
  @IsOptional()
  @IsString()
  event_id?: string;

  @ApiProperty({ description: 'Name of price', example: 'VIP' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Price description', example: 'Event price for VIP attendees' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Price Amount', example: 50000 })
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty({ description: 'Number of attendees', example: 74 })
  @IsOptional()
  @IsInt()
  attendees?: number;

  @IsOptional()
  @IsString()
  withChips?: string; // default is "without"
}

export class UpdatePriceDto {
    @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
    @IsOptional()
    @IsString()
    event_id?: string;
  
    @ApiProperty({ description: 'Name of price', example: 'VIP' })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiProperty({ description: 'Price description', example: 'Event price for VIP attendees' })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({ description: 'Price Amount', example: 50000 })
    @IsOptional()
    @IsInt()
    amount?: number;
  
    @ApiProperty({ description: 'Number of attendees', example: 74 })
    @IsOptional()
    @IsInt()
    attendees?: number;
  
    @IsOptional()
    @IsString()
    withChips?: string; // This field is optional as well
  }
  
