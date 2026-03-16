import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateScore, UpdateScore, Score } from '@repo/schemas';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

@Injectable()
export class ScoresService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(): Promise<Score[]> {
    const scores = await this.database.query.scores.findMany({
      with: { user: true },
    });
    return scores.map((score) => ({
      ...score,
      createdAt: score.createdAt.toISOString(),
    }));
  }

  async findOne(id: string): Promise<Score> {
    const score = await this.database.query.scores.findFirst({
      where: eq(schema.scores.id, id),
    });

    if (!score) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }

    return {
      ...score,
      createdAt: score.createdAt.toISOString(),
    };
  }

  async create(data: CreateScore): Promise<Score> {
    const [score] = await this.database
      .insert(schema.scores)
      .values(data)
      .returning();

    return {
      ...score,
      createdAt: score.createdAt.toISOString(),
    };
  }

  async update(id: string, data: UpdateScore): Promise<Score> {
    const [score] = await this.database
      .update(schema.scores)
      .set(data)
      .where(eq(schema.scores.id, id))
      .returning();

    if (!score) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }

    return {
      ...score,
      createdAt: score.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const [deleted] = await this.database
      .delete(schema.scores)
      .where(eq(schema.scores.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }
  }
}
