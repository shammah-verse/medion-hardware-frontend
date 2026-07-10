import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Box, Shield, Plus, X, 
  Star, Truck, RefreshCw, CreditCard 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [email, setEmail] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getActiveProducts();
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

  const categories = [
    { name: 'Compute', desc: 'Motherboards & Processors', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80' },
    { name: 'Memory', desc: 'RAM & Storage', img: 'https://images.unsplash.com/photo-1562976540-1502f7592311?w=600&q=80' },
    { name: 'Peripherals', desc: 'Keyboards & Mice', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80' },
    { name: 'Audio', desc: 'Studio & Casual', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80' },
  ];

  return (
    <div className="flex flex-col w-full bg-background selection:bg-accent-terracotta/20">
      
      {/* 1. Announcement Bar */}
      {showAnnouncement && (
        <div className="w-full bg-foreground text-background py-2.5 px-4 flex justify-between items-center text-xs sm:text-sm font-medium z-40 relative">
          <div className="flex-1 text-center tracking-wide">
            Complimentary global shipping on all orders over $200.
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="p-1 hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative w-full px-6 pt-24 pb-32 lg:px-12 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr from-accent-sage/10 to-accent-terracotta/5 rounded-full blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-4xl text-center flex flex-col items-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <span className="inline-block py-1 px-3 rounded-full border border-border-light dark:border-border-dark text-xs font-medium uppercase tracking-widest text-muted mb-8">
            The New Standard
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[1.05] tracking-tight mb-8">
            Engineered for <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">absolute precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Uncompromising hardware designed with an obsessive attention to detail, tactile feedback, and enduring materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 text-base tracking-wide rounded-full">
                Shop Collection
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base tracking-wide rounded-full border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5">
              Explore Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Value Propositions (Trust Bar) */}
      <section className="w-full border-y border-border-light dark:border-border-dark bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-border-light dark:divide-border-dark">
            <div className="flex flex-col items-center text-center px-4 space-y-3">
              <Truck className="w-6 h-6 text-muted" strokeWidth={1.5} />
              <h4 className="font-medium text-sm text-foreground uppercase tracking-wider">Free Delivery</h4>
              <p className="text-xs text-muted">On all orders over $200</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-3">
              <RefreshCw className="w-6 h-6 text-muted" strokeWidth={1.5} />
              <h4 className="font-medium text-sm text-foreground uppercase tracking-wider">30-Day Returns</h4>
              <p className="text-xs text-muted">No questions asked</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-3">
              <Shield className="w-6 h-6 text-muted" strokeWidth={1.5} />
              <h4 className="font-medium text-sm text-foreground uppercase tracking-wider">Lifetime Warranty</h4>
              <p className="text-xs text-muted">Built to last generations</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-3">
              <CreditCard className="w-6 h-6 text-muted" strokeWidth={1.5} />
              <h4 className="font-medium text-sm text-foreground uppercase tracking-wider">Secure Checkout</h4>
              <p className="text-xs text-muted">Bank-grade encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-border-light dark:border-border-dark pb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Essentials by Category</h2>
          <Link to="/products" className="text-sm font-medium hover:text-foreground text-muted flex items-center gap-1 group transition-colors mt-4 md:mt-0">
            View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} to={`/products?category=${cat.name}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-multiply dark:mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white/80 text-xs uppercase tracking-widest mb-1">{cat.desc}</p>
                <h3 className="text-2xl font-serif text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Discovery Feed / Featured Products */}
      <section className="px-6 pb-24 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-border-light dark:border-border-dark pb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Curated For You</h2>
          <Link to="/products" className="text-sm font-medium hover:text-foreground text-muted flex items-center gap-1 group transition-colors mt-4 md:mt-0">
            Shop All Hardware <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <div className="space-y-2 px-1">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            : featuredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="group relative flex flex-col cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                  <div className="relative aspect-square bg-[#F7F7F7] dark:bg-[#1A1A1A] rounded-2xl mb-4 overflow-hidden">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                       <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-muted text-sm font-medium">No Image</div>
                    )}
                    
                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        variant="primary"
                        className="h-10 w-10 p-0 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center"
                        onClick={(e) => handleAddToCart(e, product.id)}
                        aria-label="Add to cart"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col px-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-base font-medium text-foreground leading-tight">{product.name}</h3>
                      <span className="text-base font-medium text-foreground">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted">{product.category}</p>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* 5. Promotional Campaign Block */}
      <section className="w-full bg-foreground text-background py-24 my-12 relative overflow-hidden">
        {/* Background texture/image placeholder */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=80')] bg-cover bg-center mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="text-accent-sage text-sm font-semibold uppercase tracking-widest mb-4 block">Limited Edition</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">The Obsidian Collection. <br/> Machined from solid carbon.</h2>
            <p className="text-lg text-background/70 mb-8 font-light">Experience the perfect balance of weight, thermal performance, and stealth aesthetics. Only 500 units produced globally.</p>
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 rounded-full px-8">
              Explore Obsidian
            </Button>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals (Just Dropped) */}
      <section className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Just Dropped</h2>
          <p className="text-muted max-w-2xl mx-auto">The latest additions to our platform, vetted for quality and performance.</p>
        </div>
        
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-6 hide-scrollbar">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <Skeleton key={i} className="min-w-[280px] md:min-w-0 aspect-[3/4] rounded-2xl" />
             ))
          ) : (
            featuredProducts.slice(8, 11).map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-0 group cursor-pointer relative" onClick={() => navigate(`/products/${product.id}`)}>
                <div className="aspect-[3/4] bg-[#F0F0F0] dark:bg-[#151515] rounded-2xl overflow-hidden relative">
                   <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                     New
                   </div>
                   {product.imageUrls && product.imageUrls.length > 0 && (
                     <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                   )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted">{product.category}</p>
                  </div>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 8. Social Proof / Reviews */}
      <section className="w-full bg-black/5 dark:bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-foreground mb-16">Trusted by the best.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "The build quality is completely unmatched. It feels like a tool that will outlast my career.", author: "Sarah J.", role: "Industrial Designer" },
              { text: "Zero latency and a flawless aesthetic. Exactly what the professional hardware market needed.", author: "Marcus T.", role: "Software Engineer" },
              { text: "Every detail has been considered. The unboxing experience alone justifies the premium.", author: "Elena R.", role: "Creative Director" }
            ].map((review, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                <div className="flex gap-1 text-accent-sage">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg font-serif text-foreground leading-relaxed">"{review.text}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground uppercase tracking-wider">{review.author}</p>
                  <p className="text-xs text-muted mt-1">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Capture */}
      <section className="max-w-4xl mx-auto px-6 py-32 w-full text-center">
        <div className="w-16 h-16 bg-accent-terracotta/10 text-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-8">
          <Box className="w-8 h-8" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Join the Inner Circle.</h2>
        <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
          Subscribe to receive early access to new hardware drops, exclusive editorial content, and 10% off your first order.
        </p>
        <form 
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); setEmail(''); }}
        >
          <div className="flex-1">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-full px-6"
            />
          </div>
          <Button type="submit" className="h-12 rounded-full px-8 whitespace-nowrap">
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-muted mt-6">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
      </section>

    </div>
  );
}
