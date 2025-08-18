import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study Buddy - AI-Powered Study Tools',
  description: 'Upload your study materials and generate flashcards, quizzes, and study guides with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
