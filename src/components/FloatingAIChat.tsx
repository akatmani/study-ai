import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Minimize2, Paperclip, Mic, ArrowUp, Plus, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAIChatProps {
  isVisible: boolean;
  onExpandToMainChat?: () => void;
}

const FloatingAIChat: React.FC<FloatingAIChatProps> = ({ isVisible, onExpandToMainChat }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState('greeting');
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false);
  const chatDropdownRef = useRef<HTMLDivElement>(null);

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

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors"
          style={{ boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 w-80 h-96 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 flex flex-col">
      {/* Header - No border line */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {/* Chat Selector Dropdown */}
          <div className="relative" ref={chatDropdownRef}>
            <button
              onClick={() => setIsChatDropdownOpen(!isChatDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="capitalize text-xs">{selectedChat}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isChatDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-20">
                {/* Today Section */}
                <div className="p-2">
                  <div className="text-xs font-medium text-neutral-500 mb-2 px-2">Today</div>
                  <button
                    onClick={() => {
                      setSelectedChat('greeting');
                      setIsChatDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
                  >
                    <span>Greeting</span>
                    {selectedChat === 'greeting' && (
                      <svg className="w-3 h-3 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full flex items-center justify-between px-2 py-2 text-xs text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
                  >
                    <span>Greeting</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Plus Icon */}
          <button
            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            title="New Chat"
          >
            <Plus className="w-3 h-3" />
          </button>
          {/* Expand to Main Chat Icon */}
          <button
            onClick={onExpandToMainChat}
            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            title="Open in Main Chat"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
          {/* Minimize Icon */}
          <button
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        {/* AI Tutor Welcome Section */}
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Learn with the AI Tutor</h3>
        <p className="text-xs text-neutral-600 mb-4">Get personalized help with your study materials</p>
      </div>

      {/* Chat Input Box - No border line above */}
      <div className="p-3">
        <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-sm">
          {/* Main Input Area */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Learn anything"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-2 py-1 text-xs focus:outline-none resize-none"
            />
          </div>
          
          {/* Bottom Row - Controls */}
          <div className="flex items-center justify-between">
            {/* Left Side - Add Context */}
            <div className="flex items-center gap-1">
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
              <button 
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  message.trim() 
                    ? "bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer" 
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                )}
                disabled={!message.trim()}
              >
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
  );
};

export default FloatingAIChat;
