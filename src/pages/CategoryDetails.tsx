import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Filter, LayoutGrid, List as ListIcon, Star, Plus } from 'lucide-react';
import { categoriesApi } from '../api/categories';
import type { Category } from '../api/categories';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export function CategoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  
  const addItem = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (categoryId: string) => {
    setLoading(true);
    try {
      const catData = await categoriesApi.getCategory(categoryId);
      setCategory(catData);
      
      // Fetch products in this category
      const allProducts = await productsApi.getActiveProducts();
      // For now, filtering locally based on category name since our backend might not have a specific endpoint yet
      const filtered = allProducts.filter(p => p.category.toLowerCase() === catData.name.toLowerCase());
      setProducts(filtered);
    } catch (error) {
      console.error('Failed to load category details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addItem(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] pt-24 px-6 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-64 mb-12 rounded-lg" />
        <div className="flex gap-8">
          <Skeleton className="w-64 h-[600px] hidden lg:block rounded-3xl" />
          <div className="flex-1">
            <Skeleton className="h-12 w-full mb-8 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
          <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans pb-24">
      
      {/* Category Hero */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-transparent dark:from-slate-800/50 z-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex items-center gap-8">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden shadow-2xl shrink-0 relative border-4 border-white dark:border-slate-800">
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div>
            {/* Universal Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-4">
              <Link to="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/categories" className="hover:text-orange-500 transition-colors">
                Categories
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 dark:text-white">{category.name}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{category.name}</h1>
            <p className="text-slate-500 text-lg max-w-2xl">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <Filter className="w-5 h-5" /> Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-3 text-sm">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" />
                  <span className="text-slate-400">-</span>
                  <input type="number" placeholder="Max" className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" />
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3 text-sm">Sort By</h4>
                <select className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
              
              <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl">
                Apply Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="font-medium text-slate-500">
              Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> items in {category.name}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode('GRID')}
                className={`w-10 h-10 p-0 flex items-center justify-center rounded-xl ${viewMode === 'GRID' ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : 'text-slate-500'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode('LIST')}
                className={`w-10 h-10 p-0 flex items-center justify-center rounded-xl ${viewMode === 'LIST' ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : 'text-slate-500'}`}
              >
                <ListIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold mb-2">No items found</h3>
              <p className="text-slate-500">We couldn't find any products in this category.</p>
            </div>
          ) : (
            <div className={viewMode === 'GRID' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {products.map(product => (
                <motion.div 
                  whileHover={{ y: -4 }}
                  key={product.id} 
                  className={`group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all ${viewMode === 'LIST' ? 'flex items-center gap-6 p-4' : 'flex flex-col'}`}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className={`relative bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden ${viewMode === 'LIST' ? 'w-48 h-48 shrink-0' : 'aspect-square mb-4'}`}>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Image</div>
                    )}
                    
                    {/* Quick Add Button */}
                    <div className="absolute bottom-3 right-3 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="sm" 
                        className="h-10 w-10 p-0 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                        onClick={(e) => handleAddToCart(e, product.id)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col ${viewMode === 'LIST' ? 'flex-1 py-2' : 'px-2 pb-2'}`}>
                    <p className="text-xs font-semibold text-orange-500 mb-1">{product.storeName || 'Vendor Pro'}</p>
                    <h3 className={`font-bold text-slate-900 dark:text-white leading-tight mb-2 ${viewMode === 'LIST' ? 'text-xl' : 'text-base line-clamp-1'}`}>{product.name}</h3>
                    {viewMode === 'LIST' && (
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
