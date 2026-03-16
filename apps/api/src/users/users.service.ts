import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateUser, UpdateUser, User } from '@repo/schemas';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as userSchema from './schema';
import * as scoreSchema from '../scores/schema';

type DatabaseSchema = typeof userSchema & typeof scoreSchema;

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<DatabaseSchema>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.database.query.users.findMany({
      with: { scores: true },
    });
    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.database.query.users.findFirst({
      where: eq(userSchema.users.id, id),
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async create(data: CreateUser): Promise<User> {
    const [user] = await this.database
      .insert(userSchema.users)
      .values(data)
      .returning();

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const [user] = await this.database
      .update(userSchema.users)
      .set(data)
      .where(eq(userSchema.users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const [deleted] = await this.database
      .delete(userSchema.users)
      .where(eq(userSchema.users.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
  }
}
