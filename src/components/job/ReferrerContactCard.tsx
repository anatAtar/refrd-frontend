import { Avatar } from '@/components/ui/Avatar';
import { timeAgo, cn } from '@/lib/utils';
import type { JobWithReferrer, JobReferrer } from '@/lib/types';

const BAND_COLOR: Record<string, string> = {
  green: 'text-good',
  orange: 'text-warn',
  red: 'text-crit',
};

function ResponseLine({ referrer }: { referrer: JobReferrer }) {
  if (!referrer.responseStats) return null;
  const { score, band } = referrer.responseStats;
  const window = band === 'green' ? 24 : band === 'orange' ? 48 : 72;
  return (
    <p className={cn('text-xs font-semibold mt-0.5', BAND_COLOR[band])}>
      Responds {score}% of the time within {window} hours
    </p>
  );
}

export function ReferrerContactCard({ referrers, job }: { referrers: JobReferrer[]; job: JobWithReferrer['job'] }) {
  if (referrers.length === 0) return null;

  return (
    <div className="border border-gold-300/30 bg-gold-300/5 rounded-xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gold-400 mb-3">
        {referrers.length > 1 ? 'Your Contacts' : 'Your Contact'}
      </p>
      <div className="space-y-3">
        {referrers.map((referrer) => (
          <div key={referrer.id} className="flex items-center gap-3">
            <Avatar src={referrer.avatarUrl} name={referrer.fullName} size="lg" ring />
            <div>
              <p className="font-bold text-text-primary">{referrer.fullName}</p>
              <p className="text-sm text-text-secondary">
                {referrer.headline ?? (referrer.companyName ? `Works at ${referrer.companyName}` : '')}
              </p>
              <ResponseLine referrer={referrer} />
              <p className="text-xs text-text-muted mt-1">Posted {timeAgo(job.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
