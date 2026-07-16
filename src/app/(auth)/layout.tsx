import { AuthProvider } from '@/lib/context/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,101,232,0.15) 0%, transparent 70%), var(--color-page)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="text-4xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(160deg, #fff 0%, #C4B6FA 60%, #7B65E8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Refrd
          </div>
          <p className="text-sm text-text-muted">Send your CV directly to a friend inside the company</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
