import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { DatabaseModule } from '../database/database.module';
import { ScoresService } from './scores.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ScoresController],
  providers: [ScoresService]
})
export class ScoresModule { }
