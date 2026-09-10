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
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { VerificationStatus } from '../../managed/contract/index.js';
import type { MidnightWalletState, VerificationStateData } from '../hooks/useMidnight.js';
import { formatStatusName, truncateHash } from '../utils/contract.js';
import { parseNaturalLanguageRequirement, type StructuredRule } from '../utils/aiRuleParser.js';
import { PreprodUserRegistry } from './PreprodUserRegistry.js';
import { FeedbackDashboard } from './FeedbackDashboard.js';
import { FeedbackModal } from './FeedbackModal.js';
import { OnboardingModal } from './OnboardingModal.js';
import type { UserFeedbackItem } from '../data/feedbackData.js';

interface PrivAIGuardProps {
  wallet: MidnightWalletState;
  verification: VerificationStateData;
  isProcessing: boolean;
  activeStep: string;
  onVerify: (income: number, threshold: number) => void;
  onRevoke: () => void;
  onConnectWallet: () => void;
}

const PRESET_REQUIREMENTS = [
  { label: 'Micro-Loan Tier', amount: 25000, desc: 'Monthly Income ≥ ₹25,000' },
  { label: 'Prime Credit Tier', amount: 50000, desc: 'Monthly Income ≥ ₹50,000' },
  { label: 'Mortgage / DAO Tier', amount: 150000, desc: 'Monthly Income ≥ ₹150,000' },
];

export const PrivAIGuard: React.FC<PrivAIGuardProps> = ({
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

  // User private & public inputs
  const [monthlyIncome, setMonthlyIncome] = useState(73500);
  const [requiredThreshold, setRequiredThreshold] = useState(50000);

  // AI Natural Language Parsing State
  const [aiPrompt, setAiPrompt] = useState('Applicant must earn at least fifty thousand rupees per month (50000 INR).');
  const [parsedRule, setParsedRule] = useState<StructuredRule | null>({
    metric: 'monthly_income',
    operator: '>=',
    threshold: 50000,
    currency: 'INR',
    description: 'Requires monthly income >= INR 50,000',
  });
  const [aiParseError, setAiParseError] = useState<string | null>(null);

  const handleParseAiPrompt = (promptText: string) => {
    setAiPrompt(promptText);
    const result = parseNaturalLanguageRequirement(promptText);
    if (result.isValid && result.rule) {
      setParsedRule(result.rule);
      setRequiredThreshold(result.rule.threshold);
      setAiParseError(null);
    } else {
      setAiParseError(result.error || 'Failed to parse natural language rule');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(monthlyIncome, requiredThreshold);
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
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Midnight Network • Level 2 Frontend & Wallet Integration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              PrivAI Finance
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              Privacy-preserving financial eligibility platform. Prove that you satisfy a financial requirement (e.g. <span className="text-cyan-300 font-semibold">Monthly Income ≥ ₹50,000</span>) using zero-knowledge proofs without revealing your exact income.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Onboarding Guide</span>
            </button>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-medium rounded-lg border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Feedback</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-8 -mb-4 gap-6">
          <button
            onClick={() => setActiveTab('GUARD')}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'GUARD'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ZK Eligibility Prover</span>
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
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
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'FEEDBACK'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Feedback</span>
          </button>
        </div>
      </div>

      {activeTab === 'GUARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Prover Controls & AI Assistant */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: AI Natural Language Requirement Parsing */}
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Assistive AI Requirement Parser</h2>
                  <p className="text-xs text-slate-400">Natural language criteria converted into validated rule schemas</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    ENTER REQUIREMENT IN NATURAL LANGUAGE
                  </label>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => handleParseAiPrompt(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="e.g. Applicant must earn at least 50k INR per month"
                  />
                </div>

                {/* Structured Rule JSON Preview */}
                {parsedRule && !aiParseError && (
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-purple-500/20 text-xs font-mono text-purple-300 flex items-start gap-2">
                    <Code2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400">Validated Rule Schema:</span>
                      <pre className="mt-1 text-[11px] text-cyan-300">
                        {JSON.stringify(parsedRule, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {aiParseError && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
                    ⚠️ {aiParseError}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Private Witness Input & Zero-Knowledge Prover */}
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Private Witness & Requirement</h2>
                    <p className="text-xs text-slate-400">Zero-Knowledge Circuit: <code>monthlyIncome &gt;= threshold</code></p>
                  </div>
                </div>
                <span className="badge-verified flex items-center gap-1.5 text-xs">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Confidential Witness</span>
                </span>
              </div>

              {/* Requirement Presets */}
              <div className="mb-4">
                <label className="block text-xs font-mono text-slate-400 mb-2">QUICK PRESET REQUIREMENTS</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_REQUIREMENTS.map((req) => (
                    <button
                      key={req.amount}
                      type="button"
                      onClick={() => {
                        setRequiredThreshold(req.amount);
                        setAiPrompt(`Applicant must earn at least ${req.amount.toLocaleString()} INR monthly.`);
                        handleParseAiPrompt(`Applicant must earn at least ${req.amount.toLocaleString()} INR monthly.`);
                      }}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        requiredThreshold === req.amount
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold">{req.label}</div>
                      <div className="text-[11px] text-slate-400">≥ ₹{req.amount.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
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
                    REQUIRED PUBLIC THRESHOLD (INR)
                  </label>
                  <input
                    type="number"
                    value={requiredThreshold}
                    onChange={(e) => setRequiredThreshold(Number(e.target.value))}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="50000"
                    required
                  />
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
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Proving On Midnight Preprod...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Prove Income Eligibility (ZK Proof)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Verification Results, Ledger State & Privacy Inspector */}
          <div className="lg:col-span-5 space-y-6">
            {/* Verification Status Card */}
            <div className="glass-panel p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Authoritative Midnight Ledger State</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Eligibility Outcome</span>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded text-xs flex items-center gap-1.5 ${
                      verification.status === VerificationStatus.ELIGIBLE
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : verification.status === VerificationStatus.INELIGIBLE
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {verification.status === VerificationStatus.ELIGIBLE && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {verification.status === VerificationStatus.INELIGIBLE && <XCircle className="w-3.5 h-3.5" />}
                    {formatStatusName(verification.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Required Benchmark</span>
                  <span className="text-cyan-300 font-semibold">≥ ₹{requiredThreshold.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Pseudonym Commitment</span>
                  <span className="text-slate-300">{truncateHash(verification.userCommitment || '0x0000...0000')}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Proof Tx Hash</span>
                  <span className="text-purple-300">{truncateHash(verification.txHash || '0x0000...0000')}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Network Target</span>
                  <span className="text-emerald-400">Midnight Preprod (Testnet)</span>
                </div>
              </div>

              {/* Privacy Comparison Table */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Privacy Model Guarantees</span>
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 leading-relaxed">
                    <span className="font-bold">✓ Verifier Learns:</span> ELIGIBLE = {verification.status === VerificationStatus.ELIGIBLE ? 'YES' : 'PENDING'} (Satisfies threshold ≥ ₹{requiredThreshold.toLocaleString()})
                  </div>
                  <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/20 text-rose-300 leading-relaxed">
                    <span className="font-bold">✕ Verifier NEVER Learns:</span> Exact income figure (₹{monthlyIncome.toLocaleString()})
                  </div>
                </div>
              </div>

              {/* Contract Info Footer */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex justify-between items-center">
                <span>Contract: 0x02008f...0d7e</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  Compact 0.23 Circuit
                </span>
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
