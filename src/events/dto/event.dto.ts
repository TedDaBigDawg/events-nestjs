import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsUUID, ValidateNested, IsDateString, IsArray, IsNotEmpty } from 'class-validator';
import { CreateGalleryDto } from 'src/gallery/dto/gallery.dto';
import { CreatePriceDto } from 'src/price/dto/price.dto';

// export class CreateEventDto {
//   @IsString()
//   title: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsString()
//   location?: string;

//   @IsOptional()
//   @IsString()
//   image?: string;

//   @IsOptional()
//   @IsString()
//   clean_name?: string; // This should be unique, but it's okay to validate at the service level

//   @IsDateString()
//   start_date: Date;

//   @IsOptional()
//   @IsDateString()
//   end_date?: Date;

//   @IsUUID() // Assuming user_id is a UUID, adjust if needed
//   user_id: string;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreatePriceDto)
//   prices?: CreatePriceDto[]; 


//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateGalleryDto)
//   gallery?: CreateGalleryDto[]; 

//   // Additional fields can be added for prices, gallery, attendees, etc.
// }


export class CreateEventDto {
  @ApiProperty({ description: 'Name of event', example: 'Party 2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Event description', example: 'Party 2025 event' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event Location', example: '123 Sunny Drive' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Name of town event will hold', example: 'Festac' })
  @IsString()
  @IsNotEmpty()
  town: string;

  @ApiProperty({ description: 'Image for event', example: 'Image url' })
  @IsOptional()
  @IsString()
  image?: string;


  @ApiProperty({ description: 'Start date for the event', example: 'mm/dd/yyyy' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'End date for the event', example: 'mm/dd/yyyy' })
  @IsOptional()
  endDate?: Date;

  // @IsNotEmpty()
  // @IsUUID()
  // userId: string;

  @ApiProperty({ description: 'Event prices', example: '[{ "title": "VIP", "amount": 50 }, { "title": "REGULAR", "amount": 20 }]' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices?: CreatePriceDto[];

  @ApiProperty({ description: 'Event images', example: '[{ "name": "VIP PIC", "image": "img url" }, { "name": "REGULAR PIC", "image": "img url" }]' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryDto)
  galleries?: CreateGalleryDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateAttendeeDto)
  // attendees?: AttendeeDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateInvitationDto)
  // invitations?: InvitationDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateChatroomDto)
  // chat_room?: ChatRoomDto[];
}


export class UpdateEventDto {
  @ApiProperty({ description: 'Update name of event', example: 'Party 2025' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Event description', example: 'Party 2025 event' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event Location', example: '123 Sunny Drive' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Name of town event will hold', example: 'Festac' })
  @IsOptional()
  @IsString()
  town?: string;

  @ApiProperty({ description: 'Image for event', example: 'Image url' })
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  cleanName?: string;

  @ApiProperty({ description: 'Start date for the event', example: 'mm/dd/yyyy' })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date for the event', example: 'mm/dd/yyyy' })
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Event prices', example: '[{ "title": "VIP", "amount": 50 }, { "title": "REGULAR", "amount": 20}]' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices?: CreatePriceDto[];

  @ApiProperty({ description: 'Event images', example: '[{ "name": "VIP PIC", "image": "img url" }, { "name": "REGULAR PIC", "image": "img url" }]' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryDto)
  galleries?: CreateGalleryDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateAttendeeDto)
  // attendees?: AttendeeDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateInvitationDto)
  // invitations?: InvitationDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateChatroomDto)
  // chat_room?: ChatRoomDto[];
}



export class EventResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsString()
  town: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  cleanName?: string;

  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsArray()
  prices?: CreatePriceDto[];

  @IsOptional()
  @IsArray()
  galleries?: CreateGalleryDto[];

  // @IsOptional()
  // @IsArray()
  // attendees?: AttendeeDto[];

  // @IsOptional()
  // @IsArray()
  // invitations?: InvitationDto[];

  // @IsOptional()
  // @IsArray()
  // chat_room?: ChatRoomDto[];
}