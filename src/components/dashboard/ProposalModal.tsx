import { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, Check, FileText, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/types/job';
import { cn } from '@/lib/utils';

interface ProposalModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: string, questions?: { question: string; answer: string }[]) => void;
}

export function ProposalModal({ job, isOpen, onClose, onSave }: ProposalModalProps) {
  const [proposal, setProposal] = useState(job.proposal);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Get saved AI prompt from localStorage
  const [savedPrompt] = useState(() => {
    const saved = localStorage.getItem('bd-ai-prompt');
    return saved || 'Generate a professional proposal based on my portfolio and the job requirements.';
  });

  // Mock job questions - in real app these would come from the job data
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([
    { question: 'Why are you the best fit for this project?', answer: '' },
    { question: 'What is your estimated timeline?', answer: '' },
  ]);

  useEffect(() => {
    if (isOpen) {
      setProposal(job.proposal);
    }
  }, [isOpen, job.proposal]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Simulate AI regeneration using saved prompt + portfolio + job specifics
    setTimeout(() => {
      setProposal(
        `[REGENERATED using your AI prompt]\n\n${job.proposal}\n\nI am particularly excited about this opportunity because it aligns perfectly with my expertise and career goals.`
      );
      setIsRegenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave(proposal, questions);
    onClose();
  };

  const updateQuestionAnswer = (index: number, answer: string) => {
    setQuestions(prev => 
      prev.map((q, i) => i === index ? { ...q, answer } : q)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-xl shadow-lg border border-border animate-fade-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Proposal Details</h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-lg">{job.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Section 1: Command/Prompt */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">AI Prompt (from AI & Portfolio Page)</Label>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {savedPrompt}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 italic">
                Edit this prompt in the AI & Portfolio page
              </p>
            </div>
          </div>

          <Separator />

          {/* Section 2: Generated Proposal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">Generated Proposal</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-status-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
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
                  <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', isRegenerating && 'animate-spin')} />
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
              </div>
            </div>
            <Textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="min-h-[200px] resize-none text-sm leading-relaxed"
              placeholder="Enter your proposal..."
            />
            <p className="text-xs text-muted-foreground">
              Edits here are job-specific and won't affect your AI & Portfolio settings.
            </p>
          </div>

          <Separator />

          {/* Section 3: Optional Questions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">Optional Questions</Label>
              <span className="text-xs text-muted-foreground">(if required by job post)</span>
            </div>
            
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm text-muted-foreground">{q.question}</Label>
                    <Input
                      value={q.answer}
                      onChange={(e) => updateQuestionAnswer(index, e.target.value)}
                      placeholder="Enter your answer..."
                      className="h-9"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No questions required for this job.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
