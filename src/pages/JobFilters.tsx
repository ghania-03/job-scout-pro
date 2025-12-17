import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { JobSourcesSection } from '@/components/filters/JobSourcesSection';
import { KeywordsSection } from '@/components/filters/KeywordsSection';
import { GeographicSection } from '@/components/filters/GeographicSection';
import { BudgetSection } from '@/components/filters/BudgetSection';
import { AdvancedFiltersSection } from '@/components/filters/AdvancedFiltersSection';
import { FilterActions } from '@/components/filters/FilterActions';
import { useToast } from '@/hooks/use-toast';

export interface FilterState {
  jobSources: string[];
  keywords: string[];
  keywordLogic: 'all' | 'selected';
  excludedCountries: string[];
  minBudget: number | null;
  maxBudget: number | null;
  experienceLevel: string[];
  jobDuration: string[];
  contractType: string[];
  paymentType: string[];
}

const defaultFilters: FilterState = {
  jobSources: ['my-feed', 'best-match'],
  keywords: ['React', 'TypeScript', 'Node.js', 'Full Stack'],
  keywordLogic: 'all',
  excludedCountries: [],
  minBudget: 500,
  maxBudget: null,
  experienceLevel: [],
  jobDuration: [],
  contractType: [],
  paymentType: [],
};

export default function JobFilters() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [savedFilters, setSavedFilters] = useState<FilterState>(defaultFilters);
  const { toast } = useToast();

  const hasUnsavedChanges = JSON.stringify(filters) !== JSON.stringify(savedFilters);

  const handleApply = () => {
    setSavedFilters(filters);
    toast({
      title: "Filters Applied",
      description: "Your job filters have been saved and applied.",
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSavedFilters(defaultFilters);
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to defaults.",
    });
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">Job Filters</h1>
              <p className="text-sm text-muted-foreground">
                Define which Upwork jobs are allowed to enter the system.
              </p>
            </div>

            {/* Unsaved Changes Indicator */}
            {hasUnsavedChanges && (
              <div className="bg-status-pending/10 border border-status-pending/30 rounded-lg px-4 py-3">
                <p className="text-sm text-status-pending font-medium">
                  You have unsaved changes. Click "Apply Filters" to save.
                </p>
              </div>
            )}

            {/* Filter Sections */}
            <JobSourcesSection
              selected={filters.jobSources}
              onChange={(jobSources) => updateFilters({ jobSources })}
            />

            <KeywordsSection
              keywords={filters.keywords}
              logic={filters.keywordLogic}
              onKeywordsChange={(keywords) => updateFilters({ keywords })}
              onLogicChange={(keywordLogic) => updateFilters({ keywordLogic })}
            />

            <GeographicSection
              excludedCountries={filters.excludedCountries}
              onChange={(excludedCountries) => updateFilters({ excludedCountries })}
            />

            <BudgetSection
              minBudget={filters.minBudget}
              maxBudget={filters.maxBudget}
              onMinChange={(minBudget) => updateFilters({ minBudget })}
              onMaxChange={(maxBudget) => updateFilters({ maxBudget })}
            />

            <AdvancedFiltersSection
              experienceLevel={filters.experienceLevel}
              jobDuration={filters.jobDuration}
              contractType={filters.contractType}
              paymentType={filters.paymentType}
              onChange={updateFilters}
            />

            {/* Actions */}
            <FilterActions
              hasUnsavedChanges={hasUnsavedChanges}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
