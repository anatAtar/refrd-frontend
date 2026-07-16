import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { STATUS_LABELS, STATUS_COLORS, timeAgo } from '@/lib/utils';
import type { ApplicationWithDetails } from '@/lib/types';

export function ApplicationCard({ data }: { data: ApplicationWithDetails }) {
  const { application, job, referrer } = data;
  const statusLabel = STATUS_LABELS[application.status] ?? application.status;
  const statusColor = STATUS_COLORS[application.status] ?? '';

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar src={referrer?.avatarUrl} name={referrer?.fullName ?? '?'} size="md" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-text-primary text-sm">{job.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {job.companyName} · via {referrer?.fullName}
              </p>
            </div>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-muted">📄 {application.cvOriginalName}</span>
            <span className="text-xs text-text-muted">{timeAgo(application.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
