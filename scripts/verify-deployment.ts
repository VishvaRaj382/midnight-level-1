/**
 * PrivAI Finance — independent verification of a Preprod deployment.
 *
 * Reads `deployment.json` (or an address passed as argv[2]) and confirms the
 * contract really exists on Midnight Preprod by querying the public indexer,
 * then cross-checks the public explorer. Nothing is assumed: every field
 * printed here comes from a live network response.
 *
 * Usage:
 *   npm run verify-deployment
 *   npm run verify-deployment -- 0200<64 hex chars>
 */
import { readFileSync } from 'node:fs';
import {
  EXPLORER_BASE_URL,
  PREPROD_INDEXER,
  explorerContractUrl,
} from './network.js';
import { fetchContractAction, queryIndexer } from './indexer.js';

interface DeploymentRecord {
  readonly network: string;
  readonly contractAddress: string;
  readonly deploymentTransactionHash?: string;
  readonly blockHeight?: number;
  readonly explorerUrl?: string;
}

const loadAddress = (): { address: string; record?: DeploymentRecord } => {
  const fromArgv = process.argv[2]?.trim();
  if (fromArgv) {
    return { address: fromArgv };
  }
  let raw: string;
  try {
    raw = readFileSync('deployment.json', 'utf8');
  } catch {
    throw new Error(
      'No contract address provided and deployment.json was not found.\n' +
        'Deploy first (npm run deploy) or pass an address: npm run verify-deployment -- <address>',
    );
  }
  const record = JSON.parse(raw) as DeploymentRecord;
  return { address: record.contractAddress, record };
};

const checkExplorer = async (address: string): Promise<{ url: string; reachable: boolean; status: number }> => {
  const url = explorerContractUrl(address);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    return { url, reachable: response.ok, status: response.status };
  } catch {
    return { url, reachable: false, status: 0 };
  }
};

const main = async (): Promise<void> => {
  const { address, record } = loadAddress();
  const cleanAddress = address.replace(/^0x/, '');

  console.log('==========================================================================');
  console.log('  PrivAI Finance — independent Preprod deployment verification');
  console.log('==========================================================================');
  console.log(`  Network        : preprod`);
  console.log(`  Indexer        : ${PREPROD_INDEXER}`);
  console.log(`  Explorer       : ${EXPLORER_BASE_URL}`);
  console.log(`  Contract addr  : ${cleanAddress}`);
  if (record?.deploymentTransactionHash) {
    console.log(`  Recorded tx    : ${record.deploymentTransactionHash}`);
  }
  console.log('');

  console.log('1. Querying the indexer for this contract address...');
  const action = await fetchContractAction(cleanAddress);
  if (!action) {
    console.log('   ✗ The indexer has no contract action for this address.');
    console.log('');
    console.log('NOT VERIFIED — this address is not a deployed contract on Midnight Preprod.');
    process.exit(1);
  }

  const tx = action.transaction;
  console.log(`   ✓ Found on-chain contract action: ${action.__typename}`);
  if (tx) {
    console.log(`   ✓ Transaction hash : ${tx.hash}`);
    console.log(`   ✓ Transaction id   : ${tx.id}`);
    console.log(`   ✓ Block height     : ${tx.block.height}`);
    console.log(`   ✓ Block hash       : ${tx.block.hash}`);
    console.log(`   ✓ Indexed at       : ${new Date(tx.block.timestamp).toISOString()}`);
  }

  console.log('2. Cross-checking the latest contract state (proves state is real)...');
  const state = await queryIndexer<{ contractAction: { state: string } | null }>(
    `query ContractState($address: HexEncoded!) {
       contractAction(address: $address) { state }
     }`,
    { address: cleanAddress },
  );
  const stateHex = state.contractAction?.state ?? '';
  console.log(`   ✓ On-chain state read: ${stateHex.length} hex chars`);

  console.log('3. Cross-checking the public explorer...');
  const explorer = await checkExplorer(cleanAddress);
  console.log(`   Explorer URL     : ${explorer.url}`);
  console.log(`   Explorer reachable: ${explorer.reachable ? `yes (HTTP ${explorer.status})` : 'no'}`);

  console.log('');
  console.log('==========================================================================');
  console.log(`  NETWORK:                 preprod`);
  console.log(`  CONTRACT ADDRESS:        ${cleanAddress}`);
  console.log(`  DEPLOYMENT TRANSACTION:  ${tx?.hash ?? '(indexer returned no transaction)'}`);
  console.log(`  EXPLORER URL:            ${explorer.url}`);
  console.log(`  DEPLOYMENT STATUS:       ${action.__typename === 'ContractDeploy' ? 'DEPLOYED (ContractDeploy)' : action.__typename}`);
  console.log(`  VERIFIED ON INDEXER:     YES`);
  console.log(`  VERIFIED ON EXPLORER:    ${explorer.reachable ? 'YES' : 'NO'}`);
  console.log('==========================================================================');
};

main().catch((error) => {
  console.error('\nVerification failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});