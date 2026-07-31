import Link from 'next/link';
import { mkt } from '@/app/(marketing)/tokens';

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${mkt.border}` }}>
      <div className="max-w-[1120px] mx-auto px-8 py-12 flex justify-between items-center flex-wrap gap-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-[26px] h-[26px] rounded-[7px]"
            style={{ background: `linear-gradient(135deg, ${mkt.accentSeeker}, ${mkt.accentReferral})` }}
          />
          <span className="text-base font-bold" style={{ color: mkt.textPrimary }}>DirectRef</span>
          <span className="text-sm ml-2" style={{ color: mkt.textMuted }}>Connecting people to their next role.</span>
        </div>
        <div className="flex gap-7 items-center flex-wrap">
          <Link href="/our-story" className="text-[14.5px]" style={{ color: mkt.textSecondary }}>Our Story</Link>
          <Link href="/login" className="text-[14.5px]" style={{ color: mkt.textSecondary }}>Log in</Link>
          <Link href="/login" className="text-[14.5px]" style={{ color: mkt.textSecondary }}>Sign up as seeker</Link>
          <Link href="/login" className="text-[14.5px]" style={{ color: mkt.textSecondary }}>Sign up as referrer</Link>
        </div>
      </div>
      <div className="flex justify-center gap-5 flex-wrap pb-3.5">
        <Link href="/privacy" className="text-[13px]" style={{ color: mkt.textMuted }}>Privacy Policy</Link>
        <Link href="/terms" className="text-[13px]" style={{ color: mkt.textMuted }}>Terms of Service</Link>
        <a href="mailto:support@directref.com" className="text-[13px]" style={{ color: mkt.textMuted }}>Contact</a>
      </div>
      <p className="text-center text-[13px] pb-7" style={{ color: mkt.textMuted }}>© 2026 DirectRef.</p>
    </footer>
  );
}
