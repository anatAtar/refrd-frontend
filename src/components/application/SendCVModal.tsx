'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { applicationsApi } from '@/lib/api/applications';
import { optimisticAddApplication } from '@/lib/hooks/useApplications';
import { formatBytes, cn } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';
import type { Job, JobReferrer } from '@/lib/types';

interface SendCVModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (referrer: JobReferrer) => void;
  job: Job;
  referrers: JobReferrer[];
}

const BAND_COLOR: Record<string, string> = {
  green: 'text-good',
  orange: 'text-warn',
  red: 'text-crit',
};

export function SendCVModal({ open, onClose, onSuccess, job, referrers }: SendCVModalProps) {
  const [selectedId, setSelectedId] = useState(referrers[0]?.id);
  const [file, setFile] = useState<File | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to the top referrer each time the modal opens
  useEffect(() => {
    if (open) setSelectedId(referrers[0]?.id);
  }, [open, referrers]);

  const reset = () => { setFile(null); setCoverNote(''); setFileError(''); };
  const handleClose = () => { reset(); onClose(); };

  const selected = referrers.find((r) => r.id === selectedId) ?? referrers[0];

  const handleFileSelect = (f: File) => {
    const maxBytes = 10 * 1024 * 1024;
    if (f.size > maxBytes) { setFileError(`File is too large (max ${formatBytes(maxBytes)})`); return; }
    setFileError('');
    setFile(f);
  };

  const handleFileView = (f: File) => {
    const url = URL.createObjectURL(f);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    if (!file) { setFileError('Please select your CV'); return; }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('jobId', selected.jobId);
      form.append('cv', file);
      if (coverNote.trim()) form.append('coverNote', coverNote.trim());
      await applicationsApi.submit(form);
      optimisticAddApplication(selected.jobId);

      reset();
      onClose();
      onSuccess(selected);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send CV');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selected) return null;
  const referrerFirst = selected.fullName.split(' ')[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        title="Request a referral"
        description={`for ${job.title} at ${job.companyName}`}
        onClose={handleClose}
      >
        <div className="px-6 py-5 space-y-4">
          {referrers.length > 1 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">Choose a referrer</p>
              <div className="space-y-2">
                {referrers.map((r) => {
                  const isSelected = r.id === selectedId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        'w-full flex items-center gap-3 text-left border rounded-xl px-3 py-2.5 transition-colors',
                        isSelected ? 'border-gold-300 bg-gold-300/8' : 'border-border-strong hover:border-gold-300/40',
                      )}
                    >
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                          isSelected ? 'border-gold-300' : 'border-border-strong',
                        )}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-gold-300" />}
                      </span>
                      <Avatar src={r.avatarUrl} name={r.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{r.fullName}</p>
                        <p className="text-xs text-text-muted truncate">{r.headline ?? r.companyName}</p>
                        {r.responseStats && (
                          <p className={cn('text-[11px] font-semibold mt-0.5', BAND_COLOR[r.responseStats.band])}>
                            Responds {r.responseStats.score}% of the time within{' '}
                            {r.responseStats.band === 'green' ? 24 : r.responseStats.band === 'orange' ? 48 : 72} hours
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-input rounded-xl p-3">
              <Avatar src={selected.avatarUrl} name={selected.fullName} size="md" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{selected.fullName}</p>
                <p className="text-xs text-text-secondary">{selected.companyName ?? job.companyName}</p>
              </div>
            </div>
          )}

          {/* CV upload */}
          <FileDropzone onFile={handleFileSelect} onView={handleFileView} file={file} error={fileError} />

          {/* Cover note */}
          <Textarea
            label={`Message to ${referrerFirst} (optional)`}
            placeholder={`Hi ${referrerFirst}, I saw this role and thought it would be a great fit…`}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            maxLength={500}
            charCount
            rows={3}
          />
        </div>

        <div className="px-6 pb-5 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" isLoading={isSubmitting} onClick={handleSubmit}>
            Send to {referrerFirst}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
