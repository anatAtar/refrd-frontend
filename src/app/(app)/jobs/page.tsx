'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { jobsApi } from '@/lib/api/jobs';
import { JobCard } from '@/components/job/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';
import type { JobWithReferrer } from '@/lib/types';

function useAllJobs() {
  return useSWR('jobs/browse/v2', () =>
    jobsApi.search({}).then((r) => r.data),
    { revalidateOnMount: true },
  );
}

// ── Filter panel — lifted outside JobsPage so it's a stable component type ──
interface FilterPanelProps {
  hasFilters: boolean;
  filteredCount: number;
  facets: {
    roles:     [string, number][];
    companies: [string, number][];
    types:     [string, number][];
    workModes: [string, number][];
    locations: [string, number][];
    contacts:  [string, { fullName: string; avatarUrl: string | null; count: number }][];
  };
  selectedRoles:     Set<string>;
  selectedCompanies: Set<string>;
  selectedTypes:     Set<string>;
  selectedWorkModes: Set<string>;
  selectedLocations: Set<string>;
  selectedContact:   string | null;
  setSelectedRoles:     (s: Set<string>) => void;
  setSelectedCompanies: (s: Set<string>) => void;
  setSelectedTypes:     (s: Set<string>) => void;
  setSelectedWorkModes: (s: Set<string>) => void;
  setSelectedLocations: (s: Set<string>) => void;
  setSelectedContact:   (id: string | null) => void;
  setSelectedContactName: (n: string) => void;
  toggleRole:    (t: string) => void;
  toggleCompany: (n: string) => void;
  toggleType:    (t: string) => void;
  toggleWorkMode: (t: string) => void;
  toggleLocation: (t: string) => void;
  clearAll: () => void;
  onCloseMobile: () => void;
}

// ── Reusable filter group: header + always-visible search box + checkbox list ──
function FilterGroup({ title, items, selected, onToggle, onClear, searchPlaceholder }: {
  title: string;
  items: [string, number][];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
  searchPlaceholder: string;
}) {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const visible = useMemo(() => {
    const f = search
      ? items.filter(([label]) => label.toLowerCase().includes(search.toLowerCase()))
      : items;
    return showAll ? f : f.slice(0, 7);
  }, [items, search, showAll]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {title} <span className="font-normal normal-case tracking-normal">({items.length})</span>
        </p>
        {selected.size > 0 && (
          <button onClick={onClear} className="text-[10px] text-gold-300 hover:text-gold-400 font-medium">Clear</button>
        )}
      </div>
      <div className="mb-2 flex items-center gap-1.5 bg-input border border-border rounded-lg px-2 py-1.5 focus-within:ring-1 focus-within:ring-gold-300/40">
        <span className="text-text-muted text-[11px]">🔍</span>
        <input
          className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none min-w-0"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary text-xs font-bold">×</button>}
      </div>
      <div className="space-y-0.5">
        {visible.map(([label, count]) => (
          <FilterRow key={label} label={label} count={count} active={selected.has(label)} onToggle={() => onToggle(label)} />
        ))}
      </div>
      {!search && items.length > 7 && (
        <button onClick={() => setShowAll((v) => !v)} className="text-xs text-gold-300 hover:text-gold-400 px-1 py-0.5 mt-1">
          {showAll ? '↑ Show less' : `+ ${items.length - 7} more`}
        </button>
      )}
    </div>
  );
}

