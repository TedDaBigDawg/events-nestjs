import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query, Res, ValidationPipe } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AcceptInvitationDto, CreateInvitationDto, UpdateInvitationDto } from './dto/invitation.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Invitations')
@ApiBearerAuth('access-token')
@Controller('invitation')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new event invitation' })
      @ApiResponse({
        status: 201,
        description: 'The event invitation has been successfully created.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createInvitation(
    @Body(ValidationPipe) createInvitationDto: CreateInvitationDto,
    ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
        const invitation = await this.invitationService.createInvitation(createInvitationDto);
        return {
        success: true,
        message: 'Invitation created successfully',
        data: invitation,
        };
    } catch (error) {
        // You could use a global exception filter for better error handling
        throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

    // Route for handling updating invitation with the unique id
      @Patch(':id/update')
      @ApiOperation({ summary: 'Update an event invitation' })
      @ApiResponse({
        status: 201,
        description: 'The event invitation has been successfully updated.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      async updateInvitation(
        @Param('id') id: string,
        @Body(ValidationPipe) updateInvitationDto: UpdateInvitationDto,
        @Res() res: Response,
      ) {
        try {
          const invitation = await this.invitationService.updateInvitation(id, updateInvitationDto);
          return res.send({
            success: true,
            data: invitation,
          });
        } catch (error) {
          return res.status(500).send({ success: false, message: error.message });
        }
      }


      //Route to handle getting all the invitations related to a specific event
      @Get('event/:id')
      @ApiOperation({ summary: 'Get all Invitations for an event' })
      @ApiResponse({
        status: 201,
        description: 'Invitations successfully retrieved.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      async getInvitations(
        @Param('eventId') eventId: string,
        @Res() res: Response,
      ) {
        try {
          const invitations = await this.invitationService.getInvitationsByEventId(eventId);
          return res.send({
            success: true,
            data: invitations,
          });
        } catch (error) {
          return res.status(500).send({ success: false, message: error.message });
        }
      }


      //Route to handle getting a specific invitation using the unique invitation id(PK)
@Get(':id/one')
@ApiOperation({ summary: 'Get a specific invitation' })
@ApiResponse({
  status: 201,
  description: 'Invitation successfully retrieved.',
})
@ApiResponse({ status: 400, description: 'Bad Request.' })
  async getInvitation(
    @Param('id') invitationId: string,
    @Res() res: Response,
  ) {
    try {
      const invitation = await this.invitationService.getInvitationById(invitationId);
      if (invitation) {
        return res.send({ success: true, data: invitation });
      } else {
        return res.send({ success: false, message: "No data" });
      }
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }



   //Route to handle getting all invitations 
@Get('all')
@ApiOperation({ summary: 'Get all invitations not soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Invitations successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAll(
  @Res() res: Response,
) {
  try {
    return await this.invitationService.getAllInvitations();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}


//Route to handle getting all soft deleted invitations 
@Get('all/deleted')
@ApiOperation({ summary: 'Get all invitations soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Invitations successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAllDeletedInvitations(
  @Res() res: Response,
) {
  try {
    return await this.invitationService.getAllDeletedInvitations();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

@Get('search/invitations')
@ApiOperation({ summary: 'Search invitations using either email or phone' })
  @ApiResponse({
    status: 201,
    description: 'Invitations successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'email',
    required: false,  // Making the query parameter optional
    description: 'Invitee Email',
    type: String,
  })
  @ApiQuery({
    name: 'phone',
    required: false,  // Making the query parameter optional
    description: 'Invitee Phone',
    type: String,
  })
  async searchInvitations(
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
      return await this.invitationService.searchInvitations(email, phone);
  }


  @Get('search/event-invitations')
@ApiOperation({ summary: 'Search a specific event invitations using either email or phone' })
  @ApiResponse({
    status: 201,
    description: 'Event Invitations successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'email',
    required: false,  // Making the query parameter optional
    description: 'Invitee Email',
    type: String,
  })
  @ApiQuery({
    name: 'phone',
    required: false,  // Making the query parameter optional
    description: 'Invitee Phone',
    type: String,
  })
  async searchEventInvitations(
    @Param('eventId') eventId: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
      return await this.invitationService.searchEventInvitations(eventId, email, phone);
  }


@Patch(':id/delete')
  @ApiOperation({ summary: 'Soft delete a invitation' })
  @ApiResponse({
    status: 201,
    description: 'Invitation successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async softDeleteInvitation(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.invitationService.softDeleteInvitation(id);
    return { success: true, ...result };
  }

  @Delete(':id/harddelete')
    @ApiOperation({ summary: 'Hard delete an Invitation' })
    @ApiResponse({
      status: 201,
      description: 'Invitation successfully hard deleted.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @HttpCode(HttpStatus.OK)
    async hardDeleteInvitation(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
      const result = await this.invitationService.hardDeleteInvitation(id);
      return { success: true, ...result };
    }


    @Get(':eventId/:inviteToken')
    @ApiOperation({ summary: 'Get and validate an Invitation' })
    @ApiResponse({
      status: 201,
      description: 'Invitation successfully validated proceed to accept.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAndValidateInvitation(
        @Param('eventId') eventId: string,
        @Param('inviteToken') inviteToken: string,
        @Res() res: Response,
    ) {
        try {
        const result = await this.invitationService.getAndValidateInvitation(eventId, inviteToken);
        return res.status(HttpStatus.OK).send(result);
        } catch (error) {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send({ success: false, message: error.message });
        }
    }

    @Post('accept/:inviteToken')
    @ApiOperation({ summary: 'Accept an Invitation' })
    @ApiResponse({
      status: 201,
      description: 'Invitation successfully accepted.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    acceptInvitation(@Param('inviteToken') inviteToken: string, @Body(ValidationPipe) dto: AcceptInvitationDto) {
      return this.invitationService.acceptInvitation(inviteToken, dto);
    }

}
