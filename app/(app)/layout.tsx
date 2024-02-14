import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UserContextProvider } from '@/components/providers/UserProvider';
import { Toaster } from '@/components/ui/sonner';
import { getUserAuth } from '@/lib/auth/utils';
import { ClerkProvider } from '@clerk/nextjs';
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserAuth();
  return (
    <main>
      <ClerkProvider>
        <UserContextProvider session={session}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </UserContextProvider>
      </ClerkProvider>
      <Toaster richColors />
    </main>
  );
}
