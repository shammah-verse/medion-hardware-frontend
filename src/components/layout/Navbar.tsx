import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-8">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground font-serif">
            Medion.
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted">
            <Link to="/products" className="hover:text-foreground transition-colors">Catalog</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Stories</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="relative h-12 w-12 rounded-full p-0">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-accent-terracotta text-[10px] font-bold text-white">
                3
              </span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="md:hidden h-12 w-12 rounded-full p-0">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
