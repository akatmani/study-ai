# Study Buddy - AI-Powered Study Tools

A modern, minimalistic study companion that helps students upload their study materials and generate AI-powered study tools like flashcards, quizzes, and study guides.

## Design Philosophy

This application follows a **ChatGPT/Notion-inspired design system** with:

- **Minimal color palette**: White backgrounds, subtle greys, and very sparing use of blue accent color
- **Clean typography**: Inter font with dark grey text (not pure black) for better readability
- **Generous whitespace**: Proper spacing and breathing room between elements
- **Subtle shadows**: Light borders and soft shadows for depth without heaviness
- **Rounded corners**: Modern, friendly aesthetic with consistent border radius

### Color System

- **Background**: Pure white (`#ffffff`) for main content, light grey (`#fafafa`) for sidebar
- **Text**: Dark grey (`#525252`) for primary text, medium grey (`#737373`) for secondary
- **Borders**: Light grey (`#e5e5e5`) with subtle shadows
- **Accent**: Blue (`#3b82f6`) used only for active states, primary buttons, and toggles
- **Icons**: Grey (`#a3a3a3`) matching the minimalistic aesthetic

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for consistent, utility-first styling
- **Lucide React** for beautiful, consistent icons
- **React** with modern hooks and patterns

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx    # Left navigation component
│   │   └── MainContent.tsx # Main content area
│   └── ui/
│       └── Button.tsx     # Reusable button component
└── lib/
    └── utils.ts           # Utility functions
```

## Design System Components

### Buttons
- **Secondary** (default): White background, grey border
- **Primary**: Blue background (used sparingly)
- **Destructive**: White background, red border and text

### Navigation
- **Active states**: Light grey background (no blue accent)
- **Hover states**: Subtle background changes
- **Icons**: Consistent grey coloring

### Cards
- **Subtle shadows**: `shadow-subtle` for light elevation
- **Soft shadows**: `shadow-soft` for more prominent cards
- **Rounded corners**: `rounded-lg` for modern feel

## Development Guidelines

1. **Stick to the color palette** - avoid introducing new colors
2. **Use accent color sparingly** - only for active toggles, primary actions
3. **Maintain consistent spacing** - follow the established padding/margin patterns
4. **Keep it minimal** - less is more in this design system

## Future Features

- PDF upload and processing
- YouTube video integration
- AI-powered flashcard generation
- Study guide creation
- Interactive quizzes
- AI chat interface
