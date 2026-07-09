import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { vendorApi } from '../../api/vendor';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

export function VendorDashboard() {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storeData = await vendorApi.getMyStore();
        setStore(storeData);
        
        const productsData = await vendorApi.getStoreProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-24 max-w-7xl mx-auto w-full space-y-8">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-2">Vendor Dashboard</h1>
          <p className="text-muted">Manage your store and inventory.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {store && (
        <div className="bg-black/5 dark:bg-white/5 p-8 rounded-[32px] border border-border-light dark:border-border-dark mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif text-foreground mb-1">{store.name}</h2>
            <p className="text-muted">{store.address}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-background px-6 py-4 rounded-2xl border border-border-light dark:border-border-dark text-center">
              <p className="text-sm text-muted mb-1">Total Products</p>
              <p className="text-2xl font-semibold text-foreground">{products.length}</p>
            </div>
            {/* Revenue placeholder */}
            <div className="bg-background px-6 py-4 rounded-2xl border border-border-light dark:border-border-dark text-center">
              <p className="text-sm text-muted mb-1">Total Revenue</p>
              <p className="text-2xl font-semibold text-foreground">$0.00</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background rounded-[32px] border border-border-light dark:border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                         {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <Package className="w-6 h-6 m-3 text-muted" />
                         )}
                      </div>
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-foreground">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-sage/10 text-accent-sage">
                      {product.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-muted hover:text-foreground transition-colors rounded-md focus-ring">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted hover:text-accent-terracotta transition-colors rounded-md focus-ring">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">
                    No products found. Add your first product to start selling.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
