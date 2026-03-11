import { createZodDto } from 'nestjs-zod';
import { ScoreResponseSchema } from '@repo/schemas';

export class ScoreResponseDto extends createZodDto(ScoreResponseSchema) {}
