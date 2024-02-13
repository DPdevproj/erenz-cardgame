import { sql } from 'drizzle-orm';
import { varchar, int, real, boolean, timestamp, mysqlTable } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getCards } from '@/lib/api/card/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const card = mysqlTable('card', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar('name', { length: 256 }).notNull(),
  expansion: varchar('expansion', { length: 256 }).notNull(),
  rarity: varchar('rarity', { length: 256 }).notNull(),
  language: varchar('language', { length: 256 }).notNull(),
  info: varchar('info', { length: 256 }),
  quantity: int('quantity').notNull(),
  price: real('price').notNull(),
  condition: int('condition').notNull(),
  available: boolean('available').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`)
});

// Schema for card - used to validate API requests
const baseSchema = createSelectSchema(card).omit(timestamps);

export const insertCardSchema = createInsertSchema(card).omit(timestamps);
export const insertCardParams = baseSchema
  .extend({
    quantity: z.coerce.number(),
    price: z.coerce.number(),
    condition: z.coerce.number(),
    available: z.coerce.boolean()
  })
  .omit({
    id: true
  });

export const updateCardSchema = baseSchema;
export const updateCardParams = baseSchema.extend({
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  condition: z.coerce.number(),
  available: z.coerce.boolean()
});
export const cardIdSchema = baseSchema.pick({ id: true });

// Types for card - used to type API request params and within Components
export type Card = typeof card.$inferSelect;
export type NewCard = z.infer<typeof insertCardSchema>;
export type NewCardParams = z.infer<typeof insertCardParams>;
export type UpdateCardParams = z.infer<typeof updateCardParams>;
export type CardId = z.infer<typeof cardIdSchema>['id'];

// this type infers the return from getCard() - meaning it will include any joins
export type CompleteCard = Awaited<ReturnType<typeof getCards>>['cards'][number];
