import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, Clock, Star } from 'lucide-react';
import { servicesApi } from '../api/services';
import type { Service } from '../api/services';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesApi.getActiveServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-slate-900 dark:bg-[#080B12] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Book Local Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Find and book professional contractors, mechanics, designers, and other verified experts in your area.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-[32px]" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">No services found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map(service => (
              <motion.div 
                whileHover={{ y: -6 }}
                key={service.id} 
                className="group relative bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {service.imageUrls && service.imageUrls.length > 0 ? (
                    <img src={service.imageUrls[0]} alt={service.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1 text-slate-900 dark:text-white">
                      <Flame className="w-3 h-3 text-emerald-500" /> {service.categoryId || 'Service'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">{service.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {service.rating || '4.9'}
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {service.durationMinutes} mins
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Starting at</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        ${service.price.toFixed(2)}
                      </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
