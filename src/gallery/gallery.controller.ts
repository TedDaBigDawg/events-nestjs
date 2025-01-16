import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Galleries')
@ApiBearerAuth('access-token')
@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new event gallery' })
      @ApiResponse({
        status: 201,
        description: 'The event gallery has been successfully created.',
      })
      @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.CREATED)
  createGallery(@Body(ValidationPipe) createGalleryDto: CreateGalleryDto) {
    return this.galleryService.createGallery(createGalleryDto);
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update an event gallery' })
  @ApiResponse({
    status: 201,
    description: 'The event gallery has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  updateGallery(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGalleryDto: UpdateGalleryDto
  ) {
    return this.galleryService.updateGallery(id, updateGalleryDto);
  }


  @Get('event/:event_id')
  @ApiOperation({ summary: 'Get all galleries for an event' })
  @ApiResponse({
    status: 201,
    description: 'Galleries successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getGalleriesByEventId(@Param('event_id') eventId: string) {
    return this.galleryService.getGalleriesByEventId(eventId);
  }

  @Get(':id/one')
  @ApiOperation({ summary: 'Get a specific gallery' })
  @ApiResponse({
    status: 201,
    description: 'Gallery successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getGallery(@Param('id') id: string) {
    return this.galleryService.getGalleryById(id);
  }


  //Route to handle getting all soft deleted galleries 
  @Get('all')
  @ApiOperation({ summary: 'Get all galleries not soft deleted' })
    @ApiResponse({
      status: 201,
      description: 'Prices successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAll() {
      return await this.galleryService.getAllGalleries();
  }

  //Route to handle getting all soft deleted prices 
  @Get('all/deleted')
  @ApiOperation({ summary: 'Get all galleries soft deleted' })
    @ApiResponse({
      status: 201,
      description: 'Galleries successfully retrieved.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllDeletedGalleries(
  ) {
      return await this.galleryService.getAllDeletedGalleries();
  }


  @Patch(':id/softdelete')
  @ApiOperation({ summary: 'Soft delete a gallery' })
  @ApiResponse({
    status: 201,
    description: 'Gallery successfully soft deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async softDeleteGallery(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.galleryService.softDeleteGallery(id);
    return { success: true, ...result };
  }


  @Delete(':id/harddelete')
  @ApiOperation({ summary: 'Hard delete a gallery' })
  @ApiResponse({
    status: 201,
    description: 'Gallery successfully hard deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.OK)
  async hardDeleteGallery(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.galleryService.hardDeleteGallery(id);
    return { success: true, ...result };
  }

}
