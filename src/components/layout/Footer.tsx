import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Footer() {
  return (
    <footer className="w-full border-t border-border-light dark:border-border-dark bg-[#FAFAFA] dark:bg-[#0B0F19] mt-0">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-serif tracking-tight text-foreground">Medion.</h2>
            <p className="text-muted max-w-md text-sm leading-relaxed">
              Shop easily for premium products, find top-rated services near you, or launch your own multi-vendor storefront in minutes. Join our thriving community today!
            </p>
            <form className="flex max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-terracotta/20 dark:focus:ring-accent-sage/20"
              />
              <Button type="submit" variant="primary" className="px-6">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link to="/products" className="hover:text-foreground transition-colors focus-ring rounded-sm">All Products</Link></li>
              <li><Link to="/vendor" className="hover:text-foreground transition-colors focus-ring rounded-sm">Start a Store</Link></li>
              <li><Link to="/stores" className="hover:text-foreground transition-colors focus-ring rounded-sm">View Stores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link to="/stores" className="hover:text-foreground transition-colors focus-ring rounded-sm">Find a Store</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors focus-ring rounded-sm">Our Story</Link></li>
              <li><Link to="/journal" className="hover:text-foreground transition-colors focus-ring rounded-sm">Journal</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors focus-ring rounded-sm">Support</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors focus-ring rounded-sm">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-24 border-t border-border-light dark:border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Medion Hardware. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors cursor-pointer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors cursor-pointer">Instagram</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors cursor-pointer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
