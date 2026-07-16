'use client';

import { useMyJobs } from '@/lib/hooks/useJobs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { jobsApi } from '@/lib/api/jobs';
import { timeAgo, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyJobsPage() {
  const { jobs, isLoading, mutate } = useMyJobs();
  const router = useRouter();

  const handleDeactivate = async (id: string) => {
    try {
      await jobsApi.delete(id);
      toast.success('Job deactivated');
      mutate();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">My Jobs</h1>
          <p className="text-sm text-text-secondary">Jobs you&apos;ve posted to your network</p>
        </div>
        <Link href="/jobs/post">
          <Button variant="primary" size="sm">＋ Post Job</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No jobs posted yet"
          description="Post a job from your company and let friends apply through you."
          action={{ label: '＋ Post a Job', onClick: () => router.push('/jobs/post') }}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/jobs/${job.id}`} className="font-bold text-text-primary text-sm hover:text-violet-300">
                    {job.title}
                  </Link>
                  <p className="text-xs text-text-secondary mt-0.5">{job.companyName} · {job.location ?? 'Remote'}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {job.isActive ? <Badge variant="good">Active</Badge> : <Badge variant="muted">Inactive</Badge>}
                    {job.bonusAmount && (
                      <Badge variant="amber">💰 {formatCurrency(job.bonusAmount, job.bonusCurrency ?? 'USD')} bonus</Badge>
                    )}
                    <span className="text-xs text-text-muted">{timeAgo(job.createdAt)}</span>
                  </div>
                </div>
                {job.isActive && (
                  <Button variant="ghost" size="sm" onClick={() => handleDeactivate(job.id)}>
                    Deactivate
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
