
import React from 'react';
import { AppTab } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('archive')}>
              <div className="w-9 h-9 bg-slate-900 flex items-center justify-center rounded-md">
                <span className="text-white font-serif text-xl font-semibold leading-none">W</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 leading-none font-sans">WhyItStopped</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Research Archive</p>
              </div>
            </div>
          </div>

          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('archive')}
              className={`text-sm font-medium transition-colors ${activeTab === 'archive' ? 'text-slate-900 border-b-2 border-slate-900 py-5' : 'text-slate-500 hover:text-slate-700 py-5'}`}
            >
              Archive
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-slate-900 border-b-2 border-slate-900 py-5' : 'text-slate-500 hover:text-slate-700 py-5'}`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-slate-900 border-b-2 border-slate-900 py-5' : 'text-slate-500 hover:text-slate-700 py-5'}`}
            >
              Philosophy
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`text-sm font-medium transition-colors ${activeTab === 'submit' ? 'text-rose-600 border-b-2 border-rose-600 py-5' : 'text-rose-500 hover:text-rose-700 py-5'}`}
            >
              Submit
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white/80 py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <h3 className="font-serif font-semibold text-slate-900 mb-2">WhyItStopped</h3>
            <p className="text-sm text-slate-500 leading-relaxed italic font-sans">
              "Documentation of failure is more valuable than the celebration of success."
            </p>
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-[0.15em] text-right font-medium">
            <p>© {new Date().getFullYear()} Research Archive.</p>
            <p className="mt-1">Built for Builders, Engineers, & Professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
