import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { CreateUser, UpdateUser, User } from "@repo/schemas";

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: randomUUID(),
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 30,
      role: "admin",
      createdAt: new Date("2024-01-15").toISOString(),
    },
    {
      id: randomUUID(),
      name: "Bob Smith",
      email: "bob@example.com",
      age: 25,
      role: "user",
      createdAt: new Date("2024-02-20").toISOString(),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  create(data: CreateUser): User {
    const user: User = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  update(id: string, data: UpdateUser): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  remove(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    this.users.splice(index, 1);
  }
}