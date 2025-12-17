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
  Filter,
  Settings2,
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
  skipInviteSent: boolean;
  skipInterviewing: boolean;
  proposalsMin: number;
  proposalsMax: number;
  keywords: string[];
  budgetType: 'all' | 'hourly' | 'fixed';
  minBudget: number | null;
  maxBudget: number | null;
  includedCountries: string[];
  excludedCountries: string[];
  phoneVerified: boolean | null;
  paymentVerified: boolean | null;
  hiringRateMin: number | null;
  hiringRateMax: number | null;
  clientRating: number;
}

const defaultFilters: FilterState = {
  platforms: ['upwork'],
  skipInviteSent: true,
  skipInterviewing: true,
  proposalsMin: 5,
  proposalsMax: 10,
  keywords: [],
  budgetType: 'all',
  minBudget: null,
  maxBudget: null,
  includedCountries: [],
  excludedCountries: [],
  phoneVerified: null,
  paymentVerified: null,
  hiringRateMin: null,
  hiringRateMax: null,
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
  const [otherOpen, setOtherOpen] = useState(false);

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
    if (filters.skipInviteSent) {
      tags.push({ label: 'Skip Invite Sent', key: 'skipInviteSent' });
    }
    if (filters.skipInterviewing) {
      tags.push({ label: 'Skip Interviewing', key: 'skipInterviewing' });
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
      tags.push({ label: `Rating: ${filters.clientRating}+`, key: 'clientRating' });
    }
    if (filters.excludedCountries.length > 0) {
      tags.push({ label: `Excluded: ${filters.excludedCountries.length} countries`, key: 'excluded' });
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

            {/* Advanced Filters - Open by Default */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <CardTitle className="text-base font-medium">
                          Advanced Filters
                        </CardTitle>
                      </div>
                      {advancedOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* Keywords */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Keywords</Label>
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
                            <PopoverContent className="w-[300px] p-2 bg-popover" align="start">
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
                    </div>

                    {/* Invite Sent / No. of Proposals */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">No. of Proposals</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="skip-invite"
                            checked={filters.skipInviteSent}
                            onCheckedChange={(checked) =>
                              updateFilters({ skipInviteSent: !!checked })
                            }
                          />
                          <Label htmlFor="skip-invite" className="text-sm">
                            Invite Sent (Bot ignores jobs with invites sent)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="skip-interviewing"
                            checked={filters.skipInterviewing}
                            onCheckedChange={(checked) =>
                              updateFilters({ skipInterviewing: !!checked })
                            }
                          />
                          <Label htmlFor="skip-interviewing" className="text-sm">
                            Exclude jobs where client is already interviewing candidates
                          </Label>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Min Proposals</Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="5"
                              value={filters.proposalsMin}
                              onChange={(e) =>
                                updateFilters({
                                  proposalsMin: e.target.value ? Number(e.target.value) : 0,
                                })
                              }
                              className="w-24 h-9"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Max Proposals</Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="10"
                              value={filters.proposalsMax}
                              onChange={(e) =>
                                updateFilters({
                                  proposalsMax: e.target.value ? Number(e.target.value) : 0,
                                })
                              }
                              className="w-24 h-9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Geographic Requirements */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <Label className="text-sm font-medium">Geographic Requirements</Label>
                      </div>
                      
                      {/* Included Countries */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Included Countries</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                              <Plus className="w-3.5 h-3.5 mr-1.5" />
                              Add Country
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-2 bg-popover" align="start">
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
                                  onClick={() => toggleCountry(country, 'included')}
                                >
                                  {country}
                                  {filters.includedCountries.includes(country) && (
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        {filters.includedCountries.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {filters.includedCountries.map((country) => (
                              <Badge key={country} variant="secondary" className="py-1 px-2 gap-1">
                                {country}
                                <button onClick={() => toggleCountry(country, 'included')}>
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Excluded Countries */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Excluded Countries</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                              <Plus className="w-3.5 h-3.5 mr-1.5" />
                              Add Country
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-2 bg-popover" align="start">
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
                          <div className="flex flex-wrap gap-2">
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

                        {filters.excludedCountries.length > 0 && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Jobs from excluded countries will be ignored
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Other Filters - Collapsed by Default */}
            <Collapsible open={otherOpen} onOpenChange={setOtherOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-base font-medium">
                          Other Filters
                        </CardTitle>
                        {!otherOpen && (
                          <span className="text-xs text-muted-foreground">
                            (Budget, Platform, Hiring Rate, Client Info)
                          </span>
                        )}
                      </div>
                      {otherOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* Budget */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Budget</Label>
                      <div className="flex gap-4">
                        {(['all', 'hourly', 'fixed'] as const).map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              id={`budget-${type}`}
                              checked={filters.budgetType === type}
                              onCheckedChange={() => {
                                updateFilters({ 
                                  budgetType: type,
                                  minBudget: type === 'all' ? null : filters.minBudget,
                                  maxBudget: type === 'all' ? null : filters.maxBudget,
                                });
                              }}
                            />
                            <Label htmlFor={`budget-${type}`} className="text-sm capitalize">
                              {type === 'all' ? 'All' : type}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {filters.budgetType !== 'all' && (
                        <div className="flex gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                              Min {filters.budgetType === 'hourly' ? '$/hr' : '$'}
                              <span className="text-destructive ml-1">*</span>
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
                            <Label className="text-xs text-muted-foreground">
                              Max {filters.budgetType === 'hourly' ? '$/hr' : '$'} (optional)
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
                      
                      {filters.budgetType !== 'all' && filters.minBudget && filters.maxBudget && filters.minBudget > filters.maxBudget && (
                        <p className="text-xs text-destructive">
                          Min budget must be less than or equal to max budget
                        </p>
                      )}
                    </div>

                    {/* Platform */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Platform</Label>
                      <div className="space-y-2">
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
                      </div>
                    </div>

                    {/* Hiring Rate */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Hiring Rate (%)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                          <Slider
                            value={[filters.hiringRateMin ?? 0, filters.hiringRateMax ?? 100]}
                            onValueChange={(value) =>
                              updateFilters({ 
                                hiringRateMin: value[0], 
                                hiringRateMax: value[1] 
                              })
                            }
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            value={filters.hiringRateMin ?? ''}
                            onChange={(e) =>
                              updateFilters({ hiringRateMin: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-20 h-9"
                          />
                          <span className="text-muted-foreground">-</span>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="100"
                            value={filters.hiringRateMax ?? ''}
                            onChange={(e) =>
                              updateFilters({ hiringRateMax: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-20 h-9"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Rating */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Minimum Client Rating</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                          <Slider
                            value={[filters.clientRating]}
                            onValueChange={(value) =>
                              updateFilters({ clientRating: value[0] })
                            }
                            min={0}
                            max={5}
                            step={0.1}
                          />
                        </div>
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          placeholder="0"
                          value={filters.clientRating || ''}
                          onChange={(e) =>
                            updateFilters({ clientRating: e.target.value ? Number(e.target.value) : 0 })
                          }
                          className="w-20 h-9"
                        />
                        <span className="text-sm text-muted-foreground">
                          {filters.clientRating > 0 ? `${filters.clientRating}+ stars` : 'Any'}
                        </span>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Client Info</Label>
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
