import { useState, useEffect } from 'react';

import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { ProductCard } from '../components/ui/ProductCard';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-12">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] sm:aspect-square w-full rounded-2xl md:rounded-3xl" />
                <div className="space-y-2 px-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          : filteredProducts.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
      </div>
    </div>
  );
}
