import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  steps: string[];
  current: number; // 0-indexed
}

export function ProgressStepper({ steps, current }: ProgressStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                i < current && 'bg-violet-500 text-white',
                i === current && 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500',
                i > current && 'bg-border text-text-muted',
              )}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-medium hidden sm:block',
                i === current ? 'text-text-primary font-semibold' : 'text-text-muted',
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('flex-1 h-px mx-2', i < current ? 'bg-violet-500/50' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  );
}
