import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Job, JobStatus } from '@/types/job';
import { StatusBadge } from './StatusBadge';
import { ProposalRatioBar } from './ProposalRatioBar';
import { Button } from '@/components/ui/button';
import { useRelativeTime } from '@/hooks/useRelativeTime';

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onViewProposal: (job: Job) => void;
}

export function JobCard({ job, onStatusChange, onViewProposal }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const relativeTime = useRelativeTime(job.fetchedAt);

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{job.clientName}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <div>
          <span className="text-muted-foreground">Budget:</span>
          <span className="ml-1 font-medium text-foreground">{job.budget}</span>
        </div>
        <ProposalRatioBar ratio={job.openProposalRatio} />
        <div className="text-muted-foreground text-xs">{relativeTime}</div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <p className="text-sm text-muted-foreground line-clamp-3">{job.proposal}</p>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => onViewProposal(job)}>
              View Full Proposal
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open Job
              </a>
            </Button>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-3 text-muted-foreground"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Show More
          </>
        )}
      </Button>
    </div>
  );
}
