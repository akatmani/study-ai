# Technology Stack

## Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with Preline UI components
- **State Management**: Zustand for client state, React Query for server state
- **Real-time**: WebSocket client for AI chat
- **Animations**: Framer Motion

## Backend & Infrastructure
- **API**: Next.js API routes (serverless functions)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage with CDN
- **Vector Search**: Supabase Vector (pgvector) for embeddings
- **Real-time**: Supabase Realtime subscriptions

## AI & Processing Services
- **LLM**: OpenAI GPT-4 for chat and content generation
- **Speech**: OpenAI Whisper (STT) and TTS for audio processing
- **Document Processing**: PDF.js for PDF handling
- **Web Scraping**: Puppeteer for website content extraction
- **Video Processing**: YouTube API for video content

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # Run TypeScript checks
```

### Testing
```bash
npm test             # Run unit tests with Jest
npm run test:e2e     # Run Playwright E2E tests
npm run test:coverage # Generate coverage report
```

### Database
```bash
npx supabase start   # Start local Supabase
npx supabase db reset # Reset local database
npx supabase gen types typescript # Generate TypeScript types
```

## Architecture Patterns
- **Component-based**: React components with TypeScript interfaces
- **Server-side rendering**: Next.js App Router with RSC
- **Real-time updates**: Supabase subscriptions for live data
- **Error boundaries**: Comprehensive error handling at component level
- **Responsive design**: Mobile-first with Preline UI components