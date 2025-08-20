import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import NotesList from './NotesList';

// Dynamically import BlockNote components to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('./BlockNoteEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-neutral-500">Loading editor...</div>
      </div>
    )
  }
);

interface Note {
  id: string;
  title: string;
  content: any;
  lastModified: Date;
}

interface NotesEditorProps {
  initialContent?: any;
  onChange?: (blocks: any) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = (props) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'New Note',
      content: [],
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      title: 'New Note',
      content: [],
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsEditingNote(true);
  };

  const handleNoteCreate = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: [],
      lastModified: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditingNote(true);
  };

  const handleNoteDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditingNote(false);
    }
  };

  const handleNoteConvertToSource = (note: Note) => {
    // TODO: Implement convert to source functionality
    console.log('Converting note to source:', note);
  };

  const handleNoteChange = (content: any) => {
    if (selectedNote) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id 
          ? { ...note, content, lastModified: new Date() }
          : note
      ));
    }
  };

  const handleBackToList = () => {
    setSelectedNote(null);
    setIsEditingNote(false);
  };

  if (isEditingNote && selectedNote) {
    return (
      <div className="w-full h-full">
        <BlockNoteEditor
          initialContent={selectedNote.content}
          onChange={handleNoteChange}
          noteName={selectedNote.title}
          onConvertToSource={() => handleNoteConvertToSource(selectedNote)}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <NotesList
      notes={notes}
      onNoteSelect={handleNoteSelect}
      onNoteCreate={handleNoteCreate}
      onNoteDelete={handleNoteDelete}
      onNoteConvertToSource={handleNoteConvertToSource}
    />
  );
};

export default NotesEditor;
