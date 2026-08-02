import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 * Generate a short human-readable job ID.
 * e.g. company="Wix", id="...3b9f" → #WIX-3B9F
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
 * Best-effort company logo URL, derived from the job's source domain — no
 * logo field/scraping needed. Falls back to null (caller shows a generic
 * icon) if the URL can't be parsed; the image itself may still 404 for
 * domains Clearbit doesn't have indexed, so callers must handle onError too.
 */
export function companyLogoUrl(sourceUrl: string): string | null {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '');
    return `https://logo.clearbit.com/${hostname}`;
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
};

/** Map application status to badge color classes */
export const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-warn/10 text-warn border-warn/20',
  viewed: 'bg-blue/10 text-blue border-blue/20',
  forwarded: 'bg-good/10 text-good border-good/20',
  rejected: 'bg-crit/10 text-crit border-crit/20',
};

/** Map connection status to label */
export const CONNECTION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Connected',
  rejected: 'Declined',
};
