import { ReactNode } from 'react';

export default function PollsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header removed to prevent duplication with root layout */}
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Polling App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}