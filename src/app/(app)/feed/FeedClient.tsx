'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Bookmark } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { applicationsApi } from '@/lib/api/applications';
import { savedJobsApi } from '@/lib/api/savedJobs';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { JobCard } from '@/components/job/JobCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { timeAgo, jobSlug, STATUS_LABELS, STATUS_COLORS, STATUS_TOOLTIPS } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';
import Link from 'next/link';

// Escalation ladder: Day 1 (referrer reminder), Day 3 (seeker notified),
// Day 5 (auto-cancel + credit refund). Mirrors ESCALATION_DAYS in the
// backend's src/config/escalation.ts — change both together.
const ESCALATION_DAYS = { REMINDER: 1, ESCALATE: 3, AUTO_CANCEL: 5 } as const;

function daysElapsed(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 1000 / 60 / 60 / 24;
}

function TimelineBar({ createdAt }: { createdAt: string }) {
  const days    = daysElapsed(createdAt);
  const pct     = Math.min(days / ESCALATION_DAYS.AUTO_CANCEL, 1) * 100;
  const overdue = days >= ESCALATION_DAYS.AUTO_CANCEL;
  const warning = days >= ESCALATION_DAYS.ESCALATE;
  const color   = overdue || warning ? '#B45309' : '#D4AF7A';
  const dayNum  = Math.min(ESCALATION_DAYS.AUTO_CANCEL, Math.floor(days) + 1);
  const label   = overdue ? 'Overdue' : `Day ${dayNum} of ${ESCALATION_DAYS.AUTO_CANCEL}`;

  const milestones: string[] = [];
  if (days >= ESCALATION_DAYS.REMINDER) milestones.push('Day 1 reminder sent');
  if (days >= ESCALATION_DAYS.ESCALATE) milestones.push('Day 3 update sent');

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
        5-day response window{milestones.length > 0 ? ` · ${milestones.join(' · ')}` : ''}
      </p>
    </div>
  );
}

