import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateAttendeeDto {
  @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({ description: 'Name of Event', example: 'Party 1999' })
  @IsOptional()
  @IsString()
  eventName?: string;

  @ApiProperty({ description: 'Attendee Image', example: 'Image url' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Name of attendee', example: 'John Cena' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Attendee Email', example: 'johncena@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Attendee Phone Number', example: '09078737867' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Price Category', example: 'VIP' })
  @IsOptional()
  @IsString()
  priceCategory?: string;

  @ApiProperty({ description: 'Attendee Ticket', example: 'johncena@gmail.com' })
  @IsOptional()
  @IsString()
  ticket?: string;

  @ApiProperty({ description: 'Attendee invite link', example: 'uiwfieufwfefo@johncena@gmail.com' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: 'Attendee Special token', example: 'j7848ru48u83qu8uaru7jjg7r' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({ description: 'Attendee Checked in status', example: 'false' })
  @IsOptional()
  @IsBoolean()
  checkedIn?: boolean;

  @ApiProperty({ description: 'Attendee thank you mail status', example: 'false' })
  @IsOptional()
  @IsBoolean()
  thankyouMail?: boolean;
}


export class UpdateAttendeeDto {
  @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
    @IsOptional()
    @IsString()
    eventId?: string;
  
    @ApiProperty({ description: 'Name of Event', example: 'Party 1999' })
    @IsOptional()
    @IsString()
    eventName?: string;
  
    @ApiProperty({ description: 'Attendee Image', example: 'Image url' })
    @IsOptional()
    @IsString()
    image?: string;
  
    @ApiProperty({ description: 'Name of attendee', example: 'John Cena' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiProperty({ description: 'Attendee Email', example: 'johncena@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @ApiProperty({ description: 'Attendee Phone Number', example: '09078737867' })
    @IsOptional()
    @IsString()
    phone?: string;
  
    @ApiProperty({ description: 'Price Category', example: 'VIP' })
    @IsOptional()
    @IsString()
    priceCategory?: string;
  
    @ApiProperty({ description: 'Attendee Ticket', example: 'johncena@gmail.com' })
    @IsOptional()
    @IsString()
    ticket?: string;
  
    @ApiProperty({ description: 'Attendee invite link', example: 'uiwfieufwfefo@johncena@gmail.com' })
    @IsOptional()
    @IsString()
    link?: string;
  
    @ApiProperty({ description: 'Attendee Special token', example: 'j7848ru48u83qu8uaru7jjg7r' })
    @IsOptional()
    @IsString()
    token?: string;
  
    @ApiProperty({ description: 'Attendee Checked in status', example: 'false' })
    @IsOptional()
    @IsBoolean()
    checkedIn?: boolean;
  
    @ApiProperty({ description: 'Attendee thank you mail status', example: 'false' })
    @IsOptional()
    @IsBoolean()
    thankyouMail?: boolean;
  }
  

  export class FilterAttendeeDto {
    @IsOptional()
    @IsString()
    eventId?: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    email?: string;
  
    @IsOptional()
    @IsBoolean()
    checkedIn?: boolean;
  
    @IsOptional()
    @IsBoolean()
    thankyouMail?: boolean;
  }