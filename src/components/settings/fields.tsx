'use client';

import { pfx } from '@/app/(app)/settings/tokens';

const inputClass =
  'w-full rounded-[10px] border px-3 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[oklch(0.72_0.13_85)]';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, id, className, ...props }: FieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-[12.5px] font-medium mb-1.5"
        style={{ color: pfx.inkSecondary }}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`${inputClass} ${className ?? ''}`}
        style={{ background: pfx.surface, borderColor: pfx.border, color: pfx.ink }}
        {...props}
      />
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({ label, id, options, placeholder, className, ...props }: SelectFieldProps) {
  const selectId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-[12.5px] font-medium mb-1.5"
        style={{ color: pfx.inkSecondary }}
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`${inputClass} ${className ?? ''}`}
        style={{ background: pfx.surface, borderColor: pfx.border, color: pfx.ink }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
