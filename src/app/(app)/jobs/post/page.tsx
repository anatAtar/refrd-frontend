'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { jobsApi } from '@/lib/api/jobs';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ApiError } from '@/lib/api/client';

export default function PostJobPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    sourceUrl: '',
    title: '',
    companyName: '',
    location: '',
    description: '',
    jobType: '',
    salaryRange: '',
  });

  const set = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleScrape = async () => {
    if (!url.startsWith('http')) { toast.error('Enter a valid URL starting with http'); return; }
    setIsScraping(true);
    try {
      const res = await jobsApi.scrape(url);
      const data = res.data;
      setForm((prev) => ({
        ...prev,
        sourceUrl: url,
        title:       data.title       ?? prev.title,
        companyName: data.companyName ?? prev.companyName,
        location:    data.location    ?? prev.location,
        description: data.description ?? prev.description,
        jobType:     data.jobType     ?? prev.jobType,
      }));
      setScraped(true);
      toast.success('Details filled in! Review and publish.');
    } catch {
      toast.error('Could not read that URL automatically. Fill in the details below.');
      setForm((prev) => ({ ...prev, sourceUrl: url }));
      setScraped(true);
    } finally {
      setIsScraping(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim())       { toast.error('Job title is required'); return; }
    if (!form.companyName.trim()) { toast.error('Company name is required'); return; }
    setIsSubmitting(true);
    try {
      await jobsApi.create({
        sourceUrl:   form.sourceUrl || url,
        title:       form.title,
        companyName: form.companyName,
        location:    form.location   || undefined,
        description: form.description || undefined,
        jobType:     form.jobType    || undefined,
        salaryRange: form.salaryRange || undefined,
      });
      toast.success('Job posted to your network!');
      router.push('/jobs/mine');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Post a Job</h1>
        <p className="text-sm text-text-secondary">Share an opening at your company with your network</p>
      </div>

      {/* Step 1: URL */}
      {!scraped ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary block">
              Paste the job listing URL
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://careers.company.com/jobs/..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              />
              <Button
                variant="primary"
                onClick={handleScrape}
                disabled={isScraping || !url}
              >
                {isScraping ? <LoadingSpinner size="sm" /> : 'Auto-fill'}
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              We&apos;ll pull the title, company, and description automatically
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setScraped(true)}
              className="text-sm text-text-muted hover:text-gold-300 transition-colors underline underline-offset-2"
            >
              Enter manually instead
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Review & publish */
        <form onSubmit={handlePublish} className="space-y-4">
          {form.title && (
            <div className="flex items-center gap-2 bg-good/10 border border-good/20 rounded-lg px-3 py-2">
              <span>✅</span>
              <span className="text-xs text-good font-medium">
                Details filled in — review and edit if needed
              </span>
            </div>
          )}

          <Input
            label="Job title *"
            value={form.title}
            onChange={set('title')}
            placeholder="Senior Software Engineer"
            required
          />
          <Input
            label="Company name *"
            value={form.companyName}
            onChange={set('companyName')}
            placeholder="Microsoft"
            required
            autoComplete="off"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={set('location')}
            placeholder="Tel Aviv / Remote"
          />

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Job type
            </label>
            <select
              value={form.jobType}
              onChange={set('jobType')}
              className="w-full bg-input border border-border-strong rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-300/40"
            >
              <option value="">— Select type —</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <Input
            label="Salary range (optional)"
            value={form.salaryRange}
            onChange={set('salaryRange')}
            placeholder="₪30,000 – ₪45,000/month"
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={set('description')}
            placeholder="What does this role involve?"
            rows={5}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setScraped(false); }}
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="flex-2 flex-1"
            >
              Post Job
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
