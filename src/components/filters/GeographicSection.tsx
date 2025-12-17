import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Cambodia', 'Canada',
  'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark',
  'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong',
  'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
  'Lithuania', 'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia',
  'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
  'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand',
  'Turkey', 'UAE', 'Ukraine', 'United Kingdom', 'United States', 'Venezuela',
  'Vietnam'
];

interface GeographicSectionProps {
  excludedCountries: string[];
  onChange: (countries: string[]) => void;
}

export function GeographicSection({ excludedCountries, onChange }: GeographicSectionProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredCountries = countries.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCountry = (country: string) => {
    if (excludedCountries.includes(country)) {
      onChange(excludedCountries.filter(c => c !== country));
    } else {
      onChange([...excludedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    onChange(excludedCountries.filter(c => c !== country));
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-medium">Geographic Exclusion</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Jobs from these countries will be ignored.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
            >
              <span className="text-muted-foreground">
                {excludedCountries.length > 0
                  ? `${excludedCountries.length} countries excluded`
                  : 'Select countries to exclude...'}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-2 border-b border-border">
              <Input
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
              />
            </div>
            <ScrollArea className="h-60">
              <div className="p-2 space-y-1">
                {filteredCountries.map((country) => (
                  <label
                    key={country}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={excludedCountries.includes(country)}
                      onCheckedChange={() => toggleCountry(country)}
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
                {filteredCountries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No countries found
                  </p>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Selected countries chips */}
        {excludedCountries.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {excludedCountries.map((country) => (
              <div
                key={country}
                className="flex items-center gap-1.5 px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full text-sm"
              >
                <span className="text-foreground">{country}</span>
                <button
                  onClick={() => removeCountry(country)}
                  className="p-0.5 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No countries excluded — jobs from all locations allowed.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
