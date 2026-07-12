import { Store } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] py-24 text-slate-900 dark:text-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-slate-500">Connecting local stores with consumers seamlessly.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Medion was founded with a single mission: to empower local businesses and provide consumers with a seamless way to find and purchase products and services near them. 
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            We noticed that while giant e-commerce platforms thrive, local stores struggle to establish a digital footprint. We built this platform to give them the tools they need to succeed in the digital age, much like Shopify, but tailored specifically for local discoverability.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Whether you are a customer looking for premium materials, or a vendor wanting to reach a wider audience, our platform provides the perfect ecosystem for you to thrive.
          </p>
        </div>
      </div>
    </div>
  );
}
