export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Page not found</h1>
        <p className="text-text-secondary mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/feed" className="text-violet-300 hover:text-violet-400 font-medium">← Back to feed</a>
      </div>
    </div>
  );
}
