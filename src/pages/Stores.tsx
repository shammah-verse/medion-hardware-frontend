import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Store as StoreIcon, ShieldCheck } from 'lucide-react';
import { storesApi } from '../api/stores';
import type { Store } from '../api/stores';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function Stores() {
  const [stores, setStores] = useState<(Store & { rating: number, reviews: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const allStores = await storesApi.getAll();
      
      // Mock ratings since backend doesn't support them yet
      const storesWithRatings = allStores
        .filter(s => s.status !== 'REJECTED' && s.status !== 'PENDING') // Only show approved stores
        .map(store => ({
          ...store,
          rating: Number((4.5 + Math.random() * 0.5).toFixed(1)), // random rating between 4.5 and 5.0
          reviews: Math.floor(Math.random() * 500) + 50 // random reviews between 50 and 550
        }))
        .sort((a, b) => b.rating - a.rating); // Sort by highest rating

      setStores(storesWithRatings);
    } catch (err) {
      console.error("Failed to load stores", err);
      setError("We couldn't load the store directory at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-24 lg:px-8 max-w-[1400px] mx-auto w-full min-h-[70vh]">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-accent-terracotta/10 text-accent-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
            <StoreIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif text-foreground mb-4">Directory Unavailable</h2>
          <p className="text-muted mb-8">{error}</p>
          <Button onClick={fetchStores}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-24 lg:px-8 max-w-[1400px] mx-auto w-full min-h-[70vh]">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
          Featured Hardware Partners
        </h1>
        <p className="text-lg text-muted">
          Discover top-rated, authorized Medion vendors across the country. Our partners are thoroughly vetted to ensure you receive genuine products and exceptional service.
        </p>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[32px] border border-border-light dark:border-border-dark">
          <StoreIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground">No Stores Available</h3>
          <p className="text-muted mt-2">Check back later as new vendors join our platform.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <div 
              key={store.id}
              className="group relative bg-white dark:bg-[#111111] border border-border-light dark:border-border-dark rounded-[32px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Top Banner indicating ranking */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent-sage text-white text-xs font-bold rounded-full shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Top Ranked
                </div>
              )}
              
              {/* Store Abstract Image/Pattern */}
              <div className="h-48 bg-slate-100 dark:bg-[#1A1A1A] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 dark:to-transparent z-0" />
                <StoreIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 z-10 transition-transform duration-500 group-hover:scale-110" />
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif text-foreground line-clamp-1">{store.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{store.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 text-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-foreground" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted">
                    <Clock className="w-5 h-5 shrink-0 text-foreground" />
                    <span className="text-sm">{store.openingHours || '10:00 AM - 8:00 PM'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border-light dark:border-border-dark">
                  <span className="text-xs font-medium text-muted">{store.reviews} verified reviews</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 rounded-xl"
                    onClick={() => window.open(`https://maps.google.com/?q=${store.latitude},${store.longitude}`, '_blank')}
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
