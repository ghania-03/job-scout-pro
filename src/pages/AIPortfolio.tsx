import { useState } from 'react';
import { PortfolioSection } from '@/components/portfolio/PortfolioSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Copy, RefreshCw, Sparkles, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  createdAt: Date;
}

export interface PortfolioData {
  fileName: string | null;
  fileType: string | null;
  content: string;
  lastUpdated: Date | null;
  items: PortfolioItem[];
}

const AIPortfolio = () => {
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('bd-portfolio');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null,
        items: parsed.items || [],
      };
    }
    return {
      fileName: null,
      fileType: null,
      content: '',
      lastUpdated: null,
      items: [],
    };
  });

  const [aiPrompt, setAiPrompt] = useState(() => {
    return localStorage.getItem('bd-ai-prompt') || 
      'Generate a professional proposal for this Upwork job. Use my portfolio experience to highlight relevant skills. Keep the tone professional and concise. Include specific examples from my past work that relate to the job requirements.';
  });

  const [chatbotModel, setChatbotModel] = useState(() => {
    return localStorage.getItem('bd-chatbot-model') || 'chatgpt';
  });

  const [previewProposal, setPreviewProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePortfolioUpdate = (newPortfolio: PortfolioData) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('bd-portfolio', JSON.stringify(newPortfolio));
  };

  const handleSavePrompt = () => {
    localStorage.setItem('bd-ai-prompt', aiPrompt);
    toast({
      title: 'Prompt Saved',
      description: 'Your AI proposal command has been saved.',
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    toast({
      title: 'Copied',
      description: 'Prompt copied to clipboard.',
    });
  };

  const handleGeneratePreview = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setPreviewProposal(
        `Dear Hiring Manager,\n\nI am excited to apply for this position. Based on my portfolio and experience, I believe I am an excellent fit for your project.\n\n${portfolio.content ? 'Drawing from my portfolio:\n' + portfolio.content.substring(0, 200) + '...\n\n' : ''}I would love to discuss how my skills align with your needs.\n\nBest regards`
      );
      setIsGenerating(false);
      toast({
        title: 'Preview Generated',
        description: 'Sample proposal generated based on your prompt.',
      });
    }, 1500);
  };

  const handleModelChange = (value: string) => {
    setChatbotModel(value);
    localStorage.setItem('bd-chatbot-model', value);
    toast({
      title: 'Model Updated',
      description: `AI model set to ${value === 'chatgpt' ? 'ChatGPT' : value}.`,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="mb-4">
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
            AI & Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your portfolio and configure AI proposal generation
          </p>
        </div>

        {/* Chatbot Model Selection - Minimal, at top */}
        <Card className="border-border">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium">AI Model</CardTitle>
              </div>
              <Select value={chatbotModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[160px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="gpt4" disabled>GPT-4 (Coming Soon)</SelectItem>
                  <SelectItem value="claude" disabled>Claude (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Portfolio Management */}
        <PortfolioSection
          portfolio={portfolio}
          onUpdate={handlePortfolioUpdate}
        />

        {/* AI Proposal Command Section */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-medium">AI Proposal Command</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              This prompt is used to generate job-specific proposals on the Dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt" className="text-sm font-medium">
                Prompt / Command
              </Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter your AI prompt for generating proposals..."
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleSavePrompt}>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopyPrompt}>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGeneratePreview}
                disabled={isGenerating}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Preview'}
              </Button>
            </div>

            {/* Preview Area */}
            {previewProposal && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Preview Output
                </Label>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {previewProposal}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPortfolio;
