import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Brain, 
  HelpCircle, 
  CreditCard, 
  Mic,
  Layers,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Link,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RotateCw,
  ChevronDown,
  ArrowUp,
  Image,
  Paperclip,
  Share,
  Star,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NotesEditor from '../NotesEditor';

interface DocumentPageProps {
  studySetName: string;
  isSidebarCollapsed?: boolean;
  onSourcePreviewModeChange?: (isPreviewMode: boolean) => void;
}

interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'text';
  url?: string;
  content?: string;
}

const DocumentPage: React.FC<DocumentPageProps> = ({
  studySetName,
  isSidebarCollapsed = false,
  onSourcePreviewModeChange
}) => {
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      name: 'Biology - Wikipedia',
      type: 'link',
      url: 'https://en.wikipedia.org/wiki/Biology'
    }
  ]);
  const [activeSourceId, setActiveSourceId] = useState('1');
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isDrawerFullScreen, setIsDrawerFullScreen] = useState(false);
  const [isSourcesDrawerOpen, setIsSourcesDrawerOpen] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState('ai-chat');
  const [selectedSources, setSelectedSources] = useState<string[]>(['1']); // Start with first source selected
  const [sourcePreviewMode, setSourcePreviewMode] = useState<string | null>(null); // Source ID being previewed
  const [chatInput, setChatInput] = useState(''); // Chat input state
  
  // Flashcard practice state
  const [isPracticingFlashcards, setIsPracticingFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Sample flashcards data
  const flashcards = [
    {
      question: "What is the function of the cytoskeleton in eukaryotic cells?",
      answer: "The cytoskeleton provides structural support for the cell and is involved in the movement of the cell and its organelles."
    },
    {
      question: "What is metabolism and what are its three main purposes?",
      answer: "Metabolism is the set of life-sustaining chemical reactions in organisms. The three main purposes are: 1) Converting food to energy, 2) Converting food to building blocks for proteins, lipids, nucleic acids, and some carbohydrates, 3) Eliminating metabolic wastes."
    }
  ];

  const sidebarItems = [
    { id: 'sources', icon: Layers, label: 'Sources' },
    { id: 'ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'summary', icon: BookOpen, label: 'Summary' },
    { id: 'study-guide', icon: Brain, label: 'Study Guide' },
    { id: 'quizzes', icon: HelpCircle, label: 'Quizzes' },
    { id: 'flashcards', icon: CreditCard, label: 'Flashcards' }
  ];

  const addNewSource = () => {
    const newSource: Source = {
      id: Date.now().toString(),
      name: `New Source ${sources.length + 1}`,
      type: 'text',
      content: ''
    };
    setSources([...sources, newSource]);
    setActiveSourceId(newSource.id);
  };

  const removeSource = (sourceId: string) => {
    if (sources.length === 1) return; // Don't remove the last source
    const newSources = sources.filter(s => s.id !== sourceId);
    setSources(newSources);
    if (activeSourceId === sourceId) {
      setActiveSourceId(newSources[0].id);
    }
  };

  const activeSource = sources.find(s => s.id === activeSourceId);

  const toggleDrawer = (drawerId: string) => {
    if (activeDrawer === drawerId) {
      setActiveDrawer(null);
      setIsDrawerFullScreen(false);
    } else {
      setActiveDrawer(drawerId);
      setIsDrawerFullScreen(false);
    }
  };

  const toggleFullScreen = () => {
    setIsDrawerFullScreen(!isDrawerFullScreen);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'link': return Link;
      case 'audio': return Volume2;
      default: return FileText;
    }
  };

  const toolTabs = [
    { id: 'ai-chat', label: 'Chat', icon: MessageSquare },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleSelectAllSources = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(sources.map(s => s.id));
    }
  };

  const isAllSourcesSelected = selectedSources.length === sources.length;

  const enterSourcePreview = (sourceId: string) => {
    setSourcePreviewMode(sourceId);
    onSourcePreviewModeChange?.(true);
  };

  const exitSourcePreview = () => {
    setSourcePreviewMode(null);
    onSourcePreviewModeChange?.(false);
  };

  const switchPreviewSource = (sourceId: string) => {
    setSourcePreviewMode(sourceId);
  };

  const previewedSource = sourcePreviewMode ? sources.find(s => s.id === sourcePreviewMode) : null;

  // Handle flashcard rating (spaced repetition)
  const handleCardRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // Reset card state for next card
    setIsCardFlipped(false);
    
    // Move to next card or finish
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Finished all cards, go back to deck list
      setIsPracticingFlashcards(false);
      setCurrentCardIndex(0);
    }
    
    // Here you would implement the actual spaced repetition algorithm
    // For now, we just move to the next card
    console.log(`Card rated as: ${rating}`);
  };

  return (
    <div className="flex-1 bg-white transition-all duration-300 relative">
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>


      {/* Source Preview Mode Layout */}
      {sourcePreviewMode && previewedSource && (
        <div className="h-full flex">
          {/* Main Tools Content - Fixed quarter width */}
          <div className="w-1/4 flex flex-col border-r border-neutral-200">
            {/* Document Header */}
            <div className="px-4 pt-4 pb-4">
              <h1 className="text-base font-normal text-neutral-900 mb-4" style={{ fontSize: '16px', fontWeight: 400 }}>
                {studySetName}
              </h1>

              {/* Tool Tabs - New Design */}
              <div className="w-full">
                <div className="bg-neutral-100 rounded-full p-1 flex items-center gap-1">
                  {toolTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveToolTab(tab.id)}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all duration-200 rounded-full",
                          activeToolTab === tab.id
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tool Content */}
            <div className="flex-1 flex flex-col px-4 py-4">
              {/* Simplified content for preview mode */}
              {activeToolTab === 'ai-chat' && (
                <div className="flex-1 flex flex-col h-full">
                  {/* Centered AI Tutor Content */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {/* AI Tutor Welcome Section */}
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-2">Learn with the AI Tutor</h2>
                    <p className="text-sm text-neutral-600 mb-6">Get personalized help with your sources</p>

                    {/* AI Tutor Action Buttons */}
                    <div className="space-y-3 w-full">
                      {/* First Row */}
                      <div className="flex justify-center gap-2">
                        <button className="px-4 py-2 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Quiz
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Mind Map
                        </button>
                      </div>
                      
                      {/* Second Row */}
                      <div className="flex justify-center gap-2">
                        <button className="px-4 py-2 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Flashcards
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input Box - Pushed to Bottom */}
                  <div className="w-full mt-auto">
                    <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-sm">
                      {/* Main Input Area */}
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Learn anything"
                          className="w-full px-2 py-1 text-xs focus:outline-none resize-none"
                        />
                      </div>
                      
                      {/* Bottom Row - Controls */}
                      <div className="flex items-center justify-between">
                        {/* Left Side - AI Model Selector and Add Context */}
                        <div className="flex items-center gap-2">
                          <button className="px-2 py-1 text-xs text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors flex items-center gap-1">
                            <span>Gemini 2.5 Flash</span>
                            <ChevronDown className="w-3 h-3 text-neutral-500" />
                          </button>
                          <button className="px-2 py-1 text-xs text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors">
                            @ Add Context
                          </button>
                        </div>
                        
                        {/* Right Side - Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors" title="Attach file">
                            <Paperclip className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors" title="Voice input">
                            <Mic className="w-3 h-3" />
                          </button>
                          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center text-xs text-neutral-500 mt-2">
                      AI can make mistakes. Check important info.
                    </div>
                  </div>
                </div>
              )}

              {activeToolTab === 'flashcards' && (
                <div className="flex-1 flex flex-col">
                  {/* My Decks Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">My Decks</h2>
                    
                    {/* Decks List */}
                    <div className="space-y-3">
                      {/* Sample Deck - Replace with actual data */}
                      <div 
                        className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                        onClick={() => setIsPracticingFlashcards(true)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-neutral-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">Biology Chapter 5</h3>
                              <p className="text-sm text-neutral-500">24 cards • Last studied 2 days ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Another Sample Deck */}
                      <div 
                        className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                        onClick={() => setIsPracticingFlashcards(true)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-neutral-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-neutral-900">Math Formulas</h3>
                              <p className="text-sm text-neutral-500">18 cards • Last studied 1 week ago</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Flashcards Button */}
                  <div className="flex justify-center">
                                              <button className="px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors font-medium">
                            Generate Flashcards
                          </button>
                  </div>
                </div>
              )}

              {activeToolTab === 'notes' && (
                <div className="w-full h-full">
                  <NotesEditor />
                </div>
              )}

              {!['ai-chat', 'flashcards', 'notes'].includes(activeToolTab) && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-neutral-300">
                    {React.createElement(toolTabs.find(tab => tab.id === activeToolTab)?.icon || FileText, {
                      className: "w-full h-full"
                    })}
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-2">{toolTabs.find(tab => tab.id === activeToolTab)?.label}</h2>
                  <p className="text-sm text-neutral-600 mb-4">Coming soon</p>
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors text-sm">
                    Get Notified
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Source Preview Content - Adjusts width based on sidebar state */}
          <div className="flex flex-col" style={{
            width: isSourcesDrawerOpen ? 'calc(75% - 320px)' : 'calc(75% - 64px)'
          }}>
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h1 className="text-xl font-semibold text-neutral-900 truncate">
                {previewedSource.name}
              </h1>
              
              {/* Exit Button Only */}
              <button
                onClick={exitSourcePreview}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                title="Exit preview"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden">
              {previewedSource.type === 'link' ? (
                <iframe
                  src={previewedSource.url}
                  className="w-full h-full border-0"
                  title={previewedSource.name}
                />
              ) : (
                <div className="p-8 h-full flex items-center justify-center">
                  <div className="text-center text-neutral-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg mb-2">No preview available</p>
                    <p className="text-sm">This source type doesn't support preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sources Drawer - Can be expanded or collapsed in preview mode */}
          <div className={cn(
            "bg-white border-l border-neutral-200 flex flex-col transition-all duration-300",
            isSourcesDrawerOpen ? "w-80" : "w-16"
          )}>
            {isSourcesDrawerOpen ? (
              // Expanded Sources Drawer in Preview Mode
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-semibold text-neutral-900">Sources</h2>
                  <button
                    onClick={() => setIsSourcesDrawerOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {/* Select All */}
                    <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                      <input
                        type="checkbox"
                        id="select-all-preview"
                        checked={isAllSourcesSelected}
                        onChange={toggleSelectAllSources}
                        className="w-4 h-4 text-neutral-900 bg-neutral-100 border-neutral-300 rounded focus:ring-neutral-500"
                      />
                      <label htmlFor="select-all-preview" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        Select All Sources
                      </label>
                    </div>

                    <button className="w-full p-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-neutral-400 transition-colors text-sm">
                      + Add new source
                    </button>
                    
                    {sources.map((source) => {
                      const Icon = getSourceIcon(source.type);
                      const isActive = sourcePreviewMode === source.id;
                      return (
                        <div 
                          key={source.id}
                          onClick={() => switchPreviewSource(source.id)}
                          className={cn(
                            "p-3 border border-neutral-200 rounded-lg transition-colors duration-200 cursor-pointer group",
                            isActive ? "bg-neutral-100 border-neutral-300" : "hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {/* Source Type Icon */}
                            <div className="relative w-4 h-4 flex-shrink-0">
                              <Icon className="w-4 h-4 absolute inset-0 transition-all duration-200 opacity-100 group-hover:opacity-0 text-neutral-600" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show source options menu here
                                }}
                                className="absolute inset-0 w-4 h-4 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Source options"
                              >
                                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                              </button>
                            </div>

                            {/* Source Name */}
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-neutral-900 truncate block">
                                {source.name}
                              </span>
                            </div>

                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              id={`source-preview-${source.id}`}
                              checked={selectedSources.includes(source.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleSourceSelection(source.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-neutral-900 bg-neutral-100 border-neutral-300 rounded focus:ring-neutral-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Collapsed Sources Drawer in Preview Mode
              <div className="h-full flex flex-col items-center py-4 gap-3">
                <button
                  onClick={() => setIsSourcesDrawerOpen(true)}
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                  title="Open sources"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                {sources.map((source) => {
                  const Icon = getSourceIcon(source.type);
                  const isActive = sourcePreviewMode === source.id;
                  return (
                    <button
                      key={source.id}
                      onClick={() => switchPreviewSource(source.id)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors relative",
                        isActive 
                          ? "bg-neutral-900 text-white" 
                          : "hover:bg-neutral-100 text-neutral-600"
                      )}
                      title={source.name}
                    >
                      <Icon className="w-5 h-5" />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors border-2 border-dashed border-neutral-300 hover:border-neutral-400"
                  title="Add source"
                >
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Normal Document Layout - Only render when NOT in preview mode */}
      {!sourcePreviewMode && (
        <div className="h-full flex">
          {/* Main Tools Content */}
          <div className="flex-1 flex flex-col">
            {/* Document Header */}
            <div className="px-4 pt-4 pb-4">
              <h1 className="text-base font-normal text-neutral-900 mb-4" style={{ fontSize: '16px', fontWeight: 400 }}>
                {studySetName}
              </h1>
              
              {/* Tool Tabs */}
              <div className="flex justify-center">
                <div className="bg-neutral-100 rounded-full p-1 flex items-center gap-1">
                  {toolTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveToolTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full",
                          activeToolTab === tab.id
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tool Content */}
            <div
              className="flex-1 flex flex-col transition-all duration-300"
            >
              <div className="w-full h-full flex flex-col pb-6" style={{ maxWidth: '896px', margin: '0 auto' }}>
                {/* Content for each tool tab */}
                {activeToolTab === 'ai-chat' && (
                  <div className="flex-1 flex flex-col items-center">
                    {/* Centered AI Tutor Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      {/* AI Tutor Welcome Section */}
                      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-10 h-10 text-neutral-400" />
                      </div>
                      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Learn with the AI Tutor</h2>
                      <p className="text-neutral-600 mb-8">Get personalized help with your study materials</p>

                      
                    </div>

                    {/* Chat Input Box - Pushed to Bottom */}
                    <div className="w-full mt-auto" style={{ maxWidth: '896px' }}>
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                        {/* Main Input Area */}
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Learn anything"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
                          />
                        </div>
                        
                        {/* Bottom Row - Controls */}
                        <div className="flex items-center justify-between">
                          {/* Left Side - AI Model Selector and Add Context */}
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors flex items-center gap-2">
                              <span>Gemini 2.5 Flash</span>
                              <ChevronDown className="w-4 h-4 text-neutral-500" />
                            </button>
                            <button className="px-3 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors">
                              @ Add Context
                            </button>
                          </div>
                          
                          {/* Right Side - Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors" title="Attach file">
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors" title="Voice input">
                              <Mic className="w-4 h-4" />
                            </button>
                            <button 
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                chatInput.trim() 
                                  ? "bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer" 
                                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                              )}
                              disabled={!chatInput.trim()}
                            >
                              <ArrowUp className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Disclaimer */}
                      <div className="text-center text-xs text-neutral-500 mt-3">
                        AI can make mistakes. Check important info.
                      </div>
                    </div>
                  </div>
                )}

                {activeToolTab === 'flashcards' && (
                  <div className="flex-1 flex flex-col">
                    {!isPracticingFlashcards ? (
                      <>
                        {/* My Decks Section */}
                        <div className="mb-8">
                          <h2 className="text-xl font-semibold text-neutral-900 mb-4">My Decks</h2>
                          
                          {/* Decks List */}
                          <div className="space-y-3">
                            {/* Sample Deck - Replace with actual data */}
                            <div 
                              className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                              onClick={() => setIsPracticingFlashcards(true)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-neutral-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-neutral-900">Biology Chapter 5</h3>
                                    <p className="text-sm text-neutral-500">24 cards • Last studied 2 days ago</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle edit
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle delete
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Another Sample Deck */}
                            <div 
                              className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                              onClick={() => setIsPracticingFlashcards(true)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-neutral-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-neutral-900">Math Formulas</h3>
                                    <p className="text-sm text-neutral-500">18 cards • Last studied 1 week ago</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle edit
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle delete
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Generate Flashcards Button */}
                        <div className="flex justify-center">
                          <button className="px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Generate Flashcards
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Flashcard Practice Interface */
                      <div className="flex-1 flex flex-col">
                                      {/* Top Navigation */}
              <div className="mb-3">
                {/* Back Button */}
                <button 
                  onClick={() => setIsPracticingFlashcards(false)}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2 mb-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                
                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>{currentCardIndex + 1}</span>
                    <span>{flashcards.length}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

                        {/* Flashcard */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="relative w-full max-w-4xl" style={{ aspectRatio: '760/456' }}>
                            {/* Card Container with 3D Flip */}
                            <div 
                              className={`w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                                isCardFlipped ? 'rotate-y-180' : ''
                              }`}
                              onClick={() => setIsCardFlipped(!isCardFlipped)}
                            >
                              {/* Front of Card */}
                              <div className="absolute inset-0 w-full h-full bg-white border border-neutral-200 rounded-lg p-12 shadow-sm backface-hidden">
                                {/* Hint Toggle Button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHint(!showHint);
                                  }}
                                  className="absolute top-6 left-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                                >
                                  <HelpCircle className="w-4 h-4" />
                                  {showHint ? 'Hide' : 'Hint'}
                                </button>

                                {/* Question Content */}
                                <div className="text-center h-full flex flex-col items-center justify-center">
                                  <h2 className="text-2xl font-medium text-neutral-900 px-8 mb-4">
                                    {flashcards[currentCardIndex]?.question}
                                  </h2>
                                  {showHint && (
                                    <div className="text-sm text-neutral-600">
                                      <span className="font-medium">Hint:</span> This is a sample hint for the question.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Back of Card */}
                              <div className="absolute inset-0 w-full h-full bg-white border border-neutral-200 rounded-lg p-12 shadow-sm backface-hidden rotate-y-180">
                                {/* Explanation Toggle Button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExplanation(!showExplanation);
                                  }}
                                  className="absolute top-6 left-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                                >
                                  <HelpCircle className="w-4 h-4" />
                                  {showExplanation ? 'Hide' : 'Explanation'}
                                </button>

                                {/* Answer Content */}
                                <div className="text-center h-full flex flex-col items-center justify-center">
                                  <h2 className="text-2xl font-medium text-neutral-900 px-8 mb-4">
                                    {flashcards[currentCardIndex]?.answer}
                                  </h2>
                                  {showExplanation && (
                                    <div className="text-sm text-neutral-600">
                                      <span className="font-medium">Explanation:</span> This is a sample explanation for the answer.
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Show Answer Button - Outside and below the card */}
                          {!isCardFlipped && (
                            <div className="mt-6 text-center">
                                                              <button 
                                  onClick={() => setIsCardFlipped(true)}
                                  className="px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                                >
                                  Show Answer
                                </button>
                            </div>
                          )}

                          {/* Rating Buttons - Outside and below the card */}
                          {isCardFlipped && (
                            <div className="mt-6 text-center">
                              <div className="flex justify-center gap-3">
                                <button 
                                  onClick={() => handleCardRating('again')}
                                  className="px-6 py-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors border border-red-200"
                                >
                                  <div className="text-sm font-medium">Again</div>
                                  <div className="text-xs">1 minute</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('hard')}
                                  className="px-6 py-3 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition-colors border border-yellow-200"
                                >
                                  <div className="text-sm font-medium">Hard</div>
                                  <div className="text-xs">8 minutes</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('good')}
                                  className="px-6 py-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors border border-green-200"
                                >
                                  <div className="text-sm font-medium">Good</div>
                                  <div className="text-xs">15 minutes</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('easy')}
                                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                                >
                                  <div className="text-sm font-medium">Easy</div>
                                  <div className="text-xs">4 days</div>
                                </button>
                              </div>
                            </div>
                          )}


                        </div>


                      </div>
                    )}
                  </div>
                )}

                {activeToolTab === 'notes' && (
                  <div className="w-full h-full">
                    <NotesEditor />
                  </div>
                )}

                {!['ai-chat', 'flashcards', 'notes'].includes(activeToolTab) && (
                  <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {React.createElement(toolTabs.find(tab => tab.id === activeToolTab)?.icon || FileText, {
                        className: "w-10 h-10 text-neutral-400"
                      })}
                    </div>
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                      {toolTabs.find(tab => tab.id === activeToolTab)?.label}
                    </h2>
                    <p className="text-neutral-600 mb-8">Coming soon</p>
                    <button className="px-6 py-3 border border-neutral-200 rounded-full text-neutral-700 hover:bg-neutral-50 transition-colors">
                      Get Notified
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

                            {/* Sources Drawer */}
                  <div className={cn(
                    "bg-white border-l border-neutral-200 transition-all duration-300",
                    isSourcesDrawerOpen ? "w-80" : "w-16"
                  )}>
            {isSourcesDrawerOpen ? (
              // Expanded Sources Drawer
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-semibold text-neutral-900">Sources</h2>
                  <button
                    onClick={() => setIsSourcesDrawerOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {/* Select All */}
                    <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-full bg-neutral-50">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={isAllSourcesSelected}
                        onChange={toggleSelectAllSources}
                        className="w-4 h-4 text-neutral-900 bg-neutral-100 border-neutral-300 rounded focus:ring-neutral-500"
                      />
                      <label htmlFor="select-all" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        Select All Sources
                      </label>
                    </div>

                    <button className="w-full p-3 border-2 border-dashed border-neutral-300 rounded-full text-neutral-500 hover:border-neutral-400 transition-colors text-sm">
                      + Add new source
                    </button>
                    
                    {sources.map((source) => {
                      const Icon = getSourceIcon(source.type);
                      return (
                        <div 
                          key={source.id}
                          onClick={() => enterSourcePreview(source.id)}
                          className="p-3 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Source Type Icon */}
                            <div className="relative w-4 h-4 flex-shrink-0">
                              <Icon className="w-4 h-4 absolute inset-0 transition-all duration-200 opacity-100 group-hover:opacity-0 text-neutral-600" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show source options menu here
                                }}
                                className="absolute inset-0 w-4 h-4 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Source options"
                              >
                                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                              </button>
                            </div>

                            {/* Source Name */}
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-neutral-900 truncate block">
                                {source.name}
                              </span>
                            </div>

                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              id={`source-${source.id}`}
                              checked={selectedSources.includes(source.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleSourceSelection(source.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-neutral-900 bg-neutral-100 border-neutral-300 rounded focus:ring-neutral-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Collapsed Sources Drawer
              <div className="h-full flex flex-col items-center py-4 gap-3">
                <button
                  onClick={() => setIsSourcesDrawerOpen(true)}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  title="Open sources"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                {sources.map((source) => {
                  const Icon = getSourceIcon(source.type);
                  const isSelected = selectedSources.includes(source.id);
                  return (
                    <button
                      key={source.id}
                      onClick={() => enterSourcePreview(source.id)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-lg transition-colors relative",
                        isSelected 
                          ? "bg-neutral-200 text-neutral-900" 
                          : "hover:bg-neutral-100 text-neutral-600"
                      )}
                      title={`${source.name} - Click to preview`}
                    >
                      <Icon className="w-5 h-5" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors border-2 border-dashed border-neutral-300 hover:border-neutral-400"
                  title="Add source"
                >
                  <Plus className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

     </div>
   );
 };

export default DocumentPage;
