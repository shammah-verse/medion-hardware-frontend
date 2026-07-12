import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Plus, 
  Star, Truck, CreditCard,
  Store, CheckCircle2, Package,
  ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { categoriesApi } from '../api/categories';
import type { Category } from '../api/categories';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
        setLoadingProducts(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getFeaturedCategories();
        
        // Ensure Services card is present
        const hasServices = data.some(c => c.type === 'SERVICE');
        const finalCategories = hasServices ? data : [
          {
            id: 'services-static',
            name: 'Local Services',
            description: 'Book professional contractors, mechanics, and local experts.',
            imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
            icon: '🛠️',
            itemCount: 24,
            featured: true,
            type: 'SERVICE'
          } as Category,
          ...data
        ];
        
        setCategories(finalCategories);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchProducts();
    fetchCategories();
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // pixels to scroll
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

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

      {/* 4. Shop by Category (Premium Slider) */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
              <p className="text-slate-500 max-w-xl">Find exactly what you need from our comprehensive selection of professional products and services.</p>
            </div>
            <div className="flex items-center gap-4 mt-6 md:mt-0">
              <Link to="/categories" className="text-orange-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all hidden md:flex mr-4">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => scrollCategories('left')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => scrollCategories('right')}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative -mx-6 px-6 lg:-mx-8 lg:px-8">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
            >
              {loadingCategories ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-[4/5] rounded-[32px] snap-center shrink-0">
                    <Skeleton className="w-full h-full rounded-[32px]" />
                  </div>
                ))
              ) : categories.length === 0 ? (
                <div className="w-full py-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Search className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-500 font-medium text-lg">No categories found.</p>
                  <p className="text-slate-400 text-sm">Please check back later or update backend API.</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={cat.type === 'SERVICE' || cat.id === 'services-static' ? '/services' : `/categories/${cat.id}`} 
                    className="group relative block min-w-[280px] md:min-w-[320px] aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 snap-center shrink-0"
                    draggable="false"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
                    <img src={cat.imageUrl} alt={cat.name} draggable="false" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-transform duration-700 ease-out" />
                    
                    <div className="absolute top-6 right-6 z-20">
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm border border-white/20">
                        {cat.itemCount} Items
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/30 transform group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300 mb-4">
                        {/* Assuming icon might be an emoji or an image URL */}
                        {cat.icon ? (cat.icon.length < 5 ? cat.icon : <img src={cat.icon} alt="icon" className="w-6 h-6 invert" />) : <Package className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-2xl leading-tight mb-2 tracking-tight group-hover:text-orange-400 transition-colors">{cat.name}</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
                        
                        <div className="flex items-center text-white text-sm font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Explore {cat.type === 'SERVICE' ? 'Services' : 'Products'} <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            <div className="md:hidden mt-4 text-center">
              <Link to="/categories" className="text-orange-500 font-bold flex items-center justify-center gap-2">
                View All Categories <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
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

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {loadingProducts
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 min-w-[280px] shrink-0">
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
                    className="group flex flex-col min-w-[280px] w-[280px] shrink-0 snap-center cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden">
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                          <Package className="w-3 h-3 text-emerald-500" /> {product.category}
                        </span>
                      </div>

                      <img 
                        src={product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0].startsWith('http') && !product.imageUrls[0].includes('example.com') ? product.imageUrls[0] : `https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80`} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      
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
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description || 'Premium quality, professionally crafted and verified for superior performance and durability.'}</p>
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
          <div className="flex gap-8 overflow-x-auto pb-8 snap-x scrollbar-hide items-center">
            {[
              { text: "This platform transformed how we source materials. Being able to compare prices from multiple local hardware stores in one checkout is a game changer for our construction firm.", author: "Marcus T.", role: "Lead Contractor" },
              { text: "We opened our digital storefront on the Pro Plan and saw a 40% increase in revenue within two months. The dashboard insights are incredible.", author: "Sarah J.", role: "Owner, City Hardware Co." },
              { text: "Secure payments and guaranteed delivery dates. As an interior designer, I rely on this marketplace to keep my projects on schedule.", author: "Elena R.", role: "Interior Designer" },
              { text: "The verified vendor program gives us peace of mind when ordering bulk supplies for our development projects. Highly recommended.", author: "David W.", role: "Project Manager" },
              { text: "I found exactly the specialized tools I needed from a store just 5 miles away. The convenience and local support are unmatched.", author: "Michael C.", role: "Independent Builder" }
            ].map((review, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[400px] shrink-0 snap-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-left shadow-sm transform hover:scale-105 transition-all duration-300 opacity-90 hover:opacity-100">
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

      {/* 11. FAQs Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg">Everything you need to know about shopping with us.</p>
        </div>
        <div className="space-y-6">
          {[
            { q: "How do I find local stores?", a: "You can use our 'Find a Store' feature which utilizes your location to show the nearest verified hardware vendors, complete with their distance and reviews." },
            { q: "Is payment secure?", a: "Yes, all payments are processed securely through Pesapal, ensuring your funds are protected with enterprise-grade encryption until your delivery is confirmed." },
            { q: "Can I become a vendor?", a: "Absolutely! Click 'Start Selling Today' to set up your digital storefront and get access to our vendor dashboard and analytics." },
            { q: "How are products delivered?", a: "Our partner stores handle logistics. Delivery options and times are clearly shown during checkout based on your location." }
          ].map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-left">
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
