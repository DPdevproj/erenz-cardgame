'use client';
import { AuthSession } from '@/lib/auth/utils';
import { PropsWithChildren, createContext } from 'react';

export const UserContext = createContext<AuthSession>(null);

type UserContextProviderProps = {
  session: AuthSession;
} & PropsWithChildren;

export const UserContextProvider = ({ session, children }: UserContextProviderProps) => {
  return <UserContext.Provider value={session}>{children}</UserContext.Provider>;
};
