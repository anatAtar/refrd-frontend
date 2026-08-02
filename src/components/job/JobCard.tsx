'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CompanyIcon } from '@/components/job/CompanyIcon';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SendCVModal } from '@/components/application/SendCVModal';
import { SendCVSuccessModal } from '@/components/application/SendCVSuccessModal';
import { useAuth } from '@/lib/context/AuthContext';
import { useMyApplicationsMap } from '@/lib/hooks/useApplications';
import { savedJobsApi } from '@/lib/api/savedJobs';
import { timeAgo, jobSlug } from '@/lib/utils';
import type { JobWithReferrer, JobReferrer } from '@/lib/types';
import Link from 'next/link';
import useSWR from 'swr';

interface JobCardProps {
  data: JobWithReferrer;
}

// Status → icon + tooltip text (no icon for "viewed" — reviewed status shows via the CTA label only)
const STATUS_INDICATORS: Record<string, { icon: string; label: string; color: string }> = {
  submitted:  { icon: '📤', label: 'CV sent — awaiting review',          color: 'text-text-muted' },
  forwarded:  { icon: '🎉', label: 'Forwarded to HR',                    color: 'text-good'       },
  rejected:   { icon: '✕',  label: 'Not a fit — referrer passed on this', color: 'text-crit'      },
};

