import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { storesApi } from '../api/stores';
import type { Store } from '../api/stores';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function Stores() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchNearestStore = () => {
    setLoading(true);
    setError(null);
    setHasRequested(true);

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const nearestStore = await storesApi.getNearest(latitude, longitude);
          setStore(nearestStore);
        } catch (err: any) {
          setError('Failed to connect to the store locator service. Please try again later.');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location access is required to find your nearest Medion store. Please enable location permissions in your browser settings.');
        } else {
          setError('Unable to retrieve your location. Please check your connection or device settings.');
        }
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="px-6 py-24 lg:px-8 max-w-4xl mx-auto w-full min-h-[70vh]">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
          Find a Medion Store
        </h1>
        <p className="text-lg text-muted">
          Experience our uncompromising hardware in person. Locate the nearest flagship store to your current location.
        </p>
      </div>

      <div className="bg-black/5 dark:bg-white/5 rounded-[32px] p-8 md:p-12 border border-border-light dark:border-border-dark overflow-hidden relative">
        {!hasRequested && !loading && !store && !error && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-accent-sage/10 text-accent-sage rounded-full flex items-center justify-center mb-8">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif text-foreground mb-4">Discover Local Availability</h2>
            <p className="text-muted mb-8 max-w-sm">
              Allow location access to instantly find the closest Medion store, complete with directions and opening hours.
            </p>
            <Button size="lg" onClick={fetchNearestStore} className="gap-2">
              <Navigation className="w-4 h-4" />
              Locate Nearest Store
            </Button>
          </div>
        )}

        {loading && (
          <div className="space-y-8 py-8">
            <Skeleton className="h-10 w-2/3 max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
              </div>
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-accent-terracotta/10 text-accent-terracotta rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">Location Required</h2>
            <p className="text-muted mb-8 max-w-md">
              {error}
            </p>
            <Button variant="outline" onClick={fetchNearestStore}>
              Try Again
            </Button>
          </div>
        )}

        {store && !loading && !error && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-sage/10 text-accent-sage text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                Nearest Store
              </div>
              <h2 className="text-3xl font-serif text-foreground mb-4">{store.name}</h2>
              <p className="text-lg text-muted mb-8">{store.address}</p>
              
              <div className="space-y-4 border-t border-border-light dark:border-border-dark pt-8">
                <div className="flex items-center gap-4 text-muted">
                  <Navigation className="w-5 h-5 text-foreground" />
                  <span>{store.distance ? `${store.distance.toFixed(1)} km away` : 'Distance unavailable'}</span>
                </div>
                <div className="flex items-center gap-4 text-muted">
                  <Clock className="w-5 h-5 text-foreground" />
                  <span>{store.openingHours || '10:00 AM - 8:00 PM'}</span>
                </div>
              </div>

              <div className="mt-12">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => window.open(`https://maps.google.com/?q=${store.latitude},${store.longitude}`, '_blank')}>
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div className="aspect-square bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-[24px] relative overflow-hidden flex items-center justify-center text-muted">
              {/* Abstract representation since we don't use a heavy maps SDK */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 text-center space-y-4">
                <MapPin className="w-12 h-12 mx-auto text-accent-sage" />
                <p className="font-medium text-foreground">{store.name}</p>
                <p className="text-sm">Store Front Visualization</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
