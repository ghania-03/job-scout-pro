import { cn } from '@/lib/utils';
import { JobStatus } from '@/types/job';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-pending' },
  approved: { label: 'Approved', className: 'status-success' },
  submitted: { label: 'Submitted', className: 'status-success' },
  skipped: { label: 'Skipped', className: 'status-neutral' },
  failed: { label: 'Failed', className: 'status-error' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
