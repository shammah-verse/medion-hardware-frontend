import { useState, useEffect } from 'react';
import { ShieldCheck, Upload, Building2, CheckCircle2, Clock, AlertCircle, Phone } from 'lucide-react';
import { verificationApi } from '../../api/verification';
import type { VerificationStatus } from '../../api/verification';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

export function Verification() {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  
  // Form State
  const [businessName, setBusinessName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await verificationApi.getStatus();
      setStatus(data);
      if (data.status === 'PENDING' || data.status === 'APPROVED' || data.status === 'REJECTED') {
        setStep(4);
      }
    } catch (error) {
      console.error('Failed to load status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await verificationApi.submitVerification({
        businessName,
        registrationNumber: regNumber,
        taxId,
        documentUrls: ['https://example.com/doc1.pdf'] // Mocked upload for UI
      });
      setStep(3);
    } catch (error) {
      console.error('Failed to submit verification', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setSubmitting(true);
    try {
      await verificationApi.verifyOtp(otp);
      fetchStatus();
    } catch (error) {
      console.error('OTP Verification failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-[400px] rounded-[32px]" />
      </div>
    );
  }

  const renderStatus = () => {
    if (!status) return null;
    
    if (status.status === 'APPROVED') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-12 text-center border border-emerald-200 dark:border-emerald-900 shadow-xl">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Account Verified</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Your identity and business documents have been successfully verified. You now have full access to Medion vendor tools.
          </p>
        </div>
      );
    }

    if (status.status === 'PENDING') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-12 text-center border border-amber-200 dark:border-amber-900 shadow-xl">
          <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Verification Pending</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Your application is currently under review by our compliance team. This usually takes 24-48 hours.
          </p>
        </div>
      );
    }

    if (status.status === 'REJECTED') {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-12 text-center border border-red-200 dark:border-red-900 shadow-xl">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Verification Failed</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            {status.remarks || 'Your documents did not meet our compliance requirements.'}
          </p>
          <Button onClick={() => setStep(1)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl px-8 h-12">
            Try Again
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Identity Verification</h1>
        <p className="text-slate-500">Complete KYC to start selling and withdrawing funds.</p>
      </div>

      {step === 4 ? renderStatus() : (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="flex bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 flex items-center justify-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  step === i ? 'bg-orange-500 text-white' : 
                  step > i ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                {i < 3 && (
                  <div className={`absolute top-1/2 left-1/2 w-full h-1 -translate-y-1/2 ${
                    step > i ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="text-center mb-8">
                  <Building2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Business Details</h3>
                  <p className="text-slate-500">Provide your official business information.</p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Legal Business Name</label>
                    <input 
                      type="text" 
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Registration Number</label>
                    <input 
                      type="text" 
                      value={regNumber}
                      onChange={e => setRegNumber(e.target.value)}
                      className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tax ID / VAT Number</label>
                    <input 
                      type="text" 
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-8">
                  <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Document Upload</h3>
                  <p className="text-slate-500">Upload your certificate of incorporation or ID.</p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500">PDF, JPG or PNG (max. 10MB)</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-8">
                  <Phone className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Verify Phone Number</h3>
                  <p className="text-slate-500">Enter the 6-digit code sent to your registered phone.</p>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="------"
                  />
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto flex gap-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1 h-14 rounded-xl border-slate-200 dark:border-slate-700"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  onClick={step === 2 ? handleSubmit : handleNext}
                  disabled={submitting || (step === 1 && (!businessName || !regNumber))}
                  className="flex-[2] h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl"
                >
                  {submitting ? 'Processing...' : 'Continue'}
                </Button>
              ) : (
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={submitting || otp.length < 6}
                  className="flex-[2] h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25"
                >
                  {submitting ? 'Verifying...' : 'Complete Verification'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
