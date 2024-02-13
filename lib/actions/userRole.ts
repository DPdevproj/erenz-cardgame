'use server';

import { revalidatePath } from 'next/cache';
import { createUserRole, deleteUserRole, updateUserRole } from '@/lib/api/userRole/mutations';
import {
  UserRoleId,
  NewUserRoleParams,
  UpdateUserRoleParams,
  userRoleIdSchema,
  insertUserRoleParams,
  updateUserRoleParams
} from '@/lib/db/schema/userRole';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateUserRoles = () => revalidatePath('/user-role');

export const createUserRoleAction = async (input: NewUserRoleParams) => {
  try {
    const payload = insertUserRoleParams.parse(input);
    await createUserRole(payload);
    revalidateUserRoles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateUserRoleAction = async (input: UpdateUserRoleParams) => {
  try {
    const payload = updateUserRoleParams.parse(input);
    await updateUserRole(payload.id, payload);
    revalidateUserRoles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteUserRoleAction = async (input: UserRoleId) => {
  try {
    const payload = userRoleIdSchema.parse({ id: input });
    await deleteUserRole(payload.id);
    revalidateUserRoles();
  } catch (e) {
    return handleErrors(e);
  }
};
