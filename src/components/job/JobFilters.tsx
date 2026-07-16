'use client';

import { Chip } from '@/components/ui/Chip';

interface Filters {
  jobType?: string;
  remote?: boolean;
}

interface JobFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  const toggle = (key: keyof Filters, value: string | boolean) => {
    onChange({ ...filters, [key]: filters[key as keyof Filters] === value ? undefined : value });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        label="Remote"
        icon="💻"
        active={!!filters.remote}
        onToggle={() => toggle('remote', true)}
      />
      <Chip
        label="Full-time"
        icon="🏢"
        active={filters.jobType === 'full-time'}
        onToggle={() => toggle('jobType', 'full-time')}
      />
      <Chip
        label="Contract"
        icon="📝"
        active={filters.jobType === 'contract'}
        onToggle={() => toggle('jobType', 'contract')}
      />
      <Chip
        label="Part-time"
        icon="⏰"
        active={filters.jobType === 'part-time'}
        onToggle={() => toggle('jobType', 'part-time')}
      />
    </div>
  );
}
