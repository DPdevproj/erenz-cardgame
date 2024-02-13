import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  UserRoleId,
  NewUserRoleParams,
  UpdateUserRoleParams,
  updateUserRoleSchema,
  insertUserRoleSchema,
  userRole,
  userRoleIdSchema
} from '@/lib/db/schema/userRole';

export const createUserRole = async (newuserRole: NewUserRoleParams) => {
  const newUserRole = insertUserRoleSchema.parse(newuserRole);
  try {
    await db.insert(userRole).values(newUserRole);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateUserRole = async (id: UserRoleId, newuserRole: UpdateUserRoleParams) => {
  const { id: userRoleId } = userRoleIdSchema.parse({ id });
  const newUserRole = updateUserRoleSchema.parse(newuserRole);
  try {
    await db.update(userRole).set(newUserRole).where(eq(userRole.id, userRoleId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteUserRole = async (id: UserRoleId) => {
  const { id: userRoleId } = userRoleIdSchema.parse({ id });
  try {
    await db.delete(userRole).where(eq(userRole.id, userRoleId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
