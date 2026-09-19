/**
 * PrivAI Finance — real Midnight Preprod contract deployment.
 *
 * This script performs an actual on-chain deployment:
 *   1. builds the wallet from MIDNIGHT_SEED and syncs it against Preprod,
 *   2. verifies the wallet holds tNIGHT (and tDUST) so fees can be paid,
 *   3. deploys `managed/contract` through `@midnight-ntwrk/midnight-js-contracts`,
 *   4. waits for the indexer to index the contract,
 *   5. writes the real evidence to `deployment.json`.
 *
 * It never prints or persists a fabricated address: if the deployment fails,
 * the script exits non-zero without writing a record.
 *
 * Usage:
 *   MIDNIGHT_SEED=<64-hex-seed> npm run deploy
 *
 * Prerequisites:
 *   - A proof server reachable at MIDNIGHT_PROOF_SERVER (default
 *     http://127.0.0.1:6300). Example:
 *       docker run -d --name proof-server-local -p 6300:6300 midnightntwrk/proof-server:8.0.3
 *   - A funded Preprod wallet. The Preprod faucet requires a Cloudflare
 *     Turnstile CAPTCHA, so funding must be done manually in a browser at
 *     https://midnight-tmnight-preprod.nethermind.dev/, then the wallet's
 *     master seed exported as MIDNIGHT_SEED.
 */

import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk';
import { firstValueFrom } from 'rxjs';

import {
  MidnightWalletProvider,
  createLogger,
  initializeMidnightProviders,
} from '@midnight-ntwrk/testkit-js';

import * as CompiledPrivAI from '../managed/contract/index.js';
import {
  createPrivAIPrivateState,
  type PrivAIPrivateState,
  witnesses,
} from '../witnesses.js';

import { waitForContractOnChain } from './indexer.js';
import { syncWalletBounded } from './wallet-sync.js';

import {
  MANAGED_DIR,
  NETWORK_ID,
  PROOF_SERVER,
  explorerContractUrl,
  preprodEnvironmentConfiguration,
  requireSeed,
} from './network.js';

setNetworkId(NETWORK_ID);

const PRIVATE_STATE_ID = 'privaiFinancePrivateState';

const SYNC_TIMEOUT_MS = Number(
  process.env.MIDNIGHT_SYNC_TIMEOUT_MS ?? 30 * 60 * 1000,
);

/**
 * Keys of the circuits exported by the compiled PrivAIFinance contract.
 */
type PrivAICircuitKeys = Exclude<
  keyof CompiledPrivAI.Contract<PrivAIPrivateState>['impureCircuits'],
  number | symbol
>;

const compiledContract =
  CompiledContract.make<CompiledPrivAI.Contract<PrivAIPrivateState>>(
    'PrivAIFinance',
    CompiledPrivAI.Contract<PrivAIPrivateState>,
  ).pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets(MANAGED_DIR),
  );

/**
 * Verify that the local proof server is reachable.
 */
const assertProofServerReachable = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${PROOF_SERVER.replace(/\/$/, '')}/health`,
      {
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Proof server is not reachable at ${PROOF_SERVER} (${
        error instanceof Error ? error.message : String(error)
      }).\n` +
        'Start one before deploying, e.g.:\n' +
        '  docker run -d --name proof-server-local -p 6300:6300 midnightntwrk/proof-server:8.0.3',
    );
  }
};

/**
 * Unwraps nested error causes (the wallet SDK wraps node/submission failures
 * in generic "Transaction submission error" shells and hides the real cause).
 */
const describeError = (error: unknown, depth = 0): string => {
  if (!(error instanceof Error) || depth > 4) {
    return String(error);
  }

  const cause = (error as { cause?: unknown }).cause;

  const own = `${error.name}: ${error.message}`;

  return cause instanceof Error
    ? `${own} <- ${describeError(cause, depth + 1)}`
    : own;
};

/**
 * Retries an operation that submits a transaction to the Preprod node.
 * The node's WebSocket occasionally drops mid-submission ("Normal Closure"),
 * which fails the submission even though the node is healthy. Each retry
 * uses a fresh connection.
 */