export default function FeedClient({ initialJobs }: { initialJobs: JobWithReferrer[] }) {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  // Once the user clicks "Browse a Job" from the empty state, treat them as an
  // active seeker for the rest of this browser session — session-only (not
  // localStorage) so it doesn't linger across logins if they end up posting
  // a job instead and never actually send a CV.
  // `browseStartedReady` guards against a flash of the empty state on every
  // reload: sessionStorage can only be read after mount, so until that read
  // completes we don't know yet whether this flag is really false.
  const [browseStarted, setBrowseStarted] = useState(false);
  const [browseStartedReady, setBrowseStartedReady] = useState(false);
  useEffect(() => {
    if (!user?.id) return;
    setBrowseStarted(sessionStorage.getItem(`feed-browse-started-${user.id}`) === '1');
    setBrowseStartedReady(true);
  }, [user?.id]);
  const markBrowseStarted = () => {
    if (user?.id) sessionStorage.setItem(`feed-browse-started-${user.id}`, '1');
    setBrowseStarted(true);
  };

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

  // Most recently posted jobs, platform-wide — shown to every user regardless of role
  const { data: recentlyPostedJobs } = useSWR(
    'feed/recently-posted',
    () => jobsApi.search({ limit: 5 }).then(r => r.data),
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

  const jobsPosted  = (myJobs  ?? []).length;
  const activeJobs  = (myJobs  ?? []).filter(j => j.isActive).length;
  const recentJobs  = (myJobs  ?? []).slice(0, 3);
  const totalCVs    = (myInbox ?? []).length;
  const pendingCVs  = (myInbox ?? []).filter(a => a.application.status === 'submitted').length;

  // Each top summary card shows once there's real activity in that category —
  // for the seeker side, that also includes having clicked "Browse a Job" this
  // session, so someone actively looking (but not yet applied/saved) sees the
  // "Looking for a job" card instead of an empty choice screen again
  const showSeekerSummary   = appsSent > 0 || (savedData ?? []).length > 0 || browseStarted;
  const showReferrerSummary = jobsPosted > 0;

  // Nothing posted and nothing applied to yet — offer both paths forward instead of empty summaries.
  // Held to false until the sessionStorage check above resolves, so we never flash the empty state
  // (or both the empty state and a summary card) for a returning "Browse a Job" seeker on load.
  const isNewUser = browseStartedReady && !showSeekerSummary && !showReferrerSummary;

  return (
    <div style={{ padding: '32px 40px 60px' }}>

      {/* ── PAGE HEADER ── */}
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
        Welcome back, {firstName}
      </h1>
      <p style={{ fontSize: 14.5, color: '#000000', margin: '0 0 24px' }}>
        Here's where things stand.
      </p>

      {/* ── ROLE ACTION BLOCKS — each only shows once there's activity in that category ── */}
      {(showSeekerSummary || showReferrerSummary) && (
        <div style={{ display: 'grid', gridTemplateColumns: showSeekerSummary && showReferrerSummary ? '1fr 1fr' : '1fr', gap: 16, marginBottom: 28 }}>

          {/* Seeker block */}
          {showSeekerSummary && (
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Looking for a job</p>
              <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: 0 }}>Browse roles and track your applications</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: '#000000' }}>{appsSent}</p>
                <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Apps sent</p>
              </div>
              <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: awaitingResp > 0 ? 'oklch(0.72 0.13 85)' : '#000000' }}>{awaitingResp}</p>
                <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Awaiting response</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/jobs" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13, fontWeight: 700, borderRadius: 9, textDecoration: 'none' }}>
                Browse Jobs
              </Link>
              <Link href="/applications?tab=sent" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: 'oklch(0.97 0.003 75)', border: '1px solid oklch(0.93 0.004 70)', color: 'oklch(0.24 0.008 60)', fontSize: 13, fontWeight: 600, borderRadius: 9, textDecoration: 'none' }}>
                Sent CV
              </Link>
            </div>
          </div>
          )}

          {/* Referrer block */}
          {showReferrerSummary && (
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px' }}>Your job postings</p>
              <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: 0 }}>Review applicants and manage your openings</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: '#000000' }}>{activeJobs}</p>
                <p style={{ fontSize: 11.5, color: 'oklch(0.62 0.008 60)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Jobs posted</p>
              </div>
              <div style={{ background: pendingCVs > 0 ? 'oklch(0.88 0.09 85)' : 'oklch(0.97 0.003 75)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: pendingCVs > 0 ? 'oklch(0.3 0.06 85)' : '#000000' }}>{pendingCVs}</p>
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
          )}

        </div>
      )}

      {/* Empty state — nothing to show yet, offer both paths forward with two large actions */}
      {isNewUser && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'oklch(0.24 0.008 60)' }}>Your CV, hand-delivered</p>
            <Link href="/jobs" onClick={markBrowseStarted} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 280, padding: '18px 32px', background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 16, fontWeight: 700, borderRadius: 12, textDecoration: 'none' }}>
              Browse a Job
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'oklch(0.24 0.008 60)' }}>Your next great hire, one referral away</p>
            <Link href="/jobs/post" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 280, padding: '18px 32px', background: 'oklch(0.97 0.003 75)', border: '1px solid oklch(0.93 0.004 70)', color: 'oklch(0.24 0.008 60)', fontSize: 16, fontWeight: 700, borderRadius: 12, textDecoration: 'none' }}>
              Post a Job
            </Link>
          </div>
        </div>
      )}

      {/* ── SEEKER COLUMN: recent applications + matched jobs + needs attention ── */}
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
                      <p style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 4px', color: '#000000' }}>{a.job.title}</p>
                      <p style={{ fontSize: 13, color: '#000000', margin: 0 }}>
                        {a.job.companyName} · via {a.referrer?.fullName} · {timeAgo(a.application.createdAt)}
                      </p>
                    </div>
                    <Tooltip content={STATUS_TOOLTIPS[a.application.status]}>
                      <span
                        tabIndex={0}
                        className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border shrink-0 cursor-help ${STATUS_COLORS[a.application.status] ?? ''}`}
                      >
                        {STATUS_LABELS[a.application.status]}
                      </span>
                    </Tooltip>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* Recent job postings */}
        {recentJobs.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Your recent job postings</h2>
              <Link href="/jobs/post" style={{ fontSize: 13.5, fontWeight: 600, color: 'oklch(0.5 0.02 60)', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentJobs.map(j => (
                <Link
                  key={j.id}
                  href={`/jobs/${jobSlug(j.title, j.id)}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 14, padding: '16px 20px', gap: 16, textDecoration: 'none' }}
                  className="hover:bg-card-hover transition-colors"
                >
                  <div>
                    <p style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 4px', color: '#000000' }}>{j.title}</p>
                    <p style={{ fontSize: 13, color: '#000000', margin: 0 }}>
                      {j.companyName} · Posted {timeAgo(j.createdAt)}
                    </p>
                  </div>
                  <span
                    className={j.isActive
                      ? 'text-[12px] font-semibold px-3.5 py-1.5 rounded-full border shrink-0 bg-good/15 text-good border-good/25'
                      : 'text-[12px] font-semibold px-3.5 py-1.5 rounded-full border shrink-0'}
                    style={j.isActive ? undefined : { background: 'oklch(0.93 0.004 70)', color: 'oklch(0.47 0.008 60)', borderColor: 'transparent' }}
                  >
                    {j.isActive ? 'Active' : 'Closed'}
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
                {user?.desiredRole && <><strong style={{ color: '#000000' }}>{user.desiredRole}</strong>{user?.preferredLocation ? ' · ' : ''}</>}
                {user?.preferredLocation && <strong style={{ color: '#000000' }}>{user.preferredLocation}</strong>}
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
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'oklch(0.94 0.004 70)', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                          href={`/jobs/${jobSlug(j.job.title, j.job.id)}`}
                          style={{ background: 'oklch(0.72 0.13 85)', color: '#1a1206', fontSize: 13.5, fontWeight: 700, padding: '10px 18px', border: 'none', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}
                        >
                          Role Details
                        </Link>
                      </div>
                      {/* Row 2: job title */}
                      <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: 0, color: '#000000' }}>{j.job.title}</h3>
                      {/* Row 3: meta */}
                      <p style={{ fontSize: 13, color: '#000000', margin: 0 }}>
                        {[j.job.location, j.job.jobType, j.job.workMode, timeAgo(j.job.createdAt)].filter(Boolean).join(' · ')}
                      </p>
                  {/* Row 4: referrer footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid oklch(0.93 0.004 70)', paddingTop: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar src={j.referrer.avatarUrl} name={j.referrer.fullName} size="sm" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.72 0.13 85)' }}>via {j.referrer.fullName}</span>
                    </div>
                    <button
                      onClick={toggleSave}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid oklch(0.93 0.004 70)', background: isSaved ? 'oklch(0.88 0.09 85)' : 'transparent', color: isSaved ? 'oklch(0.3 0.06 85)' : '#000000', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 9, cursor: 'pointer' }}
                    >
                      <Bookmark size={14} strokeWidth={1.8} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Saved' : 'Save'}
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

          {/* Needs your attention card — only shown if there's something to act on */}
          {hasAttention && (
          <div style={{ background: '#fff', border: '1px solid oklch(0.93 0.004 70)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ borderTop: '1px solid oklch(0.93 0.004 70)', padding: 20 }}>
                <p style={{ fontSize: 12.5, color: 'oklch(0.62 0.008 60)', margin: '0 0 16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Needs your attention
                  <span
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, borderRadius: '100%', border: '1px solid oklch(0.62 0.008 60)', fontSize: 9, fontWeight: 700, cursor: 'default' }}
                    title="The bar shows days elapsed since the CV was received. More fill = more urgent. A reminder goes out on Day 1, the seeker is notified on Day 3, and the application auto-closes with a credit refund on Day 5."
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
                            <p style={{ fontSize: 13, color: '#000000', margin: 0 }}>
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
                        const days = daysElapsed(a.application.createdAt);
                        const urgent = days >= ESCALATION_DAYS.ESCALATE;
                        const borderCol = urgent ? '#B45309' : 'oklch(0.72 0.13 85)';
                        return (
                          <div
                            key={a.application.id}
                            style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderLeft: `3px solid ${borderCol}`, borderRadius: 10, padding: '14px 16px', border: '1px solid oklch(0.93 0.004 70)', borderLeftWidth: 3 }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{a.job.title} · your posting</p>
                              <p style={{ fontSize: 13, color: '#000000', margin: 0 }}>
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

      {/* Recently posted jobs — platform-wide, shown to every user regardless of role */}
      {recentlyPostedJobs && recentlyPostedJobs.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Recently posted jobs</h2>
            <Link href="/jobs" style={{ fontSize: 13.5, fontWeight: 600, color: 'oklch(0.5 0.02 60)', textDecoration: 'none' }}>Browse all jobs →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {recentlyPostedJobs.map(j => (
              <JobCard key={j.job.id} data={j} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
