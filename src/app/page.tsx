'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MainContent from '@/components/layout/MainContent';


export default function Home() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSourcePreviewMode, setIsSourcePreviewMode] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentView, setCurrentView] = useState<{type: 'home' | 'document', data?: {studySetName: string}}>({
    type: 'home'
  });

  // Helper to determine if left nav should be overlay (when in preview mode)
  const isLeftNavOverlay = !!isSourcePreviewMode;

  // Auto-collapse sidebar when first entering source preview mode
  useEffect(() => {
    if (isSourcePreviewMode) {
      setIsSidebarCollapsed(true);
      setIsOverlayOpen(false);
    }
  }, [isSourcePreviewMode]);

  // ESC handler for overlay mode
  useEffect(() => {
    if (!isLeftNavOverlay) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLeftNavOverlay]);

    const handleNavigation = (view: {type: 'home' | 'document', data?: any}) => {
      // Always close overlay when navigating (regardless of destination)
      setIsOverlayOpen(false);
      
      if (view.type === 'document') {
        // Navigate to study set route
        router.push(`/study-sets/${encodeURIComponent(view.data.studySetName)}`);
        // Set the current view to document type
        setCurrentView(view);
      } else {
        // Navigate to home (reset preview mode)
        setIsSourcePreviewMode(false);
        setCurrentView(view);
      }
    };

  const renderContent = () => {
    // Don't render any content when in source preview mode
    if (isSourcePreviewMode) {
      return null;
    }
    
    switch (currentView.type) {
      case 'home':
      default:
        return <MainContent isSidebarCollapsed={isSidebarCollapsed} />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Background sidebar - always collapsed in preview mode, never changes */}
      <Sidebar 
        isCollapsed={isSourcePreviewMode ? true : isSidebarCollapsed}
        onToggleCollapse={isSourcePreviewMode ? () => setIsOverlayOpen(true) : setIsSidebarCollapsed}
        onNavigate={handleNavigation}
        isOverlay={false}
      />
      
      {/* Overlay sidebar - only visible when open in preview mode */}
      {isLeftNavOverlay && isOverlayOpen && (
        <Sidebar 
          isCollapsed={false}
          onToggleCollapse={() => setIsOverlayOpen(false)}
          onNavigate={handleNavigation}
          isOverlay={true}
        />
      )}
      
      {/* Backdrop for overlay mode */}
      {isLeftNavOverlay && isOverlayOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOverlayOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {renderContent()}
    </div>
  );
}
