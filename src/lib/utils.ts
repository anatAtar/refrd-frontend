import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CreditBalance } from './types';

/** Copy for the credits-hint line shown under "Send My C.V." / "Post Job" —
 *  same shared-balance rule in both places, per the credits guidelines. */
export function creditHintText(balance: CreditBalance | null | undefined): string {
  if (!balance) return '';
  if (balance.freeAvailable > 0) {
    return `Uses 1 of your ${balance.freeTotal} free credit${balance.freeTotal === 1 ? '' : 's'}. You have ${balance.total} credit${balance.total === 1 ? '' : 's'} total.`;
  }
  if (balance.purchased > 0) {
    return `Uses 1 purchased credit. You have ${balance.total} credit${balance.total === 1 ? '' : 's'} left.`;
  }
  return "You're out of credits. Buy more credits.";
}

/** Validate a `next=` post-login redirect target: same-origin path only.
 *  Rejects protocol-relative ("//host") and absolute URLs to prevent an
 *  open redirect via a crafted `?next=` value. */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next) return fallback;
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  return next;
}

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Short human-readable job code, used in the referrer's CV inbox to tell
 * postings apart at a glance — e.g. company="Wix", id="...3b9f" → #WIX-3B9F.
 * Intentionally not shown on job cards/detail pages, just here.
 */
export function jobCode(companyName: string, id: string): string {
  const prefix = companyName
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');
  const suffix = id.replace(/-/g, '').slice(-4).toUpperCase();
  return `#${prefix}-${suffix}`;
}

/**
 * Meaningful job detail URL segment: the role title, slugified, plus an
 * 8-char id suffix for uniqueness — e.g. "senior-frontend-engineer-117c0d7e"
 * instead of the raw UUID. The backend resolves this by matching the
 * suffix against the real job id, so no schema change/slug column needed.
 */
export function jobSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const suffix = id.replace(/-/g, '').slice(-8);
  return slug ? `${slug}-${suffix}` : suffix;
}

/**
 * Best-effort company icon URL, derived from the job's source domain — no
 * logo field/scraping needed. Uses Google's favicon service (logo.clearbit.com
 * no longer resolves at all — the free Clearbit logo API is dead, confirmed
 * via DNS lookup, not just missing coverage for some domains). Falls back to
 * null (caller shows a generic icon) if the URL can't be parsed; Google's
 * service does return a real 404 for domains with no favicon, so callers
 * must still handle onError too.
 */
export function companyLogoUrl(sourceUrl: string): string | null {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Format a currency amount */
export function formatCurrency(amount: string | number | null | undefined, currency = 'USD'): string {
  if (!amount) return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
  } catch {
    return `${currency} ${num.toLocaleString()}`;
  }
}

/** Relative time string */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Map application status to display label */
export const STATUS_LABELS: Record<string, string> = {
  submitted: 'Pending',
  viewed: 'Reviewed',
  forwarded: 'Downloaded',
  rejected: 'Not a fit',
  expired: 'Expired',
};

/** Map application status to badge color classes.
 *  "Not a fit" and "Expired" are both neutral outcomes — never colored as an error/red state. */
export const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-warn/10 text-warn border-warn/20',
  viewed: 'bg-blue/10 text-blue border-blue/20',
  forwarded: 'bg-good/10 text-good border-good/20',
  expired: 'bg-border text-text-secondary border-border-strong',
  rejected: 'bg-border text-text-secondary border-border-strong',
};

/** Plain-language explanation shown in a tooltip on hover/focus of a status badge. */
export const STATUS_TOOLTIPS: Record<string, string> = {
  submitted: 'Your CV has been submitted to the referrer.',
  viewed: 'The referrer has opened your CV and is reviewing it.',
  forwarded: 'The referrer downloaded your CV and passed it to HR.',
  rejected: 'The referrer marked this application as not a fit for the role.',
  expired: 'This application expired because the referrer did not respond within 5 days. Your credit was returned.',
};

/** Map connection status to label */
export const CONNECTION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Connected',
  rejected: 'Declined',
};
