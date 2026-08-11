import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AccessTier { NONE = 0, BASIC = 1, PRO = 2, ENTERPRISE = 3 }

export enum VerificationState { UNVERIFIED = 0, VERIFIED = 1, REVOKED = 2 }

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  rawIdentitySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  rawApiTokenSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  verifyAndGrantAccess(context: __compactRuntime.CircuitContext<PS>,
                       requestedTier_0: AccessTier): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  checkAccessTier(context: __compactRuntime.CircuitContext<PS>,
                  targetTier_0: AccessTier): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  verifyAndGrantAccess(context: __compactRuntime.CircuitContext<PS>,
                       requestedTier_0: AccessTier): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  checkAccessTier(context: __compactRuntime.CircuitContext<PS>,
                  targetTier_0: AccessTier): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
  deriveUserHash(sk_0: Uint8Array, credentialSecret_0: Uint8Array): Uint8Array;
  publicKey(sk_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  deriveUserHash(context: __compactRuntime.CircuitContext<PS>,
                 sk_0: Uint8Array,
                 credentialSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  publicKey(context: __compactRuntime.CircuitContext<PS>,
            sk_0: Uint8Array,
            salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyAndGrantAccess(context: __compactRuntime.CircuitContext<PS>,
                       requestedTier_0: AccessTier): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  checkAccessTier(context: __compactRuntime.CircuitContext<PS>,
                  targetTier_0: AccessTier): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly admin: Uint8Array;
  readonly verificationCount: bigint;
  readonly activeStatus: VerificationState;
  readonly lastVerifiedUserHash: Uint8Array;
  readonly currentTier: AccessTier;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
