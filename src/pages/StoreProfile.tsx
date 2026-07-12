import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Store as StoreIcon, ShieldCheck, UserPlus, UserCheck, Package, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { storesApi } from '../api/stores';
import type { Store } from '../api/stores';
import type { Product } from '../api/products';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';

export function StoreProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore(state => state.addItem);
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchStoreDetails(id);
    }
  }, [id]);

  const fetchStoreDetails = async (storeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [storeData, productsData] = await Promise.all([
        storesApi.getStore(storeId),
        storesApi.getStoreProducts(storeId)
      ]);
      setStore(storeData);
      setProducts(productsData);
      setIsFollowing(storeData.isFollowing || false);
    } catch (err) {
      console.error("Failed to load store profile", err);
      setError("We couldn't load the store profile at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!store) return;
    
    setFollowLoading(true);
    const previousState = isFollowing;
    // Optimistic update
    setIsFollowing(!previousState);
    
    try {
      if (previousState) {
        await storesApi.unfollowStore(store.id);
      } else {
        await storesApi.followStore(store.id);
      }
    } catch (err) {
      console.error("Failed to toggle follow status", err);
      // Revert on error
      setIsFollowing(previousState);
    } finally {
      setFollowLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] pb-24">
        <Skeleton className="w-full h-64 md:h-80" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 relative z-10">
          <Skeleton className="w-32 h-32 rounded-3xl border-4 border-white mb-6" />
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="px-6 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-accent-terracotta/10 text-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
            <StoreIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif text-foreground mb-4">Profile Unavailable</h2>
          <p className="text-muted mb-8">{error}</p>
          <Button onClick={() => navigate('/stores')}>Back to Directory</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 bg-slate-200 dark:bg-slate-800">
        {store.bannerUrl ? (
          <img src={store.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-emerald-500/20 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-slate-400 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button 
          variant="ghost" 
          className="absolute top-6 left-6 text-white hover:bg-white/20 backdrop-blur-md rounded-full h-10 w-10 p-0 z-20"
          onClick={() => navigate('/stores')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20 relative z-10 flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 -mt-20 mb-6 overflow-hidden flex items-center justify-center shadow-lg relative">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover bg-white" />
              ) : (
                <StoreIcon className="w-12 h-12 text-slate-400" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{store.name}</h1>
            
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">4.9</span>
              <span className="text-xs text-amber-600/70 dark:text-amber-400/70 font-medium ml-1">(124 reviews)</span>
            </div>

            <Button 
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`w-full py-6 rounded-2xl text-base font-bold shadow-lg transition-all mb-8 flex items-center justify-center gap-2
                ${isFollowing 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white border-0 shadow-none' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                }`}
            >
              {isFollowing ? (
                <><UserCheck className="w-5 h-5" /> Following</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Follow Provider</>
              )}
            </Button>

            <div className="w-full space-y-4 text-left border-t border-slate-100 dark:border-slate-700 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Location</p>
                  <p className="text-sm text-slate-500">{store.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Hours</p>
                  <p className="text-sm text-slate-500">{store.openingHours || '10:00 AM - 8:00 PM'}</p>
                </div>
              </div>
              {store.status === 'APPROVED' && (
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified Partner</p>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">Authorized Service Provider</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 mt-8 md:mt-0">
          
          {/* Bio Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              {store.bio || "This provider has not added a bio yet, but they are fully verified on our platform to provide top-quality hardware materials and services."}
            </p>
          </div>

          {/* Ads / Work Portfolio Carousel */}
          {store.adsUrls && store.adsUrls.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Work & Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.adsUrls.map((url, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-[4/3] rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group shadow-sm hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setSelectedMedia(url)}
                  >
                    <img src={url} alt={`Portfolio ${idx}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services & Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-500" />
              Available Products & Services
            </h2>
            
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No items listed</h3>
                <p className="text-slate-500">This provider hasn't listed any products or services yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <motion.div 
                    whileHover={{ y: -6 }}
                    key={product.id} 
                    className="group cursor-pointer bg-white dark:bg-slate-800 rounded-[24px] p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden">
                      <img 
                        src={product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0].startsWith('http') && !product.imageUrls[0].includes('example.com') ? product.imageUrls[0] : `https://loremflickr.com/800/800/${encodeURIComponent((product.name || '').split(' ')[0] || 'tool')},tool?lock=${product.id ? product.id.charCodeAt(0) : 1}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    </div>
                    <div className="px-2 pb-2 flex flex-col flex-1">
                      <p className="text-xs font-semibold text-orange-500 mb-1">{product.category}</p>
                      <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{product.description || 'Professional grade equipment.'}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        <Button 
                          size="sm" 
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="h-8 rounded-lg px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white border-0 font-semibold"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-orange-500 transition-colors"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedMedia} 
              alt="Expanded view" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
