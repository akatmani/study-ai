import React from 'react';
import { Plus, FileText, Link, Trash2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface NotesListProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  onNoteConvertToSource: (note: Note) => void;
  hideHeader?: boolean;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteConvertToSource,
  hideHeader = false
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {notes.length > 0 ? (
        <>
          {/* My Notes Section */}
          {!hideHeader && (
            <div className="mb-8 mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">My Notes</h2>
                <Button 
                  variant="outline"
                  size="md"
                  onClick={onNoteCreate}
                >
                  <Plus className="w-4 h-4" />
                  Create Note
                </Button>
              </div>
            </div>
          )}
          
          {/* Notes List */}
          <div className="space-y-4">
            {notes.map((note) => (
              <Card 
                key={note.id}
                className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                onClick={() => onNoteSelect(note)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">New Note</h3>
                      <p className="text-sm text-neutral-500">Note</p>
                      <p className="text-xs text-neutral-400">{formatTimeAgo(note.lastModified)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteConvertToSource(note);
                      }}
                      title="Convert to Source"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteDelete(note.id);
                      }}
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">No notes yet</h2>
          <p className="text-sm text-neutral-600 mb-6">Create your first note to get started</p>
          <Button onClick={onNoteCreate}>
            <Plus className="w-4 h-4" />
            Create Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesList;
