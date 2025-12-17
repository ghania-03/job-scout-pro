import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { JobTable } from '@/components/dashboard/JobTable';
import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';

export default function JobQueue() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const handleJobUpdate = (updatedJob: Job) => {
    setJobs(prev =>
      prev.map(job => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">Job Queue</h1>
              <p className="text-sm text-muted-foreground">
                Review and manage AI-fetched jobs. Bot runs automatically every 30 seconds.
              </p>
            </div>
            
            <div className="flex-1 min-h-0">
              <JobTable jobs={jobs} onJobUpdate={handleJobUpdate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
