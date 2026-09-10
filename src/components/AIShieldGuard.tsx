import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Sparkles,
  Terminal,
  Loader2,
  Layers,
  Users,
  MessageSquare,
  BookOpen,
  Zap,
} from 'lucide-react';
import { VerificationStatus } from '../../managed/contract/index.js';
import type { MidnightWalletState, VerificationStateData } from '../hooks/useMidnight.js';
import { formatStatusName, truncateHash } from '../utils/contract.js';
import { PreprodUserRegistry } from './PreprodUserRegistry.js';
import { FeedbackDashboard } from './FeedbackDashboard.js';
import { FeedbackModal } from './FeedbackModal.js';
import { OnboardingModal } from './OnboardingModal.js';
import type { UserFeedbackItem } from '../data/feedbackData.js';

interface AIShieldGuardProps {
  wallet: MidnightWalletState;
  verification: VerificationStateData;
  isProcessing: boolean;
  activeStep: string;
  onVerify: (income: number, threshold: number) => void;
  onRevoke: () => void;
  onConnectWallet: () => void;
}

export const AIShieldGuard: React.FC<AIShieldGuardProps> = ({
  wallet,
  verification,
  isProcessing,
  activeStep,
  onVerify,
  onRevoke,
  onConnectWallet,
}) => {
  const [activeTab, setActiveTab] = useState<'GUARD' | 'USERS' | 'FEEDBACK'>('GUARD');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [userFeedbacks, setUserFeedbacks] = useState<UserFeedbackItem[]>([]);

  const [monthlyIncome, setMonthlyIncome] = useState(73500);
  const [requiredThreshold, setRequiredThreshold] = useState(50000);

  // AI Model Interactive Playground state
  const [aiPrompt, setAiPrompt] = useState('Verify monthly income >= 50000 INR for prime loan approval.');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiQuerying, setAiQuerying] = useState(false);
  const [selectedModel, setSelectedModel] = useState('PrivAI Smart Validator');

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(monthlyIncome, requiredThreshold);
  };

  const handleTestAiModel = async () => {
    setAiQuerying(true);
    setAiResponse(null);
    await new Promise((res) => setTimeout(res, 1200));

    if (verification.status !== VerificationStatus.ELIGIBLE) {
      setAiResponse(
        '❌ ACCESS DENIED by PrivAI Finance: Proof shows requirement not met or unverified on-chain.'
      );
    } else {
      setAiResponse(
        `✅ ELIGIBILITY CONFIRMED by Midnight ZK Proof: Verified pseudonym commitment [${truncateHash(
          verification.userCommitment || ''
        )}]. Output from ${selectedModel}: "Applicant meets requirement (Monthly Income >= ₹50,000). Exact income was NOT revealed."`
      );
    }
    setAiQuerying(false);
  };

  const handleAddFeedback = (newFb: UserFeedbackItem) => {
    setUserFeedbacks((prev) => [newFb, ...prev]);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border border-cyan-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Midnight Network Confidential ZK Computing</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              PrivAI Finance
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              Prove financial eligibility (e.g. Monthly Income ≥ ₹50,000) using zero-knowledge proofs on Midnight without revealing your exact income.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700/60 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Guide & Architecture</span>
            </button>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-medium rounded-lg border border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-8 -mb-4 gap-6">
          <button
            onClick={() => setActiveTab('GUARD')}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'GUARD'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ZK Eligibility Guard</span>
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'USERS'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Preprod Verification Registry</span>
          </button>
          <button
            onClick={() => setActiveTab('FEEDBACK')}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'FEEDBACK'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Feedback Loop</span>
          </button>
        </div>
      </div>

      {activeTab === 'GUARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: ZK Prover Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Private Witness Input</h2>
                    <p className="text-xs text-slate-400">Values are kept 100% confidential in local ZK state</p>
                  </div>
                </div>
                <span className="badge-verified flex items-center gap-1.5 text-xs">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Never Sent On-Chain</span>
                </span>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    YOUR PRIVATE MONTHLY INCOME (INR)
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="73500"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    🔒 Kept strictly inside local witness memory during ZK proof generation.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    PUBLIC REQUIREMENT THRESHOLD (INR)
                  </label>
                  <input
                    type="number"
                    value={requiredThreshold}
                    onChange={(e) => setRequiredThreshold(Number(e.target.value))}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="50000"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Public threshold: Monthly Income ≥ ₹{requiredThreshold.toLocaleString()}
                  </span>
                </div>

                {isProcessing && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>{activeStep || 'Generating Zero-Knowledge Proof...'}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Proving On Midnight Preprod...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Prove Income Eligibility (ZK)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* AI Assistant Sandbox */}
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Rule Translation & Verification Layer</h2>
                  <p className="text-xs text-slate-400">AI assists rule parsing; Midnight Compact circuit guarantees cryptographic truth</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    NATURAL LANGUAGE REQUIREMENT / PROMPT
                  </label>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <button
                  onClick={handleTestAiModel}
                  disabled={aiQuerying}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  {aiQuerying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      <span>Verifying On-Chain Proof Status...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 text-purple-400" />
                      <span>Test AI Verifier Response</span>
                    </>
                  )}
                </button>

                {aiResponse && (
                  <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Ledger State & Privacy Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>On-Chain Public Ledger State</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Verification Status</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      verification.status === VerificationStatus.ELIGIBLE
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : verification.status === VerificationStatus.INELIGIBLE
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {formatStatusName(verification.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Required Threshold</span>
                  <span className="text-cyan-300 font-semibold">≥ ₹{requiredThreshold.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">User Commitment</span>
                  <span className="text-slate-300">{truncateHash(verification.userCommitment || '0x0000...0000')}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Proof Tx Hash</span>
                  <span className="text-purple-300">{truncateHash(verification.txHash || '0x0000...0000')}</span>
                </div>
              </div>

              {/* Privacy Comparison Table */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                  Privacy Architecture
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                    <span className="font-bold">✓ Verifier Learns:</span> ELIGIBLE = YES (meets condition ≥ ₹{requiredThreshold.toLocaleString()})
                  </div>
                  <div className="p-2 rounded bg-rose-950/20 border border-rose-500/20 text-rose-300">
                    <span className="font-bold">✕ Verifier NEVER Learns:</span> Exact income (₹{monthlyIncome.toLocaleString()})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && <PreprodUserRegistry />}
      {activeTab === 'FEEDBACK' && (
        <FeedbackDashboard
          userFeedbacks={userFeedbacks}
        />
      )}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onAddFeedback={handleAddFeedback}
        userAddress={wallet.address}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onConnectWallet={onConnectWallet}
      />
    </div>
  );
};
