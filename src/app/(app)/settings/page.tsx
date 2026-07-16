'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/context/AuthContext';
import { usersApi } from '@/lib/api/users';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api/client';

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    headline: user?.headline ?? '',
    companyName: user?.companyName ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await usersApi.updateMe(form);
      await refresh();
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-sm text-text-secondary">Manage your profile</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Profile</h2>
          <Input label="Full name" value={form.fullName} onChange={set('fullName')} required />
          <Input
            label="Headline"
            value={form.headline}
            onChange={set('headline')}
            placeholder="e.g. Senior Engineer at Google"
          />
          <Input
            label="Company"
            value={form.companyName}
            onChange={set('companyName')}
            placeholder="Where do you work?"
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-bold text-text-primary mb-2">Account</h2>
          <p className="text-sm text-text-secondary">
            Email: <strong className="text-text-primary">{user?.email}</strong>
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
