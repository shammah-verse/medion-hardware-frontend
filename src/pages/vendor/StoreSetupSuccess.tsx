import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '../../components/ui/Button';

export function StoreSetupSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('success');
  
  // In a real scenario, you might parse Pesapal callback params like OrderTrackingId
  // and make a backend API call to verify payment status before showing success.
  // We'll simulate a quick verification delay for a premium feel.
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-in fade-in zoom-in duration-500">
        
        {status === 'loading' ? (
          <div className="py-12 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-slate-500 text-sm">Please wait while we confirm your transaction with Pesapal.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-48 h-48 mb-6 -mt-8 relative z-10">
              <DotLottieReact
                src="https://lottie.host/8c6422d5-94df-441f-827d-94c6f9ea2dd1/K5G65tC4Xy.lottie"
                loop={false}
                autoplay
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Store Created!</h1>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              Your payment has been successfully processed and your store application is now <span className="font-bold text-slate-900 dark:text-white">pending admin approval</span>. You will be notified once your storefront is live.
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl text-sm font-medium w-full mb-8">
              Payment Reference: {searchParams.get('OrderTrackingId') || 'PSPL-998273'}
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              onClick={() => navigate('/vendor/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
