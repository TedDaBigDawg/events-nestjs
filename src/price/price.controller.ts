import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, ValidationPipe } from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto, UpdatePriceDto } from './dto/price.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Prices')
@ApiBearerAuth('access-token')
@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PriceService) {}


    // Route to handle creating prices
  @Post('create')
  @ApiOperation({ summary: 'Create a new event price' })
  @ApiResponse({
    status: 201,
    description: 'The event price has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createPrice(@Body(ValidationPipe) createPriceDto: CreatePriceDto, @Res() res: Response) {
    try {
      const price = await this.priceService.createPrice(createPriceDto);
      return res.status(201).send({ success: true, data: price });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  // Route for handling updating price with the unique id
  @Patch(':id/update')
  @ApiOperation({ summary: 'Update an event price' })
  @ApiResponse({
    status: 201,
    description: 'The event price has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updatePrice(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePriceDto: UpdatePriceDto,
    @Res() res: Response,
  ) {
    try {
      const updatedPrice = await this.priceService.updatePrice(id, updatePriceDto);
      return res.send({
        success: true,
        data: updatedPrice,
      });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

//Route to handle getting all the prices related to a specific event
@Get('event/:id')
@ApiOperation({ summary: 'Get all prices for an event' })
@ApiResponse({
  status: 201,
  description: 'Prices successfully retrieved.',
})
@ApiResponse({ status: 400, description: 'Bad Request.' })
async getPrices(
  @Param('eventId') eventId: string,
  @Res() res: Response,
) {
  try {
    const prices = await this.priceService.getPricesByEventId(eventId);
    return res.send({
      success: true,
      data: prices,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

//Route to handle getting a specific price using the unique price id(PK)
@Get(':id/one')
@ApiOperation({ summary: 'Get a specific price' })
@ApiResponse({
  status: 201,
  description: 'Price successfully retrieved.',
})
@ApiResponse({ status: 400, description: 'Bad Request.' })
  async getPrice(
    @Param('id') priceId: string,
    @Res() res: Response,
  ) {
    try {
      const price = await this.priceService.getPriceById(priceId);
      if (price) {
        return res.send({ success: true, data: price });
      } else {
        return res.send({ success: false, message: "No data" });
      }
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  //Route to handle getting all prices 
@Get('all')
@ApiOperation({ summary: 'Get all prices not soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Prices successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAll(
  @Res() res: Response,
) {
  try {
    return await this.priceService.getAllPrices();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

  //Route to handle getting all soft deleted prices 
@Get('all/deleted')
@ApiOperation({ summary: 'Get all prices soft deleted' })
  @ApiResponse({
    status: 201,
    description: 'Prices successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
async getAllDeletedPrices(
  @Res() res: Response,
) {
  try {
    return await this.priceService.getAllDeletedPrices();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}

  @Patch(':id/delete')
  @ApiOperation({ summary: 'Soft delete a price' })
  @ApiResponse({
    status: 201,
    description: 'Price successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async softDeletePrice(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.priceService.softDeletePrice(id);
    return { success: true, ...result };
  }


  @Delete(':id/harddelete')
  @ApiOperation({ summary: 'Hard delete a price' })
  @ApiResponse({
    status: 201,
    description: 'Price successfully hard deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async hardDeletePrice(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.priceService.hardDeletePrice(id);
    return { success: true, ...result };
  }
}
