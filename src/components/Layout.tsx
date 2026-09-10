import React from 'react';
import { Shield, ExternalLink, Lock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, headerRight }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                PrivAI Finance <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Midnight Preprod</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Zero-Knowledge Financial Eligibility Verification & AI Assisted Parsing
              </p>
            </div>
          </div>

          {headerRight && <div>{headerRight}</div>}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>PrivAI Finance — Midnight Builder Challenge</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>Midnight Network</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>Compact Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
