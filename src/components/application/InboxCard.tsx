'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
  const [declining, setDeclining]           = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);

  const cvUrl        = applicationsApi.cvUrl(application.id);
  const cvPreviewUrl = applicationsApi.cvPreviewUrl(application.id);
  const statusLabel = STATUS_LABELS[application.status] ?? application.status;
  const statusColor = STATUS_COLORS[application.status] ?? '';
  const isDone      = application.status === 'rejected';

  const handleView = () => {
    // Opens inline in browser tab — PDF displays, Word downloads
    window.open(cvPreviewUrl, '_blank');
    setTimeout(onUpdate, 1500);
  };

  const handleDecline = async () => {
    setDeclining(true);
    try {
      await applicationsApi.updateStatus(application.id, 'rejected');
      toast.success('Marked as not a fit');
      onUpdate();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed');
    } finally {
      setDeclining(false);
      setConfirmDecline(false);
    }
  };

  return (
    <Card className={`p-4 ${isDone ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar src={seeker?.avatarUrl} name={seeker?.fullName ?? '?'} size="md" />
        <div className="flex-1 min-w-0">

          {/* Header */}
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

          {/* Cover note */}
          {application.coverNote && (
            <div className="mt-2 text-xs text-text-secondary bg-input rounded-lg px-3 py-2 line-clamp-2 italic">
              &ldquo;{application.coverNote}&rdquo;
            </div>
          )}

          {/* CV file info */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-text-muted">
              📄 {application.cvOriginalName} · {formatBytes(application.cvSizeBytes)}
            </span>
            <span className="text-xs text-text-muted ml-auto">{timeAgo(application.createdAt)}</span>
          </div>

          {/* Actions — always show all options (can view multiple times) */}
          {!isDone && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                {/* View — always available */}
                <Button variant="secondary" size="sm" onClick={handleView} className="shrink-0">
                  👁️ View
                </Button>

                {/* Download — always available */}
                <a href={cvUrl} download={application.cvOriginalName} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    📥 Download CV
                  </Button>
                </a>

                {/* Not a fit */}
                {!confirmDecline && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-crit shrink-0"
                    onClick={() => setConfirmDecline(true)}
                  >
                    Not a fit
                  </Button>
                )}
              </div>

              {/* Confirm decline */}
              {confirmDecline && (
                <div className="flex items-center gap-2 bg-crit/10 border border-crit/20 rounded-lg px-3 py-2">
                  <span className="text-xs text-text-secondary flex-1">Mark as not a fit?</span>
                  <Button variant="danger" size="sm" isLoading={declining} onClick={handleDecline}>
                    Confirm
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDecline(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Done state */}
          {isDone && (
            <div className="mt-3">
              <Badge variant="muted">✕ Not a fit</Badge>
            </div>
          )}

        </div>
      </div>
    </Card>
  );
}
