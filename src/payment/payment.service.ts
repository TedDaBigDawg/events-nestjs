import { Invitation } from './../../node_modules/.prisma/client/index.d';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { InitializePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private readonly PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY; // Store in .env file

  constructor(private prisma: DatabaseService, private httpService: HttpService) {}

  async initializePayment(dto: InitializePaymentDto, user: any) {
    try {
      const { priceId, invitationId } = dto;

      // Validate the invitation
      const invitation = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
      if (!invitation) {
        throw new HttpException('Invitation not valid', HttpStatus.NOT_FOUND);
      }

      // Validate the event
      const event = await this.prisma.event.findUnique({ where: { id: invitation.event_id } });
      if (!event) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
  
      

      // Validate the price
      const price = await this.prisma.price.findUnique({ where: { id: priceId } });
      if (!price) {
        throw new HttpException('Price not found', HttpStatus.NOT_FOUND);
      }
  
      // Prepare the payment data
      const paymentData = {
        email: user.email,
        amount: price.amount * 100, // Paystack requires amount in kobo
        reference: `${Date.now()}-${user.id}`,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`, // Your frontend callback URL
      };
  
      // Send a request to Paystack to initialize the payment
      const response = await lastValueFrom(
        this.httpService.post('https://api.paystack.co/transaction/initialize', paymentData, {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET}`,
          },
        }),
      );
  
      // Save the payment details in the database
      const payment = await this.prisma.payment.create({
        data: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          invitationId: invitationId,
          priceId: priceId,
          reference: paymentData.reference,
          status: 'pending',
        },
      });
  
      return {
        success: true,
        message: 'Payment initialized successfully',
        data: response.data,
        payment: payment
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Payment initialization failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async verifyPayment(reference: string) {
    try {
      // Verify the payment with Paystack
      const response = await lastValueFrom(
        this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET}`,
          },
        }),
      );
  
      const payment = await this.prisma.payment.findUnique({
        where: { reference },
        include: { price: true, invitation: true },
      });
  
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
  
      // Validate the amount paid
      const expectedAmount = payment.price.amount * 100; // Amount in kobo
      if (response.data.amount !== expectedAmount) {
        throw new HttpException('Payment amount mismatch', HttpStatus.BAD_REQUEST);
      }
  
      // Update payment status
      if (response.data.status === 'success') {
        await this.prisma.payment.update({
          where: { reference },
          data: { status: 'success' },
        });
  
        // Create the attendee record
        const attendee = await this.prisma.attendee.create({
          data: {
            eventId: payment.invitation.event_id,
            eventName: payment.invitation.event_name,
            name: payment.name, // Assuming the User model has a 'name' field
            email: payment.email, // Assuming the User model has an 'email' field
            phone: payment.phone,
            priceCategory: payment.price.title,
            link: payment.invitation.invite_link,
            token: payment.invitation.token,
            checkedIn: false,
            thankyouMail: false
            // Add other fields as necessary
          },
        });
  
        return {
          success: true,
          message: 'Payment verified and attendee created successfully',
          data: attendee,
        };
      } else {
        await this.prisma.payment.update({
          where: { reference },
          data: { status: 'failed' },
        });
  
        throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Payment verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  
}
