import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Polling App</h1>
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