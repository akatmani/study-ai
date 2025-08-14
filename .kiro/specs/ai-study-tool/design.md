# Design Document

## Overview

The AI Study Tool is a modern web application that provides students with an intelligent learning platform. The system combines source management, AI-powered interactions, and specialized study tools in a ChatGPT-inspired interface. The architecture emphasizes real-time interactions, efficient content processing, and a responsive user experience across different device types.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React/Next.js UI]
        State[Zustand State Management]
        WS[WebSocket Client]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        Auth[Authentication Middleware]
        Upload[File Upload Handler]
        WS_Server[WebSocket Server]
    end
    
    subgraph "AI Services"
        LLM[LLM Integration]
        TTS[Text-to-Speech]
        STT[Speech-to-Text]
        Embed[Embedding Service]
    end
    
    subgraph "Processing Services"
        PDF[PDF Processor]
        Video[Video/Audio Processor]
        Web[Web Scraper]
        Search[Vector Search]
    end
    
    subgraph "Supabase Backend"
        SBDB[(Supabase PostgreSQL)]
        SBVector[(Supabase Vector/pgvector)]
        SBStorage[Supabase Storage]
        SBAuth[Supabase Auth]
        SBRealtime[Supabase Realtime]
    end
    
    UI --> API
    UI --> WS
    UI --> SBAuth
    UI --> SBRealtime
    API --> SBAuth
    API --> Upload
    API --> LLM
    API --> Processing Services
    API --> SBDB
    WS_Server --> LLM
    Processing Services --> SBVector
    Processing Services --> SBStorage
    Upload --> SBStorage
    LLM --> Embed
    Search --> SBVector
```

### Technology Stack

#### UI Framework Integration

**Preline UI Components:**
- Pre-built Tailwind CSS components for rapid development
- Professional design system matching modern SaaS applications
- Responsive components optimized for the ChatGPT-like interface
- Navigation components for collapsible sidebar and action bars
- Modal and drawer components for right-side panels
- Form components for source upload and user interactions
- Card and list components for source and study management

**Frontend:**
- Next.js 14 with App Router for full-stack React framework
- TypeScript for type safety
- Tailwind CSS with Preline UI components for professional, responsive design
- Zustand for lightweight state management
- React Query for server state management
- WebSocket for real-time AI chat
- Framer Motion for smooth animations

**Backend:**
- Next.js API routes for serverless functions
- Supabase for database, authentication, and real-time features
- Supabase Auth for user authentication and session management
- WebSocket server for real-time communication

**AI & Processing:**
- OpenAI GPT-4 for chat and content generation
- OpenAI Whisper for audio transcription
- OpenAI TTS for podcast generation
- Supabase Vector (pgvector) for embeddings and semantic search
- PDF.js for PDF processing
- YouTube API for video content extraction
- Puppeteer for web scraping

**Data Storage:**
- Supabase PostgreSQL for relational data
- Supabase Vector (pgvector) for embeddings and semantic search
- Supabase Storage for file uploads and management
- Supabase Edge Functions for serverless processing

#### Supabase Integration Benefits

**Database & Auth:**
- Built-in Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates across the application
- Automatic API generation from database schema
- Built-in user authentication with social providers
- Session management and JWT token handling

**File Management:**
- Direct file uploads to Supabase Storage
- Automatic file optimization and CDN delivery
- Secure file access with RLS policies
- Support for large file uploads with resumable uploads

**Vector Search:**
- Native pgvector extension for semantic search
- Efficient similarity search for source content
- Automatic embedding storage and retrieval
- Optimized queries for AI-powered features

## Components and Interfaces

### Core Components

#### 1. Layout Components

**LeftNavigation Component**
```typescript
interface LeftNavigationProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentStudy?: Study;
}

interface NavigationState {
  folders: Folder[];
  recentStudies: Study[];
  searchQuery: string;
}
```

**MainWorkspace Component**
```typescript
interface MainWorkspaceProps {
  study: Study;
  selectedSource?: Source;
  onSourceSelect: (source: Source) => void;
}

interface WorkspaceState {
  sources: Source[];
  activeSource: Source | null;
  previewMode: 'pdf' | 'transcript' | 'text';
}
```

**RightActionBar Component**
```typescript
interface RightActionBarProps {
  activeDrawer: DrawerType | null;
  onDrawerToggle: (drawer: DrawerType) => void;
}

type DrawerType = 'chat' | 'notes' | 'summary' | 'study-guide' | 'quiz' | 'flashcards' | 'podcast';
```

#### 2. Source Management Components

**SourceUploader Component**
```typescript
interface SourceUploaderProps {
  studyId: string;
  onSourceAdded: (source: Source) => void;
}

interface SourceUploadOptions {
  type: 'file' | 'url' | 'text' | 'audio';
  acceptedFormats: string[];
  maxSize: number;
}
```

**SourcePreview Component**
```typescript
interface SourcePreviewProps {
  source: Source;
  isActive: boolean;
}

