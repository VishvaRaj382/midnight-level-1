/**
 * PrivAI Finance — Preprod wallet funding probe.
 *
 * Synchronises the wallet derived from MIDNIGHT_SEED against Midnight Preprod
 * and prints the real tNIGHT and tDUST balances. This script performs no
 * deployment; it exists so the operator can confirm funding before deploying.
 *
 * Usage:
 *   MIDNIGHT_SEED=<64-hex-seed> npm run check-funds
 */
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { MidnightWalletProvider, createLogger } from '@midnight-ntwrk/testkit-js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { NETWORK_ID, preprodEnvironmentConfiguration, requireSeed } from './network.js';
import { syncWalletBounded } from './wallet-sync.js';

setNetworkId(NETWORK_ID);

const main = async (): Promise<void> => {
  const seed = requireSeed();
  const env = preprodEnvironmentConfiguration();
  const logger = await createLogger('check-funds', 'logs');
  // SECURITY: the testkit logs the wallet seed at info level. Never allow
  // that: force the logger to warn+ so no seed/private material is written
  // to the console or the logs/ directory.
  logger.level = 'warn';

  console.log('==========================================================================');
  console.log('  PrivAI Finance — Midnight Preprod wallet funding probe');
  console.log('==========================================================================');
  console.log(`  Network   : ${env.networkId}`);
  console.log(`  Indexer   : ${env.indexer}`);
  console.log(`  Node      : ${env.node}`);
  console.log('');

  const walletProvider = await MidnightWalletProvider.build(logger, env, seed);
  await walletProvider.start(false);

  const unshieldedAddress = walletProvider.unshieldedKeystore.getBech32Address().asString();
  console.log(`  Wallet address : ${unshieldedAddress}`);

  // A full Preprod sync walks the chain from genesis, which takes far longer
  // than the 90s default used by `testkit-js`.
  const syncTimeoutMs = Number(process.env.MIDNIGHT_SYNC_TIMEOUT_MS ?? 30 * 60 * 1000);
  console.log(`  Sync timeout   : ${Math.round(syncTimeoutMs / 1000)}s`);
  console.log('  Syncing wallet (this can take several minutes)...');

  // The funding probe only needs the unshielded tNIGHT balance; waiting for
  // the shielded replay (~1.5M events) or dust is unnecessary and previously
  // caused an out-of-memory crash. Best-effort read of the dust state below.
  const state = await syncWalletBounded(walletProvider.wallet, syncTimeoutMs, 2_000, 50n, true, true);
  const night = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  const dust = state.dust.balance(new Date());

  console.log(`  tNIGHT balance : ${night.toString()}`);
  console.log(`  tDUST balance  : ${dust.toString()}`);
  console.log('');

  if (night === 0n) {
    console.log('  RESULT: wallet has no tNIGHT. Fund it from the Preprod faucet');
    console.log('          (https://midnight-tmnight-preprod.nethermind.dev/) and retry.');
  } else {
    console.log('  RESULT: wallet is funded and can pay for a contract deployment.');
  }
  console.log('==========================================================================');

  await walletProvider.stop();
};

main().catch((error) => {
  console.error('\nFunding probe failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});