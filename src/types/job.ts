export type JobStatus = 'pending' | 'approved' | 'submitted' | 'skipped' | 'failed';

export interface Job {
  id: string;
  title: string;
  url: string;
  clientName: string;
  openProposalRatio: number;
  budget: string;
  budgetValue: number;
  proposal: string;
  postedTime: string;
  fetchedAt: Date;
  status: JobStatus;
  notes: string;
  location?: string;
  jobType?: string;
  skills?: string[];
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface FilterState {
  status: JobStatus[];
  openProposalRatio: { min: number; max: number } | null;
  budget: { min: number; max: number } | null;
}
