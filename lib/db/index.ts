import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { env } from '@/lib/env.mjs';
import * as cardSchema from './schema/card';
import * as userRoles from './schema/userRole';
// create the connection
export const connection = connect({
  url: env.DATABASE_URL
});

export const db = drizzle(connection, {
  schema: { ...cardSchema, ...userRoles }
});
