/**
 * PrivAI Finance — frontend view of the Midnight Preprod deployment.
 *
 * IMPORTANT: this file is generated from real deployment evidence.
 * `scripts/deploy.ts` overwrites it with the address, transaction hash and
 * block height returned by an actual on-chain deployment, and
 * `scripts/verify-deployment.ts` re-checks those values against the public
 * Preprod indexer and explorer.
 *
 * While `DEPLOYMENT` is `null` the DApp has NO live contract and must not
 * claim one. Do not hand-write an address here.
 */
import generatedDeployment from './deployment.json' with { type: 'json' };

export interface DeploymentRecord {
  /** 'preprod' */
  readonly network: 'preprod';
  /** 'PrivAIFinance' */
  readonly contractName: string;
  /** Contract address returned by the deployment transaction. */
  readonly contractAddress: string;
  /** Transaction id of the deployment transaction. */
  readonly deploymentTransactionId: string;
  /** Transaction hash of the deployment transaction. */
  readonly deploymentTransactionHash: string;
  /** Block height in which the deployment was included. */
  readonly blockHeight: number | null;
  /** ISO timestamp of the block in which the deployment was indexed. */
  readonly indexedAt: string | null;
  /** Public explorer page for the contract. */
  readonly explorerUrl: string;
  /** ISO timestamp at which the deployment script recorded this entry. */
  readonly deployedAt: string;
  /** Deployer Bech32 wallet address */
  readonly deployedBy?: string;
  /** Midnight undeployed token address */
  readonly tokenAddress?: string;
  /** Shielded preview address */
  readonly shieldedAddress?: string;
  /** Container seed identifier */
  readonly containerId?: string;
}

export const DEPLOYMENT: DeploymentRecord | null = generatedDeployment as unknown as DeploymentRecord | null;

/** True only once a real Preprod deployment has been recorded. */
export const isDeployed = (): boolean => DEPLOYMENT !== null;

/** Short, display-safe rendering of the contract address. */
export const shortContractAddress = (): string => {
  if (!DEPLOYMENT) return 'not deployed';
  const value = DEPLOYMENT.contractAddress;
  return value.length <= 18 ? value : `${value.slice(0, 10)}...${value.slice(-6)}`;
};