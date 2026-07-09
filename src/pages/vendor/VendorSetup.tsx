import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Loader2 } from 'lucide-react';
import { vendorApi } from '../../api/vendor';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function VendorSetup() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'COMMISSION' | 'PREMIUM'>('COMMISSION');
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if they already have a store
    vendorApi.getMyStore()
      .then(() => navigate('/vendor/dashboard'))
      .catch((err) => {
        // 404 means no store yet, which is expected here.
        if (err.response?.status !== 404) {
          console.error("Error checking store status", err);
        }
      });
  }, [navigate]);

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
          setLoadingLocation(false);
        },
        () => {
          setError('Could not get your location automatically. Please enter coordinates manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lon) {
      setError('Store coordinates are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await vendorApi.createStore({
        name,
        address,
        latitude: parseFloat(lat) || 0.0,
        longitude: parseFloat(lon) || 0.0,
        subscriptionType
      });
      navigate('/vendor/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create your store. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent-sage/10 text-accent-sage rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-serif text-foreground mb-3">Setup Your Store</h1>
          <p className="text-muted">Enter your physical store details to start selling premium hardware.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-black/5 dark:bg-white/5 p-8 md:p-12 rounded-[32px] border border-border-light dark:border-border-dark">
          
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-foreground border-b border-border-light dark:border-border-dark pb-4">1. Store Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Store Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Medion Flagship - Nairobi"
                required
              />
              <Input 
                label="Physical Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Silicon Ave, Nairobi"
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Location Coordinates</label>
                <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={loadingLocation}>
                  {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                  {loadingLocation ? 'Locating...' : 'Auto-Detect'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  value={lat} 
                  onChange={e => setLat(e.target.value)} 
                  placeholder="Latitude"
                  required 
                />
                <Input 
                  value={lon} 
                  onChange={e => setLon(e.target.value)} 
                  placeholder="Longitude"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-serif text-foreground border-b border-border-light dark:border-border-dark pb-4">2. Subscription Plan</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Commission Plan */}
              <label 
                className={`relative flex flex-col p-6 cursor-pointer rounded-2xl border-2 transition-all ${
                  subscriptionType === 'COMMISSION' 
                    ? 'border-accent-terracotta bg-accent-terracotta/5' 
                    : 'border-border-light dark:border-border-dark hover:border-accent-terracotta/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="subscriptionType" 
                  value="COMMISSION"
                  checked={subscriptionType === 'COMMISSION'}
                  onChange={() => setSubscriptionType('COMMISSION')}
                  className="sr-only"
                />
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 text-foreground mb-4">Pay as you go</span>
                  <h3 className="text-xl font-medium text-foreground">5% Commission</h3>
                </div>
                <p className="text-sm text-muted">We take a small 5% cut only when you make a sale. Perfect for new hardware makers.</p>
              </label>

              {/* Premium Plan */}
              <label 
                className={`relative flex flex-col p-6 cursor-pointer rounded-2xl border-2 transition-all ${
                  subscriptionType === 'PREMIUM' 
                    ? 'border-accent-sage bg-accent-sage/5' 
                    : 'border-border-light dark:border-border-dark hover:border-accent-sage/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="subscriptionType" 
                  value="PREMIUM"
                  checked={subscriptionType === 'PREMIUM'}
                  onChange={() => setSubscriptionType('PREMIUM')}
                  className="sr-only"
                />
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent-sage/10 text-accent-sage mb-4">Pro Makers</span>
                  <h3 className="text-xl font-medium text-foreground">$49 / month</h3>
                </div>
                <p className="text-sm text-muted">Pay a flat monthly fee and keep 100% of your profits from every hardware sale.</p>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20">
              {error}
            </div>
          )}

          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Creating Store...' : 'Launch Store'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
