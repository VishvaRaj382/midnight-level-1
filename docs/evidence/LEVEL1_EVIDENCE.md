# PrivAI Finance — Level 1: Foundation Evidence

## 1. Project Overview & Idea
**PrivAI Finance** is a privacy-preserving financial eligibility verification platform on the Midnight Network. It empowers users to prove that they satisfy a financial requirement (e.g. `monthlyIncome >= 50,000 INR`) to lenders, platforms, DAOs, or employers using zero-knowledge proofs without revealing their underlying sensitive financial figures (e.g., exact salary of `73,500 INR`).

- **Authoritative Cryptography:** Midnight Compact smart contract circuits evaluate conditions locally with private witnesses.
- **Assistive AI Layer:** Natural language requirements are parsed into structured rule schemas without having direct cryptographic or financial control.
- **Selective Disclosure:** Only the boolean outcome (`ELIGIBLE: true/false`), the required benchmark threshold, and the pseudonymous commitment hash are deliberately disclosed on-chain.

---

## 2. Environment Verification
- **Node.js:** `v24.7.0` (compatible with Node 22+ requirements)
- **NPM:** `11.5.1`
- **Docker Engine:** `29.6.2`
- **Compact Runtime:** `@midnight-ntwrk/compact-runtime@0.16.0`
- **Midnight JS Protocol:** `@midnight-ntwrk/midnight-js-protocol@4.1.1`
- **Testing Engine:** `vitest@3.2.7`

---

## 3. Compact Smart Contract Specification
- **Contract Source:** `contracts/privai_finance.compact`
- **Pragma:** `language_version 0.23;`
- **Public Ledger State:**
  - `admin: Bytes<32>`: Administrator / authority key commitment
  - `verificationCount: Counter`: Monotonically increasing verification counter
  - `activeRequirementThreshold: Uint<64>`: Benchmark threshold for eligibility
  - `activeRequirementMetric: Bytes<32>`: Identifier of metric (`monthly_income`)
  - `lastVerifiedCommitment: Bytes<32>`: Pseudonymous user commitment hash
  - `lastVerificationResult: VerificationStatus`: Disclosed eligibility result (`UNVERIFIED | ELIGIBLE | INELIGIBLE`)
- **Private Witnesses:**
  - `localSecretKey(): Bytes<32>`
  - `monthlyIncome(): Uint<64>`
  - `financialSalt(): Bytes<32>`
- **Circuits:**
  - `deriveUserCommitment(sk: Bytes<32>, salt: Bytes<32>): Bytes<32>` (Pure)
  - `deriveFinancialCommitment(income: Uint<64>, salt: Bytes<32>): Bytes<32>` (Pure)
  - `publicKey(sk: Bytes<32>, salt: Bytes<32>): Bytes<32>` (Pure)
  - `proveIncomeEligibility(minIncome: Uint<64>): Boolean` (Impure with deliberate `disclose()`)
  - `setRequirementThreshold(minIncome: Uint<64>, metric: Bytes<32>): []` (Impure with deliberate `disclose()`)
  - `queryVerificationResult(): VerificationStatus` (Impure query)

---

## 4. Test Execution Evidence

```
 RUN  v3.2.7 /Users/VishwaRajSingh/Developer/midnight/midnight-level-1

 ✓ tests/users.test.ts (6 tests) 7ms
 ✓ tests/privai_finance.test.ts (8 tests) 232ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  19:17:19
   Duration  590ms (transform 92ms, setup 0ms, collect 138ms, tests 240ms, environment 0ms, prepare 137ms)
```

### Covered Test Cases:
1. **Circuit Determinism:** Verifies deterministic calculation of user commitment hashes across isolated prover instances.
2. **Eligible Income Proof:** Verifies user with `monthlyIncome = 73,500` against `threshold = 50,000` proves eligibility, updating ledger state to `ELIGIBLE` and incrementing counter.
3. **Ineligible Income Proof:** Verifies user with `monthlyIncome = 35,000` against `threshold = 50,000` correctly reports `INELIGIBLE` without throwing cryptographic faults.
4. **Boundary Condition (Exact Match):** Verifies `monthlyIncome = 50,000` against `threshold = 50,000` evaluates to `ELIGIBLE`.
5. **Boundary Condition (Strict Below):** Verifies `monthlyIncome = 49,999` against `threshold = 50,000` evaluates to `INELIGIBLE`.
6. **ZK Privacy Isolation:** Verifies raw sensitive income (`73,500`), financial salt, and secret key remain strictly confined within local witness state and are NOT present in public ledger serializations.
7. **Requirement Updates:** Verifies authorized state transitions updating benchmark threshold and metric identifiers.
8. **Invalid Input Guard:** Verifies zero/negative thresholds are rejected.

---

## 5. Build Verification Evidence

```
> privai-finance@1.0.0 build
> tsc -b && vite build

vite v6.4.3 building for production...
transforming...
✓ 1623 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                 0.75 kB │ gzip:   0.47 kB
dist/assets/midnight_onchain_runtime_wasm_bg-Bk-cVMvn.wasm  1,333.65 kB │ gzip: 398.88 kB
dist/assets/index-B01js7Zg.css                                 24.47 kB │ gzip:   6.92 kB
dist/assets/index-C5Vgqi_I.js                                 487.12 kB │ gzip:  91.67 kB
✓ built in 2.32s
```
