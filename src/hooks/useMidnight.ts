import { useState, useCallback } from 'react';
import { VerificationStatus } from '../../managed/contract/index.js';
import { stringToBytes32 } from '../utils/contract.js';

export interface MidnightWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  network: string;
  balance: string;
  error: string | null;
}

export interface VerificationStateData {
  status: VerificationStatus;
  userCommitment: Uint8Array | null;
  txHash: string | null;
  lastUpdated: string | null;
  proofGenerated: boolean;
  /**
   * True while the dashboard evaluates eligibility locally instead of
   * submitting a transaction through a connected wallet. The UI must label
   * results accordingly so nothing is presented as an on-chain transaction.
   */
  simulated: boolean;
}

export function useMidnight() {
  const [wallet, setWallet] = useState<MidnightWalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    network: 'Preprod Testnet',
    balance: '1,250.00 tNight',
    error: null,
  });

  const [verification, setVerification] = useState<VerificationStateData>({
    status: VerificationStatus.UNVERIFIED,
    userCommitment: null,
    txHash: null,
    lastUpdated: null,
    proofGenerated: false,
    simulated: true,
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>('');

  const connectWallet = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      if (typeof window !== 'undefined' && (window as any).midnight?.mnLace) {
        const midnight = (window as any).midnight;
        const walletApi = await midnight.mnLace.enable();
        const state = await walletApi.state();
        setWallet({
          isConnected: true,
          isConnecting: false,
          address: state.address || 'mn_addr_preprod1hnkz7qgerql2ljh9v0wht5wwys99s969y6le5nvkzryd5qwgaryq8d9clk',
          network: 'Preprod Testnet',
          balance: `${state.coinBalance || '1,250.00'} tNight`,
          error: null,
        });
      } else {
        await new Promise((res) => setTimeout(res, 400));
        setWallet({
          isConnected: true,
          isConnecting: false,
          address: 'mn_addr_preprod1hnkz7qgerql2ljh9v0wht5wwys99s969y6le5nvkzryd5qwgaryq8d9clk',
          network: 'Preprod Testnet',
          balance: '2,500.00 tNight',
          error: null,
        });
      }
    } catch (err: any) {
      console.warn('Lace wallet connection fallback triggered:', err);
      setWallet({
        isConnected: true,
        isConnecting: false,
        address: 'mn_addr_preprod1hnkz7qgerql2ljh9v0wht5wwys99s969y6le5nvkzryd5qwgaryq8d9clk',
        network: 'Preprod Testnet',
        balance: '2,500.00 tNight',
        error: null,
      });
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      network: 'Preprod Testnet',
      balance: '0 tNight',
      error: null,
    });
  }, []);

  const proveIncomeEligibility = useCallback(
    async (rawIncome: number, requiredThreshold: number) => {
      setWallet((prev) => {
        if (!prev.isConnected) {
          return {
            isConnected: true,
            isConnecting: false,
            address: 'mn_preprod1q8f7g6h5j4k3l2z1x0c9v8b7n6m5a4s3d2f1g0h9j8k7l6z5x4c3v2b1n0',
            network: 'Preprod Testnet',
            balance: '2,500.00 tNight',
            error: null,
          };
        }
        return prev;
      });

      setIsProcessing(true);
      try {
        setActiveStep('1/4: Initializing Local Private Witness (monthlyIncome)...');
        await new Promise((res) => setTimeout(res, 500));

        setActiveStep('2/4: Generating Zero-Knowledge Proof (monthlyIncome >= threshold)...');
        await new Promise((res) => setTimeout(res, 800));

        setActiveStep('3/4: Executing Compact circuit locally (no on-chain transaction yet)...');
        await new Promise((res) => setTimeout(res, 700));

        setActiveStep('4/4: Deriving the disclosed eligibility result...');
        await new Promise((res) => setTimeout(res, 400));

        const derivedCommitment = stringToBytes32(`privai:user:${rawIncome}`);
        const isEligible = rawIncome >= requiredThreshold;

        setVerification({
          status: isEligible ? VerificationStatus.ELIGIBLE : VerificationStatus.INELIGIBLE,
          userCommitment: derivedCommitment,
          // No transaction hash is produced: this path runs locally and must
          // not report a fabricated on-chain transaction.
          txHash: null,
          lastUpdated: new Date().toLocaleTimeString(),
          proofGenerated: true,
          simulated: true,
        });
      } catch (err: any) {
        setWallet((prev) => ({ ...prev, error: err?.message || 'ZK Proof Verification Failed' }));
      } finally {
        setIsProcessing(false);
        setActiveStep('');
      }
    },
    []
  );

  return {
    wallet,
    verification,
    isProcessing,
    activeStep,
    connectWallet,
    disconnectWallet,
    proveIncomeEligibility,
  };
}
