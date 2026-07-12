import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, Settings, Package, LogOut, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { SearchOverlay } from './SearchOverlay';

export function Navbar() {
  const { isAuthenticated, profile, logout } = useAuthStore();
  const { openCart, cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8 relative">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground font-serif">
            Medion.
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-10 text-sm font-medium text-muted">
          <Link to="/products" className="group relative py-1 hover:text-orange-500 transition-colors duration-300">
            Catalog
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
          </Link>
          <Link to="/stores" className="group relative py-1 hover:text-orange-500 transition-colors duration-300">
            Stores
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
          </Link>
          {isAuthenticated && profile?.role === 'STORE_VENDOR' && (
            <Link to="/vendor/dashboard" className="group relative py-1 text-orange-500 transition-colors duration-300">
              Vendor Portal
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 opacity-30 rounded-full"></span>
            </Link>
          )}
          {isAuthenticated && profile?.role === 'ADMIN' && (
            <Link to="/admin/dashboard" className="group relative py-1 text-orange-500 transition-colors duration-300">
              Admin Panel
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 opacity-30 rounded-full"></span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors focus-ring rounded-full px-3 py-1 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Hi, {profile?.firstName || profile?.username || 'User'}
                <div className="w-8 h-8 rounded-full bg-accent-sage/10 text-accent-sage flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border-light dark:border-border-dark rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-border-light dark:border-border-dark mb-2">
                    <p className="text-sm font-medium text-foreground">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-xs text-muted truncate">{profile?.email}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                  
                  <Link 
                    to="/profile/orders" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Orders & Receipts
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-sm text-accent-terracotta hover:bg-accent-terracotta/10 transition-colors border-t border-border-light dark:border-border-dark pt-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors focus-ring rounded-sm">
                Sign in
              </Link>
            </div>
          )}

          <button
            onClick={() => setShowSearch(true)}
            className="relative h-12 w-12 rounded-full p-0 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
          >
            <Search className="h-5 w-5" />
          </button>

          <button 
            onClick={() => {
              if (isAuthenticated) {
                fetchCart();
                openCart();
              } else {
                navigate('/login');
              }
            }} 
            className="relative h-12 w-12 rounded-full p-0 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
          >
            <ShoppingBag className="h-5 w-5" />
            {cart && cart?.items?.length > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-terracotta text-[10px] font-bold text-white">
                {(cart.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0)}
              </span>
            )}
          </button>
          <Button 
            variant="outline" 
            size="sm" 
            className="md:hidden h-10 w-10 md:h-12 md:w-12 rounded-full p-0 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md border border-slate-200 dark:border-slate-700"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity md:hidden ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMobileMenu(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-background border-l border-border-light dark:border-border-dark shadow-2xl p-6 transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-serif font-bold text-foreground">Menu</h2>
            <button 
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            <Link to="/products" className="text-lg font-medium hover:text-orange-500 transition-colors" onClick={() => setShowMobileMenu(false)}>Catalog</Link>
            <Link to="/stores" className="text-lg font-medium hover:text-orange-500 transition-colors" onClick={() => setShowMobileMenu(false)}>Stores</Link>
            
            {isAuthenticated && profile?.role === 'STORE_VENDOR' && (
              <Link to="/vendor/dashboard" className="text-lg font-medium text-orange-500" onClick={() => setShowMobileMenu(false)}>Vendor Portal</Link>
            )}
            {isAuthenticated && profile?.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="text-lg font-medium text-orange-500" onClick={() => setShowMobileMenu(false)}>Admin Panel</Link>
            )}

            <div className="h-px bg-border-light dark:bg-border-dark my-2"></div>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 text-base text-muted hover:text-foreground" onClick={() => setShowMobileMenu(false)}>
                  <Settings className="w-5 h-5" /> Account Settings
                </Link>
                <Link to="/profile/orders" className="flex items-center gap-3 text-base text-muted hover:text-foreground" onClick={() => setShowMobileMenu(false)}>
                  <Package className="w-5 h-5" /> Orders & Receipts
                </Link>
                <button 
                  onClick={() => { logout(); setShowMobileMenu(false); }}
                  className="flex items-center gap-3 text-base text-accent-terracotta"
                >
                  <LogOut className="w-5 h-5" /> Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-3 text-base font-medium text-foreground bg-black/5 dark:bg-white/5 p-3 rounded-xl justify-center mt-4" onClick={() => setShowMobileMenu(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </nav>
  );
}
