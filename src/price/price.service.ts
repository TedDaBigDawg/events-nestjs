import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePriceDto } from './dto/price.dto';
import { Price } from '@prisma/client';
import { UpdatePriceDto } from './dto/price.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PriceService {

  private readonly logger = new Logger(PriceService.name);

  constructor(private readonly prisma: DatabaseService) {} // Inject PrismaService

  // Method to handle creating prices
  async createPrice(createPriceDto: CreatePriceDto) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: createPriceDto.event_id }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      
      const price = await this.prisma.price.create({
        data: {
          ...createPriceDto,
          event: {
            connect: { id: createPriceDto.event_id }, // Use `connect` for existing event
          },
        }
      });
      return {
        success: true,
        message: "Price Successfully created.",
        data: price
      }
    } catch (error) {
      this.logger.error('Error creating price', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle the updating of prices using the id
  async updatePrice(id: string, updatePriceDto: UpdatePriceDto) {
    try {
      const existingPrice = await this.prisma.price.findUnique({
        where: { id },
      });

      if (!existingPrice) {
        throw new NotFoundException('Price not found');
      }

      const updatedPrice = await this.prisma.price.update({
        where: { id },
        data: updatePriceDto,
      });

      return {
        success: true,
        message: "Price successfully updated",
        data: updatedPrice
      }
    } catch (error) {
      this.logger.error('Error updating price', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


// Method to handle getting all the prices related to a specific event
async getPricesByEventId(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      const prices = await this.prisma.price.findMany({
        where: { eventId: eventId },
      });

      if (!prices || prices.length === 0) {
        throw new NotFoundException('No prices found');
      }

      return {
        success: true,
        message: "Prices successfully retrieved",
        data: prices
      }
    } catch (error) {
      this.logger.error('Error fetching prices', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

// Method to handle getting a specific price using the unique price id(PK)
  async getPriceById(priceId: string) {
    try {
      const price = await this.prisma.price.findUnique({
        where: { id: priceId },
      });

      if (!price) {
        throw new NotFoundException('Price not found');
      }

      return {
        success: true,
        message: "Price successfully retrieved",
        data: price
      }
    } catch (error) {
      this.logger.error('Error fetching price', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all prices in database not soft deleted
  async getAllPrices() {
    try {
      const prices = await this.prisma.price.findMany({
        where: {
          deletedAt: null
        }
      });

      if (!prices || prices.length === 0) {
        throw new NotFoundException('No prices found');
      }
      return {
        success: true,
        message: "Prices successfully retrieved",
        data: prices
      }
    } catch (error) {
      this.logger.error('Error fetching price', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all soft deleted prices
  async getAllDeletedPrices() {
    try {
      const prices = await this.prisma.price.findMany({
        where: { deletedAt: { not: null } },
      });

      if (!prices || prices.length === 0) {
        throw new NotFoundException('No prices found');
      }

      return {
        success: true,
        message: "Price successfully retrieved",
        data: prices
      }
    } catch (error) {
      this.logger.error('Error fetching prices', error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async softDeletePrice(id: string): Promise<{ message: string }> {
    try {
      // Check if the price exists
      const price = await this.prisma.price.findUnique({ where: { id } });
      if (!price) {
        throw new NotFoundException('Price not found');
      }

      // Update the `deletedAt` field to the current timestamp
      await this.prisma.price.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return { message: 'Price soft deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while soft deleting the price',
      );
    }
  }


  async hardDeletePrice(id: string): Promise<{ message: string }> {
    try {
      // Check if the price exists
      const price = await this.prisma.price.findUnique({ where: { id } });
      if (!price) {
        throw new NotFoundException('Price not found');
      }

      // Update the `deletedAt` field to the current timestamp
      await this.prisma.price.delete({
        where: { id }
      });

      return { message: 'Price hard deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while hard deleting the price',
      );
    }
  }

}
