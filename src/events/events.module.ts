import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { MailService } from 'src/utils/mail.service';
import { GalleryService } from 'src/gallery/gallery.service';
import { AttendeesService } from 'src/attendees/attendees.service';
import { PriceService } from 'src/price/price.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/services/mailService';

@Module({
  providers: [EventService, MailService, DatabaseService, GalleryService, AttendeesService, PriceService, EmailService],
  controllers: [EventController]
})
export class EventsModule {}
