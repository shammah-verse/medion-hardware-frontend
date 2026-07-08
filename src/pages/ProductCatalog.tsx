import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

// Mock data
const mockProducts = [
  { id: 1, name: 'Model 01 Keyboard', price: 249, category: 'Input' },
  { id: 2, name: 'Precision Mouse', price: 129, category: 'Input' },
  { id: 3, name: 'Studio Display Arm', price: 189, category: 'Workspace' },
  { id: 4, name: 'Machined Desk Mat', price: 89, category: 'Workspace' },
  { id: 5, name: 'Tactile Macro Pad', price: 149, category: 'Input' },
  { id: 6, name: 'Acoustic Panels', price: 199, category: 'Environment' },
];

export function ProductCatalog() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground">
          The Collection
        </h1>
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto snap-x">
          {['All', 'Input', 'Workspace', 'Environment'].map((cat) => (
            <Button key={cat} variant={cat === 'All' ? 'primary' : 'ghost'} size="sm" className="snap-start whitespace-nowrap">
              {cat}
            </Button>
          ))}
        </div>
      </div>

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
          : mockProducts.map((product) => (
              <Card key={product.id} hoverLift className="flex flex-col overflow-hidden group cursor-pointer border-none bg-transparent dark:bg-transparent shadow-none dark:shadow-none">
                <div className="aspect-square bg-[#F5F5F5] dark:bg-[#221F1D] rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  {/* Image placeholder */}
                </div>
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">{product.name}</h3>
                    <p className="text-muted">{product.category}</p>
                  </div>
                  <span className="text-lg text-foreground">${product.price}</span>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
