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
  ) { }

  async findAll(): Promise<Score[]> {
    const scores = await this.database.query.scores.findMany({ with: { user: true } });
    return scores.map(score => ({
      ...score,
      date: score.date.toISOString(),
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
      date: score.date.toISOString(),
      createdAt: score.createdAt.toISOString(),
    };
  }

  async create(data: CreateScore): Promise<Score> {
    const [score] = await this.database.insert(schema.scores).values({
      ...data,
      date: new Date(data.date),
    }).returning();
    return {
      ...score,
      date: score.date.toISOString(),
      createdAt: score.createdAt.toISOString(),
    };
  }

  async update(id: string, data: UpdateScore): Promise<Score> {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    const [score] = await this.database
      .update(schema.scores)
      .set(updateData)
      .where(eq(schema.scores.id, id))
      .returning();

    if (!score) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }

    return {
      ...score,
      date: score.date.toISOString(),
      createdAt: score.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.database
      .delete(schema.scores)
      .where(eq(schema.scores.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }
  }
}
