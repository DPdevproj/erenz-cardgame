import { varchar, mysqlTable } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { type getUserRoles } from '@/lib/api/userRole/queries';
import { nanoid } from '@/lib/utils';
const RolesEnum = z.enum(['admin', 'user']);

export const userRole = mysqlTable('user_role', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  userEmail: varchar('user_email', { length: 256 }).notNull(),
  role: varchar('role', { length: 256 }).notNull()
});

// Schema for userRole - used to validate API requests
const baseSchema = createSelectSchema(userRole).extend({
  userEmail: z.coerce.string().email(),
  role: RolesEnum
});

export const insertUserRoleSchema = createInsertSchema(userRole);
export const insertUserRoleParams = baseSchema.extend({}).omit({ id: true });

export const updateUserRoleSchema = baseSchema;
export const userRoleIdSchema = baseSchema.pick({ id: true });

// Types for userRole - used to type API request params and within Components
export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = z.infer<typeof insertUserRoleSchema>;
export type NewUserRoleParams = z.infer<typeof insertUserRoleParams>;
export type UpdateUserRoleParams = z.infer<typeof baseSchema>;
export type UserRoleId = z.infer<typeof userRoleIdSchema>['id'];

// this type infers the return from getUserRole() - meaning it will include any joins
export type CompleteUserRole = Awaited<ReturnType<typeof getUserRoles>>['userRole'][number];
