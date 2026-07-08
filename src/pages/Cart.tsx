import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

const initialCart = [
  { id: 1, name: 'Model 01 Keyboard', price: 249, quantity: 1, category: 'Input' },
  { id: 4, name: 'Machined Desk Mat', price: 89, quantity: 2, category: 'Workspace' },
];

export function Cart() {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCart((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="px-6 py-24 lg:px-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-serif text-foreground mb-16">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-muted mb-8">Your cart is empty.</p>
          <Button variant="outline">Continue Shopping</Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 flex flex-col gap-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 py-6 border-b border-border-light dark:border-border-dark last:border-0">
                <div className="w-24 h-24 bg-[#F5F5F5] dark:bg-[#221F1D] rounded-xl flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-foreground transition-colors p-2 -mr-2"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-lg font-medium">${item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-black/5 dark:bg-white/5 rounded-[24px] p-8">
              <h2 className="text-xl font-serif mb-6">Summary</h2>
              <div className="flex justify-between mb-4 text-muted">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between mb-8 text-muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between mb-8 text-lg font-medium text-foreground pt-6 border-t border-border-light dark:border-border-dark">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
              <Button className="w-full">Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
