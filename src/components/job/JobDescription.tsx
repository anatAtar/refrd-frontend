import { parseJobDescription } from '@/lib/jobDescription';

export function JobDescription({ description }: { description: string }) {
  const blocks = parseJobDescription(description);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h3 key={i} className="text-[15px] font-bold text-text-primary pt-1">
              {block.text}
            </h3>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-muted shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
