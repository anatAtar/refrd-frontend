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
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center border-b border-border">
        <span
          className="text-xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #9F87F5, #C4B6FA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Refrd
        </span>
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
                  ? 'bg-violet-500/15 text-violet-300'
                  : 'text-text-muted hover:text-text-primary hover:bg-card-hover',
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="text-[10px] font-bold bg-violet-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + settings */}
      <div className="p-3 border-t border-border">
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-text-primary truncate">{user.fullName}</p>
            <p className="text-xs text-text-muted truncate">{user.companyName ?? user.email}</p>
          </div>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <span className="text-base">⚙️</span>
          Settings
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2.5 px-3 mt-0.5 text-text-muted"
        >
          <span>🚪</span>
          Log out
        </Button>
      </div>
    </aside>
  );
}
