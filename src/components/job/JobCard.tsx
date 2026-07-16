'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SendCVModal } from '@/components/application/SendCVModal';
import { useAuth } from '@/lib/context/AuthContext';
import { useMyApplicationsMap } from '@/lib/hooks/useApplications';
import { timeAgo, jobCode } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';
import Link from 'next/link';

interface JobCardProps {
  data: JobWithReferrer;
}

// Status → icon + tooltip text
const STATUS_INDICATORS: Record<string, { icon: string; label: string; color: string }> = {
  submitted:  { icon: '📤', label: 'CV sent — awaiting review',          color: 'text-text-muted' },
  viewed:     { icon: '👀', label: `${''} reviewed your CV`,             color: 'text-warn'       },
  forwarded:  { icon: '🎉', label: 'Forwarded to HR',                    color: 'text-good'       },
  rejected:   { icon: '✕',  label: 'Not a fit — referrer passed on this', color: 'text-crit'      },
};

export function JobCard({ data }: JobCardProps) {
  const { job, referrer } = data;
  const { user } = useAuth();
  const { appMap } = useMyApplicationsMap();
  const [sendCVOpen, setSendCVOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const isOwnPosting  = user?.id === job.referrerId;
  const appStatus     = appMap.get(job.id);
  const alreadyApplied = !!appStatus;
  const indicator     = appStatus ? STATUS_INDICATORS[appStatus] : null;

  return (
    <>
      <Card hover className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex gap-3 items-start">
          <div className="w-11 h-11 rounded-lg bg-input border border-border flex items-center justify-center text-lg shrink-0">
            🏢
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${job.id}`} className="block">
              <h3 className="font-bold text-text-primary text-sm leading-snug hover:text-violet-300 transition-colors">
                {job.title}
              </h3>
            </Link>
            <p className="text-xs text-text-secondary mt-0.5">
              {job.companyName} · {job.location ?? 'Remote'}
              <span className="ml-2 text-text-muted font-mono">{jobCode(job.companyName, job.id)}</span>
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
          {job.salaryRange && <Badge variant="muted">{job.salaryRange}</Badge>}
        </div>

        {/* Contact row */}
        <div className="flex items-center gap-2 bg-violet-500/8 border border-violet-500/15 rounded-lg px-3 py-2">
          <Avatar src={referrer.avatarUrl} name={referrer.fullName} size="xs" />
          <span className="text-xs text-text-secondary">
            <span className="text-violet-300 font-semibold">{referrer.fullName}</span> works here
          </span>
          <span className="ml-auto text-xs text-text-muted">{timeAgo(job.createdAt)}</span>
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          {isOwnPosting ? (
            <Link href="/jobs/mine" className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">Manage this job</Button>
            </Link>
          ) : alreadyApplied ? (
            <Button variant="secondary" size="sm" className="flex-1 gap-1.5" disabled>
              {appStatus === 'forwarded' ? '🎉 Forwarded to HR' :
               appStatus === 'viewed'    ? '👀 Reviewed' :
               appStatus === 'rejected'  ? '✕ Not a fit' :
               '✓ CV sent'}
            </Button>
          ) : job.isActive ? (
            <Button variant="primary" size="sm" className="flex-1" onClick={() => setSendCVOpen(true)}>
              Send CV to {referrer.fullName.split(' ')[0]}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="flex-1" disabled>Job closed</Button>
          )}
          <Link href={`/jobs/${job.id}`}>
            <Button variant="secondary" size="sm">Details</Button>
          </Link>
        </div>
      </Card>

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
