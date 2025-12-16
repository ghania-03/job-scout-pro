import { useState, useMemo } from 'react';
import {
  ExternalLink,
  Eye,
  Download,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { Job, JobStatus, ColumnConfig, FilterState } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';

const defaultColumns: ColumnConfig[] = [
  { id: 'title', label: 'Job Title', visible: true, sortable: true },
  { id: 'url', label: 'Job URL', visible: true },
  { id: 'clientName', label: 'Client Name', visible: true, sortable: true },
  { id: 'openProposalRatio', label: 'Open Proposal Ratio', visible: true, sortable: true, filterable: true },
  { id: 'budget', label: 'Budget', visible: true, sortable: true, filterable: true },
  { id: 'proposal', label: 'Proposal', visible: true },
  { id: 'postedTime', label: 'Time', visible: true, sortable: true },
  { id: 'status', label: 'Status', visible: true, filterable: true },
  { id: 'notes', label: 'Notes', visible: true },
  { id: 'location', label: 'Location', visible: false },
  { id: 'jobType', label: 'Job Type', visible: false },
];

interface JobTableProps {
  jobs: Job[];
  onJobUpdate: (job: Job) => void;
}

export function JobTable({ jobs, onJobUpdate }: JobTableProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    openProposalRatio: null,
    budget: null,
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  const visibleColumns = columns.filter((col) => col.visible);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(job.status)) {
        return false;
      }
      // Open proposal ratio filter
      if (filters.openProposalRatio) {
        if (
          job.openProposalRatio < filters.openProposalRatio.min ||
          job.openProposalRatio > filters.openProposalRatio.max
        ) {
          return false;
        }
      }
      // Budget filter
      if (filters.budget) {
        if (job.budgetValue < filters.budget.min || job.budgetValue > filters.budget.max) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, filters]);

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      onJobUpdate({ ...job, status });
    }
  };

  const handleNotesChange = (jobId: string, notes: string) => {
    setEditingNotes((prev) => ({ ...prev, [jobId]: notes }));
  };

  const handleNotesSave = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job && editingNotes[jobId] !== undefined) {
      onJobUpdate({ ...job, notes: editingNotes[jobId] });
    }
  };

  const handleProposalSave = (proposal: string) => {
    if (selectedJob) {
      onJobUpdate({ ...selectedJob, proposal });
    }
  };

  const handleExportCSV = () => {
    const headers = visibleColumns.map((col) => col.label).join(',');
    const rows = filteredJobs.map((job) =>
      visibleColumns
        .map((col) => {
          const value = job[col.id as keyof Job];
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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {filteredJobs.length} jobs
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
                'rounded-none h-8 px-3',
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
                'rounded-none h-8 px-3',
                viewMode === 'card' && 'bg-accent text-accent-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          <ColumnCustomizer columns={columns} onChange={setColumns} onReset={resetColumns} />

          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onViewProposal={setSelectedJob}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                {visibleColumns.map((col) => (
                  <th key={col.id} className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="group">
                  {visibleColumns.map((col) => (
                    <td key={col.id}>
                      {col.id === 'title' && (
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="font-medium text-foreground hover:text-primary transition-colors text-left"
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
                          <span className="text-sm">View</span>
                        </a>
                      )}
                      {col.id === 'clientName' && (
                        <span className="text-foreground">{job.clientName}</span>
                      )}
                      {col.id === 'openProposalRatio' && (
                        <span
                          className={cn(
                            'font-medium',
                            job.openProposalRatio >= 70
                              ? 'text-status-success'
                              : job.openProposalRatio >= 40
                              ? 'text-status-warning'
                              : 'text-status-error'
                          )}
                        >
                          {job.openProposalRatio}%
                        </span>
                      )}
                      {col.id === 'budget' && (
                        <span className="text-foreground">{job.budget}</span>
                      )}
                      {col.id === 'proposal' && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm truncate max-w-[200px]">
                            {job.proposal.slice(0, 60)}...
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                        </div>
                      )}
                      {col.id === 'postedTime' && (
                        <span className="text-muted-foreground whitespace-nowrap">
                          {job.postedTime}
                        </span>
                      )}
                      {col.id === 'status' && (
                        <Select
                          value={job.status}
                          onValueChange={(value) => handleStatusChange(job.id, value as JobStatus)}
                        >
                          <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent p-0">
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
                        <Input
                          value={editingNotes[job.id] ?? job.notes}
                          onChange={(e) => handleNotesChange(job.id, e.target.value)}
                          onBlur={() => handleNotesSave(job.id)}
                          placeholder="Add notes..."
                          className="h-8 text-sm border-0 bg-transparent focus:bg-background focus:border-border"
                        />
                      )}
                      {col.id === 'location' && (
                        <span className="text-muted-foreground">{job.location || '-'}</span>
                      )}
                      {col.id === 'jobType' && (
                        <span className="text-muted-foreground">{job.jobType || '-'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
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
