import React from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';

interface BlockNoteEditorProps {
  initialContent?: any;
  onChange?: (blocks: any) => void;
  noteName?: string;
  onConvertToSource?: () => void;
  onBack?: () => void;
}

const BlockNoteEditor: React.FC<BlockNoteEditorProps> = ({ 
  initialContent, 
  onChange, 
  noteName = "New Note",
  onConvertToSource,
  onBack
}) => {
  // Ensure we always have valid initial content
  const validInitialContent = initialContent && initialContent.length > 0 
    ? initialContent 
    : [
        {
          type: "paragraph",
          content: []
        }
      ];

  // Creates a new editor instance
  const editor = useCreateBlockNote({
    initialContent: validInitialContent
  });

  return (
    <div className="w-full h-full pt-16">
      {/* Note Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
        )}
        {onConvertToSource && (
          <Button
            variant="outline"
            size="md"
            onClick={onConvertToSource}
          >
            <Link className="w-4 h-4" />
            Convert to Source
          </Button>
        )}
      </div>
      
      {/* BlockNote Editor */}
      <div className="w-full h-full [&_.bn-container]:!w-full [&_.bn-container]:!h-full [&_.bn-container]:!max-w-none [&_.bn-container]:!border-none [&_.bn-container]:!shadow-none [&_.bn-container]:!bg-transparent [&_.bn-container]:!p-0 [&_.bn-container]:!m-0">
        <BlockNoteView 
          editor={editor} 
          theme="light"
          onChange={() => {
            if (onChange) {
              onChange(editor.document);
            }
          }}
        />
      </div>
    </div>
  );
};

export default BlockNoteEditor;
