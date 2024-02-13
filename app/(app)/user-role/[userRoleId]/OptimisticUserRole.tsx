'use client';

import { useOptimistic, useState } from 'react';
import { TAddUserRoleOptimistic } from '@/app/(app)/user-role/useOptimisticUserRole';
import { type UserRole } from '@/lib/db/schema/userRole';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import UserRoleForm from '@/components/userRole/UserRoleForm';

export default function OptimisticUserRole({ userRole }: { userRole: UserRole }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: UserRole) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticUserRole, setOptimisticUserRole] = useOptimistic(userRole);
  const updateUserRole: TAddUserRoleOptimistic = (input) => setOptimisticUserRole({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <UserRoleForm
          userRole={userRole}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateUserRole}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{userRole.userEmail}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticUserRole.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticUserRole, null, 2)}
      </pre>
    </div>
  );
}