function FilterPanel({
  hasFilters, filteredCount, facets,
  selectedRoles, selectedCompanies, selectedTypes, selectedWorkModes, selectedLocations, selectedContact,
  setSelectedRoles, setSelectedCompanies, setSelectedTypes, setSelectedWorkModes, setSelectedLocations,
  setSelectedContact, setSelectedContactName,
  toggleRole, toggleCompany, toggleType, toggleWorkMode, toggleLocation,
  clearAll, onCloseMobile,
}: FilterPanelProps) {
  const [referrerSearch, setReferrerSearch] = useState('');
  const visibleContacts = referrerSearch
    ? facets.contacts.filter(([, info]) => info.fullName.toLowerCase().includes(referrerSearch.toLowerCase()))
    : facets.contacts;

  return (
    <div className="p-4 space-y-6">

      {/* Mobile-only clear row */}
      {hasFilters && (
        <div className="flex md:hidden items-center justify-between">
          <span className="text-xs text-text-secondary font-medium">{filteredCount} result{filteredCount !== 1 ? 's' : ''}</span>
          <button onClick={() => { clearAll(); onCloseMobile(); }} className="text-xs text-gold-300 hover:text-gold-400 font-medium">Clear all</button>
        </div>
      )}

      <FilterGroup title="Roles" items={facets.roles} selected={selectedRoles} onToggle={toggleRole} onClear={() => setSelectedRoles(new Set())} searchPlaceholder="Filter roles…" />
      <FilterGroup title="Companies" items={facets.companies} selected={selectedCompanies} onToggle={toggleCompany} onClear={() => setSelectedCompanies(new Set())} searchPlaceholder="Filter companies…" />
      <FilterGroup title="Job Type" items={facets.types} selected={selectedTypes} onToggle={toggleType} onClear={() => setSelectedTypes(new Set())} searchPlaceholder="Filter job types…" />
      <FilterGroup title="Work Mode" items={facets.workModes} selected={selectedWorkModes} onToggle={toggleWorkMode} onClear={() => setSelectedWorkModes(new Set())} searchPlaceholder="Filter work modes…" />
      <FilterGroup title="Location" items={facets.locations} selected={selectedLocations} onToggle={toggleLocation} onClear={() => setSelectedLocations(new Set())} searchPlaceholder="Filter locations…" />

      {/* ── Referrers ── */}
      {facets.contacts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Referrers <span className="font-normal normal-case tracking-normal">({facets.contacts.length})</span>
            </p>
            {selectedContact && (
              <button onClick={() => { setSelectedContact(null); setSelectedContactName(''); }} className="text-[10px] text-gold-300 hover:text-gold-400 font-medium">Clear</button>
            )}
          </div>
          <div className="mb-2 flex items-center gap-1.5 bg-input border border-border rounded-lg px-2 py-1.5 focus-within:ring-1 focus-within:ring-gold-300/40">
            <span className="text-text-muted text-[11px]">🔍</span>
            <input
              className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none min-w-0"
              placeholder="Filter referrers…"
              value={referrerSearch}
              onChange={(e) => setReferrerSearch(e.target.value)}
            />
            {referrerSearch && <button onClick={() => setReferrerSearch('')} className="text-text-muted hover:text-text-primary text-xs font-bold">×</button>}
          </div>
          <div className="space-y-0.5">
            {visibleContacts.map(([id, info]) => (
              <button
                key={id}
                onClick={() => { setSelectedContact(selectedContact === id ? null : id); onCloseMobile(); }}
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
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch]                       = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles]         = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes]         = useState<Set<string>>(new Set());
  const [selectedWorkModes, setSelectedWorkModes] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedContact, setSelectedContact]     = useState<string | null>(
    searchParams.get('contact') ?? null,
  );
  const [selectedContactName, setSelectedContactName] = useState<string>(
    searchParams.get('name') ?? '',
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const debounced = useDebounce(search, 300);

  useEffect(() => {
    const c = searchParams.get('contact');
    const n = searchParams.get('name');
    setSelectedContact(c ?? null);
    setSelectedContactName(n ?? '');
  }, [searchParams]);

  const { user } = useAuth();
  const { data: rawJobs = [], isLoading, error: jobsError } = useAllJobs();

  // Exclude jobs the current user posted themselves — Browse Jobs is for other people's postings
  const allJobs = useMemo(
    () => rawJobs.filter((item) => item.referrer.id !== user?.id),
    [rawJobs, user?.id],
  );

  const facets = useMemo(() => {
    const companies = new Map<string, number>();
    const roles     = new Map<string, number>();
    const types     = new Map<string, number>();
    const workModes = new Map<string, number>();
    const locations = new Map<string, number>();
    const contacts  = new Map<string, { fullName: string; avatarUrl: string | null; count: number }>();

    allJobs.forEach((item) => {
      companies.set(item.job.companyName, (companies.get(item.job.companyName) ?? 0) + 1);
      roles.set(item.job.title, (roles.get(item.job.title) ?? 0) + 1);
      if (item.job.jobType) types.set(item.job.jobType, (types.get(item.job.jobType) ?? 0) + 1);
      if (item.job.workMode) workModes.set(item.job.workMode, (workModes.get(item.job.workMode) ?? 0) + 1);
      if (item.job.location) locations.set(item.job.location, (locations.get(item.job.location) ?? 0) + 1);
      const { id, fullName, avatarUrl } = item.referrer;
      if (!contacts.has(id)) contacts.set(id, { fullName, avatarUrl, count: 0 });
      contacts.get(id)!.count += 1;
    });

    return {
      companies: [...companies.entries()].sort((a, b) => b[1] - a[1]),
      roles:     [...roles.entries()].sort((a, b) => b[1] - a[1]),
      types:     [...types.entries()].sort((a, b) => b[1] - a[1]),
      workModes: [...workModes.entries()].sort((a, b) => b[1] - a[1]),
      locations: [...locations.entries()].sort((a, b) => b[1] - a[1]),
      contacts:  [...contacts.entries()].sort((a, b) => b[1].count - a[1].count),
    };
  }, [allJobs]);

  const filtered = useMemo(() => {
    return allJobs.filter((item) => {
      if (selectedCompanies.size > 0 && !selectedCompanies.has(item.job.companyName)) return false;
      if (selectedRoles.size > 0 && !selectedRoles.has(item.job.title)) return false;
      if (selectedTypes.size > 0 && item.job.jobType && !selectedTypes.has(item.job.jobType)) return false;
      if (selectedWorkModes.size > 0 && item.job.workMode && !selectedWorkModes.has(item.job.workMode)) return false;
      if (selectedLocations.size > 0 && item.job.location && !selectedLocations.has(item.job.location)) return false;
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
  }, [allJobs, selectedCompanies, selectedRoles, selectedTypes, selectedWorkModes, selectedLocations, selectedContact, debounced]);

  const hasFilters = selectedCompanies.size > 0 || selectedRoles.size > 0 || selectedTypes.size > 0 || selectedWorkModes.size > 0 || selectedLocations.size > 0 || !!selectedContact || !!debounced;

  const toggleCompany = (name: string) =>
    setSelectedCompanies((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const toggleRole = (title: string) =>
    setSelectedRoles((prev) => { const n = new Set(prev); n.has(title) ? n.delete(title) : n.add(title); return n; });
  const toggleType = (type: string) =>
    setSelectedTypes((prev) => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n; });
  const toggleWorkMode = (mode: string) =>
    setSelectedWorkModes((prev) => { const n = new Set(prev); n.has(mode) ? n.delete(mode) : n.add(mode); return n; });
  const toggleLocation = (location: string) =>
    setSelectedLocations((prev) => { const n = new Set(prev); n.has(location) ? n.delete(location) : n.add(location); return n; });

  const clearAll = () => {
    setSelectedCompanies(new Set()); setSelectedRoles(new Set()); setSelectedTypes(new Set());
    setSelectedWorkModes(new Set()); setSelectedLocations(new Set());
    setSelectedContact(null); setSelectedContactName(''); setSearch('');
  };

  // Shared props for both sidebar and mobile drawer instances
  const filterPanelProps: FilterPanelProps = {
    hasFilters, filteredCount: filtered.length, facets,
    selectedRoles, selectedCompanies, selectedTypes, selectedWorkModes, selectedLocations, selectedContact,
    setSelectedRoles, setSelectedCompanies, setSelectedTypes, setSelectedWorkModes, setSelectedLocations,
    setSelectedContact, setSelectedContactName,
    toggleRole, toggleCompany, toggleType, toggleWorkMode, toggleLocation,
    clearAll,
    onCloseMobile: () => setShowMobileFilters(false),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">

      {/* Page header — full width, above the sidebar + list so both start aligned */}
      <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
        <h1 className="text-2xl font-bold text-text-primary mb-0.5">Browse Jobs</h1>
        <p className="text-sm text-text-secondary">
          {isLoading ? 'Loading…' : `${allJobs.length} open role${allJobs.length !== 1 ? 's' : ''} from your network`}
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── MOBILE FILTER DRAWER ── */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
            <div className="relative mt-auto bg-card border-t border-border rounded-t-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-sm font-bold text-text-primary">Filter Jobs</span>
                <button onClick={() => setShowMobileFilters(false)} className="text-text-muted hover:text-text-primary p-2 -mr-2 text-lg">×</button>
              </div>
              <FilterPanel {...filterPanelProps} />
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

        {/* ── DESKTOP FILTER SIDEBAR ── */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border overflow-y-auto">
          <FilterPanel {...filterPanelProps} />
        </aside>

        {/* ── JOB LIST ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-page/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 items-center gap-2 bg-input border border-border-strong rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gold-300/40 transition-all">
            <span className="text-text-muted shrink-0">🔍</span>
            <input
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
              placeholder="Search by role, company, location, referrer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="flex items-center justify-center w-6 h-6 rounded-full bg-border hover:bg-border-strong text-text-muted hover:text-text-primary transition-colors text-sm font-bold shrink-0">×</button>
            )}
          </div>

          {/* Mobile: search + filter button */}
          <div className="flex md:hidden items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 flex items-center gap-2 bg-input border border-border-strong rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-gold-300/40">
              <span className="text-text-muted shrink-0">🔍</span>
              <input
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
                placeholder="Search roles, companies…"
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

          {/* Desktop: count + clear all */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="text-sm font-bold text-text-primary whitespace-nowrap">
              {hasFilters ? `${filtered.length} jobs` : `${allJobs.length} open roles`}
            </span>
            {hasFilters && (
              <button onClick={clearAll} className="text-xs text-gold-300 hover:text-gold-400 font-medium whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips (desktop) */}
        {hasFilters && (
          <div className="hidden md:flex gap-2 flex-wrap px-4 py-2 border-b border-border bg-page/60">
            {[...selectedRoles].map((r) => <ActiveChip key={r} label={r} onRemove={() => toggleRole(r)} />)}
            {[...selectedCompanies].map((c) => <ActiveChip key={c} label={c} onRemove={() => toggleCompany(c)} />)}
            {[...selectedTypes].map((t) => <ActiveChip key={t} label={t} onRemove={() => toggleType(t)} />)}
            {[...selectedWorkModes].map((m) => <ActiveChip key={m} label={m} onRemove={() => toggleWorkMode(m)} />)}
            {[...selectedLocations].map((l) => <ActiveChip key={l} label={l} onRemove={() => toggleLocation(l)} />)}
            {selectedContact && (
              <ActiveChip
                label={facets.contacts.find(([id]) => id === selectedContact)?.[1].fullName.split(' ')[0] ?? selectedContactName}
                onRemove={() => { setSelectedContact(null); setSelectedContactName(''); }}
              />
            )}
          </div>
        )}

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
      <span className="flex-1 truncate" title={label}>{label}</span>
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
