'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { applicationsApi } from '@/lib/api/applications';
import { optimisticAddApplication } from '@/lib/hooks/useApplications';
import { formatBytes } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';
import type { Job } from '@/lib/types';

interface SendCVModalProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  referrer: { id: string; fullName: string; avatarUrl: string | null; companyName: string | null };
}

export function SendCVModal({ open, onClose, job, referrer }: SendCVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => { setFile(null); setCoverNote(''); setFileError(''); setSuccess(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleFileSelect = (f: File) => {
    const maxBytes = 10 * 1024 * 1024;
    if (f.size > maxBytes) { setFileError(`File is too large (max ${formatBytes(maxBytes)})`); return; }
    setFileError('');
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setFileError('Please select your CV'); return; }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('jobId', job.id);
      form.append('cv', file);
      if (coverNote.trim()) form.append('coverNote', coverNote.trim());
      await applicationsApi.submit(form);
      optimisticAddApplication(job.id);

      setSuccess(true);
      toast.success(`CV sent to ${referrer.fullName}!`);
      setTimeout(handleClose, 2000);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send CV');
    } finally {
      setIsSubmitting(false);
    }
  };

  const referrerFirst = referrer.fullName.split(' ')[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        title={success ? '✅ CV Sent!' : `Send CV to ${referrerFirst}`}
        description={success ? undefined : `${job.title} · ${job.companyName}`}
        onClose={handleClose}
      >
        <div className="px-6 py-5 space-y-4">
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-text-secondary text-sm">
                {referrerFirst} received your CV. Good luck!
              </p>
            </div>
          ) : (
            <>
              {/* Who you're sending to */}
              <div className="flex items-center gap-3 bg-input rounded-xl p-3">
                <Avatar src={referrer.avatarUrl} name={referrer.fullName} size="md" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{referrer.fullName}</p>
                  <p className="text-xs text-text-secondary">{referrer.companyName ?? job.companyName}</p>
                </div>
              </div>

              {/* CV upload */}
              <FileDropzone onFile={handleFileSelect} file={file} error={fileError} />

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

              {/* File summary */}
              {file && (
                <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-border">
                  <span className="text-sm">📄</span>
                  <span className="text-xs text-text-secondary flex-1 truncate">{file.name}</span>
                  <Badge variant="violet">{formatBytes(file.size)}</Badge>
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <div className="px-6 pb-5 flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" isLoading={isSubmitting} onClick={handleSubmit}>
              Send to {referrerFirst}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
