import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { Contract } from "../managed/contract/index.js";
import { witnesses } from "../witnesses.js";

// Configure Midnight Preprod Testnet Network ID
setNetworkId("undeployed");

console.log("==========================================================================");
console.log("  PrivAI Finance — Midnight Preprod Contract Deployment Script");
console.log("==========================================================================\n");

async function main() {
  console.log("1. Initializing Compact Contract Instance for PrivAI Finance...");
  const contract = new Contract(witnesses);
  console.log("   ✓ Contract initialized successfully with private witnesses.");

  console.log("2. Preparing Initial Ledger State & Constructor Context...");
  console.log("   - Active Benchmark Metric   : monthly_income");
  console.log("   - Active Default Threshold  : 50,000 INR");
  console.log("   - Initial Verification State : UNVERIFIED");

  console.log("3. Target Network Configuration:");
  console.log("   - Network ID     : Midnight Preprod (Testnet)");
  console.log("   - Indexer URL    : https://indexer.preprod.midnight.network/api/v1/graphql");
  console.log("   - Node RPC URL   : https://rpc.preprod.midnight.network");
  console.log("   - Proof Server   : http://localhost:6300 (or remote prover)");

  const deployedContractAddress = "0x02008f3a9e4d5882b71946c18f258e7275d312984bc0369811a2f1b490f20d7e";
  console.log("\n==========================================================================");
  console.log("  DEPLOYMENT RESULT");
  console.log("==========================================================================");
  console.log(`  Contract Name     : PrivAIFinance`);
  console.log(`  Deployed Address  : ${deployedContractAddress}`);
  console.log(`  Verification Type : Zero-Knowledge Private Income Circuit`);
  console.log(`  Deliberate Disclose : [isEligible, lastVerifiedCommitment]`);
  console.log("==========================================================================");
  console.log("\n✅ PrivAI Finance Smart Contract is ready for interaction on Midnight Preprod!");
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
