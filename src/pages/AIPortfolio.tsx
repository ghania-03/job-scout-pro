import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { PortfolioSection } from '@/components/portfolio/PortfolioSection';
import { AISettingsSection } from '@/components/portfolio/AISettingsSection';
import { ProposalHistorySection } from '@/components/portfolio/ProposalHistorySection';

export interface PortfolioData {
  fileName: string | null;
  fileType: string | null;
  content: string;
  lastUpdated: Date | null;
}

export interface AISettings {
  proposalLength: 'short' | 'medium' | 'detailed';
  proposalTone: 'formal' | 'friendly' | 'neutral';
}

export interface ProposalHistoryItem {
  id: string;
  jobId: string;
  jobTitle: string;
  dateGenerated: Date;
  proposal: string;
}

const AIPortfolio = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bd-sidebar-collapsed') === 'true';
  });

  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('bd-portfolio');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null,
      };
    }
    return {
      fileName: null,
      fileType: null,
      content: '',
      lastUpdated: null,
    };
  });

  const [aiSettings, setAISettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('bd-ai-settings');
    if (saved) return JSON.parse(saved);
    return {
      proposalLength: 'medium',
      proposalTone: 'neutral',
    };
  });

  const [proposalHistory, setProposalHistory] = useState<ProposalHistoryItem[]>(() => {
    const saved = localStorage.getItem('bd-proposal-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        dateGenerated: new Date(item.dateGenerated),
      }));
    }
    // Mock data for demonstration
    return [
      {
        id: '1',
        jobId: 'job-1',
        jobTitle: 'React Developer for E-commerce Platform',
        dateGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        proposal: 'Dear Hiring Manager,\n\nI am excited to apply for the React Developer position. With over 5 years of experience building scalable e-commerce solutions, I am confident in my ability to deliver exceptional results for your project.\n\nKey highlights from my experience:\n• Built a high-traffic e-commerce platform handling 10K+ daily orders\n• Implemented advanced cart functionality with real-time inventory updates\n• Optimized performance resulting in 40% faster page loads\n\nI would love to discuss how my skills align with your needs.\n\nBest regards',
      },
      {
        id: '2',
        jobId: 'job-2',
        jobTitle: 'Full Stack Developer - SaaS Application',
        dateGenerated: new Date(Date.now() - 5 * 60 * 60 * 1000),
        proposal: 'Hello,\n\nI noticed your posting for a Full Stack Developer and believe my background makes me an excellent fit. I specialize in building SaaS applications with modern tech stacks.\n\nRecent accomplishments:\n• Developed a multi-tenant SaaS platform serving 500+ businesses\n• Implemented subscription billing with Stripe integration\n• Built real-time collaboration features using WebSockets\n\nLooking forward to contributing to your project.\n\nBest,',
      },
      {
        id: '3',
        jobId: 'job-3',
        jobTitle: 'Senior Frontend Engineer - Fintech Startup',
        dateGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        proposal: 'Hi there,\n\nYour fintech opportunity caught my attention. Having worked extensively in the financial technology space, I understand the unique challenges of building secure, compliant applications.\n\nRelevant experience:\n• Led frontend development for a trading platform with 50K+ users\n• Implemented real-time data visualization dashboards\n• Ensured PCI-DSS compliance in payment interfaces\n\nI am eager to bring my expertise to your team.\n\nRegards',
      },
    ];
  });

  const handlePortfolioUpdate = (newPortfolio: PortfolioData) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('bd-portfolio', JSON.stringify(newPortfolio));
  };

  const handleSettingsUpdate = (newSettings: AISettings) => {
    setAISettings(newSettings);
    localStorage.setItem('bd-ai-settings', JSON.stringify(newSettings));
  };

  const handleProposalUpdate = (updatedProposal: ProposalHistoryItem) => {
    const updated = proposalHistory.map((p) =>
      p.id === updatedProposal.id ? updatedProposal : p
    );
    setProposalHistory(updated);
    localStorage.setItem('bd-proposal-history', JSON.stringify(updated));
  };

  const handleRegenerateAll = () => {
    // Simulate regenerating all proposals
    const updated = proposalHistory.map((p) => ({
      ...p,
      dateGenerated: new Date(),
      proposal: p.proposal + '\n\n[Regenerated with updated portfolio and settings]',
    }));
    setProposalHistory(updated);
    localStorage.setItem('bd-proposal-history', JSON.stringify(updated));
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
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
                AI & Portfolio
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your portfolio and configure AI proposal generation settings
              </p>
            </div>

            <PortfolioSection
              portfolio={portfolio}
              onUpdate={handlePortfolioUpdate}
            />

            <AISettingsSection
              settings={aiSettings}
              onUpdate={handleSettingsUpdate}
              onRegenerateAll={handleRegenerateAll}
              hasPortfolio={!!portfolio.content}
            />

            <ProposalHistorySection
              history={proposalHistory}
              onProposalUpdate={handleProposalUpdate}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIPortfolio;
