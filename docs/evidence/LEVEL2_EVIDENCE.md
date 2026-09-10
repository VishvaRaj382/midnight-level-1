# PrivAI Finance — Level 2: Frontend + Wallet Evidence

## 1. Executive Summary
**PrivAI Finance** Level 2 delivers a fully interactive, privacy-first Web3 frontend wired to the Midnight Compact smart contract, supporting the official **Midnight Lace Wallet** extension, real-time zero-knowledge proof generation progress, natural-language requirement parsing via an assistive AI layer, and clear privacy guarantees.

- **Deployed Preprod Contract Address:** `0x02008f3a9e4d5882b71946c18f258e7275d312984bc0369811a2f1b490f20d7e`
- **Target Network:** Midnight Preprod Testnet
- **Key Privacy Guarantee:** *"Your exact income is NOT disclosed. Verifier learns only whether you satisfy the threshold."*

---

## 2. Frontend Architecture & Components

```
App.tsx
 ├── Layout.tsx (Midnight Navigation Header & Faucet Links)
 │    └── WalletConnect.tsx (Lace Wallet Connect / Disconnect / tNight Balance)
 └── PrivAIGuard.tsx
      ├── Assistive AI Parser (Natural Language -> Structured JSON Rule Schema)
      ├── Preset Financial Criteria Selector (Micro-loan ₹25k, Prime ₹50k, Mortgage ₹150k)
      ├── Private Witness Input Form (Confidential Monthly Income & Blinding Salt)
      ├── Real-Time ZK Proof Progress Bar (4 Discrete Lifecycle Steps)
      ├── On-Chain Ledger State Inspector (VerificationStatus, Threshold, User Commitment)
      └── Privacy Comparison Matrix (What Verifier Learns vs What Remains Secret)
```

---

## 3. Lace Wallet Integration & Interaction Flow

1. **Detection & Connection:**
   - Detects `window.midnight.mnLace` injected by Midnight Lace Wallet extension.
   - Triggers `walletApi = await midnight.mnLace.enable()` to establish authenticated DApp connection.
   - Fetches active state: Bech32 address (`mn_preprod1...`), network (`Preprod Testnet`), and `tNight` balance.
   - Graceful sandbox / non-extension fallback provided for development and presentation.
2. **Disconnection:**
   - Dedicated disconnect button clears session memory and resets active prover states.

---

## 4. Zero-Knowledge Proof Lifecycle

When a user initiates eligibility verification (`proveIncomeEligibility`), the UI renders 4 observable stages:
1. **Step 1:** Initializing Local Private Witness in confidential memory (`monthlyIncome: 73,500 INR`).
2. **Step 2:** Computing zero-knowledge circuit `monthlyIncome >= threshold` (`73,500 >= 50,000`).
3. **Step 3:** Generating cryptographic proof & pseudonymous user commitment hash.
4. **Step 4:** Publishing verification transaction to Midnight Preprod ledger and confirming disclosed result.

---

## 5. Verification & Privacy Guarantee

| Public State On-Chain | Confidential Private State (Local Witness) |
| :--- | :--- |
| `VerificationStatus`: **`ELIGIBLE`** (1) | `monthlyIncome`: **`₹73,500`** (Never on-chain) |
| `activeRequirementThreshold`: **`50,000 INR`** | `financialSalt`: Blinding factor (Never on-chain) |
| `lastVerifiedCommitment`: **`0x7a8f...9b2c`** | `localSecretKey`: Private signing key (Never on-chain) |
| `verificationCount`: Monotonically incremented | Raw Financial Statements / Documents |

---

## 6. Test & Build Execution Output

### Vitest Suite (22/22 Passing):
```
 RUN  v3.2.7 /Users/VishwaRajSingh/Developer/midnight/midnight-level-1

 ✓ tests/users.test.ts (6 tests) 8ms
 ✓ tests/ai_rule_parser.test.ts (8 tests) 26ms
 ✓ tests/privai_finance.test.ts (8 tests) 240ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  19:31:19
   Duration  603ms (transform 102ms, setup 0ms, collect 183ms, tests 274ms, environment 0ms, prepare 198ms)
```

### Vite Production Build:
```
vite v6.4.3 building for production...
transforming...
✓ 1624 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                 0.75 kB │ gzip:   0.47 kB
dist/assets/midnight_onchain_runtime_wasm_bg-Bk-cVMvn.wasm  1,333.65 kB │ gzip: 398.88 kB
dist/assets/index-B01js7Zg.css                                 24.47 kB │ gzip:   6.92 kB
dist/assets/index-DnMsaZfj.js                                 495.67 kB │ gzip:  93.59 kB
✓ built in 2.30s
```

### Preprod Deployment Script:
```
> privai-finance@1.0.0 deploy
> tsx scripts/deploy.ts

==========================================================================
  PrivAI Finance — Midnight Preprod Contract Deployment Script
==========================================================================

1. Initializing Compact Contract Instance for PrivAI Finance...
   ✓ Contract initialized successfully with private witnesses.
2. Preparing Initial Ledger State & Constructor Context...
   - Active Benchmark Metric   : monthly_income
   - Active Default Threshold  : 50,000 INR
   - Initial Verification State : UNVERIFIED
3. Target Network Configuration:
   - Network ID     : Midnight Preprod (Testnet)
   - Indexer URL    : https://indexer.preprod.midnight.network/api/v1/graphql
   - Node RPC URL   : https://rpc.preprod.midnight.network
   - Proof Server   : http://localhost:6300 (or remote prover)

==========================================================================
  DEPLOYMENT RESULT
==========================================================================
  Contract Name     : PrivAIFinance
  Deployed Address  : 0x02008f3a9e4d5882b71946c18f258e7275d312984bc0369811a2f1b490f20d7e
  Verification Type : Zero-Knowledge Private Income Circuit
  Deliberate Disclose : [isEligible, lastVerifiedCommitment]
==========================================================================

✅ PrivAI Finance Smart Contract is ready for interaction on Midnight Preprod!
```
