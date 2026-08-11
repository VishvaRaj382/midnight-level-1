import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Key, Coins, Cpu, ExternalLink } from 'lucide-react';

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
      title: "3. Generate Zero-Knowledge Access Proof",
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Enter your raw organization credential ID and AI secret token. AIShield generates a local ZK proof in Compact 0.23 — proving eligibility without exposing raw credentials on-chain.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Raw identity secrets remain 100% strictly local in private state.</li>
            <li>Only disclosed commitment hash is posted to Midnight ledger.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Access AI Services & Provide Feedback",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            Once verified on-chain, your active access tier (BASIC, PRO, or ENTERPRISE) enables confidential AI API calls. Use the feedback widget to share your Preprod experience!
          </p>
          <button
            onClick={onClose}
            className="btn-primary w-full py-2.5 text-sm cursor-pointer justify-center"
          >
            Start Using AIShield MVP
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">Preprod User Onboarding Guide</h3>
              <p className="text-xs text-slate-400">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicators */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-4 py-2 justify-between">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                step.id === currentStep
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : step.id < currentStep
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-500'
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span>{step.id}</span>
              )}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-5 space-y-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              {steps[currentStep - 1].icon}
            </div>
            <h4 className="font-bold text-slate-100 text-lg">
              {steps[currentStep - 1].title}
            </h4>
          </div>

          {steps[currentStep - 1].content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-500">
            Midnight Preprod Testnet
          </span>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer px-3 py-1.5 rounded-lg hover:bg-cyan-950/40 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
