'use client';

import useSWR from 'swr';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import { savedJobsApi } from '@/lib/api/savedJobs';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';
import Link from 'next/link';

function hoursElapsed(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 1000 / 60 / 60;
}

function TimelineBar({ createdAt }: { createdAt: string }) {
  const hours   = hoursElapsed(createdAt);
  const pct     = Math.min(hours / 48, 1) * 100;
  const overdue = hours >= 48;
  const warning = hours >= 24;
  const color   = overdue || warning ? '#B45309' : '#D4AF7A';
  const label   = overdue ? 'Overdue' : `${Math.floor(hours)}h / 48h`;

  const milestones: string[] = [];
  if (hours >= 12) milestones.push('12h reminder sent ✓');
  if (hours >= 24) milestones.push('24h reminder sent ✓');

  return (
    <div className="mt-2.5" style={{ maxWidth: 300 }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.93 0.004 70)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="text-[11.5px] font-bold shrink-0 flex items-center gap-1" style={{ color }}>
          {warning && (
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: color }} />
          )}
          {label}
        </span>
      </div>
      <p className="text-[11px]" style={{ color: 'oklch(0.62 0.008 60)' }}>
        48h response window{milestones.length > 0 ? ` · ${milestones.join(' · ')}` : ''}
      </p>
    </div>
  );
}

