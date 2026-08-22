'use client';

import Link from 'next/link';
import { pfx } from '@/app/(app)/settings/tokens';
import { PrimaryButton } from './buttons';
import { useCreditBalance } from '@/lib/hooks/useCredits';

export function BillingCard() {
  const { balance } = useCreditBalance();

  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: pfx.surface, border: `1px solid ${pfx.border}` }}>
      <p className="text-xs font-semibold uppercase tracking-[0.09em]" style={{ color: pfx.inkMuted }}>
        Billing &amp; credits
      </p>

      {balance ? (
        <>
          <p className="mt-2 text-[20px] font-bold" style={{ color: pfx.ink }}>
            {balance.total} credits available
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: pfx.inkSecondary }}>
            {balance.freeAvailable} of {balance.freeTotal} free · {balance.purchased} purchased. One credit sends a
            C.V. or posts a job — it is one shared balance.
          </p>
        </>
      ) : (
        <p className="mt-2 text-[13.5px]" style={{ color: pfx.inkSecondary }}>Loading balance…</p>
      )}

      <p className="mt-3 text-[12.5px]" style={{ color: pfx.inkMuted }}>
        Purchased credits are valid for 12 months. Your free credit resets every month, regardless of purchases.
      </p>

      <div className="mt-5 flex justify-end">
        <Link href="/credits">
          <PrimaryButton type="button">Buy credits</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
