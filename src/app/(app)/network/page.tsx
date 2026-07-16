'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useConnections } from '@/lib/hooks/useConnections';
import { connectionsApi } from '@/lib/api/connections';
import { usersApi } from '@/lib/api/users';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/lib/context/AuthContext';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { ApiError } from '@/lib/api/client';
import type { PublicUser, Connection } from '@/lib/types';
import Link from 'next/link';

type Tab = 'all' | 'hasjobs' | 'pending' | 'sent';

export default function NetworkPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [addSearch, setAddSearch] = useState('');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const debouncedAdd = useDebounce(addSearch, 400);
  const debouncedSearch = useDebounce(search, 300);

  const { connections, mutate } = useConnections();

  // Search for new people to add
  const { data: addResults } = useSWR(
    debouncedAdd.length >= 2 ? ['users/search', debouncedAdd] : null,
    ([, q]) => usersApi.search(q as string).then((r) => r.data),
  );

  const connectedIds = useMemo(() => new Set(
    connections.map((c) => c.requesterId === user?.id ? c.addresseeId : c.requesterId),
  ), [connections, user?.id]);

  const newPeople = addResults?.filter((u: PublicUser) => u.id !== user?.id && !connectedIds.has(u.id)) ?? [];

  // Categorise connections
  const pending  = useMemo(() => connections.filter((c) => c.status === 'pending' && c.addresseeId === user?.id), [connections, user?.id]);
  const sent     = useMemo(() => connections.filter((c) => c.status === 'pending' && c.requesterId === user?.id), [connections, user?.id]);
  const accepted = useMemo(() => connections.filter((c) => c.status === 'accepted'), [connections]);

  // Filter accepted by search + tab
  const filtered = useMemo(() => {
    let list = tab === 'pending' ? pending : tab === 'sent' ? sent : accepted;
    if (tab === 'hasjobs') {
      // "has jobs" = referrer flag on the other person — approximate with companyName present
      list = accepted.filter((c) => c.requester?.companyName);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((c) =>
        c.requester?.fullName?.toLowerCase().includes(q) ||
        c.requester?.companyName?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tab, pending, sent, accepted, debouncedSearch]);

  const sendRequest = async (addresseeId: string) => {
    try {
      await connectionsApi.send(addresseeId);
      toast.success('Request sent!');
      mutate();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send request');
    }
  };

  const handleAccept = async (id: string) => {
    await connectionsApi.update(id, 'accepted');
    toast.success('Connected!');
    mutate();
  };

  const handleDecline = async (id: string) => {
    await connectionsApi.update(id, 'rejected');
    mutate();
  };

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await connectionsApi.remove(id);
      toast.success('Connection removed');
      mutate();
    } catch {
      toast.error('Failed to remove');
    } finally {
      setRemoving(null);
    }
  };

  const TABS = [
    { id: 'all',     label: 'All',         count: accepted.length },
    { id: 'hasjobs', label: 'Has Jobs',     count: accepted.filter(c => c.requester?.companyName).length },
    { id: 'pending', label: 'Requests',     count: pending.length, highlight: pending.length > 0 },
    { id: 'sent',    label: 'Sent',         count: sent.length },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-0.5">My Network</h1>
          <p className="text-sm text-text-secondary">
            {accepted.length} connection{accepted.length !== 1 ? 's' : ''}
            {pending.length > 0 && (
              <span className="ml-2 text-warn font-medium">· {pending.length} pending request{pending.length > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => { setShowAddPanel((v) => !v); setAddSearch(''); }}
        >
          {showAddPanel ? '✕ Close' : '＋ Add people'}
        </Button>
      </div>

      {/* Add people panel */}
      {showAddPanel && (
        <div className="bg-card border border-violet-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 bg-input border border-border-strong rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-violet-500/40 transition-all">
            <span className="text-text-muted">🔍</span>
            <input
              autoFocus
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              placeholder="Search by name or company…"
              value={addSearch}
              onChange={(e) => setAddSearch(e.target.value)}
            />
          </div>

          {addSearch.length < 2 && (
            <p className="text-xs text-text-muted text-center py-2">Type at least 2 characters to search</p>
          )}

          {newPeople.length > 0 && (
            <div className="divide-y divide-border rounded-lg overflow-hidden border border-border">
              {newPeople.map((person: PublicUser) => (
                <div key={person.id} className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-card-hover transition-colors">
                  <Avatar src={person.avatarUrl} name={person.fullName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{person.fullName}</p>
                    <p className="text-xs text-text-secondary truncate">{person.headline ?? person.companyName ?? '—'}</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => sendRequest(person.id)}>Connect</Button>
                </div>
              ))}
            </div>
          )}

          {addSearch.length >= 2 && newPeople.length === 0 && (
            <p className="text-xs text-text-muted text-center py-3">No new people found for &quot;{addSearch}&quot;</p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-input border border-border rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-lg transition-all',
              tab === t.id
                ? 'bg-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                'highlight' in t && t.highlight
                  ? 'bg-warn/20 text-warn'
                  : tab === t.id ? 'bg-violet-500/20 text-violet-300' : 'bg-border text-text-muted',
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search within connections */}
      {(tab === 'all' || tab === 'hasjobs') && accepted.length > 5 && (
        <div className="flex items-center gap-2 bg-input border border-border-strong rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500/40 transition-all">
          <span className="text-text-muted text-sm">🔍</span>
          <input
            className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none"
            placeholder="Filter by name or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary text-sm">×</button>}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        tab === 'pending' ? (
          <EmptyState icon="✉️" title="No pending requests" description="When someone sends you a connection request, it will appear here." />
        ) : tab === 'sent' ? (
          <EmptyState icon="📤" title="No sent requests" description="Requests you've sent that haven't been accepted yet will appear here." />
        ) : tab === 'hasjobs' ? (
          <EmptyState icon="💼" title="None of your contacts have posted jobs yet" description="As your connections post jobs from their companies, they'll appear here." />
        ) : search ? (
          <div className="text-center py-8 text-sm text-text-muted">
            No contacts match &quot;{search}&quot; —{' '}
            <button onClick={() => setSearch('')} className="text-violet-300 hover:text-violet-400">clear</button>
          </div>
        ) : (
          <EmptyState
            icon="🤝"
            title="No connections yet"
            description="Click '+ Add people' to find friends and colleagues."
            action={{ label: '＋ Add people', onClick: () => setShowAddPanel(true) }}
          />
        )
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <ConnectionRow
              key={c.id}
              connection={c}
              viewerId={user?.id ?? ''}
              tab={tab}
              isRemoving={removing === c.id}
              onAccept={() => handleAccept(c.id)}
              onDecline={() => handleDecline(c.id)}
              onRemove={() => handleRemove(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Compact connection row ───────────────────────────────────────────────────
function ConnectionRow({ connection, viewerId, tab, isRemoving, onAccept, onDecline, onRemove }: {
  connection: Connection;
  viewerId: string;
  tab: Tab;
  isRemoving: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onRemove: () => void;
}) {
  const person = connection.requester;
  if (!person) return null;

  return (
    <div className="flex items-center gap-3 bg-card hover:bg-card-hover border border-border rounded-xl px-4 py-3 transition-colors group">
      <Avatar src={person.avatarUrl} name={person.fullName} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary leading-tight">{person.fullName}</p>
        <p className="text-xs text-text-secondary truncate mt-0.5">
          {person.headline ?? person.companyName ?? '—'}
        </p>
        {person.companyName && !person.headline && (
          <span className="text-[11px] text-text-muted">{person.companyName}</span>
        )}
      </div>

      {/* Company badge */}
      {person.companyName && (
        <Badge variant="muted" className="hidden sm:inline-flex shrink-0">
          {person.companyName}
        </Badge>
      )}

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        {tab === 'pending' ? (
          <>
            <Button variant="primary" size="sm" onClick={onAccept}>Accept</Button>
            <Button variant="ghost" size="sm" onClick={onDecline}>Decline</Button>
          </>
        ) : tab === 'sent' ? (
          <span className="text-xs text-text-muted italic">Pending…</span>
        ) : (
          <>
            <Link href={`/jobs?contact=${person.id}`}>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">See jobs</Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              isLoading={isRemoving}
              className="text-text-muted hover:text-crit opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
