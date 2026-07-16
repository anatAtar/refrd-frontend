'use client';

import { use, useEffect, useState } from 'react';
import { invitesApi, type InviteInfo } from '@/lib/api/invites';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invitesApi.getInfo(token)
      .then((res) => setInfo(res.data))
      .catch(() => setError('This invite link is invalid or has already been used.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-5xl">😔</div>
          <h1 className="text-xl font-bold text-text-primary">Invalid invite link</h1>
          <p className="text-sm text-text-secondary">{error}</p>
          <Link href="/register"
            className="inline-block px-6 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-colors">
            Sign up anyway
          </Link>
        </div>
      </div>
    );
  }

  const { inviter } = info;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,101,232,0.18) 0%, transparent 70%), var(--color-page)',
      }}
    >
      <div className="max-w-md w-full space-y-8 text-center">
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

        {/* Inviter card */}
        <div className="bg-card border border-violet-500/20 rounded-2xl p-6 space-y-4">
          <Avatar src={inviter.avatarUrl} name={inviter.fullName} size="xl" className="mx-auto" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {inviter.fullName} invited you!
            </h1>
            {inviter.companyName && (
              <p className="text-sm text-text-secondary mt-1">
                Works at <strong className="text-violet-300">{inviter.companyName}</strong>
              </p>
            )}
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-text-secondary">
            Join Refrd and you&apos;ll be <strong className="text-violet-300">automatically connected</strong> to {inviter.fullName.split(' ')[0]} — see their job postings and get referred directly.
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href={`/register?invite=${token}`}
            className="block w-full py-3.5 px-6 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-colors"
          >
            Create your account →
          </Link>
          <Link href="/login" className="block text-sm text-text-muted hover:text-text-secondary transition-colors">
            Already have an account? Log in
          </Link>
        </div>

        <p className="text-xs text-text-muted">
          Refrd lets you send your CV directly to a friend inside a company — no ATS, no black hole.
        </p>
      </div>
    </div>
  );
}
