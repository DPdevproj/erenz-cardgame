import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getUserRoleById } from '@/lib/api/userRole/queries';
import OptimisticUserRole from './OptimisticUserRole';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function UserRolePage({ params }: { params: { userRoleId: string } }) {
  return (
    <main className="overflow-auto">
      <UserRole id={params.userRoleId} />
    </main>
  );
}

const UserRole = async ({ id }: { id: string }) => {
  const { userRole } = await getUserRoleById(id);

  if (!userRole) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="user-role" />
        <OptimisticUserRole userRole={userRole} />
      </div>
    </Suspense>
  );
};
