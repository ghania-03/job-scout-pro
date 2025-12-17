import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, Tags, Pencil, Check } from 'lucide-react';

interface KeywordsSectionProps {
  keywords: string[];
  logic: 'all' | 'selected';
  onKeywordsChange: (keywords: string[]) => void;
  onLogicChange: (logic: 'all' | 'selected') => void;
}

export function KeywordsSection({
  keywords,
  logic,
  onKeywordsChange,
  onLogicChange,
}: KeywordsSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const maxKeywords = 25;

  const handleAddKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < maxKeywords) {
      onKeywordsChange([...keywords, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemove = (index: number) => {
    onKeywordsChange(keywords.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(keywords[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...keywords];
      updated[editingIndex] = editValue.trim();
      onKeywordsChange(updated);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-medium">Keywords Configuration</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Control job relevance through keywords.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add keyword and press Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAddKeyword} disabled={keywords.length >= maxKeywords}>
            Add
          </Button>
        </div>

        {/* Counter */}
        <p className="text-xs text-muted-foreground">
          {keywords.length} / {maxKeywords} keywords
        </p>

        {/* Keywords chips */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="group flex items-center gap-1 px-3 py-1.5 bg-accent/50 border border-border/50 rounded-full text-sm"
              >
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 bg-transparent outline-none text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <button
                      onClick={saveEdit}
                      className="p-0.5 hover:text-status-success transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-foreground">{keyword}</span>
                    <button
                      onClick={() => startEditing(index)}
                      className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Logic option */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-sm font-medium text-foreground mb-3">Keyword Matching Logic</p>
          <RadioGroup
            value={logic}
            onValueChange={(value) => onLogicChange(value as 'all' | 'selected')}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="logic-all" />
              <Label htmlFor="logic-all" className="text-sm cursor-pointer">
                Use all keywords (job must match any keyword)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="selected" id="logic-selected" />
              <Label htmlFor="logic-selected" className="text-sm cursor-pointer">
                Use selected keywords only
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
