import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, ExternalLink, CheckCircle2, Copy, Check } from 'lucide-react';
import { PREPROD_USERS, PreprodUser, getPreprodUserStats } from '../data/preprodUsers.js';

export const PreprodUserRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<PreprodUser | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const stats = getPreprodUserStats();

  const filteredUsers = PREPROD_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || user.accessTier === tierFilter;

    return matchesSearch && matchesTier;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Total Onboarded Preprod Users</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 mono">{stats.total}</span>
          <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Verifiable On-Chain
          </span>
        </div>
        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Enterprise Access Tiers</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 mono">{stats.enterprise}</span>
          <span className="text-[10px] text-slate-400 mt-1">Confidential Multi-Tenant</span>
        </div>
        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Pro Access Tiers</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 mono">{stats.pro}</span>
          <span className="text-[10px] text-slate-400 mt-1">High Throughput API</span>
        </div>
        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Avg Satisfaction Rating</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 mono">{stats.avgSatisfaction} / 5.0</span>
          <span className="text-[10px] text-slate-400 mt-1">Living Feedback Loop</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 50 Preprod Users by name, org, or wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['ALL', 'ENTERPRISE', 'PRO', 'BASIC'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                tierFilter === tier
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">User & Org</th>
                <th className="px-4 py-3">Midnight Preprod Address</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">UX Score</th>
                <th className="px-4 py-3 text-right">Inspect Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.role} • <span className="text-cyan-400">{user.organization}</span></div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">
                        {user.walletAddress.slice(0, 14)}...{user.walletAddress.slice(-6)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.walletAddress)}
                        className="text-slate-500 hover:text-cyan-400 p-1 rounded transition-colors"
                        title="Copy Wallet Address"
                      >
                        {copiedAddress === user.walletAddress ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.accessTier === 'ENTERPRISE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : user.accessTier === 'PRO'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {user.accessTier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-400">
                    {"★".repeat(user.satisfactionScore)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-950 text-cyan-400 hover:text-cyan-300 rounded border border-slate-700 hover:border-cyan-500/50 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected User Modal Details */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg overflow-hidden border border-cyan-500/30 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.role} at {selectedUser.organization}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block mb-0.5">Midnight Preprod Wallet Address:</span>
                  <span className="mono text-cyan-300 break-all select-all font-semibold">{selectedUser.walletAddress}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Zero-Knowledge Proof Commitment Hash:</span>
                  <span className="mono text-purple-300 break-all select-all">{selectedUser.proofHash}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-0.5">On-Chain Preprod Transaction Hash:</span>
                  <span className="mono text-slate-300 break-all select-all">{selectedUser.txHash}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Access Tier:</span>
                  <span className="font-bold text-cyan-400">{selectedUser.accessTier}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Primary Use Case:</span>
                  <span className="font-medium text-slate-200">{selectedUser.primaryUseCase}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
