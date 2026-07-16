import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  icon?: string;
}

export function Chip({ label, active, onToggle, icon }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap',
        active
          ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
          : 'bg-input border-border-strong text-text-secondary hover:border-violet-500/30 hover:text-text-primary',
      )}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
