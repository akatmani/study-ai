# Project Structure

## Application Layout
The AI Study Tool follows a three-panel layout architecture:

- **Left Navigation**: Collapsible sidebar for folder/study organization and user profile
- **Central Workspace**: Main content area for source preview and management
- **Right Action Bar**: Vertical toolbar with expandable drawers for study tools

## Component Organization

### Layout Components
- `LeftNavigation`: Folder tree, recent studies, search, user profile
- `MainWorkspace`: Source display, upload area, content preview
- `RightActionBar`: Tool icons (chat, notes, summary, quiz, flashcards, podcast)
- `DrawerContainer`: Expandable panels for each study tool

### Core Features
- `SourceUploader`: Multi-format file upload with drag-and-drop
- `SourcePreview`: PDF viewer, transcript display, text content
- `AIChat`: Real-time chat interface with source references
- `StudyArtifacts`: Notes, summaries, study guides generation
- `InteractiveLearning`: Quiz interface, flashcard deck, podcast player

## Data Hierarchy

```
User
├── Folders (subject/topic organization)
│   └── Studies (individual learning sessions)
│       ├── Sources (PDFs, videos, websites, audio, text)
│       ├── Chat History (AI conversations)
│       └── Study Artifacts (notes, summaries, quizzes, etc.)
```

## File Structure Conventions

### Component Files
- Use PascalCase for component names
- Include TypeScript interfaces in same file or separate `.types.ts`
- Co-locate component-specific styles and tests

### API Routes
- RESTful endpoints under `/api/`
- Separate routes for different entities (studies, sources, artifacts)
- WebSocket handlers for real-time features

### Database Schema
- Use snake_case for table and column names
- Implement Row Level Security (RLS) policies
- Foreign key relationships maintain data integrity

## State Management
- **Zustand stores**: Client-side state (UI, navigation, selections)
- **React Query**: Server state caching and synchronization
- **Supabase Realtime**: Live updates for collaborative features

## Error Handling
- Component-level error boundaries
- API route error wrappers
- User-friendly error messages with recovery options
- Comprehensive logging for debugging