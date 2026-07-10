import { useState, useEffect } from 'react';
import { Shield, Users, ShoppingBag, Store as StoreIcon, Trash2, X, Package, TrendingUp, DollarSign, ChevronRight, Filter, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminApi } from '../../api/admin';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

// Mock Data for Admin Charts
const platformRevenueData = [
  { name: 'Jan', commission: 4000, subscription: 2400 },
  { name: 'Feb', commission: 3000, subscription: 1398 },
  { name: 'Mar', commission: 2000, subscription: 9800 },
  { name: 'Apr', commission: 2780, subscription: 3908 },
  { name: 'May', commission: 1890, subscription: 4800 },
  { name: 'Jun', commission: 2390, subscription: 3800 },
  { name: 'Jul', commission: 3490, subscription: 4300 },
];

const vendorDistributionData = [
  { name: 'Pro Plan ($20/mo)', value: 400 },
  { name: 'Commission Plan (5%)', value: 848 },
];
const COLORS = ['#f97316', '#10b981'];

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
      <div className="px-6 py-12 max-w-[1400px] mx-auto w-full space-y-8 min-h-screen">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-96 col-span-2 rounded-2xl" />
          <Skeleton className="h-96 col-span-1 rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans relative">
      <div className="px-6 py-12 lg:px-8 max-w-[1400px] mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Control Panel</h1>
              <p className="text-slate-500 text-sm mt-1">Super Admin access. Monitor platform vitals and manage vendors.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </span>
          </div>
        </div>

        {/* Premium KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> +24.5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Platform Revenue (MRR)</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$142,590</h3>
            </div>
          </div>
          
          {/* Active Stores */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <StoreIcon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> +12
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Vendors</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stores.length}</h3>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">12,481</h3>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">8,932</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Revenue Growth</h3>
                <p className="text-sm text-slate-500">Commission vs Subscriptions</p>
              </div>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platformRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="commission" stackId="1" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
                  <Area type="monotone" dataKey="subscription" stackId="1" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-2">Vendor Distribution</h3>
            <p className="text-sm text-slate-500 mb-6">Pro vs Commission Plans</p>
            <div className="flex-1 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={vendorDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vendorDistributionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold">1,248</span>
                <span className="text-xs text-slate-500">Total Stores</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500" /> Pro Plan
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Commission
              </div>
            </div>
          </div>
        </div>

        {/* Store Directory Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold">Vendor Directory</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search vendors..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <Button variant="outline" className="h-[38px] px-3 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Store Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Coordinates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center">
                          <StoreIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p 
                            className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-500 transition-colors flex items-center gap-1"
                            onClick={() => handleViewStore(store)}
                          >
                            {store.name} <ChevronRight className="w-3 h-3" />
                          </p>
                          <p className="text-xs text-slate-500">ID: {store.id.substring(0,8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{store.address}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline"
                          onClick={() => handleViewStore(store)}
                          className="h-8 px-3 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
                        >
                          Inventory
                        </Button>
                        <button 
                          onClick={() => handleDeleteStore(store.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <StoreIcon className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold mb-1">No vendors found</h4>
                      <p className="text-slate-500 mb-4 text-sm">There are currently no stores registered on the platform.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer for Store Inventory */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />
          <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedStore.name} <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">Pro</span>
                </h2>
                <p className="text-sm text-slate-500">Store Inventory Override</p>
              </div>
              <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
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
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">Empty Inventory</h4>
                  <p className="text-slate-500 text-sm">This store hasn't uploaded any products yet.</p>
                </div>
              ) : (
                storeProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                         {product.imageUrls && product.imageUrls.length > 0 ? (
                           <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <Package className="w-6 h-6 m-3 text-slate-400" />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          ${product.price.toFixed(2)} &middot; {product.stockQuantity} in stock
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-sm border-0" onClick={() => handleDeleteStore(selectedStore.id)}>
                 Suspend Store
               </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
