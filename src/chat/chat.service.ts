import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddMemberDto, CreateChatRoomDto, SendMessageDto, UpdateChatMessageDto, UpdateChatRoomDto } from './dto/chat.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: DatabaseService) {}

  async createChatRoom(dto: CreateChatRoomDto) {
    try {
        const { event_id, event_name } = dto;

        const event = await this.prisma.event.findUnique({
            where: { id: event_id }
        });

        if (!event) {
            throw new NotFoundException('No event found');
        }
      // Create a new chat room
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          event_id: event_id,
          event_name: event.cleanName,
        },
      });

      return {
        success: true,
        message: 'Chat room created successfully!',
        data: chatRoom,
      };
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw new InternalServerErrorException('Failed to create chat room');
    }
  }


  async updateChatRoom(id: string, dto: UpdateChatRoomDto) {
      try {
          const chatRoom = await this.prisma.chatRoom.findUnique({
              where: { id },
            });
        
            if (!chatRoom) {
              throw new NotFoundException(`Chatroom with ID ${id} not found`);
            }
        
            // Update the chatroom and return the updated record
            const updatedChatroom = await this.prisma.chatRoom.update({
              where: { id },
              data: dto,
            });
        
            return {
                success: true,
                message: "Chatroom successfully updated",
                data: updatedChatroom
            }
      } catch (error) {
          throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // Method to handle getting a specific chatroom using the unique price id(PK)
  async getChatroomById(Id: string) {
    try {
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: Id },
      });

      if (!chatRoom) {
        throw new NotFoundException('Chatroom not found');
      }

      return {
        success: true,
        message: "Chatroom successfully retrieved",
        data: chatRoom
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    async getAllChatrooms() {
        try {
          const chatRoom = await this.prisma.chatRoom.findMany({
            where: {
              deletedAt: null
            }
          });
    
          if (!chatRoom || chatRoom.length === 0) {
            throw new NotFoundException('No chatroom found');
          }
          return {
            success: true,
            message: "Chatrooms successfully retrieved",
            data: chatRoom
          }
        } catch (error) {
          throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      // Method to handle getting the chatroom related to a specific event
async getChatroomByEventId(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      const chatroom = await this.prisma.chatRoom.findFirst({
        where: { event_id: eventId },
      });

      if (!chatroom) {
        throw new NotFoundException('No chatroom found for the event');
      }

      return {
        success: true,
        message: "Chatroom successfully retrieved",
        data: chatroom
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all soft deleted chatrooms
  async getAllDeletedChatrooms() {
    try {
      const chatrooms = await this.prisma.chatRoom.findMany({
        where: { deletedAt: { not: null } },
      });

      if (!chatrooms || chatrooms.length === 0) {
        throw new NotFoundException('No chatrooms found');
      }

      return {
        success: true,
        message: "Chatrooms successfully retrieved",
        data: chatrooms
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async softDeleteChatroom(id: string): Promise<{ message: string }> {
    try {
      // Check if the chatroom exists
      const chatroom = await this.prisma.chatRoom.findUnique({ where: { id } });
      if (!chatroom) {
        throw new NotFoundException('Chatroom not found');
      }

      // Update the `deletedAt` field to the current timestamp
      await this.prisma.chatRoom.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return { message: 'Chatroom soft deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while soft deleting the chatroom',
      );
    }
  }


  async hardDeleteChatroom(id: string): Promise<{ message: string }> {
    try {
      // Check if the chatroom exists
      const chatroom = await this.prisma.chatRoom.findUnique({ where: { id } });
      if (!chatroom) {
        throw new NotFoundException('Chatroom not found');
      }

      // Update the `deletedAt` field to the current timestamp
      await this.prisma.chatRoom.delete({
        where: { id }
      });

      return { message: 'Chatroom hard deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while hard deleting the chatroom',
      );
    }
  }


   async addMemberToChatRoom(chatRoomId: string, addMemberDto: AddMemberDto) {
    try {
      // Check if the chat room exists
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    // Check if the attendee exists
    const attendee = await this.prisma.attendee.findUnique({
      where: { id: addMemberDto.attendee_id },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    // Add the attendee to the chat room
    const updatedChatRoom = await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        members: {
          connect: { id: addMemberDto.attendee_id },
        },
      },
      include: { members: true }, // Include members for the response
    });

    return {
      success: true,
      message: "Member added successfully",
      data: updatedChatRoom
    } 
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while adding member to the chatroom',
      ); 
    }
  }


  async getChatRoomMembers(chatRoomId: string) {
    try {
      // Assuming there's a relation between ChatRoom and User models (adjust as necessary)
      const members = await this.prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
          members: true, // Adjust to your actual relation field
        },
      });

      if (!members) {
        return { message: 'Chat room not found', data: [] };
      }

      return {
        success: true,
        message: 'Chat room members retrieved successfully',
        data: members.members, // Assuming members are an array of user data
      };
    } catch (error) {
      return { message: 'Error retrieving chat room members', error: error.message };
    }
  }



  

  // Chat messagess methods

  async sendMessage(chatRoomId: string, sendMessageDto: SendMessageDto) {

    try {
      // Check if the chat room exist
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    // Check if the attendee exists
    const attendee = await this.prisma.attendee.findUnique({
      where: { id: sendMessageDto.attendee_id },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    // Create a new message in the chat room
    const newMessage = await this.prisma.chatMessage.create({
      data: {
        chat_room_id: chatRoomId,
        attendee_id: sendMessageDto.attendee_id,
        message: sendMessageDto.message,
      },
      include: {
        attendee: true, // Include attendee details in the response
      },
    });

    return newMessage;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred while sending message to the chatroom');
    }
  }


  async getAllMessages(chatRoomId: string) {
    try {
      // Check if the chat room exists
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    // Retrieve all messages for the chat room
    const messages = await this.prisma.chatMessage.findMany({
      where: { chat_room_id: chatRoomId },
      include: {
        attendee: true, // Include attendee details for context
      },
      orderBy: {
        createdAt: 'asc', // Sort messages by creation time (oldest first)
      },
    });

    if (!messages || messages.length === 0) {
      throw new NotFoundException('No messages found');
    }

    return {
      success: true,
      message: "Chatroom messages retrieved successfully",
      data: messages
    }
      
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred while retrieving messages');
    }
}


async editMessage(messageId: string, updateMessageDto: UpdateChatMessageDto) {
  try {
    const { message } = updateMessageDto;

  // Validate message content
  if (!message || message.trim() === '') {
    throw new BadRequestException('Message content cannot be empty.');
  }

  // Check if the message exists
  const existingMessage = await this.prisma.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!existingMessage) {
    throw new NotFoundException('Message not found.');
  }

  // Update the message
  const updatedMessage = await this.prisma.chatMessage.update({
    where: { id: messageId },
    data: { message },
  });

  return {
    success: true,
    message: "Message updated successfully",
    data: updatedMessage
  }
  } catch (error) {
    throw new InternalServerErrorException(error.message || 'An error occurred while editing message');
  }
  
}


async searchMessages(chatRoomId: string, keyword: string) {
  try {
    if (!keyword || keyword.trim() === '') {
      throw new NotFoundException('Keyword cannot be empty.');
    }
  
    // Search for messages containing the keyword in the specified chat room
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chat_room_id: chatRoomId,
        message: {
          contains: keyword, // Case-insensitive partial match
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!messages || messages.length === 0) {
      throw new NotFoundException('No messages found');
    }
  
    return {
      success: true,
      message: "Message retrieved successfully",
      data: messages
    }
  } catch (error) {
    throw new InternalServerErrorException(error.message || 'An error occurred while searching for messages');
  }
  
}


async softDeleteMessage(id: string): Promise<{ message: string }> {
  try {
    // Check if the Message exists
    const message = await this.prisma.chatMessage.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Update the `deletedAt` field to the current timestamp
    await this.prisma.chatMessage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Message soft deleted successfully' };
  } catch (error) {
    throw new InternalServerErrorException(
      error.message || 'An error occurred while soft deleting the message',
    );
  }
}


async hardDeleteMessage(id: string): Promise<{ message: string }> {
  try {
    // Check if the message exists
    const message = await this.prisma.chatMessage.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Update the `deletedAt` field to the current timestamp
    await this.prisma.chatMessage.delete({
      where: { id }
    });

    return { message: 'Message hard deleted successfully' };
  } catch (error) {
    throw new InternalServerErrorException(
      error.message || 'An error occurred while hard deleting the message',
    );
  }
}

}