interface SourcePreviewState {
  content: string | PDFDocument | AudioTranscript;
  isLoading: boolean;
  error?: string;
}
```

#### 3. AI-Powered Components

**AIChat Component**
```typescript
interface AIChatProps {
  studyId: string;
  availableSources: Source[];
  disabledSources: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceReference[];
  timestamp: Date;
}
```

**StudyArtifactGenerator Component**
```typescript
interface StudyArtifactProps {
  type: 'notes' | 'summary' | 'study-guide';
  sources: Source[];
  studyId: string;
}

interface GeneratedArtifact {
  id: string;
  type: string;
  content: string;
  sources: SourceReference[];
  lastModified: Date;
}
```

#### 4. Interactive Learning Components

**QuizInterface Component**
```typescript
interface QuizInterfaceProps {
  studyId: string;
  sources: Source[];
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  sourceReference: SourceReference;
}
```

**FlashcardDeck Component**
```typescript
interface FlashcardDeckProps {
  studyId: string;
  sources: Source[];
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceReference: SourceReference;
  lastReviewed?: Date;
}
```

**PodcastGenerator Component**
```typescript
interface PodcastGeneratorProps {
  studyId: string;
  sources: Source[];
}

interface PodcastOptions {
  length: 'short' | 'medium' | 'long';
  style: 'conversational' | 'lecture' | 'interview';
  focusAreas: string[];
}
```

## Data Models

### Core Entities

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface Folder {
  id: string;
  name: string;
  userId: string;
  studies: Study[];
  createdAt: Date;
  updatedAt: Date;
}

interface Study {
  id: string;
  name: string;
  folderId: string;
  userId: string;
  sources: Source[];
  artifacts: StudyArtifact[];
  chatHistory: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface Source {
  id: string;
  studyId: string;
  type: 'pdf' | 'video' | 'website' | 'text' | 'audio';
  name: string;
  originalUrl?: string;
  filePath?: string;
  content: string;
  metadata: SourceMetadata;
  embeddings: number[];
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface StudyArtifact {
  id: string;
  studyId: string;
  type: 'notes' | 'summary' | 'study-guide' | 'quiz' | 'flashcards' | 'podcast';
  title: string;
  content: any; // JSON content specific to artifact type
  sourceReferences: SourceReference[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Supporting Types

```typescript
interface SourceMetadata {
  fileSize?: number;
  duration?: number; // for audio/video
  pageCount?: number; // for PDFs
  wordCount: number;
  language: string;
  extractedAt: Date;
}

interface SourceReference {
  sourceId: string;
  sourceName: string;
  pageNumber?: number;
  timestamp?: number;
  excerpt: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  defaultStudyTools: DrawerType[];
  aiResponseLength: 'concise' | 'detailed';
  autoGenerateArtifacts: boolean;
}
```

## Error Handling

### Client-Side Error Handling

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Global error handling for API calls
const handleApiError = (error: ApiError) => {
  switch (error.status) {
    case 401:
      // Redirect to login
      break;
    case 413:
      // File too large
      showToast('File size exceeds limit');
      break;
    case 429:
      // Rate limiting
      showToast('Too many requests, please wait');
      break;
    default:
      showToast('An unexpected error occurred');
  }
};
```

### Server-Side Error Handling

```typescript
// API route error wrapper
export const withErrorHandling = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
```

### File Processing Error Handling

```typescript
interface ProcessingResult {
  success: boolean;
  content?: string;
  error?: ProcessingError;
}

interface ProcessingError {
  type: 'unsupported_format' | 'file_corrupted' | 'extraction_failed' | 'size_limit_exceeded';
  message: string;
  details?: any;
}
```

## Testing Strategy

### Unit Testing
- **Components**: Test all React components with React Testing Library
- **Utilities**: Test helper functions and data processing utilities
- **API Routes**: Test all API endpoints with mock data
- **State Management**: Test Zustand stores and state transitions

### Integration Testing
- **File Upload Flow**: Test complete file upload and processing pipeline with Supabase Storage
- **AI Integration**: Test AI service integrations with mock responses
- **Database Operations**: Test Supabase client operations with test database
- **Authentication Flow**: Test Supabase Auth flow including session management
- **Real-time Features**: Test Supabase Realtime subscriptions and updates

### End-to-End Testing
- **User Workflows**: Test complete user journeys from source upload to study artifact generation
- **Cross-browser Testing**: Ensure compatibility across major browsers
- **Mobile Responsiveness**: Test responsive design on various screen sizes
- **Performance Testing**: Test with large files and multiple concurrent users

### Testing Tools
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Playwright** for E2E testing
- **MSW (Mock Service Worker)** for API mocking
- **Supabase Test Environment** for database testing
- **Preline UI Test Utilities** for component testing

### Test Coverage Goals
- Minimum 80% code coverage for critical paths
- 100% coverage for utility functions and data processing
- All API endpoints must have corresponding tests
- All user-facing features must have E2E test coverage

### Performance Testing
- **Load Testing**: Test with multiple concurrent users
- **File Processing**: Test with various file sizes and types
- **AI Response Times**: Monitor and optimize AI service response times
- **Database Performance**: Test query performance with large datasets