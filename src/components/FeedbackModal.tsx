import React, { useState } from 'react';
import { X, Star, Send, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import type { UserFeedbackItem } from '../data/feedbackData.js';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeedback: (feedback: UserFeedbackItem) => void;
  userAddress?: string | null;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onAddFeedback,
  userAddress,
}) => {
  const [category, setCategory] = useState<UserFeedbackItem["category"]>("UX_ONBOARDING");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [impact, setImpact] = useState<UserFeedbackItem["impact"]>("HIGH");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFeedback: UserFeedbackItem = {
      id: `fb-${Date.now()}`,
      userId: Math.floor(Math.random() * 1000) + 50,
      userName: userAddress ? `${userAddress.slice(0, 10)}...${userAddress.slice(-6)}` : "Preprod User",
      userRole: "Preprod Tester",
      userOrg: "Midnight Community",
      category,
      rating,
      comment,
      submittedAt: new Date().toISOString(),
      status: "UNDER_REVIEW",
      impact,
      effort: "MEDIUM",
    };

    onAddFeedback(newFeedback);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setComment("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">Submit Structured Feedback</h3>
              <p className="text-xs text-slate-400">Midnight Level 5 Living Feedback Loop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30 animate-bounce">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-100 text-lg">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400">
              Your structured feedback has been added to our living feedback loop and Level 5 prioritization matrix.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-slate-950/60">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="UX_ONBOARDING">UX & Onboarding Flow</option>
                <option value="ZK_PERFORMANCE">Zero-Knowledge Proof Performance</option>
                <option value="DOCS_CLARITY">Documentation Clarity & Setup</option>
                <option value="FEATURE_REQUEST">Feature Request / Enhancements</option>
                <option value="SECURITY">Privacy & Security Audit</option>
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Overall Satisfaction Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-400 ml-2">{rating} / 5</span>
              </div>
            </div>

            {/* Perceived Impact */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority Impact Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setImpact(lvl)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      impact === lvl
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {lvl} Impact
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Comments & Recommendations
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked well? What could be improved for Preprod users?"
                rows={4}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!comment.trim()}
              className="btn-primary w-full py-2.5 text-xs font-semibold cursor-pointer justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Submit to Living Feedback Loop
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
