import type { Ledger } from './managed/contract/index.js';
import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export interface PrivAIPrivateState {
  localSecretKey: Uint8Array;
  monthlyIncome: bigint;
  financialSalt: Uint8Array;
}

export const createPrivAIPrivateState = (
  localSecretKey: Uint8Array,
  monthlyIncome = 0n,
  financialSalt = new Uint8Array(32),
): PrivAIPrivateState => ({
  localSecretKey,
  monthlyIncome,
  financialSalt,
});

export const witnesses = {
  localSecretKey: (context: WitnessContext<Ledger, PrivAIPrivateState>): [PrivAIPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.localSecretKey];
  },
  monthlyIncome: (context: WitnessContext<Ledger, PrivAIPrivateState>): [PrivAIPrivateState, bigint] => {
    return [context.privateState, context.privateState.monthlyIncome];
  },
  financialSalt: (context: WitnessContext<Ledger, PrivAIPrivateState>): [PrivAIPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.financialSalt];
  },
};
