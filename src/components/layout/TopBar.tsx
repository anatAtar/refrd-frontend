'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-page/90 backdrop-blur border-b border-border h-14 flex items-center px-4 gap-3 md:hidden">
      <span
        className="text-lg font-black tracking-tight flex-1"
        style={{
          background: 'linear-gradient(135deg, #9F87F5, #C4B6FA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Vouch
      </span>
      <Link href="/notifications" className="text-text-muted hover:text-text-primary">
        🔔
      </Link>
      <Link href="/settings">
        <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
      </Link>
    </header>
  );
}
