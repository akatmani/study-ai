'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  BookOpen,
  Plus,
  PanelLeft,
  User,
  Library,
  MoreHorizontal,
  ChevronRight,
  SortAsc,
  Eye,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onNavigate?: (view: {type: 'home' | 'document', data?: {studySetName: string}}) => void;
  /** NEW: when true, this sidebar renders as an overlay instead of pushing layout */
  isOverlay?: boolean;
}

// Portal-based dropdown component
const PortalDropdown: React.FC<{
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  className?: string;
  horizontalOffset?: number;
}> = ({ isOpen, triggerRef, children, className, horizontalOffset = 0 }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4, // 4px gap
        left: rect.left + horizontalOffset
      });
    }
  }, [isOpen, triggerRef, horizontalOffset]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={cn(
        "fixed w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-[9999]",
        className
      )}
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// Portal-based submenu component
const PortalSubmenu: React.FC<{
  isOpen: boolean;
  parentRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  className?: string;
  horizontalOffset?: number;
}> = ({ isOpen, parentRef, children, className, horizontalOffset = 0 }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.right + 4 + horizontalOffset // 4px gap + horizontal offset
      });
    }
  }, [isOpen, parentRef, horizontalOffset]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={cn(
        "fixed bg-white border border-neutral-200 rounded-lg shadow-lg z-[9999]",
        className
      )}
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  isCollapsed = false, 
  onToggleCollapse,
  onNavigate,
  isOverlay = false
}) => {
  const [activeItem, setActiveItem] = useState('new-study-set');
  const [showAllStudySets, setShowAllStudySets] = useState(false);
  const [showStudySetsMenu, setShowStudySetsMenu] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'sort' | 'show' | null>(null);
  const [sortBy, setSortBy] = useState<'last-edited' | 'name' | 'created'>('last-edited');
  const [showCount, setShowCount] = useState<5 | 10 | 15 | 20 | 'all'>(5);

  // Refs for positioning
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const sortOptionRef = useRef<HTMLDivElement>(null);
  const showOptionRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { id: 'new-study-set', label: 'New Study Set', icon: Plus },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
  ];

  const recentDocuments = [
    'Biology-101-Chapter-5',
    'History-Essay-Draft',
    'Math-Problem-Set-3',
    'Physics-Lab-Report',
    'Literature-Analysis',
    'Computer-Science-Algorithms',
    'Chemistry-Organic-Notes',
    'Economics-Micro-Review',
    'Psychology-Research-Paper',
    'Art-History-Essay',
    'Statistics-Data-Analysis',
    'Philosophy-Ethics-Notes',
    'Geography-World-Maps',
    'Music-Theory-Basics',
    'Engineering-Design-Project'
  ];

  // Show only first N study sets unless "Show more" is clicked
  const visibleStudySets = showAllStudySets ? recentDocuments : recentDocuments.slice(0, showCount === 'all' ? recentDocuments.length : showCount);

  const bottomItems = [
    { id: 'user', label: 'User', icon: User },
  ];

  // Proper dropdown behavior with portal support
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showStudySetsMenu && !target.closest('.study-sets-menu') && !target.closest('.study-sets-menu-trigger')) {
        setShowStudySetsMenu(false);
        setActiveSubmenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeSubmenu) {
          setActiveSubmenu(null);
        } else if (showStudySetsMenu) {
          setShowStudySetsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showStudySetsMenu, activeSubmenu]);



  return (
    <div className={cn(
      "left-nav h-screen bg-neutral-50 flex flex-col transition-all duration-300 overflow-hidden",
      isOverlay
        ? "fixed inset-y-0 left-0 z-[9999] w-64 transform transition-transform duration-300 -translate-x-full data-[open=true]:translate-x-0 rounded-tr-lg rounded-br-lg"
        : "relative w-64 flex-shrink-0",
      isCollapsed && !isOverlay ? "" : "w-64",
      className
    )}
    style={{
      width: isCollapsed && !isOverlay ? '60px' : '256px'
    }}
    data-open={!isCollapsed || isOverlay}>
      {/* Header */}
      <div className="px-4 pt-7 pb-3 flex items-center justify-between min-h-[56px]">
        {isCollapsed ? (
          <div className="w-full flex justify-center group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-neutral-900 transition-opacity duration-200 group-hover:opacity-0" />
              <button
                onClick={() => onToggleCollapse?.(false)}
                className="absolute inset-0 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4 text-neutral-900" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <BookOpen className="w-5 h-5 text-neutral-900 flex-shrink-0" />
            <button
              onClick={() => onToggleCollapse?.(true)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors duration-200 opacity-0 animate-fade-in"
              title="Close sidebar"
              style={{
                animationDelay: '200ms',
                animationDuration: '200ms',
                animationFillMode: 'forwards'
              }}
            >
              <PanelLeft className="w-4 h-4 text-neutral-900" />
            </button>
          </>
        )}
      </div>

                    {/* Main Navigation - Sticky */}
              <div className={cn("sticky top-0 bg-neutral-50 z-10", isCollapsed ? "px-3 py-3" : "p-3")}>
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveItem(item.id);
                          if (onNavigate) {
                            onNavigate({ type: 'home' });
                          }
                        }}
                        className={cn(
                          "flex items-center rounded-lg transition-colors duration-200 hover:bg-neutral-100",
                          isCollapsed
                            ? "justify-center"
                            : "w-full px-3 py-2",
                          activeItem === item.id && "bg-neutral-100"
                        )}
                        title={isCollapsed ? item.label : undefined}
                        style={{
                          width: isCollapsed ? '36px' : '100%',
                          height: '36px'
                        }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span
                          className={cn(
                            "transition-all duration-300 whitespace-nowrap",
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-2"
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">

                        {/* Study Sets Section */}
                {!isCollapsed && (
                  <div className="px-3 pt-4">
                    <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200 group">
                      <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Study Sets
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative">
                        <button
                          ref={menuTriggerRef}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowStudySetsMenu(!showStudySetsMenu);
                            if (showStudySetsMenu) {
                              setActiveSubmenu(null);
                            }
                          }}
                          className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-200 transition-colors duration-200 study-sets-menu-trigger"
                          title="Study Sets options"
                        >
                          <MoreHorizontal className="w-3 h-3 text-neutral-400" />
                          
                          {/* Dropdown Menu */}
                          {showStudySetsMenu && (
                            <PortalDropdown
                              isOpen={showStudySetsMenu}
                              triggerRef={menuTriggerRef}
                              className="study-sets-menu"
                              horizontalOffset={8}
                            >
                              <div className="py-1">
                                {/* Sort Option */}
                                <div 
                                  ref={sortOptionRef}
                                  className="relative"
                                  onMouseEnter={() => setActiveSubmenu('sort')}
                                  onMouseLeave={() => setActiveSubmenu(null)}
                                >
                                  <button
                                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden"
                                  >
                                    <div className="flex items-center gap-2">
                                      <SortAsc className="w-4 h-4 text-neutral-500" />
                                      Sort
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                                  </button>
                                  
                                  {/* Sort Submenu */}
                                  {activeSubmenu === 'sort' && (
                                                                         <PortalSubmenu
                                       isOpen={activeSubmenu === 'sort'}
                                       parentRef={sortOptionRef}
                                       className="w-32"
                                       horizontalOffset={8}
                                     >
                                      <div className="py-1 bg-white border border-neutral-200 rounded-lg shadow-lg">
                                        <button
                                          onClick={() => {
                                            setSortBy('last-edited');
                                            setShowStudySetsMenu(false);
                                            setActiveSubmenu(null);
                                          }}
                                          className={cn(
                                            "w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden",
                                            sortBy === 'last-edited' ? "text-neutral-900 bg-neutral-50" : "text-neutral-700"
                                          )}
                                        >
                                          Last Edited
                                          {sortBy === 'last-edited' && <Check className="w-4 h-4 text-neutral-500" />}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSortBy('name');
                                            setShowStudySetsMenu(false);
                                            setActiveSubmenu(null);
                                          }}
                                          className={cn(
                                            "w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden",
                                            sortBy === 'name' ? "text-neutral-900 bg-neutral-50" : "text-neutral-700"
                                          )}
                                        >
                                          Name
                                          {sortBy === 'name' && <Check className="w-4 h-4 text-neutral-500" />}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSortBy('created');
                                            setShowStudySetsMenu(false);
                                            setActiveSubmenu(null);
                                          }}
                                          className={cn(
                                            "w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden",
                                            sortBy === 'created' ? "text-neutral-900 bg-neutral-50" : "text-neutral-700"
                                          )}
                                        >
                                          Created
                                          {sortBy === 'created' && <Check className="w-4 h-4 text-neutral-500" />}
                                        </button>
                                      </div>
                                    </PortalSubmenu>
                                  )}
                                </div>
                                
                                {/* Show Option */}
                                <div 
                                  ref={showOptionRef}
                                  className="relative"
                                  onMouseEnter={() => setActiveSubmenu('show')}
                                  onMouseLeave={() => setActiveSubmenu(null)}
                                >
                                  <button
                                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Eye className="w-4 h-4 text-neutral-500" />
                                      Show
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                                  </button>
                                  
                                  {/* Show Count Submenu */}
                                  {activeSubmenu === 'show' && (
                                                                         <PortalSubmenu
                                       isOpen={activeSubmenu === 'show'}
                                       parentRef={showOptionRef}
                                       className="w-20"
                                       horizontalOffset={8}
                                     >
                                      <div className="py-1 bg-white border border-neutral-200 rounded-lg shadow-lg">
                                        {[5, 10, 15, 20, 'All'].map((count) => (
                                          <button
                                            key={count}
                                            onClick={() => {
                                              setShowCount(count === 'All' ? 'all' : count as 5 | 10 | 15 | 20);
                                              setShowStudySetsMenu(false);
                                              setActiveSubmenu(null);
                                            }}
                                            className={cn(
                                              "w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between rounded-lg overflow-hidden",
                                              showCount === (count === 'All' ? 'all' : count) ? "text-neutral-900 bg-neutral-50" : "text-neutral-700"
                                            )}
                                          >
                                            {count}
                                            {showCount === (count === 'All' ? 'all' : count) && <Check className="w-4 h-4 text-neutral-500" />}
                                          </button>
                                        ))}
                                      </div>
                                    </PortalSubmenu>
                                  )}
                                </div>
                              </div>
                            </PortalDropdown>
                          )}
                        </button>
                        <button
                          className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-200 transition-colors duration-200"
                          title="Add study set"
                        >
                          <Plus className="w-3 h-3 text-neutral-400" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {visibleStudySets.map((document, index) => (
                        <div key={index} className="flex items-center w-full px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors duration-200 group">
                          <button
                            onClick={() => {
                              setActiveItem(`study-set-${index}`);
                              if (onNavigate) {
                                                              onNavigate({
                                type: 'document',
                                data: { studySetName: document }
                              });
                              }
                            }}
                            className="flex items-center flex-1 min-w-0 text-left text-neutral-900 transition-colors duration-200"
                            style={{
                              fontSize: '14px',
                              lineHeight: '20px',
                              fontWeight: 400
                            }}
                          >
                            {document}
                          </button>
                          
                          {/* Action button that appears on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show document options menu here
                            }}
                            className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Document options"
                          >
                            <MoreHorizontal className="w-3 h-3 text-neutral-500" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Show More / Show Less Button */}
                      {recentDocuments.length > (showCount === 'all' ? 0 : showCount) && (
                        <button
                          onClick={() => setShowAllStudySets(!showAllStudySets)}
                          className="w-full text-left px-3 py-1.5 text-neutral-500 hover:text-neutral-700 transition-colors duration-200 flex items-center"
                          style={{
                            fontSize: '14px',
                            lineHeight: '20px',
                            fontWeight: 400
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4 flex-shrink-0" />
                          <span className="ml-2">
                            {showAllStudySets ? 'Show less' : 'Show more'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className={cn("space-y-1", isCollapsed ? "px-3 py-3" : "p-3")}>
                {bottomItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item.id)}
                      className={cn(
                        "flex items-center rounded-lg transition-colors duration-200 hover:bg-neutral-100",
                        isCollapsed 
                          ? "justify-center" 
                          : "w-full px-3 py-2",
                        activeItem === item.id && "bg-neutral-100"
                      )}
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        width: isCollapsed ? '36px' : '100%',
                        height: '36px'
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span 
                        className={cn(
                          "transition-all duration-300 whitespace-nowrap",
                          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-2"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
  );
};

export default Sidebar;