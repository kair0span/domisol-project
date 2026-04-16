import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/schema';

export const scores = pgTable('scores', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    fileUrl: text('file_url').notNull(),
    composer: text('composer').notNull(),
    lyricist: text('lyricist').notNull(),
    location: text('location').notNull(),
    date: text('date').notNull(),
    category: text('category').notNull(),
    genre: text('genre').notNull(),
    color: text('color').notNull(),
    key: text('key').notNull(),
    description: text('description').notNull(),
    lyrics: text('lyrics').notNull(),
    lyricsDe: text('lyrics_de').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: uuid('user_id').references(() => users.id).notNull()
});

export const scoresRelations = relations(scores, ({ one }) => ({
    user: one(users, {
        fields: [scores.userId],
        references: [users.id],
    }),
}));