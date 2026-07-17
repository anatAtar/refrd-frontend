'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useInbox } from '@/lib/hooks/useApplications';
import { InboxCard } from '@/components/application/InboxCard';
import { StatTile } from '@/components/ui/StatTile';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { ApplicationWithDetails } from '@/lib/types';

type Tab = 'all' | 'submitted' | 'viewed' | 'rejected';

export default function InboxClient({ initialData }: { initialData: ApplicationWithDetails[] }) {
  const { user } = useAuth();
  const { applications, isLoading, mutate } = useInbox(undefined, initialData);
  const [tab, setTab] = useState<Tab>('all');

  const counts = {
    all:       applications.length,
    submitted: applications.filter(a => a.application.status === 'submitted').length,
    viewed:    applications.filter(a => a.application.status === 'viewed').length,
    rejected:  applications.filter(a => a.application.status === 'rejected').length,
  };

  const filtered = tab === 'all'
    ? applications
    : applications.filter(a => a.application.status === tab);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'all',       label: 'All',        icon: '📥' },
    { id: 'submitted', label: 'Pending',    icon: '⏳' },
    { id: 'viewed',    label: 'Reviewed',   icon: '👀' },
    { id: 'rejected',  label: 'Not a fit',  icon: '✕'  },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">CV Inbox</h1>
        <p className="text-sm text-text-secondary">
          Friends who want to work at <strong className="text-gold-300">{user?.companyName ?? 'your company'}</strong>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total CVs"      value={counts.all}       icon="📥" />
        <StatTile label="Awaiting Review" value={counts.submitted} icon="⏳" />
        <StatTile label="Reviewed"        value={counts.viewed}    icon="👀" accent />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-input border border-border rounded-xl p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all whitespace-nowrap',
              tab === t.id
                ? 'bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            <span>{t.icon}</span>
            {t.label}
            {counts[t.id] > 0 && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                tab === t.id ? 'bg-gold-300/20 text-gold-300' : 'bg-border text-text-muted',
              )}>
                {counts[t.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading && applications.length === 0 ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={tab === 'rejected' ? '✕' : '📭'}
          title={
            tab === 'all'      ? 'No CVs yet' :
            tab === 'rejected' ? 'No declined applications' :
            tab === 'viewed'   ? 'No reviewed applications yet' :
            'No pending applications'
          }
          description={
            tab === 'all'
              ? "When friends apply for jobs you've posted, their CVs will appear here."
              : `No applications with this status.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <InboxCard key={a.application.id} data={a} onUpdate={() => mutate()} />
          ))}
        </div>
      )}
    </div>
  );
}
