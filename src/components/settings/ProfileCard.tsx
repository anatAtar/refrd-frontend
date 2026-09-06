'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { pfx } from '@/app/(app)/settings/tokens';
import { useAuth } from '@/lib/context/AuthContext';
import { usersApi } from '@/lib/api/users';
import { ApiError } from '@/lib/api/client';
import { Field, SelectField } from './fields';
import { PrimaryButton } from './buttons';
import { getInitials } from '@/lib/utils';
import type { User } from '@/lib/types';

type FormState = {
  fullName: string;
  headline: string;
  companyName: string;
  yearsOfExperience: string;
  desiredRole: string;
  preferredLocation: string;
  employmentType: string;
  seniority: string;
};

function fromUser(user: User | null): FormState {
  return {
    fullName: user?.fullName ?? '',
    headline: user?.headline ?? '',
    companyName: user?.companyName ?? '',
    yearsOfExperience: user?.yearsOfExperience != null ? String(user.yearsOfExperience) : '',
    desiredRole: user?.desiredRole ?? user?.headline ?? '',
    preferredLocation: user?.preferredLocation ?? '',
    employmentType: user?.employmentType ?? '',
    seniority: user?.seniority ?? '',
  };
}

function isDirty(a: FormState, b: FormState) {
  return (Object.keys(a) as (keyof FormState)[]).some((k) => a[k] !== b[k]);
}

function signInMethod(user: User | null): string {
  if (user?.googleId) return 'Google';
  if (user?.linkedinId) return 'LinkedIn';
  return 'email & password';
}

// Israel's standard tech-job regional split (the breakdown used across
// Israeli job boards like AllJobs/Drushim) rather than official CBS
// districts, since it's what job postings' free-text locations map to
// in practice for a tech audience.
const ISRAEL_REGIONS = [
  { value: 'Tel Aviv', label: 'Tel Aviv' },
  { value: 'Central', label: 'Central' },
  { value: 'Sharon', label: 'Sharon' },
  { value: 'Haifa', label: 'Haifa' },
  { value: 'North', label: 'North' },
  { value: 'Jerusalem', label: 'Jerusalem' },
  { value: 'South', label: 'South' },
];

// Trimmed from the Stack Overflow Developer Survey's published role
// taxonomy down to roles relevant to hiring/referrals (dropped
// academic-only categories like Student/Educator/Retired).
const TECH_ROLES = [
  { value: 'Full-Stack Developer', label: 'Full-Stack Developer' },
  { value: 'Back-End Developer', label: 'Back-End Developer' },
  { value: 'Front-End Developer', label: 'Front-End Developer' },
  { value: 'Mobile Developer', label: 'Mobile Developer' },
  { value: 'Desktop/Enterprise Developer', label: 'Desktop/Enterprise Developer' },
  { value: 'Embedded/Devices Developer', label: 'Embedded/Devices Developer' },
  { value: 'Game/Graphics Developer', label: 'Game/Graphics Developer' },
  { value: 'QA/Test Engineer', label: 'QA/Test Engineer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Site Reliability Engineer', label: 'Site Reliability Engineer' },
  { value: 'Cloud Infrastructure Engineer', label: 'Cloud Infrastructure Engineer' },
  { value: 'Cybersecurity/InfoSec Engineer', label: 'Cybersecurity/InfoSec Engineer' },
  { value: 'Software/Solutions Architect', label: 'Software/Solutions Architect' },
  { value: 'Database Administrator', label: 'Database Administrator' },
  { value: 'System Administrator', label: 'System Administrator' },
  { value: 'Engineering Manager', label: 'Engineering Manager' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'AI/ML Engineer', label: 'AI/ML Engineer' },
  { value: 'Data/Business Analyst', label: 'Data/Business Analyst' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'UX/UI Designer', label: 'UX/UI Designer' },
  { value: 'Support Engineer/Analyst', label: 'Support Engineer/Analyst' },
  { value: 'Financial Analyst/Engineer', label: 'Financial Analyst/Engineer' },
];

const OTHER_ROLE = '__other__';

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
];

const SENIORITY_LEVELS = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
];

