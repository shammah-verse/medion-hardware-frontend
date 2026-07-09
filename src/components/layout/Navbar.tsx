import { Link } from 'react-router-dom';
import { ShoppingBag, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

export function Navbar() {
  const { isAuthenticated, profile, logout } = useAuthStore();
  const { openCart, cart } = useCartStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-8">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground font-serif">
            Medion.
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted">
            <Link to="/products" className="hover:text-foreground transition-colors">Catalog</Link>
            <Link to="/stores" className="hover:text-foreground transition-colors">Stores</Link>
            {isAuthenticated && profile?.role === 'STORE_VENDOR' && (
              <Link to="/vendor/dashboard" className="hover:text-foreground transition-colors text-accent-terracotta">Vendor Portal</Link>
            )}
            {isAuthenticated && profile?.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="hover:text-foreground transition-colors text-accent-terracotta">Admin Panel</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <span className="text-muted">Hi, {profile?.firstName}</span>
              <button onClick={logout} className="text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
                Sign in
              </Link>
            </div>
          )}

          <button onClick={openCart} className="relative h-12 w-12 rounded-full p-0 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring">
            <ShoppingBag className="h-5 w-5" />
            {cart && cart.items.length > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-terracotta text-[10px] font-bold text-white">
                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
          <Button variant="ghost" size="sm" className="md:hidden h-12 w-12 rounded-full p-0">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