export function JobCard({ data }: JobCardProps) {
  const { job, referrer, referrers } = data;
  const router = useRouter();
  const { user } = useAuth();
  const { appMap } = useMyApplicationsMap();
  const [sendCVOpen, setSendCVOpen] = useState(false);
  const [sentTo, setSentTo] = useState<JobReferrer | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const href = `/jobs/${jobSlug(job.title, job.id)}`;
  const isNew = Date.now() - new Date(job.createdAt).getTime() < 48 * 3600 * 1000;

  const isOwnPosting   = referrers.some((r) => r.id === user?.id) || user?.id === job.referrerId;
  const appStatus      = referrers.map((r) => appMap.get(r.jobId)).find(Boolean);
  const alreadyApplied = !!appStatus;
  const indicator      = appStatus ? STATUS_INDICATORS[appStatus] : null;

  // Save/unsave — use same SWR key as ApplicationsClient Saved tab
  const { data: savedData, mutate: mutateSaved } = useSWR(
    'saved-jobs',
    () => savedJobsApi.getAll().then(r => r.data),
    { revalidateOnFocus: false },
  );
  const isSaved = (savedData ?? []).some(s => s.job.id === job.id);
  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isSaved) {
        await savedJobsApi.unsave(job.id);
        mutateSaved((savedData ?? []).filter(s => s.job.id !== job.id), false);
      } else {
        await savedJobsApi.save(job.id);
        mutateSaved(); // revalidate to get full job data back
      }
    } catch {
      mutateSaved(); // revert on error
    }
  };

  return (
    <>
      <Card hover className="p-4 flex flex-col gap-3" onClick={() => router.push(href)}>
        {/* Header */}
        <div className="flex gap-3 items-start">
          <CompanyIcon sourceUrl={job.sourceUrl} size={44} className="rounded-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-text-primary truncate">{job.companyName}</span>
              {isNew && <Badge variant="violet">New</Badge>}
            </div>
            <Link href={href} className="block" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-[16.5px] font-semibold leading-snug text-accent-silver hover:text-gold-300 transition-colors">
                {job.title}
              </h3>
            </Link>
            <p className="text-[13px] text-text-muted mt-0.5">
              {job.location ?? 'Remote'}{job.jobType ? ` · ${job.jobType}` : ''} · {timeAgo(job.createdAt)}
            </p>
          </div>

          {/* Status badges + icon */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Eye / status icon with tooltip */}
            {indicator && (
              <div className="relative">
                <button
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => setTooltipVisible(false)}
                  onFocus={() => setTooltipVisible(true)}
                  onBlur={() => setTooltipVisible(false)}
                  className={`text-base leading-none ${indicator.color} cursor-default`}
                  aria-label={indicator.label}
                >
                  {indicator.icon}
                </button>
                {tooltipVisible && (
                  <div className="absolute right-0 top-7 z-50 whitespace-nowrap bg-card-hover border border-border-strong text-xs text-text-primary px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none">
                    {indicator.label}
                    {/* Arrow */}
                    <div className="absolute -top-1 right-2 w-2 h-2 bg-card-hover border-l border-t border-border-strong rotate-45" />
                  </div>
                )}
              </div>
            )}
            {!job.isActive && <Badge variant="muted">Closed</Badge>}
            {isOwnPosting && <Badge variant="violet">Your post</Badge>}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.jobType    && <Badge variant="muted">{job.jobType}</Badge>}
          {job.workMode   && <Badge variant="teal">{job.workMode}</Badge>}
        </div>

        {/* Contact row — overlapping avatar stack + referrer count, per Jobs Page Dev Spec */}
        <div className="flex items-center gap-2 bg-gold-300/8 border border-gold-300/15 rounded-lg px-3 py-2">
          <div className="flex items-center -space-x-2 shrink-0">
            {referrers.slice(0, 3).map((r) => (
              <Avatar key={r.id} src={r.avatarUrl} name={r.fullName} size="xs" className="ring-2 ring-card" />
            ))}
          </div>
          <span className="text-xs text-text-secondary truncate">
            {referrers.length > 1 ? (
              <span className="text-gold-300 font-semibold">{referrers.length} referrers at this company</span>
            ) : (
              <>
                <span className="text-gold-300 font-semibold">{referrer.fullName}</span> works here
              </>
            )}
          </span>
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          {isOwnPosting ? (
            <Link href="/jobs/mine" className="flex-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="sm" className="w-full">Manage this job</Button>
            </Link>
          ) : alreadyApplied ? (
            <>
              <Link href={href} className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="primary" size="sm" className="w-full min-h-[44px]">View Details</Button>
              </Link>
              <Button variant="ghost" size="sm" className="min-h-[44px] text-text-muted shrink-0 gap-1" disabled>
                {appStatus === 'forwarded' ? '🎉 Forwarded' :
                 appStatus === 'viewed'    ? 'Reviewed' :
                 appStatus === 'rejected'  ? '✕ Not a fit' :
                 '✓ CV sent'}
              </Button>
            </>
          ) : job.isActive ? (
            <>
              <Link href={href} className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="primary" size="sm" className="w-full min-h-[44px]">View Details</Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[44px] text-text-muted hover:text-text-primary shrink-0"
                onClick={(e) => { e.stopPropagation(); setSendCVOpen(true); }}
              >
                Send CV
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="flex-1 min-h-[44px]" disabled>Job closed</Button>
              <Link href={href} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="min-h-[44px]">Details</Button>
              </Link>
            </>
          )}
          {/* Save button — always visible unless own posting */}
          {!isOwnPosting && (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[44px] shrink-0 transition-colors"
              style={{ color: isSaved ? '#D4AF7A' : undefined }}
              onClick={toggleSave}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? '★' : '☆'}
            </Button>
          )}
        </div>
      </Card>

      {!isOwnPosting && !alreadyApplied && (
        <SendCVModal
          open={sendCVOpen}
          onClose={() => setSendCVOpen(false)}
          onSuccess={(r) => setSentTo(r)}
          job={job}
          referrers={referrers}
        />
      )}
      {/* Not gated on alreadyApplied — submitting flips that to true
          immediately (optimisticAddApplication), which would otherwise
          unmount this in the same render it's meant to open in. */}
      {!isOwnPosting && (
        <SendCVSuccessModal
          open={!!sentTo}
          onClose={() => setSentTo(null)}
          referrerFirstName={sentTo?.fullName.split(' ')[0] ?? ''}
          jobTitle={job.title}
        />
      )}
    </>
  );
}
