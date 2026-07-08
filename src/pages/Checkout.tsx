import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ordersApi } from '../api/orders';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MapPin, Smartphone } from 'lucide-react';

export function Checkout() {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

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
          setError('Could not get your location. Please enter coordinates manually.');
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
      setError('Delivery coordinates are required.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      await ordersApi.checkout({
        paymentProvider: 'MPESA',
        phoneNumber,
        deliveryLatitude: parseFloat(lat),
        deliveryLongitude: parseFloat(lon)
      });
      
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="w-24 h-24 bg-accent-sage/20 text-accent-sage rounded-full flex items-center justify-center mb-8">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif text-foreground mb-4">Order Confirmed</h1>
        <p className="text-xl text-muted mb-8 max-w-md">
          Your premium hardware is on its way. You will receive an M-Pesa prompt shortly to complete payment.
        </p>
        <Button onClick={() => navigate('/products')}>Return to Catalog</Button>
      </div>
    );
  }

  const subtotal = cart?.totalAmount || 0;

  return (
    <div className="px-6 py-24 lg:px-8 max-w-6xl mx-auto w-full">
      <h1 className="text-4xl font-serif text-foreground mb-16">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Delivery Section */}
            <section>
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <MapPin className="text-muted" />
                Delivery Location
              </h2>
              <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[24px] space-y-6">
                <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-border-light dark:border-border-dark">
                   <div className="text-sm text-muted">Use current location for precise delivery</div>
                   <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={loadingLocation}>
                     {loadingLocation ? 'Locating...' : 'Detect Location'}
                   </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Latitude" 
                    value={lat} 
                    onChange={e => setLat(e.target.value)} 
                    placeholder="-1.266667"
                    required 
                  />
                  <Input 
                    label="Longitude" 
                    value={lon} 
                    onChange={e => setLon(e.target.value)} 
                    placeholder="36.800000"
                    required 
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <Smartphone className="text-muted" />
                M-Pesa Payment
              </h2>
              <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[24px] space-y-6">
                <p className="text-sm text-muted mb-4">
                  Enter your M-Pesa registered phone number. You will receive a prompt to enter your PIN to authorize the payment of <strong>${subtotal.toFixed(2)}</strong>.
                </p>
                <Input 
                  label="M-Pesa Phone Number" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                  placeholder="2547XXXXXXXX"
                  required 
                />
              </div>
            </section>

            {error && (
              <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl border border-accent-terracotta/20">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={processing}>
              {processing ? 'Processing Payment...' : `Pay $${subtotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-black/5 dark:bg-white/5 rounded-[24px] p-8 sticky top-32">
            <h2 className="text-xl font-serif mb-6">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {cart?.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-[#F5F5F5] dark:bg-[#221F1D] rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-foreground">{item.product.name}</p>
                    <p className="text-muted">Qty: {item.quantity}</p>
                    <p className="font-medium mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mb-4 text-muted">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-8 text-muted">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-medium text-foreground pt-6 border-t border-border-light dark:border-border-dark">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
