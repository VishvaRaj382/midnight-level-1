import { type EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';

export const NETWORK_ID = 'preprod' as const;

const HTTPS = 'https:';
const WSS = 'wss:';
const HTTP = 'http:';

export const PREPROD_INDEXER =
  process.env.MIDNIGHT_INDEXER ??
  HTTPS + '//indexer.preprod.midnight.network/api/v4/graphql';

export const PREPROD_INDEXER_WS =
  process.env.MIDNIGHT_INDEXER_WS ??
  WSS + '//indexer.preprod.midnight.network/api/v4/graphql/ws';

export const PREPROD_NODE =
  process.env.MIDNIGHT_NODE ??
  HTTPS + '//rpc.preprod.midnight.network';

export const PREPROD_NODE_WS =
  process.env.MIDNIGHT_NODE_WS ??
  WSS + '//rpc.preprod.midnight.network';

export const PREPROD_FAUCET =
  process.env.MIDNIGHT_FAUCET ??
  HTTPS + '//faucet.preprod.midnight.network/';

export const PROOF_SERVER =
  process.env.MIDNIGHT_PROOF_SERVER ??
  HTTP + '//127.0.0.1:6300';

export const EXPLORER_BASE_URL =
  HTTPS + '//explorer.preprod.midnight.network';

export const preprodEnvironmentConfiguration =
  (): EnvironmentConfiguration => ({
    walletNetworkId: NETWORK_ID,
    networkId: NETWORK_ID,
    indexer: PREPROD_INDEXER,
    indexerWS: PREPROD_INDEXER_WS,
    node: PREPROD_NODE,
    nodeWS: PREPROD_NODE_WS,
    faucet: PREPROD_FAUCET,
    proofServer: PROOF_SERVER,
  });

export const requireSeed = (): string => {
  const seed = process.env.MIDNIGHT_SEED?.trim();

  if (!seed) {
    throw new Error(
      'MIDNIGHT_SEED is not set. A funded Preprod wallet is required.'
    );
  }

  if (!/^[0-9a-fA-F]{64}$/.test(seed)) {
    throw new Error(
      `MIDNIGHT_SEED must be 64 hex characters; got ${seed.length} characters.`
    );
  }

  return seed;
};

export const explorerContractUrl = (contractAddress: string): string =>
  `${EXPLORER_BASE_URL}/contract/${contractAddress.replace(/^0x/, '')}`;

export const MANAGED_DIR =
  new URL('../managed/', import.meta.url).pathname;