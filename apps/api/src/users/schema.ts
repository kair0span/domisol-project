import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { scores } from '../scores/schema';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'moderator']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: userRoleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    scores: many(scores),
}));