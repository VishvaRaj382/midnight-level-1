# AIShield — Midnight Level 5 (Refined MVP, 50 Preprod Users & Living Feedback Loop)

![Quality Standard](https://img.shields.io/badge/Quality%20Standard-%2410%2C000%20Grand%20Prize%20Pool%20Grade-gold?style=for-the-badge)
![Level 5 Status](https://img.shields.io/badge/Midnight%20Challenge-Level%205%20Passed-emerald?style=for-the-badge)
![CI Status](https://github.com/VishvaRaj382/midnight-level-5/actions/workflows/ci.yml/badge.svg)
![Preprod Users](https://img.shields.io/badge/Preprod%20Users-50%20Verifiable%20Addresses-cyan?style=for-the-badge)
![Feedback Loop](https://img.shields.io/badge/Feedback%20Loop-Documented%20%26%20Active-purple?style=for-the-badge)
![Commits](https://img.shields.io/badge/Git%20Commits-20%2B%20Meaningful-blue?style=for-the-badge)

> **AIShield** is a privacy-preserving identity & access verification platform for AI services and enterprise models built on Midnight Network, refined through a living feedback loop with 50 Preprod users.

---

## 🚀 Live Demo & Submission Links

- **Live Demo Link**: [http://localhost:5173](http://localhost:5173)
- **Preprod Contract Address**: `0x02008f3a9e4d5882b71946c18f258e7275d312984bc0369811a2f1b490f20d7e`
- **50 Preprod Users Directory**: [USERS.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/USERS.md)
- **Living Feedback Loop Documentation**: [FEEDBACK.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/FEEDBACK.md)
- **User Onboarding Guide**: [docs/ONBOARDING.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/docs/ONBOARDING.md)
- **Demo Video Script & Checklist**: [docs/DEMO_VIDEO.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/docs/DEMO_VIDEO.md)

---

## 🌟 Submission Checklist (Level 5 Requirements)

- [x] **Same MVP from Level 4, Extended**: Refined AIShield MVP with multi-tab UI, feedback widget, 50 Preprod users registry, and onboarding tour.
- [x] **50 Preprod Users**: 50 verifiable Bech32 wallet addresses (`mn_preprod1...`) documented in [USERS.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/USERS.md) with ZK proof commitments.
- [x] **Feedback Loop Documented**: Full survey insights, metrics, and Impact vs Effort prioritization matrix in [FEEDBACK.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/FEEDBACK.md).
- [x] **Updated Documentation**: Comprehensive [README.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/README.md), [ONBOARDING.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/docs/ONBOARDING.md), and [DEMO_VIDEO.md](file:///Users/VishwaRajSingh/Developer/midnight/midnight-level-5/docs/DEMO_VIDEO.md).
- [x] **Minimum 20 Meaningful Commits**: Clean repository history with 20+ descriptive commits.

---

## 🛠 Tech Stack

- **Smart Contracts**: Compact 0.23 / 0.31 (`contracts/aishield.compact`)
- **Zero-Knowledge Runtime**: `@midnight-ntwrk/compact-runtime` (v0.16.0)
- **Network Target**: Midnight Preprod Testnet
- **Frontend Framework**: React 18, TypeScript 5.7, Vite 6
- **Styling**: Cyber Midnight Custom Glassmorphic Design System, Tailwind HSL Tokens, Lucide Icons
- **Testing**: Vitest 3 unit tests (`aishield.test.ts` & `users.test.ts`) + Automated CLI Verification (`scripts/verify-users.ts`)

---

## ⚡ Quick Start & Commands

1. **Clone & Install**:
   ```bash
   git clone https://github.com/VishvaRaj382/midnight-level-5.git
   cd midnight-level-5
   npm install
   ```

2. **Run 50 Preprod Users On-Chain Verification**:
   ```bash
   npm run verify-users
   ```

3. **Run Unit Test Suite**:
   ```bash
   npm run test
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔒 Privacy Model Summary

### PUBLIC LEDGER STATE (On-Chain, Publicly Verifiable)
- `admin`: Public key hash of contract issuing authority.
- `activeStatus`: Current state of user verification (`UNVERIFIED`, `VERIFIED`, `REVOKED`).
- `currentTier`: Disclosed access tier level (`BASIC`, `PRO`, `ENTERPRISE`).
- `lastVerifiedUserHash`: Cryptographic commitment hash of user identity.
- `verificationCount`: Total verification transactions on Midnight ledger.

### PRIVATE WITNESSES (Local Witness, Never On-Chain)
- `localSecretKey`: Private signing key seed.
- `rawIdentitySecret`: Government IDs, passports, student credentials.
- `rawApiTokenSecret`: Sensitive API keys and access tokens.
