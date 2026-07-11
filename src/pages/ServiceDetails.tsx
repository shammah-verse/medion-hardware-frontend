import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Clock, Star, Shield, Calendar, Store, CheckCircle2 } from 'lucide-react';
import { servicesApi } from '../api/services';
import type { Service } from '../api/services';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchService(id);
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    setLoading(true);
    try {
      const data = await servicesApi.getService(serviceId);
      setService(data);
    } catch (error) {
      console.error('Failed to load service', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] pt-24 px-6 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-64 mb-8" />
        <div className="flex flex-col lg:flex-row gap-12">
          <Skeleton className="w-full lg:w-2/3 aspect-video rounded-[32px]" />
          <Skeleton className="w-full lg:w-1/3 h-[400px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8">
          <Link to="/" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/services" className="hover:text-emerald-500 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white line-clamp-1">{service.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-slate-100 dark:bg-slate-900 rounded-[32px] aspect-video overflow-hidden mb-8 relative border border-slate-200 dark:border-slate-800">
              {service.imageUrls && service.imageUrls.length > 0 ? (
                <img src={service.imageUrls[0]} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image Available</div>
              )}
            </div>

            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{service.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {service.rating || '4.9'}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-4 h-4" /> {service.durationMinutes} mins
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    <Shield className="w-4 h-4" /> Verified Professional
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4">About this service</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{service.description}</p>
            </div>
            
            <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6">What's included</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Professional consultation and assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">High-quality materials and tools provided (if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Post-service cleanup and quality check</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-200 dark:border-slate-700 shadow-xl sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <span className="text-slate-500 font-medium">Service Price</span>
                <span className="text-4xl font-black text-slate-900 dark:text-white">${service.price.toFixed(2)}</span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{service.storeName || 'Vendor Pro'}</h4>
                    <p className="text-xs text-slate-500">Service Provider</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Button className="w-full h-14 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" /> Schedule Service
                </Button>
                <p className="text-xs text-center text-slate-500">You won't be charged until the provider accepts.</p>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Shield className="w-4 h-4" /> Covered by Medion Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
