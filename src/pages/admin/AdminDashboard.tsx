import React, { useState, useEffect } from 'react';
import { Shield, Users, ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { Store } from '../../api/stores';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStores();
  }, []);

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
    <div className="px-6 py-24 lg:px-8 max-w-7xl mx-auto w-full">
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
        
        {/* Placeholder Metrics */}
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
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{store.name}</td>
                  <td className="px-6 py-4 text-muted">{store.address}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted">
                    {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-sage/10 text-accent-sage">
                      Active
                    </span>
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
    </div>
  );
}