const withTxRetries = async <T>(
  label: string,
  operation: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      console.warn(
        `   ! ${label} failed (attempt ${attempt}/${maxAttempts}): ${describeError(error)}`,
      );

      if (attempt < maxAttempts) {
        const delayMs = attempt * 5_000;

        console.warn(
          `   ! Retrying in ${Math.round(delayMs / 1000)}s with a fresh connection...`,
        );

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
};

/**
 * After NIGHT UTXOs are registered, DUST accrues as new blocks are produced.
 * It is NOT instant. Deploying immediately fails with
 * `InsufficientFunds: could not balance dust`.
 *
 * This polls ONLY the dedicated DUST wallet state rather than the complete
 * WalletFacade state. This avoids repeatedly constructing shielded,
 * unshielded, DUST, and pending-transaction state on a low-memory machine.
 */
const waitForDustAccrual = async (
  wallet: WalletFacade,
  timeoutMs: number,
  intervalMs = 15_000,
): Promise<bigint> => {
  const deadline = Date.now() + timeoutMs;
  const startedAt = Date.now();

  while (Date.now() < deadline) {
    try {
      const state = await firstValueFrom(wallet.state());
      const dustBalance = state.dust.balance(new Date());

      const registeredCount = state.unshielded.availableCoins.filter(
        (coin) =>
          coin.utxo.type === unshieldedToken().raw &&
          coin.meta.registeredForDustGeneration,
      ).length;

      const waitedSec = Math.round((Date.now() - startedAt) / 1000);

      console.log(
        `   … waiting for tDUST (${waitedSec}s elapsed; ` +
          `registered NIGHT UTXOs: ${registeredCount}; ` +
          `tDUST balance: ${dustBalance.toString()})`,
      );

      if (dustBalance > 0n) {
        return dustBalance;
      }
    } catch (error) {
      console.warn(
        `   ! Dust poll hiccup (will retry): ${describeError(error).slice(0, 200)}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `No tDUST accrued within ${Math.round(timeoutMs / 1000)}s of registration. ` +
      'Re-run `npm run deploy` — registered NIGHT keeps generating dust between runs.',
  );
};


const main = async (): Promise<void> => {
  const seed = requireSeed();

  const env = preprodEnvironmentConfiguration();

  const logger = await createLogger('deploy', 'logs');

  // SECURITY: the testkit logs the wallet seed at info level. Never allow
  // that: force the logger to warn+ so no seed/private material is written
  // to the console or the logs/ directory.
  logger.level = 'warn';

  console.log(
    '==========================================================================',
  );
  console.log(
    '  PrivAI Finance — Midnight Preprod contract deployment',
  );
  console.log(
    '==========================================================================',
  );

  console.log(`  Network      : ${env.networkId}`);
  console.log(`  Indexer      : ${env.indexer}`);
  console.log(`  Node RPC     : ${env.node}`);
  console.log(`  Proof server : ${env.proofServer}`);
  console.log(
    '  Contract     : contracts/privai_finance.compact (managed/)',
  );
  console.log('');

  console.log('1. Checking proof server...');

  await assertProofServerReachable();

  console.log('   ✓ Proof server healthy.');

  console.log(
    '2. Building and syncing wallet from MIDNIGHT_SEED...',
  );

  const walletProvider = await MidnightWalletProvider.build(
    logger,
    env,
    seed,
  );

  await walletProvider.start(false);

  const walletAddress =
    walletProvider.unshieldedKeystore
      .getBech32Address()
      .asString();

  console.log(`   Wallet address: ${walletAddress}`);

  // Deployment requires a synced unshielded tNIGHT state (pays fees).
  // Dust is NOT gated on: a fresh wallet legitimately has no dust yet.
  // The existing flow below registers NIGHT UTXOs for dust generation
  // when dustBalance = 0.
  //
  // Shielded sync is likewise not gated because fresh seeds replay
  // approximately 1.5M events.
  const state = await syncWalletBounded(
    walletProvider.wallet,
    SYNC_TIMEOUT_MS,
    2_000,
    50n,
    true,
    true,
  );

  const nightBalance =
    state.unshielded.balances[unshieldedToken().raw] ?? 0n;

  const dustBalance = state.dust.balance(new Date());

  console.log(`   tNIGHT balance: ${nightBalance.toString()}`);
  console.log(`   tDUST balance : ${dustBalance.toString()}`);

  if (nightBalance === 0n) {
    throw new Error(
      [
        'Wallet has no tNIGHT, so the deployment cannot be paid for.',
        '',
        'Manual step required:',
        '  1. Visit https://midnight-tmnight-preprod.nethermind.dev/',
        '  2. Complete the CAPTCHA and drip tNIGHT to:',
        `     ${walletAddress}`,
        '  3. Re-run the deployment.',
      ].join('\n'),
    );
  }

  if (dustBalance === 0n) {
    console.log(
      '3. No tDUST yet — registering NIGHT UTXOs for dust generation...',
    );

    const unregistered =
      state.unshielded.availableCoins.filter(
        (coin) =>
          coin.utxo.type === unshieldedToken().raw &&
          !coin.meta.registeredForDustGeneration,
      );

    if (unregistered.length === 0) {
      console.log(
        '   ✓ All NIGHT UTXOs are already registered for DUST generation.',
      );

      console.log(
        '   … Waiting for actual spendable tDUST to accrue...',
      );

      const accrued = await waitForDustAccrual(
        walletProvider.wallet,
        SYNC_TIMEOUT_MS,
      );

      console.log(
        `   ✓ tDUST available: ${accrued.toString()}`,
      );
    } else {
      const recipe =
        await walletProvider.wallet.registerNightUtxosForDustGeneration(
          unregistered,
          walletProvider.unshieldedKeystore.getPublicKey(),
          (payload) =>
            walletProvider.unshieldedKeystore.signData(payload),
        );

      const finalized =
        await walletProvider.wallet.finalizeRecipe(recipe);

      const dustTxId = await withTxRetries(
        'Dust registration submission',
        () =>
          walletProvider.wallet.submitTransaction(finalized),
      );

      console.log(
        `   ✓ Dust registration submitted: ${dustTxId}`,
      );

      console.log(
        '   … Waiting for tDUST to accrue from registered NIGHT (new blocks required)...',
      );

      const accrued = await waitForDustAccrual(
        walletProvider.wallet,
        SYNC_TIMEOUT_MS,
      );

      console.log(
        `   ✓ tDUST available: ${accrued.toString()}`,
      );
    }
  }

  console.log(
    '4. Deploying PrivAIFinance contract to Preprod...',
  );

  const providers =
    initializeMidnightProviders<
      PrivAICircuitKeys,
      PrivAIPrivateState
    >(walletProvider, env, {
      privateStateStoreName: 'privai-finance-deploy',
      zkConfigPath: MANAGED_DIR,
    });

  const deployed = await deployContract(providers, {
    compiledContract,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: createPrivAIPrivateState(
      randomBytes(32),
    ),
  });

  const contractAddress =
    deployed.deployTxData.public.contractAddress;

  const txId = deployed.deployTxData.public.txId;

  const txHash = deployed.deployTxData.public.txHash;

  const blockHeight =
    deployed.deployTxData.public.blockHeight;

  console.log('');

  console.log(
    '==========================================================================',
  );
  console.log('  DEPLOYMENT SUBMITTED');
  console.log(
    '==========================================================================',
  );

  console.log(`  Contract address : ${contractAddress}`);
  console.log(`  Transaction id   : ${txId}`);
  console.log(`  Transaction hash : ${txHash}`);
  console.log(`  Block height     : ${blockHeight}`);

  console.log(
    '==========================================================================',
  );

  console.log(
    '5. Waiting for the indexer to index the contract (this can take a few minutes)...',
  );

  const onChain =
    await waitForContractOnChain(contractAddress).catch(
      (error: unknown) => {
        throw new Error(
          `Deployment was submitted (tx ${txHash}) but the indexer has not indexed ${contractAddress} yet. ` +
            `(${
              error instanceof Error
                ? error.message
                : String(error)
            }) ` +
            'Re-run `npm run verify-deployment` in a few minutes; do not publish the address until it is indexed.',
        );
      },
    );

  const record = {
    network: NETWORK_ID,
    contractName: 'PrivAIFinance',

    contractAddress,

    deploymentTransactionId: txId,
    deploymentTransactionHash: txHash,

    blockHeight:
      onChain.transaction?.block.height ??
      blockHeight,

    blockHash:
      onChain.transaction?.block.hash ??
      null,

    indexedAt: onChain.transaction?.block.timestamp
      ? new Date(
          onChain.transaction.block.timestamp,
        ).toISOString()
      : null,

    actionType: onChain.__typename,

    deployedBy: walletAddress,

    indexer: env.indexer,

    explorerUrl:
      explorerContractUrl(contractAddress),

    source: 'scripts/deploy.ts',

    deployedAt: new Date().toISOString(),
  };

  writeFileSync(
    'deployment.json',
    `${JSON.stringify(record, null, 2)}\n`,
  );

  // Keep the DApp's contract information identical to the deployed contract:
  // the frontend reads this JSON file directly.
  writeFileSync(
    'src/config/deployment.json',
    `${JSON.stringify(record, null, 2)}\n`,
  );

  console.log(
    `   ✓ Indexed on-chain as ${onChain.__typename}.`,
  );

  console.log(
    '   ✓ Evidence written to deployment.json and src/config/deployment.json',
  );

  await walletProvider.stop();
};

main().catch((error) => {
  console.error('\nDeployment failed:');
  console.error(describeError(error));
  process.exit(1);
});