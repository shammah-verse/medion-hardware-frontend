import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    storeName?: string;
    store?: { name?: string };
    imageUrls?: string[];
    images?: string[];
    description?: string;
  };
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const navigate = useNavigate();

  // Handle both possible structures (images vs imageUrls)
  const imagesArray = product.imageUrls || product.images || [];
  const imageUrl = imagesArray.length > 0 && imagesArray[0].startsWith('http') && !imagesArray[0].includes('example.com')
    ? imagesArray[0]
    : `https://loremflickr.com/800/800/${encodeURIComponent((product.name || '').split(' ')[0] || 'tool')},tool?lock=${product.id ? product.id.charCodeAt(0) : 1}`;

  const storeName = product.storeName || product.store?.name || 'Medion Vendor';

  if (layout === 'list') {
    return (
      <motion.div 
        whileHover={{ y: -2 }}
        onClick={() => navigate(`/products/${product.id}`)}
        className="group cursor-pointer flex gap-4 p-2 transition-all active:scale-[0.98]"
      >
        <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
          <button 
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); /* Add to favorites logic */ }}
          >
            <Heart className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-red-500" />
          </button>
        </div>
        
        <div className="flex flex-col justify-center flex-1 py-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base md:text-lg leading-tight mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900 dark:fill-white dark:text-white" />
            <span className="font-medium text-slate-900 dark:text-white">4.8</span>
            <span>(1.2k)</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">${product.price.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">Sold by <span className="underline decoration-slate-300 underline-offset-2">{storeName}</span></p>
        </div>
      </motion.div>
    );
  }

  // Default Grid Layout
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group flex flex-col w-full cursor-pointer active:scale-[0.98] transition-transform duration-200"
    >
      <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); /* Add to favorites logic */ }}
        >
          <Heart className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors" />
        </button>
        {Math.random() > 0.5 && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            Etsy's Pick
          </div>
        )}
      </div>
      
      <div className="flex flex-col px-1">
        <h3 className="font-medium text-[13px] md:text-sm text-slate-900 dark:text-white leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 text-[11px] md:text-xs mt-0.5 mb-1 text-slate-500">
          <Star className="w-3 h-3 fill-slate-900 text-slate-900 dark:fill-white dark:text-white" />
          <span className="font-bold text-slate-900 dark:text-white">4.8</span>
          <span>(1.2k)</span>
        </div>
        <p className="font-bold text-sm md:text-[15px] text-slate-900 dark:text-white">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{storeName}</p>
      </div>
    </motion.div>
  );
}
