// import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { Attendee, Gallery, Price } from '@prisma/client';
// import axios from 'axios';
// import { DatabaseService } from 'src/database/database.service';
// import { AttendeesService } from 'src/attendees/attendees.service';
// import { GalleryService } from 'src/gallery/gallery.service';
// import { PriceService } from 'src/price/price.service';
// import { pastItems, upcomingItems } from 'src/utils/date.utils';
// import { guid } from 'guid-typescript';
// import { PaymentService } from 'src/payment/payment.service';
// import { CardPaymentSuccessDto } from './dto/card.dto';

// interface EventWithDetails extends Event {
//     prices: Price[];
//     gallery: Gallery[];
//     attendees: Attendee[];
//   }


// @Injectable()
// export class CardService {
//     constructor(
//         private readonly databaseService: DatabaseService,
//         private readonly priceService: PriceService,
//         private readonly paymentService: PaymentService, 
//         private readonly galleryService: GalleryService,
//         private readonly attendeesService: AttendeesService,
//     ) {}

//     async cardGetEvents(page: number, limit: number, id: string, type: string): Promise<any> {
//       try {
//         const offset = page > 1 ? (limit * page) - limit : 0;
    
//         let url = `${process.env.SERVER_1}/connect/api/connect-vcard`;
//         if (id) url += `?id=${id}`;
//         if (type) url += `${id ? '&' : '?'}type=${type}`;
    
//         if (!id && !type) {
//           return { success: "false", message: "Invalid request parameters" };
//         }
    
//         const { data: response } = await axios.get(url);
//         if (response?.success !== 'true') {
//           return { success: "false", message: "Unable to connect to ISCE" };
//         }
    
//         const user_id = response?.data?.card?.user_id;
    
//         const events = await this.databaseService.event.findMany({
//           take: limit,
//           skip: offset,
//           where: { userId: user_id },
//         });
    
//         const updatedEvents = await Promise.all(
//           events.map(async (event) => {
//             const prices = await this.priceService.getPricesByEventId(event.id);
//             const gallery = await this.galleryService.getGalleriesByEventId(event.id);
//             const attendees = await this.attendeesService.getAttendeesByEventId(event.id);
    
//             return {
//               event,
//               prices,
//               gallery,
//               attendees,
//             };
//           })
//         );
    
//         // Transform `updatedEvents` to the required structure
//         const formattedEvents = updatedEvents.map(({ event, prices, gallery, attendees }) => ({
//           start_date: event.startDate, // Map the `startDate` to `start_date`
//           prices,
//           gallery,
//           attendees,
//         }));
    
//         const past = pastItems(formattedEvents);
//         const upcoming = upcomingItems(formattedEvents);
    
//         return {
//           success: "true",
//           data: {
//             count: formattedEvents.length,
//             all: formattedEvents,
//             upcoming,
//             past,
//           },
//         };
//       } catch (error) {
//         return {
//           success: "false",
//           message: error.message || 'A server error occurred',
//         };
//       }
//     }
    
    



//     async cardGetOpenEvent(page: number, limit: number, cleanName: string) {
//       const offset = page > 1 ? (limit * page) - limit : 0;
  
//       try {
//         // Fetch the event using Prisma
//       const event = await this.databaseService.event.findFirst({
//         skip: offset,
//         take: limit,
//         where: {
//           cleanName: cleanName,
//         },
//       });
  
//       if (!event) {
//         throw new NotFoundException('Unable to retrieve event');
//       }
  
//       // Add related data
//       const prices = await this.priceService.getPricesByEventId(event.id);
//       const gallery = await this.galleryService.getGalleriesByEventId(event.id);
//       const attendees = await this.attendeesService.getAttendeesByEventId(event.id);
  
//       const eventData = {
//         ...event,
//         prices,
//         gallery,
//         attendees,
//       };
  
//       return {
//         success: 'true',
//         data: {
//           count: 1,
//           event: eventData,
//         },
//       };
        
//       } catch (error) {
//         throw new InternalServerErrorException(error.message || 'An error occurred while retrieving events');
//       }
//     }



