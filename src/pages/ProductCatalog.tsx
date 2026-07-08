import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { productsApi, Product } from '../api/products';
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <Card key={product.id} hoverLift className="flex flex-col overflow-hidden group border-none bg-transparent dark:bg-transparent shadow-none dark:shadow-none">
                <div className="aspect-square bg-[#F5F5F5] dark:bg-[#221F1D] rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  {product.imageUrl ? (
                     <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-muted text-sm">No Image</div>
                  )}
                  
                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button 
                      size="sm" 
                      className="h-10 w-10 p-0 rounded-full shadow-lg"
                      onClick={(e) => handleAddToCart(e, product.id)}
                      aria-label="Add to cart"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">{product.name}</h3>
                    <p className="text-muted">{product.category}</p>
                  </div>
                  <span className="text-lg text-foreground">${product.price.toFixed(2)}</span>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
