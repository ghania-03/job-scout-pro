import { RefreshCw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { AISettings } from '@/pages/AIPortfolio';

interface AISettingsSectionProps {
  settings: AISettings;
  onUpdate: (settings: AISettings) => void;
  onRegenerateAll: () => void;
  hasPortfolio: boolean;
}

export function AISettingsSection({
  settings,
  onUpdate,
  onRegenerateAll,
  hasPortfolio,
}: AISettingsSectionProps) {
  const { toast } = useToast();

  const handleLengthChange = (value: string) => {
    if (!value) return;
    const newSettings = { ...settings, proposalLength: value as AISettings['proposalLength'] };
    onUpdate(newSettings);
    toast({
      title: 'Settings updated',
      description: `Proposal length set to ${value}.`,
    });
  };

  const handleToneChange = (value: string) => {
    if (!value) return;
    const newSettings = { ...settings, proposalTone: value as AISettings['proposalTone'] };
    onUpdate(newSettings);
    toast({
      title: 'Settings updated',
      description: `Proposal tone set to ${value}.`,
    });
  };

  const handleRegenerateAll = () => {
    onRegenerateAll();
    toast({
      title: 'Proposals regenerated',
      description: 'All proposals have been updated with new settings.',
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg font-semibold">AI Proposal Settings</CardTitle>
            <CardDescription className="mt-1">
              Configure how AI generates proposals for matched jobs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Proposal Length */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Proposal Length</Label>
          <ToggleGroup
            type="single"
            value={settings.proposalLength}
            onValueChange={handleLengthChange}
            className="justify-start"
          >
            <ToggleGroupItem
              value="short"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Short
            </ToggleGroupItem>
            <ToggleGroupItem
              value="medium"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Medium
            </ToggleGroupItem>
            <ToggleGroupItem
              value="detailed"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Detailed
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">
            {settings.proposalLength === 'short' && 'Brief and concise proposals (~100-150 words)'}
            {settings.proposalLength === 'medium' && 'Balanced proposals with key details (~200-300 words)'}
            {settings.proposalLength === 'detailed' && 'Comprehensive proposals with full context (~400-500 words)'}
          </p>
        </div>

        {/* Proposal Tone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Proposal Tone</Label>
          <ToggleGroup
            type="single"
            value={settings.proposalTone}
            onValueChange={handleToneChange}
            className="justify-start"
          >
            <ToggleGroupItem
              value="formal"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Formal
            </ToggleGroupItem>
            <ToggleGroupItem
              value="neutral"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Neutral
            </ToggleGroupItem>
            <ToggleGroupItem
              value="friendly"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Friendly
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">
            {settings.proposalTone === 'formal' && 'Professional and corporate communication style'}
            {settings.proposalTone === 'neutral' && 'Balanced tone suitable for most clients'}
            {settings.proposalTone === 'friendly' && 'Warm and approachable communication style'}
          </p>
        </div>

        {/* Regenerate All Button */}
        <div className="pt-2 border-t border-border/50">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                disabled={!hasPortfolio}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate All Proposals
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate all proposals?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will regenerate all existing proposals using your current portfolio and settings.
                  Any manual edits to proposals will be overwritten.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerateAll}>
                  Regenerate All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {!hasPortfolio && (
            <p className="text-xs text-muted-foreground mt-2">
              Upload a portfolio first to regenerate proposals.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
