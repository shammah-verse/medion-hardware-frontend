import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { vendorApi } from '../../api/vendor';
import type { Store } from '../../api/stores';
import type { Product } from '../../api/products';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';

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
        <Button className="gap-2" onClick={() => openModal()}>
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
                         {product.imageUrls && product.imageUrls.length > 0 ? (
                           <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
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
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-muted hover:text-foreground transition-colors rounded-md focus-ring"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-muted hover:text-accent-terracotta transition-colors rounded-md focus-ring"
                      >
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-background border border-border-light dark:border-border-dark rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-serif text-foreground mb-6">
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
              
              <div className="pt-4 border-t border-border-light dark:border-border-dark">
                <label className="text-sm font-medium text-foreground block mb-4">Product Images</label>
                
                {editingProduct ? (
                  <div className="space-y-4">
                    {/* Existing Image Gallery */}
                    {editingProduct.imageUrls && editingProduct.imageUrls.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {editingProduct.imageUrls.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-black/5 dark:bg-white/5">
                            <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(url)}
                                className="p-2 bg-accent-terracotta text-white rounded-full hover:bg-red-600 transition-colors"
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
                    {/* Pending Image Gallery for New Product */}
                    {pendingImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {pendingImages.map((file, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-black/5 dark:bg-white/5">
                            <img src={URL.createObjectURL(file)} alt={`Pending ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== idx))}
                                className="p-2 bg-accent-terracotta text-white rounded-full hover:bg-red-600 transition-colors"
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
                
                {/* File Uploader */}
                <div className="flex items-center gap-4 mt-4">
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-accent-sage/10 file:text-accent-sage hover:file:bg-accent-sage/20 transition-colors cursor-pointer"
                  />
                  {uploading && <div className="text-sm text-accent-sage animate-pulse font-medium">Uploading...</div>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  className="w-full mt-1 rounded-2xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
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
                  className="rounded border-border-light text-foreground focus:ring-foreground"
                />
                <label htmlFor="active" className="text-sm text-foreground">Active (Visible to customers)</label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-6">
                <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                <Button type="submit" disabled={saving}>
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
