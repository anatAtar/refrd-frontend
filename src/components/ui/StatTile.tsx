interface StatTileProps {
  label: string;
  value: string | number;
  icon?: string;
  delta?: string;
  accent?: boolean;
}

export function StatTile({ label, value, icon, delta, accent }: StatTileProps) {
  return (
    <div className={`bg-card rounded-xl border p-4 ${accent ? 'border-violet-500/30' : 'border-border'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-base">{icon}</span>}
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${accent ? 'text-violet-300' : 'text-text-primary'}`}>
        {value}
      </div>
      {delta && (
        <div className="text-xs font-semibold text-good">↑ {delta}</div>
      )}
    </div>
  );
}
