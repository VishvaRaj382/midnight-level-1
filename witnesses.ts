import type { Ledger } from './managed/contract/index.js';
import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export interface AIShieldPrivateState {
  localSecretKey: Uint8Array;
  rawIdentitySecret: Uint8Array;
  rawApiTokenSecret: Uint8Array;
}

export const witnesses = {
  localSecretKey: (context: WitnessContext<Ledger, AIShieldPrivateState>): [AIShieldPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.localSecretKey];
  },
  rawIdentitySecret: (context: WitnessContext<Ledger, AIShieldPrivateState>): [AIShieldPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.rawIdentitySecret];
  },
  rawApiTokenSecret: (context: WitnessContext<Ledger, AIShieldPrivateState>): [AIShieldPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.rawApiTokenSecret];
  },
};
