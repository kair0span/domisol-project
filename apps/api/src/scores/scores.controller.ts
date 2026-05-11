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
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { ScoreResponseDto } from './dto/score-response.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScoresService } from './scores.service';
import { Response } from 'express';

@ApiTags('Scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  @ZodResponse({ type: [ScoreResponseDto] })
  @ApiOperation({ summary: 'Get all scores' })
  async findAll(): Promise<ScoreResponseDto[]> {
    return this.scoresService.findAll();
  }

  @Get(':id')
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Get a score by ID' })
  async findOne(@Param('id') id: string): Promise<ScoreResponseDto> {
    return this.scoresService.findOne(id);
  }

  @Post()
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Create a new score' })
  async create(
    @Body() createScoreDto: CreateScoreDto,
  ): Promise<ScoreResponseDto> {
    return this.scoresService.create(createScoreDto);
  }

  @Patch(':id')
  @ZodResponse({ type: ScoreResponseDto })
  @ApiOperation({ summary: 'Update an existing score' })
  async update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ): Promise<ScoreResponseDto> {
    return this.scoresService.update(id, updateScoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a score' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.scoresService.remove(id);
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Get score file content (proxy for S3)' })
  async getFile(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const score = await this.scoresService.findOne(id);
      const response = await fetch(score.fileUrl);

      if (!response.ok) {
        res.status(HttpStatus.BAD_GATEWAY).send('Failed to fetch file from S3');
        return;
      }

      const fileContent = await response.text();
      res.setHeader('Content-Type', 'application/vnd.recordare.musicxml+xml');
      res.send(fileContent);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error fetching file');
    }
  }
}
