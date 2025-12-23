import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import {
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Check,
  Globe,
  Star,
  Filter,
} from 'lucide-react';
import { JobTable } from '@/components/dashboard/JobTable';
import { mockJobs } from '@/data/mockJobs';
import { Job } from '@/types/job';

// Available platforms
const platforms = [
  { id: 'upwork', label: 'Upwork' },
  { id: 'freelancer', label: 'Freelancer (Coming Soon)', disabled: true },
  { id: 'fiverr', label: 'Fiverr (Coming Soon)', disabled: true },
];

// Sample keywords for suggestions
const keywordSuggestions = [
  'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'Full Stack',
  'Frontend', 'Backend', 'AWS', 'DevOps', 'Machine Learning', 'Data Science',
  'UI/UX', 'Mobile App', 'Flutter', 'iOS', 'Android', 'WordPress', 'Shopify',
];

// Countries list
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
  'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Brazil', 'Mexico',
  'Netherlands', 'Singapore', 'Japan', 'South Korea', 'China', 'Russia',
  'Ukraine', 'Poland', 'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark',
];

export interface FilterState {
  platforms: string[];
  includeInviteSent: boolean;
  unansweredInvitesCount: number | null;
  keywords: string[];
  hourlyEnabled: boolean;
  fixedEnabled: boolean;
  hourlyMinBudget: number | null;
  hourlyMaxBudget: number | null;
  fixedMinBudget: number | null;
  fixedMaxBudget: number | null;
  includedCountries: string[];
  excludedCountries: string[];
  phoneVerified: boolean | null;
  paymentVerified: boolean | null;
  proposalsMin: number;
  proposalsMax: number;
  hiringRateMin: number;
  hiringRateMax: number;
  clientRating: number;
}

const defaultFilters: FilterState = {
  platforms: ['upwork'],
  includeInviteSent: false,
  unansweredInvitesCount: null,
  keywords: [],
  hourlyEnabled: false,
  fixedEnabled: false,
  hourlyMinBudget: null,
  hourlyMaxBudget: null,
  fixedMinBudget: null,
  fixedMaxBudget: null,
  includedCountries: [],
  excludedCountries: [],
  phoneVerified: null,
  paymentVerified: null,
  proposalsMin: 5,
  proposalsMax: 10,
  hiringRateMin: 0,
  hiringRateMax: 100,
  clientRating: 0,
};

