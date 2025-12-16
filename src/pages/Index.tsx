import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { JobTable } from '@/components/dashboard/JobTable';
import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const handleJobUpdate = (updatedJob: Job) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor AI-fetched jobs and manage proposals
              </p>
            </div>

            <MetricsCards />

            <div className="mt-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Job Queue
              </h2>
              <JobTable jobs={jobs} onJobUpdate={handleJobUpdate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
