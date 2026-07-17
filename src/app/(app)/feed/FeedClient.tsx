'use client';

import { useState } from 'react';
import { JobFilters } from '@/components/job/JobFilters';
import { JobCard } from '@/components/job/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { useJobFeed } from '@/lib/hooks/useJobs';
import { useAuth } from '@/lib/context/AuthContext';
import { useDebounce } from '@/lib/hooks/useDebounce';
import type { JobWithReferrer } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Filters { jobType?: string }

export default function FeedClient({ initialJobs }: { initialJobs: JobWithReferrer[] }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const debouncedSearch = useDebounce(search, 300);
  const { user } = useAuth();
  const router = useRouter();

  const params = {
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(filters.jobType ? { jobType: filters.jobType } : {}),
  };

  const { jobs, isLoading } = useJobFeed(params, initialJobs);
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-8 text-center relative overflow-hidden"
        style={{
          background: 'var(--color-card)',
          border: '1px solid rgba(212,175,122,0.15)',
        }}
      >
        {/* App name — two tone */}
        <div className="text-3xl font-black tracking-tight mb-3">
          <span style={{ background: 'linear-gradient(160deg,#FAFAFA,#E8E8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Direct</span>
          <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ref</span>
        </div>
        </div>
        {/* Tagline */}
        <h1 className="text-lg font-bold text-text-primary mb-2">
          Hey {firstName} 👋 Let&apos;s find your next role together
        </h1>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto mb-5">
          Your CV, direct to the right person.
        </p>

        {/* How it works — 3 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center mb-6">
          {[
            { icon: '👥', step: '1', title: 'Connect', desc: 'Add friends who work at companies you like' },
            { icon: '🔍', step: '2', title: 'Find a role', desc: 'See jobs posted by your connections' },
            { icon: '📄', step: '3', title: 'Send your CV', desc: 'It goes straight to your friend inside' },
          ].map((s) => (
            <div key={s.step} className="bg-page/60 rounded-xl p-3 border border-border">
              <div className="text-2xl mb-1.5">{s.icon}</div>
              <div className="text-xs font-bold text-text-primary mb-0.5">{s.title}</div>
              <div className="text-xs text-text-muted leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Link
            href="/network"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-300 hover:bg-gold-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            👥 Add friends
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-card-hover border border-border-strong text-text-primary text-sm font-medium rounded-lg hover:border-gold-300/40 transition-colors"
          >
            🔍 Browse all jobs
          </Link>
          <Link
            href="/jobs/post"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-card-hover border border-border-strong text-text-primary text-sm font-medium rounded-lg hover:border-gold-300/40 transition-colors"
          >
            ＋ Post a job
          </Link>
        </div>
      </div>

      {/* ── Feed section ──────────────────────────────────────────── */}
      {(jobs.length > 0 || isLoading) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary">
              Jobs from your network
            </h2>
            {jobs.length > 0 && (
              <span className="text-xs text-text-muted">{jobs.length} open {jobs.length === 1 ? 'role' : 'roles'}</span>
            )}
          </div>

          {/* Search */}
          <div className="flex gap-3 items-center bg-input border border-border-strong rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gold-300/40 transition-all mb-3">
            <span className="text-text-muted">🔍</span>
            <input
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              placeholder="Search jobs, companies, or friends…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary">✕</button>
            )}
          </div>

          <JobFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Job list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 && !search ? (
        /* Empty feed — no connections yet */
        <div className="text-center py-6 text-text-muted text-sm">
          <p>
            Your feed is empty.{' '}
            <Link href="/network" className="text-gold-300 hover:text-gold-400 font-medium">
              Add friends
            </Link>{' '}
            to see their job postings here.
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-6 text-text-muted text-sm">
          No jobs match &quot;{search}&quot;.{' '}
          <button onClick={() => setSearch('')} className="text-gold-300 hover:text-gold-400 font-medium">Clear search</button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((j) => <JobCard key={j.job.id} data={j} />)}
        </div>
      )}
    </div>
  );
}
