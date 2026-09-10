import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { PrivAISimulator } from "./privai-simulator.js";
import { VerificationStatus } from "../managed/contract/index.js";

setNetworkId("undeployed");

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

function pad32(str: string): Uint8Array {
  const buf = new Uint8Array(32);
  const enc = new TextEncoder().encode(str);
  buf.set(enc.subarray(0, 32));
  return buf;
}

describe("PrivAI Finance Smart Contract Tests (Level 1 Foundation)", () => {
  // Requirement 1: Circuit Determinism
  it("Circuit logic: computes deterministic user commitment hash", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const income = 73500n;

    const sim1 = new PrivAISimulator(sk, income, salt);
    const sim2 = new PrivAISimulator(sk, income, salt);

    const commitment1 = sim1.deriveUserCommitment(sk, salt);
    const commitment2 = sim2.deriveUserCommitment(sk, salt);

    expect(commitment1).toBeDefined();
    expect(commitment1.length).toBe(32);
    expect(commitment1).toEqual(commitment2);
  });

  // Requirement 2: Eligible Income Verification Flow
  it("Eligible income: proves monthlyIncome (73,500) >= threshold (50,000) and marks ledger as ELIGIBLE", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const actualIncome = 73500n;
    const requiredMinIncome = 50000n;

    const sim = new PrivAISimulator(sk, actualIncome, salt);

    // Check initial state
    const initialLedger = sim.getLedger();
    expect(initialLedger.lastVerificationResult).toBe(VerificationStatus.UNVERIFIED);
    expect(initialLedger.verificationCount).toBe(1n);

    // Execute ZK eligibility proof
    const isEligible = sim.proveIncomeEligibility(requiredMinIncome);

    expect(isEligible).toBe(true);

    const updatedLedger = sim.getLedger();
    expect(updatedLedger.lastVerificationResult).toBe(VerificationStatus.ELIGIBLE);
    expect(updatedLedger.activeRequirementThreshold).toBe(50000n);
    expect(updatedLedger.verificationCount).toBe(2n);
    expect(updatedLedger.lastVerifiedCommitment).toEqual(sim.deriveUserCommitment(sk, salt));

    // Query circuit returns ELIGIBLE
    expect(sim.queryVerificationResult()).toBe(VerificationStatus.ELIGIBLE);
  });

  // Requirement 3: Ineligible Income Verification Flow
  it("Ineligible income: proves monthlyIncome (35,000) < threshold (50,000) and marks ledger as INELIGIBLE", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const actualIncome = 35000n;
    const requiredMinIncome = 50000n;

    const sim = new PrivAISimulator(sk, actualIncome, salt);

    const isEligible = sim.proveIncomeEligibility(requiredMinIncome);

    expect(isEligible).toBe(false);

    const updatedLedger = sim.getLedger();
    expect(updatedLedger.lastVerificationResult).toBe(VerificationStatus.INELIGIBLE);
    expect(updatedLedger.verificationCount).toBe(2n);
    expect(sim.queryVerificationResult()).toBe(VerificationStatus.INELIGIBLE);
  });

  // Requirement 4: Boundary Condition Verification
  it("Boundary conditions: handles exact threshold (50,000 == 50,000) as ELIGIBLE and (49,999 < 50,000) as INELIGIBLE", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const threshold = 50000n;

    // Test exact match: 50,000
    const exactSim = new PrivAISimulator(sk, 50000n, salt);
    expect(exactSim.proveIncomeEligibility(threshold)).toBe(true);
    expect(exactSim.getLedger().lastVerificationResult).toBe(VerificationStatus.ELIGIBLE);

    // Test just below: 49,999
    const belowSim = new PrivAISimulator(sk, 49999n, salt);
    expect(belowSim.proveIncomeEligibility(threshold)).toBe(false);
    expect(belowSim.getLedger().lastVerificationResult).toBe(VerificationStatus.INELIGIBLE);
  });

  // Requirement 5: ZK Privacy Isolation (Raw income never on-chain)
  it("Privacy guarantee: raw financial income (73,500) and salt remain local private witnesses and are NEVER in public ledger", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const secretIncome = 73500n;
    const requiredThreshold = 50000n;

    const sim = new PrivAISimulator(sk, secretIncome, salt);
    sim.proveIncomeEligibility(requiredThreshold);

    const ledgerState = sim.getLedger();
    const privateState = sim.getPrivateState();

    // Verify private state holds raw secrets
    expect(privateState.monthlyIncome).toBe(secretIncome);
    expect(privateState.financialSalt).toEqual(salt);
    expect(privateState.localSecretKey).toEqual(sk);

    // Verify public ledger does NOT contain raw income value
    const ledgerString = JSON.stringify(ledgerState, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    expect(ledgerString).not.toContain("73500");
    expect(ledgerString).not.toContain(Buffer.from(salt).toString("hex"));
    expect(ledgerString).not.toContain(Buffer.from(sk).toString("hex"));

    // Public ledger only contains requirement threshold (50000) and boolean outcome (ELIGIBLE)
    expect(ledgerState.activeRequirementThreshold).toBe(50000n);
    expect(ledgerState.lastVerificationResult).toBe(VerificationStatus.ELIGIBLE);
  });

  // Requirement 6: Requirement Updates & State Transitions
  it("State transitions: allows updating active requirement threshold and metric", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const sim = new PrivAISimulator(sk, 120000n, salt);

    const newThreshold = 100000n;
    const newMetric = pad32("annual_bonus");

    sim.setRequirementThreshold(newThreshold, newMetric);

    const updatedLedger = sim.getLedger();
    expect(updatedLedger.activeRequirementThreshold).toBe(100000n);
    expect(updatedLedger.activeRequirementMetric).toEqual(newMetric);
    expect(updatedLedger.verificationCount).toBe(2n);

    // Now test eligibility against updated threshold
    expect(sim.proveIncomeEligibility(100000n)).toBe(true);
    expect(sim.getLedger().lastVerificationResult).toBe(VerificationStatus.ELIGIBLE);
  });

  // Requirement 7: Invalid Zero Threshold Rejection
  it("Security validation: rejects zero or negative threshold in proof and requirement update circuits", () => {
    const sk = randomBytes(32);
    const salt = randomBytes(32);
    const sim = new PrivAISimulator(sk, 75000n, salt);

    expect(() => sim.proveIncomeEligibility(0n)).toThrow("Minimum income threshold must be positive");
    expect(() => sim.setRequirementThreshold(0n, pad32("income"))).toThrow("Threshold must be greater than zero");
  });

  // Requirement 8: Multiple Independent User Verifications
  it("Multi-user isolation: processes verification for multiple distinct users independently", () => {
    const skAlice = randomBytes(32);
    const saltAlice = randomBytes(32);
    const simAlice = new PrivAISimulator(skAlice, 85000n, saltAlice);

    const skBob = randomBytes(32);
    const saltBob = randomBytes(32);
    const simBob = new PrivAISimulator(skBob, 30000n, saltBob);

    expect(simAlice.proveIncomeEligibility(50000n)).toBe(true);
    expect(simAlice.getLedger().lastVerificationResult).toBe(VerificationStatus.ELIGIBLE);

    expect(simBob.proveIncomeEligibility(50000n)).toBe(false);
    expect(simBob.getLedger().lastVerificationResult).toBe(VerificationStatus.INELIGIBLE);

    expect(simAlice.getLedger().lastVerifiedCommitment).not.toEqual(simBob.getLedger().lastVerifiedCommitment);
  });
});
