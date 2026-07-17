'use client';

import { mutate } from 'swr';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { notificationsApi } from '@/lib/api/notifications';
import { Button } from '@/components/ui/Button';
import { timeAgo, cn } from '@/lib/utils';
import Link from 'next/link';

const TYPE_ICON: Record<string, string> = {
  cv_viewed:            '👀',
  cv_forwarded:         '🎉',
  cv_received:          '📥',
  cv_rejected:          '😔',
  connection_request:   '🤝',
  connection_accepted:  '✅',
};

export default function NotificationsPage() {
  const { notifications, isLoading, mutate: refresh } = useNotifications();

  const handleMarkAll = async () => {
    await notificationsApi.markAllRead();
    refresh();
    mutate('notifications/unread-count');
  };

  const handleMarkOne = async (id: string) => {
    await notificationsApi.markRead(id);
    refresh();
    mutate('notifications/unread-count');
  };

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-0.5">Notifications</h1>
          <p className="text-sm text-text-secondary">
            {unread.length > 0 ? `${unread.length} unread` : 'All caught up ✓'}
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAll}>
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-base font-bold text-text-primary mb-2">No notifications yet</h3>
          <p className="text-sm text-text-secondary">
            When someone views or forwards your CV you&apos;ll see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkOne(n.id)}
              className={cn(
                'flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all',
                n.isRead
                  ? 'bg-card border-border opacity-60'
                  : 'bg-card border-gold-300/20 hover:border-gold-300/40 hover:bg-card-hover cursor-pointer',
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0',
                n.isRead ? 'bg-input' : 'bg-gold-300/15',
              )}>
                {TYPE_ICON[n.type] ?? '🔔'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm leading-snug',
                  n.isRead ? 'text-text-secondary' : 'text-text-primary font-semibold',
                )}>
                  {n.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{n.body}</p>
                <p className="text-xs text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
              </div>

              {/* Unread dot + link */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-gold-300" />
                )}
                {n.linkUrl && (
                  <Link
                    href={n.linkUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-gold-300 hover:text-gold-400 font-medium"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
