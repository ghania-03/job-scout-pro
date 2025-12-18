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
  inviteSent: boolean;
  skipInviteSent: boolean;
  unansweredInvitesCount: number | null;
  keywords: string[];
  budgetType: 'any' | 'hourly' | 'fixed';
  minBudget: number | null;
  maxBudget: number | null;
  includedCountries: string[];
  excludedCountries: string[];
  phoneVerified: boolean | null;
  paymentVerified: boolean | null;
  minApprovals: number | null;
  hiringRate: [number, number];
  clientRating: number;
}

const defaultFilters: FilterState = {
  platforms: ['upwork'],
  inviteSent: false,
  skipInviteSent: true,
  unansweredInvitesCount: null,
  keywords: [],
  budgetType: 'any',
  minBudget: null,
  maxBudget: null,
  includedCountries: [],
  excludedCountries: [],
  phoneVerified: null,
  paymentVerified: null,
  minApprovals: null,
  hiringRate: [0, 100],
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
    filters.keywords.forEach((kw) => {
      tags.push({ label: kw, key: `keyword-${kw}` });
    });
    if (filters.budgetType !== 'any') {
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

            {/* Platform Filter */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
            </Card>

            {/* Invite Signals */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Invite Sent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="skip-invite"
                    checked={filters.skipInviteSent}
                    onCheckedChange={(checked) =>
                      updateFilters({ skipInviteSent: !!checked })
                    }
                  />
                  <Label htmlFor="skip-invite" className="text-sm">
                    Skip jobs with invites already sent
                  </Label>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Unanswered Invites Count (max)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Any"
                    value={filters.unansweredInvitesCount ?? ''}
                    onChange={(e) =>
                      updateFilters({
                        unansweredInvitesCount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-32 h-9"
                  />
                </div>
              </CardContent>
            </Card>

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

            {/* Budget */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {(['any', 'hourly', 'fixed'] as const).map((type) => (
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
                <div className="flex gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Min Budget ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="No min"
                      value={filters.minBudget ?? ''}
                      onChange={(e) =>
                        updateFilters({ minBudget: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-32 h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Max Budget ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="No max"
                      value={filters.maxBudget ?? ''}
                      onChange={(e) =>
                        updateFilters({ maxBudget: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-32 h-9"
                    />
                  </div>
                </div>
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

            {/* Client Info & Advanced */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <Card className="border-border">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        Client Info & Advanced Filters
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

                    {/* Number of Approvals */}
                    <div className="space-y-1.5">
                      <Label className="text-sm">Minimum Approvals</Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Any"
                        value={filters.minApprovals ?? ''}
                        onChange={(e) =>
                          updateFilters({
                            minApprovals: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-32 h-9"
                      />
                    </div>

                    {/* Hiring Rate */}
                    <div className="space-y-3">
                      <Label className="text-sm">
                        Hiring Rate: {filters.hiringRate[0]}% - {filters.hiringRate[1]}%
                      </Label>
                      <Slider
                        value={filters.hiringRate}
                        onValueChange={(value) =>
                          updateFilters({ hiringRate: value as [number, number] })
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="w-full max-w-xs"
                      />
                    </div>

                    {/* Client Rating */}
                    <div className="space-y-2">
                      <Label className="text-sm">Minimum Client Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              updateFilters({
                                clientRating: filters.clientRating === star ? 0 : star,
                              })
                            }
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= filters.clientRating
                                  ? 'fill-status-pending text-status-pending'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                        {filters.clientRating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {filters.clientRating}+ stars
                          </span>
                        )}
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
