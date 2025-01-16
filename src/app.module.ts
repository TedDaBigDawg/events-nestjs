import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PriceModule } from './price/price.module';
import { GalleryModule } from './gallery/gallery.module';
import { AttendeesModule } from './attendees/attendees.module';
//import { CardModule } from './card/card.module';
import { ArenaModule } from './arena/arena.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { InvitationModule } from './invitation/invitation.module';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    AuthModule,
    EventsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.your-email-provider.com', // SMTP server host
        port: 587, // SMTP port
        secure: false, // Set to true if you're using SSL (port 465)
        auth: {
          user: 'your-email@example.com', // Your email
          pass: 'your-email-password', // Your email password
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>', // Default from email
      },
      template: {
        dir: join(__dirname, 'templates'), // Directory for email templates
        adapter: new HandlebarsAdapter(), // Using Handlebars for email templating
        options: {
          strict: true,
        },
      },
    }),
    PriceModule,
    GalleryModule,
    AttendeesModule,
    // CardModule,
    ArenaModule,
    InvitationModule,
    ChatModule,
    PaymentModule,
  ],
  
})
export class AppModule {}
