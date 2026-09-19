import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum VerificationStatus { UNVERIFIED = 0, ELIGIBLE = 1, INELIGIBLE = 2 }

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  monthlyIncome(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  financialSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  setRequirementThreshold(context: __compactRuntime.CircuitContext<PS>,
                          minIncome_0: bigint,
                          metric_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveIncomeEligibility(context: __compactRuntime.CircuitContext<PS>,
                         minIncome_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  queryVerificationResult(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, VerificationStatus>;
}

export type ProvableCircuits<PS> = {
  setRequirementThreshold(context: __compactRuntime.CircuitContext<PS>,
                          minIncome_0: bigint,
                          metric_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveIncomeEligibility(context: __compactRuntime.CircuitContext<PS>,
                         minIncome_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  queryVerificationResult(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, VerificationStatus>;
}

export type PureCircuits = {
  deriveUserCommitment(sk_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
  deriveFinancialCommitment(income_0: bigint, salt_0: Uint8Array): Uint8Array;
  publicKey(sk_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  deriveUserCommitment(context: __compactRuntime.CircuitContext<PS>,
                       sk_0: Uint8Array,
                       salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveFinancialCommitment(context: __compactRuntime.CircuitContext<PS>,
                            income_0: bigint,
                            salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  publicKey(context: __compactRuntime.CircuitContext<PS>,
            sk_0: Uint8Array,
            salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  setRequirementThreshold(context: __compactRuntime.CircuitContext<PS>,
                          minIncome_0: bigint,
                          metric_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveIncomeEligibility(context: __compactRuntime.CircuitContext<PS>,
                         minIncome_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  queryVerificationResult(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, VerificationStatus>;
}

export type Ledger = {
  readonly admin: Uint8Array;
  readonly verificationCount: bigint;
  readonly activeRequirementThreshold: bigint;
  readonly activeRequirementMetric: Uint8Array;
  readonly lastVerifiedCommitment: Uint8Array;
  readonly lastVerificationResult: VerificationStatus;
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
