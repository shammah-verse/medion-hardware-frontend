import { useState, useEffect } from 'react';
import { Shield, Users, ShoppingBag, Store as StoreIcon, Trash2, Edit, X, Package } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer State
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await adminApi.getAllStores();
      setStores(data);
    } catch (err) {
      console.error("Failed to load stores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to permanently delete this store?')) return;
    try {
      await adminApi.deleteStore(storeId);
      setStores(stores.filter(s => s.id !== storeId));
      if (selectedStore?.id === storeId) closeDrawer();
    } catch (err) {
      console.error("Failed to delete store", err);
      alert("Failed to delete store.");
    }
  };

  const handleViewStore = async (store: Store) => {
    setSelectedStore(store);
    setLoadingProducts(true);
    try {
      const products = await adminApi.getStoreProducts(store.id);
      setStoreProducts(products);
    } catch (err) {
      console.error("Failed to load store products", err);
      // Fallback or empty if endpoint fails
      setStoreProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(productId);
      setStoreProducts(storeProducts.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
  };

  const closeDrawer = () => {
    setSelectedStore(null);
    setStoreProducts([]);
  };

  if (loading) {
    return (
      <div className="px-6 py-24 max-w-7xl mx-auto w-full space-y-8">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-accent-terracotta/10 text-accent-terracotta rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-1">Global Control Panel</h1>
          <p className="text-muted">Super Admin access. Monitor platform vitals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-[24px] border border-border-light dark:border-border-dark flex items-center gap-6">
          <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-foreground shadow-sm">
            <StoreIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Active Stores</p>
            <p className="text-3xl font-serif text-foreground">{stores.length}</p>
          </div>
        </div>
        
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-[24px] border border-border-light dark:border-border-dark flex items-center gap-6">
          <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-foreground shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Total Users</p>
            <p className="text-3xl font-serif text-foreground">1,248</p>
          </div>
        </div>
        
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-[24px] border border-border-light dark:border-border-dark flex items-center gap-6">
          <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-foreground shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Total Orders</p>
            <p className="text-3xl font-serif text-foreground">8,932</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-serif text-foreground mb-6">Store Directory</h2>
      <div className="bg-background rounded-[32px] border border-border-light dark:border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Store Name</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Coordinates</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground cursor-pointer hover:underline" onClick={() => handleViewStore(store)}>{store.name}</td>
                  <td className="px-6 py-4 text-muted">{store.address}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted">
                    {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewStore(store)}
                        className="px-3 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-colors rounded-lg text-xs font-medium"
                      >
                        Inventory
                      </button>
                      <button className="p-2 text-muted hover:text-foreground transition-colors rounded-md focus-ring">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStore(store.id)}
                        className="p-2 text-muted hover:text-accent-terracotta transition-colors rounded-md focus-ring"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted">
                    No stores registered on the platform yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Drawer for Store Inventory */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />
          <div className="relative w-full max-w-lg h-full bg-background border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between px-6 py-6 border-b border-border-light dark:border-border-dark">
              <div>
                <h2 className="text-xl font-serif text-foreground">{selectedStore.name}</h2>
                <p className="text-sm text-muted">Inventory Management</p>
              </div>
              <button onClick={closeDrawer} className="p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingProducts ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
              ) : storeProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-muted" />
                  </div>
                  <p className="text-muted">This store has no products.</p>
                </div>
              ) : (
                storeProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 border border-border-light dark:border-border-dark rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                         {product.imageUrls && product.imageUrls.length > 0 ? (
                           <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <Package className="w-6 h-6 m-3 text-muted" />
                         )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted">${product.price.toFixed(2)} &middot; {product.stockQuantity} in stock</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-muted hover:text-foreground transition-colors rounded-md focus-ring">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-muted hover:text-accent-terracotta transition-colors rounded-md focus-ring"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
