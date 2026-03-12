import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { ScoreResponseDto } from './dto/score-response.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScoresService } from './scores.service';

@ApiTags('Scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) { }

  @Get()
  @ZodResponse({ type: [ScoreResponseDto] })
  @ApiOperation({ summary: 'Get all scores' })
  findAll(): ScoreResponseDto[] {
    return this.scoresService.findAll();
  }

  @Get(':id')
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Get a score by ID' })
  findOne(@Param('id') id: string): ScoreResponseDto {
    return this.scoresService.findOne(id);
  }

  @Post()
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Create a new score' })
  create(@Body() createScoreDto: CreateScoreDto): ScoreResponseDto {
    return this.scoresService.create(createScoreDto);
  }

  @Patch(':id')
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Update an existing user' })
  update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ): ScoreResponseDto {
    return this.scoresService.update(id, updateScoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a score' })
  remove(@Param('id') id: string): void {
    this.scoresService.remove(id);
  }
}
