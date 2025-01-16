import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { Is } from 'sequelize-typescript';

// create-invitation.dto.ts
export class CreateInvitationDto {
  @ApiProperty({ description: 'Name of the invitation', example: 'Conference Invitation' })
  @IsString()
  @IsNotEmpty()
  invitation_name: string;

  @ApiProperty({ description: 'Description of the invitation', example: 'Join us for an exclusive conference' })
  @IsString()
  invitation_desc: string;

  @ApiProperty({ description: 'Event Id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  event_id: string;

  @ApiProperty({ description: 'Event Name', example: 'Tech Conference 2025' })
  @IsString()
  event_name: string;

  @ApiProperty({ description: 'Invitee Name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  event_invitee_name?: string;

  @ApiProperty({ description: 'Invitee Email', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsString()
  event_invitee_email?: string;

  @ApiProperty({ description: 'Invitee Phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  event_invitee_phone?: string;

  @ApiProperty({ description: 'True if invitation is reusable', example: true })
  @IsBoolean()
  @IsNotEmpty()
  isReusable: boolean = true;
}

// update-invitation.dto.ts
export class UpdateInvitationDto {
  @ApiProperty({ description: 'Name of the invitation', example: 'Conference Invitation', required: false })
  @IsOptional()
  @IsString()
  invitation_name?: string;

  @ApiProperty({ description: 'Description of the invitation', example: 'Join us for an exclusive conference', required: false })
  @IsOptional()
  @IsString()
  invitation_desc?: string;

  @ApiProperty({ description: 'Event Id', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  event_id?: string;

  @ApiProperty({ description: 'Event Name', example: 'Tech Conference 2025', required: false })
  @IsOptional()
  @IsString()
  event_name?: string;

  @ApiProperty({ description: 'Invitee Name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  event_invitee_name?: string;

  @ApiProperty({ description: 'Invitee Email', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsString()
  event_invitee_email?: string;

  @ApiProperty({ description: 'Invitee Phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  event_invitee_phone?: string;

  @ApiProperty({ description: 'Accepted Status', example: true, required: false })
  @IsOptional()
  accepted?: boolean;
}


export class AcceptInvitationDto {
  
    @ApiProperty({ description: 'Invitee Name', example: 'John Doe', required: false })
    @IsNotEmpty()
    @IsString()
    event_invitee_name: string;
  
    @ApiProperty({ description: 'Invitee Email', example: 'john.doe@example.com', required: false })
    @IsNotEmpty()
    @IsString()
    event_invitee_email: string;
  
    @ApiProperty({ description: 'Invitee Phone', example: '+1234567890', required: false })
    @IsNotEmpty()
    @IsString()
    event_invitee_phone: string;
  }

// invitation-response.dto.ts
export class InvitationResponseDto {
  @ApiProperty({ description: 'Unique identifier of the invitation', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Name of the invitation', example: 'Conference Invitation' })
  invitation_name: string;

  @ApiProperty({ description: 'Description of the invitation', example: 'Join us for an exclusive conference' })
  invitation_desc: string;

  @ApiProperty({ description: 'Event Id', example: '123e4567-e89b-12d3-a456-426614174000' })
  event_id: string;

  @ApiProperty({ description: 'Event Name', example: 'Tech Conference 2025' })
  event_name: string;

  @ApiProperty({ description: 'Invitee Name', example: 'John Doe', required: false })
  event_invitee_name?: string;

  @ApiProperty({ description: 'Invitee Email', example: 'john.doe@example.com', required: false })
  event_invitee_email?: string;

  @ApiProperty({ description: 'Invitee Phone', example: '+1234567890', required: false })
  event_invitee_phone?: string;

  @ApiProperty({ description: 'Invitation Token', example: 'abc123xyz' })
  token: string;

  @ApiProperty({ description: 'Accepted Status', example: true })
  accepted: boolean;

  @ApiProperty({ description: 'Creation Timestamp', example: '2025-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last Updated Timestamp', example: '2025-01-02T12:00:00Z' })
  updatedAt: Date;
}
