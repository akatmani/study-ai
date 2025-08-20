import React, { useState } from 'react';
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
  const [isAllSourcesSelected, setIsAllSourcesSelected] = useState(false);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'link': return Link;
      case 'audio': return Volume2;
      default: return FileText;
    }
  };

  const handleSelectAllToggle = () => {
    setIsAllSourcesSelected(!isAllSourcesSelected);
    onSelectAllSources();
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
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
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
            <div className="flex items-center gap-3 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSourcesSelected}
                  onChange={handleSelectAllToggle}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
              <span className="text-xs text-neutral-600">Select All</span>
            </div>

            {/* Sources List - takes remaining height */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {sources.map((source) => {
                const Icon = getSourceIcon(source.type);
                const isSelected = selectedSources.includes(source.id);
                return (
                  <div 
                    key={source.id}
                    className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => onSourcePreview(source.id)}
                  >
                    <div className="flex items-center gap-2">
                      {/* Source Icon */}
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-neutral-600" />
                      </div>
                      
                      {/* Source Info */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-neutral-900 truncate">
                          {source.name}
                        </h4>
                        <p className="text-xs text-neutral-500 capitalize">
                          {source.type}
                        </p>
                      </div>
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
                        className="sr-only peer"
                      />
                      <div className="w-6 h-3 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
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

            {/* Sources Icons - takes remaining height */}
            <div className="flex-1 space-y-2">
              {sources.map((source) => {
                const Icon = getSourceIcon(source.type);
                const isSelected = selectedSources.includes(source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => onSourcePreview(source.id)}
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
            </div>

            {/* Add Source Button - at bottom */}
            <button
              onClick={onAddSource}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors border-2 border-dashed border-neutral-300 hover:border-neutral-400 mt-auto"
              title="Add source"
            >
              <Plus className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingSourcesTabs;
