import Link from 'next/link';
import { mkt } from '@/app/(marketing)/tokens';

interface TocItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export function LegalLayout({ title, effectiveDate, toc, children }: LegalLayoutProps) {
  return (
    <div className="max-w-[1180px] mx-auto px-8 pt-6 pb-24 grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-14 items-start">
      <nav className="md:sticky md:top-6">
        <p
          className="text-xs uppercase tracking-[0.08em] font-semibold mb-3.5 pb-2.5"
          style={{ color: mkt.textMuted, borderBottom: `1px solid ${mkt.border}` }}
        >
          Contents
        </p>
        <div className="flex flex-col gap-0.5 max-h-[calc(100vh-100px)] overflow-y-auto">
          {toc.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="py-1.5 pl-3 text-[13.5px] leading-tight"
              style={{ borderLeft: `2px solid ${mkt.border}`, color: mkt.textSecondary }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <article className="min-w-0">
        <h1 className="text-[38px] leading-[1.15] font-extrabold tracking-tight mb-2">{title}</h1>
        <p className="text-sm mb-8" style={{ color: mkt.textMuted }}>{effectiveDate}</p>
        {children}
      </article>
    </div>
  );
}

export function LegalH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-[22px] font-bold mt-10 mb-3.5 pt-6"
      style={{ borderTop: `1px solid ${mkt.border}` }}
    >
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold mt-6 mb-2" style={{ color: mkt.accentSeeker }}>
      {children}
    </h3>
  );
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed mb-4" style={{ color: mkt.textSecondary }}>
      {children}
    </p>
  );
}

export function LegalUl({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 pl-5 flex flex-col gap-2">{children}</ul>;
}

export function LegalLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>
      {children}
    </li>
  );
}

export function LegalStrong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: mkt.textPrimary }}>{children}</strong>;
}

export function LegalCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-5 px-5 py-4 rounded-r-xl"
      style={{ background: mkt.cardBg, borderLeft: `3px solid ${mkt.accentSeeker}` }}
    >
      <p className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>{children}</p>
    </div>
  );
}
