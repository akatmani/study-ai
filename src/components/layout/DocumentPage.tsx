import React, { useState, useEffect, useRef } from 'react';
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
  Link,
  Volume2,
  ChevronLeft,
  ArrowUp,
  Paperclip,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

import FloatingSourcesTabs from '../FloatingSourcesTabs';
import FloatingAIChat from '../FloatingAIChat';
import BlockNoteEditor from '../BlockNoteEditor';

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

  const [activeToolTab, setActiveToolTab] = useState('ai-chat');
  const [selectedSources, setSelectedSources] = useState<string[]>(['1']); // Start with first source selected
  const [sourcePreviewMode, setSourcePreviewMode] = useState<string | null>(null); // Source ID being previewed
  const [chatInput, setChatInput] = useState(''); // Chat input state
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false); // Track sources bar expansion state
  
  // Flashcard practice state
  const [isPracticingFlashcards, setIsPracticingFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
     // Quiz practice state
   const [isPracticingQuiz, setIsPracticingQuiz] = useState(false);
   const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
   const [showQuizAnswer, setShowQuizAnswer] = useState(false);
   const [showQuizHint, setShowQuizHint] = useState(false);
   const [showQuizExplanation, setShowQuizExplanation] = useState(false);
   const [selectedAnswer, setSelectedAnswer] = useState<string>('');
   const [writtenAnswer, setWrittenAnswer] = useState<string>('');
   const [clickedIDontKnow, setClickedIDontKnow] = useState(false);
   
     // Summary and Study Guide state
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedStudyGuide, setSelectedStudyGuide] = useState<string | null>(null);
  

  
  // Notes state
  const [notes, setNotes] = useState([
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
  const [selectedNote, setSelectedNote] = useState<any>(null);
  
  // Helper function for formatting time
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
  
  // Chat selector state
  const [selectedChat, setSelectedChat] = useState('greeting');
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false);
  const chatDropdownRef = useRef<HTMLDivElement>(null);
  


  // Control floating AI chat visibility
  const showFloatingAIChat = !sourcePreviewMode && 
                              activeToolTab !== 'ai-chat' && 
                              ((activeToolTab === 'summary' && selectedSummary !== null) || 
                               (activeToolTab === 'study-guide' && selectedStudyGuide !== null) || 
                               (activeToolTab === 'notes' && selectedNote !== null) ||
                               isPracticingFlashcards || 
                               isPracticingQuiz);

  // Handle click outside chat dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target as Node)) {
        setIsChatDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
  
     // Sample quiz data - Separate quizzes by type
   const multipleChoiceQuiz = [
     {
       id: 1,
       type: 'multiple-choice',
       question: "What is the primary function of mitochondria in cells?",
       options: {
         a: "Protein synthesis",
         b: "Energy production through cellular respiration",
         c: "DNA replication",
         d: "Waste removal"
       },
       correctAnswer: "b",
       answer: "Mitochondria are the powerhouse of the cell, producing energy through cellular respiration.",
       hint: "Think about what cells need most to function.",
       explanation: "Mitochondria contain enzymes that break down glucose and other molecules to produce ATP, the cell's energy currency."
     },
     {
       id: 2,
       type: 'multiple-choice',
       question: "Which of the following is NOT a function of the cell membrane?",
       options: {
         a: "Protecting the cell contents",
         b: "Controlling what enters and exits the cell",
         c: "Producing energy for the cell",
         d: "Maintaining cell shape"
       },
       correctAnswer: "c",
       answer: "The cell membrane does not produce energy; it regulates transport and provides protection.",
       hint: "Consider what the membrane is made of and its structure.",
       explanation: "The cell membrane is primarily composed of phospholipids and proteins that control transport and provide structure, but energy production occurs in organelles like mitochondria."
     },
     {
       id: 3,
       type: 'multiple-choice',
       question: "What is the main function of chloroplasts in plant cells?",
       options: {
         a: "Cellular respiration",
         b: "Photosynthesis",
         c: "Protein synthesis",
         d: "Waste removal"
       },
       correctAnswer: "b",
       answer: "Chloroplasts are responsible for photosynthesis, converting light energy into chemical energy.",
       hint: "Think about what makes plants green and how they make their own food.",
       explanation: "Chloroplasts contain chlorophyll, which captures light energy and uses it to convert CO2 and H2O into glucose and oxygen through photosynthesis."
     }
   ];

   const writtenQuiz = [
     {
       id: 1,
       type: 'written',
       question: "Explain the process of photosynthesis in 2-3 sentences.",
       answer: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs in the chloroplasts and is essential for plant growth and providing oxygen for other organisms.",
       hint: "Focus on the inputs (what goes in) and outputs (what comes out).",
       explanation: "Photosynthesis involves light-dependent and light-independent reactions, with chlorophyll capturing light energy to drive the conversion of CO2 and H2O into glucose."
     },
     {
       id: 2,
       type: 'written',
       question: "Describe the structure and function of the cell membrane in detail.",
       answer: "The cell membrane is a phospholipid bilayer that surrounds the cell and regulates what enters and exits. It contains embedded proteins that help with transport and communication, and provides structural support while maintaining cell shape.",
       hint: "Think about the membrane's composition and its role as a barrier.",
       explanation: "The phospholipid bilayer creates a semi-permeable barrier, while membrane proteins facilitate selective transport of molecules and ions across the membrane."
     },
     {
       id: 3,
       type: 'written',
       question: "What is the difference between prokaryotic and eukaryotic cells?",
       answer: "Prokaryotic cells lack a nucleus and membrane-bound organelles, while eukaryotic cells have both. Prokaryotes are typically smaller and simpler, while eukaryotes are larger and more complex with specialized organelles.",
       hint: "Compare the internal structure and complexity of these cell types.",
       explanation: "Prokaryotes represent the earliest form of life and are found in bacteria and archaea, while eukaryotes evolved later and include all plants, animals, fungi, and protists."
     }
   ];

   // Current quiz being practiced
   const [currentQuizType, setCurrentQuizType] = useState<'multiple-choice' | 'written' | null>(null);
   const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

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
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'study-guide', label: 'Study Guide', icon: Brain },
    { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
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
  
  // Handle quiz navigation and answers
  const handleQuizAnswer = () => {
    if (hasAnswered()) {
      // User submitted an answer
      setClickedIDontKnow(false);
    } else {
      // User clicked "I Don't Know"
      setClickedIDontKnow(true);
    }
    setShowQuizAnswer(true);
  };
  
     const handleQuizNext = () => {
     if (currentQuizIndex < quizQuestions.length - 1) {
       setCurrentQuizIndex(currentQuizIndex + 1);
       setShowQuizAnswer(false);
       setSelectedAnswer('');
       setWrittenAnswer('');
       setShowQuizHint(false);
       setShowQuizExplanation(false);
       setClickedIDontKnow(false);
     } else {
       // Finished all questions, go back to quiz list
       setIsPracticingQuiz(false);
       setCurrentQuizIndex(0);
       setShowQuizAnswer(false);
       setSelectedAnswer('');
       setWrittenAnswer('');
       setClickedIDontKnow(false);
       setCurrentQuizType(null);
       setQuizQuestions([]);
     }
   };
  
  const handleQuizBack = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowQuizAnswer(false);
      setSelectedAnswer('');
      setWrittenAnswer('');
      setShowQuizHint(false);
      setShowQuizExplanation(false);
      setClickedIDontKnow(false);
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const handleWrittenAnswerChange = (answer: string) => {
    setWrittenAnswer(answer);
  };
  
     const hasAnswered = () => {
     const currentQuestion = quizQuestions[currentQuizIndex];
     if (!currentQuestion) return false;
     
     if (currentQuestion.type === 'multiple-choice') {
       return selectedAnswer !== '';
     } else {
       return writtenAnswer.trim() !== '';
     }
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
        <div className="h-full flex bg-neutral-50">
          {/* Main Tools Content - Floating with rounded corners */}
          <div className="w-1/4 flex flex-col mr-4">
            {/* Floating Main Tools Container */}
            <div className="mt-4 mb-4 bg-white border border-neutral-200 rounded-lg flex-1 flex flex-col overflow-hidden relative">
              {/* Menu Button - Top Right */}
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors z-10">
                <MoreHorizontal className="w-5 h-5 text-neutral-600" />
              </button>
              
            {/* Document Header */}
            <div className="px-4 pt-4 pb-4">
                <div className="mb-4">
                  <h1 className="text-base font-normal text-neutral-900" style={{ fontSize: '18px', fontWeight: 400 }}>
                {studySetName}
              </h1>
                </div>

              {/* Tool Tabs - Compact Design for Preview Mode */}
              <div className="w-full flex justify-center mb-4">
                <div className="bg-neutral-100 rounded-full p-1 flex items-center gap-1">
                  {toolTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveToolTab(tab.id)}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 text-xs font-medium transition-all duration-200 rounded-full",
                          activeToolTab === tab.id
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                        )}
                        title={tab.label}
                      >
                        <Icon className="w-5 h-5" />
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
                        <button className="px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Quiz
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Mind Map
                        </button>
                      </div>
                      
                      {/* Second Row */}
                      <div className="flex justify-center gap-2">
                        <button className="px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
                          Flashcards
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors">
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
                        {/* Left Side - Add Context */}
                        <div className="flex items-center gap-2">
                          <button className="px-2 py-1 text-xs text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                            @ Add Context
                          </button>
                        </div>
                        
                        {/* Right Side - Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Attach file">
                            <Paperclip className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Voice input">
                            <Mic className="w-3 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
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
                  {!isPracticingFlashcards ? (
                    <>
                      {/* My Decks Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">My Decks</h2>
                          <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Generate Flashcards
                          </button>
                        </div>
                        
                        {/* Decks List */}
                        <div className="space-y-4">
                          {/* Sample Deck - Replace with actual data */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => setIsPracticingFlashcards(true)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <CreditCard className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Biology Chapter 5</h3>
                                  <p className="text-sm text-neutral-500">24 cards</p>
                                  <p className="text-xs text-neutral-400">2 days ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <CreditCard className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Math Formulas</h3>
                                  <p className="text-sm text-neutral-500">18 cards</p>
                                  <p className="text-xs text-neutral-400">1 week ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                    </>
                  ) : (
                    /* Flashcard Practice Display */
                    <div className="flex-1 flex flex-col">
                      {/* Top Navigation */}
                      <div className="mb-3 mt-12">
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
                        <div className="relative w-full max-w-2xl">
                          {/* Card Container with 3D Flip */}
                          <div 
                            className={`w-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                              isCardFlipped ? 'rotate-y-180' : ''
                            }`}
                            onClick={() => setIsCardFlipped(!isCardFlipped)}
                          >
                            {/* Front of Card */}
                            <div className="absolute inset-0 w-full bg-white border border-neutral-200 rounded-lg p-8 shadow-sm backface-hidden">
                              {/* Hint Toggle Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowHint(!showHint);
                                }}
                                className="absolute top-4 left-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                              >
                                <HelpCircle className="w-4 h-4" />
                                {showHint ? 'Hide' : 'Hint'}
                              </button>

                              {/* Question Content */}
                              <div className="text-center h-full flex flex-col items-center justify-center">
                                <h2 className="text-xl font-medium text-neutral-900 px-8 mb-4">
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
                            <div className="absolute inset-0 w-full bg-white border border-neutral-200 rounded-lg p-8 shadow-sm backface-hidden rotate-y-180">
                              {/* Explanation Toggle Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowExplanation(!showExplanation);
                                }}
                                className="absolute top-4 left-4 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                              >
                                <HelpCircle className="w-4 h-4" />
                                {showExplanation ? 'Hide' : 'Explanation'}
                              </button>

                              {/* Answer Content */}
                              <div className="text-center h-full flex flex-col items-center justify-center">
                                <h2 className="text-xl font-medium text-neutral-900 px-8 mb-4">
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
                              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
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
                                className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                              >
                                <div className="text-sm font-medium">Again</div>
                                <div className="text-xs">1 minute</div>
                              </button>
                              <button 
                                onClick={() => handleCardRating('hard')}
                                className="px-6 py-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
                              >
                                <div className="text-sm font-medium">Hard</div>
                                <div className="text-xs">8 minutes</div>
                              </button>
                              <button 
                                onClick={() => handleCardRating('good')}
                                className="px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                              >
                                <div className="text-sm font-medium">Good</div>
                                <div className="text-xs">15 minutes</div>
                              </button>
                              <button 
                                onClick={() => handleCardRating('easy')}
                                className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
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

              {activeToolTab === 'summary' && (
                <div className="flex-1 flex flex-col">
                  {!selectedSummary ? (
                    <>
                      {/* My Summaries Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">My Summaries</h2>
                          <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Generate Summary
                          </button>
                        </div>
                        
                        {/* Summaries List */}
                        <div className="space-y-4">
                          {/* Sample Summary */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => setSelectedSummary('biology-chapter-1')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Biology Chapter 1</h3>
                                  <p className="text-sm text-neutral-500">3 pages</p>
                                  <p className="text-xs text-neutral-400">2 days ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit summary');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete summary');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Another Sample Summary */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => setSelectedSummary('math-calculus')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Math Calculus</h3>
                                  <p className="text-sm text-neutral-500">5 pages</p>
                                  <p className="text-xs text-neutral-400">1 week ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit summary');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete summary');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Summary Content Display */
                    <div className="flex-1 flex flex-col">
                      {/* Top Navigation */}
                      <div className="mb-3 flex items-center justify-between">
                        {/* Back Button */}
                        <button 
                          onClick={() => setSelectedSummary(null)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                        
                        {/* Copy Button */}
                        <button 
                          onClick={() => {
                            // Copy the summary content to clipboard
                            const content = selectedSummary === 'biology-chapter-1' 
                              ? 'Biology Chapter 1: Introduction to Cell Biology...' // Full content would go here
                              : 'Calculus: Fundamental Concepts and Applications...';
                            navigator.clipboard.writeText(content);
                          }}
                          className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Summary
                        </button>
                      </div>

                      {/* Summary Content */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="prose prose-neutral max-w-none">
                          {selectedSummary === 'biology-chapter-1' ? (
                            <>
                              <h1 className="text-2xl font-bold text-neutral-900 mb-6">Biology Chapter 1: Introduction to Cell Biology</h1>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Overview</h2>
                              <p className="text-neutral-700 mb-4 leading-relaxed">
                                Cell biology is the foundation of modern biology, exploring the fundamental units of life. This chapter introduces the basic principles of cellular structure, function, and organization that govern all living organisms.
                              </p>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Key Concepts</h2>
                              <ul className="list-disc pl-6 mb-4 space-y-2">
                                <li className="text-neutral-700">Cells are the basic structural and functional units of all living organisms</li>
                                <li className="text-neutral-700">All cells arise from pre-existing cells through cell division</li>
                                <li className="text-neutral-700">Cells contain genetic material that controls their activities</li>
                                <li className="text-neutral-700">Cells respond to their environment and maintain homeostasis</li>
                              </ul>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Cell Theory</h2>
                              <p className="text-neutral-700 mb-4 leading-relaxed">
                                The cell theory, developed in the 19th century, states that all living things are composed of cells, cells are the basic units of structure and function, and new cells are produced from existing cells.
                              </p>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Conclusion</h2>
                              <p className="text-neutral-700 leading-relaxed">
                                Understanding cell biology provides the foundation for comprehending more complex biological processes, from organism development to disease mechanisms.
                              </p>
                            </>
                          ) : (
                            <>
                              <h1 className="text-2xl font-bold text-neutral-900 mb-6">Calculus: Fundamental Concepts and Applications</h1>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Introduction</h2>
                              <p className="text-neutral-700 mb-4 leading-relaxed">
                                Calculus is a branch of mathematics that deals with continuous change and motion. It provides powerful tools for analyzing and solving problems in physics, engineering, economics, and many other fields.
                              </p>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Core Principles</h2>
                              <ul className="list-disc pl-6 mb-4 space-y-2">
                                <li className="text-neutral-700">Differential calculus studies rates of change and slopes of curves</li>
                                <li className="text-neutral-700">Integral calculus deals with accumulation and areas under curves</li>
                                <li className="text-neutral-700">The fundamental theorem connects these two branches</li>
                                <li className="text-neutral-700">Limits provide the foundation for all calculus concepts</li>
                              </ul>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Applications</h2>
                              <p className="text-neutral-700 mb-4 leading-relaxed">
                                Calculus is essential for understanding motion, optimization, growth and decay, and many natural phenomena. It enables precise mathematical modeling of complex real-world systems.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeToolTab === 'study-guide' && (
                <div className="flex-1 flex flex-col">
                  {!selectedStudyGuide ? (
                    <>
                      {/* My Guides Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">My Guides</h2>
                          <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Generate Guide
                          </button>
                        </div>
                        
                        {/* Guides List */}
                        <div className="space-y-4">
                          {/* Sample Guide */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => setSelectedStudyGuide('biology-guide')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Brain className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Biology Study Guide</h3>
                                  <p className="text-sm text-neutral-500">5 sections</p>
                                  <p className="text-xs text-neutral-400">3 days ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit guide');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete guide');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Another Sample Guide */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => setSelectedStudyGuide('math-formulas')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Brain className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Math Formulas Guide</h3>
                                  <p className="text-sm text-neutral-500">8 sections</p>
                                  <p className="text-xs text-neutral-400">1 week ago</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit guide');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete guide');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Study Guide Content Display */
                    <div className="flex-1 flex flex-col">
                      {/* Top Navigation */}
                      <div className="mb-3 flex items-center justify-between">
                        {/* Back Button */}
                        <button 
                          onClick={() => setSelectedStudyGuide(null)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                        
                        {/* Copy Button */}
                        <button 
                          onClick={() => {
                            // Copy the guide content to clipboard
                            const content = selectedStudyGuide === 'biology-guide' 
                              ? 'Biology Study Guide: Essential Concepts...' // Full content would go here
                              : 'Math Formulas: Essential Reference Guide...';
                            navigator.clipboard.writeText(content);
                          }}
                          className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Guide
                        </button>
                      </div>

                      {/* Study Guide Content */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="prose prose-neutral max-w-none">
                          {selectedStudyGuide === 'biology-guide' ? (
                            <>
                              <h1 className="text-2xl font-bold text-neutral-900 mb-6">Biology Study Guide: Essential Concepts</h1>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">📚 Study Tips</h2>
                              <ul className="list-disc pl-6 mb-4 space-y-2">
                                <li className="text-neutral-700">Focus on understanding concepts rather than memorizing facts</li>
                                <li className="text-neutral-700">Create visual diagrams to understand complex processes</li>
                                <li className="text-neutral-700">Practice with real-world examples and case studies</li>
                                <li className="text-neutral-700">Review regularly to reinforce learning</li>
                              </ul>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">🔬 Key Topics to Master</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                  <h3 className="font-semibold text-neutral-800 mb-2">Cell Structure</h3>
                                  <p className="text-sm text-neutral-600">Organelles, membranes, and cellular organization</p>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                  <h3 className="font-semibold text-neutral-800 mb-2">Genetics</h3>
                                  <p className="text-sm text-neutral-600">DNA, inheritance, and genetic variation</p>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                  <h3 className="font-semibold text-neutral-800 mb-2">Evolution</h3>
                                  <p className="text-sm text-neutral-600">Natural selection and adaptation</p>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                  <h3 className="font-semibold text-neutral-800 mb-2">Ecology</h3>
                                  <p className="text-sm text-neutral-600">Organism interactions and ecosystems</p>
                                </div>
                              </div>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Practice Questions</h2>
                              <p className="text-neutral-700 mb-4 leading-relaxed">
                                Test your understanding with these key questions: What is the difference between prokaryotic and eukaryotic cells? How does natural selection drive evolution? What are the main components of an ecosystem?
                              </p>
                            </>
                          ) : (
                            <>
                              <h1 className="text-2xl font-bold text-neutral-900 mb-6">Math Formulas: Essential Reference Guide</h1>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">📐 Geometry Formulas</h2>
                              <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                                <p className="text-neutral-700 font-mono">Area of Circle: A = πr²</p>
                                <p className="text-neutral-700 font-mono">Area of Triangle: A = ½bh</p>
                                <p className="text-neutral-700 font-mono">Pythagorean Theorem: a² + b² = c²</p>
                              </div>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">🧮 Calculus Formulas</h2>
                              <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                                <p className="text-neutral-700 font-mono">Derivative of xⁿ: d/dx(xⁿ) = nxⁿ⁻¹</p>
                                <p className="text-neutral-700 font-mono">Integral of xⁿ: ∫xⁿdx = (xⁿ⁺¹)/(n+1) + C</p>
                                <p className="text-neutral-700 font-mono">Chain Rule: d/dx(f(g(x))) = f'(g(x)) × g'(x)</p>
                              </div>
                              
                              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Study Strategies</h2>
                              <ul className="list-disc pl-6 mb-4 space-y-2">
                                <li className="text-neutral-700">Practice deriving formulas from basic principles</li>
                                <li className="text-neutral-700">Create flashcards for quick formula recall</li>
                                <li className="text-neutral-700">Apply formulas to real-world problems</li>
                                <li className="text-neutral-700">Review regularly to maintain proficiency</li>
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeToolTab === 'quizzes' && (
                <div className="flex-1 flex flex-col">
                  {!isPracticingQuiz ? (
                    <>
                      {/* My Quizzes Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">My Quizzes</h2>
                          <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Generate Quiz
                          </button>
                        </div>
                        
                        {/* Quizzes List */}
                        <div className="space-y-4">
                          {/* Multiple Choice Quiz */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => {
                              setCurrentQuizType('multiple-choice');
                              setQuizQuestions(multipleChoiceQuiz);
                              setIsPracticingQuiz(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <HelpCircle className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Biology Multiple Choice</h3>
                                  <p className="text-sm text-neutral-500">3 questions</p>
                                  <p className="text-xs text-neutral-400">Multiple choice format</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit quiz');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete quiz');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Written Answer Quiz */}
                          <div 
                            className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                            onClick={() => {
                              setCurrentQuizType('written');
                              setQuizQuestions(writtenQuiz);
                              setIsPracticingQuiz(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <HelpCircle className="w-6 h-6 text-neutral-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-neutral-900">Biology Written Answers</h3>
                                  <p className="text-sm text-neutral-500">3 questions</p>
                                  <p className="text-xs text-neutral-400">Written response format</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit quiz');
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete quiz');
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Quiz Practice Display */
                    <div className="flex-1 flex flex-col">
                      {/* Top Navigation */}
                      <div className="mb-3 mt-12">
                        {/* Back Button */}
                        <button 
                          onClick={() => setIsPracticingQuiz(false)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2 mb-3"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                        
                        {/* Progress Bar */}
                        <div className="w-full">
                          <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                            <span>{currentQuizIndex + 1}</span>
                            <span>{quizQuestions.length}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Question */}
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-2xl">
                          {/* Question Card */}
                          <div className="w-full bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
                            {/* Hint Toggle Button - Top Left */}
                            <div className="absolute top-4 left-4">
                              {/* Hint - Only show before answer */}
                              {!showQuizAnswer && (
                                <button 
                                  onClick={() => setShowQuizHint(!showQuizHint)}
                                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                                >
                                  <HelpCircle className="w-4 h-4" />
                                  {showQuizHint ? 'Hide' : 'Hint'}
                                </button>
                              )}
                            </div>

                            {/* Question Content */}
                            <div className="text-center h-full flex flex-col items-center justify-center">
                              <h2 className="text-xl font-medium text-neutral-900 px-8 mb-6">
                                {quizQuestions[currentQuizIndex]?.question}
                              </h2>
                              
                              {/* Hint Text - Only show before answer */}
                              {!showQuizAnswer && showQuizHint && (
                                <div className="text-sm text-neutral-600 mb-4">
                                  <span className="font-medium">Hint:</span> {quizQuestions[currentQuizIndex]?.hint}
                                </div>
                              )}
                              
                              {/* Multiple Choice Options */}
                              {quizQuestions[currentQuizIndex]?.type === 'multiple-choice' && (
                                <div className="space-y-3 w-full max-w-md">
                                  {Object.entries(quizQuestions[currentQuizIndex]?.options || {}).map(([key, value]) => {
                                    const currentQuestion = quizQuestions[currentQuizIndex];
                                    const isCorrect = key === currentQuestion.correctAnswer;
                                    const isSelected = selectedAnswer === key;
                                    const showAnswer = showQuizAnswer;
                                    
                                    let borderStyle = "border-neutral-200";
                                    if (showAnswer) {
                                      if (isCorrect) {
                                        // Correct answer gets dotted green border
                                        borderStyle = "border-dotted border-green-400";
                                      } else if (isSelected) {
                                        // Selected wrong answer gets solid red border
                                        borderStyle = "border-red-400";
                                      }
                                    } else if (isSelected) {
                                      // Before answer, selected option gets neutral border
                                      borderStyle = "border-neutral-900";
                                    }
                                    
                                    return (
                                      <button
                                        key={key}
                                        onClick={() => !showAnswer && setSelectedAnswer(key)}
                                        disabled={showAnswer}
                                        className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                                          borderStyle
                                        } ${
                                          showAnswer && isCorrect && "bg-green-50"
                                        } ${
                                          showAnswer && isSelected && !isCorrect && "bg-red-50"
                                        } ${
                                          !showAnswer && isSelected && "bg-neutral-50"
                                        } ${
                                          showAnswer && "cursor-not-allowed opacity-80"
                                        }`}
                                      >
                                        <span className="font-medium text-neutral-700 mr-3">{key.toUpperCase()}.</span>
                                        <span className="text-neutral-900">{value as string}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Written Answer Input */}
                              {quizQuestions[currentQuizIndex]?.type === 'written' && (
                                <div className="w-full max-w-md">
                                  <textarea
                                    value={writtenAnswer}
                                    onChange={(e) => setWrittenAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                    rows={4}
                                  />
                                </div>
                              )}

                              {/* Answer Display */}
                              {showQuizAnswer && (
                                <div className="mt-6 w-full max-w-md">
                                  <div className="text-left">
                                    {/* Feedback Card with Icon and Explanation */}
                                    <div className={`p-4 rounded-lg border-2 ${
                                      (() => {
                                        const currentQuestion = quizQuestions[currentQuizIndex];
                                        if (currentQuestion.type === 'multiple-choice') {
                                          if (selectedAnswer === currentQuestion.correctAnswer) {
                                            // User got it right - green
                                            return "bg-green-50 text-green-800 border-green-400";
                                          } else {
                                            // User got it wrong - red
                                            return "bg-red-50 text-red-800 border-red-400";
                                          }
                                        } else {
                                          // For written answers
                                          if (writtenAnswer.trim() !== '') {
                                            return "bg-green-50 text-green-800 border-green-400";
                                          } else {
                                            return "bg-red-50 text-red-800 border-red-400";
                                          }
                                        }
                                      })()
                                    }`}>
                                      {/* Header with Icon and Status */}
                                      <div className="flex items-center gap-3 mb-3">
                                        {/* Icon */}
                                        {(() => {
                                          const currentQuestion = quizQuestions[currentQuizIndex];
                                          if (currentQuestion.type === 'multiple-choice') {
                                            if (selectedAnswer === currentQuestion.correctAnswer) {
                                              return <CheckCircle className="w-5 h-5 text-green-600" />;
                                            } else {
                                              return <XCircle className="w-5 h-5 text-red-600" />;
                                            }
                                          } else {
                                            if (writtenAnswer.trim() !== '') {
                                              return <CheckCircle className="w-5 h-5 text-green-600" />;
                                            } else {
                                              return <XCircle className="w-5 h-5 text-red-600" />;
                                            }
                                          }
                                        })()}
                                        
                                        {/* Status Text */}
                                        <div>
                                          {(() => {
                                            const currentQuestion = quizQuestions[currentQuizIndex];
                                            if (currentQuestion.type === 'multiple-choice') {
                                              if (selectedAnswer === currentQuestion.correctAnswer) {
                                                return <span className="font-medium">Correct!</span>;
                                              } else {
                                                return <span className="font-medium">Incorrect</span>;
                                              }
                                            } else {
                                              if (writtenAnswer.trim() !== '') {
                                                return <span className="font-medium">Answer Submitted</span>;
                                              } else {
                                                return <span className="font-medium">No Answer</span>;
                                              }
                                            }
                                          })()}
                                        </div>
                                      </div>
                                      
                                      {/* Explanation - Inside the card with matching color */}
                                      <p className={`text-sm ${
                                        (() => {
                                          const currentQuestion = quizQuestions[currentQuizIndex];
                                          if (currentQuestion.type === 'multiple-choice') {
                                            if (selectedAnswer === currentQuestion.correctAnswer) {
                                              return "text-green-700";
                                            } else {
                                              return "text-red-700";
                                            }
                                          } else {
                                            if (writtenAnswer.trim() !== '') {
                                              return "text-green-700";
                                            } else {
                                              return "text-red-700";
                                            }
                                          }
                                        })()
                                      }`}>{quizQuestions[currentQuizIndex]?.explanation}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Answer Button */}
                        <div className="mt-6 text-center">
                          <button 
                            onClick={showQuizAnswer ? handleQuizNext : handleQuizAnswer}
                            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                          >
                            {showQuizAnswer ? 'Next' : 'Submit Answer'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeToolTab === 'notes' && (
                <div className="flex-1 flex flex-col">
                  {!selectedNote ? (
                    <>
                      {/* My Notes Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-base font-semibold text-neutral-900">My Notes</h2>
                          <button 
                            onClick={() => {
                              const newNote = {
                                id: Date.now().toString(),
                                title: 'New Note',
                                content: [],
                                lastModified: new Date()
                              };
                              setNotes(prev => [newNote, ...prev]);
                              setSelectedNote(newNote);
                            }}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
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
                              onClick={() => setSelectedNote(note)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-neutral-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-neutral-900">{note.title}</h3>
                                    <p className="text-sm text-neutral-500">Note</p>
                                    <p className="text-xs text-neutral-400">{formatTimeAgo(note.lastModified)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle edit
                                      console.log('Edit note');
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle delete
                                      setNotes(prev => prev.filter(n => n.id !== note.id));
                                    }}
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
                    /* Note Content Display */
                    <div className="flex-1 flex flex-col">
                      {/* Top Navigation */}
                      <div className="mb-3 flex items-center justify-between">
                        {/* Back Button */}
                        <button 
                          onClick={() => setSelectedNote(null)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                        
                        {/* Convert to Source Button */}
                        <button 
                          onClick={() => {
                            // Handle convert to source
                            console.log('Convert note to source:', selectedNote);
                          }}
                          className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                        >
                          <Link className="w-4 h-4" />
                          Convert to Source
                        </button>
                      </div>

                      {/* Note Content */}
                      <div className="flex-1 overflow-y-auto">
                        <BlockNoteEditor
                          initialContent={selectedNote.content}
                          onChange={(content: any) => {
                            setNotes(prev => prev.map(note => 
                              note.id === selectedNote.id 
                                ? { ...note, content, lastModified: new Date() }
                                : note
                            ));
                          }}
                          noteName={selectedNote.title}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!['ai-chat', 'summary', 'study-guide', 'flashcards', 'quizzes', 'notes'].includes(activeToolTab) && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-neutral-300">
                    {React.createElement(toolTabs.find(tab => tab.id === activeToolTab)?.icon || FileText, {
                      className: "w-full h-full"
                    })}
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-2">{toolTabs.find(tab => tab.id === activeToolTab)?.label}</h2>
                  <p className="text-sm text-neutral-600 mb-4">Coming soon</p>
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                    Get Notified
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Source Preview Content - Floating with rounded corners */}
          <div className="flex-1 flex flex-col">
            {/* Floating Source Preview Container */}
            <div className={cn(
              "mt-4 mb-4 bg-white border border-neutral-200 rounded-lg flex-1 flex flex-col overflow-hidden",
              isSourcesExpanded ? "w-[calc(100%-352px)]" : "w-[calc(100%-96px)]"
            )}>
            {/* Preview Header */}
            <div className="px-4 pt-4 pb-4">
              {/* Source Name with Exit Button */}
              <div className="flex items-center gap-3 mb-4">
                {/* Exit Button */}
                <button
                  onClick={exitSourcePreview}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                  title="Exit preview"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
                
                {/* Source Name */}
                <h1 className="text-base font-normal text-neutral-900" style={{ fontSize: '18px', fontWeight: 400 }}>
                  {previewedSource.name}
                </h1>
              </div>
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
                </div>
                
          {/* Floating Sources Tabs in Preview Mode */}
          <FloatingSourcesTabs
            sources={sources}
            selectedSources={selectedSources}
            onSourceSelect={setActiveSourceId}
            onSourceSelectionToggle={toggleSourceSelection}
            onSelectAllSources={toggleSelectAllSources}
            onAddSource={addNewSource}
            onSourcePreview={switchPreviewSource}
            onExpansionChange={setIsSourcesExpanded}
            isExpanded={isSourcesExpanded}
          />
                </div>
      )}

      {/* Normal Document Layout - Only render when NOT in preview mode */}
      {!sourcePreviewMode && (
        <div className="h-full flex bg-neutral-50">
          {/* Main Tools Content - Floating with rounded corners */}
          <div className="flex-1 flex flex-col transition-all duration-300">
            {/* Floating Sources Tabs */}
            <FloatingSourcesTabs
              sources={sources}
              selectedSources={selectedSources}
              onSourceSelect={setActiveSourceId}
              onSourceSelectionToggle={toggleSourceSelection}
              onSelectAllSources={toggleSelectAllSources}
              onAddSource={addNewSource}
              onSourcePreview={enterSourcePreview}
              onExpansionChange={setIsSourcesExpanded}
              isExpanded={isSourcesExpanded}
            />
            
            {/* Floating Main Content Container */}
            <div className={cn(
              "mt-4 mb-4 bg-white border border-neutral-200 rounded-lg flex-1 flex flex-col overflow-hidden relative",
              isSourcesExpanded ? "w-[calc(100%-352px)]" : "w-[calc(100%-96px)]"
            )}>
              {/* Menu Button - Top Right */}
              <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors z-10">
                                  <MoreHorizontal className="w-5 h-5 text-neutral-600" />
                                </button>
              
            {/* Document Header */}
            <div className="px-4 pt-4 pb-4">
              <div className="mb-4">
                <h1 className="text-base font-normal text-neutral-900" style={{ fontSize: '18px', fontWeight: 400 }}>
                {studySetName}
              </h1>
              </div>
              
              {/* Tool Tabs */}
              <div className="flex justify-center">
                <div className="bg-neutral-100 rounded-lg p-1 flex items-center gap-1">
                  {toolTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveToolTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
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
              <div className="w-full h-full flex flex-col pb-6" style={{ maxWidth: '864px', margin: '0 auto' }}>
                {/* Content for each tool tab */}
                {activeToolTab === 'ai-chat' && (
                  <div className="flex-1 flex flex-col items-center">
                    {/* Chat Selector Header */}
                    <div className="w-full mt-12 mb-6" style={{ maxWidth: '864px' }}>
                      <div className="flex items-center justify-between">
                        {/* Left Side - Chat Selector */}
                        <div className="relative" ref={chatDropdownRef}>
                          <button
                            onClick={() => setIsChatDropdownOpen(!isChatDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <span className="capitalize">{selectedChat}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {isChatDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20">
                              {/* Today Section */}
                              <div className="p-2">
                                <div className="text-xs font-medium text-neutral-500 mb-2 px-2">Today</div>
                                <button
                                  onClick={() => {
                                    setSelectedChat('greeting');
                                    setIsChatDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-2 py-2 text-sm text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
                                >
                                  <span>Greeting</span>
                                  {selectedChat === 'greeting' && (
                                    <svg className="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                              
                              {/* Previous 7 days Section */}
                              <div className="p-2 border-t border-neutral-100">
                                <div className="text-xs font-medium text-neutral-500 mb-2 px-2">Previous 7 days</div>
                                <button
                                  onClick={() => {
                                    setSelectedChat('greeting');
                                    setIsChatDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-2 py-2 text-sm text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
                                >
                                  <span>Greeting</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Right Side - New Chat Button */}
                        <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          New Chat
                        </button>
                      </div>
                    </div>
                    
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
                    <div className="w-full mt-auto" style={{ maxWidth: '864px' }}>
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
                          {/* Left Side - Add Context */}
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                              @ Add Context
                            </button>
                          </div>
                          
                          {/* Right Side - Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Attach file">
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors" title="Voice input">
                              <Mic className="w-4 h-4" />
                            </button>
                            <button 
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
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
                         <div className="mb-8 mt-12">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-neutral-900">My Decks</h2>
                            <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Generate Flashcards
                            </button>
                          </div>
                          
                          {/* Decks List */}
                          <div className="space-y-4">
                            {/* Sample Deck - Replace with actual data */}
                            <div 
                              className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                              onClick={() => setIsPracticingFlashcards(true)}
                            >
                                                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <CreditCard className="w-6 h-6 text-neutral-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-neutral-900">Biology Chapter 5</h3>
                                      <p className="text-sm text-neutral-500">24 cards</p>
                                      <p className="text-xs text-neutral-400">2 days ago</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
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
                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <CreditCard className="w-6 h-6 text-neutral-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-neutral-900">Math Formulas</h3>
                                      <p className="text-sm text-neutral-500">18 cards</p>
                                      <p className="text-xs text-neutral-400">1 week ago</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
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
                      </>
                    ) : (
                      /* Flashcard Practice Interface */
                      <div className="flex-1 flex flex-col">
                                      {/* Top Navigation */}
              <div className="mb-3 mt-12">
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
                          <div className="relative w-full" style={{ maxWidth: '864px', aspectRatio: '760/456' }}>
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
                                className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
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
                                  className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                >
                                  <div className="text-sm font-medium">Again</div>
                                  <div className="text-xs">1 minute</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('hard')}
                                  className="px-6 py-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
                                >
                                  <div className="text-sm font-medium">Hard</div>
                                  <div className="text-xs">8 minutes</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('good')}
                                  className="px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                                >
                                  <div className="text-sm font-medium">Good</div>
                                  <div className="text-xs">15 minutes</div>
                                </button>
                                <button 
                                  onClick={() => handleCardRating('easy')}
                                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
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
                  <div className="flex-1 flex flex-col">
                    {!selectedNote ? (
                      <>
                        {/* My Notes Section */}
                        <div className="mb-8 mt-12">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-neutral-900">My Notes</h2>
                            <button 
                              onClick={() => {
                                const newNote = {
                                  id: Date.now().toString(),
                                  title: 'New Note',
                                  content: [],
                                  lastModified: new Date()
                                };
                                setNotes(prev => [newNote, ...prev]);
                                setSelectedNote(newNote);
                              }}
                              className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
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
                                onClick={() => setSelectedNote(note)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <FileText className="w-6 h-6 text-neutral-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-neutral-900">{note.title}</h3>
                                      <p className="text-sm text-neutral-500">Note</p>
                                      <p className="text-xs text-neutral-400">{formatTimeAgo(note.lastModified)}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle edit
                                        console.log('Edit note');
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                      className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle delete
                                        setNotes(prev => prev.filter(n => n.id !== note.id));
                                      }}
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
                      /* Note Content Display */
                      <div className="flex-1 flex flex-col">
                        {/* Top Navigation */}
                        <div className="mb-3 flex items-center justify-between mt-12">
                          {/* Back Button */}
                          <button 
                            onClick={() => setSelectedNote(null)}
                            className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                          </button>
                          
                          {/* Convert to Source Button */}
                          <button 
                            onClick={() => {
                              // Handle convert to source
                              console.log('Convert note to source:', selectedNote);
                            }}
                            className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                          >
                            <Link className="w-4 h-4" />
                            Convert to Source
                          </button>
                        </div>

                        {/* Note Content */}
                        <div className="flex-1 overflow-y-auto">
                          <BlockNoteEditor
                            initialContent={selectedNote.content}
                            onChange={(content: any) => {
                              setNotes(prev => prev.map(note => 
                                note.id === selectedNote.id 
                                  ? { ...note, content, lastModified: new Date() }
                                  : note
                              ));
                            }}
                            noteName={selectedNote.title}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeToolTab === 'summary' && (
                      <div className="flex-1 flex flex-col">
                        {!selectedSummary ? (
                          <>
                            {/* My Summaries Section */}
                            <div className="mb-8 mt-12">
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-neutral-900">My Summaries</h2>
                                <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                                  <Plus className="w-4 h-4" />
                                  Generate Summary
                                </button>
                              </div>
                              
                                                          {/* Summaries List */}
                            <div className="space-y-4">
                                {/* Sample Summary */}
                                <div 
                                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                  onClick={() => setSelectedSummary('biology-chapter-1')}
                                >
                                                                    <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Biology Chapter 1</h3>
                                        <p className="text-sm text-neutral-500">3 pages</p>
                                        <p className="text-xs text-neutral-400">2 days ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle edit
                                          console.log('Edit summary');
                                        }}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle delete
                                          console.log('Delete summary');
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Another Sample Summary */}
                                <div 
                                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                  onClick={() => setSelectedSummary('math-calculus')}
                                >
                                                                    <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Math Calculus</h3>
                                        <p className="text-sm text-neutral-500">5 pages</p>
                                        <p className="text-xs text-neutral-400">1 week ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle edit
                                          console.log('Edit summary');
                                        }}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle delete
                                          console.log('Delete summary');
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Summary Content Display */
                          <div className="flex-1 flex flex-col">
                            {/* Top Navigation */}
                            <div className="mb-3 flex items-center justify-between mt-12">
                              {/* Back Button */}
                              <button 
                                onClick={() => setSelectedSummary(null)}
                                className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                              </button>
                              
                              {/* Copy Button */}
                              <button 
                                onClick={() => {
                                  // Copy the summary content to clipboard
                                  const content = selectedSummary === 'biology-chapter-1' 
                                    ? 'Biology Chapter 1: Introduction to Cell Biology...' // Full content would go here
                                    : 'Calculus: Fundamental Concepts and Applications...';
                                  navigator.clipboard.writeText(content);
                                }}
                                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Summary
                              </button>
                            </div>

                            {/* Summary Content */}
                            <div className="flex-1 p-8 overflow-y-auto">
                              <div className="prose prose-neutral max-w-none">
                                {selectedSummary === 'biology-chapter-1' ? (
                                  <>
                                    <h1 className="text-2xl font-bold text-neutral-900 mb-6">Biology Chapter 1: Introduction to Cell Biology</h1>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Overview</h2>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                      Cell biology is the foundation of modern biology, exploring the fundamental units of life. This chapter introduces the basic principles of cellular structure, function, and organization that govern all living organisms.
                                    </p>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Key Concepts</h2>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                      <li className="text-neutral-700">Cells are the basic structural and functional units of all living organisms</li>
                                      <li className="text-neutral-700">All cells arise from pre-existing cells through cell division</li>
                                      <li className="text-neutral-700">Cells contain genetic material that controls their activities</li>
                                      <li className="text-neutral-700">Cells respond to their environment and maintain homeostasis</li>
                                    </ul>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Cell Theory</h2>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                      The cell theory, developed in the 19th century, states that all living things are composed of cells, cells are the basic units of structure and function, and new cells are produced from existing cells.
                                    </p>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Conclusion</h2>
                                    <p className="text-neutral-700 leading-relaxed">
                                      Understanding cell biology provides the foundation for comprehending more complex biological processes, from organism development to disease mechanisms.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <h1 className="text-2xl font-bold text-neutral-900 mb-6">Calculus: Fundamental Concepts and Applications</h1>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Introduction</h2>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                      Calculus is a branch of mathematics that deals with continuous change and motion. It provides powerful tools for analyzing and solving problems in physics, engineering, economics, and many other fields.
                                    </p>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Core Principles</h2>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                      <li className="text-neutral-700">Differential calculus studies rates of change and slopes of curves</li>
                                      <li className="text-neutral-700">Integral calculus deals with accumulation and areas under curves</li>
                                      <li className="text-neutral-700">The fundamental theorem connects these two branches</li>
                                      <li className="text-neutral-700">Limits provide the foundation for all calculus concepts</li>
                                    </ul>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Applications</h2>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                      Calculus is essential for understanding motion, optimization, growth and decay, and many natural phenomena. It enables precise mathematical modeling of complex real-world systems.
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                                      {activeToolTab === 'study-guide' && (
                      <div className="flex-1 flex flex-col">
                        {!selectedStudyGuide ? (
                          <>
                            {/* My Guides Section */}
                            <div className="mb-8 mt-12">
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-neutral-900">My Guides</h2>
                                <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                                  <Plus className="w-4 h-4" />
                                  Generate Guide
                                </button>
                              </div>
                              
                                                          {/* Guides List */}
                            <div className="space-y-4">
                                {/* Sample Guide */}
                                <div 
                                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                  onClick={() => setSelectedStudyGuide('biology-guide')}
                                >
                                                                    <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Brain className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Biology Study Guide</h3>
                                        <p className="text-sm text-neutral-500">5 sections</p>
                                        <p className="text-xs text-neutral-400">3 days ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle edit
                                          console.log('Edit guide');
                                        }}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle delete
                                          console.log('Delete guide');
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Another Sample Guide */}
                                <div 
                                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                  onClick={() => setSelectedStudyGuide('math-formulas')}
                                >
                                                                    <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Brain className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Math Formulas Guide</h3>
                                        <p className="text-sm text-neutral-500">8 sections</p>
                                        <p className="text-xs text-neutral-400">1 week ago</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle edit
                                          console.log('Edit guide');
                                        }}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle delete
                                          console.log('Delete guide');
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Study Guide Content Display */
                          <div className="flex-1 flex flex-col">
                            {/* Top Navigation */}
                            <div className="mb-3 flex items-center justify-between mt-12">
                              {/* Back Button */}
                              <button 
                                onClick={() => setSelectedStudyGuide(null)}
                                className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                              </button>
                              
                              {/* Copy Button */}
                              <button 
                                onClick={() => {
                                  // Copy the guide content to clipboard
                                  const content = selectedStudyGuide === 'biology-guide' 
                                    ? 'Biology Study Guide: Essential Concepts...' // Full content would go here
                                    : 'Math Formulas: Essential Reference Guide...';
                                  navigator.clipboard.writeText(content);
                                }}
                                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Guide
                              </button>
                            </div>

                            {/* Study Guide Content */}
                            <div className="flex-1 p-8 overflow-y-auto">
                              <div className="prose prose-neutral max-w-none">
                                {selectedStudyGuide === 'biology-guide' ? (
                                  <>
                                    <h1 className="text-2xl font-bold text-neutral-900 mb-6">Biology Study Guide: Essential Concepts</h1>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">📚 Study Tips</h2>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                      <li className="text-neutral-700">Focus on understanding concepts rather than memorizing facts</li>
                                      <li className="text-neutral-700">Create visual diagrams to understand complex processes</li>
                                      <li className="text-neutral-700">Practice with real-world examples and case studies</li>
                                      <li className="text-neutral-700">Review regularly to reinforce learning</li>
                                    </ul>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">🔬 Key Topics to Master</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-neutral-800 mb-2">Cell Structure</h3>
                                        <p className="text-sm text-neutral-600">Organelles, membranes, and cellular organization</p>
                                      </div>
                                      <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-neutral-800 mb-2">Genetics</h3>
                                        <p className="text-sm text-neutral-600">DNA, inheritance, and genetic variation</p>
                                      </div>
                                      <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-neutral-800 mb-2">Evolution</h3>
                                        <p className="text-sm text-neutral-600">Natural selection and adaptation</p>
                                      </div>
                                      <div className="bg-neutral-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-neutral-800 mb-2">Ecology</h3>
                                        <p className="text-sm text-neutral-600">Organism interactions and ecosystems</p>
                                      </div>
                                    </div>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Practice Questions</h2>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                      Test your understanding with these key questions: What is the difference between prokaryotic and eukaryotic cells? How does natural selection drive evolution? What are the main components of an ecosystem?
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <h1 className="text-2xl font-bold text-neutral-900 mb-6">Math Formulas: Essential Reference Guide</h1>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">📐 Geometry Formulas</h2>
                                    <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                                      <p className="text-neutral-700 font-mono">Area of Circle: A = πr²</p>
                                      <p className="text-neutral-700 font-mono">Area of Triangle: A = ½bh</p>
                                      <p className="text-neutral-700 font-mono">Pythagorean Theorem: a² + b² = c²</p>
                                    </div>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">🧮 Calculus Formulas</h2>
                                    <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                                      <p className="text-neutral-700 font-mono">Derivative of xⁿ: d/dx(xⁿ) = nxⁿ⁻¹</p>
                                      <p className="text-neutral-700 font-mono">Integral of xⁿ: ∫xⁿdx = (xⁿ⁺¹)/(n+1) + C</p>
                                      <p className="text-neutral-700 font-mono">Chain Rule: d/dx(f(g(x))) = f'(g(x)) × g'(x)</p>
                                    </div>
                                    
                                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Study Strategies</h2>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                      <li className="text-neutral-700">Practice deriving formulas from basic principles</li>
                                      <li className="text-neutral-700">Create flashcards for quick formula recall</li>
                                      <li className="text-neutral-700">Apply formulas to real-world problems</li>
                                      <li className="text-neutral-700">Review regularly to maintain proficiency</li>
                                    </ul>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                                    {activeToolTab === 'quizzes' && (
                    <div className="flex-1 flex flex-col">
                      {!isPracticingQuiz ? (
                        <>
                          {/* My Quizzes Section */}
                          <div className="mb-8 mt-12">
                           <div className="flex items-center justify-between mb-4">
                             <h2 className="text-base font-semibold text-neutral-900">My Quizzes</h2>
                             <button className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center gap-2">
                               <Plus className="w-4 h-4" />
                               Generate Quiz
                             </button>
                           </div>
                           
                                                       {/* Quizzes List */}
                            <div className="space-y-4">
                             {/* Multiple Choice Quiz */}
                             <div 
                               className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                               onClick={() => {
                                 setCurrentQuizType('multiple-choice');
                                 setQuizQuestions(multipleChoiceQuiz);
                                 setIsPracticingQuiz(true);
                               }}
                             >
                                                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Biology Multiple Choice</h3>
                                        <p className="text-sm text-neutral-500">3 questions</p>
                                        <p className="text-xs text-neutral-400">Multiple choice format</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                   <button 
                                     className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       // Handle edit
                                       console.log('Edit quiz');
                                     }}
                                   >
                                     <Edit className="w-4 h-4" />
                                   </button>
                                   <button 
                                     className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       // Handle delete
                                       console.log('Delete quiz');
                                     }}
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </button>
                                 </div>
                               </div>
                             </div>

                             {/* Written Answer Quiz */}
                             <div 
                               className="bg-white border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                               onClick={() => {
                                 setCurrentQuizType('written');
                                 setQuizQuestions(writtenQuiz);
                                 setIsPracticingQuiz(true);
                               }}
                             >
                                                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-6 h-6 text-neutral-600" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-neutral-900">Biology Written Answers</h3>
                                        <p className="text-sm text-neutral-500">3 questions</p>
                                        <p className="text-xs text-neutral-400">Written response format</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                   <button 
                                     className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       // Handle edit
                                       console.log('Edit quiz');
                                     }}
                                   >
                                     <Edit className="w-4 h-4" />
                                   </button>
                                   <button 
                                     className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       // Handle delete
                                       console.log('Delete quiz');
                                     }}
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </button>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </>
                     ) : (
                       /* Quiz Practice Interface */
                       <div className="flex-1 flex flex-col">
                         {/* Top Navigation */}
                         <div className="mb-3 mt-12">
                           {/* Back Button */}
                           <button 
                             onClick={() => {
                               setIsPracticingQuiz(false);
                               setCurrentQuizType(null);
                               setQuizQuestions([]);
                             }}
                             className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2 mb-3"
                           >
                             <ChevronLeft className="w-4 h-4" />
                             Back
                           </button>
                           
                           {/* Progress Bar */}
                           <div className="w-full">
                             <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                               <span>{currentQuizIndex + 1}</span>
                               <span>{quizQuestions.length}</span>
                             </div>
                             <div className="w-full bg-neutral-200 rounded-full h-2">
                               <div 
                                 className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                                 style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                               ></div>
                             </div>
                           </div>
                         </div>

                         {/* Quiz Question */}
                         <div className="flex-1 flex flex-col items-center justify-center">
                           <div className="relative w-full" style={{ maxWidth: '864px', aspectRatio: '760/456' }}>
                             {/* Question Card */}
                             <div className="w-full h-full bg-white border border-neutral-200 rounded-lg p-12 shadow-sm">
                                                                                               {/* Hint Toggle Button - Top Left */}
                                 <div className="absolute top-6 left-6">
                                   {/* Hint - Only show before answer */}
                                   {!showQuizAnswer && (
                                     <button 
                                       onClick={() => setShowQuizHint(!showQuizHint)}
                                       className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                                     >
                                       <HelpCircle className="w-4 h-4" />
                                       {showQuizHint ? 'Hide' : 'Hint'}
                                     </button>
                                   )}
                                 </div>

                               {/* Question Content */}
                               <div className="text-center h-full flex flex-col items-center justify-center">
                                 <h2 className="text-2xl font-medium text-neutral-900 px-8 mb-8">
                                   {quizQuestions[currentQuizIndex]?.question}
                                 </h2>
                                 
                                                                   {/* Hint Text - Only show before answer */}
                                  {!showQuizAnswer && showQuizHint && (
                                    <div className="text-sm text-neutral-600 mb-4">
                                      <span className="font-medium">Hint:</span> {quizQuestions[currentQuizIndex]?.hint}
                                    </div>
                                  )}

                                                                   {/* Multiple Choice Options */}
                                  {quizQuestions[currentQuizIndex]?.type === 'multiple-choice' && (
                                    <div className="space-y-3 w-full max-w-md">
                                      {Object.entries(quizQuestions[currentQuizIndex]?.options || {}).map(([key, value]) => {
                                        const currentQuestion = quizQuestions[currentQuizIndex];
                                        const isCorrect = key === currentQuestion.correctAnswer;
                                        const isSelected = selectedAnswer === key;
                                        const showAnswer = showQuizAnswer;
                                        
                                        let borderStyle = "border-neutral-200";
                                        if (showAnswer) {
                                          if (isCorrect) {
                                            // Correct answer gets dotted green border
                                            borderStyle = "border-dotted border-green-400";
                                          } else if (isSelected) {
                                            // Selected wrong answer gets solid red border
                                            borderStyle = "border-red-400";
                                          }
                                        } else if (isSelected) {
                                          // Before answer, selected option gets neutral border
                                          borderStyle = "border-neutral-900";
                                        }
                                        
                                                                                 return (
                                           <button
                                             key={key}
                                             onClick={() => !showAnswer && handleAnswerSelect(key)}
                                             disabled={showAnswer}
                                             className={cn(
                                               "w-full p-3 text-left border-2 rounded-lg transition-colors",
                                               borderStyle,
                                               showAnswer && isCorrect && "bg-green-50",
                                               showAnswer && isSelected && !isCorrect && "bg-red-50",
                                               !showAnswer && isSelected && "bg-neutral-50",
                                               showAnswer && "cursor-not-allowed opacity-80"
                                             )}
                                           >
                                             <span className="font-medium text-neutral-700 mr-3">{key.toUpperCase()}.</span>
                                             <span className="text-neutral-900">{value as string}</span>
                                           </button>
                                         );
                                      })}
                                    </div>
                                  )}

                                 {/* Written Answer Input */}
                                 {quizQuestions[currentQuizIndex]?.type === 'written' && (
                                   <div className="w-full max-w-md">
                                     <textarea
                                       value={writtenAnswer}
                                       onChange={(e) => handleWrittenAnswerChange(e.target.value)}
                                       placeholder="Type your answer here..."
                                       className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                                       rows={4}
                                     />
                                   </div>
                                 )}

                                                                                                      {/* Answer Display */}
                                   {showQuizAnswer && (
                                     <div className="mt-6 w-full max-w-md">
                                       <div className="text-left">
                                                                                  {/* Feedback Card with Icon and Explanation */}
                                          <div className={cn(
                                            "p-4 rounded-lg border-2",
                                            (() => {
                                              const currentQuestion = quizQuestions[currentQuizIndex];
                                              if (clickedIDontKnow) {
                                                // User clicked "I Don't Know" - yellow
                                                return "bg-yellow-50 text-yellow-800 border-yellow-400";
                                              } else if (currentQuestion.type === 'multiple-choice') {
                                                if (selectedAnswer === currentQuestion.correctAnswer) {
                                                  // User got it right - green
                                                  return "bg-green-50 text-green-800 border-green-400";
                                                } else {
                                                  // User got it wrong - red
                                                  return "bg-red-50 text-red-800 border-red-400";
                                                }
                                              } else {
                                                // For written answers
                                                if (writtenAnswer.trim() !== '') {
                                                  return "bg-green-50 text-green-800 border-green-400";
                                                } else {
                                                  return "bg-red-50 text-red-800 border-red-400";
                                                }
                                              }
                                            })()
                                          )}>
                                            {/* Header with Icon and Status */}
                                            <div className="flex items-center gap-3 mb-3">
                                              {/* Icon */}
                                              {(() => {
                                                const currentQuestion = quizQuestions[currentQuizIndex];
                                                if (clickedIDontKnow) {
                                                  return <HelpCircle className="w-5 h-5 text-yellow-600" />;
                                                } else if (currentQuestion.type === 'multiple-choice') {
                                                  if (selectedAnswer === currentQuestion.correctAnswer) {
                                                    return <CheckCircle className="w-5 h-5 text-green-600" />;
                                                  } else {
                                                    return <XCircle className="w-5 h-5 text-red-600" />;
                                                  }
                                                } else {
                                                  if (writtenAnswer.trim() !== '') {
                                                    return <CheckCircle className="w-5 h-5 text-green-600" />;
                                                  } else {
                                                    return <XCircle className="w-5 h-5 text-red-600" />;
                                                  }
                                                }
                                              })()}
                                              
                                              {/* Status Text */}
                                              <div>
                                                {(() => {
                                                  const currentQuestion = quizQuestions[currentQuizIndex];
                                                  if (clickedIDontKnow) {
                                                    return <span className="font-medium">I Don't Know</span>;
                                                  } else if (currentQuestion.type === 'multiple-choice') {
                                                    if (selectedAnswer === currentQuestion.correctAnswer) {
                                                      return <span className="font-medium">Correct!</span>;
                                                    } else {
                                                      return <span className="font-medium">Incorrect</span>;
                                                    }
                                                  } else {
                                                    if (writtenAnswer.trim() !== '') {
                                                      return <span className="font-medium">Answer Submitted</span>;
                                                    } else {
                                                      return <span className="font-medium">No Answer</span>;
                                                    }
                                                  }
                                                })()}
                                              </div>
                                            </div>
                                            
                                            {/* Explanation - Inside the card with matching color */}
                                            <p className={cn(
                                              "text-sm",
                                              (() => {
                                                const currentQuestion = quizQuestions[currentQuizIndex];
                                                if (clickedIDontKnow) {
                                                  return "text-yellow-700";
                                                } else if (currentQuestion.type === 'multiple-choice') {
                                                  if (selectedAnswer === currentQuestion.correctAnswer) {
                                                    return "text-green-700";
                                                  } else {
                                                    return "text-red-700";
                                                  }
                                                } else {
                                                  if (writtenAnswer.trim() !== '') {
                                                    return "text-green-700";
                                                  } else {
                                                    return "text-red-700";
                                                  }
                                                }
                                              })()
                                            )}>{quizQuestions[currentQuizIndex]?.explanation}</p>
                                          </div>
                                       </div>
                                     </div>
                                   )}
                               </div>
                             </div>
                           </div>
                           
                           {/* Navigation Buttons - Bottom */}
                           <div className="mt-6 flex justify-between w-full" style={{ maxWidth: '864px' }}>
                             {/* Back Button - Bottom Left */}
                             <button 
                               onClick={handleQuizBack}
                               disabled={currentQuizIndex === 0}
                               className={cn(
                                 "px-6 py-3 rounded-lg transition-colors",
                                 currentQuizIndex === 0
                                   ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                   : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                               )}
                             >
                               Back
                             </button>
                             
                                                           {/* Submit/Next Button - Bottom Right */}
                              <button 
                                onClick={showQuizAnswer ? handleQuizNext : handleQuizAnswer}
                                className={cn(
                                  "px-6 py-3 rounded-lg transition-colors",
                                  showQuizAnswer
                                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                                )}
                              >
                                {showQuizAnswer ? 'Next' : (hasAnswered() ? 'Submit' : 'I Don\'t Know')}
                              </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 )}

                                   {!['ai-chat', 'summary', 'study-guide', 'flashcards', 'quizzes', 'notes'].includes(activeToolTab) && (
                   <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center">
                     <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                       {React.createElement(toolTabs.find(tab => tab.id === activeToolTab)?.icon || FileText, {
                         className: "w-10 h-10 text-neutral-400"
                       })}
                     </div>
                     <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                       {toolTabs.find(tab => tab.id === activeToolTab)?.label}
                     </h2>
                     <p className="text-neutral-600 mb-8">Coming soon</p>
                     <button className="px-6 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors">
                       Get Notified
                     </button>
                   </div>
                 )}
            </div>
          </div>

            {/* Floating AI Chat Widget */}
            <FloatingAIChat
              isVisible={showFloatingAIChat}
              onExpandToMainChat={() => setActiveToolTab('ai-chat')}
            />
                              </div>
                            </div>
                            
        </div>
      )}

     </div>
   );
 };

export default DocumentPage;
