import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const experienceLevels = [
  { id: 'entry', label: 'Entry Level' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'expert', label: 'Expert' },
];

const jobDurations = [
  { id: 'less-than-month', label: 'Less than 1 month' },
  { id: '1-3-months', label: '1-3 months' },
  { id: '3-6-months', label: '3-6 months' },
  { id: 'more-than-6-months', label: 'More than 6 months' },
];

const contractTypes = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'fixed-price', label: 'Fixed Price' },
];

const paymentTypes = [
  { id: 'verified', label: 'Payment Verified' },
  { id: 'unverified', label: 'Payment Unverified' },
];

interface AdvancedFiltersSectionProps {
  experienceLevel: string[];
  jobDuration: string[];
  contractType: string[];
  paymentType: string[];
  onChange: (updates: {
    experienceLevel?: string[];
    jobDuration?: string[];
    contractType?: string[];
    paymentType?: string[];
  }) => void;
}

export function AdvancedFiltersSection({
  experienceLevel,
  jobDuration,
  contractType,
  paymentType,
  onChange,
}: AdvancedFiltersSectionProps) {
  const [open, setOpen] = useState(false);

  const toggleItem = (
    key: 'experienceLevel' | 'jobDuration' | 'contractType' | 'paymentType',
    current: string[],
    id: string
  ) => {
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    onChange({ [key]: updated });
  };

  const hasFilters =
    experienceLevel.length > 0 ||
    jobDuration.length > 0 ||
    contractType.length > 0 ||
    paymentType.length > 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-medium">Advanced Filters</CardTitle>
                {hasFilters && !open && (
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {experienceLevel.length + jobDuration.length + contractType.length + paymentType.length} active
                  </span>
                )}
              </div>
              {open ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Optional fine-tuning filters. Click to {open ? 'collapse' : 'expand'}.
            </p>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Experience Level */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Experience Level</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {experienceLevels.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-accent/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={experienceLevel.includes(item.id)}
                      onCheckedChange={() => toggleItem('experienceLevel', experienceLevel, item.id)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Duration */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Job Duration</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {jobDurations.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-accent/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={jobDuration.includes(item.id)}
                      onCheckedChange={() => toggleItem('jobDuration', jobDuration, item.id)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contract Type */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Contract Type</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contractTypes.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-accent/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={contractType.includes(item.id)}
                      onCheckedChange={() => toggleItem('contractType', contractType, item.id)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Type */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Payment Verification</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paymentTypes.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-accent/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={paymentType.includes(item.id)}
                      onCheckedChange={() => toggleItem('paymentType', paymentType, item.id)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
