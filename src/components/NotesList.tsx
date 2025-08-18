import React, { useState } from 'react';
import { Plus, Trash2, FileText, Link } from 'lucide-react';

interface Note {
  id: string;
  name: string;
  content: any;
  lastModified: Date;
}

interface NotesListProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  onNoteConvertToSource: (note: Note) => void;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteConvertToSource
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
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
        <div className="mb-8 mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-900">My Notes</h2>
              <button 
                onClick={onNoteCreate}
                className="px-4 py-2 border border-neutral-200 rounded-full text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Note
              </button>
            </div>
            
            {/* Notes List */}
            <div className="space-y-4">
              {notes.map((note) => (
                <div 
                  key={note.id}
                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
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
                      <button 
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNoteConvertToSource(note);
                        }}
                        title="Convert to Source"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNoteDelete(note.id);
                        }}
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No notes yet</h3>
            <p className="text-neutral-600 mb-6">Create your first note to get started</p>
            <button
              onClick={onNoteCreate}
              className="px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
