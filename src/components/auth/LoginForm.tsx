'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/lib/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OAuthButton } from './OAuthButton';
import { ApiError } from '@/lib/api/client';

export function LoginForm() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const { login, isLoading }            = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Welcome back</h1>
        <p className="text-sm text-text-secondary">Good to have you back</p>
      </div>

      <OAuthButton />

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      {/* Password with show/hide toggle */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-text-secondary mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-input border border-border-strong rounded-lg px-3 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors text-base"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-crit">{error}</p>}

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
        Log in
      </Button>

      <div className="text-center space-y-2 pt-2">
        <Link href="/forgot-password" className="block text-sm text-text-secondary hover:text-violet-300 transition-colors">
          Forgot your password?
        </Link>
        <p className="text-sm text-text-muted">
          No account?{' '}
          <Link href="/register" className="text-violet-300 hover:text-violet-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
