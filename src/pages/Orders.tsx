import { useEffect, useState } from 'react';
import { Download, Package } from 'lucide-react';
import { ordersApi } from '../api/orders';
import type { OrderResponse } from '../api/orders';
import { Button } from '../components/ui/Button';

export function Orders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadReceipt = (orderId: string) => {
    // In a real app, this would hit an endpoint like GET /api/v1/orders/{id}/receipt
    // returning a PDF or triggering a browser print.
    alert(`Downloading receipt for order ${orderId}...`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 w-full min-h-[70vh]">
      <h1 className="text-4xl font-serif text-foreground mb-10">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[32px] border border-border-light dark:border-border-dark">
          <Package className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-foreground mb-2">No orders yet</h2>
          <p className="text-muted mb-8">When you place an order, it will appear here.</p>
          <Button onClick={() => window.location.href = '/products'}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-black/5 dark:bg-white/5 p-6 md:p-8 rounded-3xl border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-6 justify-between md:items-center">
              
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="font-medium text-foreground">Order #{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                    order.status === 'DELIVERED' ? 'bg-accent-sage/10 text-accent-sage border border-accent-sage/20' : 
                    'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="text-sm text-muted">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'} • {order.items?.length || 0} items
                </div>
                
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-sm text-foreground flex justify-between max-w-sm">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-border-light dark:border-border-dark pt-6 md:pt-0 md:pl-6">
                <div className="text-2xl font-serif text-foreground">
                  ${order.totalAmount.toFixed(2)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 rounded-full"
                  onClick={() => handleDownloadReceipt(order.id)}
                >
                  <Download className="w-4 h-4" />
                  Receipt
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
