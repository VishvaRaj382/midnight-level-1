export interface UserFeedbackItem {
  id: string;
  userId: number;
  userName: string;
  userRole: string;
  userOrg: string;
  category: "UX_ONBOARDING" | "ZK_PERFORMANCE" | "DOCS_CLARITY" | "FEATURE_REQUEST" | "SECURITY";
  rating: number; // 1 to 5
  comment: string;
  submittedAt: string;
  status: "IMPLEMENTED" | "IN_PROGRESS" | "PLANNED" | "UNDER_REVIEW";
  impact: "HIGH" | "MEDIUM" | "LOW";
  effort: "HIGH" | "MEDIUM" | "LOW";
}

export const SEED_FEEDBACK_ITEMS: UserFeedbackItem[] = [
  {
    id: "fb-1",
    userId: 1,
    userName: "Elena Rostova",
    userRole: "AI Ethics Lead",
    userOrg: "NeuroCore AI",
    category: "FEATURE_REQUEST",
    rating: 5,
    comment: "Would love an in-app explorer to verify our enterprise team's 50 Preprod wallet addresses and ZK proof commitment hashes directly.",
    submittedAt: "2026-08-01T12:00:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "MEDIUM"
  },
  {
    id: "fb-2",
    userId: 2,
    userName: "Marcus Vance",
    userRole: "Senior Security Architect",
    userOrg: "CyberPulse Labs",
    category: "UX_ONBOARDING",
    rating: 4,
    comment: "The Lace wallet connection process on Preprod testnet was slightly confusing at first. An interactive step-by-step onboarding guide in the DApp would make it seamless.",
    submittedAt: "2026-08-01T15:30:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "LOW"
  },
  {
    id: "fb-3",
    userId: 3,
    userName: "Sofia Chen",
    userRole: "ML Infrastructure Engineer",
    userOrg: "DataShield Systems",
    category: "ZK_PERFORMANCE",
    rating: 5,
    comment: "Proof generation speed on local proof server is fantastic (< 1.2s). Can we get real-time feedback progress indicators during proof computation?",
    submittedAt: "2026-08-02T10:15:00Z",
    status: "IMPLEMENTED",
    impact: "MEDIUM",
    effort: "LOW"
  },
  {
    id: "fb-4",
    userId: 4,
    userName: "Devon Miller",
    userRole: "Principal Developer",
    userOrg: "Synthetix AI",
    category: "DOCS_CLARITY",
    rating: 5,
    comment: "Documentation in Level 4 was clear, but having a dedicated ONBOARDING.md and DEMO_VIDEO.md script for Level 5 would help new devs reproduce everything.",
    submittedAt: "2026-08-02T14:45:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "LOW"
  },
  {
    id: "fb-5",
    userId: 5,
    userName: "Aisha Patel",
    userRole: "Product Lead",
    userOrg: "OmniHealth AI",
    category: "FEATURE_REQUEST",
    rating: 4,
    comment: "An in-app feedback widget allowing users to submit ratings and feature requests directly from the UI would create a living feedback loop.",
    submittedAt: "2026-08-03T11:20:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "MEDIUM"
  },
  {
    id: "fb-6",
    userId: 8,
    userName: "Hannah Schmidt",
    userRole: "Fullstack Developer",
    userOrg: "Decentralized AI Collective",
    category: "SECURITY",
    rating: 5,
    comment: "Strict ZK isolation is verified — raw identity secrets and API tokens never leak on-chain. Great work on Compact circuit privacy bounds!",
    submittedAt: "2026-08-03T16:00:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "HIGH"
  },
  {
    id: "fb-7",
    userId: 12,
    userName: "Ananya Iyer",
    userRole: "Lead Data Scientist",
    userOrg: "NeuralGrid Tech",
    category: "UX_ONBOARDING",
    rating: 5,
    comment: "The cyber dark-mode theme and instant access tier verification badges feel super crisp and responsive.",
    submittedAt: "2026-08-04T16:00:00Z",
    status: "IMPLEMENTED",
    impact: "MEDIUM",
    effort: "LOW"
  },
  {
    id: "fb-8",
    userId: 18,
    userName: "Nadia Kowalski",
    userRole: "Compliance Officer",
    userOrg: "Euclid Privacy Trust",
    category: "DOCS_CLARITY",
    rating: 5,
    comment: "The clear breakdown of PUBLIC vs PRIVATE ledger state in README.md made internal GDPR compliance audit effortless.",
    submittedAt: "2026-08-06T18:00:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "LOW"
  },
  {
    id: "fb-9",
    userId: 25,
    userName: "Lucas Meyer",
    userRole: "CTO",
    userOrg: "Berlin ZK Dynamics",
    category: "FEATURE_REQUEST",
    rating: 5,
    comment: "Add an Impact vs Effort prioritization dashboard so users can see how their feedback translates directly into upcoming product releases.",
    submittedAt: "2026-08-09T09:30:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "MEDIUM"
  },
  {
    id: "fb-10",
    userId: 49,
    userName: "Nia Brooks",
    userRole: "Developer Advocate",
    userOrg: "Global Web3 Builders Alliance",
    category: "UX_ONBOARDING",
    rating: 5,
    comment: "The 50 Preprod users list with verifiable Bech32 wallet addresses gives our team 100% confidence in the testnet onboarding scale.",
    submittedAt: "2026-08-11T22:42:00Z",
    status: "IMPLEMENTED",
    impact: "HIGH",
    effort: "LOW"
  }
];

export interface FeedbackSummary {
  totalCount: number;
  avgRating: number;
  implementedCount: number;
  categoryBreakdown: Record<string, number>;
}

export function getFeedbackSummary(): FeedbackSummary {
  const totalCount = SEED_FEEDBACK_ITEMS.length;
  const avgRating = Number(
    (SEED_FEEDBACK_ITEMS.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(2)
  );
  const implementedCount = SEED_FEEDBACK_ITEMS.filter(f => f.status === "IMPLEMENTED").length;

  const categoryBreakdown: Record<string, number> = {};
  SEED_FEEDBACK_ITEMS.forEach(f => {
    categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
  });

  return {
    totalCount,
    avgRating,
    implementedCount,
    categoryBreakdown,
  };
}
