import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateUser, UpdateUser, User } from "@repo/schemas";
import { DATABASE_CONNECTION } from "src/database/database-connection";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from './schema';


@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) { }

  async findAll(): Promise<User[]> {
    const users = await this.database.query.users.findMany();
    return users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.id, id),
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
    const [user] = await this.database.insert(schema.users).values(data).returning();
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const [user] = await this.database
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
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
    const result = await this.database
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
  }
}