'use client';

import { useCallback, useRef } from 'react';
import { cn, formatBytes } from '@/lib/utils';

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxBytes?: number;
  file?: File | null;
  error?: string;
}

export function FileDropzone({
  onFile,
  accept = 'application/pdf,.doc,.docx',
  maxBytes = 10 * 1024 * 1024,
  file,
  error,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFile(selected);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          file
            ? 'border-gold-300/50 bg-gold-300/5'
            : 'border-border-strong hover:border-gold-300/40 hover:bg-gold-300/5',
          error && 'border-crit/50',
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">📄</span>
            <p className="text-sm font-semibold text-text-primary">{file.name}</p>
            <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            <p className="text-xs text-gold-300 font-medium">Click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl opacity-50">📎</span>
            <p className="text-sm text-text-secondary">
              Drop your CV here, or <span className="text-gold-300 font-semibold">browse</span>
            </p>
            <p className="text-xs text-text-muted">PDF or Word · Max {formatBytes(maxBytes)}</p>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-crit">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
