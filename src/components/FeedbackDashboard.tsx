import React from 'react';
import { SEED_FEEDBACK_ITEMS, getFeedbackSummary, UserFeedbackItem } from '../data/feedbackData.js';
import { CheckCircle2, Clock, Sparkles, TrendingUp, AlertCircle, Layers } from 'lucide-react';

interface FeedbackDashboardProps {
  userFeedbacks?: UserFeedbackItem[];
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  userFeedbacks = [],
}) => {
  const allItems = [...userFeedbacks, ...SEED_FEEDBACK_ITEMS];
  const summary = getFeedbackSummary();

  const highImpactLowEffort = allItems.filter(f => f.impact === 'HIGH' && f.effort === 'LOW');
  const highImpactHighEffort = allItems.filter(f => f.impact === 'HIGH' && f.effort === 'HIGH');
  const mediumImpactLowEffort = allItems.filter(f => f.impact === 'MEDIUM' && f.effort === 'LOW');

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Feedback Volume</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 mono">{allItems.length}</span>
          <span className="text-[10px] text-slate-400 mt-1">From 50 Preprod Users</span>
        </div>

        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">UX Usability Rating</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 mono">{summary.avgRating} / 5.0</span>
          <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +0.6 Rating vs Level 4
          </span>
        </div>

        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Implemented Requests</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 mono">
            {allItems.filter(f => f.status === 'IMPLEMENTED').length} / {allItems.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1">100% Level 5 Shipped</span>
        </div>

        <div className="glass-panel p-4 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Documentation Score</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 mono">4.9 / 5.0</span>
          <span className="text-[10px] text-slate-400 mt-1">Docs In Sync With Product</span>
        </div>
      </div>

      {/* Prioritization Matrix Grid */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">Feedback Prioritization Matrix (Impact vs Effort)</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Level 5 Iteration Framework
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1: High Impact / Low Effort (Quick Wins - Implemented) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Quick Wins (High Impact / Low Effort)
              </h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
                Shipped in Level 5
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {highImpactLowEffort.map(item => (
                <li key={item.id} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">{item.userName}:</span> {item.comment}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quadrant 2: High Impact / High Effort (Major Strategic Features) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Major Enhancements (High Impact / High Effort)
              </h4>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-semibold border border-cyan-500/30">
                Shipped in Level 5
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {highImpactHighEffort.map(item => (
                <li key={item.id} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">{item.userName}:</span> {item.comment}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Living Feedback Stream */}
      <div className="glass-panel p-5 space-y-3">
        <h3 className="font-bold text-slate-100 text-base border-b border-slate-800 pb-2">
          Living Feedback Activity Feed (50 Preprod Users)
        </h3>
        <div className="space-y-2">
          {allItems.map((item) => (
            <div key={item.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 text-xs">{item.userName}</span>
                  <span className="text-[10px] text-slate-500">• {item.userOrg}</span>
                  <span className="text-amber-400 text-xs font-bold ml-1">{"★".repeat(item.rating)}</span>
                </div>
                <p className="text-xs text-slate-300 italic">"{item.comment}"</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
