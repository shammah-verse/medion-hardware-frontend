import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Store, Package, Flame, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isNearby, setIsNearby] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Default search routes to products, but could be enhanced to global search page
    navigate(`/products?search=${encodeURIComponent(query)}&nearby=${isNearby}`);
    onClose();
  };

  const quickLinks = [
    { icon: <Package className="w-5 h-5" />, label: 'Products', path: '/products' },
    { icon: <Store className="w-5 h-5" />, label: 'Stores', path: '/stores' },
    { icon: <Flame className="w-5 h-5" />, label: 'Services', path: '/services' },
    { icon: <Grid className="w-5 h-5" />, label: 'Categories', path: '/categories' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="relative border-b border-slate-100 dark:border-slate-800 flex items-center">
              <div className="pl-8 pr-4">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products, stores, or services..."
                className="w-full h-20 bg-transparent text-xl font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <div className="pr-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNearby(!isNearby)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    isNearby 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Nearby
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { navigate(link.path); onClose(); }}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-900/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {link.icon}
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
