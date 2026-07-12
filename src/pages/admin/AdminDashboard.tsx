import React, { useState, useEffect } from 'react';
import { Shield, Users, ShoppingBag, Store as StoreIcon, Trash2, X, Package, TrendingUp, DollarSign, ChevronRight, Search, CheckCircle, XCircle, LayoutDashboard, Edit, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminApi } from '../../api/admin';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STORES' | 'PRODUCTS'>('OVERVIEW');
  const [stores, setStores] = useState<Store[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer State (For viewing store specific inventory)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [storesData, productsData] = await Promise.all([
        adminApi.getAllStores(),
        adminApi.getAllProducts()
      ]);
      setStores(storesData);
      setAllProducts(productsData);
    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Store Actions ---
  const handleApproveStore = async (storeId: string) => {
    try {
      const updated = await adminApi.approveStore(storeId);
      setStores(stores.map(s => s.id === storeId ? updated : s));
    } catch (err) {
      console.error("Failed to approve store", err);
      alert("Failed to approve store.");
    }
  };

  const handleRejectStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to reject this store?')) return;
    try {
      const updated = await adminApi.rejectStore(storeId);
      setStores(stores.map(s => s.id === storeId ? updated : s));
    } catch (err) {
      console.error("Failed to reject store", err);
      alert("Failed to reject store.");
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

  const closeDrawer = () => {
    setSelectedStore(null);
    setStoreProducts([]);
  };

  // --- Product Modal Actions ---
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category,
        active: product.active,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        active: true,
      });
    }
    setPendingImages([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPendingImages([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (!editingProduct) {
      setPendingImages(prev => [...prev, ...Array.from(files)]);
      e.target.value = '';
      return;
    }
    
    setUploading(true);
    let updatedProduct = editingProduct;
    try {
      for (let i = 0; i < files.length; i++) {
        updatedProduct = await adminApi.uploadProductImage(editingProduct.id, files[i]);
      }
      setEditingProduct(updatedProduct);
      
      // Update in all products list and drawer list
      setAllProducts(allProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      if (selectedStore) {
        setStoreProducts(storeProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      }
    } catch (err) {
      console.error("Failed to upload images", err);
      alert("Failed to upload some images.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!editingProduct) return;
    try {
      const updatedProduct = await adminApi.deleteProductImage(editingProduct.id, imageUrl);
      setEditingProduct(updatedProduct);
      setAllProducts(allProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      if (selectedStore) {
        setStoreProducts(storeProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      }
    } catch (err) {
      console.error("Failed to delete image", err);
      alert("Failed to delete image.");
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        const updated = await adminApi.updateProduct(editingProduct.id, formData);
        setAllProducts(allProducts.map(p => p.id === editingProduct.id ? updated : p));
        if (selectedStore) {
          setStoreProducts(storeProducts.map(p => p.id === editingProduct.id ? updated : p));
        }
      } else {
        let created = await adminApi.addProduct(formData);
        
        if (pendingImages.length > 0) {
          for (const file of pendingImages) {
            created = await adminApi.uploadProductImage(created.id, file);
          }
        }
        
        setAllProducts([created, ...allProducts]);
        // Note: New product will belong to admin internally, so maybe don't add to specific store drawer unless admin owns a store.
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(productId);
      setAllProducts(allProducts.filter(p => p.id !== productId));
      if (selectedStore) {
        setStoreProducts(storeProducts.filter(p => p.id !== productId));
      }
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans flex">
      
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden lg:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">Medion Admin</span>
          </div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'OVERVIEW' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('STORES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'STORES' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <StoreIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Stores</span>
          </button>
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'PRODUCTS' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium text-sm">Products</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-10 overflow-y-auto pb-24 lg:pb-10">
        <div className="max-w-[1400px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeTab === 'OVERVIEW' && 'Control Panel'}
                {activeTab === 'STORES' && 'Store Management'}
                {activeTab === 'PRODUCTS' && 'Global Products'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Super Admin access. Monitor platform vitals and manage entities.</p>
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

          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="animate-in fade-in duration-300">
              {/* Premium KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col justify-between">
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
                
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col justify-between">
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

                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col justify-between">
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

                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{allProducts.length}</h3>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                      <span className="text-2xl font-bold">{stores.length}</span>
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
            </div>
          )}

          {/* STORES TAB */}
          {activeTab === 'STORES' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 md:px-6 py-4">Store Details</th>
                        <th className="hidden md:table-cell px-6 py-4">Location</th>
                        <th className="px-4 md:px-6 py-4">Status</th>
                        <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {stores.map((store) => (
                        <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="hidden md:flex w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 items-center justify-center">
                                <StoreIcon className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p 
                                  className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-500 transition-colors flex items-center gap-1"
                                  onClick={() => handleViewStore(store)}
                                >
                                  {store.name} <ChevronRight className="w-3 h-3" />
                                </p>
                                <p className="text-xs text-slate-500">{store.ownerName || `ID: ${store.id.substring(0,8)}...`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-slate-500 font-medium">{store.address}</td>
                          <td className="px-4 md:px-6 py-4">
                            {store.status === 'PENDING' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending Review
                              </span>
                            ) : store.status === 'PENDING_PAYMENT' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Pending Payment
                              </span>
                            ) : store.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                              </span>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {(!store.status || store.status === 'PENDING') && (
                                <>
                                  <button onClick={() => handleApproveStore(store.id)} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg" title="Approve">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleRejectStore(store.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
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
                          <td colSpan={4} className="px-6 py-16 text-center">
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
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'PRODUCTS' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold">Platform Products</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                    <Button onClick={() => openModal()} className="h-[38px] px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white border-0 gap-2 font-medium">
                      <Plus className="w-4 h-4" /> Add Product
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 md:px-6 py-4">Product Name</th>
                        <th className="hidden md:table-cell px-6 py-4">Store</th>
                        <th className="hidden md:table-cell px-6 py-4">Category</th>
                        <th className="hidden md:table-cell px-6 py-4">Stock</th>
                        <th className="px-4 md:px-6 py-4">Price</th>
                        <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {allProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="hidden md:flex w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                  <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 m-2.5 text-slate-400" />
                                )}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-slate-500 text-xs font-bold">{product.storeName || 'N/A'}</td>
                          <td className="hidden md:table-cell px-6 py-4 text-slate-500 font-medium">{product.category}</td>
                          <td className="hidden md:table-cell px-6 py-4 font-medium">{product.stockQuantity}</td>
                          <td className="px-4 md:px-6 py-4 font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openModal(product)}
                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {allProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                              <Package className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold mb-1">No products found</h4>
                            <p className="text-slate-500 mb-4 text-sm">There are no products available across the platform.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Admin Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 lg:hidden z-40 px-4">
        <button 
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'OVERVIEW' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('STORES')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'STORES' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <StoreIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stores</span>
        </button>
        <button 
          onClick={() => setActiveTab('PRODUCTS')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'PRODUCTS' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium">Products</span>
        </button>
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
                        onClick={() => openModal(product)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
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

      {/* Admin Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Global Product' : 'Add Global Product'}
            </h2>
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <Input 
                label="Product Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
              <div className="flex gap-4">
                <Input 
                  label="Price ($)" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.price.toString()}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required 
                />
                <Input 
                  label="Stock Quantity" 
                  type="number" 
                  min="0"
                  value={formData.stockQuantity.toString()}
                  onChange={e => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <Input 
                    label="Category" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-sm font-bold block mb-4">Product Images</label>
                
                {editingProduct ? (
                  <div className="space-y-4">
                    {editingProduct.imageUrls && editingProduct.imageUrls.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {editingProduct.imageUrls.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 dark:bg-slate-800">
                            <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(url)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {pendingImages.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 dark:bg-slate-800">
                            <img src={URL.createObjectURL(file)} alt={`Pending ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== idx))}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-4">
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-50 dark:file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-100 dark:hover:file:bg-orange-500/20 transition-colors cursor-pointer"
                  />
                  {uploading && <div className="text-sm text-orange-500 animate-pulse font-bold">Uploading...</div>}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold block mb-2">Description</label>
                <textarea
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="active" className="text-sm font-medium">Active (Visible to customers)</label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                <Button type="button" variant="ghost" onClick={closeModal} className="font-bold">Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6">
                  {saving ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex items-center justify-around p-3">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${activeTab === 'OVERVIEW' ? 'text-emerald-500' : 'text-slate-500'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('STORES')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${activeTab === 'STORES' ? 'text-emerald-500' : 'text-slate-500'}`}
          >
            <StoreIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Stores</span>
          </button>
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${activeTab === 'PRODUCTS' ? 'text-emerald-500' : 'text-slate-500'}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-bold">Products</span>
          </button>
        </div>
      </div>

    </div>
  );
}
