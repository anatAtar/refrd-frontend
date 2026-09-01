'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

/** Flat, dark tooltip for supplementary info (e.g. what a status badge means).
 *  Shows on hover and keyboard focus — wrap the trigger element with
 *  `tabIndex={0}` if it isn't already focusable. */
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={0}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            'z-50 max-w-[260px] rounded-[8px] bg-sidebar px-3.5 py-2.5 text-center text-xs text-sidebar-foreground animate-in fade-in-0',
            className,
          )}
          style={{ lineHeight: 1.45 }}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-sidebar" width={10} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
