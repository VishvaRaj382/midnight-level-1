# PrivAI Finance — Product Proposal & Technical Architecture

## 1. Executive Summary
**PrivAI Finance** is a privacy-first financial eligibility verification platform built on the Midnight Network. It addresses a fundamental flaw in modern decentralized and centralized finance: applicants are required to disclose sensitive, granular financial figures (e.g., salary amounts, bank balances, tax statements) simply to prove that they satisfy a high-level threshold condition (e.g., `Monthly income >= ₹50,000`).

Using Midnight's Compact smart contracts, zero-knowledge proofs, and an assistive AI requirement parser, PrivAI Finance enables applicants to prove eligibility with mathematical certainty while keeping their exact financial numbers 100% confidential.

---

## 2. Problem Statement & Market Need

### Current Financial Verification Landscape:
- **Data Honeypots:** Financial platforms, lenders, and DAOs aggregate unencrypted income and balance statements, exposing users to catastrophic data breaches and identity theft.
- **Over-Disclosure:** To prove `Income >= ₹50,000`, a user earning `₹73,500` or `₹250,000` must expose their exact earnings, spending habits, and banking relationships.
- **Regulatory Burden:** Institutions storing sensitive personal financial information (PFI) face stringent compliance mandates (GDPR, CCPA, RBI guidelines) and heavy liabilities.

### The PrivAI Finance Solution:
PrivAI Finance shifts the paradigm from **"Data Transmission"** to **"Zero-Knowledge Proof Verification"**:
1. **Applicant** generates a ZK proof locally on their client using private witnesses.
2. **Midnight Blockchain** executes the Compact circuit to verify that `monthlyIncome >= activeRequirementThreshold`.
3. **Verifier** receives a cryptographically authenticated boolean result: **`ELIGIBLE = YES`**.
4. **Zero-Knowledge Guarantee:** The verifier **never** learns the applicant's exact salary figure.

---

## 3. Product Architecture

```
                                  USER PRIVACY BOUNDARY
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                                                                                        │
 │   User Input (Private Witness)               Assistive AI Requirement Parser           │
 │   • monthlyIncome = 73,500 INR               • Prompt: "Monthly income >= 50k INR"     │
 │   • financialSalt = 0x8a1f...                • Structured Rule:                        │
 │   • localSecretKey = 0x4c2b...                 { metric: "monthly_income",             │
 │                                                  operator: ">=", threshold: 50000,    │
 │                                                  currency: "INR" }                     │
 │                                                                                        │
 │                                   │                                                    │
 │                                   ▼                                                    │
 │                    Compact Zero-Knowledge Circuit                                      │
 │                  `proveIncomeEligibility(minIncome)`                                   │
 │                                   │                                                    │
 └───────────────────────────────────┼────────────────────────────────────────────────────┘
                                     │
                                     ▼ (Deliberate Selective Disclosure)
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                                                                                        │
 │                             PUBLIC MIDNIGHT LEDGER                                     │
 │                                                                                        │
 │   • activeRequirementThreshold : 50,000 INR                                            │
 │   • lastVerifiedCommitment     : 0x7a8f...9b2c (Pseudonymous User Hash)                │
 │   • lastVerificationResult     : ELIGIBLE (1)                                          │
 │   • verificationCount          : Incremented Counter                                   │
 │                                                                                        │
 │   VERIFIER LEARNS: ELIGIBLE = YES                                                      │
 │   VERIFIER NEVER LEARNS: 73,500 INR                                                    │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Assistive AI Safety Architecture

AI serves as an assistive bridge for natural language criteria formulation and **never** has direct control over financial eligibility or cryptographic truth:
1. **Natural Language Parser:** Translates informal human descriptions into typed JSON schemas.
2. **Schema & Boundary Validator:** Enforces strict regex, metric constraints, and positive numeric ranges. Malformed or adversarial rules are rejected before circuit execution.
3. **Authoritative Midnight Circuit:** The zero-knowledge Compact contract is the sole arbiter of truth.

---

## 5. Target User Personas & Use Cases

1. **Undercollateralized Lending Protocols:** Lenders verify borrower income stability without taking custody of private financial records.
2. **DAO Contributor Grants:** DAOs set eligibility thresholds for governance grants or bounties while maintaining contributor pseudonymity.
3. **Enterprise Employment Verification:** High-income verification for rental agreements, vehicle leases, or executive memberships.
4. **Regulatory KYC/AML Tiers:** Compliance checks without storing PII/PFI in centralized databases.

---

## 6. Implementation & Progression Roadmap

- **Level 1 (Foundation):** Compact 0.23 smart contract, private witnesses, deliberate disclosure, vitest suite, managed bindings. [COMPLETED]
- **Level 2 (Frontend + Wallet):** Midnight Lace wallet integration, interactive prover UI, multi-step progress, AI rule parser. [COMPLETED]
- **Level 3 (Production-Grade dApp):** Automated CI/CD pipeline, comprehensive testing, product proposal, UX polish. [CURRENT]
- **Level 4 (MVP + Preprod + Product Identity):** Preprod network deployment, product identity assets, end-to-end demo flow.
- **Level 5 (Real Users & Feedback Loop):** Preprod community user testing, documented feedback analysis, iterative UX improvements.
- **Level 6 (Launch / Mainnet):** Launch-ready documentation, security checklist, and final presentation.
