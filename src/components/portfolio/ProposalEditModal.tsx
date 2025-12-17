import { useState, useEffect } from 'react';
import { Copy, RefreshCw, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ProposalHistoryItem } from '@/pages/AIPortfolio';

interface ProposalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProposalHistoryItem | null;
  mode: 'view' | 'edit';
  onSave: (updatedProposal: string) => void;
  onCopy: () => void;
  onRegenerate: () => void;
}

export function ProposalEditModal({
  isOpen,
  onClose,
  proposal,
  mode,
  onSave,
  onCopy,
  onRegenerate,
}: ProposalEditModalProps) {
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (proposal) {
      setEditedContent(proposal.proposal);
      setIsEditing(mode === 'edit');
    }
  }, [proposal, mode]);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isEditing && proposal) {
      setEditedContent(proposal.proposal);
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  if (!proposal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">{proposal.jobTitle}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit your proposal below' : 'Review your AI-generated proposal'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 py-4">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] h-full resize-none text-sm"
              placeholder="Enter your proposal..."
            />
          ) : (
            <div className="h-full max-h-[400px] overflow-y-auto custom-scrollbar p-4 rounded-lg bg-muted/30 border border-border/50">
              <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">
                {proposal.proposal}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              {isEditing ? 'Cancel' : 'Close'}
            </Button>
            {isEditing && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={editedContent === proposal.proposal}
              >
                Save Changes
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
