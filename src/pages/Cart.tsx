import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Skeleton } from '../components/ui/Skeleton';

export function Cart() {
  const { cart, loading, error, fetchCart, updateQuantity, removeItem } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="px-6 py-24 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-4xl font-serif text-foreground mb-6">Your Cart</h1>
        <p className="text-xl text-muted mb-8">Please sign in to view your cart.</p>
        <Link to="/login">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div className="px-6 py-24 lg:px-8 max-w-4xl mx-auto w-full">
        <Skeleton className="h-12 w-48 mb-16 rounded-lg" />
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 flex flex-col gap-8">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-6 py-6 border-b border-border-light dark:border-border-dark">
                <Skeleton className="w-24 h-24 rounded-xl" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-1/3 rounded-md" />
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="w-full lg:w-80 h-64 rounded-[24px]" />
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;

  return (
    <div className="px-6 py-24 lg:px-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-serif text-foreground mb-16">
        Your Cart
      </h1>

      {error && (
         <div className="p-4 mb-8 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20">
           {error}
         </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-24 bg-black/5 dark:bg-white/5 rounded-3xl">
          <p className="text-xl text-muted mb-8">Your cart is empty.</p>
          <Link to="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 flex flex-col gap-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 py-6 border-b border-border-light dark:border-border-dark last:border-0">
                <div className="w-24 h-24 bg-[#F5F5F5] dark:bg-[#221F1D] rounded-xl flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">{item.product.name}</h3>
                      <p className="text-sm text-muted">{item.product.category}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-foreground transition-colors p-2 -mr-2 focus-ring rounded-md"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-ring"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-ring"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-lg font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-black/5 dark:bg-white/5 rounded-[24px] p-8 sticky top-32">
              <h2 className="text-xl font-serif mb-6">Summary</h2>
              <div className="flex justify-between mb-4 text-muted">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-8 text-muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between mb-8 text-lg font-medium text-foreground pt-6 border-t border-border-light dark:border-border-dark">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full gap-2" onClick={() => navigate('/checkout')}>
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
