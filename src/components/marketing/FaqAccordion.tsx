'use client';

import { useState } from 'react';
import { mkt } from '@/app/(marketing)/tokens';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className="rounded-2xl px-6 cursor-pointer"
            style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}` }}
            onClick={() => setOpenIndex(open ? null : i)}
          >
            <div className="flex items-center justify-between py-4.5">
              <h3 className="text-[16.5px] font-semibold" style={{ color: mkt.textPrimary }}>{item.q}</h3>
              <span
                className="text-xl transition-transform duration-200"
                style={{ color: mkt.textMuted, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </div>
            {open && (
              <p className="text-[15px] leading-relaxed pb-5" style={{ color: mkt.textSecondary }}>
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
