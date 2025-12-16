import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { JobStatus } from '@/types/job';

interface StatusFilterProps {
  value: JobStatus[];
  onChange: (value: JobStatus[]) => void;
  className?: string;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'failed', label: 'Failed' },
];

export function StatusFilter({ value, onChange, className }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStatus = (status: JobStatus) => {
    if (value.includes(status)) {
      onChange(value.filter((s) => s !== status));
    } else {
      onChange([...value, status]);
    }
  };

  const clearFilter = () => onChange([]);

  return (
    <div className={cn('relative', className)} ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('h-6 px-2 text-xs font-normal', value.length > 0 && 'text-primary')}
      >
        {value.length > 0 ? `${value.length} selected` : 'Filter'}
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-2">
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="w-full justify-start h-7 px-2 text-xs text-muted-foreground mb-1"
              >
                <X className="w-3 h-3 mr-1" />
                Clear filter
              </Button>
            )}
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 cursor-pointer"
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => toggleStatus(option.value)}
                  className="h-3.5 w-3.5"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RangeFilterProps {
  value: { min: number; max: number } | null;
  onChange: (value: { min: number; max: number } | null) => void;
  presets?: { label: string; min: number; max: number }[];
  suffix?: string;
  className?: string;
}

export function RangeFilter({ value, onChange, presets = [], suffix = '', className }: RangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [min, setMin] = useState(value?.min?.toString() || '');
  const [max, setMax] = useState(value?.max?.toString() || '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyFilter = () => {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    if (!isNaN(minVal) || !isNaN(maxVal)) {
      onChange({
        min: isNaN(minVal) ? 0 : minVal,
        max: isNaN(maxVal) ? Infinity : maxVal,
      });
    }
    setIsOpen(false);
  };

  const selectPreset = (preset: { min: number; max: number }) => {
    setMin(preset.min.toString());
    setMax(preset.max === Infinity ? '' : preset.max.toString());
    onChange(preset);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setMin('');
    setMax('');
    onChange(null);
  };

  return (
    <div className={cn('relative', className)} ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('h-6 px-2 text-xs font-normal', value && 'text-primary')}
      >
        {value ? `${value.min}${suffix} - ${value.max === Infinity ? '∞' : value.max + suffix}` : 'Filter'}
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-3 space-y-3">
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="w-full justify-start h-7 px-2 text-xs text-muted-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Clear filter
              </Button>
            )}
            
            {presets.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Presets</p>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => selectPreset(preset)}
                    className="w-full justify-start h-7 px-2 text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Custom Range</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="h-8 text-sm"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <Button size="sm" onClick={applyFilter} className="w-full h-8">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
