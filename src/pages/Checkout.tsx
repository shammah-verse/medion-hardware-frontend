import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCartStore } from '../store/useCartStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';

export function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!cart || cart.items.length === 0) {
    navigate('/products');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real flow, we might capture lat/lon if required by the backend 
      // or the backend just requires a standard address. 
      // Based on the Postman collection, the backend expects deliveryLatitude, deliveryLongitude.
      // We will send mock coordinates for now unless geolocation is strictly required.
      const payload = {
        paymentProvider: 'PESAPAL',
        deliveryLatitude: -1.2921, 
        deliveryLongitude: 36.8219,
        address,
        city,
        phoneNumber
      };

      // Depending on actual implementation, backend returns a paymentUrl
      const response = await apiClient.post('/orders/checkout', payload);
      
      if (response.data && response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        // Clear cart optimisticly
        clearCart();
      } else {
        setError('Failed to generate payment link. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePayment = () => {
    setPaymentUrl(null);
    navigate('/profile/orders');
  };

  return (
    <div className="px-6 py-24 lg:px-8 max-w-6xl mx-auto w-full">
      <h1 className="text-4xl font-serif text-foreground mb-12">Secure Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-16">
        
        {/* Left Col: Forms */}
        <div className="space-y-12">
          
          <section>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-muted" />
              <h2 className="text-2xl font-serif text-foreground">Delivery Address</h2>
            </div>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
              <Input 
                label="Street Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Main St"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Nairobi"
                  required
                />
                <Input 
                  label="Postal Code"
                  placeholder="00100"
                  required
                />
              </div>
              <Input 
                label="M-PESA Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="2547XXXXXXXX"
                required
              />
            </form>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-muted" />
              <h2 className="text-2xl font-serif text-foreground">Payment</h2>
            </div>
            <div className="p-6 border border-border-light dark:border-border-dark rounded-2xl bg-black/5 dark:bg-white/5 flex items-start gap-4">
               <ShieldCheck className="w-6 h-6 text-accent-sage mt-1" />
               <div>
                 <p className="font-medium text-foreground">Secure Payment via Pesapal</p>
                 <p className="text-sm text-muted">You will be securely redirected to complete your payment via Cards or Mobile Money.</p>
               </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            form="checkout-form"
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay $${cart.totalAmount.toFixed(2)}`}
          </Button>

        </div>

        {/* Right Col: Order Summary */}
        <div>
          <div className="bg-black/5 dark:bg-white/5 p-8 rounded-[32px] border border-border-light dark:border-border-dark sticky top-32">
            <h2 className="text-2xl font-serif text-foreground mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-background overflow-hidden">
                       <img src={`https://loremflickr.com/800/800/${encodeURIComponent((item.productName || '').split(' ')[0] || 'tool')},tool?lock=${item.productId ? item.productId.charCodeAt(0) : 1}`} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-4">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-foreground pt-4 border-t border-border-light dark:border-border-dark">
                <span>Total</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pesapal Payment Modal (Iframe) */}
      {paymentUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl h-[80vh] bg-background border border-border-light dark:border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2 text-accent-sage">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium text-sm">Secure Payment Gateway</span>
              </div>
              <button onClick={handleClosePayment} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-accent-sage/10 flex justify-center border-b border-border-light dark:border-border-dark">
               <Button onClick={() => {
                 setPaymentUrl(null);
                 setPaymentSuccess(true);
                 setTimeout(() => {
                   navigate('/profile/orders');
                 }, 4000);
               }}>Simulate Successful Payment</Button>
            </div>

            <iframe 
              src={paymentUrl} 
              className="flex-1 w-full"
              title="Pesapal Checkout"
            />
          </div>
        </div>
      )}

      {/* Success Lottie Animation Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-96 h-96">
            <DotLottieReact
              src="https://lottie.host/0e9aec33-5140-4f79-af99-34c4ac8f2a3d/PExVMY2Lkz.lottie"
              loop={false}
              autoplay
            />
          </div>
          <div className="absolute mt-64 text-2xl font-serif text-foreground">
            Payment Successful!
          </div>
        </div>
      )}
    </div>
  );
}