//     async cardSearchEvents(page: number, limit: number, query: string) {
//       const offset = page > 1 ? (limit * page) - limit : 0;
  
//       try {
//         // Fetch events from the database
//       const events = await this.databaseService.event.findMany({
//         skip: offset,
//         take: limit,
//         where: {
//           OR: [
//             { title: { contains: query, mode: 'insensitive' } },
//             { description: { contains: query, mode: 'insensitive' } },
//           ],
//           startDate: { gte: new Date() },
//         },
//       });
  
//       return {
//         success: 'true',
//         data: { events },
//       };    
//       } catch (error) {
//         throw new InternalServerErrorException(error.message || 'An error occurred while retrieving events');
//       }
      
//     }



//     async cardGetEvent(eventId: string, userId: string): Promise<any> {
//       try {
//         // Fetch the event from the database
//         const event = await this.databaseService.event.findFirst({
//           where: {
//             id: eventId,
//             userId: userId,
//           },
//         });
    
//         if (!event) {
//           return {
//             success: "false",
//             message: "No data found",
//           };
//         }
    
//         // Fetch related data
//         const prices = await this.priceService.getPricesByEventId(event.id);
//         const gallery = await this.galleryService.getGalleriesByEventId(event.id);
//         const attendees = await this.attendeesService.getAttendeesByEventId(event.id);
    
//         // Combine event with related data
//         const data = {
//           ...event,
//           prices,
//           gallery,
//           attendees,
//         };
    
//         return {
//           success: "true",
//           data,
//         };
//       } catch (error) {
//         console.error(error);
//         return {
//           success: "false",
//           message: "An error occurred",
//         };
//       }
//     }
    

//     async cardRegisterEvent(reqBody: any): Promise<any> {
//       try {
//         const event = await this.databaseService.event.findUnique({
//           where: { id: reqBody?.event_id },
//         });
  
//         if (!event) {
//           return { success: 'false', message: 'No event specified' };
//         }
  
//         let attendee = await this.databaseService.attendee.findFirst({
//           where: {
//             email: reqBody?.email,
//             eventId: reqBody?.event_id,
//           },
//         });
  
//         if (attendee) {
//           return {
//             success: 'false',
//             link: attendee.ticket,
//             message: 'You are already registered',
//           };
//         }
  
//         const price = await this.databaseService.price.findUnique({
//           where: { id: reqBody?.event_prices_id },
//         });
  
//         if (!price) {
//           return { success: 'false', message: 'No price specified' };
//         }
  
//         let eventToken = null;
//         const aid = guid();
//         const ticket = `${process.env.FRONTEND}/event/u/ticket/${aid}`;
//         const link = `${process.env.FRONTEND}/event/u/arena/${aid}`;
  
//         if (price?.withChips === 'with') {
//           eventToken = await this.databaseService.token.findFirst({
//             where: { used: false },
//           });
//         }
  
//         // Handle payment if price is greater than 0
//         if (price?.amount > 0) {
//           const form = _.pick(reqBody, ['amount', 'email', 'name']);
//           form.metadata = {
//             full_name: form?.name,
//             image: reqBody?.image,
//             phone: reqBody?.phone,
//             event_price_id: reqBody?.event_prices_id,
//             price_category: price?.title,
//             event_id: reqBody?.event_id,
//           };
//           form.amount = price?.amount * 100;
//           form.full_name = form?.name;
  
//           const paystack = await this.paymentService.initializePayment(form);
//           if (!paystack) {
//             return { success: 'false', message: 'Unable to make payment' };
//           }
  
//           await this.databaseService.payment.create({
//             data: {
//               id: guid(),
//               accessCode: paystack?.access_code,
//               authorization_url: paystack?.authorization_url,
//               reference: paystack?.reference,
//               metadata: JSON.stringify(form),
//             },
//           });
  
//           return {
//             success: 'true',
//             link: paystack?.authorization_url,
//           };
//         }
  
