import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss } from 'lucide-react';

const jobSources = [
  { id: 'my-feed', label: 'My Feed', description: 'Personalized job recommendations' },
  { id: 'best-match', label: 'Best Match', description: 'Jobs matching your skills' },
  { id: 'most-recent', label: 'Most Recent', description: 'Newest job postings' },
  { id: 'saved-jobs', label: 'Saved Jobs', description: 'Jobs you have saved' },
  { id: 'us-only', label: 'US-Only Feed', description: 'Jobs from US clients only' },
];

interface JobSourcesSectionProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function JobSourcesSection({ selected, onChange }: JobSourcesSectionProps) {
  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        onChange(selected.filter(s => s !== id));
      }
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAll = () => onChange(jobSources.map(s => s.id));
  const deselectAll = () => onChange([selected[0] || jobSources[0].id]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-medium">Job Sources</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-7">
              Deselect All
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose which Upwork feeds the bot should scan.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobSources.map((source) => (
          <label
            key={source.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selected.includes(source.id)}
              onCheckedChange={() => handleToggle(source.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{source.label}</p>
              <p className="text-xs text-muted-foreground">{source.description}</p>
            </div>
          </label>
        ))}
        <p className="text-xs text-muted-foreground mt-2">
          At least one source must be selected.
        </p>
      </CardContent>
    </Card>
  );
}
