import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Plus, 
  Star, Truck, CreditCard,
  Building2,
  Store, CheckCircle2, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

// Animation Variants
const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
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
    { name: 'Cement & Concrete', icon: '🧱', desc: 'Premium grade building materials', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
    { name: 'Paint & Finishes', icon: '🎨', desc: 'Interior and exterior coatings', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
    { name: 'Power Tools', icon: '⚙️', desc: 'Professional grade equipment', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
    { name: 'Plumbing & PVC', icon: '🚰', desc: 'Pipes, fittings, and fixtures', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80' },
    { name: 'Roofing Sheets', icon: '🏠', desc: 'Durable weather protection', img: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600&q=80' },
    { name: 'Timber & Wood', icon: '🪵', desc: 'Structural and decorative wood', img: 'https://images.unsplash.com/photo-1533090360678-1a6e70eb18bd?w=600&q=80' },
  ];

  const heroSlides = [
    { img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80", text: "Professional Grade Tools" },
    { img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80", text: "Premium Building Materials" },
    { img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80", text: "Plumbing & Piping" }
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 selection:bg-orange-500/30 font-sans">
      
      {/* 1. Premium Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900 dark:bg-[#080B12]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-orange-500/10 via-emerald-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex-1 text-left pt-12 lg:pt-0"
          >
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Everything Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Construction Project</span> Needs.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-2xl">
              Discover premium building materials and professional tools from verified local suppliers. Shop seamlessly across multiple vendors, or grow your own hardware business online.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/25 transition-all">
                  Browse Products
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/vendor" : "/login"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl border-slate-700 text-white hover:bg-white/5 backdrop-blur-sm">
                  Open Your Hardware Store
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by 500+ Local Hardware Stores
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
              {heroSlides.map((slide, idx) => (
                <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={slide.img} alt={slide.text} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <h3 className="text-2xl font-bold text-white tracking-wide">{slide.text}</h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Marketplace Statistics */}
      <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100 dark:divide-slate-700">
            <div className="flex flex-col items-center text-center px-4 space-y-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">500+</span>
              <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Store className="w-4 h-4"/> Verified Vendors</span>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">50k+</span>
              <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Package className="w-4 h-4"/> Products Listed</span>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">120k</span>
              <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Truck className="w-4 h-4"/> Orders Delivered</span>
            </div>
            <div className="flex flex-col items-center text-center px-4 space-y-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">99%</span>
              <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400"/> Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Customers Choose Our Marketplace */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Smarter Way to Source Hardware</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Compare prices, discover local suppliers, and order professional-grade materials from one unified platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Vendors, One Cart</h3>
              <p className="text-slate-500 leading-relaxed">Source materials from various hardware stores and checkout instantly. We handle the logistics and routing.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Suppliers</h3>
              <p className="text-slate-500 leading-relaxed">Every vendor undergoes a strict vetting process. Buy with confidence knowing you're dealing with professionals.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Pesapal Checkout</h3>
              <p className="text-slate-500 leading-relaxed">Enterprise-grade payment processing protects your transactions. Your funds are safe until delivery is confirmed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Category */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-slate-500">Explore premium materials across thousands of stores.</p>
            </div>
            <Link to="/products" className="text-orange-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all mt-4 md:mt-0">
              View All Categories <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.name}`} className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out" />
                
                <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-lg border border-white/30 transform group-hover:-translate-y-1 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{cat.name}</h3>
                    <p className="text-white/70 text-xs">{cat.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-slate-500">Hand-picked premium materials from top-rated vendors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="aspect-square w-full rounded-3xl" />
                    <div className="space-y-2 px-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))
              : featuredProducts.slice(0, 8).map((product) => (
                  <motion.div 
                    whileHover={{ y: -8 }}
                    key={product.id} 
                    className="group flex flex-col cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden">
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                          <Store className="w-3 h-3 text-emerald-500" /> {product.storeName || 'Vendor Pro'}
                        </span>
                      </div>

                      {product.imageUrls && product.imageUrls.length > 0 ? (
                         <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Image</div>
                      )}
                      
                      {/* Quick Add Button */}
                      <div className="absolute bottom-3 right-3 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Button 
                          size="sm" 
                          className="h-10 w-10 p-0 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                          onClick={(e) => handleAddToCart(e, product.id)}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col px-2 pb-2">
                      <p className="text-xs font-semibold text-orange-500 mb-1">{product.category}</p>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* 7. Vendor Section (Pitching the SaaS Model) */}
      <section className="py-24 bg-slate-900 dark:bg-[#080B12] text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 block">For Hardware Businesses</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Grow Your Hardware Business Online.</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Create your digital storefront in minutes. Manage inventory, process orders, and reach customers nationwide using our premium vendor tools.
            </p>
            
            <ul className="space-y-4 mb-10">
              {['Beautiful Branded Storefront', 'Advanced Sales Analytics Dashboard', 'Secure Payment Processing', 'Integrated Shipping Logistics'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link to={isAuthenticated ? "/vendor" : "/login"}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-14">
                Start Selling Today
              </Button>
            </Link>
          </div>

          {/* Pricing Cards */}
          <div className="flex-1 w-full grid sm:grid-cols-2 gap-6">
            {/* Commission Plan */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Commission Plan</h3>
              <p className="text-slate-400 text-sm mb-6">Perfect for getting started</p>
              <div className="mb-8">
                <span className="text-4xl font-black">5%</span>
                <span className="text-slate-400 font-medium"> / sale</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> No monthly commitment</li>
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Unlimited products</li>
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Basic analytics</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-800 rounded-3xl p-8 border-2 border-orange-500 relative flex flex-col transform sm:-translate-y-4 shadow-2xl shadow-orange-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Vendor Plan</h3>
              <p className="text-slate-400 text-sm mb-6">For serious hardware stores</p>
              <div className="mb-8">
                <span className="text-4xl font-black">$20</span>
                <span className="text-slate-400 font-medium"> / month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> <strong>Keep 100% of profits</strong></li>
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Featured listings</li>
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Advanced SaaS Dashboard</li>
                <li className="text-sm text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Trust & Testimonials */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-16">Trusted by the Industry</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "This platform transformed how we source materials. Being able to compare prices from multiple local hardware stores in one checkout is a game changer for our construction firm.", author: "Marcus T.", role: "Lead Contractor" },
              { text: "We opened our digital storefront on the Pro Plan and saw a 40% increase in revenue within two months. The dashboard insights are incredible.", author: "Sarah J.", role: "Owner, City Hardware Co." },
              { text: "Secure payments and guaranteed delivery dates. As an interior designer, I rely on this marketplace to keep my projects on schedule.", author: "Elena R.", role: "Interior Designer" }
            ].map((review, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-left shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{review.author}</p>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Newsletter Capture */}
      <section className="max-w-4xl mx-auto px-6 py-24 w-full text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-12">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Build Better. Shop Smarter.</h2>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
          Subscribe to receive updates about new hardware stores, seasonal promotions, and industry insights directly to your inbox.
        </p>
        <form 
          className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); setEmail(''); }}
        >
          <div className="flex-1">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 rounded-2xl px-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <Button type="submit" className="h-14 rounded-2xl px-8 font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 whitespace-nowrap">
            Subscribe
          </Button>
        </form>
      </section>

    </div>
  );
}
