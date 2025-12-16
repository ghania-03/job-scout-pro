import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { JobTable } from '@/components/dashboard/JobTable';
import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bd-sidebar-collapsed') === 'true';
  });
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [lastRunTime, setLastRunTime] = useState<Date>(new Date());

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('bd-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Simulate bot running every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRunTime(new Date());
      // In a real app, this would fetch new jobs from the API
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Monitor AI-fetched jobs and manage proposals
              </p>
            </div>

            <MetricsCards />

            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Job Queue
                </h2>
              </div>
              <JobTable jobs={jobs} onJobUpdate={handleJobUpdate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
