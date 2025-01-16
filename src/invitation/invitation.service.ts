import { Invitation } from './../../node_modules/.prisma/client/index.d';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import * as crypto from 'crypto';
import { HttpException, HttpStatus, Injectable, NotFoundException, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import slugify  from 'slugify'; // Import slugify utility if needed
import { AcceptInvitationDto, CreateInvitationDto, UpdateInvitationDto } from './dto/invitation.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InvitationService {
    private readonly logger = new Logger(InvitationService.name);

    constructor(private readonly prisma: DatabaseService) {}

  async createInvitation(createInvitationDto: CreateInvitationDto): Promise<any> {
    try {
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const {
        event_id,
        invitation_name,
        invitation_desc,
        event_name,
        event_invitee_email,
        event_invitee_name,
        event_invitee_phone,
        isReusable,
      } = createInvitationDto;

      // Check if event_id is provided
      if (!event_id) {
        throw new Error('Event ID is required.');
      }

      const event = await this.prisma.event.findUnique({
        where: { id: event_id }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }

      const event_clean_name = slugify(event_name);

      const inviteLink = `https://yourapp.com/invitation/${event_id}/${inviteToken}`;

      let invitation: any;
      if (isReusable) {
        invitation = await this.prisma.invitation.create({
          data: {
              invitation_name,
              invitation_desc: invitation_desc || null,
              event_id,
              event_name: event_clean_name,
              event_invitee_name: event_invitee_name || null,
              event_invitee_email: event_invitee_email || null,
              event_invitee_phone: event_invitee_phone || null,
              isReusable: isReusable || true,
              token: inviteToken,
              accepted: null,
          } 
        });
      } else {
        invitation = await this.prisma.invitation.create({
          data: {
              invitation_name,
              invitation_desc: invitation_desc || null,
              event_id,
              event_name: event_clean_name,
              event_invitee_name: event_invitee_name || null,
              event_invitee_email: event_invitee_email || null,
              event_invitee_phone: event_invitee_phone || null,
              isReusable: isReusable || true,
              token: inviteToken,
              accepted: false,
          } 
        });
      }
      return {
        success: true,
        message: 'Invitation created successfully',
        data: {
          invitation,
          inviteLink,
        },
      };
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updateInvitation(id: string, updateInvitationDto: UpdateInvitationDto) {
    try {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id },
          });
      
          if (!invitation) {
            throw new NotFoundException(`Invitation with ID ${id} not found`);
          }
      
          // Slugify the event name, if provided
          if (updateInvitationDto.event_name) {
            updateInvitationDto.event_name = slugify(updateInvitationDto.event_name);
          }
      
          // Update the invitation and return the updated record
          const updatedInvitation = await this.prisma.invitation.update({
            where: { id },
            data: updateInvitationDto,
          });
      
          return {
              success: true,
              message: "Invitation successfully updated",
              data: updatedInvitation
          }
    } catch (error) {
        throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Method to handle getting all the invitations related to a specific event
async getInvitationsByEventId(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      const invitations = await this.prisma.invitation.findMany({
        where: { event_id: eventId },
      });

      if (!invitations || invitations.length === 0) {
        throw new NotFoundException('No invitations found');
      }

      return {
        success: true,
        message: "Invitations successfully retrieved",
        data: invitations
      }
    } catch (error) {
      this.logger.error('Error fetching invitations', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

// Method to handle getting a specific invitation using the unique price id(PK)
  async getInvitationById(invitationId: string) {
    try {
      const invitation = await this.prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      return {
        success: true,
        message: "Invitation successfully retrieved",
        data: invitation
      }
    } catch (error) {
      this.logger.error('Error fetching invitation', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getAllInvitations() {
    try {
      const invitations = await this.prisma.invitation.findMany({
        where: {
          deletedAt: null
        }
      });

      if (!invitations || invitations.length === 0) {
        throw new NotFoundException('No invitations found');
      }
      return {
        success: true,
        message: "Invitations successfully retrieved",
        data: invitations
      }
    } catch (error) {
      this.logger.error('Error fetching invitation', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Method to handle getting all soft deleted invitations
  async getAllDeletedInvitations() {
    try {
      const invitations = await this.prisma.invitation.findMany({
        where: { deletedAt: { not: null } },
      });

      if (!invitations || invitations.length === 0) {
        throw new NotFoundException('No invitations found');
      }

      return {
        success: true,
        message: "Invitations successfully retrieved",
        data: invitations
      }
    } catch (error) {
      this.logger.error('Error fetching invitations', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async searchInvitations(email?: string, phone?: string) {
    try {

      if (!email && !phone) {
        throw new BadRequestException('Please provide either email or phone to search.');
      }
      // Build query conditions dynamically
      const whereCondition: any = {};
      if (email) {
        whereCondition.event_invitee_email = email;
      }
      if (phone) {
        whereCondition.event_invitee_phone = phone;
      }

      // Query invitations from the database
      const invitations = await this.prisma.invitation.findMany({
        where: whereCondition,
      });

      if (!invitations || invitations.length === 0) {
        throw new NotFoundException('No Invitations found');
      }

      return {
        success: true,
        message: 'Invitations retrieved successfully',
        data: invitations,
      };
    } catch (error) {
      console.error('Error searching invitations:', error);
      throw new Error('Failed to search invitations.');
    }
  }


  async searchEventInvitations(eventId: string, email?: string, phone?: string) {
    try {
      if (!eventId) {
        throw new Error('Event ID is required.');
      }

      if (!email && !phone) {
        throw new BadRequestException('Please provide either email or phone to search.');
      }
  
      // Build query conditions dynamically
      const whereCondition: any = {
        event_id: eventId, // Ensure event_id is always part of the query
      };
      if (email) {
        whereCondition.event_invitee_email = email;
      }
      if (phone) {
        whereCondition.event_invitee_phone = phone;
      }
  
      // Query invitations from the database
      const invitations = await this.prisma.invitation.findMany({
        where: whereCondition,
      });

      if (!invitations || invitations.length === 0) {
        throw new NotFoundException('No Event Invitations found');
      }
  
      return {
        success: true,
        message: 'Event Invitations retrieved successfully',
        data: invitations,
      };
    } catch (error) {
      console.error('Error searching for event invitations:', error);
      throw new Error(error.message || 'Failed to search for event invitations.');
    }
  }
  
  async softDeleteInvitation(id: string): Promise<{ message: string }> {
      try {
        // Check if the invitation exists
        const invitation = await this.prisma.invitation.findUnique({ where: { id } });
        if (!invitation) {
          throw new NotFoundException('Invitation not found');
        }
  
        // Update the `deletedAt` field to the current timestamp
        await this.prisma.invitation.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
  
        return { message: 'Invitation soft deleted successfully' };
      } catch (error) {
        throw new InternalServerErrorException(
          error.message || 'An error occurred while soft deleting the invitation',
        );
      }
    }

    async hardDeleteInvitation(id: string): Promise<{ message: string }> {
        try {
          // Check if the invitation exists
          const invitation = await this.prisma.invitation.findUnique({ where: { id } });
          if (!invitation) {
            throw new NotFoundException('Invitation not found');
          }
    
          // Update the `deletedAt` field to the current timestamp
          await this.prisma.invitation.delete({
            where: { id }
          });
    
          return { message: 'Invitation hard deleted successfully' };
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'An error occurred while hard deleting the invitation',
          );
        }
      }


      async getAndValidateInvitation(eventId: string, inviteToken: string) {
        try {
          const invitation = await this.prisma.invitation.findFirst({
            where: {
              token: inviteToken,
              event_id: eventId,
            },
          });
    
          if (!invitation) {
            throw new NotFoundException('Invalid invitation link');
          }

          const acceptLink = `https://yourapp.com/invitation/accept/${inviteToken}`;
    
          return {
            success: true,
            message: 'Invitation is valid. Proceed to accept.',
            acceptLink: acceptLink,
            data: invitation,
          };
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }


      async acceptInvitation(inviteToken: string, dto: AcceptInvitationDto) {
        try {
          // Find the invitation using the token
          const invitation = await this.prisma.invitation.findFirst({
            where: { token: inviteToken },
          });
      
          if (!invitation) {
            throw new NotFoundException('Invalid invitation');
          }
      
          // Check if the email already exists for the same eventId in the Attendee table
          if (dto.event_invitee_email) {
            const existingAttendee = await this.prisma.attendee.findFirst({
              where: {
                eventId: invitation.event_id,
                email: dto.event_invitee_email,
              },
            });
      
            if (existingAttendee) {
              throw new BadRequestException(
                'An attendee with this email is already registered for this event.'
              );
            }
          }

          // Check if the phone number already exists for the same eventId in the Attendee table
          if (dto.event_invitee_phone) {
            const existingAttendee = await this.prisma.attendee.findFirst({
              where: {
                eventId: invitation.event_id,
                email: dto.event_invitee_phone,
              },
            });
      
            if (existingAttendee) {
              throw new BadRequestException(
                'An attendee with this phone number is already registered for this event.'
              );
            }
          }
      
          // Handle non-reusable invitations
          if (!invitation.isReusable) {
            if (invitation.accepted) {
              throw new BadRequestException('Invitation has already been accepted');
            } else {
              // Mark the invitation as accepted
              await this.prisma.invitation.update({
                where: { token: inviteToken },
                data: { accepted: true },
              });
            }
          }
      
          // Add the invitee to the event as an attendee
          const attendee = await this.prisma.attendee.create({
            data: {
              eventId: invitation.event_id,
              eventName: invitation.event_name,
              name: dto.event_invitee_name || invitation.event_invitee_name || null,
              email: dto.event_invitee_email || invitation.event_invitee_email || null,
              phone: dto.event_invitee_phone || invitation.event_invitee_phone || null,
              token: inviteToken, // Save the token to track the invitation
              link: invitation.invite_link,
              // Add other fields like `ticket`, `price_category`, etc., if needed
            },
          });
      
          return {
            success: true,
            message: 'Invitation accepted!',
            data: attendee,
          };
        } catch (error) {
          console.error('Error in acceptInvitation:', error);
          throw new InternalServerErrorException(error.message || 'Internal server error');
        }
      }
      




//       async acceptInvitationReserved(inviteToken: string, dto: AcceptInvitationDto) {
//         try {
//           // Find the invitation
//           const invitation = await this.prisma.invitation.findFirst({
//             where: { token: inviteToken },
//           });
    
//           if (!invitation) {
//             throw new NotFoundException('Invalid invitation');
//           }
    
//           if (invitation.accepted) {
//             throw new BadRequestException('Invitation has already been accepted');
//           }

//           // Mark the invitation as accepted
//           await this.prisma.invitation.update({
//             where: { token: inviteToken },
//             data: { accepted: true },
//           });
          
//             // Add the invitee to the event as an attendee
//            const attendee = await this.prisma.attendee.create({
//             data: {
//               eventId: invitation.event_id,
//               eventName: invitation.event_name,
//               name: dto.event_invitee_name || invitation.event_invitee_name || null,
//               email: dto.event_invitee_email || invitation.event_invitee_email || null,
//               phone: dto. event_invitee_phone || invitation.event_invitee_phone || null,
//               token: inviteToken, // Save the token to track the invitation
//               link: invitation.invite_link
//               // Add other fields like `ticket`, `price_category`, etc., if needed
//             },
//           });
          
//           return {
//             success: true,
//             message: 'Reserved Invitation accepted!',
//             data: attendee,
//           };
//         } catch (error) {
//           throw new InternalServerErrorException(error.message);
//         }
//       }


//       async acceptInvitationUnreserved(inviteToken: string, inviteeDetails: AcceptInvitationDto) {
//         try {
//           // Find the invitation
//           const invitation = await this.prisma.invitation.findFirst({
//             where: { token: inviteToken },
//           });
    
//           if (!invitation) {
//             throw new NotFoundException('Invalid invitation');
//           }
    
//           if (!invitation.isReusable) {
//             throw new BadRequestException('Invitation is not reusable');
//           }


//           // Add the invitee to the event as an attendee
//           const attendee = await this.prisma.attendee.create({
//             data: {
//               eventId: invitation.event_id,
//               eventName: invitation.event_name,
//               name: inviteeDetails.event_invitee_name || invitation.event_invitee_name || null,
//               email: inviteeDetails.event_invitee_email || invitation.event_invitee_email || null,
//               phone: inviteeDetails. event_invitee_phone || invitation.event_invitee_phone || null,
//               token: inviteToken, // Save the token to track the invitation
//               link: invitation.invite_link
//               // Add other fields like `ticket`, `price_category`, etc., if needed
//             },
//           });
          
//           return {
//             success: true,
//             message: 'Invitation accepted!',
//             data: attendee,
//           };
//         } catch (error) {
//           throw new InternalServerErrorException(error.message);
//         }
//       }

}
