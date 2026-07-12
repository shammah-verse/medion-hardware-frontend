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
            className="p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
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
                    src={item.product?.imageUrls && item.product.imageUrls.length > 0 && item.product.imageUrls[0].startsWith('http') && !item.product.imageUrls[0].includes('example.com') ? item.product.imageUrls[0] : `https://loremflickr.com/800/800/${encodeURIComponent((item.product?.name || '').split(' ')[0] || 'tool')},tool?lock=${item.product?.id ? item.product.id.charCodeAt(0) : 1}`} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{item.product.name}</h3>
                      <p className="text-xs text-muted">{item.product.category}</p>
                    </div>
                    <p className="font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 border border-border-light dark:border-border-dark rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-muted hover:text-foreground w-4"
                      >-</button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-muted hover:text-foreground w-4"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-accent-terracotta transition-colors text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
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
