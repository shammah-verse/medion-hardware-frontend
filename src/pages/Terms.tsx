import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] py-24 text-slate-900 dark:text-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-xl text-slate-500">Last updated: July 12, 2026</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            By accessing and using Medion Hardware platform, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">2. Vendor Responsibilities</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Vendors must provide accurate product descriptions, maintain up-to-date inventory, and fulfill orders in a timely manner. We reserve the right to suspend accounts that violate these terms.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Customer Purchases</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            All purchases are protected by our secure checkout. Returns and refunds are handled according to the specific vendor's return policy.
          </p>
          
          <p className="text-slate-500 text-sm mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
            For any questions regarding these terms, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
