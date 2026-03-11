import { CreateScoreSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';
export class CreateScoreDto extends createZodDto(CreateScoreSchema) {}
