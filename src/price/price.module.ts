import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [PriceController],
  providers: [PriceService, DatabaseService]
})
export class PriceModule {}
