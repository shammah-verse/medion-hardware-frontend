import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, Package } from 'lucide-react';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getActiveProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation(); // Prevent card click if we wrap the card in a link later
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await addItem(productId, 1);
      // We could add a toast notification here in a full app
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground">
          The Collection
        </h1>
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto snap-x">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? 'primary' : 'ghost'} 
              size="sm" 
              className="snap-start whitespace-nowrap"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-6 mb-12 bg-accent-terracotta/10 text-accent-terracotta rounded-2xl border border-accent-terracotta/20 text-center">
          {error}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="py-24 text-center text-muted">
          <p className="text-xl">No products found in this category.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 gap-y-6 md:gap-y-16">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 md:gap-4">
                <Skeleton className="aspect-square w-full rounded-lg md:rounded-2xl" />
                <div className="space-y-1 md:space-y-2">
                  <Skeleton className="h-4 md:h-6 w-2/3" />
                  <Skeleton className="h-3 md:h-5 w-1/3" />
                </div>
              </div>
            ))
          : filteredProducts.map((product, index) => (
              <div 
                key={product?.id || index}
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <Card hoverLift className="flex flex-col overflow-hidden group border-none bg-transparent dark:bg-transparent shadow-none dark:shadow-none h-full p-2 md:p-0">
                  <div className="aspect-square bg-[#F5F5F5] dark:bg-[#221F1D] rounded-lg md:rounded-2xl mb-2 md:mb-6 overflow-hidden relative">
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 hidden md:block">
                      <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1 text-slate-900 dark:text-white">
                        <Package className="w-3 h-3 text-emerald-500" /> {product.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img 
                      src={product?.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0].startsWith('http') && !product.imageUrls[0].includes('example.com') ? product.imageUrls[0] : `https://loremflickr.com/800/800/${encodeURIComponent((product?.name || '').split(' ')[0] || 'tool')},tool?lock=${product?.id ? product.id.charCodeAt(0) : 1}`} 
                      alt={product?.name} 
                      loading="lazy"
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {/* Quick Add Button */}
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        className="h-8 w-8 md:h-10 md:w-10 p-0 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                        onClick={(e) => handleAddToCart(e, product.id)}
                        aria-label="Add to cart"
                      >
                        <Plus className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col px-1 md:px-2 pb-1 md:pb-2 flex-1">
                    <p className="text-[10px] md:text-xs font-semibold text-orange-500 mb-0.5 md:mb-1 truncate">{product.category}</p>
                    <h3 className="text-xs md:text-lg font-bold text-foreground mb-0.5 md:mb-1 group-hover:text-accent-terracotta transition-colors line-clamp-1 md:line-clamp-2 leading-tight">{product.name}</h3>
                    <p className="hidden md:block text-sm text-muted line-clamp-2 mb-2 md:mb-3">{product.description || 'Professional grade equipment for your next project.'}</p>
                    <span className="text-sm md:text-lg text-foreground font-black shrink-0 mt-auto">${product.price.toFixed(2)}</span>
                  </div>
                </Card>
              </div>
            ))}
      </div>
    </div>
  );
}
