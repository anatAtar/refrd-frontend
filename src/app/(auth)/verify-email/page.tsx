'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

function VerifyContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') return <div className="text-center py-8 text-text-secondary">Verifying...</div>;

  if (status === 'success') return (
    <div className="text-center py-4">
      <div className="text-4xl mb-4">✅</div>
      <h2 className="text-lg font-bold text-text-primary mb-2">Email verified!</h2>
      <p className="text-sm text-text-secondary mb-6">You can now log in to your account.</p>
      <Link href="/login" className="text-violet-300 font-medium hover:text-violet-400">Go to login →</Link>
    </div>
  );

  return (
    <div className="text-center py-4">
      <div className="text-4xl mb-4">❌</div>
      <h2 className="text-lg font-bold text-text-primary mb-2">Invalid link</h2>
      <p className="text-sm text-text-secondary mb-6">This verification link is invalid or has expired.</p>
      <Link href="/login" className="text-violet-300 font-medium hover:text-violet-400">Go to login →</Link>
    </div>
  );
}

import { Suspense } from 'react';
export default function VerifyEmailPage() {
  return <Suspense><VerifyContent /></Suspense>;
}
