'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface OutOfCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function OutOfCreditsModal({ open, onClose }: OutOfCreditsModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent title="You're out of credits" onClose={onClose}>
        <div className="px-6 py-5">
          <p className="text-sm text-text-secondary">
            You need a credit to send a C.V. or post a job.
          </p>
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose}>Not now</Button>
          <Button variant="primary" onClick={() => { onClose(); router.push('/credits'); }}>
            Buy credits
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
