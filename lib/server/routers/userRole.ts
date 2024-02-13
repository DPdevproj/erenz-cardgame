import { getUserRoleById, getUserRoles } from '@/lib/api/userRole/queries';
import { publicProcedure, router } from '@/lib/server/trpc';
import { userRoleIdSchema, insertUserRoleParams, updateUserRoleParams } from '@/lib/db/schema/userRole';
import { createUserRole, deleteUserRole, updateUserRole } from '@/lib/api/userRole/mutations';

export const userRoleRouter = router({
  getUserRole: publicProcedure.query(async () => {
    return getUserRoles();
  }),
  getUserRoleById: publicProcedure.input(userRoleIdSchema).query(async ({ input }) => {
    return getUserRoleById(input.id);
  }),
  createUserRole: publicProcedure.input(insertUserRoleParams).mutation(async ({ input }) => {
    return createUserRole(input);
  }),
  updateUserRole: publicProcedure.input(updateUserRoleParams).mutation(async ({ input }) => {
    return updateUserRole(input.id, input);
  }),
  deleteUserRole: publicProcedure.input(userRoleIdSchema).mutation(async ({ input }) => {
    return deleteUserRole(input.id);
  })
});
