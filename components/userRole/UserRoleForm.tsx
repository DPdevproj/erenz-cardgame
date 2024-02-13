import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';
import { type Action, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';
import { type UserRole, insertUserRoleParams } from '@/lib/db/schema/userRole';
import { createUserRoleAction, deleteUserRoleAction, updateUserRoleAction } from '@/lib/actions/userRole';
import { TAddUserRoleOptimistic } from '@/app/(app)/user-role/useOptimisticUserRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { userRoles } from './userRoles';

const UserRoleForm = ({
  userRole,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess
}: {
  userRole?: UserRole | null;

  openModal?: (userRole?: UserRole) => void;
  closeModal?: () => void;
  addOptimistic?: TAddUserRoleOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors } = useValidatedForm<UserRole>(insertUserRoleParams);
  const editing = !!userRole?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('user-role');

  const onSuccess = (action: Action, data?: { error: string; values: UserRole }) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error'
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`UserRole ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const userRoleParsed = await insertUserRoleParams.safeParseAsync({ ...payload });
    if (!userRoleParsed.success) {
      setErrors(userRoleParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = userRoleParsed.data;
    const pendingUserRole: UserRole = {
      id: userRole?.id ?? '',
      ...values
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingUserRole,
            action: editing ? 'update' : 'create'
          });

        const error = editing
          ? await updateUserRoleAction({ ...values, id: userRole.id })
          : await createUserRoleAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingUserRole
        };
        onSuccess(editing ? 'update' : 'create', error ? errorFormatted : undefined);
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} className={'space-y-8'}>
      {/* Schema fields start */}
      <div>
        <Label className={cn('mb-2 inline-block', errors?.userEmail ? 'text-destructive' : '')}>User Email</Label>
        <Input
          type="text"
          name="userEmail"
          className={cn(errors?.userEmail ? 'ring ring-destructive' : '')}
          defaultValue={userRole?.userEmail ?? ''}
        />
        {errors?.userEmail ? (
          <p className="text-xs text-destructive mt-2">{errors.userEmail[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.role ? 'text-destructive' : '')}>Role</Label>
        <Select name="role">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {userRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors?.role ? <p className="text-xs text-destructive mt-2">{errors.role[0]}</p> : <div className="h-6" />}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: 'delete', data: userRole });
              const error = await deleteUserRoleAction(userRole.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: userRole
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default UserRoleForm;

const SaveButton = ({ editing, errors }: { editing: Boolean; errors: boolean }) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing ? `Sav${isUpdating ? 'ing...' : 'e'}` : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
