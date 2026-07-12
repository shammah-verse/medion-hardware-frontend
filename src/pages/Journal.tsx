import { BookOpen } from 'lucide-react';

export function Journal() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] py-24 text-slate-900 dark:text-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Journal</h1>
          <p className="text-xl text-slate-500">Insights, news, and updates from the Medion community.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                <BookOpen className="w-8 h-8 opacity-50" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">Article</span>
                <h3 className="text-xl font-bold mb-3">How Local Stores are Thriving Online</h3>
                <p className="text-slate-500 text-sm line-clamp-2">Discover how transitioning to a multi-vendor platform is empowering small businesses to reach new heights.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
