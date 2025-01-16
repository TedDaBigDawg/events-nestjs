import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GalleryService {
    constructor(private readonly prisma: DatabaseService) {}

    // Create a new gallery entry
    async createGallery(createGalleryDto: CreateGalleryDto) {
      try {
        const event = await this.prisma.event.findUnique({
                where: { id: createGalleryDto.event_id }
              })
        
              if (!event) {
                throw new NotFoundException('No event found');
              }
        const gallery = await this.prisma.gallery.create({
          data: {
            eventId: createGalleryDto.event_id,
            name: createGalleryDto.name,
            image: createGalleryDto.image,
          },
        });
        return { 
          success: true, 
          message: "Price Successfully created.",
          data: gallery,
         };
      } catch (error) {
        // Handle error (logger can be added here)
        throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    async updateGallery(id: string, updateGalleryDto: UpdateGalleryDto) {
        try {
          const existingGallery = await this.prisma.gallery.findUnique({
            where: { id },
          });
    
          if (!existingGallery) {
            throw new NotFoundException('Gallery not found');
          }
          const gallery = await this.prisma.gallery.update({
            where: { id },
            data: {
              eventId: updateGalleryDto.event_id,
              name: updateGalleryDto.name,
              image: updateGalleryDto.image,
            },
          });
          return { success: true, message: "Gallery successfully updated", data: gallery };
        } catch (error) {
          // Handle error (logger can be added here)
          throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Method to get all galleries for a specific event
  async getGalleriesByEventId(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId }
      })

      if (!event) {
        throw new NotFoundException('No event found');
      }
      const galleries = await this.prisma.gallery.findMany({
        where: { eventId: eventId },
      });

      if (!galleries || galleries.length === 0) {
        throw new NotFoundException('No galleries found');
      }

      return {
        success: true,
        message: "Galleries successfully updated",
        data: galleries,
      };
    } catch (error) {
      // Log the error or handle it (logger can be added here)
      console.error(error);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      
    }
}


   // Method to get a single gallery by its ID
   async getGalleryById(id: string) {
    try {
      const data = await this.prisma.gallery.findUnique({
        where: { id },
      });

      if (data) {
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          message: 'No data found',
        };
      }
    } catch (error) {
      // Log or handle error here (logger can be added)
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle getting all prices in database not soft deleted
  async getAllGalleries() {
    try {
      const galleries = await this.prisma.gallery.findMany({
        where: {
          deletedAt: null
        }
      });

      if (!galleries || galleries.length === 0) {
        throw new NotFoundException('No galleries found');
      }
      return {
        success: true,
        message: "Galleries successfully retrieved",
        data: galleries
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Method to handle getting all soft deleted galleries
  async getAllDeletedGalleries() {
    try {
      const galleries = await this.prisma.gallery.findMany({
        where: { deletedAt: { not: null } },
      });

      if (!galleries || galleries.length === 0) {
        throw new NotFoundException('No galleries found');
      }

      return {
        success: true,
        message: "Galleries successfully retrieved",
        data: galleries
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async softDeleteGallery(id: string): Promise<{ message: string }> {
      try {
        // Check if the price exists
        const gallery = await this.prisma.gallery.findUnique({ where: { id } });
        if (!gallery) {
          throw new NotFoundException('Gallery not found');
        }
  
        // Update the `deletedAt` field to the current timestamp
        await this.prisma.gallery.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
  
        return { message: 'Gallery soft deleted successfully' };
      } catch (error) {
        throw new InternalServerErrorException(
          error.message || 'An error occurred while soft deleting the gallery',
        );
      }
    }


    async hardDeleteGallery(id: string): Promise<{ message: string }> {
      try {
        // Check if the price exists
        const gallery = await this.prisma.gallery.findUnique({ where: { id } });
        if (!gallery) {
          throw new NotFoundException('Gallery not found');
        }
  
        // Update the `deletedAt` field to the current timestamp
        await this.prisma.gallery.delete({
          where: { id }
        });
  
        return { message: 'Gallery hard deleted successfully' };
      } catch (error) {
        throw new InternalServerErrorException(
          error.message || 'An error occurred while soft deleting the gallery',
        );
      }
    }


    
}

