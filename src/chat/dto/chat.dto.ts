import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateChatRoomDto {
    @ApiProperty({ description: 'Event Id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  event_id: string;

  @ApiProperty({ description: 'Event Name', example: 'Tech Conference 2025' })
  @IsNotEmpty()
  @IsString()
  event_name: string;

  @IsOptional()
  @IsString()
  deletedAt?: string; // Optional in case you want to set a deletedAt field during creation
}


export class UpdateChatRoomDto {
  @ApiProperty({ description: 'Event Id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsString()
    event_id?: string;
  
    @ApiProperty({ description: 'Event Name', example: 'Tech Conference 2025' })
    @IsOptional()
    @IsString()
    event_name?: string;
  
    @IsOptional()
    @IsString()
    deletedAt?: string;
  }


  export class ChatRoomResponseDto {
    @IsString()
    id: string;
  
    @IsString()
    event_id: string;
  
    @IsString()
    event_name: string;
  
    @IsDate()
    createdAt: Date;
  
    @IsDate()
    updatedAt: Date;
  
    @IsOptional()
    @IsDate()
    deletedAt?: Date;
  }

  export class QueryChatRoomsDto {
    @IsOptional()
    @IsString()
    event_id?: string;
  
    @IsOptional()
    @IsString()
    event_name?: string;
  }


  export class AddMemberDto {
    @ApiProperty({ description: 'Attendee Id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsString()
    attendee_id: string;
  }



  // ChatMessage dto

  export class CreateChatMessageDto {
    @ApiProperty({ description: 'Chatroom Id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsString()
    chat_room_id: string;
  
    @ApiProperty({ description: 'Attendee Id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsString()
    attendee_id: string;
  
    @ApiProperty({ description: 'Content of message', example: 'Hello Group' })
    @IsNotEmpty()
    @IsString()
    message: string;
  
    @IsOptional()
    @IsString()
    deletedAt?: string; // Optional in case you want to set a deletedAt field during creation
  }


  export class UpdateChatMessageDto {
    @ApiProperty({ description: 'Content of message', example: 'Hello Group' })
    @IsOptional()
    @IsString()
    message?: string;
  
    @IsOptional()
    @IsString()
    deletedAt?: string;
  }

  export class SendMessageDto {
    @ApiProperty({ description: 'Attendee Id', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsString()
    attendee_id: string;
  
    @ApiProperty({ description: 'Content of message', example: 'Hello Group' })
    @IsNotEmpty()
    @IsString()
    message: string;
  }

  export class ChatMessageResponseDto {
    @IsString()
    id: string;
  
    @IsString()
    chat_room_id: string;
  
    @IsString()
    attendee_id: string;
  
    @IsString()
    message: string;
  
    @IsDate()
    createdAt: Date;
  
    @IsDate()
    updatedAt: Date;
  
    @IsOptional()
    @IsDate()
    deletedAt?: Date;
  }