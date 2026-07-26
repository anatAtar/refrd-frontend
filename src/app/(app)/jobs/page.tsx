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

function useAllJobs() {
  return useSWR('jobs/browse/v2', () =>
    jobsApi.search({}).then((r) => r.data),
    { revalidateOnMount: true },
  );
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch]                       = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles]         = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes]         = useState<Set<string>>(new Set());
  const [selectedContact, setSelectedContact]     = useState<string | null>(
    searchParams.get('contact') ?? null,
  );
  const [selectedContactName, setSelectedContactName] = useState<string>(
    searchParams.get('name') ?? '',
  );

  // Inline list-search states (filter what's shown in sidebar sections, not the jobs)
  const [companySearch, setCompanySearch]   = useState('');
  const [roleSearch, setRoleSearch]         = useState('');

  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllRoles, setShowAllRoles]         = useState(false);
  const debounced = useDebounce(search, 300);

  useEffect(() => {
    const c = searchParams.get('contact');
    const n = searchParams.get('name');
    setSelectedContact(c ?? null);
    setSelectedContactName(n ?? '');
  }, [searchParams]);

  const { data: allJobs = [], isLoading, error: jobsError } = useAllJobs();

  // ── Derived facets (all from DB data) ──────────────────────────────────
  const facets = useMemo(() => {
    const companies = new Map<string, number>();
    const roles     = new Map<string, number>();
    const types     = new Map<string, number>();
    const contacts  = new Map<string, { fullName: string; avatarUrl: string | null; count: number }>();

    allJobs.forEach((item) => {
      companies.set(item.job.companyName, (companies.get(item.job.companyName) ?? 0) + 1);
      roles.set(item.job.title, (roles.get(item.job.title) ?? 0) + 1);
      if (item.job.jobType) {
        types.set(item.job.jobType, (types.get(item.job.jobType) ?? 0) + 1);
      }
      const { id, fullName, avatarUrl } = item.referrer;
      if (!contacts.has(id)) contacts.set(id, { fullName, avatarUrl, count: 0 });
      contacts.get(id)!.count += 1;
    });

    return {
      companies: [...companies.entries()].sort((a, b) => b[1] - a[1]),
      roles:     [...roles.entries()].sort((a, b) => b[1] - a[1]),
      types:     [...types.entries()].sort((a, b) => b[1] - a[1]),
      contacts:  [...contacts.entries()].sort((a, b) => b[1].count - a[1].count),
    };
  }, [allJobs]);

  // ── Filtered sidebar lists (inline search within each section) ──────────
  const visibleCompanies = useMemo(() => {
    const filtered = companySearch
      ? facets.companies.filter(([name]) => name.toLowerCase().includes(companySearch.toLowerCase()))
      : facets.companies;
    return showAllCompanies ? filtered : filtered.slice(0, 7);
  }, [facets.companies, companySearch, showAllCompanies]);

  const visibleRoles = useMemo(() => {
    const filtered = roleSearch
      ? facets.roles.filter(([title]) => title.toLowerCase().includes(roleSearch.toLowerCase()))
      : facets.roles;
    return showAllRoles ? filtered : filtered.slice(0, 7);
  }, [facets.roles, roleSearch, showAllRoles]);

  // ── Filtered job list ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allJobs.filter((item) => {
      if (selectedCompanies.size > 0 && !selectedCompanies.has(item.job.companyName)) return false;
      if (selectedRoles.size > 0 && !selectedRoles.has(item.job.title)) return false;
      if (selectedTypes.size > 0 && item.job.jobType && !selectedTypes.has(item.job.jobType)) return false;
      if (selectedContact && item.referrer.id !== selectedContact) return false;
      if (debounced) {
        const q = debounced.toLowerCase();
        return (
          item.job.title.toLowerCase().includes(q) ||
          item.job.companyName.toLowerCase().includes(q) ||
          item.referrer.fullName.toLowerCase().includes(q) ||
          (item.job.location ?? '').toLowerCase().includes(q) ||
          (item.job.jobType ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allJobs, selectedCompanies, selectedRoles, selectedTypes, selectedContact, debounced]);

  const hasFilters = selectedCompanies.size > 0 || selectedRoles.size > 0 || selectedTypes.size > 0 || !!selectedContact || !!debounced;

  const toggleCompany  = (name: string) =>
    setSelectedCompanies((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const toggleRole     = (title: string) =>
    setSelectedRoles((prev) => { const n = new Set(prev); n.has(title) ? n.delete(title) : n.add(title); return n; });
  const toggleType     = (type: string) =>
    setSelectedTypes((prev) => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n; });

  const clearAll = () => {
    setSelectedCompanies(new Set()); setSelectedRoles(new Set()); setSelectedTypes(new Set());
    setSelectedContact(null); setSelectedContactName(''); setSearch('');
    setCompanySearch(''); setRoleSearch('');
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Filter panel (shared between desktop sidebar + mobile drawer) ───────
  const FilterPanel = () => (
    <div className="p-4 space-y-6">

      {/* ── Main search ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-input border border-border-strong rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-gold-300/40 transition-all">
        <span className="text-text-muted">🔍</span>
        <input
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
          placeholder="Search by role, company, location…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowMobileFilters(false); }}
          autoFocus
        />
        {search && (
          <button onClick={() => setSearch('')} className="flex items-center justify-center w-6 h-6 rounded-full bg-border hover:bg-border-strong text-text-muted hover:text-text-primary transition-colors text-sm font-bold shrink-0">×</button>
        )}
      </div>

      {/* ── Active filter count + clear ──────────────────────────────── */}
      {hasFilters && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <button onClick={() => { clearAll(); setShowMobileFilters(false); }} className="text-xs text-gold-300 hover:text-gold-400 font-medium">Clear all</button>
        </div>
      )}

      {/* ── Roles (from DB) ─────────────────────────────────────────── */}
      {facets.roles.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
            Roles <span className="font-normal normal-case tracking-normal">({facets.roles.length})</span>
          </p>
          {facets.roles.length > 5 && (
            <div className="mb-2 flex items-center gap-1.5 bg-input border border-border rounded-lg px-2 py-1.5 focus-within:ring-1 focus-within:ring-gold-300/40">
              <span className="text-text-muted text-[11px]">🔍</span>
              <input
                className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none min-w-0"
                placeholder="Filter roles…"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
              {roleSearch && <button onClick={() => setRoleSearch('')} className="text-text-muted hover:text-text-primary text-xs font-bold">×</button>}
            </div>
          )}
          <div className="space-y-0.5">
            {visibleRoles.map(([title, count]) => (
              <FilterRow key={title} label={title} count={count} active={selectedRoles.has(title)} onToggle={() => toggleRole(title)} />
            ))}
          </div>
          {!roleSearch && facets.roles.length > 7 && (
            <button onClick={() => setShowAllRoles((v) => !v)} className="text-xs text-gold-300 hover:text-gold-400 px-1 py-0.5 mt-1">
              {showAllRoles ? '↑ Show less' : `+ ${facets.roles.length - 7} more`}
            </button>
          )}
        </div>
      )}

      {/* ── Companies (from DB) ─────────────────────────────────────── */}
      {facets.companies.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
            Companies <span className="font-normal normal-case tracking-normal">({facets.companies.length})</span>
          </p>
          {facets.companies.length > 5 && (
            <div className="mb-2 flex items-center gap-1.5 bg-input border border-border rounded-lg px-2 py-1.5 focus-within:ring-1 focus-within:ring-gold-300/40">
              <span className="text-text-muted text-[11px]">🔍</span>
              <input
                className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none min-w-0"
                placeholder="Filter companies…"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
              />
              {companySearch && <button onClick={() => setCompanySearch('')} className="text-text-muted hover:text-text-primary text-xs font-bold">×</button>}
            </div>
          )}
          <div className="space-y-0.5">
            {visibleCompanies.map(([name, count]) => (
              <FilterRow key={name} label={name} count={count} active={selectedCompanies.has(name)} onToggle={() => toggleCompany(name)} />
            ))}
          </div>
          {!companySearch && facets.companies.length > 7 && (
            <button onClick={() => setShowAllCompanies((v) => !v)} className="text-xs text-gold-300 hover:text-gold-400 px-1 py-0.5 mt-1">
              {showAllCompanies ? '↑ Show less' : `+ ${facets.companies.length - 7} more`}
            </button>
          )}
        </div>
      )}

      {/* ── Job Type (from DB) ──────────────────────────────────────── */}
      {facets.types.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Job Type</p>
          <div className="space-y-0.5">
            {facets.types.map(([type, count]) => (
              <FilterRow key={type} label={type} count={count} active={selectedTypes.has(type)} onToggle={() => toggleType(type)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Referrers ───────────────────────────────────────────────── */}
      {facets.contacts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
            Referrers <span className="font-normal normal-case tracking-normal">({facets.contacts.length})</span>
          </p>
          <div className="space-y-0.5">
            {facets.contacts.map(([id, info]) => (
              <button
                key={id}
                onClick={() => { setSelectedContact(selectedContact === id ? null : id); setShowMobileFilters(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs transition-colors text-left min-h-[44px]',
                  selectedContact === id ? 'bg-gold-300/15 text-gold-300' : 'text-text-secondary hover:text-text-primary hover:bg-card-hover',
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
  );

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────── */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="relative mt-auto bg-card border-t border-border rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-sm font-bold text-text-primary">Filter Jobs</span>
              <button onClick={() => setShowMobileFilters(false)} className="text-text-muted hover:text-text-primary p-2 -mr-2 text-lg">×</button>
            </div>
            <FilterPanel />
            <div className="px-4 pb-6">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-gold-300 text-[#0A0A0A] font-semibold rounded-xl text-sm"
              >
                Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP FILTER SIDEBAR ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border overflow-y-auto">
        <FilterPanel />
      </aside>

      {/* ── JOB LIST ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-page/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-2">
          {/* Mobile: search + filter button */}
          <div className="flex md:hidden items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 flex items-center gap-2 bg-input border border-border-strong rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-gold-300/40">
              <span className="text-text-muted shrink-0">🔍</span>
              <input
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
                placeholder="Search by role, company, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button onClick={() => setSearch('')} className="flex items-center justify-center w-7 h-7 rounded-full bg-border hover:bg-border-strong text-text-muted hover:text-text-primary transition-colors font-bold shrink-0">×</button>}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors shrink-0',
                hasFilters
                  ? 'bg-gold-300/15 text-gold-300 border-gold-300/30'
                  : 'bg-input text-text-secondary border-border-strong',
              )}
            >
              ⚙️ {hasFilters ? filtered.length : 'Filter'}
            </button>
          </div>

          {/* Desktop: count + active filter chips */}
          <h1 className="hidden md:block text-sm font-bold text-text-primary shrink-0">
            {hasFilters ? `${filtered.length} jobs` : `${allJobs.length} open roles`}
          </h1>
          <div className="hidden md:flex gap-2 flex-wrap flex-1">
            {[...selectedRoles].map((r) => <ActiveChip key={r} label={r} onRemove={() => toggleRole(r)} />)}
            {[...selectedCompanies].map((c) => <ActiveChip key={c} label={c} onRemove={() => toggleCompany(c)} />)}
            {[...selectedTypes].map((t) => <ActiveChip key={t} label={t} onRemove={() => toggleType(t)} />)}
            {selectedContact && (
              <ActiveChip
                label={facets.contacts.find(([id]) => id === selectedContact)?.[1].fullName.split(' ')[0] ?? selectedContactName}
                onRemove={() => { setSelectedContact(null); setSelectedContactName(''); }}
              />
            )}
          </div>
        </div>

        {/* Job results */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <JobCardSkeleton key={i} />)}</div>
          ) : jobsError ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-sm font-semibold text-text-primary mb-1">Couldn&apos;t load jobs</p>
              <p className="text-xs text-text-muted">Check your connection and try refreshing</p>
            </div>
          ) : filtered.length === 0 && allJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm font-semibold text-text-primary mb-1">No open roles yet</p>
              <p className="text-xs text-text-muted">Check back soon — new roles are added all the time</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-sm font-semibold text-text-primary mb-1">No jobs match</p>
              <button onClick={clearAll} className="text-sm text-gold-300 hover:text-gold-400 font-medium py-2 px-4">Clear filters</button>
            </div>
          ) : (
            <div className="space-y-3">{filtered.map((j) => <JobCard key={j.job.id} data={j} />)}</div>
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
          ? 'bg-gold-300/15 text-gold-300'
          : 'text-text-secondary hover:text-text-primary hover:bg-card-hover',
      )}
    >
      <span className={cn(
        'w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors',
        active ? 'bg-gold-300 border-gold-300' : 'border-border-strong',
      )}>
        {active && <span className="text-white text-[8px] font-bold">✓</span>}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span className="text-text-muted text-[10px]">{count}</span>
    </button>
  );
}

// ── Active filter chip ───────────────────────────────────────────────────────
function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold bg-gold-300/15 text-gold-300 border border-gold-300/25 pl-3 pr-1.5 py-1.5 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-300/25 hover:bg-gold-300/50 text-gold-300 transition-colors font-bold text-sm leading-none"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}
