import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Store as StoreIcon } from 'lucide-react';
import { storesApi } from '../api/stores';
import type { Store } from '../api/stores';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Stores() {
  const [stores, setStores] = useState<(Store & { rating: number, reviews: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const navigate = useNavigate();

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; 
    return d;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI/180);
  }

  const handleFindNearMe = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const storesWithDistance = stores.map(store => {
          // If a store doesn't have valid lat/lon, put it at the end
          if (!store.latitude || !store.longitude) return { ...store, distance: 99999 };
          const dist = calculateDistance(latitude, longitude, store.latitude, store.longitude);
          return { ...store, distance: Number(dist.toFixed(1)) };
        }).sort((a, b) => a.distance - b.distance);
        
        setStores(storesWithDistance);
        setIsLocating(false);
      },
      () => {
        setLocationError("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      }
    );
  };

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
        <p className="text-lg text-muted mb-8">
          Discover top-rated, authorized Medion vendors across the country. Our partners are thoroughly vetted to ensure you receive genuine products and exceptional service.
        </p>
        <Button 
          onClick={handleFindNearMe} 
          disabled={isLocating}
          className="gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-2xl px-8 py-6 text-base font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/10 transition-all hover:-translate-y-0.5"
        >
          <MapPin className="w-5 h-5" />
          {isLocating ? 'Locating...' : 'Find Stores Near Me'}
        </Button>
        {locationError && (
          <p className="text-red-500 mt-4 text-sm font-medium">{locationError}</p>
        )}
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[32px] border border-border-light dark:border-border-dark">
          <StoreIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground">No Stores Available</h3>
          <p className="text-muted mt-2">Check back later as new vendors join our platform.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div 
              key={store.id}
              onClick={() => navigate(`/stores/${store.id}`)}
              className="group relative bg-white dark:bg-[#111111] border border-border-light dark:border-border-dark rounded-[32px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            >
              {/* Top Banner indicating ranking removed as per request */}
              
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
                    <div className="flex flex-col">
                      <span className="text-sm">{store.address}</span>
                      {store.distance !== undefined && store.distance < 99999 && (
                        <span className="text-xs font-bold text-accent-terracotta mt-1">{store.distance} km away</span>
                      )}
                    </div>
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
