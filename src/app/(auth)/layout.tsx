import { AuthProvider } from '@/lib/context/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,122,0.10) 0%, transparent 70%), var(--color-page)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-4xl font-black tracking-tight mb-2">
            <span style={{ background: 'linear-gradient(160deg,#FAFAFA,#E8E8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Direct
            </span>
            <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ref
            </span>
          </div>
          <p className="text-sm text-text-muted">Your CV, direct to the right person</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
