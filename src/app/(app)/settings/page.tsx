'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/context/AuthContext';
import { usersApi } from '@/lib/api/users';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api/client';

type FormState = {
  fullName: string;
  headline: string;
  companyName: string;
  desiredRole: string;
  preferredLocation: string;
};

function fromUser(user: ReturnType<typeof useAuth>['user']): FormState {
  return {
    fullName:          user?.fullName          ?? '',
    headline:          user?.headline          ?? '',
    companyName:       user?.companyName       ?? '',
    desiredRole:       user?.desiredRole       ?? '',
    preferredLocation: user?.preferredLocation ?? '',
  };
}

function isDirty(a: FormState, b: FormState) {
  return (Object.keys(a) as (keyof FormState)[]).some(k => a[k] !== b[k]);
}

export default function SettingsPage() {
  const { user, refresh } = useAuth();

  const [savedForm, setSavedForm] = useState<FormState>(() => fromUser(user));
  const [form, setForm]           = useState<FormState>(() => fromUser(user));
  const [isLoading, setIsLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const hasChanges = isDirty(form, savedForm);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setJustSaved(false);
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || isLoading) return;
    setIsLoading(true);
    try {
      await usersApi.updateMe({
        fullName:          form.fullName          || undefined,
        headline:          form.headline          || undefined,
        companyName:       form.companyName       || null,
        desiredRole:       form.desiredRole       || null,
        preferredLocation: form.preferredLocation || null,
      });
      await refresh();
      setSavedForm(form); // mark current form as the new saved baseline
      setJustSaved(true);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const hasPreferences = form.desiredRole || form.preferredLocation;

  let buttonLabel = 'Save Changes';
  if (isLoading)  buttonLabel = 'Saving…';
  else if (justSaved && !hasChanges) buttonLabel = '✓ Saved!';

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-sm text-text-secondary">Manage your profile and job preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Job matching preferences */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-text-primary mb-0.5">Job preferences</h2>
            <p className="text-xs text-text-muted">
              Used to show matched jobs on your{' '}
              <a href="/feed" className="text-gold-500 hover:text-gold-400 font-semibold">Home</a> page.
              {hasPreferences && (
                <span className="ml-1 text-green-600 font-semibold">✓ Active</span>
              )}
            </p>
          </div>
          <Input
            label="Role you're looking for"
            value={form.desiredRole}
            onChange={set('desiredRole')}
            placeholder="e.g. Senior Frontend Engineer"
          />
          <Input
            label="Preferred location"
            value={form.preferredLocation}
            onChange={set('preferredLocation')}
            placeholder="e.g. Tel Aviv, Remote"
          />
        </div>

        {/* Profile */}
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

        {/* Account */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-bold text-text-primary mb-2">Account</h2>
          <p className="text-sm text-text-secondary">
            Email: <strong className="text-text-primary">{user?.email}</strong>
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!hasChanges || isLoading}
          className="w-full"
        >
          {buttonLabel}
        </Button>

      </form>
    </div>
  );
}
