'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReferrerContactCard } from '@/components/job/ReferrerContactCard';
import { SendCVModal } from '@/components/application/SendCVModal';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppliedJobIds } from '@/lib/hooks/useApplications';
import { jobCode } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';
import Link from 'next/link';

export default function JobDetailClient({ data }: { data: JobWithReferrer }) {
  const { job, referrer } = data;
  const { user } = useAuth();
  const appliedJobIds = useAppliedJobIds();
  const [sendCVOpen, setSendCVOpen] = useState(false);

  const isOwnPosting  = user?.id === job.referrerId;
  const alreadyApplied = appliedJobIds.has(job.id);

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors">
          ← Back
        </Link>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-xl bg-input border border-border flex items-center justify-center text-2xl shrink-0">🏢</div>
              <div>
                <h1 className="text-xl font-bold text-text-primary leading-tight">{job.title}</h1>
                <p className="text-text-secondary mt-1">{job.companyName}</p>
                {job.location && <p className="text-sm text-text-muted mt-0.5">📍 {job.location}</p>}
                <p className="text-xs text-text-muted font-mono mt-1">{jobCode(job.companyName, job.id)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.jobType    && <Badge variant="muted">{job.jobType}</Badge>}
              {job.salaryRange && <Badge variant="muted">{job.salaryRange}</Badge>}
              {!job.isActive  && <Badge variant="rose">Closed</Badge>}
              {isOwnPosting   && <Badge variant="violet">Your posting</Badge>}
              {alreadyApplied && <Badge variant="good">CV Sent ✓</Badge>}
            </div>

            {job.description && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-3">About the Role</h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 text-sm text-gold-300 hover:text-gold-400">
              View original posting ↗
            </a>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ReferrerContactCard referrer={referrer} job={job} />

            {isOwnPosting ? (
              <Link href="/jobs/mine">
                <Button variant="secondary" size="lg" className="w-full">Manage this job</Button>
              </Link>
            ) : alreadyApplied ? (
              <div className="w-full text-center py-3 bg-good/10 border border-good/25 rounded-xl text-sm font-semibold text-good">
                ✓ You already sent your CV
              </div>
            ) : job.isActive ? (
              <Button variant="primary" size="lg" className="w-full" onClick={() => setSendCVOpen(true)}>
                Send CV to {referrer.fullName.split(' ')[0]}
              </Button>
            ) : (
              <Button variant="ghost" size="lg" className="w-full" disabled>Job closed</Button>
            )}
          </div>
        </div>
      </div>

      {!isOwnPosting && !alreadyApplied && (
        <SendCVModal
          open={sendCVOpen}
          onClose={() => setSendCVOpen(false)}
          job={job}
          referrer={referrer}
        />
      )}
    </>
  );
}
