import { Rubik } from 'next/font/google';
import { mkt } from './tokens';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rubik',
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${rubik.variable} min-h-screen`}
      style={{ fontFamily: 'var(--font-rubik)', background: mkt.bg, color: mkt.textPrimary }}
    >
      {children}
    </div>
  );
}
