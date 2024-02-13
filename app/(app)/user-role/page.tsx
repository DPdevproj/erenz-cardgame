import { Suspense } from 'react';

import Loading from '@/app/loading';
import UserRoleList from '@/components/userRole/UserRoleList';
import { getUserRoles } from '@/lib/api/userRole/queries';

export const revalidate = 0;

export default async function UserRolePage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">User Role</h1>
        </div>
        <UserRole />
      </div>
    </main>
  );
}

const UserRole = async () => {
  const { userRole } = await getUserRoles();

  return (
    <Suspense fallback={<Loading />}>
      <UserRoleList userRole={userRole} />
    </Suspense>
  );
};
