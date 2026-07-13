import { X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-background border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-serif text-foreground">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors"
          >
            <X className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6">
          {!cart?.items?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <p className="text-muted">Your cart is empty.</p>
              <Button variant="outline" onClick={() => { closeCart(); navigate('/products'); }}>
                Explore Collection
              </Button>
            </div>
          ) : (
            (cart.items || []).map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://loremflickr.com/800/800/${encodeURIComponent((item.productName || '').split(' ')[0] || 'tool')},tool?lock=${item.productId ? item.productId.charCodeAt(0) : 1}`} 
                    alt={item.productName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-start gap-2">
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-foreground text-sm truncate">{item.productName}</h3>
                      <p className="text-xs text-muted">Hardware</p>
                    </div>
                    <p className="font-medium text-foreground shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border border-border-light dark:border-border-dark rounded-xl px-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="text-muted hover:text-foreground w-11 h-11 flex items-center justify-center font-medium"
                      >-</button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="text-muted hover:text-foreground w-11 h-11 flex items-center justify-center font-medium"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-muted hover:text-accent-terracotta transition-colors text-sm flex items-center justify-center h-11 px-2 gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {(cart?.items?.length ?? 0) > 0 && (
          <div className="p-6 border-t border-border-light dark:border-border-dark bg-background/50 backdrop-blur-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted">Subtotal</span>
              <span className="text-2xl font-serif text-foreground">${(cart?.totalAmount ?? 0).toFixed(2)}</span>
            </div>
            <Button 
              className="w-full gap-2" 
              size="lg" 
              onClick={() => { closeCart(); navigate('/checkout'); }}
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
