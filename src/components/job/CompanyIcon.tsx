'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn, companyLogoUrl } from '@/lib/utils';

interface CompanyIconProps {
  sourceUrl: string;
  size?: number;
  className?: string;
}

/** Company logo derived from the job's source domain, falling back to a
 *  generic building glyph if there's no logo for that domain (or the URL
 *  doesn't parse — e.g. a manually-entered posting with no real link). */
export function CompanyIcon({ sourceUrl, size = 44, className }: CompanyIconProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = !failed ? companyLogoUrl(sourceUrl) : null;

  return (
    <div
      className={cn(
        'rounded-xl bg-input border border-border flex items-center justify-center shrink-0 overflow-hidden',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-lg" style={{ fontSize: size * 0.45 }} role="img" aria-label="Company">🏢</span>
      )}
    </div>
  );
}