export function ProfileCard() {
  const { user, refresh } = useAuth();

  const [savedForm, setSavedForm] = useState<FormState>(() => fromUser(user));
  const [form, setForm] = useState<FormState>(() => fromUser(user));
  const [isLoading, setIsLoading] = useState(false);
  const isKnownRole = (role: string) => TECH_ROLES.some((r) => r.value === role);
  const [customRole, setCustomRole] = useState(() => form.desiredRole !== '' && !isKnownRole(form.desiredRole));

  const hasChanges = isDirty(form, savedForm);

  const set = <K extends keyof FormState>(key: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === OTHER_ROLE) {
      setCustomRole(true);
      setForm((prev) => ({ ...prev, desiredRole: isKnownRole(prev.desiredRole) ? '' : prev.desiredRole }));
    } else {
      setCustomRole(false);
      setForm((prev) => ({ ...prev, desiredRole: e.target.value }));
    }
  };

  const handleSave = async () => {
    if (!hasChanges || isLoading) return;
    setIsLoading(true);
    try {
      await usersApi.updateMe({
        fullName: form.fullName || undefined,
        headline: form.headline || undefined,
        companyName: form.companyName || null,
        yearsOfExperience: form.yearsOfExperience !== '' ? Number(form.yearsOfExperience) : null,
        desiredRole: form.desiredRole || null,
        preferredLocation: form.preferredLocation || null,
        employmentType: (form.employmentType || null) as User['employmentType'],
        seniority: (form.seniority || null) as User['seniority'],
      });
      await refresh();
      setSavedForm(form);
      toast.success('Preferences saved.');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: pfx.surface, border: `1px solid ${pfx.border}` }}>

      {/* Identity row */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-[15px]"
          style={{ background: pfx.goldSoft, color: pfx.gold }}
        >
          {getInitials(user?.fullName ?? '?')}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold truncate" style={{ color: pfx.ink }}>{user?.fullName}</p>
          <p className="text-[13px] truncate" style={{ color: pfx.inkSecondary }}>
            {user?.email} · signed in with {signInMethod(user)}
          </p>
        </div>
      </div>

      {/* Group A — Who you are */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.09em] mb-4" style={{ color: pfx.inkMuted }}>
          Who you are
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" value={form.fullName} onChange={set('fullName')} required />
          <Field label="Current role" value={form.headline} onChange={set('headline')} placeholder="e.g. Senior Engineer" />
          <Field label="Company" value={form.companyName} onChange={set('companyName')} placeholder="Where do you work?" />
          <Field
            label="Years of experience"
            type="number"
            min={0}
            max={60}
            value={form.yearsOfExperience}
            onChange={set('yearsOfExperience')}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* Group B — What you are looking for */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.09em]" style={{ color: pfx.inkMuted }}>
          What you are looking for
        </p>
        <p className="text-xs mt-1 mb-4" style={{ color: pfx.inkMuted }}>
          Used to show matched jobs on your{' '}
          <Link href="/feed" className="font-semibold" style={{ color: pfx.gold }}>Home</Link> page.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <SelectField
              label="Desired role"
              value={customRole ? OTHER_ROLE : form.desiredRole}
              onChange={handleRoleSelect}
              options={[...TECH_ROLES, { value: OTHER_ROLE, label: 'Other…' }]}
              placeholder="Select…"
            />
            {customRole && (
              <Field
                label="Custom role"
                value={form.desiredRole}
                onChange={set('desiredRole')}
                placeholder="e.g. Growth Hacker"
                className="mt-2"
              />
            )}
          </div>
          <SelectField
            label="Preferred location"
            value={form.preferredLocation}
            onChange={set('preferredLocation')}
            options={ISRAEL_REGIONS}
            placeholder="Select…"
          />
          <SelectField
            label="Employment type"
            value={form.employmentType}
            onChange={set('employmentType')}
            options={EMPLOYMENT_TYPES}
            placeholder="Select…"
          />
          <SelectField
            label="Seniority"
            value={form.seniority}
            onChange={set('seniority')}
            options={SENIORITY_LEVELS}
            placeholder="Select…"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <PrimaryButton onClick={handleSave} disabled={!hasChanges || isLoading}>
          {isLoading ? 'Saving…' : 'Save changes'}
        </PrimaryButton>
      </div>
    </div>
  );
}
