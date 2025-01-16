// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCardRequestMailToISCE(user: any, price: any, updatedOrder: number) {
    // Email subject and content
    const subject = `Card Request for Event ${price.event_id}`;
    const content = `
      <p>A card request has been made for the following event:</p>
      <p><strong>Event ID:</strong> ${price.event_id}</p>
      <p><strong>User:</strong> ${user.name} (${user.email})</p>
      <p><strong>Requested Cards:</strong> ${updatedOrder}</p>
      <p><strong>Total Order Amount:</strong> ${updatedOrder}</p>
    `;

    // Send email using mailer service
    try {
      await this.mailerService.sendMail({
        to: 'isce@example.com', // ISCE's email address
        from: 'noreply@example.com', // From email address
        subject: subject, // Email subject
        html: content, // Email content in HTML format
      });

      console.log('Mail sent to ISCE successfully!');
    } catch (error) {
      console.error('Error sending mail to ISCE:', error);
      throw new Error('Unable to send mail to ISCE');
    }
  }

  async sendCardRequestMailToUser(user: any, price: any, updatedOrder: number) {
    // Email subject and content for user
    const subject = `Your Card Request for Event ${price.event_id}`;
    const content = `
      <p>Dear ${user.name},</p>
      <p>Your card request has been received for the following event:</p>
      <p><strong>Event ID:</strong> ${price.event_id}</p>
      <p><strong>Requested Cards:</strong> ${updatedOrder}</p>
      <p>We will process your request shortly.</p>
    `;

    // Send email to the user
    try {
      await this.mailerService.sendMail({
        to: user.email, // User's email address
        from: 'noreply@example.com', // From email address
        subject: subject, // Email subject
        html: content, // Email content in HTML format
      });

      console.log('Mail sent to user successfully!');
    } catch (error) {
      console.error('Error sending mail to user:', error);
      throw new Error('Unable to send mail to user');
    }
  }
}
