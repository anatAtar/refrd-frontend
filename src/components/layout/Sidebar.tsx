'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/Logo';

const NAV_ITEMS = [
  { href: '/feed',         icon: '⌂',  label: 'Home'            },
  { href: '/jobs',         icon: '⌕',  label: 'Browse Jobs'     },
  { href: '/applications', icon: '↗',  label: 'My Applications' },
  { href: '/network',      icon: '⊞',  label: 'My Network'      },
  { href: '/notifications',icon: '✉',  label: 'Notifications'   },
  { href: '/jobs/post',    icon: '＋',  label: 'Post a Job'      },
];

const EXACT_ROUTES = ['/applications', '/jobs'];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: unreadCount } = useUnreadCount();

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
            Find your next job
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
                'flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[14.5px] font-medium transition-all duration-150 group',
                active ? '' : 'hover:bg-white/5',
              )}
              style={{
                color: active ? '#D4AF7A' : '#A89070',
                background: active ? 'rgba(212,175,122,0.12)' : undefined,
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#D4AF7A'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#A89070'; }}
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

      {/* Bottom: user + logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(212,175,122,0.08)' }}>
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
