/**
 * Minimal GraphQL client for the Midnight Preprod indexer.
 *
 * Used by the deployment and verification scripts to read the *real* on-chain
 * state of a contract address. There is no mock/simulated path here.
 */
import { PREPROD_INDEXER } from './network.js';

export interface IndexerContractAction {
  readonly __typename: 'ContractDeploy' | 'ContractUpdate' | 'ContractCall' | string;
  readonly address: string;
  readonly transaction: {
    readonly id: number;
    readonly hash: string;
    readonly block: {
      readonly height: number;
      readonly hash: string;
      readonly timestamp: number;
    };
  } | null;
}

const CONTRACT_ACTION_QUERY = `
  query ContractAction($address: HexEncoded!) {
    contractAction(address: $address) {
      __typename
      address
      transaction {
        id
        hash
        block {
          height
          hash
          timestamp
        }
      }
    }
  }
`;

const CONTRACT_DEPLOY_QUERY = `
  query ContractDeploy($address: HexEncoded!) {
    contractAction(address: $address) {
      __typename
      address
      ... on ContractDeploy {
        state
        transaction {
          id
          hash
          block {
            height
            hash
            timestamp
          }
        }
      }
    }
  }
`;

export const queryIndexer = async <T>(
  query: string,
  variables: Record<string, unknown> = {},
  indexerUrl: string = PREPROD_INDEXER,
): Promise<T> => {
  const response = await fetch(indexerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Indexer request failed: HTTP ${response.status} ${response.statusText}`);
  }

  const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (body.errors?.length) {
    throw new Error(`Indexer returned errors: ${body.errors.map((e) => e.message).join('; ')}`);
  }
  if (body.data === undefined) {
    throw new Error('Indexer returned no data.');
  }
  return body.data;
};

/**
 * Looks up the latest contract action for `address`.
 * Returns `null` when the indexer has never seen the address — which is the
 * check that distinguishes a real deployment from a fabricated address.
 */
export const fetchContractAction = async (
  address: string,
  indexerUrl: string = PREPROD_INDEXER,
): Promise<IndexerContractAction | null> => {
  const data = await queryIndexer<{ contractAction: IndexerContractAction | null }>(
    CONTRACT_ACTION_QUERY,
    { address: address.replace(/^0x/, '') },
    indexerUrl,
  );
  return data.contractAction;
};

/** Waits until the indexer reports the contract, or throws after `timeoutMs`. */
export const waitForContractOnChain = async (
  address: string,
  { timeoutMs = 10 * 60 * 1000, intervalMs = 5_000, indexerUrl = PREPROD_INDEXER } = {},
): Promise<IndexerContractAction> => {
  const deadline = Date.now() + timeoutMs;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const action = await fetchContractAction(address, indexerUrl);
      if (action) {
        return action;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(
    `Contract ${address} was not found on the Preprod indexer within ${timeoutMs}ms.` +
      (lastError ? ` Last indexer error: ${lastError}` : ''),
  );
};

export { CONTRACT_DEPLOY_QUERY };