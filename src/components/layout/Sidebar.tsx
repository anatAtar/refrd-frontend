'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
  { href: '/feed',                  icon: '🏠', label: 'Home'            },
  { href: '/jobs',                  icon: '🔍', label: 'Browse Jobs'     },
  { href: '/network',               icon: '👥', label: 'My Network'      },
  { href: '/notifications',         icon: '🔔', label: 'Notifications'   },
  { href: '/applications',          icon: '📋', label: 'My Applications' },
  { href: '/applications/inbox',    icon: '📥', label: 'CV Inbox'        },
  { href: '/jobs/mine',             icon: '📌', label: 'Jobs I Posted'   },
  { href: '/jobs/post',             icon: '＋',  label: 'Post a Job'     },
];

const EXACT_ROUTES = ['/applications', '/jobs'];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: unreadCount } = useUnreadCount();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0" style={{ background: '#120E09', borderRight: '1px solid rgba(212,175,122,0.08)' }}>
      {/* Logo */}
      <div className="px-4 h-16 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,122,0.08)' }}>
        {/* Arrow icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black shrink-0"
          style={{
            background: 'rgba(212,175,122,0.15)',
            border: '1px solid rgba(212,175,122,0.30)',
            color: '#D4AF7A',
          }}
        >
          →
        </div>
        {/* Name + tagline */}
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-black tracking-tight leading-none">
            <span style={{ background: 'linear-gradient(160deg,#FAFAFA,#E8E8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Direct</span>
            <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ref</span>
          </span>
          <span className="text-[9px] font-medium text-text-muted leading-none">
            Direct to your next job
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = EXACT_ROUTES.includes(item.href)
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const showBadge = item.href === '/notifications' && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'text-gold-300'
                  : 'hover:bg-white/5',
              )}
              style={{
                color: active ? '#D4AF7A' : '#5A4A2A',
                background: active ? 'rgba(212,175,122,0.12)' : undefined,
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="text-[10px] font-bold bg-gold-300 text-[#0A0A0A] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + settings */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(212,175,122,0.08)' }}>
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold truncate" style={{ color: '#F5EDD8' }}>{user.fullName}</p>
            <p className="text-xs truncate" style={{ color: '#5A4A2A' }}>{user.companyName ?? user.email}</p>
          </div>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
          style={{ color: '#5A4A2A' }}
        >
          <span className="text-base">⚙️</span>
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
          style={{ color: '#5A4A2A' }}
        >
          <span>🚪</span>
          Log out
        </button>
      </div>
    </aside>
  );
}