//         // Register attendee if no payment is required
//         attendee = await this.databaseService.attendee.create({
//           data: {
//             id: aid,
//             eventId: reqBody?.event_id,
//             image: reqBody?.image,
//             name: reqBody?.name,
//             email: reqBody?.email,
//             phone: reqBody?.phone,
//             priceCategory: price?.title,
//             ticket,
//             link,
//             token: eventToken?.token,
//           },
//         });
  
//         // Update token if used
//         if (eventToken?.token) {
//           await this.databaseService.token.update({
//             where: { token: eventToken?.token },
//             data: { used: true },
//           });
//         }
  
//         // Send email with ticket info
//         const mail = await sendMail({
//           from: `${event?.title} <event@isce.app>`,
//           to: reqBody?.email,
//           subject: `Ticket: ${event?.title}`,
//           data: {
//             name: reqBody?.name,
//             qrcode: getQR(link),
//             ticket,
//             pass_type: price?.title,
//             image: reqBody?.image,
//             event_image: event?.image,
//             title: event?.title,
//             arena: link,
//             token: eventToken?.token,
//             event_date: displayDate(event?.start_date),
//             event,
//             attendee,
//             price,
//           },
//         });
  
//         if (!mail) {
//           return { success: 'false', message: 'Unable to send mail' };
//         }
  
//         return {
//           success: 'true',
//           link: ticket,
//           message: 'You have been successfully registered',
//         };
//       } catch (error) {
//         console.error(error);
//         return { success: 'false', message: 'An error occurred' };
//       }
//     }


//     async handlePaymentSuccess(body: CardPaymentSuccessDto) {
//       const vpay = await verifyPayment(body.reference);
//       if (!vpay) {
//         return { success: 'false', message: 'Invalid transaction' };
//       }
  
//       const metadata = vpay.data.metadata;
  
//       const event = await this.databaseService.event.findUnique({ where: { id: metadata.event_id } });
//       if (!event) {
//         return { success: 'false', message: 'No event specified' };
//       }
  
//       let attendee = await this.databaseService.attendee.findUnique({
//         where: {
//           email_event_id: { email: vpay.data.customer.email, event_id: metadata.event_id },
//         },
//       });
  
//       if (attendee) {
//         return { success: 'true', message: 'You are already registered', link: attendee.ticket };
//       }
  
//       const price = await this.databaseService.price.findUnique({ where: { id: metadata.event_price_id } });
//       if (!price) {
//         return { success: 'false', message: 'No price specified' };
//       }
  
//       let eventToken = null;
//       const aid = guid();
//       const ticket = `${process.env.FRONTEND}/event/u/ticket/${aid}`;
//       const link = `${process.env.FRONTEND}/event/u/arena/${aid}`;
  
//       if (price?.withChips === 'with') {
//         eventToken = await this.databaseService.token.findFirst({ where: { used: false } });
//       }
  
//       const newAttendee = await this.databaseService.attendee.create({
//         data: {
//           id: aid,
//           event_id: metadata.event_id,
//           event_price_id: metadata.event_price_id,
//           image: metadata.image,
//           name: metadata.full_name,
//           email: metadata.email,
//           phone: metadata.phone,
//           price_category: price.title,
//           ticket,
//           link,
//           token: eventToken?.token,
//         },
//       });
  
//       if (eventToken?.token) {
//         await this.databaseService.token.update({
//           where: { token: eventToken.token },
//           data: { used: true },
//         });
//       }
  
//       const mail = await sendMail({
//         from: `${event.title} <event@isce.app>`,
//         to: metadata.email,
//         subject: `Ticket: ${event.title}`,
//         data: {
//           name: metadata.full_name,
//           qrcode: getQR(link),
//           ticket,
//           pass_type: price.title,
//           image: metadata.image,
//           title: event.title,
//           arena: link,
//           token: eventToken?.token,
//           event_date: event.start_date,
//           event,
//           attendee: newAttendee,
//           price,
//         },
//       });
  
//       if (!mail) {
//         return { success: 'false', message: 'Unable to send mail' };
//       }
  
//       return { success: 'true', link: ticket, message: 'You have been successfully registered' };
//     }
// }


