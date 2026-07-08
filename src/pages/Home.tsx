import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Box, Zap, Shield, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getActiveProducts();
        // The backend now natively returns an ORDER BY RANDOM() feed of products across all vendors.
        // We map over the full array to provide an endless discovery experience.
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await addItem(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  return (
    <div className="flex flex-col gap-y-32 pb-32">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1] tracking-tight mb-8">
            Tools for the modern maker.
          </h1>
          <p className="text-xl md:text-2xl text-muted font-light leading-relaxed mb-12 max-w-2xl">
            Uncompromising hardware designed with an obsessive attention to detail, tactile feedback, and enduring materials.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link to="/products">
              <Button size="lg" className="gap-3">
                Explore Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="ghost">
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-serif text-foreground">Discovery Feed</h2>
          <Link to="/products" className="text-sm font-medium hover:text-foreground text-muted flex items-center gap-2 focus-ring rounded-sm transition-colors">
            View Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full rounded-[24px]" />
                  <div className="space-y-2 px-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))
            : featuredProducts.map((product) => (
                <Card key={product.id} hoverLift className="flex flex-col overflow-hidden group border-none bg-transparent dark:bg-transparent shadow-none dark:shadow-none">
                  <div className="aspect-square bg-[#F5F5F5] dark:bg-[#221F1D] rounded-[24px] mb-6 overflow-hidden relative cursor-pointer" onClick={() => navigate(`/products`)}>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    {product.imageUrl ? (
                       <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-muted text-sm">No Image</div>
                    )}
                    
                    {/* Quick Add Button */}
                    <div className="absolute bottom-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        className="h-12 w-12 p-0 rounded-full shadow-xl"
                        onClick={(e) => handleAddToCart(e, product.id)}
                        aria-label="Add to cart"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-1">{product.name}</h3>
                      <p className="text-sm text-muted">{product.category}</p>
                    </div>
                    <span className="text-lg text-foreground">${product.price.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
        </div>
      </section>

      {/* 3. Features / Benefits */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full py-16">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-accent-terracotta/10 text-accent-terracotta rounded-2xl flex items-center justify-center">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Enduring Materials</h3>
            <p className="text-muted leading-relaxed">
              Machined from solid blocks of aerospace-grade aluminum and finished with protective anodization. Built to last generations, not years.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-14 h-14 bg-accent-sage/10 text-accent-sage rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Invisible Complexity</h3>
            <p className="text-muted leading-relaxed">
              Custom-engineered firmware providing zero-latency wireless connectivity. The technology gets out of your way so you can stay in flow.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-14 h-14 bg-foreground/5 text-foreground rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Lifetime Support</h3>
            <p className="text-muted leading-relaxed">
              Every Medion product is backed by our obsessive customer care team. If something breaks, we repair it. It's that simple.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Editorial Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-serif text-foreground mb-6 leading-tight">
            Designed to disappear into your workflow.
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8">
            We believe that the best tools are the ones you don't notice. By focusing on essential forms and tactile materials, Medion hardware provides a seamless extension of your creative process. No glowing lights, no superfluous buttons. Just pure utility.
          </p>
          <Button variant="outline">Read the Manifesto</Button>
        </div>
        <div className="order-1 md:order-2 aspect-square rounded-[32px] bg-[#E5E5E5] dark:bg-[#2A2A2A] relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-bl from-accent-terracotta/10 to-transparent mix-blend-multiply" />
        </div>
      </section>
    </div>
  );
}
