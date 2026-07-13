import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent-terracotta/20 selection:text-foreground flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full flex flex-col min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
