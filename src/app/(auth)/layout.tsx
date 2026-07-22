import { AuthProvider } from '@/lib/context/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,122,0.15) 0%, transparent 70%), #F2F2F2',
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,122,0.12)', border: '1px solid rgba(212,175,122,0.30)' }}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="6" width="5" height="36" rx="2" fill="#D4AF7A"/>
              <path d="M14 6 H24 Q34 6 34 17 Q34 28 24 28 H14" fill="none" stroke="#D4AF7A" strokeWidth="5" strokeLinejoin="round"/>
              <line x1="24" y1="28" x2="37" y2="42" stroke="#C8A060" strokeWidth="4.5" strokeLinecap="round"/>
              <polyline points="28,42 37,42 37,33" stroke="#C8A060" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          {/* Name + tagline */}
          <div className="text-center">
            <div className="text-3xl font-black tracking-tight leading-none mb-1">
              <span style={{ background: 'linear-gradient(160deg,#2C2C2C,#555555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Direct
              </span>
              <span style={{ background: 'linear-gradient(160deg,#F0D9A8,#D4AF7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ref
              </span>
            </div>
            <p className="text-xs text-text-muted">Find your next job</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm" style={{ borderColor: 'rgba(26,18,9,0.10)' }}>
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
