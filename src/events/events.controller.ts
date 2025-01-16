import { Controller, Post, Body, Req, HttpException, HttpStatus, Put, Param, Delete, Get, Query, Res, Request, Patch, HttpCode, ValidationPipe } from '@nestjs/common';
import { EventService } from './events.service';
import { Response } from 'express';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@ApiBearerAuth('access-token') // Use the same key from addBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

// Route to handle creating an event
  @Post('create')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createEvent(@Body(ValidationPipe) createEventDto: CreateEventDto, @Request() req) {
    const user = req.isce_auth; // Access `isce_auth` stored in the request
    try {
      const result = await this.eventService.createEvent(createEventDto, user);
      return {
        success: true,
        message: 'Event created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async updateEvent(@Param('id') id: string, @Body(ValidationPipe) updateEventDto: UpdateEventDto) {
    try {
      const result = await this.eventService.updateEvent(id, updateEventDto);
      return result;
    } catch (error) {
      throw error; // Let NestJS handle exceptions through global exception filters
    }
  }


  @Get('all')
  @ApiOperation({ summary: 'Get all events not soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Events successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'page',
    required: false,  // Making the query parameter optional
    description: 'Set page',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,  // Making the query parameter optional
    description: 'Set limit',
    type: String,
  })
  async getAllEvents(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;

    const result = await this.eventService.getAllEvents(pageNum, limitNum);

    return result; // Return the result from the service
  }


// Route to handle retrieving and processing events
@Get('events')
@ApiOperation({ summary: 'Get all events for a User' })
  @ApiResponse({
    status: 201,
    description: 'Events successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'page',
    required: false,  // Making the query parameter optional
    description: 'Set page',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,  // Making the query parameter optional
    description: 'Set limit',
    type: String,
  })
  async getEvents(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: any, // `req` contains the authenticated user (e.g., req.user)
  ) {
    const userId = req.isce_auth.id;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;

    const events = await this.eventService.getEvents(userId, pageNum, limitNum);

    return {
      success: true,
      data: {
        ...events,
        user: req.isce_auth,
      },
    };
  }


  @Get(':id/one')
  @ApiOperation({ summary: 'Get a specific event' })
  @ApiResponse({
    status: 201,
    description: 'Event successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getEvent(@Param('id') eventId: string, @Req() req: Request) {
    return await this.eventService.getEvent(eventId);
  }


  @Get('search')
  @ApiOperation({ summary: 'Search for events' })
  @ApiResponse({
    status: 201,
    description: 'Events successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'query',
    required: false,  // Making the query parameter optional
    description: 'Search Parameter',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,  // Making the query parameter optional
    description: 'Set page',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,  // Making the query parameter optional
    description: 'Set limit',
    type: String,
  })
  async searchEvents(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;

    if (!query) {
      return {
        success: false,
        message: 'Search query is required',
      };
    }

    const events = await this.eventService.searchEvents(query, pageNum, limitNum);

    return {
      success: true,
      data: { events },
    };
  }


  @Get('search-by-town')
  @ApiOperation({ summary: 'Search for events using the Town' })
  @ApiResponse({
    status: 201,
    description: 'Events successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'query',
    required: true,  // Making the query parameter optional
    description: 'Enter Town name',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,  // Making the query parameter optional
    description: 'Set page',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,  // Making the query parameter optional
    description: 'Set limit',
    type: String,
  })
  async searchEventsByTown(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;

    const result = await this.eventService.searchEventsByTown(
      query,
      pageNum,
      limitNum,
    );

    return result; // Return the result from the service
  }


  // @Get()
  // async getEvents(@Query() query: any, @Req() req: any) {
  //   try {
  //     const eventsData = await this.eventService.getEvents(query, req.user);
  //     return {
  //       success: true,
  //       data: eventsData,
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


// // Route to handle updating an event with id
//   @Put(':id/update')
//   async updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() req: Request) {
//     try {
//       const updatedEvent = await this.eventService.updateEvent(id, updateEventDto, req.user);
//       return {
//         success: true,
//         data: updatedEvent,
//       };
//     } catch (error) {
//       throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }


@Patch(':id/updelete')
@ApiOperation({ summary: 'Soft delete an event and all related records' })
  @ApiResponse({
    status: 201,
    description: 'Event successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async softDeleteEvent(@Param('id') id: string) {
    try {
      const result = await this.eventService.softDeleteEvent(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

// Route to handle deleting an event with id
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Hard delete an event and all related records' })
  @ApiResponse({
    status: 201,
    description: 'Event successfully hard deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async deleteEvent(@Param('id') id: string) {
    try {
      await this.eventService.deleteEvent(id);
      return {
        success: true,
        message: 'Event permanently deleted',
      };
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  


  @Post('request-cards')
  async getRequestedCards(
    @Body() body: { event_price_id: string; order_amount: number },
    @Req() req,
    @Res() res: Response
  ) {
    try {
      const user = req.isce_auth; // Assuming user details are attached to the request
      const { event_price_id, order_amount } = body;

      // Delegate to the service for all business logic
      const result = await this.eventService.getRequestedCards(event_price_id, order_amount, user);
      
      return res.send(result);
    } catch (error) {
      // Handle any errors and send the response
      return res.status(error.status || 500).send({
        success: 'false',
        message: error.message || 'Unable to process request',
      });
    }
  }
}
