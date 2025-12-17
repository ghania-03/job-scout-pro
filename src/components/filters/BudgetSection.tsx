import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface BudgetSectionProps {
  minBudget: number | null;
  maxBudget: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}

export function BudgetSection({
  minBudget,
  maxBudget,
  onMinChange,
  onMaxChange,
}: BudgetSectionProps) {
  const hasError = minBudget !== null && maxBudget !== null && minBudget > maxBudget;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-medium">Budget Rules</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Filter jobs based on budget.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-budget" className="text-sm font-medium">
              Minimum Budget (USD) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="min-budget"
                type="number"
                placeholder="500"
                value={minBudget ?? ''}
                onChange={(e) => onMinChange(e.target.value ? Number(e.target.value) : null)}
                className="pl-7"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-budget" className="text-sm font-medium">
              Maximum Budget (USD) <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="max-budget"
                type="number"
                placeholder="No limit"
                value={maxBudget ?? ''}
                onChange={(e) => onMaxChange(e.target.value ? Number(e.target.value) : null)}
                className="pl-7"
                min={0}
              />
            </div>
          </div>
        </div>

        {hasError && (
          <p className="text-sm text-destructive">
            Minimum budget must be less than or equal to maximum budget.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Jobs below the minimum budget will be ignored.
        </p>
      </CardContent>
    </Card>
  );
}
