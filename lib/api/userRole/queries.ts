import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import { type UserRoleId, userRoleIdSchema, userRole } from '@/lib/db/schema/userRole';

export const getUserRoles = async () => {
  const rows = await db.select().from(userRole);
  const u = rows;
  return { userRole: u };
};

export const getUserRoleById = async (id: UserRoleId) => {
  const { id: userRoleId } = userRoleIdSchema.parse({ id });
  const [row] = await db.select().from(userRole).where(eq(userRole.id, userRoleId));
  if (row === undefined) return {};
  const u = row;
  return { userRole: u };
};
