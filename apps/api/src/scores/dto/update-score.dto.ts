import { createZodDto } from "nestjs-zod";
import { UpdateScoreSchema } from "@repo/schemas";

export class UpdateScoreDto extends createZodDto(UpdateScoreSchema) {}