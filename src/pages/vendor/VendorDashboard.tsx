import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, TrendingUp, DollarSign, ShoppingCart, Star, Search, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { vendorApi } from '../../api/vendor';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';

// Mock Data for Recharts
const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 10490 },
];

const categoryData = [
  { name: 'Cement', sales: 400 },
  { name: 'Paint', sales: 300 },
  { name: 'PVC', sales: 200 },
  { name: 'Tools', sales: 278 },
];

export function VendorDashboard() {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
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
        updatedProduct = await vendorApi.uploadProductImage(editingProduct.id, files[i]);
      }
      setEditingProduct(updatedProduct);
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
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
      const updatedProduct = await vendorApi.deleteProductImage(editingProduct.id, imageUrl);
      setEditingProduct(updatedProduct);
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (err) {
      console.error("Failed to delete image", err);
      alert("Failed to delete image.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPendingImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        const updated = await vendorApi.updateProduct(editingProduct.id, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        let created = await vendorApi.addProduct(formData);
        
        if (pendingImages.length > 0) {
          for (const file of pendingImages) {
            created = await vendorApi.uploadProductImage(created.id, file);
          }
        }
        
        setProducts([created, ...products]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await vendorApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product. Please try again.");
    }
  };

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans">
      <div className="px-6 py-12 lg:px-8 max-w-[1400px] mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Store Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your {store?.name || 'Store'} inventory and monitor performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10 px-4 rounded-xl shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50">
              Download Report
            </Button>
            <Button className="h-10 px-4 rounded-xl shadow-sm bg-orange-500 hover:bg-orange-600 text-white font-medium border-0 gap-2" onClick={() => openModal()}>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
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
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$40,590.00</h3>
            </div>
          </div>
          
          {/* Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> +8.2%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1,248</h3>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Products</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</h3>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                Top 5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Store Rating</p>
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">4.9</h3>
                <div className="flex">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Revenue Trend</h3>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold">Product Inventory</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
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
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                           {product.imageUrls && product.imageUrls.length > 0 ? (
                             <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <Package className="w-5 h-5 m-2.5 text-slate-400" />
                           )}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{product.category}</td>
                    <td className="px-6 py-4">
                      {product.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stockQuantity < 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(product)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Package className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold mb-1">No products yet</h4>
                      <p className="text-slate-500 mb-4 text-sm">Upload your first product to start tracking performance.</p>
                      <Button onClick={() => openModal()} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                        Add Product
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Product Modal (Kept exactly as before for functionality, just slightly updated styling) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  );
}
