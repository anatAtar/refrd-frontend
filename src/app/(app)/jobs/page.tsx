'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { jobsApi } from '@/lib/api/jobs';
import { JobCard } from '@/components/job/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';
import Link from 'next/link';

function useAllJobs() {
  return useSWR('jobs/browse/all', () =>
    jobsApi.search({}).then((r) => r.data),
  );
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch]                       = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes]         = useState<Set<string>>(new Set());
  const [selectedContact, setSelectedContact]     = useState<string | null>(
    searchParams.get('contact') ?? null,
  );
  const [showAllCompanies, setShowAllCompanies]   = useState(false);
  const debounced = useDebounce(search, 300);

  // If the URL param changes (e.g. browser back/forward), sync state
  useEffect(() => {
    const c = searchParams.get('contact');
    setSelectedContact(c ?? null);
  }, [searchParams]);

  const { data: allJobs = [], isLoading } = useAllJobs();

  // ── Derived facets ──────────────────────────────────────────────────────
  const facets = useMemo(() => {
    const companies = new Map<string, number>();
    const types     = new Map<string, number>();
    const contacts  = new Map<string, { fullName: string; avatarUrl: string | null; count: number }>();

    allJobs.forEach((item) => {
      companies.set(item.job.companyName, (companies.get(item.job.companyName) ?? 0) + 1);
      if (item.job.jobType) {
        types.set(item.job.jobType, (types.get(item.job.jobType) ?? 0) + 1);
      }
      const { id, fullName, avatarUrl } = item.referrer;
      if (!contacts.has(id)) {
        contacts.set(id, { fullName, avatarUrl, count: 0 });
      }
      contacts.get(id)!.count += 1;
    });

    return {
      companies: [...companies.entries()].sort((a, b) => b[1] - a[1]),
      types:     [...types.entries()].sort((a, b) => b[1] - a[1]),
      contacts:  [...contacts.entries()].sort((a, b) => b[1].count - a[1].count),
    };
  }, [allJobs]);

  // ── Filtered jobs ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allJobs.filter((item) => {
      if (selectedCompanies.size > 0 && !selectedCompanies.has(item.job.companyName)) return false;
      if (selectedTypes.size > 0 && item.job.jobType && !selectedTypes.has(item.job.jobType)) return false;
      if (selectedContact && item.referrer.id !== selectedContact) return false;
      if (debounced) {
        const q = debounced.toLowerCase();
        return (
          item.job.title.toLowerCase().includes(q) ||
          item.job.companyName.toLowerCase().includes(q) ||
          item.referrer.fullName.toLowerCase().includes(q) ||
          (item.job.location ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allJobs, selectedCompanies, selectedTypes, selectedContact, debounced]);

  const hasFilters = selectedCompanies.size > 0 || selectedTypes.size > 0 || !!selectedContact || !!debounced;

  const toggleCompany = (name: string) =>
    setSelectedCompanies((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const toggleType = (type: string) =>
    setSelectedTypes((prev) => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n; });

  const clearAll = () => {
    setSelectedCompanies(new Set()); setSelectedTypes(new Set());
    setSelectedContact(null); setSearch('');
  };

  const visibleCompanies = showAllCompanies ? facets.companies : facets.companies.slice(0, 7);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── LEFT FILTER PANEL ─────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border overflow-y-auto">
        <div className="p-4 space-y-6">

          {/* Search */}
          <div className="flex items-center gap-2 bg-input border border-border-strong rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500/40 transition-all">
            <span className="text-text-muted text-sm">🔍</span>
            <input
              className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none min-w-0"
              placeholder="Search roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary text-sm">×</button>
            )}
          </div>

          {/* Active filters summary + clear */}
          {hasFilters && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">{filtered.length} results</span>
              <button onClick={clearAll} className="text-xs text-violet-300 hover:text-violet-400 font-medium">
                Clear all
              </button>
            </div>
          )}

          {/* Companies */}
          {facets.companies.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
                Companies
                <span className="ml-1 text-text-muted font-normal normal-case tracking-normal">({facets.companies.length})</span>
              </p>
              <div className="space-y-0.5">
                {visibleCompanies.map(([name, count]) => (
                  <FilterRow
                    key={name}
                    label={name}
                    count={count}
                    active={selectedCompanies.has(name)}
                    onToggle={() => toggleCompany(name)}
                  />
                ))}
                {facets.companies.length > 7 && (
                  <button
                    onClick={() => setShowAllCompanies((v) => !v)}
                    className="text-xs text-violet-300 hover:text-violet-400 px-1 py-0.5 mt-1"
                  >
                    {showAllCompanies ? '↑ Show less' : `+ ${facets.companies.length - 7} more`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Job type */}
          {facets.types.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Job Type</p>
              <div className="space-y-0.5">
                {facets.types.map(([type, count]) => (
                  <FilterRow
                    key={type}
                    label={type}
                    count={count}
                    active={selectedTypes.has(type)}
                    onToggle={() => toggleType(type)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {facets.contacts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
                Your Contacts
                <span className="ml-1 text-text-muted font-normal normal-case tracking-normal">({facets.contacts.length})</span>
              </p>
              <div className="space-y-0.5">
                {facets.contacts.map(([id, info]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedContact(selectedContact === id ? null : id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors text-left',
                      selectedContact === id
                        ? 'bg-violet-500/15 text-violet-300'
                        : 'text-text-secondary hover:text-text-primary hover:bg-card-hover',
                    )}
                  >
                    <Avatar src={info.avatarUrl} name={info.fullName} size="xs" />
                    <span className="flex-1 truncate">{info.fullName.split(' ')[0]}</span>
                    <span className="text-text-muted text-[10px]">{info.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </aside>

      {/* ── RIGHT: JOB LIST ───────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-page/90 backdrop-blur border-b border-border px-5 py-3 flex items-center gap-3">
          <h1 className="text-sm font-bold text-text-primary shrink-0">
            {hasFilters ? `${filtered.length} jobs` : `${allJobs.length} open roles`}
          </h1>

          {/* Active filter chips */}
          <div className="flex gap-2 flex-wrap flex-1">
            {[...selectedCompanies].map((c) => (
              <ActiveChip key={c} label={c} onRemove={() => toggleCompany(c)} />
            ))}
            {[...selectedTypes].map((t) => (
              <ActiveChip key={t} label={t} onRemove={() => toggleType(t)} />
            ))}
            {selectedContact && (
              <ActiveChip
                label={facets.contacts.find(([id]) => id === selectedContact)?.[1].fullName.split(' ')[0] ?? ''}
                onRemove={() => setSelectedContact(null)}
              />
            )}
          </div>

          <Link href="/jobs/post"
            className="shrink-0 text-xs px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg transition-colors">
            + Post a Job
          </Link>
        </div>

        {/* Job results */}
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-sm font-semibold text-text-primary mb-1">No jobs match</p>
              <p className="text-xs text-text-secondary mb-4">Try removing some filters</p>
              <button onClick={clearAll} className="text-xs text-violet-300 hover:text-violet-400 font-medium">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((j) => <JobCard key={j.job.id} data={j} />)}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

// ── Filter row checkbox ──────────────────────────────────────────────────────
function FilterRow({ label, count, active, onToggle }: {
  label: string; count: number; active: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors text-left',
        active
          ? 'bg-violet-500/15 text-violet-300'
          : 'text-text-secondary hover:text-text-primary hover:bg-card-hover',
      )}
    >
      <span className={cn(
        'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors',
        active ? 'bg-violet-500 border-violet-500' : 'border-border-strong',
      )}>
        {active && <span className="text-white text-[8px] font-bold">✓</span>}
      </span>
      <span className="flex-1 truncate capitalize">{label}</span>
      <span className="text-text-muted text-[10px]">{count}</span>
    </button>
  );
}

// ── Active filter chip ───────────────────────────────────────────────────────
function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/25 px-2 py-0.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-white ml-0.5 leading-none">×</button>
    </span>
  );
}