export default function FeedClient({ initialJobs }: { initialJobs: JobWithReferrer[] }) {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  const { data: myJobs }  = useSWR('feed/my-jobs',  () => jobsApi.mine().then(r => r.data));
  const { data: myInbox } = useSWR('feed/my-inbox', () => applicationsApi.inbox().then(r => r.data));
  const { data: myApps }  = useSWR('feed/my-apps',  () => applicationsApi.mine().then(r => r.data));
  const { data: savedData, mutate: mutateSaved } = useSWR(
    'saved-jobs',
    () => savedJobsApi.getAll().then(r => r.data),
  );

  // Matched jobs — search by desiredRole if set
  const hasPrefs = !!(user?.desiredRole || user?.preferredLocation);
  const { data: matchedJobs } = useSWR(
    hasPrefs ? ['feed/matched', user?.desiredRole, user?.preferredLocation] : null,
    () => jobsApi.search({ q: user?.desiredRole ?? '' }).then(r => r.data),
  );

  // Stats
  const appsSent      = (myApps  ?? []).length;
  const awaitingResp  = (myApps  ?? []).filter(a => a.application.status === 'submitted').length;

  // Needs attention — seeker side: my apps still submitted (waiting on referrer)
  const seekerPending = (myApps ?? []).filter(a => a.application.status === 'submitted');

  // Needs attention — referrer side: inbox CVs that need a decision
  const referrerPending = (myInbox ?? []).filter(
    a => a.application.status === 'submitted' || a.application.status === 'viewed',
  );

  const hasAttention = seekerPending.length > 0 || referrerPending.length > 0;
  const recentApps   = (myApps ?? []).slice(0, 3);
  const isNewUser    = appsSent === 0 && (myInbox ?? []).length === 0;

  const activeJobs  = (myJobs  ?? []).filter(j => j.isActive).length;
  const totalCVs    = (myInbox ?? []).length;
  const pendingCVs  = (myInbox ?? []).filter(a => a.application.status === 'submitted').length;

  return (
    <div style={{ padding: '32px 40px 60px' }}>

      {/* ── PAGE HEADER ── */}
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
        Welcome back, {firstName}
      </h1>
      <p style={{ fontSize: 14.5, color: 'oklch(0.47 0.008 60)', margin: '0 0 24px' }}>
        Here's where things stand.
      </p>

      {/* ── ROLE ACTION BLOCKS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

        {/* Seeker block */}
        <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Looking for a job</p>
            <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: 0 }}>Browse roles and track your applications</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: 'oklch(0.24 0.008 60)' }}>{appsSent}</p>
              <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Apps sent</p>
            </div>
            <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: awaitingResp > 0 ? 'oklch(0.72 0.13 85)' : 'oklch(0.24 0.008 60)' }}>{awaitingResp}</p>
              <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Awaiting response</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/applications?tab=sent" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13, fontWeight: 700, borderRadius: 9, textDecoration: 'none' }}>
              My Applications
            </Link>
            <Link href="/jobs" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.97 0.003 75)', border: '1px solid oklch(0.93 0.004 70)', color: 'oklch(0.24 0.008 60)', fontSize: 13, fontWeight: 600, borderRadius: 9, textDecoration: 'none' }}>
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Referrer block */}
        <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Your job postings</p>
            <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: 0 }}>Review applicants and manage your openings</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: 'oklch(0.24 0.008 60)' }}>{activeJobs}</p>
              <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Jobs posted</p>
            </div>
            <div style={{ background: pendingCVs > 0 ? 'oklch(0.88 0.09 85)' : 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: pendingCVs > 0 ? 'oklch(0.3 0.06 85)' : 'oklch(0.24 0.008 60)' }}>{pendingCVs}</p>
              <p style={{ fontSize: 11.5, color: pendingCVs > 0 ? 'oklch(0.4 0.06 85)' : 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>CVs to review</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/applications?tab=received" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13, fontWeight: 700, borderRadius: 9, textDecoration: 'none' }}>
              CV Inbox{pendingCVs > 0 ? ` (${pendingCVs})` : ''}
            </Link>
            <Link href="/jobs/post" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.97 0.003 75)', border: '1px solid oklch(0.93 0.004 70)', color: 'oklch(0.24 0.008 60)', fontSize: 13, fontWeight: 600, borderRadius: 9, textDecoration: 'none' }}>
              Post a Job
            </Link>
          </div>
        </div>

      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT COLUMN: stats + needs attention ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Needs your attention card — only shown if there's something to act on */}
          {hasAttention && (
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ borderTop: '1px solid oklch(0.93 0.004 70)', padding: 20 }}>
                <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: '0 0 16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Needs your attention
                  <span
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, borderRadius: '100%', border: '1px solid oklch(0.62 0.008 60)', fontSize: 9, fontWeight: 700, cursor: 'default' }}
                    title="The bar shows time elapsed since the CV was received. More fill = more urgent. Reminders go out at 12h and 24h."
                  >?</span>
                </p>

                {/* Group 1 — seeker side */}
                {seekerPending.length > 0 && (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>Your applications — waiting on a referrer</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: referrerPending.length > 0 ? 20 : 0 }}>
                      {seekerPending.map(a => (
                        <div
                          key={a.application.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderLeft: '3px solid oklch(0.72 0.13 85)', borderRadius: 10, padding: '14px 16px', border: '1px solid oklch(0.93 0.004 70)', borderLeftWidth: 3 }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{a.job.title} · {a.job.companyName}</p>
                            <p style={{ fontSize: 13, color: 'oklch(0.47 0.008 60)', margin: 0 }}>
                              Waiting on {a.referrer?.fullName} to respond
                            </p>
                            <TimelineBar createdAt={a.application.createdAt} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Group 2 — referrer side */}
                {referrerPending.length > 0 && (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>CVs waiting on your review — as the referrer</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {referrerPending.map(a => {
                        const hours = hoursElapsed(a.application.createdAt);
                        const urgent = hours >= 24;
                        const borderCol = urgent ? '#B45309' : 'oklch(0.72 0.13 85)';
                        return (
                          <div
                            key={a.application.id}
                            style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderLeft: `3px solid ${borderCol}`, borderRadius: 10, padding: '14px 16px', border: '1px solid oklch(0.93 0.004 70)', borderLeftWidth: 3 }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{a.job.title} · your posting</p>
                              <p style={{ fontSize: 13, color: 'oklch(0.47 0.008 60)', margin: 0 }}>
                                {a.seeker?.fullName}'s CV needs a decision from you
                              </p>
                              <TimelineBar createdAt={a.application.createdAt} />
                            </div>
                            <Link
                              href="/applications/inbox"
                              style={{ border: 'none', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13.5, fontWeight: 700, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}
                            >
                              Review
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: recent applications + matched jobs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Recent applications */}
          {recentApps.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Your recent applications</h2>
                <Link href="/applications" style={{ fontSize: 13.5, fontWeight: 600, color: 'oklch(0.5 0.02 60)', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentApps.map(a => (
                  <Link
                    key={a.application.id}
                    href="/applications"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 14, padding: '16px 20px', gap: 16, textDecoration: 'none' }}
                    className="hover:bg-card-hover transition-colors"
                  >
                    <div>
                      <p style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 4px', color: 'oklch(0.24 0.008 60)' }}>{a.job.title}</p>
                      <p style={{ fontSize: 13, color: 'oklch(0.47 0.008 60)', margin: 0 }}>
                        {a.job.companyName} · via {a.referrer?.fullName} · {timeAgo(a.application.createdAt)}
                      </p>
                    </div>
                    <span className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border shrink-0 ${STATUS_COLORS[a.application.status] ?? ''}`}>
                      {STATUS_LABELS[a.application.status]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched to your profile */}
          {hasPrefs && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Matched to your profile</h2>
                <Link href="/jobs" style={{ fontSize: 13.5, fontWeight: 600, color: 'oklch(0.5 0.02 60)', textDecoration: 'none' }}>Browse all jobs →</Link>
              </div>
              <p style={{ fontSize: 13, color: 'oklch(0.62 0.008 60)', margin: '0 0 16px' }}>
                {user?.desiredRole && <><strong style={{ color: 'oklch(0.24 0.008 60)' }}>{user.desiredRole}</strong>{user?.preferredLocation ? ' · ' : ''}</>}
                {user?.preferredLocation && <strong style={{ color: 'oklch(0.24 0.008 60)' }}>{user.preferredLocation}</strong>}
                {' · '}
                <Link href="/settings" style={{ color: 'oklch(0.72 0.13 85)', fontWeight: 600, textDecoration: 'none' }}>Edit preferences →</Link>
              </p>

              {!matchedJobs ? (
                <p style={{ fontSize: 13, color: 'oklch(0.62 0.008 60)' }}>Loading matches…</p>
              ) : matchedJobs.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: '24px 22px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>No matches yet</p>
                  <p style={{ fontSize: 13, color: 'oklch(0.62 0.008 60)', margin: 0 }}>
                    No active jobs match your preferences right now.{' '}
                    <Link href="/jobs" style={{ color: 'oklch(0.72 0.13 85)', fontWeight: 600, textDecoration: 'none' }}>Browse all jobs →</Link>
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {matchedJobs.slice(0, 5).map((j, idx) => {
                    const isSaved = (savedData ?? []).some(s => s.job.id === j.job.id);
                    const toggleSave = async () => {
                      try {
                        if (isSaved) {
                          await savedJobsApi.unsave(j.job.id);
                          mutateSaved((savedData ?? []).filter(s => s.job.id !== j.job.id), false);
                        } else {
                          await savedJobsApi.save(j.job.id);
                          mutateSaved();
                        }
                      } catch {
                        mutateSaved();
                      }
                    };
                    return (
                    <div
                      key={j.job.id}
                      style={{ background: '#fff', border: idx === 0 ? '1px solid oklch(0.72 0.13 85)' : '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                      {/* Row 1: company icon + name + button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'oklch(0.94 0.004 70)', color: 'oklch(0.47 0.008 60)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <rect x="4" y="3" width="16" height="18" rx="1" />
                              <rect x="8" y="7" width="2.5" height="2.5" fill="currentColor" stroke="none" />
                              <rect x="13.5" y="7" width="2.5" height="2.5" fill="currentColor" stroke="none" />
                              <rect x="8" y="12" width="2.5" height="2.5" fill="currentColor" stroke="none" />
                              <rect x="13.5" y="12" width="2.5" height="2.5" fill="currentColor" stroke="none" />
                              <rect x="9.5" y="17" width="5" height="4" fill="currentColor" stroke="none" />
                            </svg>
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>{j.job.companyName}</span>
                        </div>
                        <Link
                          href={`/jobs/${j.job.id}`}
                          style={{ background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13.5, fontWeight: 700, padding: '10px 18px', border: 'none', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}
                        >
                          Role Details
                        </Link>
                      </div>
                      {/* Row 2: job title */}
                      <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: 0, color: 'oklch(0.24 0.008 60)' }}>{j.job.title}</h3>
                      {/* Row 3: meta */}
                      <p style={{ fontSize: 13, color: 'oklch(0.47 0.008 60)', margin: 0 }}>
                        {[j.job.location, j.job.jobType, timeAgo(j.job.createdAt)].filter(Boolean).join(' · ')}
                      </p>
                  {/* Row 4: referrer footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid oklch(0.93 0.004 70)', paddingTop: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar src={j.referrer.avatarUrl} name={j.referrer.fullName} size="sm" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.72 0.13 85)' }}>via {j.referrer.fullName}</span>
                    </div>
                    <button
                      onClick={toggleSave}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid oklch(0.93 0.004 70)', background: isSaved ? 'oklch(0.88 0.09 85)' : 'transparent', color: isSaved ? 'oklch(0.3 0.06 85)' : 'oklch(0.47 0.008 60)', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 9, cursor: 'pointer' }}
                    >
                      {isSaved ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
                );
              })}
              </div>
              )}
            </div>
          )}

          {/* Nudge if no preferences set */}
          {!hasPrefs && !isNewUser && (
            <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>Get matched to relevant jobs</p>
              <p style={{ fontSize: 13, color: 'oklch(0.62 0.008 60)', margin: '0 0 12px' }}>
                Set your desired role and location to see matched jobs right here.
              </p>
              <Link href="/settings" style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.72 0.13 85)', textDecoration: 'none' }}>
                Set preferences →
              </Link>
            </div>
          )}

          {/* Empty state */}
          {isNewUser && (
            <div style={{ textAlign: 'center', padding: '48px 0', background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>You're all set!</p>
              <p style={{ fontSize: 13, color: 'oklch(0.62 0.008 60)', margin: '0 0 20px' }}>Browse open jobs and send your CV directly to a contact inside the company.</p>
              <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13.5, fontWeight: 700, borderRadius: 9, textDecoration: 'none' }}>
                🔍 Browse all jobs
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
