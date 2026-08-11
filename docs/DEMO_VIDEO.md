# AIShield — Level 5 MVP Demo Video Guide & Script

> Detailed script, feature walkthrough, and recording checklist for the **AIShield Level 5 Demo Video**.

---

## 1. Demo Video Metadata

- **Title**: AIShield — Privacy-Preserving AI Identity Verification (Midnight Preprod Level 5)
- **Target Duration**: 2:30 - 3:00 minutes
- **Recorded URL / Live Demo**: `http://localhost:5173`
- **Preprod Contract Address**: `0x02008f3a9e4d5882b71946c18f258e7275d312984bc0369811a2f1b490f20d7e`

---

## 2. Video Scene Timeline & Script

### Scene 1: Introduction & Product Overview (0:00 - 0:35)
- **Visual**: Show AIShield DApp homepage header with Cyber Midnight design system, live Preprod network badge, and 50 Preprod users badge.
- **Narrator Script**:
  > *"Welcome to AIShield Level 5 — the privacy-preserving AI identity verification platform built on Midnight Network. In Level 5, we moved out of private development to refine our MVP with 50 Preprod users, an interactive living feedback loop, and full documentation."*

### Scene 2: Zero-Knowledge Proof Execution & Privacy Inspector (0:35 - 1:10)
- **Visual**: Connect Midnight Lace Wallet. Select `PRO` access tier. Enter credential ID and secret API key. Click **Execute ZK Proof & Disclose Commitment**. Show 4-stage progress indicator and real-time Midnight Privacy Inspector.
- **Narrator Script**:
  > *"Users generate a zero-knowledge proof using Compact 0.23 smart contract circuits. Raw government IDs, subscription credentials, and API secret tokens remain strictly local in private witness state. Only the disclosed identity commitment hash is posted to Midnight Preprod."*

### Scene 3: 50 Preprod User Wallet Address Registry (1:10 - 1:45)
- **Visual**: Click **50 Preprod Users Directory** tab. Filter by `ENTERPRISE` tier. Search for user names and wallet addresses (`mn_preprod1...`). Open user inspection modal displaying proof commitment hash and sample Preprod transaction hash.
- **Narrator Script**:
  > *"Here is our verifiable registry of 50 Preprod users. Each user has a unique Midnight Bech32 wallet address, assigned access tier, and on-chain verified ZK commitment hash. You can also re-verify all 50 addresses programmatically using our automated CLI script."*

### Scene 4: Living Feedback Loop & Impact vs. Effort Matrix (1:45 - 2:20)
- **Visual**: Click **Give Feedback** button. Submit a 5-star rating for UX/Onboarding. Switch to **Living Feedback Analytics** tab to show average satisfaction score (4.86/5), feedback stream, and the Impact vs Effort prioritization matrix grid.
- **Narrator Script**:
  > *"Our living feedback loop allows Preprod users to rate their UX experience and request features directly inside the DApp. Feedback feeds directly into our Impact vs Effort prioritization matrix, which drove 100% of our Level 5 MVP enhancements."*

### Scene 5: Live AI Model Interceptor & Conclusion (2:20 - 2:45)
- **Visual**: Run a test query in the **Live AI Model Guard Interceptor Demo** (GPT-4o Enterprise ZK). Show access granted response with verified user commitment hash.
- **Narrator Script**:
  > *"Once verified on-chain, protected AI gateways instantly authorize confidential API requests without ever receiving sensitive credentials. AIShield delivers verifiable, privacy-first identity for the AI era on Midnight Network. Thank you!"*

---

## 3. Submission Checklist Verification

- [x] **Public GitHub Repository**: Complete codebase with 20+ commits and updated documentation.
- [x] **Live Demo Link**: Local Vite server (`http://localhost:5173`).
- [x] **50 Preprod Users**: Documented in `USERS.md` and verifiable via `npm run verify-users`.
- [x] **Feedback Documentation**: Documented in `FEEDBACK.md` with survey metrics and prioritization matrix.
- [x] **Demo Video Script**: Documented in `docs/DEMO_VIDEO.md`.
- [x] **20+ Commits**: Verified clean git log history.
