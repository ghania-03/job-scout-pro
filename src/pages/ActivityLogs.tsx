import { mockJobs } from '@/data/mockJobs';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ProposalRatioBar } from '@/components/dashboard/ProposalRatioBar';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ActivityLogs = () => {
  // Filter jobs from the past week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyJobs = mockJobs.filter(job => job.fetchedAt >= oneWeekAgo);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-4">
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
            Activity Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly job history from Dashboard
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium">Job Title</TableHead>
                  <TableHead className="font-medium">Client</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Budget</TableHead>
                  <TableHead className="font-medium">Proposal Ratio</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No activity logs for the past week
                    </TableCell>
                  </TableRow>
                ) : (
                  weeklyJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                            {job.title}
                          </span>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {job.clientName}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {job.budget}
                      </TableCell>
                      <TableCell>
                        <ProposalRatioBar ratio={job.openProposalRatio} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(job.fetchedAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[150px]">
                        <span className="line-clamp-2">{job.notes || '—'}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
