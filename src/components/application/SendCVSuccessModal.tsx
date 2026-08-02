'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface SendCVSuccessModalProps {
  open: boolean;
  onClose: () => void;
  referrerFirstName: string;
  jobTitle: string;
}

const CONFETTI = [
  { color: 'var(--color-gold-300)', x: -46, y: -58, delay: 0 },
  { color: 'var(--color-teal)',     x: 40,  y: -62, delay: 40 },
  { color: 'var(--color-good)',     x: -58, y: -10, delay: 80 },
  { color: 'var(--color-blue)',     x: 56,  y: -14, delay: 60 },
  { color: 'var(--color-gold-400)', x: -20, y: -74, delay: 120 },
  { color: 'var(--color-amber)',    x: 22,  y: -76, delay: 100 },
];

export function SendCVSuccessModal({ open, onClose, referrerFirstName, jobTitle }: SendCVSuccessModalProps) {
  const router = useRouter();

  const backToJobs = () => {
    onClose();
    router.push('/jobs');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent title="Application Sent!" onClose={onClose} className="max-w-sm">
        <div className="px-6 pt-7 pb-1 text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="cv-success-confetti"
                style={{
                  background: c.color,
                  // @ts-expect-error -- custom properties for the keyframe animation
                  '--x': `${c.x}px`,
                  '--y': `${c.y}px`,
                  animationDelay: `${c.delay}ms`,
                }}
              />
            ))}
            <div className="cv-success-badge absolute inset-0 rounded-full bg-good/15 border border-good/25 flex items-center justify-center text-3xl">
              ✅
            </div>
          </div>

          <p className="text-text-secondary text-[15px] leading-snug max-w-[30ch] mx-auto">
            We&apos;ve sent your CV over to <span className="font-semibold text-text-primary">{referrerFirstName}</span>. Best of
            luck with the <span className="font-semibold text-text-primary">{jobTitle}</span> role!
          </p>
        </div>

        <div className="px-6 pb-6 pt-5 flex justify-center">
          <Button variant="primary" onClick={backToJobs}>Back to Jobs</Button>
        </div>

        <style>{`
          .cv-success-badge {
            animation: cv-success-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          .cv-success-confetti {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            opacity: 0;
            animation: cv-success-burst 700ms ease-out both;
          }
          @keyframes cv-success-pop {
            0%   { transform: scale(0.4); opacity: 0; }
            100% { transform: scale(1);   opacity: 1; }
          }
          @keyframes cv-success-burst {
            0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1);       opacity: 1; }
            100% { transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0.4); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .cv-success-badge, .cv-success-confetti { animation: none; opacity: 1; }
            .cv-success-confetti { display: none; }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
