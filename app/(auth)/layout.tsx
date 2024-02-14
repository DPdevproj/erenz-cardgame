import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserAuth();
  if (session?.session) redirect('/dashboard');

  return (
    <div className="bg-background h-screen items-center justify-center">
      <ClerkProvider>{children}</ClerkProvider>
    </div>
  );
}
