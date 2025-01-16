import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService, DatabaseService]
})
export class InvitationModule {}
