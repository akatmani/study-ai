'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import DocumentPage from '@/components/layout/DocumentPage';

export default function StudySetRoute() {
  const params = useParams();
  const router = useRouter();
  const studySetName = params.studySetName as string;
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSourcePreviewMode, setIsSourcePreviewMode] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
    } else {
      // Navigate to home (reset preview mode)
      setIsSourcePreviewMode(false);
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen bg-white">
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
      
      <DocumentPage 
        studySetName={studySetName}
        isSidebarCollapsed={isSidebarCollapsed}
        onSourcePreviewModeChange={setIsSourcePreviewMode}
      />
    </div>
  );
}
