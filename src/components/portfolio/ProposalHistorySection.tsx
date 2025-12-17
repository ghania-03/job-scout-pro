import { useState } from 'react';
import { History, Eye, Edit3, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ProposalEditModal } from './ProposalEditModal';
import type { ProposalHistoryItem } from '@/pages/AIPortfolio';

interface ProposalHistorySectionProps {
  history: ProposalHistoryItem[];
  onProposalUpdate: (proposal: ProposalHistoryItem) => void;
}

export function ProposalHistorySection({
  history,
  onProposalUpdate,
}: ProposalHistorySectionProps) {
  const [selectedProposal, setSelectedProposal] = useState<ProposalHistoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleCopy = (proposal: string) => {
    navigator.clipboard.writeText(proposal);
    toast({
      title: 'Copied',
      description: 'Proposal copied to clipboard.',
    });
  };

  const handleRegenerate = (item: ProposalHistoryItem) => {
    const updated = {
      ...item,
      dateGenerated: new Date(),
      proposal: item.proposal + '\n\n[Regenerated]',
    };
    onProposalUpdate(updated);
    toast({
      title: 'Proposal regenerated',
      description: 'The proposal has been regenerated with current settings.',
    });
  };

  const openModal = (item: ProposalHistoryItem, mode: 'view' | 'edit') => {
    setSelectedProposal(item);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedProposal(null);
  };

  const handleSave = (updatedProposal: string) => {
    if (selectedProposal) {
      onProposalUpdate({
        ...selectedProposal,
        proposal: updatedProposal,
      });
      toast({
        title: 'Proposal saved',
        description: 'Your changes have been saved.',
      });
    }
    closeModal();
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-semibold">Proposal History</CardTitle>
              <CardDescription className="mt-1">
                View and manage AI-generated proposals for matched jobs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No proposals generated yet.</p>
              <p className="text-xs mt-1">
                Proposals will appear here as jobs are matched.
              </p>
            </div>
          ) : (
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold text-xs">Job Title</TableHead>
                    <TableHead className="font-semibold text-xs w-[140px]">Generated</TableHead>
                    <TableHead className="font-semibold text-xs">Proposal Preview</TableHead>
                    <TableHead className="font-semibold text-xs w-[160px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-medium">
                        <button
                          onClick={() => openModal(item, 'view')}
                          className="text-left hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {item.jobTitle}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.dateGenerated)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px]">
                        {truncateText(item.proposal.replace(/\n/g, ' '))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openModal(item, 'view')}
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openModal(item, 'edit')}
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRegenerate(item)}
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopy(item.proposal)}
                            title="Copy"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProposalEditModal
        isOpen={!!selectedProposal}
        onClose={closeModal}
        proposal={selectedProposal}
        mode={modalMode}
        onSave={handleSave}
        onCopy={() => selectedProposal && handleCopy(selectedProposal.proposal)}
        onRegenerate={() => selectedProposal && handleRegenerate(selectedProposal)}
      />
    </>
  );
}
