import { LifeBuoy, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Support() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] py-24 text-slate-900 dark:text-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Center</h1>
          <p className="text-xl text-slate-500">We're here to help you with anything you need.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <Mail className="w-8 h-8 mx-auto mb-4 text-emerald-500" />
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-slate-500 mb-4">Drop us a line anytime.</p>
            <a href="mailto:support@medion.com" className="text-emerald-500 font-bold">support@medion.com</a>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <Phone className="w-8 h-8 mx-auto mb-4 text-orange-500" />
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-slate-500 mb-4">Mon-Fri from 8am to 5pm.</p>
            <a href="tel:+1234567890" className="text-orange-500 font-bold">+1 (234) 567-890</a>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <MessageSquare className="w-8 h-8 mx-auto mb-4 text-blue-500" />
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-slate-500 mb-4">Chat with our support team.</p>
            <Button variant="outline" className="w-full">Start Chat</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
