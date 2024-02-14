import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { Role, RolesEnum, UserRole, userRole } from '../db/schema/userRole';
import { eq } from 'drizzle-orm';

export type AuthSession = null | {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }
};

export const getUserAuth = async () => {
  const { userId, sessionClaims } = auth();

  if (userId) {
    let role: Role = 'user';
    if (sessionClaims?.primaryEmail) {
      const currentUserRole = (
        await db
          .select()
          .from(userRole)
          .where(eq(userRole.userEmail, sessionClaims.primaryEmail as string))
      )[0];
      if (currentUserRole) {
        role = RolesEnum.parse(currentUserRole.role) ?? 'user';
      }
    }

    return {
      user: {
        id: userId,
        name: `${sessionClaims?.firstName} ${sessionClaims?.lastName}`,
        email: sessionClaims?.primaryEmail as string,
        role: role
      }
    };
  }
  return null;
};

export const checkAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
};
