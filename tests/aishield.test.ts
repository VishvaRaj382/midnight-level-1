import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { AIShieldSimulator } from "./aishield-simulator.js";
import { AccessTier, VerificationState } from "../managed/contract/index.js";

setNetworkId("undeployed");

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

describe("AIShield Smart Contract Tests", () => {
  // Test Requirement 1: Circuit Determinism
  it("Circuit logic: computes deterministic user hash and public key commitment", () => {
    const sk = randomBytes(32);
    const cred = randomBytes(32);
    const apiToken = randomBytes(32);

    const sim1 = new AIShieldSimulator(sk, cred, apiToken);
    const sim2 = new AIShieldSimulator(sk, cred, apiToken);

    const hash1 = sim1.deriveUserHash(sk, cred);
    const hash2 = sim2.deriveUserHash(sk, cred);

    expect(hash1).toBeDefined();
    expect(hash1.length).toBe(32);
    expect(hash1).toEqual(hash2);
  });

  // Test Requirement 2: State Transitions & Verification
  it("State transitions: grants access tier and transitions ledger from UNVERIFIED to VERIFIED", () => {
    const sk = randomBytes(32);
    const cred = randomBytes(32);
    const apiToken = randomBytes(32);

    const sim = new AIShieldSimulator(sk, cred, apiToken);

    // Verify initial ledger state
    const initialLedger = sim.getLedger();
    expect(initialLedger.activeStatus).toBe(VerificationState.UNVERIFIED);
    expect(initialLedger.currentTier).toBe(AccessTier.NONE);
    expect(initialLedger.verificationCount).toBe(1n);

    // Execute ZK verification for PRO tier
    const userHash = sim.verifyAndGrantAccess(AccessTier.PRO);

    const updatedLedger = sim.getLedger();
    expect(updatedLedger.activeStatus).toBe(VerificationState.VERIFIED);
    expect(updatedLedger.currentTier).toBe(AccessTier.PRO);
    expect(updatedLedger.lastVerifiedUserHash).toEqual(userHash);
    expect(updatedLedger.verificationCount).toBe(2n);

    // Verify tier check
    expect(sim.checkAccessTier(AccessTier.PRO)).toBe(true);
    expect(sim.checkAccessTier(AccessTier.BASIC)).toBe(false);
  });

  // Test Requirement 3: ZK Privacy Isolation
  it("Privacy: raw identity secret and API token remain local private witnesses and are never exposed on-chain", () => {
    const sk = randomBytes(32);
    const cred = randomBytes(32);
    const apiToken = randomBytes(32);

    const sim = new AIShieldSimulator(sk, cred, apiToken);
    sim.verifyAndGrantAccess(AccessTier.ENTERPRISE);

    const ledgerState = sim.getLedger();
    const privateState = sim.getPrivateState();

    // Verify private state holds raw secrets
    expect(privateState.rawIdentitySecret).toEqual(cred);
    expect(privateState.rawApiTokenSecret).toEqual(apiToken);

    // Verify on-chain ledger contains only hashes/enums and never raw secrets
    expect(ledgerState.lastVerifiedUserHash).not.toEqual(cred);
    expect(ledgerState.lastVerifiedUserHash).not.toEqual(apiToken);

    const ledgerString = JSON.stringify(ledgerState, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    expect(ledgerString).not.toContain(Buffer.from(cred).toString("hex"));
    expect(ledgerString).not.toContain(Buffer.from(apiToken).toString("hex"));
  });

  // Test Requirement 4: Revocation Flow
  it("Revocation: allows authorized user to revoke active verification status", () => {
    const sk = randomBytes(32);
    const cred = randomBytes(32);
    const apiToken = randomBytes(32);

    const sim = new AIShieldSimulator(sk, cred, apiToken);
    sim.verifyAndGrantAccess(AccessTier.BASIC);

    expect(sim.getLedger().activeStatus).toBe(VerificationState.VERIFIED);

    // Perform revocation
    sim.revokeAccess();

    const revokedLedger = sim.getLedger();
    expect(revokedLedger.activeStatus).toBe(VerificationState.REVOKED);
    expect(revokedLedger.currentTier).toBe(AccessTier.NONE);
  });

  // Test Requirement 5: Security Constraints & Safeguards
  it("Security: prevents access grant with invalid tier (NONE)", () => {
    const sk = randomBytes(32);
    const cred = randomBytes(32);
    const apiToken = randomBytes(32);

    const sim = new AIShieldSimulator(sk, cred, apiToken);

    expect(() => sim.verifyAndGrantAccess(AccessTier.NONE)).toThrow(
      "Invalid access tier requested"
    );
  });
});
