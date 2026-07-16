'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function OnboardingWelcomePage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,101,232,0.18) 0%, transparent 70%), var(--color-page)',
      }}
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div
          className="text-3xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(160deg, #fff 0%, #C4B6FA 55%, #7B65E8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Refrd
        </div>

        {/* Wave + greeting */}
        <div className="space-y-4">
          <div className="text-6xl">👋</div>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome, {firstName}!
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Refrd connects you with friends inside companies you want to work at.
            Your CV goes straight to a real person — not an ATS black hole.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '👥', label: 'Connect with colleagues' },
            { icon: '🔍', label: 'Find their open roles' },
            { icon: '📄', label: 'Send CV directly' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 space-y-2">
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xs text-text-secondary leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/onboarding/company"
          className="block w-full py-3 px-6 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-colors text-center"
        >
          Let's set up your network →
        </Link>

        <Link href="/feed" className="block text-sm text-text-muted hover:text-text-secondary transition-colors">
          Skip for now
        </Link>
      </div>
    </div>
  );
}
