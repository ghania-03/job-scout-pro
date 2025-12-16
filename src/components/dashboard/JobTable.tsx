import { useState, useMemo, useEffect } from 'react';
import {
  ExternalLink,
  Eye,
  Download,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { Job, JobStatus, ColumnConfig, FilterState } from '@/types/job';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import { ColumnCustomizer } from './ColumnCustomizer';
import { StatusFilter, RangeFilter } from './ColumnFilter';
import { ProposalModal } from './ProposalModal';
import { JobCard } from './JobCard';
import { NotesPopup } from './NotesPopup';
import { ProposalRatioBar } from './ProposalRatioBar';
import { Pagination } from './Pagination';
import { formatRelativeTime } from '@/hooks/useRelativeTime';
import { cn } from '@/lib/utils';

const defaultColumns: ColumnConfig[] = [
  { id: 'title', label: 'Job Title', visible: true, sortable: true, width: 220 },
  { id: 'url', label: 'Job URL', visible: true, width: 80 },
  { id: 'clientName', label: 'Client Name', visible: true, sortable: true, width: 140 },
  { id: 'openProposalRatio', label: 'Open Proposal Ratio', visible: true, sortable: true, filterable: true, width: 150 },
  { id: 'budget', label: 'Budget', visible: true, sortable: true, filterable: true, width: 120 },
  { id: 'proposal', label: 'Proposal', visible: true, width: 200 },
  { id: 'postedTime', label: 'Time', visible: true, sortable: true, width: 90 },
  { id: 'status', label: 'Status', visible: true, filterable: true, width: 130 },
  { id: 'notes', label: 'Notes', visible: true, width: 180 },
  { id: 'location', label: 'Location', visible: false, width: 120 },
  { id: 'jobType', label: 'Job Type', visible: false, width: 100 },
];

const ITEMS_PER_PAGE = 10;

interface JobTableProps {
  jobs: Job[];
  onJobUpdate: (job: Job) => void;
}

export function JobTable({ jobs, onJobUpdate }: JobTableProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('bd-columns');
    return saved ? JSON.parse(saved) : defaultColumns;
  });
  const [viewMode, setViewMode] = useState<'table' | 'card'>(() => {
    return (localStorage.getItem('bd-view-mode') as 'table' | 'card') || 'table';
  });
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    openProposalRatio: null,
    budget: null,
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeKey, setTimeKey] = useState(0);

  // Update relative times every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeKey(k => k + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Persist column preferences
  useEffect(() => {
    localStorage.setItem('bd-columns', JSON.stringify(columns));
  }, [columns]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('bd-view-mode', viewMode);
  }, [viewMode]);

  const visibleColumns = columns.filter((col) => col.visible);

  // Filter and sort jobs with smart ordering
  const processedJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      if (filters.status.length > 0 && !filters.status.includes(job.status)) {
        return false;
      }
      if (filters.openProposalRatio) {
        if (
          job.openProposalRatio < filters.openProposalRatio.min ||
          job.openProposalRatio > filters.openProposalRatio.max
        ) {
          return false;
        }
      }
      if (filters.budget) {
        if (job.budgetValue < filters.budget.min || job.budgetValue > filters.budget.max) {
          return false;
        }
      }
      return true;
    });

    // Smart ordering: latest first, then by ratio/budget, failed jobs lower
    result.sort((a, b) => {
      // Failed jobs go to the bottom
      if (a.status === 'failed' && b.status !== 'failed') return 1;
      if (b.status === 'failed' && a.status !== 'failed') return -1;

      // Latest fetched first
      const timeDiff = b.fetchedAt.getTime() - a.fetchedAt.getTime();
      if (Math.abs(timeDiff) > 60000) return timeDiff; // More than 1 minute difference

      // Then by open proposal ratio
      if (b.openProposalRatio !== a.openProposalRatio) {
        return b.openProposalRatio - a.openProposalRatio;
      }

      // Then by budget
      return b.budgetValue - a.budgetValue;
    });

    return result;
  }, [jobs, filters]);

  // Pagination
  const totalPages = Math.ceil(processedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [processedJobs, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      onJobUpdate({ ...job, status });
    }
  };

  const handleNotesSave = (jobId: string, notes: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      onJobUpdate({ ...job, notes });
    }
  };

  const handleProposalSave = (proposal: string) => {
    if (selectedJob) {
      onJobUpdate({ ...selectedJob, proposal });
    }
  };

  const handleExportCSV = () => {
    const headers = visibleColumns.map((col) => col.label).join(',');
    const rows = processedJobs.map((job) =>
      visibleColumns
        .map((col) => {
          const value = col.id === 'postedTime' 
            ? formatRelativeTime(job.fetchedAt)
            : job[col.id as keyof Job];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const resetColumns = () => setColumns(defaultColumns);

  const ratioPresets = [
    { label: 'Greater than 70%', min: 70, max: Infinity },
    { label: '40% - 70%', min: 40, max: 70 },
    { label: 'Less than 40%', min: 0, max: 40 },
  ];

  const budgetPresets = [
    { label: 'Greater than $5,000', min: 5000, max: Infinity },
    { label: '$1,000 - $5,000', min: 1000, max: 5000 },
    { label: 'Less than $1,000', min: 0, max: 1000 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {processedJobs.length} jobs
          </span>
          {(filters.status.length > 0 || filters.openProposalRatio || filters.budget) && (
            <span className="text-xs text-muted-foreground">(filtered)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded-none h-7 px-2.5',
                viewMode === 'table' && 'bg-accent text-accent-foreground'
              )}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('card')}
              className={cn(
                'rounded-none h-7 px-2.5',
                viewMode === 'card' && 'bg-accent text-accent-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          <ColumnCustomizer columns={columns} onChange={setColumns} onReset={resetColumns} />

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8">
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onViewProposal={setSelectedJob}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full border-collapse min-w-max">
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted/50 backdrop-blur-sm">
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap"
                    style={{ minWidth: col.width }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.id === 'status' && (
                        <StatusFilter
                          value={filters.status}
                          onChange={(status) => setFilters((f) => ({ ...f, status }))}
                        />
                      )}
                      {col.id === 'openProposalRatio' && (
                        <RangeFilter
                          value={filters.openProposalRatio}
                          onChange={(range) => setFilters((f) => ({ ...f, openProposalRatio: range }))}
                          presets={ratioPresets}
                          suffix="%"
                        />
                      )}
                      {col.id === 'budget' && (
                        <RangeFilter
                          value={filters.budget}
                          onChange={(range) => setFilters((f) => ({ ...f, budget: range }))}
                          presets={budgetPresets}
                          suffix=""
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="group hover:bg-muted/30 transition-colors">
                  {visibleColumns.map((col) => (
                    <td
                      key={col.id}
                      className="px-3 py-2.5 text-sm border-b border-border/50"
                    >
                      {col.id === 'title' && (
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="font-medium text-foreground hover:text-primary transition-colors text-left line-clamp-2"
                        >
                          {job.title}
                        </button>
                      )}
                      {col.id === 'url' && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="text-xs">View</span>
                        </a>
                      )}
                      {col.id === 'clientName' && (
                        <span className="text-foreground">{job.clientName}</span>
                      )}
                      {col.id === 'openProposalRatio' && (
                        <ProposalRatioBar ratio={job.openProposalRatio} />
                      )}
                      {col.id === 'budget' && (
                        <span className="text-foreground font-medium">{job.budget}</span>
                      )}
                      {col.id === 'proposal' && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs truncate max-w-[140px]">
                            {job.proposal.slice(0, 50)}...
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      )}
                      {col.id === 'postedTime' && (
                        <span key={timeKey} className="text-muted-foreground whitespace-nowrap text-xs">
                          {formatRelativeTime(job.fetchedAt)}
                        </span>
                      )}
                      {col.id === 'status' && (
                        <Select
                          value={job.status}
                          onValueChange={(value) => handleStatusChange(job.id, value as JobStatus)}
                        >
                          <SelectTrigger className="w-[120px] h-7 border-0 bg-transparent p-0">
                            <SelectValue>
                              <StatusBadge status={job.status} />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {col.id === 'notes' && (
                        <NotesPopup
                          notes={job.notes}
                          onSave={(notes) => handleNotesSave(job.id, notes)}
                        />
                      )}
                      {col.id === 'location' && (
                        <span className="text-muted-foreground text-xs">{job.location || '-'}</span>
                      )}
                      {col.id === 'jobType' && (
                        <span className="text-muted-foreground text-xs">{job.jobType || '-'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {processedJobs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={processedJobs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Proposal Modal */}
      {selectedJob && (
        <ProposalModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleProposalSave}
        />
      )}
    </div>
  );
}
