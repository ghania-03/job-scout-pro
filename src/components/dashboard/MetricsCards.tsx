import { useState } from 'react';
import {
  Activity,
  Clock,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  subtitle?: string;
}

function MetricCard({ icon: Icon, label, value, status = 'neutral', subtitle }: MetricCardProps) {
  const statusStyles = {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    neutral: 'status-neutral',
  };

  const iconBgStyles = {
    success: 'bg-status-success-bg',
    warning: 'bg-status-warning-bg',
    error: 'bg-status-error-bg',
    neutral: 'bg-muted',
  };

  const iconColorStyles = {
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-lg', iconBgStyles[status])}>
          <Icon className={cn('w-5 h-5', iconColorStyles[status])} />
        </div>
        {status !== 'neutral' && (
          <span className={cn('status-badge', statusStyles[status])}>
            {status === 'success' && 'Healthy'}
            {status === 'warning' && 'Warning'}
            {status === 'error' && 'Error'}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function MetricsCards() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const metrics: MetricCardProps[] = [
    {
      icon: Activity,
      label: 'Bot Status',
      value: 'Running',
      status: 'success',
      subtitle: 'All systems operational',
    },
    {
      icon: Clock,
      label: 'Last Run',
      value: '5 min ago',
      status: 'success',
      subtitle: 'Dec 16, 2025 at 2:35 PM',
    },
    {
      icon: Download,
      label: 'Jobs Fetched Today',
      value: 47,
      status: 'neutral',
      subtitle: '+12 from yesterday',
    },
    {
      icon: CheckCircle,
      label: 'Jobs Matched',
      value: 23,
      status: 'neutral',
      subtitle: '49% qualification rate',
    },
    {
      icon: AlertCircle,
      label: 'Pending Review',
      value: 8,
      status: 'warning',
      subtitle: 'Requires attention',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          System Status
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show
            </>
          ) : (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide
            </>
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}
    </div>
  );
}
