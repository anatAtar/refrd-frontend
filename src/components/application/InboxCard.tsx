'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ForwardToHRDialog } from './ForwardToHRDialog';
import { applicationsApi } from '@/lib/api/applications';
import { STATUS_LABELS, STATUS_COLORS, formatBytes, timeAgo, jobCode } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';
import type { ApplicationWithDetails } from '@/lib/types';

interface InboxCardProps {
  data: ApplicationWithDetails;
  onUpdate: () => void;
}

export function InboxCard({ data, onUpdate }: InboxCardProps) {
  const { application, job, seeker } = data;
  const [forwardOpen, setForwardOpen] = useState(false);
  const [declining, setDeclining]     = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);

  const cvUrl = applicationsApi.cvUrl(application.id);
  const statusLabel = STATUS_LABELS[application.status] ?? application.status;
  const statusColor = STATUS_COLORS[application.status] ?? '';
  const isDone = application.status === 'forwarded' || application.status === 'rejected';

  const handleDecline = async () => {
    setDeclining(true);
    try {
      await applicationsApi.updateStatus(application.id, 'rejected');
      toast.success('Application declined');
      onUpdate();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to decline');
    } finally {
      setDeclining(false);
      setConfirmDecline(false);
    }
  };

  return (
    <>
      <Card className={`p-4 ${application.status === 'rejected' ? 'opacity-50' : ''}`}>
        <div className="flex items-start gap-3">
          <Avatar src={seeker?.avatarUrl} name={seeker?.fullName ?? '?'} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-text-primary text-sm">{seeker?.fullName}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Applied: {job.title}
                  <span className="ml-2 text-text-muted font-mono text-[11px]">{jobCode(job.companyName, job.id)}</span>
                </p>
              </div>
              <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {application.coverNote && (
              <div className="mt-2 text-xs text-text-secondary bg-input rounded-lg px-3 py-2 line-clamp-2 italic">
                &ldquo;{application.coverNote}&rdquo;
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-text-muted">
                📄 {application.cvOriginalName} · {formatBytes(application.cvSizeBytes)}
              </span>
              <span className="text-xs text-text-muted ml-auto">{timeAgo(application.createdAt)}</span>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              {/* Download always available */}
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">📄 Download CV</Button>
              </a>

              {/* Forward button — only when not done */}
              {!isDone && (
                <Button variant="primary" size="sm" onClick={() => setForwardOpen(true)}>
                  ✓ Forward to HR
                </Button>
              )}

              {/* Forwarded state */}
              {application.status === 'forwarded' && (
                <Badge variant="good">
                  ✓ Forwarded {application.forwardedAt ? timeAgo(application.forwardedAt) : ''}
                </Badge>
              )}

              {/* Decline / confirm */}
              {!isDone && !confirmDecline && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-crit ml-auto"
                  onClick={() => setConfirmDecline(true)}
                >
                  Not a fit
                </Button>
              )}

              {!isDone && confirmDecline && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-text-secondary">Mark as not a fit?</span>
                  <Button variant="danger" size="sm" isLoading={declining} onClick={handleDecline}>
                    Confirm
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDecline(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ForwardToHRDialog
        open={forwardOpen}
        onClose={() => setForwardOpen(false)}
        applicationId={application.id}
        seekerName={seeker?.fullName ?? 'Applicant'}
        jobTitle={job.title}
        onSuccess={onUpdate}
      />
    </>
  );
}
