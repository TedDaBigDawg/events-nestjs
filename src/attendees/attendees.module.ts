import { Module } from '@nestjs/common';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/services/mailService';

@Module({
  controllers: [AttendeesController],
  providers: [AttendeesService, DatabaseService, EmailService]
})
export class AttendeesModule {}
