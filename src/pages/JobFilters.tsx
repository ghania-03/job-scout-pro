import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';

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
  budgetType: 'all' | 'hourly' | 'fixed';
  minBudget: number | null;
  maxBudget: number | null;
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
  budgetType: 'all',
  minBudget: null,
  maxBudget: null,
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

export default function JobFilters() {
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bd-sidebar-collapsed') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('bd-job-filters');
    return saved ? JSON.parse(saved) : defaultFilters;
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
    if (filters.budgetType !== 'all') {
      tags.push({ label: `Budget: ${filters.budgetType}`, key: 'budgetType' });
    }
    if (filters.minBudget) {
      tags.push({ label: `Min: $${filters.minBudget}`, key: 'minBudget' });
    }
    if (filters.maxBudget) {
      tags.push({ label: `Max: $${filters.maxBudget}`, key: 'maxBudget' });
    }
    if (filters.clientRating > 0) {
      tags.push({ label: `Rating: ${filters.clientRating}+ stars`, key: 'clientRating' });
    }
    return tags;
  };

  const activeFilters = getActiveFilterTags();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => {
          const newState = !sidebarCollapsed;
          setSidebarCollapsed(newState);
          localStorage.setItem('bd-sidebar-collapsed', String(newState));
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
                Job Filters
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Define which jobs are allowed to enter the system
              </p>
            </div>

            {/* Active Filters Tags */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                {activeFilters.map((tag) => (
                  <Badge
                    key={tag.key}
                    variant="secondary"
                    className="text-xs py-1 px-2"
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Advanced Filters - Expanded by default at top */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
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
                  <CardContent className="space-y-4 pt-0">
                    {/* Invite Sent */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Invite Sent</Label>
                      <p className="text-xs text-muted-foreground">
                        {filters.includeInviteSent 
                          ? 'Including jobs where invite is sent' 
                          : 'Skipping jobs where invite is sent'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="include-invite"
                          checked={filters.includeInviteSent}
                          onCheckedChange={(checked) =>
                            updateFilters({ includeInviteSent: !!checked })
                          }
                        />
                        <Label htmlFor="include-invite" className="text-sm">
                          Include jobs with invites already sent
                        </Label>
                      </div>
                    </div>

                    {/* No. of Proposals */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
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
                        className="w-full max-w-xs"
                      />
                      <div className="flex gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Min</Label>
                          <Input
                            type="number"
                            min={0}
                            max={filters.proposalsMax}
                            value={filters.proposalsMin}
                            onChange={(e) =>
                              updateFilters({ proposalsMin: Math.min(Number(e.target.value), filters.proposalsMax) })
                            }
                            className="w-20 h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Max</Label>
                          <Input
                            type="number"
                            min={filters.proposalsMin}
                            max={10}
                            value={filters.proposalsMax}
                            onChange={(e) =>
                              updateFilters({ proposalsMax: Math.min(Math.max(Number(e.target.value), filters.proposalsMin), 10) })
                            }
                            className="w-20 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hiring Rate */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
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
                        className="w-full max-w-xs"
                      />
                      <div className="flex gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Min %</Label>
                          <Input
                            type="number"
                            min={0}
                            max={filters.hiringRateMax}
                            value={filters.hiringRateMin}
                            onChange={(e) =>
                              updateFilters({ hiringRateMin: Math.min(Number(e.target.value), filters.hiringRateMax) })
                            }
                            className="w-20 h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Max %</Label>
                          <Input
                            type="number"
                            min={filters.hiringRateMin}
                            max={100}
                            value={filters.hiringRateMax}
                            onChange={(e) =>
                              updateFilters({ hiringRateMax: Math.max(Number(e.target.value), filters.hiringRateMin) })
                            }
                            className="w-20 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Rating */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Minimum Client Rating: {filters.clientRating > 0 ? `${filters.clientRating.toFixed(1)}+` : 'Any'}
                      </Label>
                      <Slider
                        value={[filters.clientRating]}
                        onValueChange={(value) => updateFilters({ clientRating: value[0] })}
                        min={0}
                        max={5}
                        step={0.1}
                        className="w-full max-w-xs"
                      />
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Rating</Label>
                          <Input
                            type="number"
                            min={0}
                            max={5}
                            step={0.1}
                            value={filters.clientRating}
                            onChange={(e) =>
                              updateFilters({ clientRating: Math.min(Math.max(Number(e.target.value), 0), 5) })
                            }
                            className="w-20 h-8"
                          />
                        </div>
                        <div className="flex gap-1 mt-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
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
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Client Verification</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="phone-verified"
                            checked={filters.phoneVerified === true}
                            onCheckedChange={(checked) =>
                              updateFilters({ phoneVerified: checked ? true : null })
                            }
                          />
                          <Label htmlFor="phone-verified" className="text-sm">
                            Phone Verified
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="payment-verified"
                            checked={filters.paymentVerified === true}
                            onCheckedChange={(checked) =>
                              updateFilters({ paymentVerified: checked ? true : null })
                            }
                          />
                          <Label htmlFor="payment-verified" className="text-sm">
                            Payment Verified
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
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Platform</CardTitle>
                      {platformOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-2 pt-0">
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
                          className={`text-sm ${platform.disabled ? 'text-muted-foreground' : ''}`}
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
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Budget</CardTitle>
                      {budgetOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex gap-4">
                      {(['all', 'hourly', 'fixed'] as const).map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={`budget-${type}`}
                            checked={filters.budgetType === type}
                            onCheckedChange={() => updateFilters({ budgetType: type })}
                          />
                          <Label htmlFor={`budget-${type}`} className="text-sm capitalize">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {filters.budgetType !== 'all' && (
                      <div className="flex gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm">
                            Min {filters.budgetType === 'hourly' ? '$/hr' : '$'} <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Required"
                            value={filters.minBudget ?? ''}
                            onChange={(e) =>
                              updateFilters({ minBudget: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-32 h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm">
                            Max {filters.budgetType === 'hourly' ? '$/hr' : '$'}
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Unlimited"
                            value={filters.maxBudget ?? ''}
                            onChange={(e) =>
                              updateFilters({ maxBudget: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-32 h-9"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Keywords */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Keywords</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Popover open={keywordSuggestionsOpen} onOpenChange={setKeywordSuggestionsOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search and add keywords..."
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
                          className="pl-9 h-9"
                        />
                      </div>
                    </PopoverTrigger>
                    {keywordInput && filteredKeywordSuggestions.length > 0 && (
                      <PopoverContent className="w-[300px] p-2" align="start">
                        <div className="space-y-1 max-h-[200px] overflow-y-auto">
                          {filteredKeywordSuggestions.map((kw) => (
                            <button
                              key={kw}
                              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
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
                  <div className="flex flex-wrap gap-2">
                    {filters.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="py-1 px-2 gap-1">
                        {keyword}
                        <button onClick={() => removeKeyword(keyword)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geographic */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-medium">Geographic Requirements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Excluded Countries */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Excluded Countries</Label>
                  <p className="text-xs text-muted-foreground">
                    Jobs from excluded countries will be ignored
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Country
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-2" align="start">
                      <Input
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="h-8 mb-2"
                      />
                      <div className="space-y-1 max-h-[200px] overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center justify-between"
                            onClick={() => toggleCountry(country, 'excluded')}
                          >
                            {country}
                            {filters.excludedCountries.includes(country) && (
                              <Check className="w-3.5 h-3.5 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {filters.excludedCountries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.excludedCountries.map((country) => (
                        <Badge key={country} variant="destructive" className="py-1 px-2 gap-1">
                          {country}
                          <button onClick={() => toggleCountry(country, 'excluded')}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {filters.excludedCountries.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No countries excluded — jobs from all locations allowed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleApply}>Apply Filters</Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
