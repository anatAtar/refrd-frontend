'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { applicationsApi } from '@/lib/api/applications';
import { ApiError } from '@/lib/api/client';

interface ForwardToHRDialogProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  seekerName: string;
  jobTitle: string;
  onSuccess: () => void;
}

export function ForwardToHRDialog({ open, onClose, applicationId, seekerName, jobTitle, onSuccess }: ForwardToHRDialogProps) {
  const [hrEmail, setHrEmail] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForward = async () => {
    if (!hrEmail.includes('@')) { toast.error('Enter a valid HR email'); return; }
    setIsLoading(true);
    try {
      await applicationsApi.forward(applicationId, { hrEmail, referrerNote: note || undefined });
      toast.success(`CV forwarded to ${hrEmail}!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Forward failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        title="Forward to HR"
        description={`Send ${seekerName}'s CV for ${jobTitle}`}
        onClose={onClose}
      >
        <div className="px-6 py-4 space-y-4">
          <Input
            label="HR email address"
            type="email"
            value={hrEmail}
            onChange={(e) => setHrEmail(e.target.value)}
            placeholder="hr@company.com"
          />
          <Textarea
            label="Note to HR (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Highly recommend! We worked together at a previous startup."
            maxLength={500}
            charCount
            rows={3}
          />
          <div className="flex items-start gap-2 bg-violet-500/8 border border-violet-500/15 rounded-lg px-3 py-2">
            <span>💡</span>
            <p className="text-xs text-text-secondary">
              An email with {seekerName}&apos;s CV will be sent to the HR team, including your referral note.
            </p>
          </div>
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleForward}>
            Send to HR ✦
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
