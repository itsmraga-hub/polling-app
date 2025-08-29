import { ReactNode } from 'react';

export default function PollsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Polling App</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/polls" className="hover:underline">Polls</a></li>
              <li><a href="/polls/create" className="hover:underline">Create Poll</a></li>
              <li><a href="/auth/profile" className="hover:underline">Profile</a></li>
              <li><a href="/auth/sign-in" className="hover:underline">Sign Out</a></li>
            </ul>
          </nav>
        </div>
      </header>
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