export default function Jobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('bd-job-filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old budget format to new format
      if ('budgetType' in parsed) {
        return {
          ...defaultFilters,
          ...parsed,
          hourlyEnabled: parsed.budgetType === 'hourly',
          fixedEnabled: parsed.budgetType === 'fixed',
          hourlyMinBudget: parsed.budgetType === 'hourly' ? parsed.minBudget : null,
          hourlyMaxBudget: parsed.budgetType === 'hourly' ? parsed.maxBudget : null,
          fixedMinBudget: parsed.budgetType === 'fixed' ? parsed.minBudget : null,
          fixedMaxBudget: parsed.budgetType === 'fixed' ? parsed.maxBudget : null,
        };
      }
      return { ...defaultFilters, ...parsed };
    }
    return defaultFilters;
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [keywordSuggestionsOpen, setKeywordSuggestionsOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const filteredKeywordSuggestions = keywordSuggestions.filter(
    (kw) =>
      kw.toLowerCase().includes(keywordInput.toLowerCase()) &&
      !filters.keywords.includes(kw)
  );

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !filters.keywords.includes(keyword)) {
      updateFilters({ keywords: [...filters.keywords, keyword] });
    }
    setKeywordInput('');
    setKeywordSuggestionsOpen(false);
  };

  const removeKeyword = (keyword: string) => {
    updateFilters({ keywords: filters.keywords.filter((k) => k !== keyword) });
  };

  const toggleCountry = (country: string, type: 'included' | 'excluded') => {
    if (type === 'included') {
      const updated = filters.includedCountries.includes(country)
        ? filters.includedCountries.filter((c) => c !== country)
        : [...filters.includedCountries, country];
      updateFilters({ includedCountries: updated });
    } else {
      const updated = filters.excludedCountries.includes(country)
        ? filters.excludedCountries.filter((c) => c !== country)
        : [...filters.excludedCountries, country];
      updateFilters({ excludedCountries: updated });
    }
  };

  const handleApply = () => {
    localStorage.setItem('bd-job-filters', JSON.stringify(filters));
    toast({
      title: 'Filters Applied',
      description: 'Your job filters have been saved.',
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    localStorage.setItem('bd-job-filters', JSON.stringify(defaultFilters));
    toast({
      title: 'Filters Reset',
      description: 'All filters have been reset to defaults.',
    });
  };

  const handleJobUpdate = (updatedJob: Job) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  // Get active filter tags
  const getActiveFilterTags = () => {
    const tags: { label: string; key: string }[] = [];
    if (filters.platforms.length > 0) {
      tags.push({ label: `Platform: ${filters.platforms.join(', ')}`, key: 'platforms' });
    }
    if (!filters.includeInviteSent) {
      tags.push({ label: 'Skip Invite Sent', key: 'includeInviteSent' });
    }
    filters.keywords.forEach((kw) => {
      tags.push({ label: kw, key: `keyword-${kw}` });
    });
    if (filters.hourlyEnabled) {
      tags.push({ label: 'Hourly', key: 'hourlyEnabled' });
      if (filters.hourlyMinBudget) {
        tags.push({ label: `Hourly Min: $${filters.hourlyMinBudget}/hr`, key: 'hourlyMinBudget' });
      }
    }
    if (filters.fixedEnabled) {
      tags.push({ label: 'Fixed', key: 'fixedEnabled' });
      if (filters.fixedMinBudget) {
        tags.push({ label: `Fixed Min: $${filters.fixedMinBudget}`, key: 'fixedMinBudget' });
      }
    }
    if (filters.clientRating > 0) {
      tags.push({ label: `Rating: ${filters.clientRating}+ stars`, key: 'clientRating' });
    }
    return tags;
  };

  const activeFilters = getActiveFilterTags();
  const isAllBudgetTypes = !filters.hourlyEnabled && !filters.fixedEnabled;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Filters */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Define which jobs are allowed
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {/* Active Filters Tags */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-muted/50 rounded-lg border border-border">
                {activeFilters.map((tag) => (
                  <Badge
                    key={tag.key}
                    variant="secondary"
                    className="text-xs py-0.5 px-1.5"
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Advanced Filters - Expanded by default */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="py-2 px-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Advanced Filters
                      </CardTitle>
                      {advancedOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0 px-3 pb-3">
                    {/* Invite Sent */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Invite Sent</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="include-invite"
                          checked={filters.includeInviteSent}
                          onCheckedChange={(checked) =>
                            updateFilters({ includeInviteSent: !!checked })
                          }
                        />
                        <Label htmlFor="include-invite" className="text-xs">
                          Include jobs with invites sent
                        </Label>
                      </div>
                    </div>

                    {/* No. of Proposals */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        No. of Proposals: {filters.proposalsMin} - {filters.proposalsMax}
                      </Label>
                      <Slider
                        value={[filters.proposalsMin, filters.proposalsMax]}
                        onValueChange={(value) =>
                          updateFilters({ proposalsMin: value[0], proposalsMax: value[1] })
                        }
                        min={0}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <div className="space-y-0.5">
                          <Label className="text-[10px] text-muted-foreground">Min</Label>
                          <Input
                            type="number"
                            min={0}
                            max={filters.proposalsMax}
                            value={filters.proposalsMin}
                            onChange={(e) =>
                              updateFilters({ proposalsMin: Math.min(Number(e.target.value), filters.proposalsMax) })
                            }
                            className="w-16 h-7 text-xs"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-[10px] text-muted-foreground">Max</Label>
                          <Input
                            type="number"
                            min={filters.proposalsMin}
                            max={10}
                            value={filters.proposalsMax}
                            onChange={(e) =>
                              updateFilters({ proposalsMax: Math.min(Math.max(Number(e.target.value), filters.proposalsMin), 10) })
                            }
                            className="w-16 h-7 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hiring Rate */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Hiring Rate: {filters.hiringRateMin}% - {filters.hiringRateMax}%
                      </Label>
                      <Slider
                        value={[filters.hiringRateMin, filters.hiringRateMax]}
                        onValueChange={(value) =>
                          updateFilters({ hiringRateMin: value[0], hiringRateMax: value[1] })
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <div className="space-y-0.5">
                          <Label className="text-[10px] text-muted-foreground">Min %</Label>
                          <Input
                            type="number"
                            min={0}
                            max={filters.hiringRateMax}
                            value={filters.hiringRateMin}
                            onChange={(e) =>
                              updateFilters({ hiringRateMin: Math.min(Number(e.target.value), filters.hiringRateMax) })
                            }
                            className="w-16 h-7 text-xs"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-[10px] text-muted-foreground">Max %</Label>
                          <Input
                            type="number"
                            min={filters.hiringRateMin}
                            max={100}
                            value={filters.hiringRateMax}
                            onChange={(e) =>
                              updateFilters({ hiringRateMax: Math.max(Number(e.target.value), filters.hiringRateMin) })
                            }
                            className="w-16 h-7 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Rating */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Min Client Rating: {filters.clientRating > 0 ? `${filters.clientRating.toFixed(1)}+` : 'Any'}
                      </Label>
                      <Slider
                        value={[filters.clientRating]}
                        onValueChange={(value) => updateFilters({ clientRating: value[0] })}
                        min={0}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={filters.clientRating}
                          onChange={(e) =>
                            updateFilters({ clientRating: Math.min(Math.max(Number(e.target.value), 0), 5) })
                          }
                          className="w-16 h-7 text-xs"
                        />
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.floor(filters.clientRating)
                                  ? 'fill-status-pending text-status-pending'
                                  : star <= filters.clientRating
                                  ? 'fill-status-pending/50 text-status-pending'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Client Verification */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Client Verification</Label>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            id="phone-verified"
                            checked={filters.phoneVerified === true}
                            onCheckedChange={(checked) =>
                              updateFilters({ phoneVerified: checked ? true : null })
                            }
                          />
                          <Label htmlFor="phone-verified" className="text-xs">
                            Phone
                          </Label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            id="payment-verified"
                            checked={filters.paymentVerified === true}
                            onCheckedChange={(checked) =>
                              updateFilters({ paymentVerified: checked ? true : null })
                            }
                          />
                          <Label htmlFor="payment-verified" className="text-xs">
                            Payment
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Platform Filter - Collapsed by default */}
            <Collapsible open={platformOpen} onOpenChange={setPlatformOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="py-2 px-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Platform</CardTitle>
                      {platformOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center gap-2">
                        <Checkbox
                          id={platform.id}
                          checked={filters.platforms.includes(platform.id)}
                          disabled={platform.disabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilters({ platforms: [...filters.platforms, platform.id] });
                            } else {
                              updateFilters({
                                platforms: filters.platforms.filter((p) => p !== platform.id),
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={platform.id}
                          className={`text-xs ${platform.disabled ? 'text-muted-foreground' : ''}`}
                        >
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Budget - Collapsed by default */}
            <Collapsible open={budgetOpen} onOpenChange={setBudgetOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="py-2 px-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Budget</CardTitle>
                      {budgetOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3 pt-0 px-3 pb-3">
                    {/* Budget Type Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="budget-all"
                          checked={isAllBudgetTypes}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilters({ hourlyEnabled: false, fixedEnabled: false });
                            }
                          }}
                        />
                        <Label htmlFor="budget-all" className="text-xs">
                          All
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="budget-hourly"
                          checked={filters.hourlyEnabled}
                          onCheckedChange={(checked) => updateFilters({ hourlyEnabled: !!checked })}
                        />
                        <Label htmlFor="budget-hourly" className="text-xs">
                          Hourly
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="budget-fixed"
                          checked={filters.fixedEnabled}
                          onCheckedChange={(checked) => updateFilters({ fixedEnabled: !!checked })}
                        />
                        <Label htmlFor="budget-fixed" className="text-xs">
                          Fixed
                        </Label>
                      </div>
                    </div>

                    {isAllBudgetTypes && (
                      <p className="text-xs text-muted-foreground italic">
                        All budget types shown (no filter applied)
                      </p>
                    )}

                    {/* Hourly Budget Inputs */}
                    {filters.hourlyEnabled && (
                      <div className="space-y-2 p-2 bg-muted/30 rounded-lg">
                        <Label className="text-xs font-medium">Hourly Budget</Label>
                        <div className="flex gap-2">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] text-muted-foreground">
                              Min $/hr <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Required"
                              value={filters.hourlyMinBudget ?? ''}
                              onChange={(e) =>
                                updateFilters({ hourlyMinBudget: e.target.value ? Number(e.target.value) : null })
                              }
                              className="w-24 h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <Label className="text-[10px] text-muted-foreground">Max $/hr</Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Unlimited"
                              value={filters.hourlyMaxBudget ?? ''}
                              onChange={(e) =>
                                updateFilters({ hourlyMaxBudget: e.target.value ? Number(e.target.value) : null })
                              }
                              className="w-24 h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fixed Budget Inputs */}
                    {filters.fixedEnabled && (
                      <div className="space-y-2 p-2 bg-muted/30 rounded-lg">
                        <Label className="text-xs font-medium">Fixed Budget</Label>
                        <div className="flex gap-2">
                          <div className="space-y-0.5">
                            <Label className="text-[10px] text-muted-foreground">
                              Min $ <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Required"
                              value={filters.fixedMinBudget ?? ''}
                              onChange={(e) =>
                                updateFilters({ fixedMinBudget: e.target.value ? Number(e.target.value) : null })
                              }
                              className="w-24 h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <Label className="text-[10px] text-muted-foreground">Max $</Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Unlimited"
                              value={filters.fixedMaxBudget ?? ''}
                              onChange={(e) =>
                                updateFilters({ fixedMaxBudget: e.target.value ? Number(e.target.value) : null })
                              }
                              className="w-24 h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Keywords */}
            <Card className="border-border">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm font-medium">Keywords</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-3 pb-3">
                <div className="relative">
                  <Popover open={keywordSuggestionsOpen} onOpenChange={setKeywordSuggestionsOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        <Input
                          placeholder="Add keywords..."
                          value={keywordInput}
                          onChange={(e) => {
                            setKeywordInput(e.target.value);
                            setKeywordSuggestionsOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && keywordInput) {
                              addKeyword(keywordInput);
                            }
                          }}
                          className="pl-7 h-7 text-xs"
                        />
                      </div>
                    </PopoverTrigger>
                    {keywordInput && filteredKeywordSuggestions.length > 0 && (
                      <PopoverContent className="w-[200px] p-1.5" align="start">
                        <div className="space-y-0.5 max-h-[150px] overflow-y-auto">
                          {filteredKeywordSuggestions.map((kw) => (
                            <button
                              key={kw}
                              className="w-full text-left px-2 py-1 text-xs rounded hover:bg-muted transition-colors"
                              onClick={() => addKeyword(kw)}
                            >
                              {kw}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    )}
                  </Popover>
                </div>

                {filters.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {filters.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="py-0.5 px-1.5 gap-0.5 text-xs">
                        {keyword}
                        <button onClick={() => removeKeyword(keyword)}>
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geographic */}
            <Card className="border-border">
              <CardHeader className="py-2 px-3">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <CardTitle className="text-sm font-medium">Geographic</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 px-3 pb-3">
                {/* Excluded Countries */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Excluded Countries</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Add Country
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-1.5" align="start">
                      <Input
                        placeholder="Search..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="h-7 mb-1.5 text-xs"
                      />
                      <div className="space-y-0.5 max-h-[150px] overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            className="w-full text-left px-2 py-1 text-xs rounded hover:bg-muted flex items-center justify-between"
                            onClick={() => toggleCountry(country, 'excluded')}
                          >
                            {country}
                            {filters.excludedCountries.includes(country) && (
                              <Check className="w-3 h-3 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {filters.excludedCountries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {filters.excludedCountries.map((country) => (
                        <Badge key={country} variant="destructive" className="py-0.5 px-1.5 gap-0.5 text-xs">
                          {country}
                          <button onClick={() => toggleCountry(country, 'excluded')}>
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {filters.excludedCountries.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic">
                      No countries excluded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApply} size="sm" className="flex-1">
                Apply
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Jobs */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h1 className="text-lg font-semibold text-foreground">Job Queue</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor AI-fetched jobs and manage proposals
          </p>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <JobTable jobs={jobs} onJobUpdate={handleJobUpdate} />
        </div>
      </div>
    </div>
  );
}
