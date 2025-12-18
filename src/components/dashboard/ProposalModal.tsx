import { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, Check, MessageSquare, HelpCircle, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Job } from '@/types/job';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface JobQuestion {
  id: string;
  question: string;
  answer: string;
}

interface ProposalModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: string) => void;
}

export function ProposalModal({ job, isOpen, onClose, onSave }: ProposalModalProps) {
  // Get global prompt from AI & Portfolio page (localStorage)
  const globalPrompt = localStorage.getItem('bd-ai-prompt') || 
    'Generate a professional proposal for this Upwork job. Use my portfolio experience to highlight relevant skills. Keep the tone professional and concise. Include specific examples from my past work that relate to the job requirements.';
  
  // Job-specific prompt (initialized from global, but changes here don't affect global)
  const [jobPrompt, setJobPrompt] = useState(globalPrompt);
  const [proposal, setProposal] = useState(job.proposal);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<JobQuestion[]>([]);

  // Simulate fetching and auto-answering questions from job post
  useEffect(() => {
    if (isOpen) {
      setIsLoadingQuestions(true);
      // Simulate API call to fetch questions from job post
      setTimeout(() => {
        // Mock questions that might come from a job post
        const mockQuestions: JobQuestion[] = job.title.toLowerCase().includes('react') || job.title.toLowerCase().includes('frontend')
          ? [
              {
                id: '1',
                question: 'Do you have experience with React and TypeScript?',
                answer: 'Yes, I have 5+ years of experience building production applications with React and TypeScript. I have worked on multiple enterprise-scale projects using these technologies.',
              },
              {
                id: '2',
                question: 'What is your availability for this project?',
                answer: 'I am available to start immediately and can dedicate 40+ hours per week to this project. I am flexible with meeting times across different time zones.',
              },
              {
                id: '3',
                question: 'Can you provide examples of similar work?',
                answer: 'Absolutely! I have completed several similar projects which I have detailed in my portfolio. I can share specific case studies and live demos during our initial call.',
              },
            ]
          : [];
        setQuestions(mockQuestions);
        setIsLoadingQuestions(false);
      }, 1000);
    }
  }, [isOpen, job.title]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Get portfolio data
    const portfolioData = localStorage.getItem('bd-portfolio');
    const portfolio = portfolioData ? JSON.parse(portfolioData) : null;
    
    // Simulate AI regeneration using job-specific prompt, portfolio, job details, and questions
    setTimeout(() => {
      const questionsContext = questions.length > 0 
        ? `\n\nRegarding your questions:\n${questions.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}`
        : '';
      
      const portfolioContext = portfolio?.content 
        ? `\n\nBased on my portfolio experience: ${portfolio.content.substring(0, 200)}...`
        : '';

      setProposal(
        `Dear Hiring Manager,\n\nI am excited to apply for "${job.title}". ${portfolioContext}\n\nI believe my skills and experience make me an excellent fit for this project.${questionsContext}\n\nI look forward to discussing this opportunity with you.\n\nBest regards`
      );
      setIsRegenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave(proposal);
    onClose();
  };

  const updateQuestionAnswer = (questionId: string, newAnswer: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, answer: newAnswer } : q)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-xl shadow-lg border border-border animate-fade-in overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Proposal Preview</h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-md">{job.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Accordion type="multiple" defaultValue={['prompt', 'questions', 'proposal']} className="px-6 py-4">
            {/* 1. Job-Specific Prompt */}
            <AccordionItem value="prompt" className="border-border">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">Prompt</span>
                  <span className="text-xs text-muted-foreground ml-2">(Job-specific, editable)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground">
                    This prompt is pre-filled from AI & Portfolio settings. Edits here only affect this job.
                  </p>
                  <Textarea
                    value={jobPrompt}
                    onChange={(e) => setJobPrompt(e.target.value)}
                    className="min-h-[100px] resize-none text-sm"
                    placeholder="Enter your prompt for generating proposals..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Questions (Auto-Fetched & Auto-Answered) */}
            <AccordionItem value="questions" className="border-border">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span className="font-medium">Questions</span>
                  {questions.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {questions.length} auto-answered
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Questions are auto-fetched from the job post and answered using your portfolio and prompt.
                  </p>
                  {isLoadingQuestions ? (
                    <div className="flex items-center gap-2 py-4 text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Fetching and answering questions...</span>
                    </div>
                  ) : questions.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4">
                      No questions found in this job post.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={q.id} className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                          <Label className="text-sm font-medium">
                            Q{index + 1}: {q.question}
                          </Label>
                          <Textarea
                            value={q.answer}
                            onChange={(e) => updateQuestionAnswer(q.id, e.target.value)}
                            className="min-h-[80px] resize-none text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Final Proposal */}
            <AccordionItem value="proposal" className="border-border">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium">Final Proposal</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Generated using your prompt, portfolio, job details, and answered questions.
                  </p>
                  <Textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="min-h-[250px] resize-none text-sm leading-relaxed"
                    placeholder="Enter your proposal..."
                  />
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
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