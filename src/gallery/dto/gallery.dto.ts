import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
  @IsOptional()
  @IsString() // Ensures the event_id is a valid UUID
  event_id?: string;

  @ApiProperty({ description: 'Name of gallery', example: 'VIP PIC' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Image URL', example: 'Image Url' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateGalleryDto {
    @ApiProperty({ description: 'Event Id', example: '98e0932ue289r0780r8r83u489r' })
    @IsOptional()
    @IsUUID() // Optional UUID for updating event_id
    event_id?: string;
  
    @ApiProperty({ description: 'Name of gallery', example: 'VIP PIC' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiProperty({ description: 'Image URL', example: 'Image Url' })
    @IsOptional()
    @IsString()
    image?: string;
  }
