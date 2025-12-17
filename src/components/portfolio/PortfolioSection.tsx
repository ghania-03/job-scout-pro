import { useRef, useState } from 'react';
import { Upload, FileText, RefreshCw, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { PortfolioData } from '@/pages/AIPortfolio';

interface PortfolioSectionProps {
  portfolio: PortfolioData;
  onUpdate: (portfolio: PortfolioData) => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function PortfolioSection({ portfolio, onUpdate }: PortfolioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState(portfolio.content);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, DOCX, or TXT file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file processing (in real app, would parse PDF/DOCX)
      const content = await readFileContent(file);
      
      onUpdate({
        ...portfolio,
        fileName: file.name,
        fileType: file.type,
        content,
        lastUpdated: new Date(),
      });

      toast({
        title: 'Portfolio uploaded',
        description: 'Your portfolio has been updated successfully.',
      });
    } catch {
      toast({
        title: 'Upload failed',
        description: 'Failed to process the file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(file);
      } else {
        // Simulate extracted content for PDF/DOCX
        setTimeout(() => {
          resolve(
            `Portfolio content extracted from ${file.name}\n\n` +
            'Professional Summary:\n' +
            'Experienced developer with expertise in modern web technologies.\n\n' +
            'Key Skills:\n' +
            '• React, TypeScript, Node.js\n' +
            '• Cloud services (AWS, GCP)\n' +
            '• Database design and optimization\n\n' +
            'Notable Projects:\n' +
            '• E-commerce platform with 100K+ users\n' +
            '• Real-time collaboration tools\n' +
            '• Enterprise dashboard systems'
          );
        }, 1000);
      }
    });
  };

  const handleTextSave = () => {
    if (!textInput.trim()) {
      toast({
        title: 'Empty content',
        description: 'Please enter your portfolio content.',
        variant: 'destructive',
      });
      return;
    }

    onUpdate({
      ...portfolio,
      fileName: null,
      fileType: 'text/plain',
      content: textInput,
      lastUpdated: new Date(),
    });

    toast({
      title: 'Portfolio saved',
      description: 'Your portfolio text has been saved successfully.',
    });
  };

  const handleReset = () => {
    onUpdate({
      ...portfolio,
      fileName: null,
      fileType: null,
      content: '',
      lastUpdated: null,
    });
    setTextInput('');
    toast({
      title: 'Portfolio reset',
      description: 'Your portfolio has been cleared.',
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Portfolio Management</CardTitle>
            <CardDescription className="mt-1">
              Upload or paste your portfolio content for AI proposal generation
            </CardDescription>
          </div>
          {portfolio.content && (
            <Badge variant="outline" className="gap-1.5 text-status-approved border-status-approved/30 bg-status-approved/10">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {portfolio.content ? 'Replace File' : 'Upload File'}
          </Button>
          
          {portfolio.content && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <AlertCircle className="h-3 w-3" />
          Accepts PDF, DOCX, or TXT files (max 5MB)
        </p>

        {/* Current Portfolio Status */}
        {portfolio.content && portfolio.fileName && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
            <FileText className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{portfolio.fileName}</p>
              {portfolio.lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {formatDate(portfolio.lastUpdated)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Text Input Alternative */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Or paste your portfolio content
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your professional summary, skills, experience, and notable projects..."
            className="min-h-[160px] resize-y text-sm"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {textInput.length} characters
            </p>
            <Button
              size="sm"
              onClick={handleTextSave}
              disabled={!textInput.trim() || textInput === portfolio.content}
            >
              Save Text
            </Button>
          </div>
        </div>

        {/* Portfolio Preview */}
        {portfolio.content && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Portfolio Preview
            </label>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 max-h-[200px] overflow-y-auto custom-scrollbar">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                {portfolio.content}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
