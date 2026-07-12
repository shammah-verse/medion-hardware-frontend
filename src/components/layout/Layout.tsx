import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useCartStore } from '../../store/useCartStore';
import { Home, Search, Heart, User, ShoppingCart } from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const openCart = useCartStore((state) => state.openCart);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Shop', path: '/products' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'You', path: '/profile' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', action: () => openCart() }
  ];
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent-terracotta/20 selection:text-foreground flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />

      {/* Mobile Floating Bottom Nav */}
      <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center md:hidden px-4 pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl shadow-black/10 border border-slate-200/50 dark:border-slate-800/50 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-sm pointer-events-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.label}
                onClick={() => item.action ? item.action() : navigate(item.path)}
                className={`flex flex-col items-center gap-1 min-w-[56px] transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" fill={isActive ? "currentColor" : "none"} strokeWidth={isActive ? 2 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
