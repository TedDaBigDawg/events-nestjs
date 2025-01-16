import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Query, Res, ValidationPipe } from '@nestjs/common';
import { AddMemberDto, CreateChatRoomDto, SendMessageDto, UpdateChatMessageDto, UpdateChatRoomDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateInvitationDto } from 'src/invitation/dto/invitation.dto';
import { Response } from 'express';

@ApiTags('Chats')
@ApiBearerAuth('access-token')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('create')
        @ApiOperation({ summary: 'Create a new event chat room' })
          @ApiResponse({
            status: 201,
            description: 'The event chatroom has been successfully created.',
          })
          @ApiResponse({ status: 400, description: 'Bad Request.' })
        async createChatroom(
        @Body(ValidationPipe) dto: CreateChatRoomDto,
        ): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const chatroom = await this.chatService.createChatRoom(dto);
            return {
            success: true,
            message: 'Chatroom created successfully',
            data: chatroom,
            };
        } catch (error) {
            // You could use a global exception filter for better error handling
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Route for handling updating chatroom with the unique id
          @Patch(':id/update-chatroom')
          @ApiOperation({ summary: 'Update an event chatroom' })
          @ApiResponse({
            status: 201,
            description: 'The event chatroom has been successfully updated.',
          })
          @ApiResponse({ status: 400, description: 'Bad Request.' })
          async updateChatroom(
            @Param('id') id: string,
            @Body(ValidationPipe) dto: UpdateChatRoomDto,
            @Res() res: Response,
          ) {
            try {
              const chatroom = await this.chatService.updateChatRoom(id, dto);
              return res.send({
                success: true,
                data: chatroom,
              });
            } catch (error) {
              return res.status(500).send({ success: false, message: error.message });
            }
          }


          
      //Route to handle getting the chatroom related to a specific event
      @Get('event-chatroom/:id')
      @ApiOperation({ summary: 'Get chatroom for an event' })
      @ApiResponse({
        status: 201,
        description: 'Chatroom successfully retrieved.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      async getChatrooms(
        @Param('eventId') eventId: string,
        @Res() res: Response,
      ) {
        try {
          const chatroom = await this.chatService.getChatroomByEventId(eventId);
          return res.send({
            success: true,
            data: chatroom,
          });
        } catch (error) {
          return res.status(500).send({ success: false, message: error.message });
        }
      }


      
      //Route to handle getting a specific chatroom using the unique invitation id(PK)
@Get(':id/chatroom-one')
@ApiOperation({ summary: 'Get a specific chatroom' })
@ApiResponse({
  status: 201,
  description: 'Chatroom successfully retrieved.',
})
@ApiResponse({ status: 400, description: 'Bad Request.' })
  async getChatroom(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const chatroom = await this.chatService.getChatroomById(id);
      if (chatroom) {
        return res.send({ success: true, data: chatroom });
      } else {
        return res.send({ success: false, message: "No data" });
      }
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }


  //Route to handle getting all chatrooms 
@Get('all')
@ApiOperation({ summary: 'Get all chatrooms not soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Chatrooms successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAll(
  @Res() res: Response,
) {
  try {
    return await this.chatService.getAllChatrooms();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}


//Route to handle getting all soft deleted chatrooms 
@Get('all/deleted')
@ApiOperation({ summary: 'Get all chatrooms soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Chatrooms successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAllDeletedChatrooms(
  @Res() res: Response,
) {
  try {
    return await this.chatService.getAllDeletedChatrooms();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

@Patch(':id/delete')
  @ApiOperation({ summary: 'Soft delete a chatroom' })
  @ApiResponse({
    status: 201,
    description: 'Chatroom successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async softDeleteChatroom(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.chatService.softDeleteChatroom(id);
    return { success: true, ...result };
  }


  @Delete(':id/harddelete')
      @ApiOperation({ summary: 'Hard delete a chatroom' })
      @ApiResponse({
        status: 201,
        description: 'Chatroom successfully hard deleted.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      @HttpCode(HttpStatus.OK)
      async hardDeleteChatroom(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.chatService.hardDeleteChatroom(id);
        return { success: true, ...result };
      }


      @Post(':id/members')
      @ApiOperation({ summary: 'Add a user to a chatroom' })
      @ApiResponse({
        status: 201,
        description: 'Member added successfully.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      async addMemberToChatRoom(
        @Param('id') chatRoomId: string,
        @Body(ValidationPipe) addMemberDto: AddMemberDto,
      ) {
        try {
          const result = await this.chatService.addMemberToChatRoom(
            chatRoomId,
            addMemberDto,
          );
          return result;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error;
          }
          throw new InternalServerErrorException(
            error.message || 'Failed to add member to the chat room.',
          );
        }
      }



      @Get(':id/members')
      @ApiOperation({ summary: 'Get all members of a chatroom' })
      @ApiResponse({
        status: 201,
        description: 'Members retrieved successfully.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getChatRoomMembers(@Param('id') chatRoomId: string) {
    try {
      const result = await this.chatService.getChatRoomMembers(chatRoomId);

      if (!result.success) {
        throw new NotFoundException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to retrieve chat room members.',
      );
    }
  }
        


      // Chat message controller methods

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message to a chatroom' })
      @ApiResponse({
        status: 201,
        description: 'Message sent successfully.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
  async sendMessage(
    @Param('id') chatRoomId: string,
    @Body(ValidationPipe) sendMessageDto: SendMessageDto,
  ) {
    try {
      const message = await this.chatService.sendMessage(
        chatRoomId,
        sendMessageDto,
      );
      return {
        success: true,
        message: 'Message sent successfully.',
        data: message,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id/update-message')
  @ApiOperation({ summary: 'Edit a chat message' })
      @ApiResponse({
        status: 201,
        description: 'Message updated successfully.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
  async editMessage(@Param('id') messageId: string, @Body(ValidationPipe) updateMessageDto: UpdateChatMessageDto) {
    try {
      const updatedMessage = await this.chatService.editMessage(messageId, updateMessageDto);
      return {
        success: true,
        message: 'Message updated successfully.',
        data: updatedMessage,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }


  @Get('search')
  @ApiOperation({ summary: 'Search for messages in a chatroom' })
      @ApiResponse({
        status: 201,
        description: 'Messages retrieved successfully.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
  async searchMessages(
    @Param('id') chatRoomId: string,
    @Query('keyword') keyword: string,
  ) {

    try {
      const messages = await this.chatService.searchMessages(chatRoomId, keyword);
      return messages;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to search for messages.');
    }
  }


  @Patch(':id/delete-message')
  @ApiOperation({ summary: 'Soft delete a chat message' })
  @ApiResponse({
    status: 201,
    description: 'Chat message successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async softDeleteMessage(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.chatService.softDeleteMessage(id);
    return { success: true, ...result };
  }


  @Delete(':id/harddelete-message')
      @ApiOperation({ summary: 'Hard delete a chat message' })
      @ApiResponse({
        status: 201,
        description: 'Chat message successfully hard deleted.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
      @HttpCode(HttpStatus.OK)
      async hardDeleteMessage(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.chatService.hardDeleteMessage(id);
        return { success: true, ...result };
      }
}
