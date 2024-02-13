import { type UserRole, type CompleteUserRole } from '@/lib/db/schema/userRole';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';

export type TAddUserRoleOptimistic = (action: OptimisticAction<UserRole>) => void;

export const useOptimisticUserRoles = (userRole: CompleteUserRole[]) => {
  const [optimisticUserRoles, addOptimisticUserRole] = useOptimistic(
    userRole,
    (currentState: CompleteUserRole[], action: OptimisticAction<UserRole>): CompleteUserRole[] => {
      const { data } = action;

      const optimisticUserRole = {
        ...data,

        id: 'optimistic'
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0 ? [optimisticUserRole] : [...currentState, optimisticUserRole];
        case 'update':
          return currentState.map((item) => (item.id === data.id ? { ...item, ...optimisticUserRole } : item));
        case 'delete':
          return currentState.map((item) => (item.id === data.id ? { ...item, id: 'delete' } : item));
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticUserRole, optimisticUserRoles };
};
