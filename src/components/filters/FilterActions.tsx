import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw } from 'lucide-react';
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

interface FilterActionsProps {
  hasUnsavedChanges: boolean;
  onApply: () => void;
  onReset: () => void;
}

export function FilterActions({ hasUnsavedChanges, onApply, onReset }: FilterActionsProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-lg sticky bottom-4">
      <p className="text-sm text-muted-foreground">
        {hasUnsavedChanges
          ? 'You have unsaved changes'
          : 'All changes saved'}
      </p>

      <div className="flex items-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all filters?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all job filters to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>Reset Filters</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={onApply} className="gap-2">
          <Check className="w-4 h-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
