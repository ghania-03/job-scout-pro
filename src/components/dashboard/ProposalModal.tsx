import { useState } from 'react';
import { X, Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/types/job';
import { cn } from '@/lib/utils';

interface ProposalModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: string) => void;
}

export function ProposalModal({ job, isOpen, onClose, onSave }: ProposalModalProps) {
  const [proposal, setProposal] = useState(job.proposal);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Simulate AI regeneration
    setTimeout(() => {
      setProposal(
        `[REGENERATED]\n\n${job.proposal}\n\nI am particularly excited about this opportunity because it aligns perfectly with my expertise and career goals.`
      );
      setIsRegenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-xl shadow-lg border border-border animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Proposal Preview</h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-md">{job.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <Textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            className="min-h-[300px] resize-none text-sm leading-relaxed"
            placeholder="Enter your proposal..."
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-status-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRegenerating && 'animate-spin')} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
