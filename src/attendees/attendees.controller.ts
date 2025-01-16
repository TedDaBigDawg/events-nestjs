import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto, UpdateAttendeeDto } from './dto/attendee.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Attendees')
@ApiBearerAuth('access-token')
@Controller('attendees')
export class AttendeesController {
    constructor(private readonly attendeeService: AttendeesService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new event attendee' })
    @ApiResponse({
      status: 201,
      description: 'The event attendee has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createAttendee(@Body(ValidationPipe) createAttendeeDto: CreateAttendeeDto) {
      const attendee = await this.attendeeService.createAttendee(createAttendeeDto);
      return {
        success: true,
        data: attendee,
      };
    }


    @Patch(':id/update')
    @ApiOperation({ summary: 'Update an event attendee' })
    @ApiResponse({
    status: 201,
    description: 'The event attendee has been successfully updated.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async updateAttendee(@Param('id') id: string, @Body(ValidationPipe) updateAttendeeDto: UpdateAttendeeDto) {
      const attendee = await this.attendeeService.updateAttendee(id, updateAttendeeDto);
      return {
        success: true,
        data: attendee,
      };
    }


    @Get('event/:id')
    @ApiOperation({ summary: 'Get all attendees for an event' })
    @ApiResponse({
      status: 201,
      description: 'Attendees successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAttendees(@Param('id') eventId: string) {
      const attendees = await this.attendeeService.getAttendeesByEventId(eventId);
      return {
        success: true,
        data: attendees,
      };
    }


    @Get(':id/one')
    @ApiOperation({ summary: 'Get a specific attendee' })
    @ApiResponse({
      status: 201,
      description: 'Attendee successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAttendee(@Param('id') id: string) {
      const attendee = await this.attendeeService.getAttendeeById(id);
      if (attendee) {
        return {
          success: true,
          data: attendee,
        };
      } else {
        return {
          success: false,
          message: 'No data',
        };
      }
    }


    //Route to handle getting all attendees 
    @Get('all')
    @ApiOperation({ summary: 'Get all attendees not soft deleted' })
    @ApiResponse({
      status: 201,
      description: 'Attendees successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAll() {
        return await this.attendeeService.getAllAttendees();
    }


     //Route to handle getting all soft deleted prices 
    @Get('all/deleted')
    @ApiOperation({ summary: 'Get all attendees soft deleted' })
    @ApiResponse({
      status: 201,
      description: 'Attendees successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAllDeletedPrices() {
        return await this.attendeeService.getAllDeletedAttendees();
    }


    @Patch(':id/delete')
      @ApiOperation({ summary: 'Soft delete an attendee' })
      @ApiResponse({
        status: 201,
        description: 'Attendee successfully soft deleted.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      @HttpCode(HttpStatus.OK)
      async softDeletePrice(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.attendeeService.softDeleteAttendee(id);
        return { success: true, ...result };
      }


      @Delete(':id/harddelete')
        @ApiOperation({ summary: 'Hard delete an attendee' })
        @ApiResponse({
          status: 201,
          description: 'Attendee successfully hard deleted.',
        })
        @ApiResponse({ status: 400, description: 'Bad Request.' })
        @HttpCode(HttpStatus.OK)
        async hardDeletePrice(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
          const result = await this.attendeeService.hardDeleteAttendee(id);
          return { success: true, ...result };
        }


      @Patch(':id/check-in')
      @ApiOperation({ summary: 'Check in an attendee' })
        @ApiResponse({
          status: 201,
          description: 'Attendee successfully checked in.',
        })
        @ApiResponse({ status: 400, description: 'Bad Request.' })
      checkInAttendee(@Param('id') id: string) {
        return this.attendeeService.checkInAttendee(id);
      }



      @Post(':id/send-thank-you')
      @ApiOperation({ summary: 'Send thank you mail to attendee' })
        @ApiResponse({
          status: 201,
          description: 'Thank you mail successfully sent.',
        })
        @ApiResponse({ status: 400, description: 'Bad Request.' })
    sendThankYouEmail(@Param('id') id: string) {
      return this.attendeeService.sendThankYouEmail(id);
    }
}
