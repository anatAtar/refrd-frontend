'use client';

import useSWR from 'swr';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import { usersApi } from '@/lib/api/users';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import type { JobWithReferrer, PublicUser } from '@/lib/types';
import Link from 'next/link';

export default function FeedClient({ initialJobs }: { initialJobs: JobWithReferrer[] }) {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  const { data: myJobs }   = useSWR('feed/my-jobs',   () => jobsApi.mine().then(r => r.data));
  const { data: myInbox }  = useSWR('feed/my-inbox',  () => applicationsApi.inbox().then(r => r.data));
  const { data: myApps }   = useSWR('feed/my-apps',   () => applicationsApi.mine().then(r => r.data));
  const { data: allUsers } = useSWR('feed/discover',  () => usersApi.search('', 1, 6).then(r => r.data));

  const activeJobs = (myJobs  ?? []).filter(j => j.isActive).length;
  const totalCVs   = (myInbox ?? []).length;
  const pendingCVs = (myInbox ?? []).filter(a => a.application.status === 'submitted').length;
  const myAppsSent = (myApps  ?? []).length;

  const recentInbox = (myInbox ?? []).slice(0, 3);
  const recentApps  = (myApps  ?? []).slice(0, 3);
  const isNewUser   = activeJobs === 0 && totalCVs === 0 && myAppsSent === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* ── LEFT ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Greeting + Stats — dark banner */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#120E09', border: '1px solid rgba(212,175,122,0.12)' }}>
            {/* Top: greeting */}
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-xl font-bold mb-1" style={{ color: '#F5EDD8' }}>
                Hey {firstName} 👋 Welcome to{' '}
                <span style={{ background: 'linear-gradient(160deg,#FAFAFA,#E8E8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Direct</span>
                <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ref</span>
              </h1>
              <p className="text-sm" style={{ color: '#6A5A3A' }}>Send your CV directly to a contact inside the company</p>
            </div>

            {/* Bottom: stats strip */}
            <div className="grid grid-cols-3" style={{ borderTop: '1px solid rgba(212,175,122,0.08)' }}>
              <Link href="/jobs/mine" className="px-5 py-4 transition-colors hover:bg-white/5" style={{ borderRight: '1px solid rgba(212,175,122,0.08)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📌</span>
                  {pendingCVs > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(176,128,16,0.2)', color: '#D4AF7A', border: '1px solid rgba(212,175,122,0.2)' }}>{pendingCVs} new</span>}
                </div>
                <div className="text-2xl font-bold" style={{ color: '#F5EDD8' }}>{activeJobs}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6A5A3A' }}>Jobs posted</div>
              </Link>

              <Link href="/applications/inbox" className="px-5 py-4 transition-colors hover:bg-white/5" style={{ borderRight: '1px solid rgba(212,175,122,0.08)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📥</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#F5EDD8' }}>{totalCVs}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6A5A3A' }}>CVs received</div>
              </Link>

              <Link href="/applications" className="px-5 py-4 transition-colors hover:bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📋</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#F5EDD8' }}>{myAppsSent}</div>
                <div className="text-xs mt-0.5" style={{ color: '#6A5A3A' }}>CVs sent</div>
              </Link>
            </div>
          </div>

          {/* Recent CVs received */}
          {recentInbox.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">Recent CVs Received</h2>
                <Link href="/applications/inbox" className="text-xs font-semibold text-gold-500 hover:text-gold-400">See all →</Link>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(26,18,9,0.08)' }}>
                {recentInbox.map((a, i) => (
                  <Link key={a.application.id} href="/applications/inbox"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-card-hover transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid rgba(26,18,9,0.06)' : undefined }}
                  >
                    <Avatar src={a.seeker?.avatarUrl} name={a.seeker?.fullName ?? '?'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{a.seeker?.fullName}</p>
                      <p className="text-xs text-text-muted truncate">{a.job.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[a.application.status] ?? ''}`}>
                        {STATUS_LABELS[a.application.status]}
                      </span>
                      <span className="text-[10px] text-text-muted">{timeAgo(a.application.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent My Applications */}
          {recentApps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">My Recent Applications</h2>
                <Link href="/applications" className="text-xs font-semibold text-gold-500 hover:text-gold-400">See all →</Link>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(26,18,9,0.08)' }}>
                {recentApps.map((a, i) => (
                  <Link key={a.application.id} href="/applications"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-card-hover transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid rgba(26,18,9,0.06)' : undefined }}
                  >
                    <div className="text-xl">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{a.job.title}</p>
                      <p className="text-xs text-text-muted truncate">{a.job.companyName} · via {a.referrer?.fullName}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[a.application.status] ?? ''}`}>
                      {STATUS_LABELS[a.application.status]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {isNewUser && (
            <div className="text-center py-12 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(26,18,9,0.08)' }}>
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-sm font-semibold text-text-primary mb-1">You're all set!</p>
              <p className="text-xs text-text-muted mb-5 max-w-xs mx-auto">Browse open jobs and send your CV directly to a contact inside the company.</p>
              <Link href="/jobs" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-300 hover:bg-gold-400 text-[#0A0A0A] text-sm font-semibold rounded-lg transition-colors">
                🔍 Browse all jobs
              </Link>
            </div>
          )}
        </div>

        {/* ── RIGHT ────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(26,18,9,0.08)', boxShadow: '0 1px 4px rgba(26,18,9,0.06)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(26,18,9,0.06)' }}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">Quick Actions</h3>
            </div>
            {[
              { href: '/jobs',               icon: '🔍', label: 'Browse all jobs',   sub: 'Find roles across all companies' },
              { href: '/jobs/post',          icon: '＋', label: 'Post a job',        sub: 'Share an opening at your company' },
              { href: '/network',            icon: '👥', label: 'Grow your network', sub: 'Connect with more people' },
              { href: '/applications/inbox', icon: '📥', label: 'CV Inbox',          sub: 'Review received applications' },
            ].map((item, i) => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-card-hover transition-colors group"
                style={{ borderTop: i > 0 ? '1px solid rgba(26,18,9,0.06)' : undefined }}
              >
                <div className="text-lg w-6 text-center shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-gold-500 transition-colors">{item.label}</p>
                  <p className="text-xs text-text-muted truncate">{item.sub}</p>
                </div>
                <span className="text-text-muted text-sm shrink-0">→</span>
              </Link>
            ))}
          </div>

          {/* People on DirectRef */}
          {allUsers && allUsers.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(26,18,9,0.08)', boxShadow: '0 1px 4px rgba(26,18,9,0.06)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(26,18,9,0.06)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">People on DirectRef</h3>
              </div>
              {allUsers.slice(0, 5).map((person: PublicUser, i: number) => (
                <div key={person.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderTop: i > 0 ? '1px solid rgba(26,18,9,0.06)' : undefined }}
                >
                  <Avatar src={person.avatarUrl} name={person.fullName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{person.fullName}</p>
                    <p className="text-xs text-text-muted truncate">{person.companyName ?? '—'}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(26,18,9,0.06)' }}>
                <Link href="/network" className="text-xs font-semibold text-gold-500 hover:text-gold-400 transition-colors">See all people →</Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
