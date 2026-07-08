import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent-terracotta/20">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border-light dark:border-border-dark mt-24 py-12 text-center text-sm text-muted">
        <p>© 2026 Medion Hardware. Designed with care.</p>
      </footer>
    </div>
  );
}
