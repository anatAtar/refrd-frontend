import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';

export function ReferrerContactCard({ referrer, job }: { referrer: JobWithReferrer['referrer']; job: JobWithReferrer['job'] }) {
  return (
    <div className="border border-violet-500/30 bg-violet-500/5 rounded-xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-violet-400 mb-3">Your Contact</p>
      <div className="flex items-center gap-3">
        <Avatar src={referrer.avatarUrl} name={referrer.fullName} size="lg" ring />
        <div>
          <p className="font-bold text-text-primary">{referrer.fullName}</p>
          <p className="text-sm text-text-secondary">
            {referrer.headline ?? (referrer.companyName ? `Works at ${referrer.companyName}` : '')}
          </p>
          <p className="text-xs text-text-muted mt-1">Posted {timeAgo(job.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
