import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { SWRProvider } from '@/components/SWRProvider';

export const metadata: Metadata = {
  title: 'DirectRef — Send your CV directly to a friend inside the company',
  description: 'Skip the black hole. Connect with friends at top companies, find open roles, and send your CV directly — no cold applications.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SWRProvider>
          {children}
        </SWRProvider>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-strong)',
              color: 'var(--color-text-primary)',
            },
          }}
        />
      </body>
    </html>
  );
}
