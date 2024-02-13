'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type UserRole, CompleteUserRole } from '@/lib/db/schema/userRole';
import Modal from '@/components/shared/Modal';

import { Button } from '@/components/ui/button';
import UserRoleForm from './UserRoleForm';
import { PlusIcon } from 'lucide-react';
import { useOptimisticUserRoles } from '@/app/(app)/user-role/useOptimisticUserRole';

type TOpenModal = (userRole?: UserRole) => void;

export default function UserRoleList({ userRole }: { userRole: CompleteUserRole[] }) {
  const { optimisticUserRoles, addOptimisticUserRole } = useOptimisticUserRoles(userRole);
  const [open, setOpen] = useState(false);
  const [activeUserRole, setActiveUserRole] = useState<UserRole | null>(null);
  const openModal = (userRole?: UserRole) => {
    setOpen(true);
    userRole ? setActiveUserRole(userRole) : setActiveUserRole(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal open={open} setOpen={setOpen} title={activeUserRole ? 'Edit UserRole' : 'Create User Role'}>
        <UserRoleForm
          userRole={activeUserRole}
          addOptimistic={addOptimisticUserRole}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticUserRoles.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticUserRoles.map((userRole) => (
            <UserRole userRole={userRole} key={userRole.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const UserRole = ({ userRole, openModal }: { userRole: CompleteUserRole; openModal: TOpenModal }) => {
  const optimistic = userRole.id === 'optimistic';
  const deleting = userRole.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('user-role') ? pathname : pathname + '/user-role/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className="w-full">
        <div>{userRole.userId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + userRole.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No user role</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new user role.</p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New User Role{' '}
        </Button>
      </div>
    </div>
  );
};
