import { useState } from 'react';
import { Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NotesPopupProps {
  notes: string;
  onSave: (notes: string) => void;
}

export function NotesPopup({ notes, onSave }: NotesPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setEditedNotes(notes);
    }
  };

  const handleSave = () => {
    onSave(editedNotes);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsOpen(false);
  };

  const handleClear = () => {
    setEditedNotes('');
  };

  const truncatedNotes = notes.length > 40 ? `${notes.slice(0, 40)}…` : notes;

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-left w-full group min-h-[32px]">
          <span className="text-sm text-muted-foreground truncate flex-1">
            {notes || <span className="text-muted-foreground/50 italic">Add notes...</span>}
          </span>
          <Edit3 className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Notes</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Write your notes here..."
            className="min-h-[100px] resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
              Clear
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
