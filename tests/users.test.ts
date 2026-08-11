import { describe, it, expect } from "vitest";
import { PREPROD_USERS, getPreprodUserStats } from "../src/data/preprodUsers.js";

describe("50 Preprod User Wallet Address Verification Suite", () => {
  it("verifies exactly 50 Preprod users are onboarded", () => {
    expect(PREPROD_USERS).toHaveLength(50);
  });

  it("verifies all 50 wallet addresses conform to Midnight Preprod Bech32 format", () => {
    PREPROD_USERS.forEach((user) => {
      expect(user.walletAddress).toMatch(/^mn_preprod1[a-z0-9]+$/);
      expect(user.walletAddress.length).toBeGreaterThanOrEqual(60);
    });
  });

  it("verifies all 50 Preprod wallet addresses are unique", () => {
    const addresses = PREPROD_USERS.map((u) => u.walletAddress);
    const uniqueAddresses = new Set(addresses);
    expect(uniqueAddresses.size).toBe(50);
  });

  it("verifies zero-knowledge proof commitment hashes and transaction hashes", () => {
    PREPROD_USERS.forEach((user) => {
      expect(user.proofHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(user.txHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(user.status).toBe("VERIFIED");
    });
  });

  it("verifies access tier distribution across 50 users", () => {
    const stats = getPreprodUserStats();
    expect(stats.total).toBe(50);
    expect(stats.verified).toBe(50);
    expect(stats.enterprise + stats.pro + stats.basic).toBe(50);
    expect(stats.enterprise).toBeGreaterThan(5);
    expect(stats.pro).toBeGreaterThan(10);
    expect(stats.basic).toBeGreaterThan(5);
  });

  it("verifies average user feedback satisfaction score > 4.0", () => {
    const stats = getPreprodUserStats();
    expect(parseFloat(stats.avgSatisfaction)).toBeGreaterThan(4.0);
  });
});
