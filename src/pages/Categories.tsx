import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Flame, Grid, ArrowRight } from 'lucide-react';
import { categoriesApi } from '../api/categories';
import type { Category } from '../api/categories';
import { Skeleton } from '../components/ui/Skeleton';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRODUCT' | 'SERVICE'>('ALL');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
      // Let it fail gracefully or show empty state if API not ready
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || cat.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-slate-900 dark:bg-[#080B12] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-emerald-500/10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Browse All Categories</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            From professional construction materials to local services. Everything you need in one powerful marketplace.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 mb-12">
          <button 
            className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'ALL' ? 'bg-orange-500 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}
            onClick={() => setActiveTab('ALL')}
          >
            <Grid className="w-5 h-5" /> All
          </button>
          <button 
            className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'PRODUCT' ? 'bg-orange-500 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}
            onClick={() => setActiveTab('PRODUCT')}
          >
            <Compass className="w-5 h-5" /> Products
          </button>
          <button 
            className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'SERVICE' ? 'bg-orange-500 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}
            onClick={() => setActiveTab('SERVICE')}
          >
            <Flame className="w-5 h-5" /> Services
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-[32px]" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">No categories found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredCategories.map(cat => (
              <Link 
                key={cat.id} 
                to={cat.type === 'SERVICE' ? '/services' : `/categories/${cat.id}`} 
                className="group relative block aspect-square rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
                <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-transform duration-700 ease-out" />
                
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  {cat.featured && (
                    <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
                      Featured
                    </div>
                  )}
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm border border-white/20">
                    {cat.type}
                  </div>
                </div>
                
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/30 transform group-hover:-translate-y-2 transition-transform duration-300 mb-4">
                    {cat.icon ? (cat.icon.length < 5 ? cat.icon : <img src={cat.icon} alt="icon" className="w-5 h-5 invert" />) : <Grid className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl leading-tight mb-2 tracking-tight">{cat.name}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
                    
                    <div className="flex items-center text-white text-sm font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View {cat.itemCount} items <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
