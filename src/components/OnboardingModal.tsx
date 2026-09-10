import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Key, Coins, Lock, ExternalLink } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onConnectWallet,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: "1. Connect Midnight Lace Wallet",
      icon: <Key className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Install the <strong className="text-cyan-300">Midnight Lace Wallet</strong> Chrome extension and select the <strong className="text-emerald-400">Preprod Testnet</strong> network.
          </p>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Network ID:</span>
              <span className="mono text-cyan-300 font-semibold">preprod</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Indexer URL:</span>
              <span className="mono text-slate-300">https://indexer.preprod.midnight.network</span>
            </div>
          </div>
          <button
            onClick={() => {
              onConnectWallet();
              setCurrentStep(2);
            }}
            className="btn-primary w-full py-2.5 text-sm cursor-pointer justify-center"
          >
            Connect Wallet & Continue
          </button>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. Claim tNight Testnet Faucet Tokens",
      icon: <Coins className="w-6 h-6 text-emerald-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            To submit zero-knowledge circuit transactions on Midnight Preprod, request testnet tNight tokens from the official faucet.
          </p>
          <a
            href="https://faucet.preprod.midnight.network"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full glass-panel py-2.5 px-4 text-sm font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-950/40 transition-colors"
          >
            Open Official Midnight Preprod Faucet
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. Define Requirement & Enter Private Income",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Set your public benchmark requirement (e.g. Monthly Income ≥ ₹50,000) or let the assistive AI parse your natural-language criteria. Then enter your private income in confidential witness memory.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Your exact salary remains 100% strictly local in private witness state.</li>
            <li>Compact circuit evaluates <code className="text-cyan-300">monthlyIncome &gt;= threshold</code> in zero-knowledge.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Authoritative Verification with Zero Data Leakage",
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Once proved on-chain, the verifier learns <strong>ELIGIBLE: YES</strong> with cryptographic finality, while your underlying financial salary remains completely secret!
          </p>
          <button
            onClick={onClose}
            className="btn-primary w-full py-2.5 text-sm cursor-pointer justify-center"
          >
            Start Proving Financial Eligibility
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg overflow-hidden border border-cyan-500/30 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">PrivAI Finance Onboarding Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((s) => (
              <div
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`flex flex-col items-center gap-1.5 cursor-pointer flex-1 relative ${
                  s.id === currentStep ? 'text-cyan-400 font-semibold' : s.id < currentStep ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    s.id === currentStep
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : s.id < currentStep
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {s.id < currentStep ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className="text-[10px] hidden sm:block text-center font-mono">
                  {s.id === 1 ? 'Wallet' : s.id === 2 ? 'Faucet' : s.id === 3 ? 'Income' : 'Verify'}
                </span>
              </div>
            ))}
          </div>

          <div className="min-h-[170px] bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              {steps[currentStep - 1].icon}
              <h3 className="text-sm font-semibold text-slate-100">{steps[currentStep - 1].title}</h3>
            </div>
            {steps[currentStep - 1].content}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              disabled={currentStep === steps.length}
              className="px-3 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:hover:text-cyan-400 flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
