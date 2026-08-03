'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import { applicationsApi } from '@/lib/api/applications';
import { LogoMark } from '@/components/ui/Logo';
import { CreditsCard } from '@/components/credits/CreditsCard';

type Mode = 'seeker' | 'referrer';

const SEEKER_ITEMS = [
  { href: '/jobs',                    icon: '⌕', label: 'Browse Jobs' },
  { href: '/applications?tab=sent',   icon: '↗', label: 'Sent CV'     },
  { href: '/applications?tab=saved',  icon: '★', label: 'Saved Jobs'  },
];

const REFERRER_ITEMS = [
  { href: '/jobs/post',           icon: '＋', label: 'Post a Job' },
  { href: '/applications/inbox',  icon: '▤', label: 'CV Inbox'   },
];

const GENERAL_ITEMS = [
  { href: '/network',       icon: '⊞', label: 'My Network'    },
  { href: '/notifications', icon: '✉', label: 'Notifications' },
];

const EXACT_ROUTES = ['/applications', '/jobs'];

function isActive(pathname: string, search: string, href: string) {
  const [path, query] = href.split('?');
  if (!EXACT_ROUTES.includes(path) && pathname.startsWith(path + '/')) return true;
  if (pathname !== path) return false;
  if (!query) return true;
  // Distinguish links that share a pathname but differ by ?tab=, e.g. Sent CV vs Saved Jobs
  const wantedTab = new URLSearchParams(query).get('tab');
  const currentTab = new URLSearchParams(search).get('tab');
  return wantedTab === null || wantedTab === currentTab;
}

const REFERRER_ROUTES = ['/jobs/post', '/applications/inbox'];

const DEFAULT_ROUTE: Record<Mode, string> = {
  seeker:   '/jobs',
  referrer: '/jobs/post',
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count: unreadCount } = useUnreadCount();
  const { data: inbox } = useSWR('sidebar/inbox', () => applicationsApi.inbox().then(r => r.data));
  const pendingCVs = (inbox ?? []).filter(a => a.application.status === 'submitted').length;

  const [mode, setMode] = useState<Mode>(
    REFERRER_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/')) ? 'referrer' : 'seeker',
  );
  const items = mode === 'seeker' ? SEEKER_ITEMS : REFERRER_ITEMS;

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    router.push(DEFAULT_ROUTE[next]);
  };

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 h-screen sticky top-0" style={{ background: '#120E09', borderRight: '1px solid rgba(212,175,122,0.08)' }}>
      {/* Logo */}
      <div className="px-4 h-16 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,122,0.08)' }}>
        {/* Logo mark */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(212,175,122,0.12)',
            border: '1px solid rgba(212,175,122,0.28)',
          }}
        >
          <LogoMark size={20} />
        </div>        {/* Name + tagline */}
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-black tracking-tight leading-none">
            <span style={{ background: 'linear-gradient(160deg,#FAFAFA,#E8E8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Direct</span>
            <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ref</span>
          </span>
          <span className="text-[9px] font-medium text-text-muted leading-none">
            Refer. Get hired.
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {/* Home — always visible, outside the mode switch */}
        <div className="mb-3.5">
          <Link
            href="/feed"
            className={cn(
              'flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[14.5px] font-medium transition-all duration-150',
              isActive(pathname, search, '/feed') ? '' : 'hover:bg-white/5',
            )}
            style={{
              color: isActive(pathname, search, '/feed') ? '#D4AF7A' : '#A89070',
              background: isActive(pathname, search, '/feed') ? 'rgba(212,175,122,0.12)' : undefined,
            }}
          >
            <span className="text-base w-[18px] text-center shrink-0">⌂</span>
            <span className="flex-1">Home</span>
          </Link>
        </div>

        {/* Mode switcher */}
        <div className="flex gap-0.5 p-[3px] rounded-[10px] mb-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,122,0.08)' }}>
          <button
            onClick={() => switchMode('seeker')}
            className="flex-1 py-2 px-1.5 rounded-lg text-[12.5px] font-bold transition-colors"
            style={{
              background: mode === 'seeker' ? '#D4AF7A' : 'transparent',
              color: mode === 'seeker' ? '#0A0A0A' : '#A89070',
            }}
          >
            Job Seeker
          </button>
          <button
            onClick={() => switchMode('referrer')}
            className="flex-1 py-2 px-1.5 rounded-lg text-[12.5px] font-bold transition-colors"
            style={{
              background: mode === 'referrer' ? '#D4AF7A' : 'transparent',
              color: mode === 'referrer' ? '#0A0A0A' : '#A89070',
            }}
          >
            Referrer
          </button>
        </div>

        {/* Mode-specific items */}
        <div className="mb-3.5 mt-2.5">
          {items.map((item) => {
            const active = isActive(pathname, search, item.href);
            const showBadge = item.href === '/applications/inbox' && pendingCVs > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[14.5px] font-medium transition-all duration-150',
                  active ? '' : 'hover:bg-white/5',
                )}
                style={{
                  color: active ? '#D4AF7A' : '#A89070',
                  background: active ? 'rgba(212,175,122,0.12)' : undefined,
                }}
              >
                <span className="text-base w-[18px] text-center shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-[10px] font-bold bg-gold-300 text-[#0A0A0A] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {pendingCVs > 9 ? '9+' : pendingCVs}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* General — shared by both */}
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-widest px-2.5 pb-2" style={{ color: 'rgba(168,144,112,0.55)' }}>
            General
          </p>
          {GENERAL_ITEMS.map((item) => {
            const active = isActive(pathname, search, item.href);
            const showBadge = item.href === '/notifications' && unreadCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[14.5px] font-medium transition-all duration-150',
                  active ? '' : 'hover:bg-white/5',
                )}
                style={{
                  color: active ? '#D4AF7A' : '#A89070',
                  background: active ? 'rgba(212,175,122,0.12)' : undefined,
                }}
              >
                <span className="text-base w-[18px] text-center shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-[10px] font-bold bg-gold-300 text-[#0A0A0A] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: credits + user + logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(212,175,122,0.08)' }}>
        <CreditsCard />
        {user && (
          <Link
            href="/settings"
            className="px-2 py-2.5 mb-1 rounded-lg hover:bg-white/5 transition-colors block"
          >
            <p className="text-[13px] font-semibold truncate" style={{ color: '#F0E8D8' }}>{user.fullName}</p>
            <p className="text-[13px] truncate" style={{ color: '#A89070' }}>Profile & preferences</p>
          </Link>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2 py-[9px] rounded-lg text-[13px] font-semibold transition-colors hover:bg-white/5"
          style={{ color: '#A89070' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v10" />
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
