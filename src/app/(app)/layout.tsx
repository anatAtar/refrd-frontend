import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/api/auth';
import { AuthProvider } from '@/lib/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await getServerUser(cookieHeader);

  if (!user) {
    redirect('/login');
  }

  // Redirect new users to onboarding (but not if they're already there)
  // Note: headers() gives us the pathname in Next.js 15 via the request context
  // We check via a simpler approach — the onboarding pages handle their own routing

  return (
    <AuthProvider initialUser={user}>
      <AppShell>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
