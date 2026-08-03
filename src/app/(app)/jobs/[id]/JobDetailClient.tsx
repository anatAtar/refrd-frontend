'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { CompanyIcon } from '@/components/job/CompanyIcon';
import { JobDescription } from '@/components/job/JobDescription';
import { Button } from '@/components/ui/Button';
import { ReferrerContactCard } from '@/components/job/ReferrerContactCard';
import { SendCVModal } from '@/components/application/SendCVModal';
import { SendCVSuccessModal } from '@/components/application/SendCVSuccessModal';
import { OutOfCreditsModal } from '@/components/credits/OutOfCreditsModal';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppliedJobIds } from '@/lib/hooks/useApplications';
import { useCreditBalance, refreshCreditBalance } from '@/lib/hooks/useCredits';
import { creditHintText } from '@/lib/utils';
import type { JobWithReferrer, JobReferrer } from '@/lib/types';
import Link from 'next/link';

export default function JobDetailClient({ data }: { data: JobWithReferrer }) {
  const { job, referrers } = data;
  const router = useRouter();
  const { user } = useAuth();
  const appliedJobIds = useAppliedJobIds();
  const { balance } = useCreditBalance();
  const [sendCVOpen, setSendCVOpen] = useState(false);
  const [outOfCreditsOpen, setOutOfCreditsOpen] = useState(false);
  const [sentTo, setSentTo] = useState<JobReferrer | null>(null);

  const isOwnPosting  = referrers.some((r) => r.id === user?.id) || user?.id === job.referrerId;
  const alreadyApplied = referrers.some((r) => appliedJobIds.has(r.jobId));

  const handleSendClick = () => {
    if (balance && balance.total <= 0) setOutOfCreditsOpen(true);
    else setSendCVOpen(true);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/jobs'))}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <CompanyIcon sourceUrl={job.sourceUrl} size={56} />
              <div>
                <h1 className="text-[26px] font-bold text-text-primary leading-tight">{job.title}</h1>
                <p className="text-sm text-text-secondary mt-1.5">
                  {job.companyName}
                  {job.location && <> · {job.location}</>}
                  {job.jobType && <> · {job.jobType}</>}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.jobType    && <Badge variant="muted">{job.jobType}</Badge>}
              {job.workMode   && <Badge variant="teal">{job.workMode}</Badge>}
              {!job.isActive  && <Badge variant="rose">Closed</Badge>}
              {isOwnPosting   && <Badge variant="violet">Your posting</Badge>}
              {alreadyApplied && <Badge variant="good">CV Sent ✓</Badge>}
            </div>

            {job.description && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-3">About the Role</h2>
                <JobDescription description={job.description} />
              </div>
            )}

            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 text-sm text-gold-300 hover:text-gold-400">
              View original posting ↗
            </a>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:sticky md:top-6 md:self-start">
            {isOwnPosting ? (
              <Link href="/jobs/mine">
                <Button variant="secondary" size="lg" className="w-full">Manage this job</Button>
              </Link>
            ) : alreadyApplied ? (
              <div className="w-full text-center py-3 bg-good/10 border border-good/25 rounded-xl text-sm font-semibold text-good">
                ✓ CV Sent
              </div>
            ) : job.isActive ? (
              <div className="border border-border rounded-xl p-4 bg-card">
                <p className="text-sm font-semibold text-text-primary mb-3">Ready to reach out?</p>
                <Button variant="primary" size="lg" className="w-full" onClick={handleSendClick}>
                  Send My C.V.
                </Button>
                <p className="text-xs text-text-muted mt-2 text-center">
                  {referrers.length > 1
                    ? `${referrers.length} people at ${job.companyName} can refer you`
                    : `Goes straight to ${referrers[0]?.fullName.split(' ')[0]} at ${job.companyName}`}
                </p>
                <p className="text-xs text-text-muted mt-1 text-center">{creditHintText(balance)}</p>
              </div>
            ) : (
              <Button variant="ghost" size="lg" className="w-full" disabled>Job closed</Button>
            )}

            <ReferrerContactCard referrers={referrers} job={job} />
          </div>
        </div>
      </div>

      {!isOwnPosting && !alreadyApplied && (
        <SendCVModal
          open={sendCVOpen}
          onClose={() => setSendCVOpen(false)}
          onSuccess={(referrer) => { setSentTo(referrer); refreshCreditBalance(); }}
          job={job}
          referrers={referrers}
        />
      )}
      {/* Not gated on alreadyApplied — submitting flips that to true
          immediately (optimisticAddApplication), which would otherwise
          unmount this in the same render it's meant to open in. */}
      <SendCVSuccessModal
        open={!!sentTo}
        onClose={() => setSentTo(null)}
        referrerFirstName={sentTo?.fullName.split(' ')[0] ?? ''}
        jobTitle={job.title}
      />
      <OutOfCreditsModal open={outOfCreditsOpen} onClose={() => setOutOfCreditsOpen(false)} />
    </>
  );
}
