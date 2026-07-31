import Link from 'next/link';
import { mkt } from '@/app/(marketing)/tokens';

interface MarketingHeaderProps {
  /** 'home' shows Log In / Sign Up CTAs. 'sub' adds a "← Back to home" row instead. */
  variant?: 'home' | 'sub';
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-lg shrink-0"
        style={{ background: `linear-gradient(135deg, ${mkt.accentSeeker}, ${mkt.accentReferral})` }}
      />
      <span className="text-xl font-bold tracking-tight" style={{ color: mkt.textPrimary }}>
        DirectRef
      </span>
    </Link>
  );
}

export function MarketingHeader({ variant = 'home' }: MarketingHeaderProps) {
  const navHref = (anchor: string) => (variant === 'home' ? `#${anchor}` : `/#${anchor}`);

  return (
    <header className="max-w-[1280px] mx-auto px-12 py-6">
      <div className="flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-8">
          <Link href={navHref('how')} className="text-[15px] font-medium" style={{ color: mkt.textSecondary }}>
            How it Works
          </Link>
        </nav>
        {variant === 'home' && (
          <div className="flex items-center gap-3.5">
            <Link href="/login" className="text-[15px] font-semibold px-4.5 py-2.5" style={{ color: mkt.textPrimary }}>
              Log In
            </Link>
            <Link
              href="/login"
              className="text-[15px] font-semibold px-5 py-2.5 rounded-full"
              style={{ background: mkt.textPrimary, color: mkt.bg }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      {variant === 'sub' && (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-4.5 text-[14.5px] font-medium"
          style={{ color: mkt.textSecondary }}
        >
          ← Back to home
        </Link>
      )}
    </header>
  );
}
