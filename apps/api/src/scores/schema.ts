import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/schema';

export const scores = pgTable('scores', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    composer: text('composer').notNull(),
    lyricist: text('lyricist').notNull(),
    description: text('description').notNull(),
    location: text('location').notNull(),
    category: text('category').notNull(),
    color: text('color').notNull(),
    key: text('key').notNull(),
    genre: text('genre').notNull(),
    lyrics: text('lyrics').notNull(),
    date: timestamp('date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: uuid('user_id').references(() => users.id)
});

export const scoresRelations = relations(scores, ({ one }) => ({
    user: one(users, {
        fields: [scores.userId],
        references: [users.id],
    }),
}));
