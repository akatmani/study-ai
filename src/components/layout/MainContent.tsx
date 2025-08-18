import React from 'react';
import { Upload, Link, Video, FileText, Mic } from 'lucide-react';

interface MainContentProps {
  isSidebarCollapsed?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isSidebarCollapsed = false }) => {
  const recentItems = [
    {
      title: 'Biology Study Guide',
      subtitle: '2 hours ago',
      icon: FileText,
      color: 'bg-blue-100'
    },
    {
      title: 'History Notes Review',
      subtitle: '1 day ago', 
      icon: FileText,
      color: 'bg-green-100'
    },
    {
      title: 'Math Problem Set',
      subtitle: '3 days ago',
      icon: FileText,
      color: 'bg-yellow-100'
    }
  ];

  return (
    <div className="flex-1 bg-white flex items-center justify-center transition-all duration-300">
      <div className="w-full max-w-4xl px-8">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            What do you want to learn?
          </h1>
          <p className="text-neutral-500 text-lg">
            Add sources and start learning
          </p>
        </div>

        {/* Upload options - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* Upload */}
          <button className="p-6 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left cursor-pointer shadow-subtle">
            <div className="mb-4">
              <Upload className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2">Upload</h3>
            <p className="text-neutral-500 text-sm">
              PDF, slides, audio
            </p>
          </button>

          {/* Text */}
          <button className="p-6 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left cursor-pointer shadow-subtle">
            <div className="mb-4">
              <FileText className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2">Text</h3>
            <p className="text-neutral-500 text-sm">
              Paste or write text
            </p>
          </button>

          {/* Link */}
          <button className="p-6 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left cursor-pointer shadow-subtle">
            <div className="mb-4">
              <Link className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2">Link</h3>
            <p className="text-neutral-500 text-sm">
              YouTube, website
            </p>
          </button>

          {/* Record */}
          <button className="p-6 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left cursor-pointer shadow-subtle">
            <div className="mb-4">
              <Mic className="w-6 h-6 text-neutral-600" />
            </div>
            <h3 className="font-medium text-neutral-900 mb-2">Record</h3>
            <p className="text-neutral-500 text-sm">
              Class, video call
            </p>
          </button>
        </div>

        {/* Recents section */}
        <div>
          <h2 className="text-xl font-medium text-neutral-800 mb-6">Recents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button 
                  key={index}
                  className="p-4 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left cursor-pointer flex items-center gap-3"
                >
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-neutral-900 truncate">{item.title}</h3>
                    <p className="text-neutral-500 text-sm">{item.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
