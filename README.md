# PrivAI Finance — Privacy-Preserving Financial Eligibility Platform

[![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod%20Testnet-cyan?style=for-the-badge&logo=shield)](https://midnight.network)
[![Level 1 Foundation](https://img.shields.io/badge/RiseIn%20Challenge-Level%201%20Passed-emerald?style=for-the-badge)](docs/evidence/LEVEL1_EVIDENCE.md)
[![Compact 0.23](https://img.shields.io/badge/Smart%20Contract-Compact%200.23-purple?style=for-the-badge)](contracts/privai_finance.compact)
[![Tests Passing](https://img.shields.io/badge/Vitest-14%20Passing-brightgreen?style=for-the-badge)](docs/evidence/LEVEL1_EVIDENCE.md)

> **PrivAI Finance** is a zero-knowledge financial eligibility verification platform on the Midnight Network. It enables users to prove they satisfy financial conditions (such as `"Monthly income >= ₹50,000"`) without revealing their exact sensitive financial records to lenders, platforms, DAOs, or employers.

---

## 💡 Problem & Solution

### The Problem
Traditional financial verification requires applicants to submit raw bank statements, payslips, or tax filings containing sensitive figures. Lenders and platforms only need to know: **"Does this applicant meet the eligibility threshold?"**, yet they are forced to store and process full financial histories, creating severe data breach risks, privacy violations, and regulatory compliance burdens.

### The PrivAI Finance Solution
PrivAI Finance replaces raw financial disclosure with zero-knowledge cryptographic proofs on Midnight:
- **Private Witness**: The applicant's actual salary (e.g., `₹73,500`) stays private inside their local machine / wallet.
- **Authoritative Circuit**: The Midnight Compact smart contract executes `monthlyIncome >= requiredThreshold` in zero-knowledge.
- **Selective Disclosure**: The verifier learns **`ELIGIBLE: YES`** with cryptographic finality, but **NEVER** learns the underlying salary figure (`₹73,500`).
- **Assistive AI Layer**: Natural language criteria (e.g. *"Applicants earning at least 50k INR/month"*) are parsed into structured rule schemas without giving AI direct authority over cryptographic verification.

---

## 🔒 Comprehensive Privacy Model

| Dimension | Details |
| :--- | :--- |
| **What is Private** | The applicant's exact income (`monthlyIncome`), private signing key (`localSecretKey`), and financial blinding salt (`financialSalt`). |
| **What is Public** | Active benchmark threshold (`activeRequirementThreshold`), metric identifier (`activeRequirementMetric`), pseudonymous user commitment (`lastVerifiedCommitment`), and verification counter. |
| **What the User Proves** | `monthlyIncome >= activeRequirementThreshold` (e.g. `73,500 >= 50,000`). |
| **What the Verifier Learns** | `ELIGIBLE = YES` (or `NO`), confirmation timestamp, and cryptographic proof validity. |
| **What the Verifier Does NOT Learn** | The user's exact financial figure (e.g., `₹73,500`), bank balance, or identity linkage. |
| **Where Disclosure Happens** | Inside the Compact circuit via deliberate `disclose(isEligible)` and `disclose(userCommitment)`. |
| **Why Zero-Knowledge Proofs?** | Guarantees mathematically that the financial condition was evaluated honestly against real data without leaking the underlying numbers. |

---

## 🤖 AI Safety & Correctness Architecture

AI acts strictly as an assistive parser and **NEVER** controls cryptographic truth or financial eligibility:

```
Natural Language Input ("Monthly income >= ₹50,000")
         │
         ▼
Assistive AI Parser
         │
         ▼
Structured Rule: { metric: "monthly_income", operator: ">=", threshold: 50000, currency: "INR" }
         │
         ▼
Schema & Business-Rule Validation (Strict Type Checking)
         │
         ▼
Midnight Compact Circuit (`proveIncomeEligibility`)
         │
         ▼
Local Zero-Knowledge Proof Generation
         │
         ▼
Authoritative On-Chain Verification & Selective Disclosure
```

---

## 🏗 System Architecture & Contracts

- **Compact Smart Contract:** [`contracts/privai_finance.compact`](contracts/privai_finance.compact)
- **Generated Runtime Bindings:** [`managed/contract/index.d.ts`](managed/contract/index.d.ts) & [`managed/contract/index.js`](managed/contract/index.js)
- **Private Witness Provider:** [`witnesses.ts`](witnesses.ts)
- **Circuit Simulator & Test Suite:** [`tests/privai-simulator.ts`](tests/privai-simulator.ts) & [`tests/privai_finance.test.ts`](tests/privai_finance.test.ts)
- **Evidence Dossier:** [`docs/evidence/LEVEL1_EVIDENCE.md`](docs/evidence/LEVEL1_EVIDENCE.md)

---

## ⚡ Setup & Development

### Prerequisites
- Node.js `v22+` (Tested on Node `v24.7.0`)
- NPM `11+`
- Docker (optional for local proof server)

### Installation
```bash
# Clone the repository
git clone https://github.com/VishvaRaj382/midnight-level-1.git
cd midnight-level-1

# Install dependencies
npm install
```

### Running Tests
```bash
# Run Vitest test suite for Compact circuits & boundary checks
npm test
```

### Building the Project
```bash
# Type check and build frontend & contract assets
npm run build
```

---

## 📊 Level 1 Audit Report

| Requirement | Status | Evidence | Notes |
| :--- | :---: | :--- | :--- |
| **Compact Contract** | ✅ PASS | `contracts/privai_finance.compact` | Clean Compact 0.23 circuit implementation |
| **Public Ledger State** | ✅ PASS | `contracts/privai_finance.compact:28-33` | `threshold`, `metric`, `commitment`, `result` |
| **Private Witnesses** | ✅ PASS | `contracts/privai_finance.compact:44-46` | `monthlyIncome`, `localSecretKey`, `salt` |
| **Deliberate Disclosure** | ✅ PASS | `contracts/privai_finance.compact:70-79` | `disclose(isEligible)`, `disclose(userCommitment)` |
| **Compilation** | ✅ PASS | `npm run build` | Clean TypeScript & Vite compilation (0 errors) |
| **Unit Test Suite** | ✅ PASS | `tests/privai_finance.test.ts` (14/14 passed) | Covers eligible, ineligible, boundary & privacy |
| **Managed Runtime** | ✅ PASS | `managed/contract/` | Official `@midnight-ntwrk/compact-runtime` |
| **Evidence Dossier** | ✅ PASS | `docs/evidence/LEVEL1_EVIDENCE.md` | Recorded terminal outputs & verification specs |
| **Meaningful Commits** | ✅ PASS | `git log` | Progressive milestone commits |

---

## 📄 License
Apache-2.0
