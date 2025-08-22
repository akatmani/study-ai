import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  FileText,
  Link,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';

interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'text';
  url?: string;
  content?: string;
}

interface FloatingSourcesTabsProps {
  sources: Source[];
  selectedSources: string[];
  onSourceSelect: (sourceId: string) => void;
  onSourceSelectionToggle: (sourceId: string) => void;
  onSelectAllSources: () => void;
  onAddSource: () => void;
  onSourcePreview: (sourceId: string) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
  isExpanded?: boolean; // Add this prop to control expansion state
}

const FloatingSourcesTabs: React.FC<FloatingSourcesTabsProps> = ({
  sources,
  selectedSources,
  onSourceSelect,
  onSourceSelectionToggle,
  onSelectAllSources,
  onAddSource,
  onSourcePreview,
  onExpansionChange,
  isExpanded = false
}) => {
  const [isAllSourcesSelected, setIsAllSourcesSelected] = useState(true);

  // Select all sources by default when component mounts
  useEffect(() => {
    if (sources.length > 0) {
      sources.forEach(source => {
        if (!selectedSources.includes(source.id)) {
          onSourceSelect(source.id);
        }
      });
    }
  }, [sources, onSourceSelect]);

  // Sync isAllSourcesSelected with actual selection state
  useEffect(() => {
    if (sources.length > 0) {
      const allSelected = sources.every(source => selectedSources.includes(source.id));
      setIsAllSourcesSelected(allSelected);
    }
  }, [sources, selectedSources]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'link': return Link;
      case 'audio': return Volume2;
      default: return FileText;
    }
  };

  const handleSelectAllToggle = () => {
    const newState = !isAllSourcesSelected;
    setIsAllSourcesSelected(newState);
    if (newState) {
      // Select all sources
      sources.forEach(source => {
        if (!selectedSources.includes(source.id)) {
          onSourceSelect(source.id);
        }
      });
    } else {
      // Deselect all sources
      selectedSources.forEach(sourceId => {
        onSourceSelectionToggle(sourceId);
      });
    }
  };

  const handleExpansionChange = (expanded: boolean) => {
    onExpansionChange?.(expanded);
  };

  return (
    <div className="fixed top-4 right-4 bottom-4 z-40 flex flex-col items-end">
      {/* Floating Sources Container - full height with rounded corners */}
      <div className={cn(
        "bg-white border border-neutral-200 rounded-lg transition-all duration-300 h-full",
        isExpanded ? "w-80" : "w-16"
      )}>
        {isExpanded ? (
          // Expanded State - Full Sources Panel
          <div className="p-4 h-full flex flex-col">
            {/* Header with Menu Icon */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Sources</h3>
              <button
                onClick={() => handleExpansionChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                title="Collapse"
              >
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Add Source Button */}
            <button
              onClick={onAddSource}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-4 h-4" />
              Add Source
            </button>

            {/* Select All Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-600">Select All</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSourcesSelected}
                  onChange={handleSelectAllToggle}
                  className="w-4 h-4 bg-white border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-500 focus:ring-offset-0"
                  style={{
                    accentColor: '#171717'
                  }}
                />
              </label>
            </div>

            {/* Sources List - takes remaining height */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {sources.map((source) => {
                const Icon = getSourceIcon(source.type);
                const isSelected = selectedSources.includes(source.id);
                return (
                  <Card
                    key={source.id}
                    variant="default"
                    className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                    onClick={() => onSourcePreview(source.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Source Icon */}
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-neutral-600" />
                        </div>
                        
                        {/* Source Name */}
                        <h4 className="text-sm font-medium text-neutral-900 truncate">
                          {source.name}
                        </h4>
                      </div>

                      {/* Selection Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            onSourceSelectionToggle(source.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 bg-white border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-500 focus:ring-offset-0"
                          style={{
                            accentColor: '#171717'
                          }}
                        />
                      </label>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // Collapsed State - Vertical Icon Tabs
          <div className="p-2 h-full flex flex-col">
            {/* Expand Button */}
            <button
              onClick={() => handleExpansionChange(true)}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors mb-2"
              title="Expand sources"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>

            {/* Add Source Button - below expand button */}
            <button
              onClick={onAddSource}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors bg-white border border-neutral-200 shadow-sm text-neutral-700 hover:bg-neutral-50 mb-2"
              title="Add source"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Sources Icons - takes remaining height */}
            <div className="flex-1 space-y-2">
              {sources.map((source) => {
                const Icon = getSourceIcon(source.type);
                return (
                  <button
                    key={source.id}
                    onClick={() => onSourcePreview(source.id)}
                    className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors bg-neutral-100 border border-neutral-200"
                    title={`${source.name} - Click to preview`}
                  >
                    <Icon className="w-5 h-5 text-neutral-600" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingSourcesTabs;
