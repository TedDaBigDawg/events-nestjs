import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as guid } from 'uuid';
import slugify from 'slugify';
import { sortDate } from 'src/utils/sort.utils';
import { Price } from '@prisma/client';
import { MailService } from 'src/utils/mail.service';
import { PriceService } from 'src/price/price.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { GalleryService } from 'src/gallery/gallery.service';
import { AttendeesService } from 'src/attendees/attendees.service';
import { connect } from 'http2';
import { Request } from 'express';

@Injectable()
export class EventService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly priceService: PriceService, 
    private readonly galleryService: GalleryService,
    private readonly attendeesService: AttendeesService,
  ) {} // Inject PrismaService and mail service

  // Method to handle all event creation logic
  async createEvent(createEventDto: CreateEventDto, user: any,) {

    console.log('EVENTUSER', user);
    // console.log('EVENTISCE', req.isce_auth);
    if (!user?.id) {
      throw new HttpException('User ID is missing', HttpStatus.BAD_REQUEST);
    }
    try {
      const { startDate, endDate, title, town, location, description, image } = createEventDto;
      const clean_name = slugify(createEventDto?.title);
      console.log('EVENTUSER', user);

      // Check if event with the slug already exists
      const existingEvent = await this.databaseService.event.findUnique({
        where: { cleanName: clean_name },
      });
      if (existingEvent) {
        throw new HttpException('Event has already been created or already exists', HttpStatus.BAD_REQUEST);
      }

      // Validate prices
      const prices = createEventDto?.prices;

      let formattedStartDate: string;
            let utcStartDate: Date;

            if (startDate instanceof Date) {
              // If already a Date object, format it
              formattedStartDate = startDate.toISOString().split('T')[0];
            } else {
              // If dob is a string, parse it to a Date
              const parsedStartDate = new Date(startDate);

              if (isNaN(parsedStartDate.getTime())) {
                throw new Error('Invalid date format for start date');
              }

              utcStartDate = new Date(Date.UTC(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate()));

              console.log('utcStartDate', utcStartDate);
            }


            let formattedEndDate: string;
            let utcEndDate: Date;

            if (endDate) {
            if (endDate instanceof Date) {
              // If already a Date object, format it
              formattedEndDate = endDate.toISOString().split('T')[0];
            } else {
              // If dob is a string, parse it to a Date
              const parsedEndDate = new Date(endDate);

              if (isNaN(parsedEndDate.getTime())) {
                throw new Error('Invalid date format for End date');
              }

              utcEndDate = new Date(Date.UTC(parsedEndDate.getFullYear(), parsedEndDate.getMonth(), parsedEndDate.getDate()));

              console.log('utcEndDate', utcEndDate);
            }
            }
            

      // Create event in the database
      const event = await this.databaseService.event.create({
        data: {
          id: guid(), // Use the user object passed from the request
          image: createEventDto?.image,
          cleanName: clean_name,
          title: createEventDto?.title,
          location: createEventDto?.location,
          town: createEventDto.town,
          description: createEventDto?.description,
          startDate: utcStartDate,
          endDate: utcEndDate,
          userId: user.id
        },
      });

      if (!event?.id) {
        throw new HttpException('Unable to create event', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Create prices related to the event
      if (prices) {
        for (const price of prices) {
          await this.databaseService.price.create({
            data: {
              id: guid(),
              event: {
                connect: { id: event.id }, // Use `connect` for existing event
              },
              ...price,
              orderAmount: 0,
            },
          });
        }
      }

      // Create gallery related to the event
      const gallery = createEventDto?.galleries;
      if (gallery) {
        for (const item of gallery) {
          await this.databaseService.gallery.create({
            data: {
              id: guid(),
              event: {
                connect: { id: event.id }, // Use `connect` for existing event
              },
              ...item,
            },
          });
        }
      }

      const updatedEvent = await this.databaseService.event.findUnique({
        where: { id: event.id },
        include: { prices: true, galleries: true }
      })

      // Return the created event
      return updatedEvent;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Method to handle event update logic
  async updateEvent(eventId: string, eventData: UpdateEventDto) {
    try {
      // Find event by ID
      const event = await this.databaseService.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
      }

      if (eventData.title) {
      // Prepare updated data
      eventData.cleanName = slugify(eventData?.title);
      }

      let formattedStartDate: string;
            let utcStartDate: Date;

            if (eventData.startDate) {
            if (eventData.startDate instanceof Date) {
              // If already a Date object, format it
              formattedStartDate = eventData.startDate.toISOString().split('T')[0];
            } else {
              // If dob is a string, parse it to a Date
              const parsedStartDate = new Date(eventData.startDate);

              if (isNaN(parsedStartDate.getTime())) {
                throw new Error('Invalid date format for start date');
              }

              utcStartDate = new Date(Date.UTC(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate()));

              console.log('utcStartDate', utcStartDate);

              eventData.startDate = utcStartDate;
            }
          }


            let formattedEndDate: string;
            let utcEndDate: Date;

            if (eventData.endDate) {
            if (eventData.endDate instanceof Date) {
              // If already a Date object, format it
              formattedEndDate = eventData.endDate.toISOString().split('T')[0];
            } else {
              // If dob is a string, parse it to a Date
              const parsedEndDate = new Date(eventData.endDate);

              if (isNaN(parsedEndDate.getTime())) {
                throw new Error('Invalid date format for End date');
              }

              utcEndDate = new Date(Date.UTC(parsedEndDate.getFullYear(), parsedEndDate.getMonth(), parsedEndDate.getDate()));

              console.log('utcEndDate', utcEndDate);

              eventData.endDate = utcEndDate;
            }
            }
      // Update the event in the database
      await this.databaseService.event.update({
        where: { id: eventId },
        data: {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          town: eventData.town,
          image: eventData.image,
          cleanName: eventData.cleanName,
          startDate: eventData.startDate,
          endDate: eventData.endDate
        }
      });

      // Handle prices if provided
      const prices = eventData?.prices;
      if (prices?.length > 0) {
        // Delete existing prices
        await this.databaseService.price.deleteMany({
          where: { eventId: event.id },
        });

        // Add new prices
        for (const price of prices) {
          await this.databaseService.price.create({
            data: {
              id: guid(),
              eventId: event.id,
              ...price,
              orderAmount: 0,
            },
          });
        }
      }

      // Handle gallery if provided
      const gallery = eventData?.galleries;
      if (gallery?.length > 0) {
        // Delete existing gallery
        await this.databaseService.gallery.deleteMany({
          where: { eventId: event.id },
        });

        // Add new gallery items
        for (const item of gallery) {
          await this.databaseService.gallery.create({
            data: {
              id: guid(),
              eventId: event.id,
              ...item,
            },
          });
        }
      }

      const updatedEvent = await this.databaseService.event.findUnique({
        where: { id: event.id },
        include: { prices: true, galleries: true }
      })

      return { success: true, message: 'Event updated successfully', data: { updatedEvent } };
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async softDeleteEvent(eventId: string) {
    try {
      if (!eventId) {
        throw new HttpException('Invalid event ID', HttpStatus.BAD_REQUEST);
      }
  
      // Find the event to ensure it exists
      const event = await this.databaseService.event.findUnique({
        where: { id: eventId },
      });
  
      if (!event) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
  
      const now = new Date();
  
      // Soft delete the event
      await this.databaseService.event.update({
        where: { id: eventId },
        data: { deletedAt: now },
      });
  
      // Soft delete related prices
      await this.databaseService.price.updateMany({
        where: { eventId },
        data: { deletedAt: now },
      });
  
      // Soft delete related galleries
      await this.databaseService.gallery.updateMany({
        where: { eventId },
        data: { deletedAt: now },
      });
  
      return {
        message: 'Event and related records successfully soft-deleted',
        data: { eventId, deletedAt: now },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  // Method to handle event deletion logic
  async deleteEvent(eventId: string) {
    try {
      if (!eventId) {
        throw new HttpException('Invalid event id', HttpStatus.NOT_FOUND);
      }

      const event = await this.databaseService.event.delete({
        where: { id: eventId },
      });

      if (!event) {
        throw new HttpException('Event not available', HttpStatus.NOT_FOUND);
      }
      
      return {
        message: "Event successfully deleted",
        data: event
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getAllEvents(page: number, limit: number) {
    try {
      const offset = page > 1 ? (page - 1) * limit : 0;

      // Fetch all events with pagination
      const events = await this.databaseService.event.findMany({
        skip: offset,
        take: limit,
        where: {
          deletedAt: null, // Exclude soft-deleted events
        },
        orderBy: {
          startDate: 'asc', // Sort by start date
        },
        include: {
          prices: true, // Include related prices
          galleries: true, // Include related gallery items
        },
      });

      if (!events || events.length === 0) {
        throw new NotFoundException('No events found');
      }

      // Count total number of events (for pagination metadata)
      const totalEvents = await this.databaseService.event.count({
        where: {
          deletedAt: null,
        },
      });

      return {
        success: true,
        data: {
          events,
          total: totalEvents,
          currentPage: page,
          totalPages: Math.ceil(totalEvents / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getEvents(userId: string, page: number, limit: number) {
    try {
      const offset = page > 1 ? (page - 1) * limit : 0;

      // Fetch events associated with the user
      const events = await this.databaseService.event.findMany({
        where: { userId },
        skip: offset,
        take: limit,
      });

      if (!events || events.length === 0) {
        throw new NotFoundException('No events found');
      }

      // Fetch related data for each event
      const updatedEvents = await Promise.all(
        events.map(async (event) => {
          const prices = await this.databaseService.price.findMany({ where: { eventId: event.id } });
          const gallery = await this.databaseService.gallery.findMany({ where: { eventId: event.id } });
          const attendees = await this.databaseService.attendee.findMany({ where: { eventId: event.id } });

          return { ...event, prices, gallery, attendees };
        }),
      );

      // Sort events by date
      const sortedEvents = sortDate(updatedEvents);

      // Separate past and upcoming events
      const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
      const past = sortedEvents.filter(({ startDate }) => new Date(startDate) < yesterday);
      const upcoming = sortedEvents.filter(({ startDate }) => new Date(startDate) >= yesterday);

      return {
        count: sortedEvents.length,
        all: sortedEvents,
        upcoming,
        past,
      };
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getEvent(eventId: string) {
    try {
      // Fetch the event with the specified ID and user ID
      const event = await this.databaseService.event.findFirst({
        where: {
          id: eventId,
          deletedAt: null, // Exclude soft-deleted events if applicable
        },
      });

      if (!event) {
        throw new HttpException('No data found', HttpStatus.NOT_FOUND);
      }

      // Determine if the event is in the past
      const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
      const past = new Date(event.startDate) < yesterday;

      // Fetch related data
      const [prices, gallery, attendees, chats] = await Promise.all([
        this.getPrices(event.id),
        this.getGallery(event.id),
        this.getAttendees(event.id),
        this.getChats(event.id),
      ]);

      // Sort chats by `updatedAt`
      const sortedChats = chats.sort((a, b) =>
        a.updatedAt < b.updatedAt ? -1 : a.updatedAt > b.updatedAt ? 1 : 0,
      );

      // Prepare the response data
      const data = {
        ...event,
        gallery,
        prices,
        attendees,
        past,
        chats: sortedChats,
      };

      return {
        message: "Event successfully retrieved",
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  private async getPrices(eventId: string) {
    return await this.databaseService.price.findMany({ where: { eventId: eventId } });
  }

  private async getGallery(eventId: string) {
    return await this.databaseService.gallery.findMany({ where: { eventId: eventId } });
  }

  private async getAttendees(eventId: string) {
    return await this.databaseService.attendee.findMany({ where: { eventId: eventId } });
  }

  private async getChats(eventId: string) {
    const chatRoom = await this.databaseService.chatRoom.findFirst({
      where: { event_id: eventId }
    })
    return await this.databaseService.chatMessage.findMany({ where: { chat_room_id: chatRoom.id } });
  }



  async searchEvents(query: string, page: number, limit: number) {
    try {
      const offset = page > 1 ? (page - 1) * limit : 0;

      // Search for events using query
      const events = await this.databaseService.event.findMany({
        skip: offset,
        take: limit,
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          // Uncomment if you want to filter events starting from today or later
          // startDate: {
          //   gte: new Date(),
          // },
        },
      });

      if (!events || events.length === 0) {
        throw new NotFoundException('No events found');
      }

      return {
        message: "Events successfully found",
        data: events
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchEventsByTown(query: string, page: number, limit: number) {
    try {
      const offset = page > 1 ? (page - 1) * limit : 0;

      const events = await this.databaseService.event.findMany({
        skip: offset,
        take: limit,
        where: {
          town: {
            contains: query, // Prisma's equivalent of Sequelize's `LIKE`
            mode: 'insensitive', // Makes the search case-insensitive
          },
          deletedAt: null, // Exclude soft-deleted events, if applicable
        },
      });

      const totalEvents = await this.databaseService.event.count({
        where: {
          town: {
            contains: query,
            mode: 'insensitive',
          },
          deletedAt: null,
        },
      });

      if (!events || events.length === 0) {
        throw new NotFoundException('No events found');
      }

      return {
        message: "Events successfully found",
        success: true,
        data: {
          events,
          total: totalEvents,
          currentPage: page,
          totalPages: Math.ceil(totalEvents / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // // Method to handle fetching events logic
  // async getEvents(query: any, user: any) {
  //   try {
  //     let offset = 0;
  //     const page = Number(query.page) || 1;
  //     const limit = Number(query.limit) || 100;

  //     if (page > 1) {
  //       offset = limit * page - limit;
  //     }

  //     // Fetch events for the specific user
  //     const events = await this.databaseService.event.findMany({
  //       where: {
  //         userId: user.user_id,
  //       },
  //       take: limit,
  //       skip: offset,
  //     });

  //     // Process events
  //     const updatedEvents = await Promise.all(events.map(async (event) => {
  //       const item = event; // Prisma returns the entire object, not just dataValues
  //       const prices = await this.priceService.getPricesByEventId(item.id);
  //       const gallery = await this.galleryService.getGalleries(item.id);
  //       const attendees = await this.attendeesService.getAttendeesByEventId(item.id);
  //       return { ...item, prices, gallery, attendees };
  //     }));

  //     const sortedEvents = sortDate(updatedEvents);

  //     const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);

  //     const past = sortedEvents.filter(({ start_date }) => new Date(start_date) < yesterday);
  //     const upcoming = sortedEvents.filter(({ start_date }) => new Date(start_date) >= yesterday);

  //     return {
  //       count: sortedEvents.length,
  //       all: sortedEvents,
  //       upcoming,
  //       past,
  //       user,
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  async getRequestedCards(event_price_id: string, order_amount: number, user: any) {
    // Find price entry for the given event price ID
    const price = await this.databaseService.price.findUnique({
      where: { id: event_price_id },
    });

    // Throw an exception if price is not found
    if (!price) {
      throw new NotFoundException('Price not found');
    }

    // Calculate updated order amount
    const updatedOrder = +order_amount + price.orderAmount;

    // Check if updated order amount exceeds the limit
    if (updatedOrder > price.attendees) {
      throw new BadRequestException('Maximum amount reached');
    }

    // Send mail to ISCE and user about the card request
    await this.mailService.sendCardRequestMailToISCE(user, price, updatedOrder);
    await this.mailService.sendCardRequestMailToUser(user, price, updatedOrder);

    // Update the price table with the new order amount
    await this.databaseService.price.update({ 
        where: { id: event_price_id },
        data: { orderAmount: updatedOrder },
    });

    // Return the updated order amount as a response object
    return { success: 'true', order_amount: updatedOrder };
  }
}
