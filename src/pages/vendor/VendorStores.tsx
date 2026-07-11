import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon, Plus, MapPin, ChevronRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { vendorApi } from '../../api/vendor';
import type { Store } from '../../api/stores';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

export function VendorStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    setLoading(true);
    try {
      const myStores = await vendorApi.getMyStores();
      setStores(myStores);
    } catch (err: any) {
      console.error("Failed to load your stores", err);
      // Fallback message
      setError("Failed to load your stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    // If the backend currently limits to 1 store, this button will still redirect to setup
    // But the POST /api/v1/stores will throw an error if they already have one.
    navigate('/vendor/setup');
  };

  if (loading) {
    return (
      <div className="px-6 py-12 max-w-[1400px] mx-auto w-full min-h-[70vh]">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans p-6 lg:p-10 w-full">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Stores
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage your active storefronts on the platform.</p>
          </div>
          <Button onClick={handleCreateStore} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10">
            <Plus className="w-4 h-4" /> Add New Store
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-2xl text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchMyStores} className="mt-4">Try Again</Button>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <StoreIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Stores Yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              You haven't set up any stores on our platform yet. Create your first store to start selling.
            </p>
            <Button onClick={handleCreateStore} className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 rounded-xl text-base font-bold">
              Set Up Store
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <div 
                key={store.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => navigate(`/vendor/dashboard?storeId=${store.id}`)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                    <StoreIcon className="w-7 h-7" />
                  </div>
                  {store.status === 'PENDING' ? (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
                       <Clock className="w-3.5 h-3.5" /> Pending Approval
                     </span>
                  ) : store.status === 'REJECTED' ? (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                       <AlertTriangle className="w-3.5 h-3.5" /> Rejected
                     </span>
                  ) : (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                       <CheckCircle className="w-3.5 h-3.5" /> Active
                     </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                  {store.name}
                </h3>
                
                <div className="space-y-2 mb-8">
                  <div className="flex items-start gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-500">
                    ID: {store.id.substring(0, 8)}
                  </span>
                  <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                    Manage Store <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
