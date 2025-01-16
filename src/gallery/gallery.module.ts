import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, DatabaseService]
})
export class GalleryModule {}
