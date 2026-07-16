'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MOBILE_ITEMS = [
  { href: '/feed',               icon: '🏠', label: 'Home'     },
  { href: '/jobs',               icon: '🔍', label: 'Browse'   },
  { href: '/network',            icon: '👥', label: 'Network'  },
  { href: '/applications',       icon: '📋', label: 'Applied'  },
  { href: '/applications/inbox', icon: '📥', label: 'Inbox'    },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t border-border">
      <div className="flex justify-around py-2">
        {MOBILE_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors',
                active ? 'text-violet-300' : 'text-text-muted',
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
