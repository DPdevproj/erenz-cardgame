import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="grid place-items-center h-full bg-background">
      <SignIn redirectUrl={'/dashboard'} />
    </main>
  );
}
