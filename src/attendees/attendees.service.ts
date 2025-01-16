import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAttendeeDto, UpdateAttendeeDto } from './dto/attendee.dto';

import { Attendee } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/services/mailService';

@Injectable()
export class AttendeesService {
  private readonly logger = new Logger(AttendeesService.name);

  constructor(private readonly prisma: DatabaseService, private readonly emailService: EmailService,) {}

  async createAttendee(createAttendeeDto: CreateAttendeeDto) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: createAttendeeDto.eventId }
      })
      
      if (!event) {
        throw new NotFoundException('No event found');
      }
      const attendee = await this.prisma.attendee.create({
        data: {
          ...createAttendeeDto
        }
      });
      return {
        success: true,
        message: "Attendee Successfully created.",
        data: attendee
      }
    } catch (error) {
      this.logger.error('Error creating attendee', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);  
    }
  }


  async updateAttendee(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    try {
      const attendee = await this.prisma.attendee.findUnique({
        where: { id: id },
      });

      if (!attendee) {
        throw new NotFoundException('Attendee not found');
      }
      const updatedAttendee = await this.prisma.attendee.update({
        where: { id: id },
        data: updateAttendeeDto,
      });
      return {
        success: true,
        message: "Attendee successfully updated",
        data: updatedAttendee
      }
    } catch (error) {
      this.logger.error('Error updating attendee', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async getAttendeesByEventId(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      const attendees = await this.prisma.attendee.findMany({
        where: {
          eventId: eventId,
        },
      });
      if (!attendees || attendees.length === 0) {
        throw new NotFoundException('No attendees found');
      }
      return {
        success: true,
        message: "Attendees successfully retrieved",
        data: attendees
      }
    } catch (error) {
      this.logger.error('Error fetching attendees', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);   
    }
  }



  async getAttendeeById(id: string) {
    try {
      const attendee = await this.prisma.attendee.findUnique({
        where: { id: id },
      });
      if (!attendee) {
        throw new NotFoundException('Attendee not found');
      }
      return {
        success: true,
        message: "Attendee successfully retrieved",
        data: attendee
      }
    } catch (error) {
      this.logger.error('Error fetching attendee', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all attendees in database not soft deleted
  async getAllAttendees() {
    try {
      const attendees = await this.prisma.attendee.findMany({
        where: {
          deletedAt: null
        }
      });

      if (!attendees || attendees.length === 0) {
        throw new NotFoundException('No attendees found');
      }
      return {
        success: true,
        message: "Attendees successfully retrieved",
        data: attendees
      }
    } catch (error) {
      this.logger.error('Error fetching attendees', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all soft deleted attendees
  async getAllDeletedAttendees() {
    try {
      const attendees = await this.prisma.attendee.findMany({
        where: { deletedAt: { not: null } },
      });

      if (!attendees || attendees.length === 0) {
        throw new NotFoundException('No attendees found');
      }

      return {
        success: true,
        message: "Attendees successfully retrieved",
        data: attendees
      }
    } catch (error) {
      this.logger.error('Error fetching attendees', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async softDeleteAttendee(id: string): Promise<{ message: string }> {
      try {
        const attendee = await this.prisma.attendee.findUnique({ where: { id: id } });
        if (!attendee) {
          throw new NotFoundException('Attendee not found');
        }
  
        // Update the `deletedAt` field to the current timestamp
        await this.prisma.attendee.update({
          where: { id: id },
          data: { deletedAt: new Date() },
        });
  
        return { message: 'Attendee soft deleted successfully' };
      } catch (error) {
        throw new InternalServerErrorException(
          error.message || 'An error occurred while soft deleting the attendee',
        );
      }
    }


    async hardDeleteAttendee(id: string): Promise<{ message: string }> {
      try {
        // Check if the attendee exists
        const attendee = await this.prisma.attendee.findUnique({ where: { id: id } });
        if (!attendee) {
          throw new NotFoundException('Attendee not found');
        }
  
        // Update the `deletedAt` field to the current timestamp
        await this.prisma.attendee.delete({
          where: { id: id }
        });
  
        return { message: 'Attendee hard deleted successfully' };
      } catch (error) {
        throw new InternalServerErrorException(
          error.message || 'An error occurred while soft deleting the attendee',
        );
      }
    }


    async checkInAttendee(id: string) {
      try {
        // Find the attendee
        const attendee = await this.prisma.attendee.findUnique({
          where: { id },
        });
  
        if (!attendee) {
          throw new NotFoundException(`Attendee with ID ${id} not found.`);
        }
  
        // Update the attendee's checkedIn status to true
        const updatedAttendee = await this.prisma.attendee.update({
          where: { id },
          data: { checkedIn: true },
        });
  
        return {
          success: true,
          message: `Attendee with ID ${id} checked in successfully.`,
          data: updatedAttendee,
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message || 'An error occurred',)
      }
    }


    async sendThankYouEmail(id: string) {
      try {
        // Find the attendee
        const attendee = await this.prisma.attendee.findUnique({
          where: { id },
        });
  
        if (!attendee) {
          throw new NotFoundException(`Attendee with ID ${id} not found.`);
        }
  
        if (!attendee.email) {
          throw new BadRequestException(`Attendee with ID ${id} does not have an email address.`);
        }
  
        // Example email content
        const emailContent = {
          to: attendee.email,
          subject: `Thank You for Attending ${attendee.eventName || 'the Event'}`,
          text: `Hi ${attendee.name},\n\nThank you for attending ${
            attendee.eventName || 'our event'
          }. We hope you had a great experience!\n\nBest regards,\n[Your Team Name]`,
        };
  
        // Trigger email service
        await this.emailService.sendEmail(emailContent);
  
        // Update the thankyouMail field to true
        await this.prisma.attendee.update({
          where: { id },
          data: { thankyouMail: true },
        });
  
        return {
          message: `Thank-you email sent to attendee with ID ${id} successfully.`,
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message || 'An error occurred',)
      }
    }
}
