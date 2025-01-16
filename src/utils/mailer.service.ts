// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { Logger } from '@nestjs/common';
// import { ticketTemplate2 } from './mailer.utils.ts';  // Assuming you have this function to generate the email body

// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);

//   private transport = nodemailer.createTransport({
//     service: 'gmail',  // Update with your mail service (Gmail, SendGrid, etc.)
//     auth: {
//       user: process.env.EMAIL_USER,  // Email address
//       pass: process.env.EMAIL_PASSWORD,  // Email password or app-specific password
//     },
//   });

//   async sendMail(data: any): Promise<any> {
//     const d_data = data?.data;

//     const mailOptions = {
//       from: data?.from || '"ISCE Support" <event@isce.app>',
//       to: data?.to,
//       subject: data?.subject,
//       html: ticketTemplate2(d_data),  // Assuming you have a ticket template function
//     };

//     try {
//       const info = await this.transport.sendMail(mailOptions);
//       return info;
//     } catch (error) {
//       this.logger.error('Error sending email: ', error);
//       return null;
//     }
//   }
// }
