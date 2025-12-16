import { cn } from '@/lib/utils';

interface ProposalRatioBarProps {
  ratio: number;
}

export function ProposalRatioBar({ ratio }: ProposalRatioBarProps) {
  const getColorClass = () => {
    if (ratio >= 70) return 'bg-status-success';
    if (ratio >= 40) return 'bg-status-warning';
    return 'bg-status-error';
  };

  const getTextColorClass = () => {
    if (ratio >= 70) return 'text-status-success';
    if (ratio >= 40) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <span className={cn('font-medium text-sm tabular-nums w-10', getTextColorClass())}>
        {ratio}%
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[60px]">
        <div
          className={cn('h-full rounded-full transition-all duration-300', getColorClass())}
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
    </div>
  );
}
