// import { Controller, Get, Query, Res, HttpStatus, Param, Req, Post, Body } from '@nestjs/common';
// import { Response } from 'express';
// import { CardService } from './card.service';
// import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
// import { CardPaymentSuccessDto } from './dto/card.dto';

// @Controller('card')
// export class CardController {
//   constructor(private readonly cardService: CardService) {}



//   @Get('events')
//   @ApiOperation({ summary: 'Get events for a user with card' })
//     @ApiResponse({
//       status: 201,
//       description: 'User Events successfully retrieved.',
//     })
//     @ApiResponse({ status: 400, description: 'Bad Request.' })
//     @ApiQuery({
//       name: 'page',
//       required: false,  // Making the query parameter optional
//       description: 'Set page',
//       type: String,
//     })
//     @ApiQuery({
//       name: 'limit',
//       required: false,  // Making the query parameter optional
//       description: 'Set limit',
//       type: String,
//     })
//     @ApiQuery({
//         name: 'id',
//         required: false,  // Making the query parameter optional
//         description: 'User Id',
//         type: String,
//     })
//     @ApiQuery({
//         name: 'type',
//         required: false,  // Making the query parameter optional
//         description: 'type',
//         type: String,
//     })
//   async cardGetEvents(
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//     @Query('id') id: string,
//     @Query('type') type: string,
//     @Res() res: Response
//   ) {
//     try {
//       // Convert query params to required types
//       const pageNumber = Number(page) || 1;
//       const limitNumber = Number(limit) || 10;

//       // Call the service method
//       const result = await this.cardService.cardGetEvents(
//         pageNumber,
//         limitNumber,
//         id,
//         type
//       );

//       // Return the response
//       return res
//         .status(result.success === 'true' ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
//         .send(result);
//     } catch (error) {
//       console.error(error);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
//         success: 'false',
//         message: 'A server error occurred',
//       });
//     }
//   }


//   @Get('open-events')
//   @ApiOperation({ summary: 'Get all open events with card' })
//     @ApiResponse({
//       status: 201,
//       description: 'Open Events successfully retrieved.',
//     })
//     @ApiResponse({ status: 400, description: 'Bad Request.' })
//     @ApiQuery({
//       name: 'page',
//       required: false,  // Making the query parameter optional
//       description: 'Set page',
//       type: String,
//     })
//     @ApiQuery({
//       name: 'limit',
//       required: false,  // Making the query parameter optional
//       description: 'Set limit',
//       type: String,
//     })
//     @ApiQuery({
//         name: 'id',
//         required: false,  // Making the query parameter optional
//         description: 'User Id',
//         type: String,
//     })
//   async getOpenEvents(
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//     @Query('id') id: string,
//     @Res() res: Response
//   ) {
//     try {
//       const decodedId = decodeURIComponent(id);
//       const result = await this.cardService.cardGetOpenEvent(
//         Number(page) || 1,
//         Number(limit) || 100,
//         decodedId
//       );

//       return res.status(HttpStatus.OK).send(result);
//     } catch (error) {
//       console.error(error);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
//         success: 'false',
//         message: 'A server error occurred',
//       });
//     }
//   }


//   @Get('search-events')
//   @ApiOperation({ summary: 'Search events with card' })
//     @ApiResponse({
//       status: 201,
//       description: 'Events successfully retrieved.',
//     })
//     @ApiResponse({ status: 400, description: 'Bad Request.' })
//     @ApiQuery({
//       name: 'page',
//       required: false,  // Making the query parameter optional
//       description: 'Set page',
//       type: String,
//     })
//     @ApiQuery({
//       name: 'limit',
//       required: false,  // Making the query parameter optional
//       description: 'Set limit',
//       type: String,
//     })
//     @ApiQuery({
//         name: 'query',
//         required: true,  // Making the query parameter optional
//         description: ' Search query',
//         type: String,
//     })
//   async cardSearchEvents(
//     @Query('page') page: string,
//     @Query('limit') limit: string,
//     @Query('query') query: string,
//     @Res() res: Response
//   ) {
//     try {
//       const result = await this.cardService.cardSearchEvents(
//         Number(page) || 1,
//         Number(limit) || 100,
//         query
//       );

//       return res.status(HttpStatus.OK).send(result);
//     } catch (error) {
//       console.error(error);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
//         success: 'false',
//         message: 'An error occurred',
//       });
//     }
//   }


//   @Get('event/:id')
//   @ApiOperation({ summary: 'Get an event with card' })
//     @ApiResponse({
//       status: 201,
//       description: 'Event successfully retrieved.',
//     })
//     @ApiResponse({ status: 400, description: 'Bad Request.' })
//   async cardGetEvent(@Param('id') eventId: string, @Req() req: any, @Res() res: Response) {
//     try {
//       // Extract `user_id` from the request (auth middleware should populate this)
//       const userId = req?.isce_auth?.user_id;

//       if (!userId) {
//         return res.status(HttpStatus.UNAUTHORIZED).send({
//           success: "false",
//           message: "Unauthorized access",
//         });
//       }

//       // Call the service method
//       const result = await this.cardService.cardGetEvent(eventId, userId);

//       // Determine response status based on service result
//       return res
//         .status(result.success === "true" ? HttpStatus.OK : HttpStatus.NOT_FOUND)
//         .send(result);
//     } catch (error) {
//       console.error(error);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
//         success: "false",
//         message: "An error occurred",
//       });
//     }
//   }


//   @Post('register')
//   @ApiOperation({ summary: 'Register an event with card' })
//     @ApiResponse({
//       status: 201,
//       description: 'Event successfully registered.',
//     })
//     @ApiResponse({ status: 400, description: 'Bad Request.' })
//   async registerEvent(@Body() body: any, @Res() res: Response) {
//     try {
//       const result = await this.cardService.cardRegisterEvent(body);
//       return res.status(200).send(result);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send({
//         success: 'false',
//         message: 'An error occurred',
//       });
//     }
//   }


//   @Post('payment-success')
//   async cardPaymentSuccess(@Body() body: CardPaymentSuccessDto) {
//     try {
//       const result = await this.cardService.handlePaymentSuccess(body);
//       return {
//         success: result.success,
//         message: result.message,
//         link: result.link,
//       };
//     } catch (error) {
//       return {
//         success: 'false',
//         message: 'An error occurred',
//       };
//     }
//   }
// }
